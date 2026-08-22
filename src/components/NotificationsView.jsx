import React from "react";
import { useApp } from "../context/AppContext";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Trash2,
  CheckCheck,
  Eye,
  BookmarkCheck
} from "lucide-react";

export const NotificationsView = () => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setSelectedBook,
    setMapTargetBook,
    books,
    setActiveTab
  } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            <span>Campus Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time alerts for queue advancements, pickup availability, and due date reminders.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Inbox</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border-slate-800 space-y-2">
            <CheckCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All caught up!</h3>
            <p className="text-xs text-slate-400">You have zero unread notifications in your inbox.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const associatedBook = n.bookId ? books.find((b) => b.id === n.bookId) : null;

            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 rounded-3xl glass-card transition-all cursor-pointer ${
                  !n.isRead
                    ? "bg-indigo-950/40 border-indigo-500/40 ring-1 ring-indigo-500/30"
                    : "border-slate-800 opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        n.type === "BOOK_AVAILABLE"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : n.type === "QUEUE_UPDATE"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {n.type === "BOOK_AVAILABLE" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : n.type === "QUEUE_UPDATE" ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{n.title}</h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{n.message}</p>

                      {n.pickupLocation && (
                        <div className="mt-2 text-xs text-emerald-300 font-mono bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            <span>Pickup Desk: {n.pickupLocation}</span>
                          </span>
                          <span>Deadline: {n.pickupDeadline}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.timestamp}</span>
                </div>

                {/* Actions if linked to a book */}
                {associatedBook && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMapTargetBook(associatedBook);
                        setActiveTab("shelf-locator");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Shelf Map</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(associatedBook);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Book</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
