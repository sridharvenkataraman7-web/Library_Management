import React from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  BookOpen,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Bookmark,
  Radio,
  Share2,
  ShieldCheck,
  Building
} from "lucide-react";

export const BookDetailModal = () => {
  const {
    selectedBook,
    setSelectedBook,
    setMapTargetBook,
    setRadarTargetBook,
    reserveBook,
    wishlist,
    toggleWishlist,
    setActiveTab,
    studentProfile
  } = useApp();

  if (!selectedBook) return null;

  const isWishlisted = wishlist.includes(selectedBook.id);
  const queueList = selectedBook.queue || [];
  const myQueueIndex = queueList.findIndex((q) => q.studentId === studentProfile.id);
  const isAlreadyReserved = myQueueIndex !== -1;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-3xl bg-zinc-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-0 my-8">
        {/* Header Bar */}
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 text-xs font-bold border border-purple-500/30">
              {selectedBook.department}
            </span>
            <span className="text-xs font-mono text-slate-400">ISBN: {selectedBook.isbn}</span>
          </div>

          <button
            onClick={() => setSelectedBook(null)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Book Cover */}
            <div className="w-full md:w-48 shrink-0 space-y-3">
              <img
                src={selectedBook.coverUrl}
                alt={selectedBook.title}
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg border border-zinc-800"
              />

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Rating</span>
                <p className="text-base font-extrabold text-purple-400 font-mono">⭐ {selectedBook.rating} / 5.0</p>
              </div>
            </div>

            {/* Book Info & Stock */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {selectedBook.title}
                </h1>
                <p className="text-sm font-semibold text-slate-400 mt-1">By {selectedBook.author}</p>
                <p className="text-xs text-slate-500 mt-0.5">Publisher: {selectedBook.publisher} ({selectedBook.yearPublished})</p>
              </div>

              {/* Synopsis */}
              <p className="text-xs text-slate-300 leading-relaxed bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800">
                {selectedBook.synopsis}
              </p>

              {/* Availability & Location Pills */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Stock Status</span>
                  <p className="text-sm font-extrabold text-white mt-0.5">
                    {selectedBook.availableCopies} of {selectedBook.totalCopies} Available
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Shelf Location</span>
                  <p className="text-sm font-extrabold text-purple-400 font-mono mt-0.5">
                    Floor {selectedBook.floor} • Shelf {selectedBook.shelf}
                  </p>
                </div>
              </div>

              {/* Visual Location Path (Floor -> Section -> Shelf -> Bay) */}
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1 font-mono">
                <p className="font-bold">📍 Campus Shelf Path:</p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-purple-300">
                  <span>Floor {selectedBook.floor}</span> ➔ <span>Sec {selectedBook.section}</span> ➔ <span>Shelf {selectedBook.shelf}</span> ➔ <span>Bay {selectedBook.bay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => toggleWishlist(selectedBook.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isWishlisted
                  ? "bg-purple-600 text-white border-purple-600 shadow-md"
                  : "bg-zinc-900 text-slate-300 border-zinc-800 hover:bg-zinc-800"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              <span>{isWishlisted ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={() => {
                setMapTargetBook(selectedBook);
                setSelectedBook(null);
                setActiveTab("shelf-locator");
              }}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-purple-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>Locate on Map</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedBook.status === "Available" ? (
              <button
                onClick={() => {
                  reserveBook(selectedBook.id);
                  setSelectedBook(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
              >
                Reserve Book Copy
              </button>
            ) : (
              <button
                onClick={() => {
                  setRadarTargetBook(selectedBook);
                  setSelectedBook(null);
                  setActiveTab("book-radar");
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Scan Alternatives (Book Radar)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
