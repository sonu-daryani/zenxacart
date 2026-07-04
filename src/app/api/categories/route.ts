import { NextResponse } from "next/server";
import { categories as staticCategories } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  // Serves categories from the backend so UI components don't import static data directly.
  // Swap staticCategories for a DB query when categories become fully database-driven.
  return NextResponse.json({ categories: staticCategories });
}
