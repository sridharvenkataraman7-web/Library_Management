import React from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  CheckCircle,
  AlertTriangle,
  Radio,
  MapPin,
  Sparkles,
  ArrowRight,
  User,
  BookmarkCheck,
  TrendingUp,
  Award,
  BookCheck
} from "lucide-react";

export const StudentHomeDashboard = () => {
  const {
    studentProfile,
    books,
    studentLoans,
    setSelectedBook,
    setMapTargetBook,
    setRadarTargetBook,
    setActiveTab,
    globalSearch,
    setGlobalSearch
  } = useApp();

  // Metrics computation
  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.status === "Available").length;
  const reservedBooksCount = books.filter((b) => b.status === "Reserved").length;
  const borrowedBooksCount = books.filter((b) => b.status === "Checked Out").length;
  const overdueCount = 0; // No overdue fines currently

  // Reserved books by active student
  const myReservations = books.filter((b) =>
    (b.queue || []).some((q) => q.studentId === studentProfile.id)
  );

  // Recommended books (highest rated)
  const recommendedBooks = books.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white p-6 lg:p-8 shadow-xl shadow-purple-500/25 border border-purple-500/30">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 border border-white/20 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Campus Digital Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-purple-200">{studentProfile.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl">
              Check real-time book availability, track your reservation queue position, or locate any book shelf instantly with the 2D smart floor map.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("book-radar")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 text-xs font-extrabold shadow-lg transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Open Book Radar</span>
            </button>
            <button
              onClick={() => setActiveTab("shelf-locator")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-900/80 text-white border border-purple-400/30 text-xs font-bold transition-all"
            >
              <MapPin className="w-4 h-4 text-purple-300" />
              <span>Campus Library Map</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 10,000+ books by title, author, ISBN, subject or shelf code..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setActiveTab("catalogue");
            }}
            className="w-full pl-12 pr-32 py-3.5 rounded-2xl glass-input text-white placeholder:text-slate-500 text-sm border border-purple-500/30 focus:ring-2 focus:ring-purple-500/50 shadow-inner"
          />
          <button
            onClick={() => setActiveTab("catalogue")}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Explore Catalogue
          </button>
        </div>
      </div>

      {/* Library Availability Overview Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span>Library Availability Overview</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono font-semibold">Live Inventory Status</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Available */}
          <div className="p-5 rounded-2xl glass-card border-emerald-500/30 glow-emerald relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available Books
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{availableBooksCount}</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <span>Ready on shelves now</span>
            </p>
          </div>

          {/* Stat 2: Reserved */}
          <div className="p-5 rounded-2xl glass-card border-purple-500/30 glow-purple relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reserved Books
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-950/80 text-purple-300 flex items-center justify-center border border-purple-500/30">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{reservedBooksCount}</p>
            <p className="text-[11px] text-purple-300 mt-1 font-semibold flex items-center gap-1">
              <span>Hold placed by students</span>
            </p>
          </div>

          {/* Stat 3: Borrowed */}
          <div className="p-5 rounded-2xl glass-card border-indigo-500/30 glow-lavender relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Currently Borrowed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{borrowedBooksCount}</p>
            <p className="text-[11px] text-indigo-300 mt-1 font-semibold flex items-center gap-1">
              <span>In active student loans</span>
            </p>
          </div>

          {/* Stat 4: Overdue */}
          <div className="p-5 rounded-2xl glass-card border-zinc-800 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overdue Books
              </span>
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-slate-400 flex items-center justify-center border border-zinc-800">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{overdueCount}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">All student loans on time</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Loans & Reservations vs Book Radar / Map Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Loans & Queue Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currently Borrowed Widget */}
          <div className="p-6 rounded-3xl glass-card border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-purple-400" />
                <span>Currently Borrowed ({studentLoans.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab("my-library")}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                Manage Loans <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex gap-3 hover:border-purple-500/40 transition-all"
                >
                  <img
                    src={loan.coverUrl}
                    alt={loan.bookTitle}
                    className="w-14 h-20 object-cover rounded-xl shadow-md shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{loan.bookTitle}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{loan.author}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Shelf: {loan.shelf}</span>
                        <span className="text-purple-400 font-extrabold">{loan.daysLeft} days left</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (loan.daysLeft / 14) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Reservations & Queue Position Widget */}
          <div className="p-6 rounded-3xl glass-card border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>Active Reservations Queue ({myReservations.length})</span>
              </h3>
              <span className="text-xs text-purple-400 font-mono font-bold">Live Queue Tracker</span>
            </div>

            {myReservations.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active book reservations right now.
              </div>
            ) : (
              <div className="space-y-3">
                {myReservations.map((book) => {
                  const queueList = book.queue || [];
                  const myPosIndex = queueList.findIndex((q) => q.studentId === studentProfile.id);
                  const queuePos = myPosIndex !== -1 ? myPosIndex + 1 : 1;

                  return (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-lg shrink-0 shadow"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{book.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                            <p className="text-[10px] text-purple-400 font-mono font-bold mt-0.5">📍 Shelf {book.shelf}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-extrabold">
                            Queue Position #{queuePos}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">Est. Return: {book.estReturnDate}</p>
                        </div>
                      </div>

                      {/* Visual Queue Nodes Bar */}
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between overflow-x-auto gap-2">
                        {queueList.map((q, idx) => {
                          const isYou = q.studentId === studentProfile.id;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono shrink-0 ${
                                isYou
                                  ? "bg-purple-600 text-white font-bold ring-2 ring-purple-400 shadow-md shadow-purple-500/30"
                                  : "bg-zinc-900 text-slate-400 border border-zinc-800"
                              }`}
                            >
                              <span>#{idx + 1}</span>
                              <span>{isYou ? "YOU" : q.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Book Radar & Map Locator Banner */}
        <div className="space-y-6">
          {/* Book Radar Spotlight Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800 text-white space-y-4 shadow-lg shadow-purple-500/25 border border-purple-400/30">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 animate-pulse text-purple-300" />
              <h3 className="text-base font-bold">Smart Book Radar</h3>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed">
              Requested book is unavailable? Book Radar scans the library catalog and suggests available matching alternatives instantly.
            </p>
            <div className="p-3 rounded-xl bg-purple-950/60 backdrop-blur-md border border-purple-400/30 space-y-2">
              <p className="text-[11px] text-purple-200 font-semibold uppercase tracking-wider">Example Radar Scan</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-medium">Deep Learning (Unavailable)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500 text-white font-bold">3 Alternatives</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("book-radar")}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Scan Unavailable Titles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Map Quick Launcher Card */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-purple-400">
              <MapPin className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Smart Shelf Locator</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find the exact floor, section, and shelf number of any book with animated 2D interactive floor navigation.
            </p>
            <button
              onClick={() => {
                setMapTargetBook(books[0]);
                setActiveTab("shelf-locator");
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
            >
              <span>Locate Shelf C-14 Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Books Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Recommended for Your Curriculum</span>
          </h2>
          <button
            onClick={() => setActiveTab("catalogue")}
            className="text-xs font-bold text-purple-400 hover:text-purple-300"
          >
            Explore Full Catalogue ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="p-4 rounded-2xl glass-card border-zinc-800 space-y-3 cursor-pointer group hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-zinc-950">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md ${
                      book.status === "Available"
                        ? "bg-emerald-600 text-white"
                        : book.status === "Reserved"
                        ? "bg-purple-600 text-white"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.author}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-purple-400 font-bold">📍 {book.shelf}</span>
                <span>⭐ {book.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
