import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LIBRARY_FLOORS_MAP } from "../data/mockData";
import {
  MapPin,
  Compass,
  Navigation,
  BookOpen,
  Layers,
  Sparkles,
  ChevronRight,
  Printer,
  CheckCircle,
  Search
} from "lucide-react";

export const ShelfLocatorModal = () => {
  const { books, mapTargetBook, setMapTargetBook, setSelectedBook } = useApp();

  // Selected target book
  const activeBook = mapTargetBook || books[0];
  const [selectedFloor, setSelectedFloor] = useState(activeBook.floor || "Floor 2");

  const floorData = LIBRARY_FLOORS_MAP[selectedFloor] || LIBRARY_FLOORS_MAP["Floor 2"];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Interactive Campus Floor Map</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-400" />
            <span>Smart Shelf Locator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual guidance system for finding exact shelf locations across campus library floors.
          </p>
        </div>

        {/* Target Book Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Select Target Book</label>
          <select
            value={activeBook.id}
            onChange={(e) => {
              const b = books.find((x) => x.id === e.target.value);
              if (b) {
                setMapTargetBook(b);
                setSelectedFloor(b.floor);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} (Shelf {b.shelf})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Book Info Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
          <img
            src={activeBook.coverUrl}
            alt={activeBook.title}
            className="w-12 h-16 object-cover rounded-xl shadow-md shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              {activeBook.department}
            </span>
            <h3 className="text-sm font-bold text-white truncate">{activeBook.title}</h3>
            <p className="text-xs text-slate-400 truncate">{activeBook.author}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="font-mono text-emerald-400 font-bold">📍 Shelf {activeBook.shelf}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{activeBook.shelfBay}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setSelectedBook(activeBook)}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            View Book Details
          </button>
        </div>
      </div>

      {/* Floor Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {["Floor 1", "Floor 2", "Floor 3"].map((fl) => (
          <button
            key={fl}
            onClick={() => setSelectedFloor(fl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedFloor === fl
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{fl}</span>
            {activeBook.floor === fl && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* 2D Interactive Map Grid Canvas */}
      <div className="p-6 rounded-3xl glass-panel border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">{floorData.name}</h3>
            <p className="text-xs text-slate-400">Interactive architectural shelf blueprint</p>
          </div>
          <span className="text-xs text-indigo-400 font-mono bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
            Target: Shelf {activeBook.shelf}
          </span>
        </div>

        {/* 2D Architectural Diagram Simulation */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 min-h-[380px] flex flex-col justify-between overflow-hidden">
          {/* Blueprint Grid Lines Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Top Entrance Row */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <Navigation className="w-4 h-4 rotate-45" />
              <span>MAIN ENTRANCE / ELEVATORS</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-slate-900 text-slate-400 text-xs font-mono">
              Central Circulation Desk #1
            </div>
          </div>

          {/* Middle Aisles Layout */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-8 relative z-10">
            {/* Shelf Aisle 1 */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all ${
                activeBook.shelf.startsWith("C-") || activeBook.shelf.startsWith("CS-")
                  ? "bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400"
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block">Aisle A</span>
                <p className="text-xs font-bold text-white mt-1">CS & AI Systems</p>
                <p className="text-[10px] text-slate-400">Shelves C-01 to C-20</p>
              </div>

              {activeBook.shelf.startsWith("C-") || activeBook.shelf.startsWith("CS-") ? (
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 mt-2 bg-indigo-600/30 p-1.5 rounded-lg border border-indigo-500/40">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Target: {activeBook.shelf}
                  </span>
                  <span>{activeBook.shelfBay}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-600">Aisle Clear</span>
              )}
            </div>

            {/* Shelf Aisle 2 */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all ${
                activeBook.shelf.startsWith("DS-")
                  ? "bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400"
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block">Aisle B</span>
                <p className="text-xs font-bold text-white mt-1">Data Science Lab</p>
                <p className="text-[10px] text-slate-400">Shelves DS-01 to DS-15</p>
              </div>
              {activeBook.shelf.startsWith("DS-") ? (
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 mt-2 bg-indigo-600/30 p-1.5 rounded-lg border border-indigo-500/40">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Target: {activeBook.shelf}
                  </span>
                  <span>{activeBook.shelfBay}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-600">Aisle Clear</span>
              )}
            </div>

            {/* Shelf Aisle 3 */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all ${
                activeBook.shelf.startsWith("M-") || activeBook.shelf.startsWith("PHY-")
                  ? "bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400"
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block">Aisle C</span>
                <p className="text-xs font-bold text-white mt-1">Math & Physics</p>
                <p className="text-[10px] text-slate-400">Shelves M-01 / PHY-01</p>
              </div>
              {activeBook.shelf.startsWith("M-") || activeBook.shelf.startsWith("PHY-") ? (
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 mt-2 bg-indigo-600/30 p-1.5 rounded-lg border border-indigo-500/40">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Target: {activeBook.shelf}
                  </span>
                  <span>{activeBook.shelfBay}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-600">Aisle Clear</span>
              )}
            </div>

            {/* Reading Study Hub */}
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Zone D</span>
                <p className="text-xs font-bold text-slate-300 mt-1">Quiet Study Bay</p>
              </div>
              <span className="text-[10px] text-slate-600">Power Outlets Available</span>
            </div>
          </div>

          {/* Bottom Navigation Path Indicator */}
          <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Route: Entrance ➔ Main Walkway ➔ {floorData.sections[0]} ➔ Shelf {activeBook.shelf}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Status: 🟢 Map Route Synchronized</div>
          </div>
        </div>

        {/* Step-by-Step Directions Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Step-by-Step Walking Directions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400">STEP 1</span>
              <p className="text-xs font-semibold text-white">Take Elevators to {activeBook.floor}</p>
              <p className="text-[11px] text-slate-400">Exit towards the main academic wing.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400">STEP 2</span>
              <p className="text-xs font-semibold text-white">Head to {activeBook.section}</p>
              <p className="text-[11px] text-slate-400">Walk past the central study bay aisle.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400">STEP 3</span>
              <p className="text-xs font-semibold text-white">Locate Shelf {activeBook.shelf}</p>
              <p className="text-[11px] text-slate-400">Look for the illuminated shelf header tag.</p>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400">STEP 4 (TARGET)</span>
              <p className="text-xs font-semibold text-white">{activeBook.shelfBay}</p>
              <p className="text-[11px] text-indigo-300">Book slot illuminated in green beacon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
