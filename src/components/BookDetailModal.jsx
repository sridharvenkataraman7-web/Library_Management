import React from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  BookOpen,
  Radio,
  BookmarkPlus,
  BookmarkCheck,
  ChevronRight,
  UserCheck,
  Layers,
  Layers3
} from "lucide-react";

export const BookDetailModal = () => {
  const {
    selectedBook,
    setSelectedBook,
    setMapTargetBook,
    setRadarTargetBook,
    reserveBook,
    cancelReservation,
    studentProfile,
    wishlist,
    toggleWishlist,
    setActiveTab
  } = useApp();

  if (!selectedBook) return null;

  const book = selectedBook;
  const inWishlist = wishlist.includes(book.id);
  const queueList = book.queue || [];
  const myQueueIndex = queueList.findIndex((q) => q.studentId === studentProfile.id);
  const isReservedByMe = myQueueIndex !== -1;
  const queuePosition = myQueueIndex + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Close button */}
        <button
          onClick={() => setSelectedBook(null)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Main Grid: Cover Image + Primary Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Cover Image */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[3/4] shadow-xl border border-slate-800">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full border shadow-md ${
                    book.status === "Available"
                      ? "bg-emerald-500/90 text-white border-emerald-400"
                      : book.status === "Reserved"
                      ? "bg-amber-500/90 text-white border-amber-400"
                      : "bg-rose-500/90 text-white border-rose-400"
                  }`}
                >
                  {book.status}
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(book.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  inWishlist
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {inWishlist ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                <span>{inWishlist ? "Saved in Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>

            {/* Right Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  <span>{book.department}</span>
                  <span>•</span>
                  <span>{book.category}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-tight">
                  {book.title}
                </h2>
                <p className="text-sm text-slate-300 mt-1 font-medium">By {book.author}</p>
              </div>

              {/* Rating & Inventory */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{book.rating} / 5.0</span>
                  <span className="text-slate-400 font-normal">({book.reviewsCount} reviews)</span>
                </div>

                <div className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-medium">
                  Copies: <strong className="text-emerald-400">{book.availableCopies} available</strong> / {book.totalCopies} total
                </div>
              </div>

              {/* Book Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 block">ISBN</span>
                  <span className="font-mono text-slate-200">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Publisher</span>
                  <span className="text-slate-200">{book.publisher} ({book.year})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Floor</span>
                  <span className="text-indigo-400 font-semibold">{book.floor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Shelf Code</span>
                  <span className="font-mono text-indigo-300 font-bold">{book.shelf}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Book Overview
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{book.description}</p>
              </div>
            </div>
          </div>

          {/* Smart Shelf Navigation Path ("Find this book") */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Smart Shelf Location Path</span>
              </span>
              <button
                onClick={() => {
                  setMapTargetBook(book);
                  setSelectedBook(null);
                  setActiveTab("shelf-locator");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                Open 2D Map ➔
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium shrink-0">
                {book.floor}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-semibold shrink-0">
                {book.section}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono font-bold shrink-0">
                Shelf {book.shelf}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium shrink-0">
                {book.shelfBay}
              </span>
            </div>
          </div>

          {/* Queue Info & Actions Row */}
          {book.status !== "Available" && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Currently Borrowed / Reserved</span>
                </span>
                <span className="text-slate-400 font-mono">
                  Est. Available: {book.estReturnDate || "Aug 26, 2026"}
                </span>
              </div>

              {/* Queue List Preview */}
              {queueList.length > 0 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-1 font-medium">
                    Current Waiting Queue ({queueList.length} readers):
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {queueList.map((q, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border ${
                          q.studentId === studentProfile.id
                            ? "bg-indigo-600 text-white border-indigo-400 font-bold"
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                      >
                        #{idx + 1} {q.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Primary Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setMapTargetBook(book);
                  setSelectedBook(null);
                  setActiveTab("shelf-locator");
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Locate on Map</span>
              </button>

              {book.status !== "Available" && (
                <button
                  onClick={() => {
                    setRadarTargetBook(book);
                    setSelectedBook(null);
                    setActiveTab("book-radar");
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4 text-violet-400 animate-pulse" />
                  <span>Book Radar</span>
                </button>
              )}
            </div>

            <div className="w-full sm:w-auto">
              {isReservedByMe ? (
                <button
                  onClick={() => cancelReservation(book.id)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/40 text-xs font-bold"
                >
                  Cancel My Reservation (Pos #{queuePosition})
                </button>
              ) : (
                <button
                  onClick={() => reserveBook(book.id)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>{book.status === "Available" ? "Reserve Book Now" : `Join Queue (#${queueList.length + 1})`}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
