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
import { ItemCard } from "./components/ItemCard";
import { ClaimCard } from "./components/ClaimCard";
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
  // 1. useState<T> for at least 2 pieces of state
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Custom hooks integration
  const [showOnlyActiveUsers, toggleShowOnlyActive] = useToggle(false);
  const prevClaimsLength = usePrevious<number>(claims.length);

  // Form states
  const [claimItemId, setClaimItemId] = useState<number | "">("");
  const [claimMessage, setClaimMessage] = useState<string>("");
  const [claimClaimerId, setClaimClaimerId] = useState<number>(2);
  const [notification, setNotification] = useState<string | null>(null);

  // 3. useRef for one DOM reference (focusing search input)
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 2. useEffect to load mock data on mount (replaces hard-coded values)
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(initialUsers);
      setItems(initialItems);
      setClaims(initialClaims);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Autofocus the search input when page finishes loading
  useEffect(() => {
    if (!loading) {
      searchInputRef.current?.focus();
    }
  }, [loading]);

  // Micro-notification when a claim is added (uses usePrevious custom hook)
  useEffect(() => {
    if (prevClaimsLength !== undefined && claims.length > prevClaimsLength) {
      setNotification("New claim submitted successfully!");
      const notifyTimer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(notifyTimer);
    }
  }, [claims.length, prevClaimsLength]);

  // 4. Typed onChange handler using React.ChangeEvent<HTMLInputElement>
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Toggle User status event callback
  const handleToggleUserActive = (userId: number): void => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // Initiate claim callback
  const handleInitiateClaim = (itemId: number): void => {
    setClaimItemId(itemId);
    const activeClaimer = users.find((u) => u.role === UserRole.Claimer && u.isActive);
    if (activeClaimer) {
      setClaimClaimerId(activeClaimer.id);
    }
  };

  // Submit Claim Request
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

  // 6. Dynamic data rendering filtering logic
  const filteredUsers = users.filter((u) => !showOnlyActiveUsers || u.isActive);
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p className="loader-text">Loading campus database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification">
          <span>🔔 {notification}</span>
        </div>
      )}

      <header className="app-header">
        <h1 className="app-title">Campus Lost & Found</h1>
        <p className="app-subtitle">
          Interactive portal for campus finder posts, claim management, and user profiles.
        </p>
      </header>

      {/* Search and Controls panel */}
      <div className="dashboard-grid full-width-section" style={{ marginBottom: "20px" }}>
        <div className="section-container" style={{ padding: "20px 30px" }}>
          <div className="search-controls-wrapper">
            <div className="form-group" style={{ flexGrow: 1 }}>
              <label htmlFor="search-input">Search Items (by Title or Location)</label>
              <input
                id="search-input"
                ref={searchInputRef}
                type="text"
                placeholder="Search items e.g., Tumbler, Cafeteria..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="toggle-control-group">
              <label className="toggle-switch-label">
                <input
                  type="checkbox"
                  checked={showOnlyActiveUsers}
                  onChange={toggleShowOnlyActive}
                />
                <span className="toggle-switch-text">Show Only Active Users</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <main className="dashboard-grid">
        {/* Users Section */}
        <section className="section-container">
          <h2 className="section-title">Users Directory ({filteredUsers.length})</h2>
          <div className="cards-list">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onToggleActive={handleToggleUserActive}
              />
            ))}
          </div>
        </section>

        {/* Items Section */}
        <section className="section-container">
          <h2 className="section-title">Reported Items ({filteredItems.length})</h2>
          <div className="cards-list">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClaim={handleInitiateClaim}
              />
            ))}
            {filteredItems.length === 0 && (
              <p style={{ color: "#9ca3af", gridColumn: "1/-1" }}>No items match your search.</p>
            )}
          </div>
        </section>

        {/* Claims Section */}
        <section className="section-container full-width-section">
          <h2 className="section-title">Submitted Claims ({claims.length})</h2>
          <div className="cards-list">
            {claims.map((claim) => {
              const item = items.find((i) => i.id === claim.itemId);
              const claimer = users.find((u) => u.id === claim.claimerId);
              return (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  itemName={item ? item.title : `Item #${claim.itemId}`}
                  claimerName={claimer ? claimer.name : `User #${claim.claimerId}`}
                  onApprove={handleApproveClaim}
                  onReject={handleRejectClaim}
                />
              );
            })}
            {claims.length === 0 && <p style={{ color: "#9ca3af" }}>No claims registered yet.</p>}
          </div>
        </section>

        {/* Interactive Claiming Form */}
        {claimItemId !== "" && (
          <section className="section-container full-width-section interactive-panel">
            <div className="interactive-panel-header">
              <h2 className="section-title" style={{ borderLeftColor: "#ff5b99" }}>
                Submit Claim Details
              </h2>
              <p style={{ color: "#9ca3af" }}>
                Claiming: <strong>{items.find((i) => i.id === claimItemId)?.title}</strong>
              </p>
            </div>
            <form onSubmit={handleSubmitClaim} className="interactive-form-grid">
              <div className="form-group">
                <label htmlFor="claimer-select">Select Claimer User</label>
                <select
                  id="claimer-select"
                  value={claimClaimerId}
                  onChange={(e) => setClaimClaimerId(Number(e.target.value))}
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

              <div className="form-group">
                <label htmlFor="claim-message-input">Claim Verification Message</label>
                <textarea
                  id="claim-message-input"
                  rows={3}
                  placeholder="Provide proof of ownership or describe details (e.g. brand, contents, color)..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit Claim Request
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
