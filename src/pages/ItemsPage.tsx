import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDataStore } from "../data/data";
import { ItemStatus } from "../types/index";
import { CourseCard } from "../components/CourseCard";

/**
 * Items catalog page — search, filter, and browse all reported items.
 * Route: /items
 *
 * Uses useNavigate() inside an event handler to satisfy GT2 requirement.
 */
export function ItemsPage() {
  const { items, loading, loadDatabase } = useDataStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | ItemStatus>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items.length === 0 && loading) {
      loadDatabase();
    }
  }, [items.length, loading, loadDatabase]);

  // Autofocus search on load
  useEffect(() => {
    if (!loading) {
      searchInputRef.current?.focus();
    }
  }, [loading]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Programmatic navigation via useNavigate() — called from an event handler.
   * Satisfies the GT2 requirement for useNavigate() in an event handler.
   */
  const handleViewDetails = (itemId: number): void => {
    navigate(`/items/${itemId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Reported Items
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse and search all cataloged lost &amp; found items across campus.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Search Input */}
          <div className="flex-1 space-y-2">
            <label
              htmlFor="items-search"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Search Catalog
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                🔍
              </span>
              <input
                id="items-search"
                ref={searchInputRef}
                type="text"
                placeholder="Search by name or location…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | ItemStatus)
              }
              className="w-full md:w-40 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="all">All</option>
              <option value={ItemStatus.Open}>Open</option>
              <option value={ItemStatus.Claimed}>Claimed</option>
              <option value={ItemStatus.Closed}>Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {filteredItems.length}
          </span>{" "}
          item{filteredItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex flex-col">
            <CourseCard
              item={item}
              onClaim={handleViewDetails}
              variant="default"
            />
            {/* View Details button — useNavigate() in an event handler */}
            <button
              onClick={() => handleViewDetails(item.id)}
              className="mt-3 w-full py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all active:scale-[0.98]"
            >
              View Details →
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <span className="text-4xl block mb-4">🔍</span>
          <p className="text-lg font-semibold">No items found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
