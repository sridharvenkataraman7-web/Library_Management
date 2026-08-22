import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Radio,
  Search,
  Sparkles,
  BookOpen,
  CheckCircle,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check
} from "lucide-react";

export const BookRadarView = () => {
  const {
    books,
    radarTargetBook,
    setRadarTargetBook,
    setSelectedBook,
    reserveBook,
    setMapTargetBook,
    setActiveTab
  } = useApp();

  const [selectedUnavailableBook, setSelectedUnavailableBook] = useState(
    radarTargetBook || books.find((b) => b.status !== "Available") || books[2]
  );

  // Filter books that are unavailable (Checked Out or Reserved)
  const unavailableBooks = books.filter((b) => b.status !== "Available");

  // AI Alternatives Scanner: find available books in same department or related subject
  const availableAlternatives = books
    .filter(
      (b) =>
        b.id !== selectedUnavailableBook.id &&
        b.status === "Available" &&
        (b.department === selectedUnavailableBook.department ||
          b.subject === selectedUnavailableBook.subject)
    )
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-purple-500/25 border border-purple-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 border border-white/20 text-xs font-semibold backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>AI Catalog Signal Scanner</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Smart Book Radar Engine</h1>
          <p className="text-xs text-purple-100/90 max-w-xl">
            When a requested textbook is checked out or reserved, Book Radar automatically scans available matching titles with similarity scores and shelf locations.
          </p>
        </div>
      </div>

      {/* Main Grid: Target Unavailable Book Selector vs Radar Alternatives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Select Unavailable Book */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Select Unavailable Book ({unavailableBooks.length})</span>
            </h3>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {unavailableBooks.map((b) => {
              const isSelected = selectedUnavailableBook?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedUnavailableBook(b)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "bg-purple-950/80 border-purple-500/60 shadow-md"
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <img src={b.coverUrl} alt={b.title} className="w-9 h-12 object-cover rounded shadow shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? "text-purple-300" : "text-white"}`}>
                      {b.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{b.author}</p>
                    <span className="text-[10px] font-bold text-rose-400">🔴 {b.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Radar Scan Results & Available Alternatives */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Unavailable Book Hero Box */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUnavailableBook.coverUrl}
                  alt={selectedUnavailableBook.title}
                  className="w-16 h-24 object-cover rounded-xl shadow shrink-0"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                    Target Book Unavailable
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                    {selectedUnavailableBook.title}
                  </h2>
                  <p className="text-xs text-slate-400">{selectedUnavailableBook.author}</p>
                  <p className="text-[11px] text-purple-400 font-mono font-bold mt-1">
                    📍 Shelf {selectedUnavailableBook.shelf} • Est Return: {selectedUnavailableBook.estReturnDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Radar Alternatives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Immediately Available Alternatives ({availableAlternatives.length})</span>
              </h3>
            </div>

            {availableAlternatives.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-zinc-900 border border-zinc-800 text-slate-400 text-xs">
                No immediate available alternatives found in this department.
              </div>
            ) : (
              <div className="space-y-3">
                {availableAlternatives.map((altBook, idx) => {
                  const matchScore = 95 - idx * 6; // 95%, 89%, 83%

                  return (
                    <div
                      key={altBook.id}
                      className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-all space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={altBook.coverUrl}
                            alt={altBook.title}
                            className="w-14 h-20 object-cover rounded-xl shadow shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                                🟢 Available Now ({altBook.availableCopies} Copies)
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                                {matchScore}% Match
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white truncate">{altBook.title}</h4>
                            <p className="text-xs text-slate-400 truncate">{altBook.author}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              setMapTargetBook(altBook);
                              setActiveTab("shelf-locator");
                            }}
                            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <MapPin className="w-3.5 h-3.5 text-purple-400" />
                            <span>{altBook.shelf}</span>
                          </button>

                          <button
                            onClick={() => reserveBook(altBook.id)}
                            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
                          >
                            Reserve Available Book
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
