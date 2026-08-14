import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDataStore } from "../data/data";
import { ItemStatus, ClaimStatus } from "../types/index";

/**
 * Dashboard — overview page with summary stats and quick-action cards.
 * Route: /
 */
export function DashboardPage() {
  const { users, items, claims, loading, error, loadDatabase, setError } =
    useDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (users.length === 0 && items.length === 0 && loading) {
      loadDatabase();
    }
  }, [users.length, items.length, loading, loadDatabase]);

  // Stats
  const totalItems = items.length;
  const openItems = items.filter((i) => i.status === ItemStatus.Open).length;
  const pendingClaims = claims.filter(
    (c) => c.status === ClaimStatus.Pending
  ).length;
  const activeUsers = users.filter((u) => u.isActive).length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 dark:border-purple-500/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 dark:border-t-purple-400 animate-spin"></div>
          <span className="text-xl">🏫</span>
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Loading Database
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Simulating secure campus connection…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center text-3xl mb-6 shadow-sm">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold font-heading text-red-700 dark:text-red-400 mb-3">
          System Error
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 bg-red-500/5 border border-red-500/10 rounded-xl p-4 font-mono mb-6 text-left break-words w-full">
          {error}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setError(null)}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={loadDatabase}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-md transition-all active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
      route: "/claims",
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: "👥",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      route: "/users",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-500">
          Campus Lost &amp; Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Interactive dashboard for student claims, cataloged listings, and
          active roles.
        </p>
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
                {card.value}
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
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="glass-card border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/items/${item.id}`)}
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">
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
      </section>
    </div>
  );
}
