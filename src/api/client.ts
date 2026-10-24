import type {
  ApiItem,
  ApiClaim,
  CreateClaimInput,
  CreateItemInput,
  ApiUser,
  AuthReply,
  Category,
  ItemStatus,
  AiReview,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Normalize API_URL: strip any trailing slash or accidental /api suffix, fallback to production backend if not set
const rawApiUrl = (import.meta.env.VITE_API_URL || "https://itelect4-backend-amber.vercel.app")
  .trim()
  .replace(/\/+$/, "");

export const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl.slice(0, -4)
  : rawApiUrl;

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_URL}${cleanPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// ---- categories: public. request() sends no token, and none is needed.
export function getCategories(): Promise<Category[]> {
  return request<Category[]>("/api/categories");
}

export function getCategoryByCode(code: string): Promise<Category> {
  return request<Category>(`/api/categories/${code}`);
}

// ---- auth: register and login
export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ---- items / submissions: private
export function getItems(): Promise<ApiItem[]> {
  return request<ApiItem[]>("/api/items");
}

export function getItem(id: string | number): Promise<ApiItem> {
  return request<ApiItem>(`/api/items/${id}`);
}

export function createItem(item: CreateItemInput): Promise<ApiItem> {
  return request<ApiItem>("/api/items", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function updateItemStatus(
  id: string | number,
  status: ItemStatus,
): Promise<ApiItem> {
  return request<ApiItem>(`/api/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteItem(id: string | number): Promise<void> {
  return request<void>(`/api/items/${id}`, {
    method: "DELETE",
  });
}

// Legacy user/claim helpers kept for backward compatibility if any component calls them
export async function getUsers(): Promise<ApiUser[]> {
  const currentUser = useAuthStore.getState().user;
  return currentUser ? [currentUser] : [];
}

export async function getClaims(): Promise<ApiClaim[]> {
  return [];
}

export async function createClaim(claim: CreateClaimInput): Promise<ApiClaim> {
  return { ...claim, id: String(Date.now()), createdAt: new Date().toISOString() };
}

export async function updateClaimStatus(
  _id: number | string,
  status: string,
  reviewedAt: string,
): Promise<ApiClaim> {
  return {
    id: String(_id),
    itemId: "",
    claimerId: "",
    message: "",
    contactNumber: "",
    status: status as any,
    createdAt: new Date().toISOString(),
    reviewedAt,
  };
}

export async function updateUserActiveStatus(
  id: number | string,
  isActive: boolean,
): Promise<ApiUser> {
  return {
    id: String(id),
    name: "User",
    email: "",
    role: "student" as any,
    isActive,
  };
}

// ===== SESSION 11: one more private call ===============================
// ---- ai: private, like submissions. The token goes on automatically,
// which matters more here than anywhere: without it, anyone could
// spend your Gemini quota.
export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/api/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

