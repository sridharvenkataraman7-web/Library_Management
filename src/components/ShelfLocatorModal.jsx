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
  Armchair,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const ShelfLocatorModal = () => {
  const { books, mapTargetBook, setMapTargetBook, setSelectedBook, seats, activeSeatSession, checkInSeat } = useApp();

  const activeBook = mapTargetBook || books[0];
  const [selectedFloor, setSelectedFloor] = useState(activeBook.floor || "Floor 2");
  
  // Grid interactive state
  const [selectedCell, setSelectedCell] = useState(null);

  const floorData = LIBRARY_FLOORS_MAP[selectedFloor] || LIBRARY_FLOORS_MAP["Floor 2"];

  // ═══════════════════════════════════════════════════════════════════════════
  // GRID SEED DATA GENERATOR (Ticket-Booking style 8x8 blueprint)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Bookshelf cells
  const getBookshelfAt = (r, c, floor) => {
    // Math & Physics wing on Floor 1
    if (floor === "Floor 1") {
      if (r === 2 && c === 2) return { code: "M-02", name: "Principles of Real Analysis", section: "Mathematical Sciences Hall" };
      if (r === 2 && c === 4) return { code: "M-04", name: "Probability & Stochastic Processes", section: "Mathematical Sciences Hall" };
      if (r === 4 && c === 2) return { code: "PHY-02", name: "Introduction to Electrodynamics", section: "Physical Sciences Wing" };
      if (r === 4 && c === 4) return { code: "PHY-04", name: "Sears & Zemansky Physics", section: "Physical Sciences Wing" };
      if (r === 4 && c === 6) return { code: "PHY-09", name: "Zettili Quantum Mechanics", section: "Physical Sciences Wing" };
    }
    // CS, AI & Data Science wing on Floor 2
    if (floor === "Floor 2") {
      if (r === 2 && c === 2) return { code: "C-12", name: "Russell Norvig AI textbook", section: "AI & Data Systems Wing" };
      if (r === 2 && c === 4) return { code: "C-14", name: "Deep Learning (Ian Goodfellow)", section: "AI & Data Systems Wing" };
      if (r === 4 && c === 2) return { code: "CS-02", name: "Introduction to Algorithms (CLRS)", section: "Systems & Architecture Aisle" };
      if (r === 4 && c === 4) return { code: "CS-05", name: "Operating System Concepts", section: "Systems & Architecture Aisle" };
      if (r === 4 && c === 6) return { code: "CS-08", name: "Designing Data-Intensive Applications", section: "Systems & Architecture Aisle" };
      if (r === 6 && c === 2) return { code: "CS-11", name: "Clean Code Handbook", section: "Software Design Wing" };
      if (r === 6 && c === 4) return { code: "CS-12", name: "Pragmatic Programmer Guide", section: "Software Design Wing" };
      if (r === 6 && c === 6) return { code: "CS-14", name: "Fowler Enterprise Application Architecture", section: "Software Design Wing" };
      if (r === 3 && c === 7) return { code: "DS-02", name: "Python for Data Analysis", section: "Data Science Lab" };
      if (r === 4 && c === 7) return { code: "DS-04", name: "Data Science from Scratch", section: "Data Science Lab" };
      if (r === 5 && c === 7) return { code: "DS-05", name: "Géron Machine Learning with Scikit", section: "Data Science Lab" };
    }
    // Humanities, Business & Management on Floor 3
    if (floor === "Floor 3") {
      if (r === 2 && c === 3) return { code: "MGMT-01", name: "Peter Thiel Zero to One", section: "Business & Innovation Hub" };
      if (r === 4 && c === 2) return { code: "LIT-02", name: "George Orwell 1984", section: "General Humanities Reading Gallery" };
      if (r === 4 && c === 5) return { code: "LIT-08", name: "Harari Sapiens anthropology", section: "General Humanities Reading Gallery" };
    }
    return null;
  };

  // Study seat cells
  const getSeatAt = (r, c, floor) => {
    // Floor 1 seats: S1-S8
    // Floor 2 seats: S9-S16
    // Floor 3 seats: S17-S24
    const seatMap = {
      "Floor 1": [
        { r: 6, c: 2, num: 1 }, { r: 6, c: 3, num: 2 }, { r: 6, c: 4, num: 3 }, { r: 6, c: 5, num: 4 }
      ],
      "Floor 2": [
        { r: 1, c: 6, num: 1 }, { r: 1, c: 7, num: 2 }, { r: 2, c: 7, num: 3 }, { r: 7, c: 2, num: 4 }, { r: 7, c: 3, num: 5 }
      ],
      "Floor 3": [
        { r: 6, c: 2, num: 1 }, { r: 6, c: 3, num: 2 }, { r: 6, c: 4, num: 3 }, { r: 6, c: 5, num: 4 }, { r: 6, c: 6, num: 5 }
      ]
    };

    const list = seatMap[floor] || [];
    const found = list.find(s => s.r === r && s.c === c);
    if (found) {
      const seatId = `${floor} - Seat ${found.num}`;
      const seatObj = seats.find(s => s.id === seatId);
      return {
        id: seatId,
        number: found.num,
        status: seatObj ? seatObj.status : "Available"
      };
    }
    return null;
  };

  // Check if cell matches active target book's shelf code
  const isTargetShelf = (shelfCode) => {
    return activeBook.shelf.toLowerCase() === shelfCode.toLowerCase();
  };

  // Handle cell click
  const handleCellClick = (r, c, type, details) => {
    setSelectedCell({ row: r, col: c, type, ...details });
    if (type === "bookshelf") {
      const match = books.find(b => b.shelf.toLowerCase() === details.code.toLowerCase());
      if (match) {
        setMapTargetBook(match);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>2D Library Interior Blueprint Map</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-400" />
            <span>Interactive Library Locator Blueprint</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual guidance system showing bookshelves, walkways, entrance, study seat logs, and exact target shelf vectors.
          </p>
        </div>

        {/* Target Book Selector */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Select Target Book</label>
          <select
            value={activeBook.id}
            onChange={(e) => {
              const b = books.find((x) => x.id === e.target.value);
              if (b) {
                setMapTargetBook(b);
                setSelectedFloor(b.floor);
                setSelectedCell(null);
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

      {/* Target Book Details Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
          <img
            src={activeBook.coverUrl}
            alt={activeBook.title}
            className="w-12 h-16 object-cover rounded-xl shadow-md shrink-0 border border-slate-800"
          />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              {activeBook.department} • {activeBook.category}
            </span>
            <h3 className="text-sm font-bold text-white truncate">{activeBook.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="font-mono text-emerald-400 font-bold">📍 Shelf {activeBook.shelf}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{activeBook.shelfBay}</span>
              <span className="text-slate-500">•</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold border border-indigo-500/20">
                {selectedFloor}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedBook(activeBook)}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
        >
          View Book Details
        </button>
      </div>

      {/* Floor Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {["Floor 1", "Floor 2", "Floor 3"].map((fl) => (
          <button
            key={fl}
            onClick={() => {
              setSelectedFloor(fl);
              setSelectedCell(null);
            }}
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

      {/* Grid Blueprint & Info Sidebar Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 2D Grid blue print map */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{floorData.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono">Floor Blueprint Matrix (8x8 Blueprints)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600 animate-pulse inline-block" />
              <span className="text-xs text-indigo-400 font-mono font-bold">Target Beacon Active</span>
            </div>
          </div>

          {/* Map Blueprint Board Grid */}
          <div className="relative p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 flex items-center justify-center">
            {/* Grid Line Guides Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            <div className="grid grid-rows-8 gap-1.5 w-full max-w-[480px]">
              {Array.from({ length: 8 }).map((_, r) => (
                <div key={r} className="grid grid-cols-8 gap-1.5 w-full">
                  {Array.from({ length: 8 }).map((_, c) => {
                    const shelf = getBookshelfAt(r + 1, c + 1, selectedFloor);
                    const seat  = getSeatAt(r + 1, c + 1, selectedFloor);
                    
                    const isEntrance = r === 0 && c === 3;
                    const isDesk     = r === 7 && c === 4;
                    const isSelected = selectedCell && selectedCell.row === r + 1 && selectedCell.col === c + 1;
                    
                    let cellBg     = "bg-slate-900/30 border-slate-800/40 text-slate-700 hover:bg-slate-900/60";
                    let markerText = "";
                    let isTarget   = false;
                    let type       = "walkway";
                    let details    = {};

                    if (isEntrance) {
                      cellBg = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold";
                      markerText = "ENT";
                      type = "entrance";
                    } else if (isDesk) {
                      cellBg = "bg-slate-800 border-slate-700 text-slate-300 font-semibold";
                      markerText = "DSK";
                      type = "desk";
                    } else if (shelf) {
                      type = "bookshelf";
                      details = shelf;
                      isTarget = isTargetShelf(shelf.code);
                      if (isTarget) {
                        cellBg = "bg-indigo-600 border-indigo-400 text-white font-black animate-pulse shadow-lg shadow-indigo-500/45 ring-2 ring-white/20";
                        markerText = shelf.code;
                      } else {
                        cellBg = "bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/80";
                        markerText = shelf.code;
                      }
                    } else if (seat) {
                      type = "seat";
                      details = seat;
                      if (seat.status === "Occupied") {
                        cellBg = "bg-rose-500/15 border-rose-500/30 text-rose-400";
                        markerText = `S${seat.number}`;
                      } else {
                        cellBg = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20";
                        markerText = `S${seat.number}`;
                      }
                    }

                    return (
                      <button
                        key={c}
                        onClick={() => handleCellClick(r + 1, c + 1, type, details)}
                        className={`
                          aspect-square rounded-lg border-2 text-[10px] sm:text-xs font-mono
                          flex items-center justify-center transition-all outline-none duration-150
                          ${cellBg}
                          ${isSelected ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950" : ""}
                        `}
                      >
                        {markerText || ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Blueprint Map Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-indigo-600/40 border border-indigo-500/50 inline-block shrink-0" />
              <span>📚 Bookshelf</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-indigo-600 border-2 border-indigo-400 animate-pulse inline-block shrink-0" />
              <span>🔵 Target Book</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/15 border border-emerald-500/30 inline-block shrink-0" />
              <span>🟢 Study Seat (Free)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-rose-500/15 border border-rose-500/30 inline-block shrink-0" />
              <span>🔴 Study Seat (Full)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Matrix Node Details */}
        <div className="space-y-6">
          
          {/* Node details */}
          <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300">
              <Info className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Blueprint Node Details</h3>
            </div>

            {selectedCell ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Bookshelf Cell details */}
                {selectedCell.type === "bookshelf" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">Shelf Aisle Block</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold font-mono">
                        {selectedCell.code}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Section: {selectedCell.section}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">Coordinate: Row {selectedCell.row}, Col {selectedCell.col}</p>
                    </div>
                    <div className="p-2.5 rounded bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 font-medium">
                      Stored Book: <strong>{selectedCell.name}</strong>
                    </div>
                    {isTargetShelf(selectedCell.code) && (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>This is the target book shelf!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Study Seat details */}
                {selectedCell.type === "seat" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Quiet Study Desk</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        selectedCell.status === "Occupied"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}>
                        {selectedCell.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{selectedCell.id}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Coordinate: Row {selectedCell.row}, Col {selectedCell.col}</p>
                    </div>
                    {selectedCell.status === "Available" ? (
                      <button
                        onClick={() => checkInSeat(selectedCell.id)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                      >
                        Reserve Desk Now
                      </button>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">Seat is currently locked by another student.</p>
                    )}
                  </div>
                )}

                {/* Entrance Cell details */}
                {selectedCell.type === "entrance" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Main Access Way</span>
                    <h4 className="text-xs font-bold text-white">Elevators & Stairwell Entrance</h4>
                    <p className="text-[11px] text-slate-400">Exit here to return to other university academic halls.</p>
                  </div>
                )}

                {/* Desk Cell details */}
                {selectedCell.type === "desk" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Staff Desk Node</span>
                    <h4 className="text-xs font-bold text-white">Circulation & Pickup Desk</h4>
                    <p className="text-[11px] text-slate-400">Visit library staff here for physical checkout support.</p>
                  </div>
                )}

                {/* Walkway cell */}
                {selectedCell.type === "walkway" && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-500 italic">
                    Clear library walking walkway. Walk through here to access aisles.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800/80 text-center text-xs text-slate-500 py-10">
                Select any grid cell on the 2D blueprint map to view details.
              </div>
            )}
          </div>

          {/* Navigation Path Directions */}
          <div className="p-6 rounded-3xl glass-card border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-indigo-400 rotate-45" />
              <span>Step-by-Step Directions</span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <div>
                  <p className="font-semibold text-white">Take Elevators to {selectedFloor}</p>
                  <p className="text-[10px] text-slate-500 leading-snug">Exit elevators and follow the green runway path towards the academic wing.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <div>
                  <p className="font-semibold text-white">Walk to {activeBook.section}</p>
                  <p className="text-[10px] text-slate-500 leading-snug">Located near Aisle {activeBook.shelf.startsWith("C-") ? "A" : activeBook.shelf.startsWith("DS-") ? "B" : "C"}.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <div>
                  <p className="font-semibold text-white">Locate Shelf {activeBook.shelf}</p>
                  <p className="text-[10px] text-slate-400 leading-snug">See blinking target beacon on grid row coordinates above.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
