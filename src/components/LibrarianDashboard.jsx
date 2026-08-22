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
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-orange-500/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Digital Librarian Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Librarian Command Desk</h1>
          <p className="text-xs sm:text-sm text-orange-50 max-w-xl">
            Real-time circulation monitoring, queue hold processing, inventory stock adjustments & barcode scanner simulator.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBook({});
          }}
          className="px-4 py-3 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-orange-600" />
          <span>Add New Book Copy</span>
        </button>
      </div>

      {/* Librarian Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inventory Stock</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalCopies}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across all departments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ready on Shelves</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{availableCopies}</p>
          <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Available for checkout</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Student Loans</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-1">{activeLoansCount}</p>
          <p className="text-[11px] text-orange-700 mt-1 font-semibold">Currently issued</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Queue Holds</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{totalHoldsCount}</p>
          <p className="text-[11px] text-amber-700 mt-1 font-semibold">Students waiting in line</p>
        </div>
      </div>

      {/* Scanner Simulator & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circulation Barcode Scanner Simulator */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scan className="w-5 h-5 text-orange-600" />
              <span>Circulation Barcode Scanner Simulator</span>
            </h3>
            <span className="text-xs font-mono font-bold text-orange-600">Desk Kiosk Mode</span>
          </div>

          <form onSubmit={handleSimulateScan} className="space-y-3">
            <div className="relative">
              <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Scan or enter Student ID, Book Barcode or ISBN (e.g. 978-0134685991)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass-input text-slate-900 text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
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
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              <p className="font-bold flex items-center gap-2">
                {scanResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{scanResult.message}</span>
              </p>
              {scanResult.book && (
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-emerald-200/60 font-mono">
                  <span>Author: {scanResult.book.author}</span>
                  <span>Stock: {scanResult.book.availableCopies} available</span>
                  <span>Status: {scanResult.book.status}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Admin Actions */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Admin Actions</h3>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("librarian-catalogue")}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Catalogue Manager</p>
                <p className="text-[11px] text-slate-500">Edit titles, shelf codes & copy counts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab("librarian-reservations")}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Master Reservations Desk</p>
                <p className="text-[11px] text-slate-500">Process student hold queues & mark pickups</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
