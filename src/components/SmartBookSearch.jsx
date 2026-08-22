import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Filter,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle,
  Radio,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  Star
} from "lucide-react";

export const SmartBookSearch = () => {
  const {
    books,
    setSelectedBook,
    setMapTargetBook,
    setRadarTargetBook,
    reserveBook,
    wishlist,
    toggleWishlist,
    setActiveTab,
    globalSearch,
    setGlobalSearch
  } = useApp();

  // Filters state
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("title"); // "title" | "rating" | "availability"

  const departments = ["All", "Computer Science & AI", "Data Science", "Mathematics", "Physics", "Management", "Electronics"];

  // Filtered books logic
  let filtered = books.filter((book) => {
    const query = globalSearch.toLowerCase().trim();
    const matchSearch =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.subject.toLowerCase().includes(query) ||
      book.isbn.includes(query) ||
      book.shelf.toLowerCase().includes(query);

    const matchDept = selectedDept === "All" || book.department === selectedDept;
    const matchStatus = selectedStatus === "All" || book.status === selectedStatus;

    return matchSearch && matchDept && matchStatus;
  });

  // Sorting logic
  filtered.sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "availability") return b.availableCopies - a.availableCopies;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-400" />
            <span>Smart Book Catalogue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search 10,000+ campus textbooks, check live shelf stock, or place queue reservations instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("book-radar")}
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Scan Book Radar</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Title, Author, ISBN, Subject or Shelf Code..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-white text-xs sm:text-sm placeholder:text-slate-500"
          />
        </div>

        {/* Filter Badges & Selects */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Department Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Dept:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedDept === dept
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-zinc-950 text-slate-400 hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Status & Sort Selectors */}
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-slate-300 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Availability</option>
              <option value="Available">🟢 Available Now</option>
              <option value="Reserved">🟠 Reserved Queue</option>
              <option value="Checked Out">🔴 Checked Out</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-slate-300 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              <option value="title">Sort: Title A-Z</option>
              <option value="rating">Sort: Top Rated ⭐</option>
              <option value="availability">Sort: Highest Stock 📚</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-slate-400">
          Showing <span className="text-white">{filtered.length}</span> catalogue books
        </p>
      </div>

      {/* Book Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No books found matching criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or reset department filters to see available books.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((book) => {
            const isWishlisted = wishlist.includes(book.id);

            return (
              <div
                key={book.id}
                className="p-4 rounded-2xl glass-card border-zinc-800 flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all group shadow-sm"
              >
                <div className="space-y-3">
                  {/* Book Cover Image & Badges */}
                  <div
                    onClick={() => setSelectedBook(book)}
                    className="relative overflow-hidden rounded-xl aspect-[3/4] bg-zinc-950 cursor-pointer"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Badge */}
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md ${
                        book.status === "Available"
                          ? "bg-emerald-600 text-white"
                          : book.status === "Reserved"
                          ? "bg-purple-600 text-white"
                          : "bg-rose-600 text-white"
                      }`}
                    >
                      {book.status}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(book.id);
                      }}
                      className={`absolute top-2 left-2 p-1.5 rounded-xl transition-all ${
                        isWishlisted
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-zinc-950/80 backdrop-blur-md text-slate-300 hover:bg-zinc-900"
                      }`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3
                      onClick={() => setSelectedBook(book)}
                      className="text-xs sm:text-sm font-bold text-white line-clamp-1 cursor-pointer group-hover:text-purple-400 transition-colors"
                    >
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.author}</p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 text-slate-300 border border-zinc-800 font-medium">
                      {book.department}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 font-semibold border border-purple-500/30">
                      ⭐ {book.rating}
                    </span>
                  </div>

                  {/* Stock & Shelf Info */}
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">
                      Copies: <strong className="text-white">{book.availableCopies}/{book.totalCopies}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setMapTargetBook(book);
                        setActiveTab("shelf-locator");
                      }}
                      className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{book.shelf}</span>
                    </button>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    View Details
                  </button>

                  {book.status === "Available" ? (
                    <button
                      onClick={() => reserveBook(book.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                    >
                      Reserve Book
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setRadarTargetBook(book);
                        setActiveTab("book-radar");
                      }}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1"
                    >
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>Book Radar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
