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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl space-y-0 my-8">
        {/* Header Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">2D Smart Shelf Locator</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  Target Shelf: {targetShelfCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Architectural blueprint map showing live target shelf beacon & walking directions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMapTargetBook(null)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Target Book Info Banner */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={mapTargetBook.coverUrl}
                alt={mapTargetBook.title}
                className="w-10 h-14 object-cover rounded-lg shadow"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900">{mapTargetBook.title}</h3>
                <p className="text-[11px] text-slate-500">{mapTargetBook.author}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-orange-700 font-bold">
                  <span>Floor {mapTargetBook.floor}</span> • <span>Section {mapTargetBook.section}</span> • <span>Shelf {mapTargetBook.shelf}</span>
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                🟢 Ready on Shelf
              </span>
            </div>
          </div>

          {/* Floor Selection Tabs */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Floor Level:</span>
              {[1, 2, 3].map((fNum) => (
                <button
                  key={fNum}
                  onClick={() => setActiveFloor(fNum)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeFloor === fNum
                      ? "bg-orange-600 text-white shadow-md shadow-orange-500/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  Floor {fNum} {mapTargetBook.floor === fNum && "🎯 (Target)"}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-mono hidden md:block">
              {currentFloorData.name}
            </span>
          </div>

          {/* 2D Interactive Blueprint Map Container */}
          <div className="relative rounded-3xl bg-slate-100 border border-slate-200 p-6 min-h-[320px] overflow-hidden shadow-inner">
            {/* Map Background Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60" />

            {/* Entrance Landmark */}
            <div className="absolute bottom-4 left-6 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              <span>South Entrance Gateway</span>
            </div>

            {/* Central Desk Landmark */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-600" />
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
                        ? "bg-orange-50 border-2 border-orange-500 shadow-xl glow-orange"
                        : "bg-white border border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-extrabold ${isTarget ? "text-orange-700" : "text-slate-800"}`}>
                        Shelf {shelf.code}
                      </span>
                      {isTarget && (
                        <span className="w-3 h-3 rounded-full bg-orange-600 animate-ping" />
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium mt-1">{shelf.subject}</p>

                    {isTarget && (
                      <div className="mt-2 text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-1 rounded-lg border border-orange-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>TARGET BOOK LOCATION</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Walking Directions List */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-orange-600" />
              <span>Step-by-Step Walking Navigation:</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
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
