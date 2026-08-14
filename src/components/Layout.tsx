import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import "../App.css";

/**
 * Shared layout: top navigation bar + <Outlet /> for child routes.
 * Persists dark mode preference and provides login/logout via authStore.
 */
export function Layout() {
  const { token, logout } = useAuthStore();

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-purple-600/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/10"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`;

  return (
    <div className="min-h-screen app-container-bg text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-[#0e0d12]/80 border-b border-slate-200/50 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              🏫
            </span>
            <span className="text-lg font-extrabold font-heading text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-500">
              Lost &amp; Found
            </span>
          </NavLink>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/items" className={navLinkClass}>
              Items
            </NavLink>
            <NavLink to="/claims" className={navLinkClass}>
              Claims
            </NavLink>
            <NavLink to="/users" className={navLinkClass}>
              Users
            </NavLink>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-all active:scale-95 shadow-sm"
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Auth Button */}
            {token ? (
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md transition-all active:scale-95"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Nav (always visible on small screens) */}
        <div className="md:hidden border-t border-slate-200/50 dark:border-white/[0.05] px-4 py-2 flex items-center gap-1 overflow-x-auto">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/items" className={navLinkClass}>
            Items
          </NavLink>
          <NavLink to="/claims" className={navLinkClass}>
            Claims
          </NavLink>
          <NavLink to="/users" className={navLinkClass}>
            Users
          </NavLink>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-white/[0.05] py-6">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Campus Lost &amp; Found &copy; 2026 &mdash; ITELECT4 GT2
        </p>
      </footer>
    </div>
  );
}
