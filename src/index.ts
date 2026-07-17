import {
  UserRole,
  ClaimStatus,
  ItemStatus,
  getById,
  getFirst,
  createClaimPreview,
  type User,
  type Item,
  type Claim,
  type ApiResponse,
  type UpdateItemInput,
  type PublicUser,
  type ClaimStatusLabels,
  type ClaimPreviewFromFn,
} from "../types/index";

// ===== SAMPLE DATA =====
const users: User[] = [
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

const items: Item[] = [
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
];

const claims: Claim[] = [
  {
    id: 501,
    itemId: 102,
    claimerId: 2,
    message: "I lost my lace after PE class.",
    status: ClaimStatus.Pending,
    createdAt: new Date("2026-07-13"),
  },
];

// ===== GENERIC ApiResponse USAGE =====
const itemsResponse: ApiResponse<Item[]> = {
  success: true,
  data: items,
  message: "Items loaded",
};

const claimResponse: ApiResponse<Claim> = {
  success: true,
  data: claims[0]!,
  message: "Claim found",
};

// ===== GENERIC FUNCTIONS =====
const foundItem = getById(items, 101);
const firstUser = getFirst(users);

// ===== UTILITY TYPE USAGE =====
const itemPatch: UpdateItemInput = {
  status: ItemStatus.Claimed,
  location: "Security Office",
};

const publicUser: PublicUser = {
  id: users[0]!.id,
  name: users[0]!.name,
  role: users[0]!.role,
  isActive: users[0]!.isActive,
};

const statusLabels: ClaimStatusLabels = {
  [ClaimStatus.Pending]: "Waiting for review",
  [ClaimStatus.Approved]: "Approved by admin",
  [ClaimStatus.Rejected]: "Rejected",
  [ClaimStatus.Completed]: "Handed over",
};

const preview: ClaimPreviewFromFn = createClaimPreview(claims[0]!);

console.log("Campus Lost & Found — GT1 Part 1");
console.log("API items:", itemsResponse.data.length, itemsResponse.message);
console.log("First claim:", claimResponse.data.id, claimResponse.data.status);
console.log("getById(101):", foundItem?.title);
console.log("getFirst(users):", firstUser?.name);
console.log("UpdateItemInput:", itemPatch);
console.log("PublicUser:", publicUser);
console.log("Status label:", statusLabels[ClaimStatus.Pending]);
console.log("Claim preview:", preview);
