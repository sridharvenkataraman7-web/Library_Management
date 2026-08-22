import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Radio,
  MapPin,
  Bell,
  UserCheck,
  BookOpenCheck,
  ListTodo,
  Layers,
  Sparkles,
  ShieldAlert,
  Sliders,
  BookmarkPlus
} from "lucide-react";


export const Sidebar = () => {
  const {
    persona,
    activeTab,
    setActiveTab,
    unreadNotifCount,
    studentLoans,
    books,
    studentProfile
  } = useApp();

  const activeReservationsCount = books.filter((b) =>
    (b.queue || []).some((q) => q.studentId === studentProfile.id)
  ).length;

  const studentNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "catalogue", label: "Catalogue", icon: Search },
    {
      id: "my-library",
      label: "My Library",
      icon: Bookmark,
      badge: studentLoans.length + activeReservationsCount
    },

    { id: "book-radar", label: "Book Radar", icon: Radio, highlight: true },
    { id: "shelf-locator", label: "Shelf Locator", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifCount }
  ];

  const librarianNavItems = [
    { id: "librarian-dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "librarian-catalogue", label: "Catalogue Manager", icon: Layers },
    {
      id: "librarian-reservations",
      label: "Reservations Desk",
      icon: ListTodo,
      badge: books.reduce((acc, b) => acc + (b.queue ? b.queue.length : 0), 0)
    },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifCount }
  ];

  const navItems = persona === "student" ? studentNavItems : librarianNavItems;

  return (
    <aside className="w-64 shrink-0 hidden lg:block py-6 px-4 border-r border-slate-800/60 min-h-[calc(100vh-65px)] bg-slate-950/40">
      <div className="space-y-6">
        {/* Persona Mode Indicator Card */}
        <div className="p-3.5 rounded-2xl glass-panel border-indigo-500/20">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            {persona === "student" ? (
              <BookOpenCheck className="w-4 h-4 text-indigo-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-violet-400" />
            )}
            <span>{persona === "student" ? "Student Portal" : "Librarian Command"}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            {persona === "student"
              ? "Access campus library catalogue, live queues & smart shelf locator."
              : "Manage library catalogue, process queues & issue/return books."}
          </p>
        </div>

        {/* Navigation Menu Links */}
        <div>
          <p className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider px-3 mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                      : item.highlight
                      ? "text-violet-300 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : item.highlight ? "text-violet-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-indigo-600"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Library Hours & Status Card */}
        <div className="p-4 rounded-2xl glass-card border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Central Library</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              OPEN 24/7
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Main Study Desk:</span>
              <span className="text-white font-mono">Floor 1-3</span>
            </div>
            <div className="flex justify-between">
              <span>Digital Kiosk:</span>
              <span className="text-emerald-400 font-mono">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Smart Shelf Map:</span>
              <span className="text-indigo-400 font-mono">Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
