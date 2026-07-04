import { NextRequest, NextResponse } from "next/server";
import { isCjConfigured } from "@/lib/cj/config";
import { CjApiError } from "@/lib/cj/client";
import { fetchCjProductDetail } from "@/lib/cj/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pid: string }> }
) {
  const { pid } = await params;

  if (!isCjConfigured()) {
    return NextResponse.json(
      { error: "CJ Dropshipping is not configured" },
      { status: 503 }
    );
  }

  try {
    const product = await fetchCjProductDetail(pid);
    return NextResponse.json({ product });
  } catch (error) {
    const message =
      error instanceof CjApiError ? error.message : "Product not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
