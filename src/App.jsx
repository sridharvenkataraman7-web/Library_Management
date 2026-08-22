import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { StudentHomeDashboard } from "./components/StudentHomeDashboard";
import { SmartBookSearch } from "./components/SmartBookSearch";
import { BookDetailModal } from "./components/BookDetailModal";
import { ShelfLocatorModal } from "./components/ShelfLocatorModal";
import { BookRadarView } from "./components/BookRadarView";
import { MyLibraryView } from "./components/MyLibraryView";
import { NotificationsView } from "./components/NotificationsView";
import { LibrarianDashboard } from "./components/LibrarianDashboard";
import { LibrarianCatalogue } from "./components/LibrarianCatalogue";
import { LibrarianReservations } from "./components/LibrarianReservations";
import { AddEditBookModal } from "./components/AddEditBookModal";
import { AuthPages } from "./components/AuthPages";

const AppContent = () => {
  const { activeTab, persona, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPages />;
  }

  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Main Workspace Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === "dashboard" && <StudentHomeDashboard />}
          {activeTab === "catalogue" && <SmartBookSearch />}
          {activeTab === "my-library" && <MyLibraryView />}
          {activeTab === "book-radar" && <BookRadarView />}
          {activeTab === "shelf-locator" && <ShelfLocatorModal />}
          {activeTab === "notifications" && <NotificationsView />}

          {/* Librarian Views */}
          {activeTab === "librarian-dashboard" && <LibrarianDashboard />}
          {activeTab === "librarian-catalogue" && <LibrarianCatalogue />}
          {activeTab === "librarian-reservations" && <LibrarianReservations />}
        </main>
      </div>

      {/* Global Modals */}
      <BookDetailModal />
      <AddEditBookModal />

      {/* Bottom Footer Ticker */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 LibraX Campus Ecosystem. Smart Digital Library Reservation System.</p>
          <p className="font-mono text-indigo-400">Campus Status: All Systems Operational</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
