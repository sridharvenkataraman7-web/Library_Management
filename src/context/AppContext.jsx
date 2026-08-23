import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_BOOKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENT_LOANS,
  INITIAL_WISHLIST,
  INITIAL_STUDENT,
  INITIAL_LIBRARIAN
} from "../data/mockData";

const AppContext = createContext();

const API_BASE = "/api";

// ─── JWT helpers ─────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("smartlib_token");
const setToken = (t) => localStorage.setItem("smartlib_token", t);
const clearToken = () => localStorage.removeItem("smartlib_token");

const apiHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ─── Auth step types ──────────────────────────────────────────────────────────
// "email"  → enter Gmail
// "otp"    → enter 6-digit code
// "done"   → authenticated

export const AppProvider = ({ children }) => {
  // ── Auth State ──────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [authView, setAuthView] = useState("signin"); // "signin" | "register"
  const [authStep, setAuthStep] = useState("email"); // "email" | "otp" | "done"
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingRole, setPendingRole] = useState("student");
  const [otpCooldown, setOtpCooldown] = useState(0); // seconds remaining
  const [devOtp, setDevOtp] = useState(""); // only in dev mode (no Gmail configured)

  // ── Persona & View Navigation ───────────────────────────────────────────────
  const [persona, setPersona] = useState(() => {
    try {
      const saved = localStorage.getItem("smartlib_persona");
      return saved || "student";
    } catch { return "student"; }
  });
  const [activeTab, setActiveTab] = useState("dashboard");

  // ── Student & Librarian Profiles ────────────────────────────────────────────
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("smartlib_current_student");
      return saved ? JSON.parse(saved) : INITIAL_STUDENT;
    } catch { return INITIAL_STUDENT; }
  });
  const [librarianProfile] = useState(INITIAL_LIBRARIAN);

  // ── Countdown timer for OTP resend cooldown ─────────────────────────────────
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  // ── Sync persona to localStorage ────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("smartlib_persona", persona);
  }, [persona]);

  useEffect(() => {
    localStorage.setItem("smartlib_current_student", JSON.stringify(studentProfile));
  }, [studentProfile]);

  // ── Register new account ────────────────────────────────────────────────────
  const registerUser = async ({ name, email, role, department }) => {
    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim(), role, department }),
      });
      const data = await res.json();
      if (!data.success) {
        setAuthError(data.message || "Registration failed.");
        if (data.alreadyExists) setAuthView("signin");
        return false;
      }
      setAuthSuccess(`Account created! Sign in with ${email.trim()}.`);
      setAuthView("signin");
      return true;
    } catch {
      setAuthError("Cannot reach the server. Make sure the backend is running.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  const sendOtp = async (email) => {
    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setAuthError(data.message || "Failed to send OTP.");
        if (data.cooldownRemaining) setOtpCooldown(data.cooldownRemaining);
        if (data.notRegistered) setAuthView("register");
        return false;
      }

      setPendingEmail(email.trim());
      // Role comes from the backend user store
      if (data.userRole) setPendingRole(data.userRole);
      setOtpCooldown(60);
      setAuthStep("otp");

      if (data.devMode && data.devOtp) {
        setDevOtp(data.devOtp);
        setAuthSuccess(`[Dev Mode] OTP: ${data.devOtp}`);
      } else {
        setDevOtp("");
        setAuthSuccess(`OTP sent to ${email.trim()}. Check your Gmail inbox.`);
      }
      return true;
    } catch {
      setAuthError("Cannot reach the server. Make sure the backend is running.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────────
  const verifyOtp = async (otp) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp: otp.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setAuthError(data.message || "Incorrect OTP.");
        if (data.locked || data.expired) setAuthStep("email");
        return false;
      }

      // ✅ Authenticated — store token and build profile
      setToken(data.token);
      const user = data.user;

      if (user.role === "librarian") {
        setPersona("librarian");
        setActiveTab("librarian-dashboard");
      } else {
        setPersona("student");
        setActiveTab("dashboard");
        setStudentProfile((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          id: user.id,
        }));
      }

      setIsAuthenticated(true);
      setAuthStep("done");
      setDevOtp("");
      setAuthError("");
      setAuthSuccess("");
      setPendingEmail("");
      return true;
    } catch (err) {
      setAuthError("Cannot reach the server. Make sure the backend is running.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const resendOtp = () => sendOtp(pendingEmail);

  // ── Legacy demo quick-login (bypasses OTP for demo personas) ─────────────────
  const quickDemoLogin = (role) => {
    const demoProfile = role === "librarian" ? INITIAL_LIBRARIAN : INITIAL_STUDENT;
    setPersona(role);
    if (role === "librarian") {
      setActiveTab("librarian-dashboard");
    } else {
      setStudentProfile(demoProfile);
      setActiveTab("dashboard");
    }
    // Store a demo token flag
    localStorage.setItem("smartlib_token", "demo_token_" + role);
    setIsAuthenticated(true);
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: apiHeaders(),
      });
    } catch { /* ignore */ }
    clearToken();
    setIsAuthenticated(false);
    setAuthStep("email");
    setAuthError("");
    setAuthSuccess("");
    setDevOtp("");
    setPendingEmail("");
  };

  // ── Registered Users (legacy compatibility) ──────────────────────────────────
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("smartlib_users");
    return saved ? JSON.parse(saved) : [INITIAL_STUDENT];
  });

  const signup = (userData) => {
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existing) return { success: false, message: "An account with this email already exists." };

    const newUser = {
      id: userData.studentId || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name,
      email: userData.email,
      department: userData.department || "Computer Science & AI",
      year: "1st Year Undergraduate",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      borrowedCount: 0,
      maxLoans: 5,
      finesDue: "$0.00",
      joinDate: "Aug 2026"
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setStudentProfile(newUser);
    setIsAuthenticated(true);
    setPersona("student");
    setActiveTab("dashboard");
    return { success: true, message: "Account created!" };
  };

  // ── State Collections ─────────────────────────────────────────────────────────
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("smartlib_books");
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("smartlib_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [studentLoans, setStudentLoans] = useState(() => {
    const saved = localStorage.getItem("smartlib_loans");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_LOANS;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("smartlib_wishlist");
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  // Modals & Navigation Selections
  const [selectedBook, setSelectedBook] = useState(null);
  const [mapTargetBook, setMapTargetBook] = useState(null);
  const [radarTargetBook, setRadarTargetBook] = useState(null);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem("smartlib_books", JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem("smartlib_notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("smartlib_loans", JSON.stringify(studentLoans)); }, [studentLoans]);
  useEffect(() => { localStorage.setItem("smartlib_wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("smartlib_users", JSON.stringify(registeredUsers)); }, [registeredUsers]);

  // ── Persona Switch ────────────────────────────────────────────────────────────
  const switchPersona = (role) => {
    setPersona(role);
    setActiveTab(role === "librarian" ? "librarian-dashboard" : "dashboard");
  };

  // ── Student Actions ───────────────────────────────────────────────────────────
  const reserveBook = (bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === bookId) {
          const currentQueue = b.queue || [];
          const alreadyInQueue = currentQueue.some((q) => q.studentId === studentProfile.id);
          if (alreadyInQueue) return b;
          const queuePos = currentQueue.length + 1;
          const updatedQueue = [
            ...currentQueue,
            {
              studentId: studentProfile.id,
              name: `YOU (${studentProfile.name})`,
              reservedDate: new Date().toISOString().split("T")[0],
              estReturn: new Date(Date.now() + queuePos * 3 * 86400000).toISOString().split("T")[0],
            },
          ];
          return { ...b, status: b.availableCopies > 0 ? "Reserved" : "Checked Out", queue: updatedQueue };
        }
        return b;
      })
    );
    const targetBook = books.find((b) => b.id === bookId);
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: "Reservation Logged Successfully!",
        message: `You reserved '${targetBook?.title}'. We'll notify you when it's ready.`,
        bookId,
        bookTitle: targetBook?.title || "Book",
        type: "RESERVATION_CONFIRMED",
        timestamp: "Just now",
        isRead: false,
      },
      ...prev,
    ]);
  };

  const cancelReservation = (bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === bookId) {
          const updatedQueue = (b.queue || []).filter((q) => q.studentId !== studentProfile.id);
          return { ...b, queue: updatedQueue, status: updatedQueue.length === 0 && b.availableCopies > 0 ? "Available" : b.status };
        }
        return b;
      })
    );
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}`, title: "Reservation Cancelled", message: "Your reservation has been removed.", bookId, type: "RESERVATION_CANCELLED", timestamp: "Just now", isRead: false },
      ...prev,
    ]);
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prev) => prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]);
  };

  const renewLoan = (loanId) => {
    setStudentLoans((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          const newDueDate = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
          return { ...loan, dueDate: newDueDate, daysLeft: loan.daysLeft + 7 };
        }
        return loan;
      })
    );
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}`, title: "Loan Renewal Extended", message: "Your loan was extended by 7 days.", type: "LOAN_RENEWED", timestamp: "Just now", isRead: false },
      ...prev,
    ]);
  };

  const returnBookLoan = (loanId) => {
    const loan = studentLoans.find((l) => l.id === loanId);
    setStudentLoans((prev) => prev.filter((l) => l.id !== loanId));
    if (loan) {
      setBooks((prevBooks) =>
        prevBooks.map((b) => {
          if (b.id === loan.bookId) {
            const newAvail = b.availableCopies + 1;
            return { ...b, availableCopies: newAvail, status: b.queue?.length > 0 ? "Reserved" : "Available" };
          }
          return b;
        })
      );
    }
  };

  // ── Notification Actions ──────────────────────────────────────────────────────
  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };
  const clearAllNotifications = () => setNotifications([]);

  // ── Librarian Actions ─────────────────────────────────────────────────────────
  const addBook = (newBookData) => {
    const createdBook = {
      id: `BK-${Date.now()}`,
      ...newBookData,
      rating: 4.5,
      reviewsCount: 1,
      availableCopies: Number(newBookData.totalCopies),
      totalCopies: Number(newBookData.totalCopies),
      status: "Available",
      queue: [],
      tags: [newBookData.category.toLowerCase(), newBookData.department.toLowerCase()],
    };
    setBooks((prev) => [createdBook, ...prev]);
    setNotifications((prev) => [
      { id: `NOTIF-${Date.now()}`, title: "New Book Added", message: `'${createdBook.title}' is now on ${createdBook.floor}, ${createdBook.shelf}.`, type: "CATALOGUE_UPDATE", timestamp: "Just now", isRead: false },
      ...prev,
    ]);
  };

  const updateBook = (bookId, updatedFields) => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, ...updatedFields } : b)));
  };

  const deleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const updateReservationStatus = (bookId, studentId, action) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === bookId) {
          if (action === "MARK_COLLECTED") {
            const updatedQueue = (b.queue || []).filter((q) => q.studentId !== studentId);
            return { ...b, availableCopies: Math.max(0, b.availableCopies - 1), queue: updatedQueue, status: b.availableCopies - 1 > 0 ? "Available" : "Checked Out" };
          }
          if (action === "CANCEL") {
            const updatedQueue = (b.queue || []).filter((q) => q.studentId !== studentId);
            return { ...b, queue: updatedQueue, status: updatedQueue.length === 0 ? "Available" : "Reserved" };
          }
        }
        return b;
      })
    );
    const targetBook = books.find((b) => b.id === bookId);
    if (action === "MARK_AVAILABLE") {
      setNotifications((prev) => [
        { id: `NOTIF-${Date.now()}`, title: "Your reserved book is ready!", message: `'${targetBook?.title}' is ready for pickup at Counter #1.`, bookId, type: "BOOK_AVAILABLE", pickupDeadline: "Tomorrow 17:00", pickupLocation: "Central Library Counter #1", timestamp: "Just now", isRead: false },
        ...prev,
      ]);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        // Auth
        isAuthenticated,
        authView,
        setAuthView,
        authStep,
        setAuthStep,
        authLoading,
        authError,
        authSuccess,
        setAuthError,
        setAuthSuccess,
        pendingEmail,
        pendingRole,
        setPendingRole,
        otpCooldown,
        devOtp,
        registerUser,
        sendOtp,
        verifyOtp,
        resendOtp,
        quickDemoLogin,
        logout,
        signup,
        // Personas & Navigation
        persona,
        switchPersona,
        activeTab,
        setActiveTab,
        // Profiles
        studentProfile,
        librarianProfile,
        // Books & State
        books,
        notifications,
        unreadNotifCount,
        studentLoans,
        wishlist,
        // Modals
        selectedBook,
        setSelectedBook,
        mapTargetBook,
        setMapTargetBook,
        radarTargetBook,
        setRadarTargetBook,
        isAddBookOpen,
        setIsAddBookOpen,
        editingBook,
        setEditingBook,
        globalSearch,
        setGlobalSearch,
        // Actions
        reserveBook,
        cancelReservation,
        toggleWishlist,
        renewLoan,
        returnBookLoan,
        markNotificationRead,
        clearAllNotifications,
        addBook,
        updateBook,
        deleteBook,
        updateReservationStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
