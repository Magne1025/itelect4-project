import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createItem, getUsers } from "../api/client";
import { ItemStatus, UserRole } from "../types/index";
import type { CreateItemInput } from "../types/index";

export function ReportItemPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [reportedById, setReportedById] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const finders = users.filter(u => u.isActive && u.role !== UserRole.Admin);

  const mutation = useMutation({
    mutationFn: (newItem: CreateItemInput) => createItem(newItem),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate(`/items/${data.id}`);
    },
    onSettled: () => setIsSubmitting(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    mutation.mutate({
      title,
      description,
      category,
      location,
      imageUrl: imageUrl || undefined,
      status: ItemStatus.Open,
      reportedById,
      createdAt: new Date().toISOString(),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const CATEGORIES = ["Electronics", "Clothing", "Accessories", "IDs & Documents", "Keys", "Other"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
      >
        ← Back
      </button>

      <div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Report Found Item
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Help return a lost item to its owner by providing detailed information.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8 border-t-4 border-t-purple-500/80 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Item Name / Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Black MacBook Pro Charger"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Location Found
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g. Library 2nd Floor"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description & Distinguishing Features
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe color, brand, distinct marks..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="imageFile" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Upload Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-purple-50 dark:file:bg-purple-500/10 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-500/20"
                />
                {imageUrl && (
                  <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08]">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="reportedBy" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Reported By (Mock User)
              </label>
              <select
                id="reportedBy"
                value={reportedById}
                onChange={(e) => setReportedById(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                {finders.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
