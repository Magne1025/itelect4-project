# Campus Lost & Found — ITELECT4

A modern React web application for a campus Lost & Found system where finders post items, claimers submit claims, and admins review them.

## Tech Stack

This project is built using:
- **React** (via Vite)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** (Accessible components like Button, Input, Label, etc.)
- **React Hook Form** + **Zod** (For robust, type-safe form validation)
- **TanStack Query** (For data fetching and state management)

## Getting Started

First, ensure you have the dependencies installed:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Features

- **Item Reporting**: Report a found item with a type-safe form validated by Zod.
- **Form Validation**: Submissions are strictly validated to prevent invalid data. Certain sensitive categories require highly descriptive inputs.
- **Modern UI**: Clean and responsive design using Tailwind CSS and glassmorphism.
- **State Management**: TanStack Query ensures data is properly cached, synchronized, and updated upon successful mutations.

## Form Validation Rules

When reporting a new found item, the following rules apply:
- **Title**: Required, 3–100 characters.
- **Description**: Required, at least 20 characters.
- **Location**: Required, at least 3 characters.
- **Category**: Must be a valid predefined category.
- **IDs & Documents (Refinement)**: If the item is an ID or Document, the description must be at least 50 characters to ensure the owner can be correctly verified.

## TypeScript Requirements

This project also focuses on strict TypeScript enforcement:
- Interfaces (`User`, `Item`, `Claim`)
- Derived form types (`z.infer`)
- Enums (`UserRole`, `ClaimStatus`, `ItemStatus`)
- Zero TypeScript errors on build

```bash
npx tsc -b
```
