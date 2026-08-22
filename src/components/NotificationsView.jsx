import React from "react";
import { useApp } from "../context/AppContext";
import { Bell, MapPin, CheckCircle, Clock, Trash2 } from "lucide-react";

export const NotificationsView = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Campus Notification Inbox</h1>
            <p className="text-xs text-slate-500">Book pickup readiness, queue advancement & return reminders.</p>
          </div>
        </div>

        <button
          onClick={clearAllNotifications}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs">
            Your notification inbox is clean.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                !n.isRead
                  ? "bg-white border-l-4 border-l-orange-500 border-slate-200 shadow-md"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  <span>{n.title}</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              {n.pickupLocation && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Desk Pickup Location: {n.pickupLocation}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
