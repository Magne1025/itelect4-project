import { useState, useEffect, useRef } from "react";
import {
  UserRole,
  ItemStatus,
  ClaimStatus,
} from "./types/index";
import type {
  User,
  Item,
  Claim,
} from "./types/index";
import { UserCard } from "./components/UserCard";
import { CourseCard } from "./components/CourseCard";
import { SubmissionBadge } from "./components/SubmissionBadge";
import { useToggle, usePrevious } from "./hooks/index";
import "./App.css";

// Initial sample data for mock fetch loading simulation
const initialUsers: User[] = [
  {
    id: 1,
    name: "Ana Reyes",
    email: "ana@campus.edu",
    role: UserRole.Finder,
    isActive: true,
  },
  {
    id: 2,
    name: "Ben Cruz",
    email: "ben@campus.edu",
    role: UserRole.Claimer,
    isActive: true,
  },
  {
    id: 3,
    name: "Admin Lee",
    email: "admin@campus.edu",
    role: UserRole.Admin,
    isActive: true,
  },
];

const initialItems: Item[] = [
  {
    id: 101,
    title: "Blue Tumbler",
    description: "Insulated tumbler found near the library.",
    location: "Main Library, 2F",
    status: ItemStatus.Open,
    reportedById: 1,
    createdAt: new Date("2026-07-10"),
  },
  {
    id: 102,
    title: "ID Lace",
    description: "Black lace with school logo, no ID card attached.",
    location: "Engineering Building lobby",
    status: ItemStatus.Claimed,
    reportedById: 1,
    createdAt: new Date("2026-07-12"),
  },
  {
    id: 103,
    title: "Black Umbrella",
    description: "Folding umbrella left in the cafeteria.",
    location: "Student Cafeteria",
    status: ItemStatus.Open,
    reportedById: 1,
    createdAt: new Date("2026-07-15"),
  },
];

const initialClaims: Claim[] = [
  {
    id: 501,
    itemId: 102,
    claimerId: 2,
    message: "I lost my lace after PE class.",
    status: ClaimStatus.Pending,
    createdAt: new Date("2026-07-13"),
  },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Custom hooks integration
  const [showOnlyActiveUsers, toggleShowOnlyActive] = useToggle(false);
  const prevClaimsLength = usePrevious<number>(claims.length);

  // Layout states
  const [cardVariant, setCardVariant] = useState<"default" | "compact">("default");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || 
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  // Form states
  const [claimItemId, setClaimItemId] = useState<number | "">("");
  const [claimMessage, setClaimMessage] = useState<string>("");
  const [claimClaimerId, setClaimClaimerId] = useState<number>(2);
  const [notification, setNotification] = useState<string | null>(null);

  // useRef for DOM reference
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load simulation
  const loadDatabase = () => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      setUsers(initialUsers);
      setItems(initialItems);
      setClaims(initialClaims);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Autofocus the search input when page finishes loading
  useEffect(() => {
    if (!loading && !error) {
      searchInputRef.current?.focus();
    }
  }, [loading, error]);

  // Toast notification when a claim is added
  useEffect(() => {
    if (prevClaimsLength !== undefined && claims.length > prevClaimsLength) {
      setNotification("New claim submitted successfully!");
      const notifyTimer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(notifyTimer);
    }
  }, [claims.length, prevClaimsLength]);

  // Search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Toggle user status handler
  const handleToggleUserActive = (userId: number): void => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // Initiate claim handler
  const handleInitiateClaim = (itemId: number): void => {
    setClaimItemId(itemId);
    const activeClaimer = users.find((u) => u.role === UserRole.Claimer && u.isActive);
    if (activeClaimer) {
      setClaimClaimerId(activeClaimer.id);
    }
  };

  // Submit Claim Request handler
  const handleSubmitClaim = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!claimItemId || !claimMessage.trim() || !claimClaimerId) {
      return;
    }

    const newClaim: Claim = {
      id: Date.now(),
      itemId: Number(claimItemId),
      claimerId: Number(claimClaimerId),
      message: claimMessage,
      status: ClaimStatus.Pending,
      createdAt: new Date(),
    };

    setClaims((prev) => [...prev, newClaim]);
    setItems((prev) =>
      prev.map((item) =>
        item.id === claimItemId ? { ...item, status: ItemStatus.Claimed } : item
      )
    );

    // Reset Form
    setClaimItemId("");
    setClaimMessage("");
  };

  const handleApproveClaim = (claimId: number): void => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: ClaimStatus.Approved, reviewedAt: new Date() } : c))
    );
  };

  const handleRejectClaim = (claimId: number): void => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: ClaimStatus.Rejected, reviewedAt: new Date() } : c))
    );
  };

  const triggerSimulatedError = () => {
    setError("Database integrity check failed: Connection timeout reading records.");
  };

  // Filter logic
  const filteredUsers = users.filter((u) => !showOnlyActiveUsers || u.isActive);
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styled Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen app-container-bg flex flex-col justify-center items-center p-6 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div className="max-w-md w-full glass-panel rounded-3xl p-10 flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 dark:border-purple-500/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 dark:border-t-purple-400 animate-spin"></div>
            <span className="text-xl">🏫</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Loading Database
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Simulating secure campus connection. Please wait...
          </p>
        </div>
      </div>
    );
  }

  // Styled Error State UI
  if (error) {
    return (
      <div className="min-h-screen app-container-bg flex flex-col justify-center items-center p-6 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div className="max-w-lg w-full bg-white/70 dark:bg-red-950/10 backdrop-blur-md border border-red-200 dark:border-red-900/30 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen app-container-bg text-slate-850 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-950 shadow-2xl backdrop-blur-sm border border-white/10 dark:border-black/5 animate-bounce">
          <span>🔔</span>
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Header section */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/50 dark:border-white/[0.05]">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-500">
            Campus Lost & Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-light">
            Interactive dashboard for student claims, cataloged listings, and active roles.
          </p>
        </div>
        
        {/* Header Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Dark Mode button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-all active:scale-95 shadow-sm"
            title="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Component Variant Toggle */}
          <button
            onClick={() => setCardVariant(v => v === "default" ? "compact" : "default")}
            className="px-4 h-10 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
          >
            🎛️ Layout: <span className="text-purple-600 dark:text-purple-400 capitalize">{cardVariant}</span>
          </button>

          {/* Simulate Error Toggle */}
          <button
            onClick={triggerSimulatedError}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-red-200 dark:border-red-900/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all active:scale-95 shadow-sm"
            title="Simulate Error State"
          >
            ⚠️
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow">
        
        {/* Search & Filter bar */}
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 space-y-2">
              <label htmlFor="search-input" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                Search Catalog
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">🔍</span>
                <input
                  id="search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search reported items by name or location (e.g., umbrella, library)..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-250 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/50 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 dark:focus:ring-purple-500/20 dark:focus:border-purple-500/40 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="relative flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOnlyActiveUsers}
                  onChange={toggleShowOnlyActive}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-250 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Show Only Active Users
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Dashboard Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Users column */}
          <section className="glass-panel rounded-3xl p-6 flex flex-col h-fit">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-150 dark:border-slate-800/40">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-purple-500">👥</span> Users Directory
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {filteredUsers.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onToggleActive={handleToggleUserActive}
                  variant={cardVariant}
                />
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  No active users found.
                </div>
              )}
            </div>
          </section>

          {/* Items column */}
          <section className="glass-panel rounded-3xl p-6 flex flex-col h-fit">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-150 dark:border-slate-800/40">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-500">🎒</span> Reported Items
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {filteredItems.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredItems.map((item) => (
                <CourseCard
                  key={item.id}
                  item={item}
                  onClaim={handleInitiateClaim}
                  variant={cardVariant}
                />
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  No catalog items found.
                </div>
              )}
            </div>
          </section>

          {/* Claims column */}
          <section className="glass-panel rounded-3xl p-6 flex flex-col h-fit">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-150 dark:border-slate-800/40">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">📥</span> Submitted Claims
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {claims.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {claims.map((claim) => {
                const item = items.find((i) => i.id === claim.itemId);
                const claimer = users.find((u) => u.id === claim.claimerId);
                return (
                  <SubmissionBadge
                    key={claim.id}
                    claim={claim}
                    itemName={item ? item.title : `Item #${claim.itemId}`}
                    claimerName={claimer ? claimer.name : `User #${claim.claimerId}`}
                    onApprove={handleApproveClaim}
                    onReject={handleRejectClaim}
                    variant={cardVariant}
                  />
                );
              })}
              {claims.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  No claims submitted yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Interactive Claiming Form Panel */}
        {claimItemId !== "" && (
          <section className="glass-panel rounded-3xl p-6 md:p-8 border-l-4 border-l-purple-500/80 animate-fade-in">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  Submit Claim Verification
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Verifying ownership details for: <strong className="text-purple-600 dark:text-purple-400 font-medium">{items.find((i) => i.id === claimItemId)?.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setClaimItemId("")}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitClaim} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="claimer-select" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Select Claimer User
                </label>
                <select
                  id="claimer-select"
                  value={claimClaimerId}
                  onChange={(e) => setClaimClaimerId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-250 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 dark:focus:ring-purple-500/20"
                >
                  {users
                    .filter((u) => u.isActive)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="claim-message-input" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                  Verification Message
                </label>
                <textarea
                  id="claim-message-input"
                  rows={3}
                  placeholder="Describe unique features, contents, or where/when it was lost to verify ownership..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-250 dark:border-white/[0.08] bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 dark:focus:ring-purple-500/20"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setClaimItemId("")}
                  className="px-5 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-purple-500/20 hover:shadow-lg focus:outline-none transition-all duration-200"
                >
                  Submit Claim Request
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
