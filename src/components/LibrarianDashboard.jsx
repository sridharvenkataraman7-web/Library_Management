import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Shield,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Plus,
  Search,
  ListTodo,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  RotateCcw
} from "lucide-react";

export const LibrarianDashboard = () => {
  const {
    librarianProfile,
    books,
    studentLoans,
    setIsAddBookOpen,
    setActiveTab,
    updateReservationStatus,
    acquisitionRequests,
    approveAcquisition
  } = useApp();

  // Issue/Return simulator input state
  const [scanStudentId, setScanStudentId] = useState("STU-2024-8842");
  const [scanBookId, setScanBookId] = useState(books[0]?.id || "BK-101");
  const [scanMessage, setScanMessage] = useState("");

  // Stats computation
  const totalBooks = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableBooks = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const borrowedBooks = totalBooks - availableBooks;
  const activeQueuesCount = books.reduce((acc, b) => acc + (b.queue ? b.queue.length : 0), 0);
  const overdueCount = 0;

  // Flattened reservations list for desk
  const reservationRows = [];
  books.forEach((b) => {
    (b.queue || []).forEach((q, idx) => {
      reservationRows.push({
        bookId: b.id,
        bookTitle: b.title,
        shelf: b.shelf,
        studentId: q.studentId,
        studentName: q.name,
        queuePos: idx + 1,
        reservedDate: q.reservedDate,
        status: idx === 0 ? "Next in Line (Ready for Pickup)" : "Waiting in Queue"
      });
    });
  });

  const handleSimulateIssue = () => {
    if (!scanStudentId || !scanBookId) return;
    setScanMessage(`✅ Book [${scanBookId}] successfully issued to Student [${scanStudentId}].`);
    setTimeout(() => setScanMessage(""), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/20 p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Campus Digital Librarian Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, <span className="text-violet-400">{librarianProfile.name}</span>
            </h1>
            <p className="text-xs text-slate-300">
              Manage inventory, process student book reservation queues, update shelf locations, and oversee circulation desk requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddBookOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </button>
            <button
              onClick={() => setActiveTab("librarian-reservations")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <ListTodo className="w-4 h-4 text-violet-400" />
              <span>Reservation Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Librarian Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Copies
          </span>
          <p className="text-2xl font-extrabold text-white mt-1">{totalBooks}</p>
          <span className="text-[10px] text-slate-400">{books.length} unique titles</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border-emerald-500/20">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            Available Copies
          </span>
          <p className="text-2xl font-extrabold text-emerald-300 mt-1">{availableBooks}</p>
          <span className="text-[10px] text-emerald-400">Ready on shelves</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border-indigo-500/20">
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
            Borrowed Copies
          </span>
          <p className="text-2xl font-extrabold text-indigo-300 mt-1">{borrowedBooks}</p>
          <span className="text-[10px] text-indigo-400">Issued to students</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border-amber-500/20">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            Active Queue Holds
          </span>
          <p className="text-2xl font-extrabold text-amber-300 mt-1">{activeQueuesCount}</p>
          <span className="text-[10px] text-amber-400">Pending collections</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border-rose-500/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Overdue Fines
          </span>
          <p className="text-2xl font-extrabold text-white mt-1">{overdueCount}</p>
          <span className="text-[10px] text-slate-400">0 overdue books</span>
        </div>
      </div>

      {/* Main Grid: Circulation Desk Scanner Simulator + Recent Queue Holds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circulation Desk Scanner */}
        <div className="p-6 rounded-3xl glass-card border-violet-500/30 space-y-4">
          <div className="flex items-center gap-2 text-violet-300">
            <UserCheck className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-white">Circulation Issue/Return Desk</h3>
          </div>
          <p className="text-xs text-slate-400">Simulate barcode scanner input to issue or receive books.</p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Student ID / Campus Card
              </label>
              <input
                type="text"
                value={scanStudentId}
                onChange={(e) => setScanStudentId(e.target.value)}
                placeholder="STU-2024-8842"
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Select Book to Process
              </label>
              <select
                value={scanBookId}
                onChange={(e) => setScanBookId(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    [{b.id}] {b.title} (Shelf {b.shelf})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulateIssue}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Issue Book to Student</span>
            </button>

            {scanMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                {scanMessage}
              </div>
            )}
          </div>
        </div>

        {/* Active Reservation Holds Table Preview */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-amber-400" />
              <span>Active Reservation Holds ({reservationRows.length})</span>
            </h3>
            <button
              onClick={() => setActiveTab("librarian-reservations")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Open Full Manager ➔
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Book Title</th>
                  <th className="p-3">Shelf</th>
                  <th className="p-3">Queue Pos</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reservationRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No active queue holds right now.
                    </td>
                  </tr>
                ) : (
                  reservationRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-semibold text-white">{row.studentId}</td>
                      <td className="p-3 font-medium text-slate-200">{row.bookTitle}</td>
                      <td className="p-3 font-mono text-indigo-400">{row.shelf}</td>
                      <td className="p-3 font-bold text-amber-400">#{row.queuePos}</td>
                      <td className="p-3">
                        <button
                          onClick={() => updateReservationStatus(row.bookId, row.studentId, "MARK_AVAILABLE")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-500/30 transition-colors"
                        >
                          Mark Available
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 📈 NEW FEATURE: Book Acquisition System (Librarian Queue) */}
      <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-violet-300">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">Book Acquisition System (Requested Titles)</h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">Review book requests placed by students for copies that are currently unavailable. Acquire copies to fulfill requests.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Requests</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {acquisitionRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No active acquisition requests.
                  </td>
                </tr>
              ) : (
                acquisitionRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{req.title}</td>
                    <td className="p-3 text-slate-400">{req.author}</td>
                    <td className="p-3 text-indigo-400 font-medium">{req.department}</td>
                    <td className="p-3 text-center font-mono font-bold text-violet-400">{req.requestCount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "Acquired"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {req.status === "Pending" ? (
                        <button
                          onClick={() => approveAcquisition(req.id)}
                          className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold shadow-md shadow-violet-600/25 transition-all"
                        >
                          Acquire 2 Copies
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">Acquired</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
