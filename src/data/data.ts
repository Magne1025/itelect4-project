import { create } from "zustand";
import {
  UserRole,
  ItemStatus,
  ClaimStatus,
} from "../types/index";
import type {
  User,
  Item,
  Claim,
} from "../types/index";

// ===== Initial sample data =====
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

// ===== Zustand data store interface =====
interface DataState {
  users: User[];
  items: Item[];
  claims: Claim[];
  loading: boolean;
  error: string | null;

  // Actions
  loadDatabase: () => void;
  setError: (error: string | null) => void;
  toggleUserActive: (userId: number) => void;
  addClaim: (claim: Claim) => void;
  approveClaim: (claimId: number) => void;
  rejectClaim: (claimId: number) => void;
  updateItemStatus: (itemId: number, status: ItemStatus) => void;
}

export const useDataStore = create<DataState>((set) => ({
  users: [],
  items: [],
  claims: [],
  loading: true,
  error: null,

  loadDatabase: () => {
    set({ loading: true, error: null });
    setTimeout(() => {
      set({
        users: initialUsers,
        items: initialItems,
        claims: initialClaims,
        loading: false,
      });
    }, 1200);
  },

  setError: (error) => set({ error }),

  toggleUserActive: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ),
    })),

  addClaim: (claim) =>
    set((state) => ({
      claims: [...state.claims, claim],
    })),

  approveClaim: (claimId) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === claimId
          ? { ...c, status: ClaimStatus.Approved, reviewedAt: new Date() }
          : c
      ),
    })),

  rejectClaim: (claimId) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === claimId
          ? { ...c, status: ClaimStatus.Rejected, reviewedAt: new Date() }
          : c
      ),
    })),

  updateItemStatus: (itemId, status) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, status } : item
      ),
    })),
}));
