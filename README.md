# Campus Lost & Found — ITELECT4 GT1

A campus Lost & Found app: finders post items, claimers submit claims, and admins review them. This GT1 deliverable covers TypeScript foundations (interfaces, generics, utility types, enums).

## Core entities

| Entity | Notes |
|--------|--------|
| **User** | Roles: `finder` / `claimer` / `admin` |
| **Item** | List entity; status: `open` → `claimed` → `closed` |
| **Claim** | Detail under an item; status: `pending` → `approved` → `completed` |

## How to use

```bash
npm install
npm start
```

Then use the menu:

| Key | Action |
|-----|--------|
| `1` | List all items |
| `2` | View item detail |
| `3` | List users |
| `4` | List all claims |
| `5` | Submit a claim |
| `6` | Approve a claim |
| `7` | Reject a claim |
| `8` | Complete a claim |
| `q` | Quit |

Typecheck (GT1 requirement):

```bash
npx tsc --noEmit
```

## GT1 Part 1 checklist

- Interfaces in `types/index.ts` (`User`, `Item`, `Claim`)
- Generic `ApiResponse<T>`
- Generic helpers: `getById`, `getFirst`
- Utility types: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`
- Enums: `UserRole`, `ClaimStatus`, `ItemStatus`

## Tag

Submission tag: `gt1`
