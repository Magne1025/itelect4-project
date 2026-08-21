import React from "react";
import { UserRole } from "../types/index";
import type { User } from "../types/index";

export interface UserCardProps {
  user: User;
  onToggleActive: (userId: string | number) => void;
  variant?: "default" | "compact";
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onToggleActive,
  variant = "default"
}) => {
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleActive(user.id);
  };

  const getRoleBadgeClasses = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case UserRole.Finder:
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case UserRole.Claimer:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const isCompact = variant === "compact";

  return (
    <div 
      className={`glass-card border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-900/10 hover:-translate-y-1 ${
        user.isActive 
          ? "border-slate-200 dark:border-white/[0.08]" 
          : "border-slate-200/50 dark:border-white/[0.02] opacity-70"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-sm shrink-0">
          {user.name.charAt(0)}
        </div>
        
        {/* User Info Header */}
        <div className="min-w-0 flex-1">
          <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 truncate text-base leading-tight">
            {user.name}
          </h3>
          <span className={`inline-block px-2.5 py-0.5 mt-1 text-[11px] font-semibold tracking-wide uppercase rounded-full border ${getRoleBadgeClasses(user.role)}`}>
            {user.role}
          </span>
        </div>
      </div>

      {!isCompact && (
        <>
          {/* Details */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 space-y-2 text-sm">
            <p className="text-slate-500 dark:text-slate-400 truncate">
              <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> {user.email}
            </p>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                user.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  user.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`} />
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/30 flex justify-end">
            <button 
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 shadow-sm ${
                user.isActive
                  ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  : "border-purple-200 dark:border-purple-900/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
              }`}
              onClick={handleToggle}
            >
              Toggle Status
            </button>
          </div>
        </>
      )}
    </div>
  );
};
