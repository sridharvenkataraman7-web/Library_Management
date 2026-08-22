import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Plus, Save, BookOpen, MapPin, Image } from "lucide-react";

export const AddEditBookModal = () => {
  const { isAddBookOpen, setIsAddBookOpen, editingBook, setEditingBook, addBook, updateBook } = useApp();

  const isEdit = Boolean(editingBook);
  const isOpen = isAddBookOpen || isEdit;

  const [formData, setFormData] = useState(() => {
    if (editingBook) return { ...editingBook };
    return {
      title: "",
      author: "",
      isbn: "978-0" + Math.floor(10000000 + Math.random() * 90000000),
      department: "Artificial Intelligence",
      category: "Machine Learning",
      subject: "Artificial Intelligence",
      publisher: "MIT Press",
      year: 2024,
      totalCopies: 5,
      shelf: "C-14",
      shelfBay: "Bay 2, Shelf 3",
      floor: "Floor 2",
      section: "AI & Data Systems Wing",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      description: "Comprehensive university textbook covering core concepts, algorithms, and practical applications."
    };
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAddBookOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 lg:p-8 space-y-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-400" />
            <span>{isEdit ? "Edit Book Details" : "Add New Catalogue Item"}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in book metadata, copy quantity, and campus shelf location.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Author(s) *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Management">Management</option>
                <option value="Literature">Literature</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">ISBN Code</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total Copies</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Shelf Code (e.g. C-14)</label>
              <input
                type="text"
                required
                value={formData.shelf}
                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Library Floor</label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Floor 1">Floor 1</option>
                <option value="Floor 2">Floor 2</option>
                <option value="Floor 3">Floor 3</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Cover Image URL</label>
              <input
                type="text"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Book Description / Synopsis</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? "Save Changes" : "Create Book"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
