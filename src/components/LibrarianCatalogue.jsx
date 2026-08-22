import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export const LibrarianCatalogue = () => {
  const { books, setIsAddBookOpen, setEditingBook, deleteBook, updateBook } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shelf.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery);

    const matchesDept = selectedDept === "All" || b.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-violet-400" />
            <span>Catalogue Inventory Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add new titles, edit metadata, update copy quantities and assign floor shelf locations.
          </p>
        </div>

        <button
          onClick={() => setIsAddBookOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl glass-card border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, ISBN or shelf code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full md:w-56 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
        >
          <option value="All">All Departments</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Data Science">Data Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Management">Management</option>
          <option value="Literature">Literature</option>
        </select>
      </div>

      {/* Catalogue Table */}
      <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Catalogue Items ({filteredBooks.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Cover</th>
                <th className="p-3">Title & Author</th>
                <th className="p-3">Department</th>
                <th className="p-3">Shelf & Floor</th>
                <th className="p-3">Copies (Avail/Total)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <img src={book.coverUrl} alt={book.title} className="w-9 h-12 object-cover rounded shadow" />
                  </td>
                  <td className="p-3 min-w-[200px]">
                    <p className="font-bold text-white line-clamp-1">{book.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                    <span className="text-[10px] text-slate-500 font-mono">ISBN: {book.isbn}</span>
                  </td>
                  <td className="p-3 font-medium text-slate-300">{book.department}</td>
                  <td className="p-3 font-mono text-indigo-300">
                    <span className="font-bold">📍 {book.shelf}</span>
                    <span className="block text-[10px] text-slate-400">{book.floor}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateBook(book.id, {
                            availableCopies: Math.max(0, book.availableCopies - 1)
                          })
                        }
                        className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white px-2">{book.availableCopies} / {book.totalCopies}</span>
                      <button
                        onClick={() =>
                          updateBook(book.id, {
                            availableCopies: Math.min(book.totalCopies, book.availableCopies + 1)
                          })
                        }
                        className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        book.status === "Available"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : book.status === "Reserved"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="Edit Book"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
