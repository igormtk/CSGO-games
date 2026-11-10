import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getGearProduct } from "@/data/gear";
import { amazonProductUrl, amazonStoreFor } from "@/lib/amazon";

// Redireciona para o produto na loja Amazon do país do visitante. O país vem da Vercel; a resposta
// muda de visitante para visitante, então não pode ficar em cache.
export async function GET(request: NextRequest, { params }: { params: Promise<{ product: string }> }) {
  const product = getGearProduct((await params).product);
  if (!product) return new NextResponse("Not found", { status: 404 });

  const store = amazonStoreFor(request.headers.get("x-vercel-ip-country"));
  const response = NextResponse.redirect(amazonProductUrl(store, product), 302);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
