import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Radio,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  MapPin,
  Star,
  Search,
  Check
} from "lucide-react";

export const BookRadarView = () => {
  const {
    books,
    radarTargetBook,
    setRadarTargetBook,
    setSelectedBook,
    setMapTargetBook,
    reserveBook,
    studentProfile,
    setActiveTab
  } = useApp();

  // Selected unavailable book to run Radar on
  const unavailableBooks = books.filter((b) => b.status !== "Available");
  const activeUnavailableBook = radarTargetBook || unavailableBooks[0] || books[0];

  // Algorithmic discovery for alternative books available now
  const radarAlternatives = books
    .filter(
      (b) =>
        b.id !== activeUnavailableBook.id &&
        b.status === "Available" &&
        (b.department === activeUnavailableBook.department ||
          b.category === activeUnavailableBook.category ||
          b.subject === activeUnavailableBook.subject)
    )
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>AI Smart Recommendation Radar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-violet-400" />
            <span>BOOK RADAR</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Don't wait weeks for a checked-out book. Book Radar scans campus inventory for ready-to-borrow alternative titles.
          </p>
        </div>

        {/* Unavailable Book Selector */}
        <div className="w-full md:w-80">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Select Checked-Out Book to Radar
          </label>
          <select
            value={activeUnavailableBook.id}
            onChange={(e) => {
              const b = books.find((x) => x.id === e.target.value);
              if (b) setRadarTargetBook(b);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-violet-500/40 text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
          >
            {unavailableBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.status} - {b.queue ? b.queue.length : 0} waiting)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Unavailable Book Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
            <img
              src={activeUnavailableBook.coverUrl}
              alt={activeUnavailableBook.title}
              className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 border border-slate-700"
            />
            <div className="min-w-0">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold mb-1">
                🔴 {activeUnavailableBook.status} ({activeUnavailableBook.queue ? activeUnavailableBook.queue.length : 0} waiting)
              </span>
              <h3 className="text-lg font-bold text-white truncate">{activeUnavailableBook.title}</h3>
              <p className="text-xs text-slate-400 truncate">By {activeUnavailableBook.author}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Estimated return date: <strong className="text-rose-300">{activeUnavailableBook.estReturnDate || "Aug 25, 2026"}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <span className="text-xs font-mono text-violet-300 bg-violet-950/60 px-3 py-1.5 rounded-xl border border-violet-500/30 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-violet-400 animate-ping" />
              <span>3 Similar Books Available NOW</span>
            </span>
          </div>
        </div>
      </div>

      {/* Radar Alternative Signals Output */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Radar Signals: Available Alternative Titles</span>
          </h2>
          <span className="text-xs text-emerald-400 font-mono">100% Ready for Campus Pickup</span>
        </div>

        {radarAlternatives.length === 0 ? (
          <div className="p-8 text-center rounded-3xl glass-card border-slate-800 text-slate-400 text-xs">
            No exact matching available titles found right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {radarAlternatives.map((altBook, index) => {
              const matchScore = 98 - index * 4;
              return (
                <div
                  key={altBook.id}
                  className="p-5 rounded-3xl glass-card border-emerald-500/20 glow-emerald flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {matchScore}% Match Signal
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono">
                        🟢 Available ({altBook.availableCopies})
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={altBook.coverUrl}
                        alt={altBook.title}
                        className="w-16 h-22 object-cover rounded-xl shadow shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white line-clamp-2">{altBook.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{altBook.author}</p>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{altBook.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {altBook.description}
                    </p>

                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-indigo-300 flex items-center justify-between">
                      <span>📍 Shelf {altBook.shelf}</span>
                      <span>{altBook.floor}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMapTargetBook(altBook);
                        setActiveTab("shelf-locator");
                      }}
                      className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1"
                      title="Find Shelf"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Map</span>
                    </button>
                    <button
                      onClick={() => reserveBook(altBook.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Reserve Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
