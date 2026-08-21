import React from "react";
import { ClaimStatus } from "../types/index";
import type { ApiClaim } from "../types/index";

export interface SubmissionBadgeProps {
  claim: ApiClaim;
  itemName: string;
  claimerName: string;
  onApprove: (claimId: string | number) => void;
  onReject: (claimId: string | number) => void;
  variant?: "default" | "compact";
}

export const SubmissionBadge: React.FC<SubmissionBadgeProps> = ({
  claim,
  itemName,
  claimerName,
  onApprove,
  onReject,
  variant = "default",
}) => {
  const getStatusBadgeClasses = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.Pending:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case ClaimStatus.Approved:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case ClaimStatus.Rejected:
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case ClaimStatus.Completed:
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const handleApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onApprove(claim.id);
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReject(claim.id);
  };

  const isCompact = variant === "compact";

  return (
    <div className="glass-card border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-900/10 hover:-translate-y-1">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <h4 className="font-heading font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight">
            Claim for {itemName}
          </h4>
          <span className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border shrink-0 ${getStatusBadgeClasses(claim.status)}`}>
            {claim.status}
          </span>
        </div>

        {/* Message */}
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">
          "{claim.message}"
        </p>

        {/* Info list */}
        {!isCompact && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/20 space-y-1.5 text-xs text-slate-500 dark:text-slate-450">
            <p>
              <strong>Submitted by:</strong> {claimerName}
            </p>
            <p>
              <strong>Contact:</strong> {claim.contactNumber || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isCompact && claim.status === ClaimStatus.Pending && (
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/30 flex items-center justify-end gap-2">
          <button 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-250 bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none" 
            onClick={handleReject}
          >
            Reject
          </button>
          <button 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors duration-200 focus:outline-none" 
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
};
