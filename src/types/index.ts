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

// ===== CORE INTERFACES =====
export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface Item {
  id: string | number;
  reporterId: string | number;
  title: string;
  description: string;
  category: string;
  location: string;
  contactNumber?: string;
  status: ItemStatus;
  reward?: number;
  imageUrl?: string;
  createdAt: Date;
}

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

// Reference resource: Category
export interface Category {
  code: string;
  name: string;
  description: string;
}

// ===== DERIVED TYPES FOR API (matching MongoDB backend) =====
export type ApiItem = Omit<Item, "id" | "reporterId" | "createdAt"> & {
  id: string;
  reporterId: string;
  createdAt?: string;
  reportedAt?: string;
};

// What we send when creating an item: server sets reporterId from token
export type NewItem = Pick<
  Item,
  "title" | "category" | "location" | "description"
> & {
  contactNumber?: string;
  status?: string;
  reward?: number;
};

export type ApiClaim = Omit<Claim, "createdAt" | "reviewedAt"> & {
  createdAt: string;
  reviewedAt?: string;
};

export type CreateClaimInput = Omit<ApiClaim, "id">;
export type CreateItemInput = NewItem & { imageUrl?: string; reportedById?: string | number };

export type ApiUser = Omit<User, "id"> & {
  id: string;
};

export interface AuthReply {
  token: string;
  user: ApiUser;
}

// ===== GENERIC API RESPONSE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ===== UTILITY TYPE USES =====
export type UpdateItemInput = Partial<Pick<Item, "title" | "description" | "location" | "status">>;
export type PublicUser = Omit<User, "email">;
export type ClaimPreview = Pick<Claim, "id" | "itemId" | "status" | "createdAt">;
export type ClaimStatusLabels = Record<ClaimStatus, string>;

// ===== GENERIC FUNCTIONS =====
export function getById<T extends { id: string | number }>(items: T[], id: string | number): T | undefined {
  return items.find((item) => item.id === id || String(item.id) === String(id));
}

export function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

export function createClaimPreview(claim: Claim): ClaimPreview {
  return {
    id: claim.id,
    itemId: claim.itemId,
    status: claim.status,
    createdAt: claim.createdAt,
  };
}

export type ClaimPreviewFromFn = ReturnType<typeof createClaimPreview>;

// ===== SESSION 11: what POST /api/ai sends back =======================
// The fourth time a shape is copied across the two repos, and the
// same rule as the first three: itelect4-backend's Review type is
// derived from a Zod schema in src/schemas/review.ts, and this has
// to say the same thing. Nothing checks that they agree -- you do.
export interface AiReview {
  summary: string;
  strengths: string[];
  improvements: string[];
  readiness: "ready" | "almost" | "not-yet";
}
