import { NavLink } from "react-router";

/**
 * 404 catch-all page — renders when no other route matches.
 * Route: path="*"
 */
export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Big 404 */}
        <div className="relative">
          <span className="text-[10rem] font-extrabold font-heading leading-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 bg-clip-text text-transparent select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-bounce">🔍</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <NavLink
          to="/"
          className="inline-flex px-6 py-3 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          ← Go to Dashboard
        </NavLink>
      </div>
    </div>
  );
}
