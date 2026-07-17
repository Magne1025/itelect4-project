# Campus Lost & Found — ITELECT4 GT1

A campus Lost & Found app: finders post items, claimers submit claims, and admins review them. This GT1 deliverable covers TypeScript foundations (interfaces, generics, utility types, enums).

## Core entities

| Entity | Notes |
|--------|--------|
| **User** | Roles: `finder` / `claimer` / `admin` |
| **Item** | List entity; status: `open` → `claimed` → `closed` |
| **Claim** | Detail under an item; status: `pending` → `approved` → `completed` |

## GT1 Part 1 checklist

- Interfaces in `types/index.ts` (`User`, `Item`, `Claim`)
- Generic `ApiResponse<T>`
- Generic helpers: `getById`, `getFirst`
- Utility types: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`
- Enums: `UserRole`, `ClaimStatus`, `ItemStatus`

## How to run

```bash
npm install
npx tsc --noEmit
```

Optional — print sample data (needs a TS runner or build step):

```bash
npx vite-node src/index.ts
```

## Tag

Submission tag: `gt1`
