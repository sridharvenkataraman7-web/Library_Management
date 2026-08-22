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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab(persona === "student" ? "dashboard" : "librarian-dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Smart<span className="text-orange-600">Lib</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20">
                  Campus v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Find it. Reserve it. Read it.</p>
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
              className="w-full pl-10 pr-10 py-2 rounded-xl glass-input text-xs sm:text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/40"
            />
            {globalSearch ? (
              <button
                onClick={() => setGlobalSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                /
              </span>
            )}
          </div>

          {/* Quick Search Dropdown Preview */}
          {searchFocused && searchResultsPreview.length > 0 && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100"
            >
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 flex justify-between">
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
                  className="p-3 hover:bg-orange-50 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-9 h-12 object-cover rounded shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{book.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {book.department}
                      </span>
                      <span className="text-[10px] text-orange-600 font-mono">📍 {book.shelf}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      book.status === "Available"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : book.status === "Reserved"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
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
                className="p-2 text-center text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer"
              >
                View all results in Catalogue ➔
              </div>
            </div>
          )}
        </div>

        {/* Right Actions & Profile Button */}
        <div className="flex items-center gap-3">
          {/* Quick Book Radar Trigger */}
          {persona === "student" && (
            <button
              onClick={() => setActiveTab("book-radar")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Book Radar</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Tray */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100">
                <div className="p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Campus Notifications
                    </span>
                    {unreadNotifCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-slate-500 hover:text-orange-600 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 transition-colors cursor-pointer ${
                          !n.isRead ? "bg-orange-50/50 border-l-2 border-orange-500" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                        {n.pickupLocation && (
                          <div className="mt-2 text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
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
                  className="p-2 text-center text-xs font-medium text-orange-600 hover:bg-orange-50 cursor-pointer"
                >
                  Open Notification Center ➔
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill Button */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-500/40 transition-all shadow-sm"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ring-2 ${
                persona === "librarian"
                  ? "bg-gradient-to-tr from-orange-600 to-amber-500 ring-orange-500/30"
                  : "bg-gradient-to-tr from-orange-500 to-amber-500 ring-orange-500/30"
              }`}>
                {persona === "librarian" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {profile.name}
                  {persona === "librarian" ? (
                    <Shield className="w-3 h-3 text-orange-600 inline" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-emerald-600 inline" />
                  )}
                </p>
                <p className="text-[10px] text-slate-500 capitalize font-medium">{persona} Account</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* User Profile Menu Dropdown */}
            {showPersonaMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 divide-y divide-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl mb-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {persona === "student" ? "Student Session" : "Librarian Admin Session"}
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{profile.name}</p>
                  <p className="text-xs text-orange-600 font-mono font-bold mt-0.5">{profile.id}</p>
                  {profile.department && (
                    <p className="text-[11px] text-slate-500 mt-1">{profile.department}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowPersonaMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
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
