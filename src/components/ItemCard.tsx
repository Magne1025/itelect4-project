import React from "react";
import { ItemStatus } from "../types/index";
import type { ApiItem } from "../types/index";

export interface ItemCardProps {
  item: ApiItem;
  onClaim: (itemId: string | number) => void;
  variant?: "default" | "compact";
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onClaim,
  variant = "default" 
}) => {
  const getStatusBadgeClasses = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.Open:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case ItemStatus.Claimed:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case ItemStatus.Closed:
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20";
    }
  };

  const handleClaimClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClaim(item.id);
  };

  const isCompact = variant === "compact";

  return (
    <div className="glass-card border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl dark:hover:shadow-purple-900/20 hover:-translate-y-1 group">
      
      {/* Image Section */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/30">
            {item.category || "Uncategorized"}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border backdrop-blur-md ${getStatusBadgeClasses(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100 text-lg leading-snug">
          {item.title}
        </h3>

        {/* Body */}
        {!isCompact && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-350 line-clamp-2 leading-relaxed flex-1">
            {item.description}
          </p>
        )}

        {/* Metadata Details */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span className="truncate"><strong>Location:</strong> {item.location}</span>
          </div>
          {!isCompact && (
            <div className="flex items-center gap-1.5">
              <span>📅</span>
              <span><strong>Reported:</strong> {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Footer / Action */}
        {!isCompact && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/30 flex items-center justify-end">
            {item.status === ItemStatus.Open ? (
              <button 
                className="px-4 py-2 text-xs font-semibold rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 active:scale-[0.98] transition-all duration-200" 
                onClick={handleClaimClick}
              >
                Claim Item
              </button>
            ) : (
              <span className="px-3 py-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-850 rounded-lg">
                Unavailable
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
