import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
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

const statusLabels: ClaimStatusLabels = {
  [ClaimStatus.Pending]: "Waiting for review",
  [ClaimStatus.Approved]: "Approved by admin",
  [ClaimStatus.Rejected]: "Rejected",
  [ClaimStatus.Completed]: "Handed over",
};

const rl = readline.createInterface({ input, output });

function listItems(): void {
  const response: ApiResponse<Item[]> = {
    success: true,
    data: items,
    message: "Items loaded",
  };

  console.log("\n=== Lost & Found Items ===");
  for (const item of response.data) {
    const itemClaims = claims.filter((c) => c.itemId === item.id);
    const claimIds =
      itemClaims.length === 0
        ? "no claims"
        : `claim id(s): ${itemClaims.map((c) => c.id).join(", ")}`;
    console.log(`  Item ID [${item.id}] ${item.title} — ${item.status} @ ${item.location}`);
    console.log(`             ${claimIds}`);
  }
  console.log(`(${response.data.length} items)\n`);
}

function listClaims(): void {
  console.log("\n=== All Claims ===");
  if (claims.length === 0) {
    console.log("  (none yet)\n");
    return;
  }

  for (const claim of claims) {
    const item = getById(items, claim.itemId);
    const claimer = getById(users, claim.claimerId);
    console.log(
      `  Claim ID [${claim.id}] → Item [${claim.itemId}] ${item?.title ?? "?"} — ${claim.status}`,
    );
    console.log(`             by ${claimer?.name ?? "?"} — "${claim.message}"`);
  }
  console.log();
}

function showItem(id: number): void {
  const item = getById(items, id);
  if (!item) {
    console.log(`\nNo item with id ${id}.\n`);
    return;
  }

  const reporter = getById(users, item.reportedById);
  const itemClaims = claims.filter((c) => c.itemId === item.id);

  console.log("\n=== Item Detail ===");
  console.log(`  Item ID:     ${item.id}`);
  console.log(`  Title:       ${item.title}`);
  console.log(`  Description: ${item.description}`);
  console.log(`  Location:    ${item.location}`);
  console.log(`  Status:      ${item.status}`);
  console.log(`  Reported by: ${reporter?.name ?? "Unknown"}`);
  console.log("  Claims:");

  if (itemClaims.length === 0) {
    console.log("    (none yet)");
  } else {
    for (const claim of itemClaims) {
      const claimer = getById(users, claim.claimerId);
      const preview = createClaimPreview(claim);
      console.log(
        `    Claim ID [${preview.id}] ${claimer?.name ?? "?"} — ${preview.status} (${statusLabels[preview.status]})`,
      );
      console.log(`         "${claim.message}"`);
    }
  }
  console.log();
}

function nextClaimId(): number {
  const ids = claims.map((c) => c.id);
  return (ids.length === 0 ? 500 : Math.max(...ids)) + 1;
}

async function submitClaim(): Promise<void> {
  const openItems = items.filter((i) => i.status === ItemStatus.Open);
  if (openItems.length === 0) {
    console.log("\nNo open items available to claim.\n");
    return;
  }

  console.log("\n=== Claim an item (for owners) ===");
  console.log("Open items you can claim:");
  for (const item of openItems) {
    console.log(`  Item ID [${item.id}] ${item.title} @ ${item.location}`);
  }

  const itemId = Number(await rl.question("\nItem ID to claim: "));
  const item = getById(items, itemId);
  if (!item) {
    console.log("\nItem not found.\n");
    return;
  }
  if (item.status !== ItemStatus.Open) {
    console.log(`\nItem [${item.id}] is "${item.status}" — only open items can be claimed.\n`);
    return;
  }

  const claimers = users.filter((u) => u.role === UserRole.Claimer && u.isActive);
  console.log("\nWho are you?");
  for (const user of claimers) {
    console.log(`  User ID [${user.id}] ${user.name}`);
  }

  const claimerId = Number(await rl.question("Your User ID: "));
  const claimer = getById(users, claimerId);
  if (!claimer || claimer.role !== UserRole.Claimer) {
    console.log("\nInvalid claimer. Use a User ID with role claimer (see list above).\n");
    return;
  }

  const alreadyClaimed = claims.some(
    (c) => c.itemId === item.id && c.claimerId === claimer.id && c.status !== ClaimStatus.Rejected,
  );
  if (alreadyClaimed) {
    console.log("\nYou already have an active claim on this item.\n");
    return;
  }

  const message = (await rl.question("Why is this yours? (short proof): ")).trim();
  if (!message) {
    console.log("\nMessage is required so admin can review your claim.\n");
    return;
  }

  const newClaim: Claim = {
    id: nextClaimId(),
    itemId: item.id,
    claimerId: claimer.id,
    message,
    status: ClaimStatus.Pending,
    createdAt: new Date(),
  };
  claims.push(newClaim);

  console.log(`\nClaim submitted!`);
  console.log(`  Claim ID [${newClaim.id}] on Item [${item.id}] ${item.title}`);
  console.log(`  Status: ${newClaim.status} (${statusLabels[newClaim.status]})`);
  console.log(`  Wait for an admin to approve it (menu option 6).\n`);
}

function setClaimStatus(claimId: number, status: ClaimStatus): void {
  const claim = getById(claims, claimId);
  if (!claim) {
    console.log(`\nNo claim with id ${claimId}.\n`);
    return;
  }

  claim.status = status;
  claim.reviewedAt = new Date();

  const item = getById(items, claim.itemId);
  if (item && status === ClaimStatus.Approved) {
    const patch: UpdateItemInput = { status: ItemStatus.Claimed };
    Object.assign(item, patch);
  }
  if (item && status === ClaimStatus.Completed) {
    const patch: UpdateItemInput = { status: ItemStatus.Closed };
    Object.assign(item, patch);
  }

  console.log(`\nClaim ${claimId} is now: ${status} (${statusLabels[status]})\n`);
}

function listUsers(): void {
  console.log("\n=== Users ===");
  for (const user of users) {
    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
    console.log(`  User ID [${publicUser.id}] ${publicUser.name} — ${publicUser.role}`);
  }
  const first = getFirst(users);
  console.log(`(first user: ${first?.name})\n`);
}

function printHelp(): void {
  console.log(`
Campus Lost & Found — menu
  --- Browse ---
  1  List all items (Item ID + Claim ID)
  2  View item detail
  3  List users
  4  List all claims

  --- For people claiming their item ---
  5  Submit a claim on an open item

  --- For admin ---
  6  Approve a claim
  7  Reject a claim
  8  Complete a claim (handed over)

  q  Quit
`);
}

async function askClaimId(action: string): Promise<number> {
  listClaims();
  const idText = await rl.question(`Claim ID to ${action}: `);
  return Number(idText);
}

async function main(): Promise<void> {
  console.log("Campus Lost & Found (easy menu)");
  printHelp();

  while (true) {
    const choice = (await rl.question("> ")).trim().toLowerCase();

    if (choice === "q" || choice === "quit") {
      console.log("Bye!");
      break;
    }

    if (choice === "") {
      continue;
    }

    if (choice === "1") {
      listItems();
      continue;
    }

    if (choice === "2") {
      const idText = await rl.question("Item ID: ");
      showItem(Number(idText));
      continue;
    }

    if (choice === "3") {
      listUsers();
      continue;
    }

    if (choice === "4") {
      listClaims();
      continue;
    }

    if (choice === "5") {
      await submitClaim();
      continue;
    }

    if (choice === "6") {
      setClaimStatus(await askClaimId("approve"), ClaimStatus.Approved);
      continue;
    }

    if (choice === "7") {
      setClaimStatus(await askClaimId("reject"), ClaimStatus.Rejected);
      continue;
    }

    if (choice === "8") {
      setClaimStatus(await askClaimId("complete"), ClaimStatus.Completed);
      continue;
    }

    console.log("Unknown option.\n");
  }

  rl.close();
}

void main();
