import { NextRequest, NextResponse } from "next/server";
import { isCjConfigured } from "@/lib/cj/config";
import { CjApiError } from "@/lib/cj/client";
import { fetchCjProductList } from "@/lib/cj/products";
import { products as staticProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "20");
  const keyword = searchParams.get("keyword") ?? undefined;

  if (!isCjConfigured()) {
    return NextResponse.json({
      source: "static",
      products: staticProducts,
      total: staticProducts.length,
      page: 1,
      configured: false,
    });
  }

  try {
    const result = await fetchCjProductList({ page, size, keyword });
    return NextResponse.json({
      source: "cj",
      configured: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof CjApiError ? error.message : "Failed to load CJ products";

    return NextResponse.json(
      {
        source: "static",
        products: staticProducts,
        total: staticProducts.length,
        page: 1,
        configured: true,
        error: message,
      },
      { status: 200 }
    );
  }
}
