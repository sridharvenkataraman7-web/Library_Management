import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { X, Plus, Edit2, Check } from "lucide-react";

export const AddEditBookModal = () => {
  const { editingBook, setEditingBook, addBook, updateBook } = useApp();

  const isEditing = editingBook && editingBook.id;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    department: "Computer Science & AI",
    subject: "Software Engineering",
    floor: 1,
    section: "CS-A",
    shelf: "C-14",
    totalCopies: 3,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    synopsis: ""
  });

  useEffect(() => {
    if (editingBook && editingBook.id) {
      setFormData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        isbn: editingBook.isbn || "",
        department: editingBook.department || "Computer Science & AI",
        subject: editingBook.subject || "",
        floor: editingBook.floor || 1,
        section: editingBook.section || "CS-A",
        shelf: editingBook.shelf || "C-14",
        totalCopies: editingBook.totalCopies || 3,
        coverUrl: editingBook.coverUrl || "",
        synopsis: editingBook.synopsis || ""
      });
    }
  }, [editingBook]);

  if (!editingBook) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    setEditingBook(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl space-y-0 my-8">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              {isEditing ? "Edit Catalogue Item" : "Add New Book to Inventory"}
            </h2>
          </div>

          <button
            onClick={() => setEditingBook(null)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Introduction to Algorithms"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Author Name *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Thomas H. Cormen"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">ISBN Barcode *</label>
              <input
                type="text"
                required
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-0262033848"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Data Science">Data Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Copies *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Library Floor</label>
              <input
                type="number"
                min="1"
                max="3"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="CS-A"
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Shelf Code *</label>
              <input
                type="text"
                required
                value={formData.shelf}
                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                placeholder="C-14"
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Cover Image URL</label>
            <input
              type="url"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? "Save Changes" : "Add to Inventory"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
