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
  BookCheck,
  Armchair,
  Activity,
  History,
  Check,
  RotateCcw
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
    setGlobalSearch,
    seats,
    activeSeatSession,
    checkInSeat,
    releaseSeat,
    extendSeatSession,
    acquisitionRequests
  } = useApp();

  const [seatFloor, setSeatFloor] = React.useState("Floor 1");
  const filteredSeats = seats.filter((s) => s.floor === seatFloor);

  // Search History mock state
  const [searchHistory, setSearchHistory] = React.useState([
    "Distributed Systems",
    "Ian Goodfellow",
    "Scalability",
    "Strang Linear Algebra"
  ]);

  // Metrics computation
  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.status === "Available").length;
  const reservedBooksCount = books.filter((b) => b.status === "Reserved").length;
  const borrowedBooksCount = books.filter((b) => b.status === "Checked Out").length;
  const overdueCount = 0; // No overdue fines currently

  // Live state for counts
  const [liveAvailable, setLiveAvailable] = React.useState(availableBooksCount);
  const [liveReserved, setLiveReserved] = React.useState(reservedBooksCount);
  const [liveBorrowed, setLiveBorrowed] = React.useState(borrowedBooksCount);
  const [liveOverdue, setLiveOverdue] = React.useState(overdueCount);

  // Sync state if base data changes
  React.useEffect(() => {
    setLiveAvailable(availableBooksCount);
    setLiveReserved(reservedBooksCount);
    setLiveBorrowed(borrowedBooksCount);
    setLiveOverdue(overdueCount);
  }, [availableBooksCount, reservedBooksCount, borrowedBooksCount, overdueCount]);

  // Simulate dynamic library changes (borrowing/returning/reservations)
  React.useEffect(() => {
    const timer = setInterval(() => {
      const choice = Math.floor(Math.random() * 4);
      if (choice === 0) {
        // Book borrowed: available decreases, borrowed increases
        setLiveAvailable(prev => Math.max(1, prev - 1));
        setLiveBorrowed(prev => prev + 1);
      } else if (choice === 1) {
        // Book returned: available increases, borrowed decreases
        setLiveAvailable(prev => prev + 1);
        setLiveBorrowed(prev => Math.max(1, prev - 1));
      } else if (choice === 2) {
        // Reservation changes
        setLiveReserved(prev => {
          const change = Math.random() > 0.5 ? 1 : -1;
          return Math.max(0, prev + change);
        });
      } else if (choice === 3) {
        // Overdue status changes
        setLiveOverdue(prev => {
          const change = Math.random() > 0.7 ? 1 : -1;
          return Math.max(0, Math.min(3, prev + change));
        });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Reserved books by Alex Morgan
  const myReservations = books.filter((b) =>
    (b.queue || []).some((q) => q.studentId === studentProfile.id)
  );

  // Recommended books (highest rated)
  const recommendedBooks = books.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/20 p-6 lg:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus Digital Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-indigo-400">{studentProfile.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Check real-time book availability, track your reservation queue position, or locate any book shelf instantly with the 2D smart floor map.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("book-radar")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Open Book Radar</span>
            </button>
            <button
              onClick={() => setActiveTab("shelf-locator")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all"
            >
              <MapPin className="w-4 h-4 text-indigo-400" />
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
            className="w-full pl-12 pr-32 py-3.5 rounded-2xl glass-input text-sm text-white placeholder:text-slate-500 border border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
          />
          <button
            onClick={() => setActiveTab("catalogue")}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            Explore Catalogue
          </button>
        </div>
      </div>

      {/* Library Availability Overview Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Library Availability Overview</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live Inventory Status</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Available */}
          <div className="p-5 rounded-2xl glass-card border-emerald-500/20 glow-emerald relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available Books
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{liveAvailable}</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <span>Ready on shelves now</span>
            </p>
          </div>

          {/* Stat 2: Reserved */}
          <div className="p-5 rounded-2xl glass-card border-amber-500/20 glow-amber relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reserved Books
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{liveReserved}</p>
            <p className="text-[11px] text-amber-400 mt-1 font-medium flex items-center gap-1">
              <span>Hold placed by students</span>
            </p>
          </div>

          {/* Stat 3: Borrowed */}
          <div className="p-5 rounded-2xl glass-card border-indigo-500/20 glow-indigo relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Currently Borrowed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{liveBorrowed}</p>
            <p className="text-[11px] text-indigo-400 mt-1 font-medium flex items-center gap-1">
              <span>In active student loans</span>
            </p>
          </div>

          {/* Stat 4: Overdue */}
          <div className="p-5 rounded-2xl glass-card border-slate-700/60 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overdue Books
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{liveOverdue}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">All student loans on time</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Loans & Reservations vs Book Radar / Queue Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Loans & Queue Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currently Borrowed Widget */}
          <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-indigo-400" />
                <span>Currently Borrowed ({studentLoans.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab("my-library")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Manage Loans <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3 hover:border-indigo-500/30 transition-all"
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
                        <span className="text-indigo-300 font-semibold">{loan.daysLeft} days left</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
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
          <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Active Reservations Queue ({myReservations.length})</span>
              </h3>
              <span className="text-xs text-amber-400 font-mono">Live Queue Tracker</span>
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
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-lg shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{book.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                            <p className="text-[10px] text-indigo-400 font-mono mt-0.5">📍 Shelf {book.shelf}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
                            Queue Position #{queuePos}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1">Est. Return: {book.estReturnDate}</p>
                        </div>
                      </div>

                      {/* Visual Queue Nodes Bar */}
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between overflow-x-auto gap-2">
                        {queueList.map((q, idx) => {
                          const isYou = q.studentId === studentProfile.id;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono shrink-0 ${
                                isYou
                                  ? "bg-indigo-600 text-white font-bold ring-2 ring-indigo-400"
                                  : "bg-slate-800 text-slate-400"
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
          <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-500/30 space-y-4">
            <div className="flex items-center gap-2 text-violet-300">
              <Radio className="w-5 h-5 animate-pulse text-violet-400" />
              <h3 className="text-base font-bold text-white">Smart Book Radar</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Requested book is unavailable? Book Radar scans the library catalog and suggests available matching alternatives instantly.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Example Radar Scan</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-300 font-medium">Deep Learning (Unavailable)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">3 Alternatives</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("book-radar")}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Scan Unavailable Titles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Map Quick Launcher Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/20 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Smart Shelf Locator</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find the exact floor, section, and shelf number of any book with animated 2D interactive floor navigation.
            </p>
            <button
              onClick={() => {
                setMapTargetBook(books[0]);
                setActiveTab("shelf-locator");
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Locate Shelf C-14 Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 🌟 NEW FEATURE: Seat Session Management */}
          <div className="p-6 rounded-3xl glass-card border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300">
                <Armchair className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Study Seat Sessions</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Map
              </span>
            </div>

            {activeSeatSession ? (
              // Active Session UI
              <div className="space-y-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="text-center space-y-1">
                  <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Checked In Seat</p>
                  <p className="text-lg font-extrabold text-white">{activeSeatSession.seatId}</p>
                </div>

                {/* Countdown display */}
                <div className="flex items-center justify-center gap-4 py-2 border-y border-slate-800/80">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Remaining Time</p>
                    <p className="text-2xl font-mono font-extrabold text-amber-400">
                      {Math.floor(activeSeatSession.secondsLeft / 60)}:
                      {String(activeSeatSession.secondsLeft % 60).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={extendSeatSession}
                    className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                  >
                    +15 Mins
                  </button>
                  <button
                    onClick={releaseSeat}
                    className="py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                  >
                    Release Seat
                  </button>
                </div>
              </div>
            ) : (
              // Booking Seat UI
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Reserve a desk for quiet study. Desk automatically releases if inactive.</p>
                
                {/* Floor select */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Select Floor:</span>
                  <select
                    value={seatFloor}
                    onChange={(e) => setSeatFloor(e.target.value)}
                    className="py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Floor 1">Floor 1 (Math)</option>
                    <option value="Floor 2">Floor 2 (CS & AI)</option>
                    <option value="Floor 3">Floor 3 (Quiet Hub)</option>
                  </select>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {filteredSeats.map((seat) => {
                    const isOccupied = seat.status === "Occupied";
                    return (
                      <button
                        key={seat.id}
                        disabled={isOccupied}
                        onClick={() => checkInSeat(seat.id)}
                        className={`py-2 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                          isOccupied
                            ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
                            : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white"
                        }`}
                      >
                        S{seat.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 NEW FEATURE: Demand Analytics Widget */}
      <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-300">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Campus Book Demand Analytics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Borrowed */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">🔥 Most Borrowed Title</h4>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Designing Data-Intensive Applications</p>
              <p className="text-[10px] text-slate-500">8 total loans this semester</p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          {/* Most Reserved */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">⭐ Most Queue Reservations</h4>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Deep Learning</p>
              <p className="text-[10px] text-slate-500">3 students waiting in line</p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "65%" }} />
            </div>
          </div>

          {/* Highly Demanded / Unavailable */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">📈 Frequently Requested</h4>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Introduction to Algorithms (CLRS)</p>
              <p className="text-[10px] text-slate-500">5 pending library order requests</p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Books Grid (Smart Book Recommendation) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Smart Book Recommendations ({studentProfile.department})</span>
            </h2>
            <button
              onClick={() => setActiveTab("catalogue")}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Explore Full Catalogue ➔
            </button>
          </div>

          {/* Search History Pills */}
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <History className="w-3 h-3" /> Recent Searches:
            </span>
            {searchHistory.map((query, i) => (
              <span
                key={i}
                onClick={() => {
                  setGlobalSearch(query);
                  setActiveTab("catalogue");
                }}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-905 border border-slate-800 text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white transition-all font-medium"
              >
                {query}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books
            .filter((b) => b.department.toLowerCase().includes(studentProfile.department.toLowerCase().split(" ")[0]))
            .slice(0, 4)
            .map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="p-4 rounded-2xl glass-card border-slate-800 space-y-3 cursor-pointer group hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-slate-900">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      book.status === "Available"
                        ? "bg-emerald-500/80 text-white"
                        : book.status === "Reserved"
                        ? "bg-amber-500/80 text-white"
                        : "bg-rose-500/80 text-white"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.author}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-indigo-400">📍 {book.shelf}</span>
                <span>⭐ {book.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
