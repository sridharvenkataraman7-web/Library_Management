import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldAlert,
  BookOpen,
  Layers,
  ListTodo,
  CheckCircle,
  Clock,
  QrCode,
  Scan,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Plus
} from "lucide-react";

export const LibrarianDashboard = () => {
  const { books, studentLoans, setActiveTab, setEditingBook } = useApp();

  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);

  // Stats computation
  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const totalHoldsCount = books.reduce((acc, b) => acc + (b.queue ? b.queue.length : 0), 0);
  const activeLoansCount = studentLoans.length;

  const handleSimulateScan = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    // Search by ISBN, Barcode, or Book Title
    const match = books.find(
      (b) =>
        b.isbn.includes(scanInput) ||
        b.id.toLowerCase() === scanInput.toLowerCase() ||
        b.title.toLowerCase().includes(scanInput.toLowerCase())
    );

    if (match) {
      setScanResult({
        success: true,
        book: match,
        message: `Found item: "${match.title}" (Shelf: ${match.shelf})`
      });
    } else {
      setScanResult({
        success: false,
        message: `No item found matching barcode/ISBN: "${scanInput}"`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-purple-500/25 border border-purple-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 border border-white/20 text-xs font-semibold backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
            <span>Campus Digital Librarian Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Librarian Command Desk</h1>
          <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl">
            Real-time circulation monitoring, queue hold processing, inventory stock adjustments & barcode scanner simulator.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBook({});
          }}
          className="px-4 py-3 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-purple-600" />
          <span>Add New Book Copy</span>
        </button>
      </div>

      {/* Librarian Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory Stock</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{totalCopies}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across all departments</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready on Shelves</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{availableCopies}</p>
          <p className="text-[11px] text-emerald-300 mt-1 font-semibold">Available for checkout</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Student Loans</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">{activeLoansCount}</p>
          <p className="text-[11px] text-purple-300 mt-1 font-semibold">Currently issued</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Queue Holds</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">{totalHoldsCount}</p>
          <p className="text-[11px] text-indigo-300 mt-1 font-semibold">Students waiting in line</p>
        </div>
      </div>

      {/* Scanner Simulator & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circulation Barcode Scanner Simulator */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-purple-400" />
              <span>Circulation Barcode Scanner Simulator</span>
            </h3>
            <span className="text-xs font-mono font-bold text-purple-400">Desk Kiosk Mode</span>
          </div>

          <form onSubmit={handleSimulateScan} className="space-y-3">
            <div className="relative">
              <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Scan or enter Student ID, Book Barcode or ISBN (e.g. 978-0134685991)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass-input text-white text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
              >
                Simulate Scan
              </button>
            </div>
          </form>

          {/* Scan Output Box */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                scanResult.success
                  ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-950/80 border-rose-500/30 text-rose-300"
              }`}
            >
              <p className="font-bold flex items-center gap-2">
                {scanResult.success ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>{scanResult.message}</span>
              </p>
              {scanResult.book && (
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-emerald-500/20 font-mono">
                  <span>Author: {scanResult.book.author}</span>
                  <span>Stock: {scanResult.book.availableCopies} available</span>
                  <span>Status: {scanResult.book.status}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Admin Actions */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-white">Admin Actions</h3>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("librarian-catalogue")}
              className="w-full p-3 rounded-2xl bg-zinc-950 hover:bg-purple-950/40 border border-zinc-800 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-400">Catalogue Manager</p>
                <p className="text-[11px] text-slate-400">Edit titles, shelf codes & copy counts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab("librarian-reservations")}
              className="w-full p-3 rounded-2xl bg-zinc-950 hover:bg-purple-950/40 border border-zinc-800 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-400">Master Reservations Desk</p>
                <p className="text-[11px] text-slate-400">Process student hold queues & mark pickups</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
