import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemStatus, ClaimStatus } from "../types/index";
import { UserRole } from "../types/index";
import { getItem, getUsers, getClaims, createClaim, updateItemStatus } from "../api/client";

/**
 * Item detail page — shows full info for a single item, plus a claim form.
 * Route: /items/:itemId
 *
 * Uses useParams<{ itemId: string }>() to read the typed URL parameter.
 */
export function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // If itemId is a valid number, parse it. Otherwise, keep it as a string.
  const id = itemId && !isNaN(Number(itemId)) ? Number(itemId) : (itemId as string);

  const { data: item, isLoading: itemLoading } = useQuery({ queryKey: ["item", id], queryFn: () => getItem(id) });
  const { data: users = [], isLoading: usersLoading } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const { data: claims = [], isLoading: claimsLoading } = useQuery({ queryKey: ["claims"], queryFn: getClaims });

  const loading = itemLoading || usersLoading || claimsLoading;

  const claimMutation = useMutation({
    mutationFn: (newClaim: any) => createClaim(newClaim),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claims"] }),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ItemStatus) => updateItemStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["item", id] }),
  });

  const [claimMessage, setClaimMessage] = useState<string>("");
  const [claimContact, setClaimContact] = useState<string>("");
  const [claimClaimerId, setClaimClaimerId] = useState<number>(2);
  const [notification, setNotification] = useState<string | null>(null);

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



  if (!item) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-5xl block mb-6">❌</span>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-3">
          Item Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          No item exists with ID <strong>#{itemId}</strong>.
        </p>
        <button
          onClick={() => navigate("/items")}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md transition-all active:scale-95"
        >
          ← Back to Items
        </button>
      </div>
    );
  }

  const reporter = users.find((u) => u.id === item.reportedById);
  const itemClaims = claims.filter((c) => c.itemId === item.id);

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.Open:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case ItemStatus.Claimed:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case ItemStatus.Closed:
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20";
    }
  };

  const handleSubmitClaim = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!claimMessage.trim() || !item) return;

    claimMutation.mutate({
      itemId: item.id,
      claimerId: claimClaimerId,
      message: claimMessage,
      contactNumber: claimContact,
      status: ClaimStatus.Pending,
    });
    statusMutation.mutate(ItemStatus.Claimed);
    
    setClaimMessage("");
    setClaimContact("");
    setNotification("Claim submitted successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-950 shadow-2xl backdrop-blur-sm border border-white/10 dark:border-black/5 animate-bounce">
          <span>🔔</span>
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/items")}
        className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
      >
        ← Back to Items
      </button>

      {/* Item Detail Card */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
        {item.imageUrl && (
          <div className="w-full h-64 sm:h-80 relative bg-slate-100 dark:bg-slate-800">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}
        
        <div className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border bg-slate-100/50 dark:bg-slate-800/50">
                  {item.category || "Uncategorized"}
                </span>
                <span
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                {item.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Item #{item.id}
              </p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <span>📍</span> {item.location}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reported By
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <span>👤</span>{" "}
                {reporter ? reporter.name : `User #${item.reportedById}`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date Reported
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <span>📅</span>{" "}
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Claims for this Item */}
      {itemClaims.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 md:p-8">
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <span className="text-emerald-500">📥</span> Claims ({itemClaims.length})
          </h2>
          <div className="space-y-4">
            {itemClaims.map((claim) => {
              const claimer = users.find((u) => u.id === claim.claimerId);
              return (
                <div
                  key={claim.id}
                  className="glass-card border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {claimer ? claimer.name : `User #${claim.claimerId}`}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">
                        "{claim.message}"
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border shrink-0 ${
                        claim.status === ClaimStatus.Pending
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : claim.status === ClaimStatus.Approved
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Submitted: {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Claim Form */}
      {item.status === ItemStatus.Open && (
        <section className="glass-panel rounded-3xl p-6 md:p-8 border-l-4 border-l-purple-500/80">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">
            Submit a Claim
          </h2>
          <form onSubmit={handleSubmitClaim} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="detail-claimer"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Claimer
              </label>
              <select
                id="detail-claimer"
                value={claimClaimerId}
                onChange={(e) => setClaimClaimerId(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60"
              >
                {users
                  .filter((u) => u.isActive && u.role !== UserRole.Admin)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="detail-message"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Verification Message
              </label>
              <textarea
                id="detail-message"
                rows={3}
                placeholder="Describe unique features to verify ownership…"
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="detail-contact"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Contact Number
              </label>
              <input
                id="detail-contact"
                type="text"
                placeholder="e.g. 0912 345 6789"
                value={claimContact}
                onChange={(e) => setClaimContact(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Submit Claim Request
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
