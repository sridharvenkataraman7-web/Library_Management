import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  BookmarkPlus,
  BookmarkCheck,
  Star,
  BookOpen,
  Radio,
  Eye,
  X
} from "lucide-react";

export const SmartBookSearch = () => {
  const {
    books,
    setSelectedBook,
    setMapTargetBook,
    setRadarTargetBook,
    reserveBook,
    studentProfile,
    wishlist,
    toggleWishlist,
    setActiveTab,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating"); // "rating", "year", "title"

  // Filter options lists
  const departments = ["All", "Artificial Intelligence", "Computer Science", "Data Science", "Mathematics", "Physics", "Management", "Literature"];
  const statuses = ["All", "Available", "Reserved", "Checked Out"];
  const categories = ["All", "Machine Learning", "Distributed Systems", "Core AI", "Algorithms & Data Structures", "Applied ML", "Applied Mathematics", "Classical & Quantum Physics", "Software Design", "Data Wrangling", "Entrepreneurship", "History & Anthropology"];

  // Filter logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !globalSearch ||
      book.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(globalSearch.toLowerCase()) ||
      book.isbn.includes(globalSearch) ||
      book.subject.toLowerCase().includes(globalSearch.toLowerCase()) ||
      book.shelf.toLowerCase().includes(globalSearch.toLowerCase());

    const matchesDept = selectedDept === "All" || book.department === selectedDept;
    const matchesStatus = selectedStatus === "All" || book.status === selectedStatus;
    const matchesCat = selectedCategory === "All" || book.category === selectedCategory;

    return matchesSearch && matchesDept && matchesStatus && matchesCat;
  });

  // Sort logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "year") return b.year - a.year;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-indigo-400" />
            <span>Smart Book Search & Catalogue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through {books.length} digital catalogue titles. Check live shelf locations and reserve instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Showing {sortedBooks.length} books</span>
        </div>
      </div>

      {/* Main Search Input & Filters Box */}
      <div className="p-5 rounded-3xl glass-panel border-slate-800 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Title, Author, ISBN, Subject, Department or Shelf Number (e.g. C-14)..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl glass-input text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Multi-Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          {/* Dept Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Availability Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "Available" ? "🟢 Available" : s === "Reserved" ? "🟠 Reserved" : s === "Checked Out" ? "🔴 Checked Out" : "All Statuses"}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="year">Newest Publication</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Cards Grid */}
      {sortedBooks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching books found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to browse all available titles.
          </p>
          <button
            onClick={() => {
              setGlobalSearch("");
              setSelectedDept("All");
              setSelectedStatus("All");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedBooks.map((book) => {
            const inWishlist = wishlist.includes(book.id);
            const isReservedByMe = (book.queue || []).some((q) => q.studentId === studentProfile.id);

            return (
              <div
                key={book.id}
                className="rounded-3xl glass-card border-slate-800 p-4 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all group"
              >
                <div className="space-y-3">
                  {/* Top Cover & Badge Row */}
                  <div className="flex gap-4">
                    <div className="relative shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-slate-900 shadow-md">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(book.id);
                        }}
                        className={`absolute top-1.5 left-1.5 p-1.5 rounded-lg text-xs backdrop-blur-md transition-all ${
                          inWishlist
                            ? "bg-rose-500/80 text-white"
                            : "bg-slate-950/60 text-slate-300 hover:text-white"
                        }`}
                        title="Add to wishlist"
                      >
                        {inWishlist ? (
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        ) : (
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider truncate">
                          {book.department}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{book.rating}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setSelectedBook(book)}
                        className="text-sm font-bold text-white line-clamp-2 cursor-pointer hover:text-indigo-300 transition-colors leading-snug"
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{book.author}</p>
                      <p className="text-[10px] text-slate-500">ISBN: {book.isbn}</p>

                      {/* Status Badge */}
                      <div className="pt-1">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            book.status === "Available"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : book.status === "Reserved"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          }`}
                        >
                          {book.status === "Available" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              🟢 Available ({book.availableCopies}/{book.totalCopies})
                            </>
                          ) : book.status === "Reserved" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              🟠 Reserved (Queue: {book.queue ? book.queue.length : 0})
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              🔴 Checked Out
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location Info Banner */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <span>Location:</span>
                      <strong className="text-white font-mono">{book.floor}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-indigo-400 font-bold">
                      <MapPin className="w-3 h-3" />
                      {book.shelf} ({book.shelfBay})
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMapTargetBook(book);
                      setActiveTab("shelf-locator");
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Find on Map</span>
                  </button>

                  {book.status === "Checked Out" || book.status === "Reserved" ? (
                    <button
                      onClick={() => {
                        setRadarTargetBook(book);
                        setActiveTab("book-radar");
                      }}
                      className="py-2 px-2.5 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-semibold flex items-center gap-1"
                      title="Radar Alternatives"
                    >
                      <Radio className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                      <span>Radar</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => setSelectedBook(book)}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
