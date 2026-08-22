import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Search,
  Bell,
  User,
  Shield,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  LogOut,
  MapPin,
  X,
  Radio
} from "lucide-react";

export const Header = () => {
  const {
    logout,
    persona,
    switchPersona,
    studentProfile,
    librarianProfile,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    setSelectedBook,
    books
  } = useApp();


  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Filtered search preview
  const searchResultsPreview = globalSearch.trim()
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          b.author.toLowerCase().includes(globalSearch.toLowerCase()) ||
          b.subject.toLowerCase().includes(globalSearch.toLowerCase()) ||
          b.isbn.includes(globalSearch)
      ).slice(0, 5)
    : [];

  const profile = persona === "student" ? studentProfile : librarianProfile;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab(persona === "student" ? "dashboard" : "librarian-dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Libra<span className="text-indigo-400">X</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Campus v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Find it. Reserve it. Read it.</p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 10,000+ books by title, author, ISBN, or subject..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-10 pr-10 py-2 rounded-xl glass-input text-xs sm:text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50"
            />
            {globalSearch ? (
              <button
                onClick={() => setGlobalSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                /
              </span>
            )}
          </div>

          {/* Quick Search Dropdown Preview */}
          {searchFocused && searchResultsPreview.length > 0 && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60"
            >
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/50 flex justify-between">
                <span>Matching Catalogue Items</span>
                <span>{searchResultsPreview.length} results</span>
              </div>
              {searchResultsPreview.map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setSearchFocused(false);
                  }}
                  className="p-3 hover:bg-indigo-600/10 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-9 h-12 object-cover rounded shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{book.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {book.department}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono">📍 {book.shelf}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      book.status === "Available"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : book.status === "Reserved"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
              ))}
              <div
                onClick={() => {
                  setActiveTab(persona === "student" ? "catalogue" : "librarian-catalogue");
                  setSearchFocused(false);
                }}
                className="p-2 text-center text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/40 cursor-pointer"
              >
                View all results in Catalogue ➔
              </div>
            </div>
          )}
        </div>

        {/* Right Actions & Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Book Radar Trigger */}
          {persona === "student" && (
            <button
              onClick={() => setActiveTab("book-radar")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 border border-violet-500/30 transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Book Radar</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-lg shadow-rose-500/50 animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Tray */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80">
                <div className="p-3 bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Campus Notifications
                    </span>
                    {unreadNotifCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 transition-colors cursor-pointer ${
                          !n.isRead ? "bg-indigo-950/30 border-l-2 border-indigo-500" : "hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                          <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">{n.message}</p>
                        {n.pickupLocation && (
                          <div className="mt-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>Pickup: {n.pickupLocation}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div
                  onClick={() => {
                    setActiveTab("notifications");
                    setShowNotifMenu(false);
                  }}
                  className="p-2 text-center text-xs font-medium text-indigo-400 hover:bg-slate-800/50 cursor-pointer"
                >
                  Open Notification Center ➔
                </div>
              </div>
            )}
          </div>

          {/* User Persona Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl glass-card border-slate-700/60 hover:border-indigo-500/40 transition-all"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ring-2 ${
                persona === "librarian"
                  ? "bg-gradient-to-tr from-violet-600 to-indigo-600 ring-violet-500/30"
                  : "bg-gradient-to-tr from-indigo-600 to-emerald-600 ring-indigo-500/30"
              }`}>
                {persona === "librarian" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="text-left hidden sm:block">

                <p className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                  {profile.name}
                  {persona === "librarian" ? (
                    <Shield className="w-3 h-3 text-indigo-400 inline" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-emerald-400 inline" />
                  )}
                </p>
                <p className="text-[10px] text-slate-400 capitalize font-medium">{persona} Account</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* User Profile Menu Dropdown */}
            {showPersonaMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 divide-y divide-slate-800/80">
                <div className="p-3 bg-slate-950/60 rounded-xl mb-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {persona === "student" ? "Student Session" : "Librarian Admin Session"}
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">{profile.name}</p>
                  <p className="text-xs text-indigo-400 font-mono mt-0.5">{profile.id}</p>
                  {profile.department && (
                    <p className="text-[11px] text-slate-400 mt-1">{profile.department}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowPersonaMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out from Campus</span>
                  </button>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </header>
  );
};
