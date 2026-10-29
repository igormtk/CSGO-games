import { adsensePublisherId } from "@/lib/adsense";

// Lista pública de quem pode vender os anúncios do site (padrão ads.txt da IAB). O AdSense exige o
// arquivo para pagar normalmente; sem o código do editor, a rota não existe.
export const dynamic = "force-static";

export function GET() {
  if (!adsensePublisherId) return new Response("Not found", { status: 404 });
  // f08c47fec0942fa0 é o identificador fixo do Google na lista de vendedores da IAB.
  return new Response(`google.com, ${adsensePublisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
