import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ItemStatus, ClaimStatus } from "../types/index";
import { getUsers, getItems, getClaims } from "../api/client";
import useAuthStore from "../store/authStore";

/**
 * Dashboard — overview page with summary stats and quick-action cards.
 * Route: /
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(token);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: 1,
  });

  const itemsQuery = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    retry: 1,
  });

  const claimsQuery = useQuery({
    queryKey: ["claims"],
    queryFn: getClaims,
    retry: 1,
  });

  const loading = itemsQuery.isLoading;
  const error = itemsQuery.error || usersQuery.error || claimsQuery.error;

  const users = usersQuery.data || [];
  const items = itemsQuery.data || [];
  const claims = claimsQuery.data || [];

  // Stats
  const totalItems = items.length;
  const openItems = items.filter((i) => i.status === ItemStatus.Open).length;
  const pendingClaims = claims.filter(
    (c) => c.status === ClaimStatus.Pending,
  ).length;
  const activeUsers = users.filter((u) => u.isActive).length;

  const statCards = [
    {
      label: "Total Items",
      value: totalItems,
      icon: "🎒",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      route: "/items",
    },
    {
      label: "Open Items",
      value: openItems,
      icon: "📂",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      route: "/items",
    },
    {
      label: "Pending Claims",
      value: pendingClaims,
      icon: "📥",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      route: isAuthenticated && user?.role === "admin" ? "/admin" : "/items",
    },
    {
      label: "Active Users",
      value: activeUsers || (isAuthenticated ? 1 : 0),
      icon: "👥",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      route: isAuthenticated && user?.role === "admin" ? "/admin" : "/items",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Network Alert (Non-blocking) */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold">Backend Connection Notice</p>
              <p className="text-xs opacity-80">
                {error instanceof Error ? error.message : "Unable to reach backend API."}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              itemsQuery.refetch();
              usersQuery.refetch();
              claimsQuery.refetch();
            }}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all shrink-0 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="text-center space-y-4">
        {isAuthenticated && user && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <span>👋 Welcome back, {user.name}</span>
            <span className="capitalize px-1.5 py-0.5 rounded text-[10px] bg-purple-600 text-white font-mono">
              {user.role}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-500">
          Campus Lost &amp; Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Centralized campus portal to catalog, search, and recover lost items across university facilities.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate(isAuthenticated ? "/items/new" : "/login")}
            className="px-6 py-3 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>➕</span> Report Found Item
          </button>
          <button
            onClick={() => navigate("/items")}
            className="px-6 py-3 text-sm font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Browse Catalog
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-sm font-bold rounded-xl text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.route)}
            className="glass-panel rounded-3xl p-6 text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-2xl ${card.bgColor} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200`}
              >
                {card.icon}
              </div>
              <span
                className={`text-3xl font-extrabold font-heading bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
              >
                {loading ? "…" : card.value}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {card.label}
            </p>
          </button>
        ))}
      </div>

      {/* Recent Items Preview */}
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-500">🎒</span> Recently Reported
          </h2>
          <button
            onClick={() => navigate("/items")}
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin mb-3"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading catalog items…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <p className="text-3xl">📦</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">No items reported yet</p>
            <p className="text-xs max-w-sm mx-auto">
              Be the first to report a found or lost item on campus to help students recover their belongings.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? "/items/new" : "/login")}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-500 cursor-pointer"
            >
              Report Item Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="glass-card border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {item.title}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border shrink-0 ${
                      item.status === ItemStatus.Open
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.description}
                </p>
                <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                  <span>📍</span> {item.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
