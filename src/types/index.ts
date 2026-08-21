// ===== ENUMS =====
/** Auth roles for Module 3 (finder / claimer / admin). */
export enum UserRole {
  Finder = "finder",
  Claimer = "claimer",
  Admin = "admin",
}

/** Multi-step status lifecycle for a claim. */
export enum ClaimStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Completed = "completed",
}

/** Item posting lifecycle (open → claimed → closed). */
export enum ItemStatus {
  Open = "open",
  Claimed = "claimed",
  Closed = "closed",
}

// ===== CORE INTERFACES (Part 1 — Lost & Found) =====
/** App user — role field powers auth. */
export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

/** Lost or found item — list screen entity. */
export interface Item {
  id: string | number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: ItemStatus;
  imageUrl?: string;
  reportedById: string | number;
  createdAt: Date;
}

/** Claim on an item — detail nested under Item (list → detail). */
export interface Claim {
  id: string | number;
  itemId: string | number;
  claimerId: string | number;
  message: string;
  contactNumber: string;
  status: ClaimStatus;
  createdAt: Date;
  reviewedAt?: Date;
}

export type ApiItem = Omit<Item, "createdAt"> & { createdAt: string };
export type ApiClaim = Omit<Claim, "createdAt" | "reviewedAt"> & { 
  createdAt: string; 
  reviewedAt?: string 
};
export type CreateClaimInput = Omit<ApiClaim, "id">;
export type CreateItemInput = Omit<ApiItem, "id">;


// ===== GENERIC API RESPONSE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ===== UTILITY TYPE USES (at least two) =====
/** Partial update payload for an item (PATCH). */
export type UpdateItemInput = Partial<Pick<Item, "title" | "description" | "location" | "status">>;

/** Public profile — hide email from list views. */
export type PublicUser = Omit<User, "email">;

/** Claim card preview — only fields shown in a list row. */
export type ClaimPreview = Pick<Claim, "id" | "itemId" | "status" | "createdAt">;

/** Lookup table: claim status → label. */
export type ClaimStatusLabels = Record<ClaimStatus, string>;

// ===== GENERIC FUNCTIONS =====
export function getById<T extends { id: string | number }>(items: T[], id: string | number): T | undefined {
  return items.find((item) => item.id === id || String(item.id) === String(id));
}

export function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

/** Helper whose return type is reused via ReturnType. */
export function createClaimPreview(claim: Claim): ClaimPreview {
  return {
    id: claim.id,
    itemId: claim.itemId,
    status: claim.status,
    createdAt: claim.createdAt,
  };
}

export type ClaimPreviewFromFn = ReturnType<typeof createClaimPreview>;
