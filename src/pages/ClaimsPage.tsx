import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmissionBadge } from "../components/SubmissionBadge";
import { getClaims, getItems, getUsers, updateClaimStatus } from "../api/client";
import { ClaimStatus } from "../types/index";

/**
 * Claims management page — lists all submitted claims with approve/reject.
 * Protected route (requires auth token).
 * Route: /claims
 */
export function ClaimsPage() {
  const queryClient = useQueryClient();

  const { data: claims = [], isLoading: claimsLoading } = useQuery({ queryKey: ["claims"], queryFn: getClaims });
  const { data: items = [], isLoading: itemsLoading } = useQuery({ queryKey: ["items"], queryFn: getItems });
  const { data: users = [], isLoading: usersLoading } = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const loading = claimsLoading || itemsLoading || usersLoading;

  const approveMutation = useMutation({
    mutationFn: (id: number) => updateClaimStatus(id, ClaimStatus.Approved, new Date().toISOString()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claims"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => updateClaimStatus(id, ClaimStatus.Rejected, new Date().toISOString()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claims"] }),
  });

  const approveClaim = (id: string | number) => approveMutation.mutate(Number(id));
  const rejectClaim = (id: string | number) => rejectMutation.mutate(Number(id));

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Submitted Claims
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and manage all ownership claim requests.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          {claims.length} total
        </span>
      </div>

      {/* Claims Grid */}
      {claims.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim) => {
            const item = items.find((i) => i.id === claim.itemId);
            const claimer = users.find((u) => u.id === claim.claimerId);
            return (
              <SubmissionBadge
                key={claim.id}
                claim={claim}
                itemName={item ? item.title : `Item #${claim.itemId}`}
                claimerName={claimer ? claimer.name : `User #${claim.claimerId}`}
                onApprove={approveClaim}
                onReject={rejectClaim}
                variant="default"
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <span className="text-4xl block mb-4">📭</span>
          <p className="text-lg font-semibold">No claims submitted yet</p>
          <p className="text-sm mt-1">
            Claims will appear here when users submit ownership requests.
          </p>
        </div>
      )}
    </div>
  );
}
