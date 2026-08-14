import { useEffect } from "react";
import { useDataStore } from "../data/data";
import { useToggle } from "../hooks/index";
import { UserCard } from "../components/UserCard";

/**
 * Users management page — lists all users with toggle active/inactive.
 * Protected route (requires auth token).
 * Route: /users
 */
export function UsersPage() {
  const { users, loading, loadDatabase, toggleUserActive } = useDataStore();
  const [showOnlyActive, toggleShowOnlyActive] = useToggle(false);

  useEffect(() => {
    if (users.length === 0 && loading) {
      loadDatabase();
    }
  }, [users.length, loading, loadDatabase]);

  const filteredUsers = users.filter((u) => !showOnlyActive || u.isActive);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Users Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage campus user accounts and activity status.
          </p>
        </div>

        {/* Active Filter Toggle */}
        <label className="relative flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={toggleShowOnlyActive}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Active Only
          </span>
        </label>
      </div>

      {/* Users count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-bold text-purple-600 dark:text-purple-400">
          {filteredUsers.length}
        </span>{" "}
        user{filteredUsers.length !== 1 ? "s" : ""}
      </p>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onToggleActive={toggleUserActive}
              variant="default"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <span className="text-4xl block mb-4">👥</span>
          <p className="text-lg font-semibold">No users found</p>
          <p className="text-sm mt-1">
            {showOnlyActive
              ? "No active users. Try toggling the filter."
              : "No users in the system."}
          </p>
        </div>
      )}
    </div>
  );
}
