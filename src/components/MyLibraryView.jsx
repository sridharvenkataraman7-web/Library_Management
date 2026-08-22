import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Clock,
  BookmarkCheck,
  History,
  RotateCcw,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  User
} from "lucide-react";

export const MyLibraryView = () => {
  const {
    studentProfile,
    studentLoans,
    books,
    wishlist,
    toggleWishlist,
    cancelReservation,
    renewLoan,
    returnBookLoan,
    reserveBook,
    setSelectedBook,
    setMapTargetBook,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveSubTab] = useState("borrowed"); // "borrowed" | "reservations" | "wishlist" | "history"

  // Active reservations for Alex Morgan
  const myReservations = books.filter((b) =>
    (b.queue || []).some((q) => q.studentId === studentProfile.id)
  );

  // Wishlist books objects
  const wishlistBooks = books.filter((b) => wishlist.includes(b.id));

  // Past Reading History mock items
  const readingHistory = [
    {
      id: "HIST-01",
      title: "Clean Code",
      author: "Robert C. Martin",
      coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
      returnDate: "2026-07-28",
      ratingGiven: 5
    },
    {
      id: "HIST-02",
      title: "Zero to One",
      author: "Peter Thiel",
      coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
      returnDate: "2026-06-15",
      ratingGiven: 4
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Student Profile Header Header Card */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center text-white ring-4 ring-purple-500/30 shrink-0 shadow-lg">
            <User className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{studentProfile.name}</h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                {studentProfile.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{studentProfile.department} • {studentProfile.year}</p>
          </div>
        </div>

        {/* Quick Stats Pill Counters */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Borrowed</span>
            <p className="text-lg font-extrabold text-white">{studentLoans.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Reservations</span>
            <p className="text-lg font-extrabold text-purple-400">{myReservations.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Wishlist</span>
            <p className="text-lg font-extrabold text-white">{wishlist.length}</p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSubTab("borrowed")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "borrowed"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Currently Borrowed ({studentLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("reservations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "reservations"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Reservations ({myReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("wishlist")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "wishlist"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("history")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "history"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Reading History</span>
        </button>
      </div>

      {/* SUB-TAB 1: BORROWED BOOKS */}
      {activeTab === "borrowed" && (
        <div className="space-y-4">
          {studentLoans.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No active book loans</h3>
              <p className="text-xs text-slate-400">Explore the catalogue to reserve and borrow books.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={loan.coverUrl}
                      alt={loan.bookTitle}
                      className="w-16 h-24 object-cover rounded-xl shadow-md shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-white truncate">{loan.bookTitle}</h3>
                      <p className="text-xs text-slate-400">{loan.author}</p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 text-slate-300 border border-zinc-800">
                          Borrowed: {loan.issuedDate}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/30">
                          Due: {loan.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Progress */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => renewLoan(loan.id)}
                      className="flex-1 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Renew Loan (14 Days)</span>
                    </button>

                    <button
                      onClick={() => returnBookLoan(loan.id)}
                      className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all"
                    >
                      Return to Desk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ACTIVE RESERVATIONS QUEUE */}
      {activeTab === "reservations" && (
        <div className="space-y-4">
          {myReservations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No active book reservations</h3>
              <p className="text-xs text-slate-400">Search the catalogue to place a hold on unavailable books.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myReservations.map((book) => {
                const queueList = book.queue || [];
                const myPosIndex = queueList.findIndex((q) => q.studentId === studentProfile.id);
                const queuePos = myPosIndex !== -1 ? myPosIndex + 1 : 1;

                return (
                  <div
                    key={book.id}
                    className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-14 h-20 object-cover rounded-xl shadow shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{book.title}</h3>
                          <p className="text-xs text-slate-400 truncate">{book.author}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-mono text-purple-400 font-bold">📍 Shelf {book.shelf}</span>
                            <span className="text-[11px] text-slate-400">Est Return: {book.estReturnDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="p-3 rounded-2xl bg-purple-950 border border-purple-500/30 text-center">
                          <span className="text-[10px] text-purple-300 uppercase font-bold">Queue Rank</span>
                          <p className="text-lg font-extrabold text-white">#{queuePos}</p>
                        </div>

                        <button
                          onClick={() => cancelReservation(book.id)}
                          className="py-2.5 px-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                        >
                          Cancel Hold
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: WISHLIST */}
      {activeTab === "wishlist" && (
        <div className="space-y-4">
          {wishlistBooks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Your wishlist is empty</h3>
              <p className="text-xs text-slate-400">Click the bookmark icon on any book card to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-2xl glass-card border-zinc-800 space-y-3 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-2">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full aspect-[3/4] object-cover rounded-xl shadow"
                    />
                    <h4 className="text-xs font-bold text-white line-clamp-1">{book.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                  </div>
                  <button
                    onClick={() => reserveBook(book.id)}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                  >
                    Reserve Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: READING HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {readingHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img src={item.coverUrl} alt={item.title} className="w-10 h-14 object-cover rounded shadow" />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400">{item.author}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Returned: {item.returnDate}</p>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-400 font-mono">
                {"⭐".repeat(item.ratingGiven)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
