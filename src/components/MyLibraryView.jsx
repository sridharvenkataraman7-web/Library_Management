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
      <div className="p-6 rounded-3xl glass-panel border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white ring-4 ring-indigo-500/30 shrink-0 shadow-lg">
            <User className="w-7 h-7" />
          </div>
          <div className="min-w-0">

            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{studentProfile.name}</h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {studentProfile.id}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{studentProfile.department} • {studentProfile.year}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Joined: {studentProfile.joinDate} | Max Allowance: 5 Books</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Borrowed</span>
            <span className="text-xl font-extrabold text-indigo-400">{studentLoans.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Reservations</span>
            <span className="text-xl font-extrabold text-amber-400">{myReservations.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Fines</span>
            <span className="text-xl font-extrabold text-emerald-400">{studentProfile.finesDue}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("borrowed")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "borrowed"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Currently Borrowed ({studentLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("reservations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "reservations"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Reservations ({myReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("wishlist")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "wishlist"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Wishlist ({wishlistBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("history")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === "history"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Reading History</span>
        </button>
      </div>

      {/* Tab 1: Currently Borrowed */}
      {activeTab === "borrowed" && (
        <div className="space-y-4">
          {studentLoans.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-card border-slate-800 text-slate-500 text-xs">
              You have no active borrowed books currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-5 rounded-3xl glass-card border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={loan.coverUrl}
                      alt={loan.bookTitle}
                      className="w-20 h-28 object-cover rounded-xl shadow shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {loan.id}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">{loan.bookTitle}</h3>
                      <p className="text-xs text-slate-400 truncate">{loan.author}</p>

                      <div className="pt-2 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>Borrowed: {loan.borrowedDate}</span>
                          <span className="font-bold text-rose-400">Due: {loan.dueDate}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (loan.daysLeft / 14) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-indigo-400 font-semibold block text-right">
                          {loan.daysLeft} days remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => renewLoan(loan.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Renew +7 Days</span>
                    </button>

                    <button
                      onClick={() => returnBookLoan(loan.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Return at Desk</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Reservations & Queue Visualizer */}
      {activeTab === "reservations" && (
        <div className="space-y-4">
          {myReservations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-card border-slate-800 text-slate-500 text-xs">
              No active queue reservations.
            </div>
          ) : (
            <div className="space-y-4">
              {myReservations.map((book) => {
                const queueList = book.queue || [];
                const myIndex = queueList.findIndex((q) => q.studentId === studentProfile.id);
                const queuePos = myIndex + 1;

                return (
                  <div
                    key={book.id}
                    className="p-6 rounded-3xl glass-card border-amber-500/20 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-16 h-22 object-cover rounded-xl shadow shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-white truncate">{book.title}</h3>
                          <p className="text-xs text-slate-400 truncate">{book.author}</p>
                          <p className="text-[11px] text-indigo-400 font-mono mt-1">📍 Location: {book.floor}, Shelf {book.shelf}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 w-full md:w-auto">
                        <span className="px-4 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-extrabold">
                          You are #{queuePos} in the Queue
                        </span>
                        <span className="text-[11px] text-slate-400">Est. Waiting Time: ~{queuePos * 3} Days</span>
                      </div>
                    </div>

                    {/* Horizontal Visual Queue Visualization */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Anonymous Reservation Queue Visualization
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto py-2">
                        {queueList.map((q, idx) => {
                          const isYou = q.studentId === studentProfile.id;
                          return (
                            <React.Fragment key={idx}>
                              <div
                                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 shrink-0 ${
                                  isYou
                                    ? "bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/30"
                                    : "bg-slate-900 text-slate-300 border border-slate-800"
                                }`}
                              >
                                <span className="text-[10px] opacity-75">#{idx + 1}</span>
                                <span>{isYou ? "YOU" : q.name}</span>
                              </div>
                              {idx < queueList.length - 1 && (
                                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setMapTargetBook(book);
                          setActiveTab("shelf-locator");
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Locate Shelf Map</span>
                      </button>

                      <button
                        onClick={() => cancelReservation(book.id)}
                        className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-bold"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === "wishlist" && (
        <div className="space-y-4">
          {wishlistBooks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-card border-slate-800 text-slate-500 text-xs">
              Your saved wishlist is empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wishlistBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-3xl glass-card border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-900">
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(book.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-rose-400 hover:text-rose-300 text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{book.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                    <span className="text-[10px] text-indigo-400 font-mono block">📍 {book.shelf}</span>
                  </div>

                  <button
                    onClick={() => reserveBook(book.id)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Reserve Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Reading History */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {readingHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl glass-card border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img src={item.coverUrl} alt={item.title} className="w-10 h-14 object-cover rounded shadow" />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400">{item.author}</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Returned on {item.returnDate}</p>
                </div>
              </div>

              <span className="text-xs text-amber-400 font-bold">⭐ {item.ratingGiven}/5 Rating</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
