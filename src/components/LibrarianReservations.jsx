import React from "react";
import { useApp } from "../context/AppContext";
import { ListTodo, CheckCircle, Clock, XCircle, MapPin, UserCheck, AlertCircle } from "lucide-react";

export const LibrarianReservations = () => {
  const { books, processQueuePickup, cancelReservation } = useApp();

  // Extract all active queue holds across books
  const allReservations = [];
  books.forEach((book) => {
    (book.queue || []).forEach((q, idx) => {
      allReservations.push({
        bookId: book.id,
        bookTitle: book.title,
        coverUrl: book.coverUrl,
        shelf: book.shelf,
        studentName: q.name,
        studentId: q.studentId,
        position: idx + 1,
        reservedAt: q.reservedAt,
        status: book.status
      });
    });
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-orange-600" />
            <span>Master Reservation Desk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Process student hold queues, mark books available at circulation counter #1, or handle cancellations.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-800 border border-orange-300 text-xs font-extrabold font-mono">
          {allReservations.length} Active Holds
        </span>
      </div>

      {/* Reservations Queue Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        {allReservations.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No pending student reservation holds.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student & ID</th>
                  <th className="py-3.5 px-4">Book Title</th>
                  <th className="py-3.5 px-4">Shelf Location</th>
                  <th className="py-3.5 px-4">Queue Rank</th>
                  <th className="py-3.5 px-4">Reserved Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allReservations.map((item, idx) => (
                  <tr key={`${item.bookId}-${item.studentId}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{item.studentName}</p>
                        <p className="text-[11px] text-orange-600 font-mono font-bold">{item.studentId}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img src={item.coverUrl} alt={item.bookTitle} className="w-7 h-10 object-cover rounded shadow shrink-0" />
                        <span className="font-bold text-slate-900 line-clamp-1">{item.bookTitle}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                      📍 {item.shelf}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300">
                        Queue #{item.position}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {item.reservedAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => processQueuePickup(item.bookId, item.studentId)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all shadow-sm"
                        >
                          Mark Ready for Pickup
                        </button>

                        <button
                          onClick={() => cancelReservation(item.bookId)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
                          title="Cancel Hold"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
