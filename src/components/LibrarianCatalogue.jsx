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
  const { books, setEditingBook, deleteBook } = useApp();

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const filtered = books.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      b.shelf.toLowerCase().includes(search.toLowerCase());

    const matchDept = selectedDept === "All" || b.department === selectedDept;

    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-orange-600" />
            <span>Catalogue Inventory Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Add, edit, delete, or update shelf locations across all departments.</p>
        </div>

        <button
          onClick={() => setEditingBook({})}
          className="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by title, author, ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-slate-900 text-xs"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="py-2 px-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-orange-500"
        >
          <option value="All">All Departments</option>
          <option value="Computer Science & AI">Computer Science & AI</option>
          <option value="Data Science">Data Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Management">Management</option>
        </select>
      </div>

      {/* Master Inventory Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Book Title & Author</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Location (Floor/Shelf)</th>
                <th className="py-3.5 px-4">Available Copies</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={book.coverUrl} alt={book.title} className="w-8 h-11 object-cover rounded shadow shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{book.title}</p>
                        <p className="text-[11px] text-slate-500">{book.author}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {book.department}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-orange-600 font-bold">Floor {book.floor} • Shelf {book.shelf}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={book.availableCopies > 0 ? "text-emerald-600" : "text-rose-600"}>
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        book.status === "Available"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : book.status === "Reserved"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors"
                        title="Edit Book"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteBook(book.id)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
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
