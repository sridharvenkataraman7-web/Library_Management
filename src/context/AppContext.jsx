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

export const AppProvider = ({ children }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("librax_auth");
    return savedAuth ? JSON.parse(savedAuth) : false;
  });

  // Persona & View Navigation
  const [persona, setPersona] = useState("student"); // "student" | "librarian"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Registered Users Registry with localStorage fallback
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("librax_users");
    return saved
      ? JSON.parse(saved)
      : [
          {
            email: "alex.morgan@campus.edu",
            name: "Alex Morgan",
            id: "STU-2024-8842",
            department: "Computer Science & AI",
            year: "3rd Year Undergraduate",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
            borrowedCount: 2,
            maxLoans: 5,
            finesDue: "$0.00",
            joinDate: "Sept 2023"
          }
        ];
  });

  const [studentProfile, setStudentProfile] = useState(() => {
    const savedProf = localStorage.getItem("librax_current_student");
    return savedProf ? JSON.parse(savedProf) : INITIAL_STUDENT;
  });

  const [librarianProfile] = useState(INITIAL_LIBRARIAN);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("librax_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem("librax_current_student", JSON.stringify(studentProfile));
  }, [studentProfile]);

  const login = (email, password, role = "student") => {
    if (role === "student") {
      const userMatch = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (userMatch) {
        setStudentProfile(userMatch);
      } else {
        const formattedName = email.split("@")[0].replace(".", " ");
        setStudentProfile({
          id: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
          email: email,
          department: "Computer Science & AI",
          year: "1st Year Undergraduate",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          borrowedCount: 0,
          maxLoans: 5,
          finesDue: "$0.00",
          joinDate: "Aug 2026"
        });
      }
    }
    setIsAuthenticated(true);
    setPersona(role);
    if (role === "librarian") {
      setActiveTab("librarian-dashboard");
    } else {
      setActiveTab("dashboard");
    }
  };

  const signup = (userData) => {
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existing) {
      return {
        success: false,
        message: "An account with this email address already exists. Please sign in instead."
      };
    }

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

    return {
      success: true,
      message: "Account created successfully! Welcome to SmartLib."
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };



  // State Collections with localStorage fallback
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("librax_books");
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("librax_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [studentLoans, setStudentLoans] = useState(() => {
    const saved = localStorage.getItem("librax_loans");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_LOANS;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("librax_wishlist");
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
  useEffect(() => {
    localStorage.setItem("librax_books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("librax_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("librax_loans", JSON.stringify(studentLoans));
  }, [studentLoans]);

  useEffect(() => {
    localStorage.setItem("librax_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Persona Switch Handler
  const switchPersona = (role) => {
    setPersona(role);
    if (role === "librarian") {
      setActiveTab("librarian-dashboard");
    } else {
      setActiveTab("dashboard");
    }
  };

  // Student Actions
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
              estReturn: new Date(Date.now() + queuePos * 3 * 86400000).toISOString().split("T")[0]
            }
          ];

          return {
            ...b,
            status: b.availableCopies > 0 ? "Reserved" : "Checked Out",
            queue: updatedQueue
          };
        }
        return b;
      })
    );

    // Create Notification
    const targetBook = books.find((b) => b.id === bookId);
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: "Reservation Logged Successfully!",
      message: `You reserved '${targetBook?.title}'. We'll notify you when it's ready at Counter Desk.`,
      bookId,
      bookTitle: targetBook?.title || "Book",
      type: "RESERVATION_CONFIRMED",
      timestamp: "Just now",
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const cancelReservation = (bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === bookId) {
          const updatedQueue = (b.queue || []).filter((q) => q.studentId !== studentProfile.id);
          return {
            ...b,
            queue: updatedQueue,
            status: updatedQueue.length === 0 && b.availableCopies > 0 ? "Available" : b.status
          };
        }
        return b;
      })
    );

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: "Reservation Cancelled",
      message: `Your reservation for the book has been removed.`,
      bookId,
      type: "RESERVATION_CANCELLED",
      timestamp: "Just now",
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
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
      {
        id: `NOTIF-${Date.now()}`,
        title: "Loan Renewal Extended",
        message: "Your loan period was successfully extended by 7 days.",
        type: "LOAN_RENEWED",
        timestamp: "Just now",
        isRead: false
      },
      ...prev
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
            const hasQueue = b.queue && b.queue.length > 0;
            return {
              ...b,
              availableCopies: newAvail,
              status: hasQueue ? "Reserved" : "Available"
            };
          }
          return b;
        })
      );
    }
  };

  // Notification actions
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Librarian Actions
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
      tags: [newBookData.category.toLowerCase(), newBookData.department.toLowerCase()]
    };
    setBooks((prev) => [createdBook, ...prev]);

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: "New Book Added to Catalogue",
        message: `'${createdBook.title}' is now available on ${createdBook.floor}, ${createdBook.shelf}.`,
        type: "CATALOGUE_UPDATE",
        timestamp: "Just now",
        isRead: false
      },
      ...prev
    ]);
  };

  const updateBook = (bookId, updatedFields) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, ...updatedFields } : b))
    );
  };

  const deleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const updateReservationStatus = (bookId, studentId, action) => {
    // Action: "MARK_AVAILABLE" | "MARK_COLLECTED" | "CANCEL"
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === bookId) {
          if (action === "MARK_COLLECTED") {
            const updatedQueue = (b.queue || []).filter((q) => q.studentId !== studentId);
            return {
              ...b,
              availableCopies: Math.max(0, b.availableCopies - 1),
              queue: updatedQueue,
              status: b.availableCopies - 1 > 0 ? "Available" : "Checked Out"
            };
          }
          if (action === "CANCEL") {
            const updatedQueue = (b.queue || []).filter((q) => q.studentId !== studentId);
            return {
              ...b,
              queue: updatedQueue,
              status: updatedQueue.length === 0 ? "Available" : "Reserved"
            };
          }
        }
        return b;
      })
    );

    const targetBook = books.find((b) => b.id === bookId);
    if (action === "MARK_AVAILABLE") {
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          title: "Your reserved book is now available!",
          message: `'${targetBook?.title}' is ready for pickup at Counter Desk #1.`,
          bookId,
          bookTitle: targetBook?.title,
          type: "BOOK_AVAILABLE",
          pickupDeadline: "Tomorrow 17:00",
          pickupLocation: "Central Library Counter #1",
          timestamp: "Just now",
          isRead: false
        },
        ...prev
      ]);
    }
  };

  // Helper getters
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        persona,
        switchPersona,
        activeTab,
        setActiveTab,
        books,
        notifications,
        unreadNotifCount,
        studentLoans,
        wishlist,
        studentProfile,
        librarianProfile,
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
        updateReservationStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => useContext(AppContext);
