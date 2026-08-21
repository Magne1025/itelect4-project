import type { ApiItem, ApiClaim, CreateClaimInput, CreateItemInput, User } from "../types/index";
import { ItemStatus } from "../types/index";

const API_URL = "http://localhost:3000";

const INITIAL_USERS: User[] = [
  { id: "1", name: "Ana Reyes", email: "ana@campus.edu", role: "finder" as any, isActive: true },
  { id: "2", name: "Ben Cruz", email: "ben@campus.edu", role: "claimer" as any, isActive: true },
  { id: "3", name: "Admin Lee", email: "admin@campus.edu", role: "admin" as any, isActive: true }
];

const INITIAL_ITEMS: ApiItem[] = [
  {
    id: "101",
    title: "Blue Tumbler",
    description: "Insulated Hydro Flask tumbler found near the library entrance. Seems almost new.",
    category: "Accessories",
    location: "Main Library, 2F",
    status: ItemStatus.Open,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
    reportedById: 1,
    createdAt: "2026-07-10T00:00:00.000Z"
  },
  {
    id: "102",
    title: "ID Lace",
    description: "Black lace with school logo, no ID card attached. Found it on the bench.",
    category: "IDs & Documents",
    location: "Engineering Building lobby",
    status: ItemStatus.Claimed,
    imageUrl: "https://images.unsplash.com/photo-1598284534731-50e50e93deae?q=80&w=600&auto=format&fit=crop",
    reportedById: 1,
    createdAt: "2026-07-12T00:00:00.000Z"
  },
  {
    id: "103",
    title: "MacBook Pro Charger",
    description: "White Apple charger left plugged in at a table near the window.",
    category: "Electronics",
    location: "Student Cafeteria",
    status: ItemStatus.Open,
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop",
    reportedById: 1,
    createdAt: "2026-07-15T00:00:00.000Z"
  }
];

const INITIAL_CLAIMS: ApiClaim[] = [
  {
    id: "501",
    itemId: 102,
    claimerId: 2,
    message: "I lost my lace after PE class.",
    contactNumber: "09123456789",
    status: "rejected" as any,
    createdAt: "2026-07-13T00:00:00.000Z",
    reviewedAt: "2026-08-21T14:04:16.761Z"
  }
];

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    setLocal("fallback_users", data);
    return data;
  } catch {
    return getLocal("fallback_users", INITIAL_USERS);
  }
}

export async function getItems(): Promise<ApiItem[]> {
  try {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error("Failed to fetch items");
    const data = await response.json();
    setLocal("fallback_items", data);
    return data;
  } catch {
    return getLocal("fallback_items", INITIAL_ITEMS);
  }
}

export async function createItem(item: CreateItemInput): Promise<ApiItem> {
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to create item");
    return await response.json();
  } catch {
    const current = getLocal("fallback_items", INITIAL_ITEMS);
    const newItem: ApiItem = { ...item, id: String(Date.now()) };
    const updated = [newItem, ...current];
    setLocal("fallback_items", updated);
    return newItem;
  }
}

export async function getItem(id: string | number): Promise<ApiItem> {
  try {
    const response = await fetch(`${API_URL}/items/${id}`);
    if (!response.ok) throw new Error("Failed to fetch item");
    return await response.json();
  } catch {
    const items = getLocal("fallback_items", INITIAL_ITEMS);
    const found = items.find((i) => String(i.id) === String(id));
    if (!found) throw new Error("Item not found");
    return found;
  }
}

export async function getClaims(): Promise<ApiClaim[]> {
  try {
    const response = await fetch(`${API_URL}/claims`);
    if (!response.ok) throw new Error("Failed to fetch claims");
    const data = await response.json();
    setLocal("fallback_claims", data);
    return data;
  } catch {
    return getLocal("fallback_claims", INITIAL_CLAIMS);
  }
}

export async function createClaim(claim: CreateClaimInput): Promise<ApiClaim> {
  try {
    const response = await fetch(`${API_URL}/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(claim),
    });
    if (!response.ok) throw new Error("Failed to create claim");
    return await response.json();
  } catch {
    const current = getLocal("fallback_claims", INITIAL_CLAIMS);
    const newClaim: ApiClaim = { ...claim, id: String(Date.now()) };
    const updated = [newClaim, ...current];
    setLocal("fallback_claims", updated);
    return newClaim;
  }
}

export async function updateItemStatus(id: string | number, status: ItemStatus): Promise<ApiItem> {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update item status");
    return await response.json();
  } catch {
    const current = getLocal("fallback_items", INITIAL_ITEMS);
    let updatedItem: ApiItem | null = null;
    const updated = current.map((i) => {
      if (String(i.id) === String(id)) {
        updatedItem = { ...i, status };
        return updatedItem;
      }
      return i;
    });
    setLocal("fallback_items", updated);
    if (!updatedItem) throw new Error("Item not found");
    return updatedItem;
  }
}

export async function updateClaimStatus(id: number | string, status: string, reviewedAt: string): Promise<ApiClaim> {
  try {
    const response = await fetch(`${API_URL}/claims/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewedAt }),
    });
    if (!response.ok) throw new Error("Failed to update claim status");
    return await response.json();
  } catch {
    const current = getLocal("fallback_claims", INITIAL_CLAIMS);
    let updatedClaim: ApiClaim | null = null;
    const updated = current.map((c) => {
      if (String(c.id) === String(id)) {
        updatedClaim = { ...c, status: status as any, reviewedAt };
        return updatedClaim;
      }
      return c;
    });
    setLocal("fallback_claims", updated);
    if (!updatedClaim) throw new Error("Claim not found");
    return updatedClaim;
  }
}

export async function updateUserActiveStatus(id: number | string, isActive: boolean): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error("Failed to update user active status");
    return await response.json();
  } catch {
    const current = getLocal("fallback_users", INITIAL_USERS);
    let updatedUser: User | null = null;
    const updated = current.map((u) => {
      if (String(u.id) === String(id)) {
        updatedUser = { ...u, isActive };
        return updatedUser;
      }
      return u;
    });
    setLocal("fallback_users", updated);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }
}
