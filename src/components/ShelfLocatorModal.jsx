import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  MapPin,
  X,
  Navigation,
  CheckCircle,
  Layers,
  Compass,
  Building,
  Info,
  Footprints
} from "lucide-react";

export const ShelfLocatorModal = () => {
  const { mapTargetBook, setMapTargetBook, floorMaps } = useApp();

  const [activeFloor, setActiveFloor] = useState(mapTargetBook?.floor || 1);

  if (!mapTargetBook) return null;

  const currentFloorData = floorMaps.find((f) => f.floor === activeFloor) || floorMaps[0];

  const targetShelfCode = mapTargetBook.shelf;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-4xl bg-zinc-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-0 my-8">
        {/* Header Bar */}
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">2D Smart Shelf Locator</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                  Target Shelf: {targetShelfCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architectural blueprint map showing live target shelf beacon & walking directions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMapTargetBook(null)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Target Book Info Banner */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={mapTargetBook.coverUrl}
                alt={mapTargetBook.title}
                className="w-10 h-14 object-cover rounded-lg shadow"
              />
              <div>
                <h3 className="text-xs font-bold text-white">{mapTargetBook.title}</h3>
                <p className="text-[11px] text-slate-400">{mapTargetBook.author}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-purple-300 font-bold">
                  <span>Floor {mapTargetBook.floor}</span> • <span>Section {mapTargetBook.section}</span> • <span>Shelf {mapTargetBook.shelf}</span>
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                🟢 Ready on Shelf
              </span>
            </div>
          </div>

          {/* Floor Selection Tabs */}
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Floor Level:</span>
              {[1, 2, 3].map((fNum) => (
                <button
                  key={fNum}
                  onClick={() => setActiveFloor(fNum)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeFloor === fNum
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-zinc-950 text-slate-400 hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  Floor {fNum} {mapTargetBook.floor === fNum && "🎯 (Target)"}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-mono hidden md:block">
              {currentFloorData.name}
            </span>
          </div>

          {/* 2D Interactive Blueprint Map Container */}
          <div className="relative rounded-3xl bg-zinc-950 border border-zinc-800 p-6 min-h-[320px] overflow-hidden shadow-inner">
            {/* Map Background Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />

            {/* Entrance Landmark */}
            <div className="absolute bottom-4 left-6 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 shadow-md">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>South Entrance Gateway</span>
            </div>

            {/* Central Desk Landmark */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold shadow flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              <span>Library Circulation Desk #1</span>
            </div>

            {/* Shelf Blocks Grid */}
            <div className="relative z-10 grid grid-cols-3 gap-6 pt-16 pb-12 px-4">
              {currentFloorData.shelves.map((shelf) => {
                const isTarget = shelf.code === targetShelfCode;

                return (
                  <div
                    key={shelf.code}
                    className={`p-4 rounded-2xl transition-all flex flex-col justify-between min-h-[100px] relative ${
                      isTarget
                        ? "bg-purple-950/80 border-2 border-purple-500 shadow-xl glow-purple"
                        : "bg-zinc-900/90 border border-zinc-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-extrabold ${isTarget ? "text-purple-300" : "text-slate-200"}`}>
                        Shelf {shelf.code}
                      </span>
                      {isTarget && (
                        <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium mt-1">{shelf.subject}</p>

                    {isTarget && (
                      <div className="mt-2 text-[10px] font-extrabold text-purple-200 bg-purple-900/80 px-2 py-1 rounded-lg border border-purple-400/40 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-300" />
                        <span>TARGET BOOK LOCATION</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Walking Directions List */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-purple-400" />
              <span>Step-by-Step Walking Navigation:</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1">
              {mapTargetBook.directions.map((step, idx) => (
                <li key={idx} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
