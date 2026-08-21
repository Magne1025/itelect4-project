import type { ApiItem, ApiClaim, CreateClaimInput, CreateItemInput, User } from "../types/index";
import { ItemStatus } from "../types/index";

const API_URL = "http://localhost:3000";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function getItems(): Promise<ApiItem[]> {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) throw new Error("Failed to fetch items");
  return response.json();
}

export async function createItem(item: CreateItemInput): Promise<ApiItem> {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("Failed to create item");
  return response.json();
}

export async function getItem(id: string | number): Promise<ApiItem> {
  const response = await fetch(`${API_URL}/items/${id}`);
  if (!response.ok) throw new Error("Failed to fetch item");
  return response.json();
}

export async function getClaims(): Promise<ApiClaim[]> {
  const response = await fetch(`${API_URL}/claims`);
  if (!response.ok) throw new Error("Failed to fetch claims");
  return response.json();
}

export async function createClaim(claim: CreateClaimInput): Promise<ApiClaim> {
  const response = await fetch(`${API_URL}/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(claim),
  });
  if (!response.ok) throw new Error("Failed to create claim");
  return response.json();
}

export async function updateItemStatus(id: string | number, status: ItemStatus): Promise<ApiItem> {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update item status");
  return response.json();
}

export async function updateClaimStatus(id: number, status: string, reviewedAt: string): Promise<ApiClaim> {
  const response = await fetch(`${API_URL}/claims/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reviewedAt }),
  });
  if (!response.ok) throw new Error("Failed to update claim status");
  return response.json();
}

export async function updateUserActiveStatus(id: number, isActive: boolean): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) throw new Error("Failed to update user active status");
  return response.json();
}
