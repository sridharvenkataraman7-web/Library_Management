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
    <aside className="w-64 shrink-0 hidden lg:block py-6 px-4 border-r border-slate-200 min-h-[calc(100vh-65px)] bg-slate-50">
      <div className="space-y-6">
        {/* Persona Mode Indicator Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
            {persona === "student" ? (
              <BookOpenCheck className="w-4 h-4 text-orange-600" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            )}
            <span>{persona === "student" ? "Student Portal" : "Librarian Command"}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            {persona === "student"
              ? "Access campus library catalogue, live queues & smart shelf locator."
              : "Manage library catalogue, process queues & issue/return books."}
          </p>
        </div>

        {/* Navigation Menu Links */}
        <div>
          <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-3 mb-2">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25"
                      : item.highlight
                      ? "text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : item.highlight ? "text-orange-600" : "text-slate-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-orange-600"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
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
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-semibold text-slate-800">Central Library</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              OPEN 24/7
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <div className="flex justify-between">
              <span>Main Study Desk:</span>
              <span className="text-slate-800 font-mono">Floor 1-3</span>
            </div>
            <div className="flex justify-between">
              <span>Digital Kiosk:</span>
              <span className="text-emerald-600 font-mono font-bold">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Smart Shelf Map:</span>
              <span className="text-orange-600 font-mono font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
