import { z } from "zod";

/** Valid item categories matching the app's category list. */
export const ITEM_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "IDs & Documents",
  "Keys",
  "Other",
] as const;

/**
 * Zod schema for the Report Found Item form.
 *
 * Rules:
 *  1. title     — required, 3–100 characters
 *  2. description — required, at least 20 characters
 *  3. location  — required, at least 3 characters
 *  4. category  — must be one of the predefined ITEM_CATEGORIES
 *
 * .refine() rule:
 *  When the category is "IDs & Documents" (sensitive items like passports,
 *  student IDs, licenses), the description must be at least 50 characters so
 *  that the owner can be properly identified before the item is returned.
 */
export const reportItemSchema = z
  .object({
    title: z
      .string()
      .min(3, "Item title must be at least 3 characters.")
      .max(100, "Item title must be at most 100 characters."),

    description: z
      .string()
      .min(
        20,
        "Description must be at least 20 characters — describe color, brand, and markings."
      ),

    location: z
      .string()
      .min(3, "Location must be at least 3 characters (e.g. 'Library 2F')."),

    category: z.enum(ITEM_CATEGORIES, {
      error: "Please select a valid category.",
    }),
  })
  .refine(
    (data) =>
      data.category !== "IDs & Documents" || data.description.length >= 50,
    {
      message:
        "ID & Document items are sensitive — please provide at least 50 characters describing the document so the owner can be verified.",
      path: ["description"],
    }
  );

/** TypeScript type derived from the schema — do NOT hand-write this. */
export type ReportItemFormValues = z.infer<typeof reportItemSchema>;
