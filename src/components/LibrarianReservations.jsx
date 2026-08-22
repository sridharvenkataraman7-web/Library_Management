import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ListTodo,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Check,
  AlertCircle
} from "lucide-react";

export const LibrarianReservations = () => {
  const { books, updateReservationStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Flattened reservations list
  const allReservations = [];
  books.forEach((book) => {
    (book.queue || []).forEach((q, idx) => {
      allReservations.push({
        bookId: book.id,
        bookTitle: book.title,
        shelf: book.shelf,
        floor: book.floor,
        studentId: q.studentId,
        studentName: q.name,
        queuePos: idx + 1,
        reservedDate: q.reservedDate,
        estReturn: q.estReturn
      });
    });
  });

  const filteredReservations = allReservations.filter((r) => {
    return (
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shelf.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-violet-400" />
            <span>Master Reservation Management Desk</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Process student hold queues, mark books ready for pickup, and confirm collections.
          </p>
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by Student ID or Book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Reservation Management Table Card */}
      <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Queue Holds ({filteredReservations.length})
          </span>
          <span className="text-xs text-indigo-400 font-mono">Live Real-time State</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Student ID</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Book Title</th>
                <th className="p-3.5">Shelf Location</th>
                <th className="p-3.5">Queue Pos</th>
                <th className="p-3.5">Reserved Date</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No active student queue reservations found.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-white">{row.studentId}</td>
                    <td className="p-3.5 text-slate-300">{row.studentName}</td>
                    <td className="p-3.5 font-semibold text-slate-100">{row.bookTitle}</td>
                    <td className="p-3.5 font-mono text-indigo-400 font-bold">
                      📍 {row.shelf} ({row.floor})
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold">
                        #{row.queuePos}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{row.reservedDate}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateReservationStatus(row.bookId, row.studentId, "MARK_AVAILABLE")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow"
                          title="Send pickup notification to student"
                        >
                          <Send className="w-3 h-3" />
                          <span>Mark Available</span>
                        </button>

                        <button
                          onClick={() => updateReservationStatus(row.bookId, row.studentId, "MARK_COLLECTED")}
                          className="px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 text-[10px] font-bold border border-indigo-500/30"
                          title="Complete student collection"
                        >
                          Collected
                        </button>

                        <button
                          onClick={() => updateReservationStatus(row.bookId, row.studentId, "CANCEL")}
                          className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-[10px] font-bold border border-rose-500/30"
                          title="Cancel hold"
                        >
                          Cancel
                        </button>
                      </div>
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
