import { after, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getGearProduct } from "@/data/gear";
import { amazonProductUrl, amazonStoreFor } from "@/lib/amazon";
import { getSupabase } from "@/lib/supabase";

// Lugar do site de onde veio o clique (?from=), para comparar o que vende em cada espaço.
const placements = new Set(["rail", "post-game", "guide"]);

// Robôs e prévias de link (WhatsApp, Discord...) também "clicam": ficam fora da contagem.
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|discord|telegram|headless/i;

// Redireciona para o produto na loja Amazon do país do visitante. O país vem da Vercel; a resposta
// muda de visitante para visitante, então não pode ficar em cache.
export async function GET(request: NextRequest, { params }: { params: Promise<{ product: string }> }) {
  const product = getGearProduct((await params).product);
  if (!product) return new NextResponse("Not found", { status: 404 });

  const country = request.headers.get("x-vercel-ip-country");
  const store = amazonStoreFor(country);
  const from = request.nextUrl.searchParams.get("from") ?? "";
  const isBot = BOT_PATTERN.test(request.headers.get("user-agent") ?? "");

  // Conta o clique depois de responder, para o redirecionamento não esperar pelo banco
  // (database/affiliate_clicks.sql). Falha ao gravar não atrapalha quem clicou.
  if (!isBot) {
    after(async () => {
      await getSupabase()
        .from("affiliate_clicks")
        .insert({
          product: product.id,
          placement: placements.has(from) ? from : "other",
          store: store.key,
          country: country && /^[A-Za-z]{2}$/.test(country) ? country : null,
        });
    });
  }

  const response = NextResponse.redirect(amazonProductUrl(store, product), 302);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
