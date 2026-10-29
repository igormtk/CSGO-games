import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adsenseClient, adsenseCsp } from "@/lib/adsense";

// Proxy (no Next 15 se chamava middleware). Política de conteúdo com nonce: a cada visita sai um
// código novo, e só os scripts que o Next marca com ele podem rodar ('strict-dynamic' libera os
// que esses scripts carregarem). Sem nonce seria preciso 'unsafe-inline', que deixa passar
// qualquer script injetado na página.
export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";
  // Com o AdSense ligado, liberamos os iframes e chamadas do Google; as imagens dos anúncios vêm de
  // domínios variados de anunciantes, por isso img-src aceita qualquer endereço HTTPS.
  const ads = Boolean(adsenseClient);

  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob:${ads ? " https:" : ""}`,
    "font-src 'self'",
    // wss: canais em tempo real do Supabase (bingo multiplayer).
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co${ads ? ` ${adsenseCsp.connect.join(" ")}` : ""}${isDev ? " ws:" : ""}`,
    ...(ads ? [`frame-src ${adsenseCsp.frame.join(" ")}`] : []),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  // O Next lê o nonce da política na requisição e o aplica aos próprios scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: [
    {
      // Páginas apenas: arquivos estáticos, imagens e textos gerados não precisam de nonce.
      source: "/((?!_next/static|_next/image|_vercel/|teams/|partners/|icon.svg|robots.txt|sitemap.xml|llms.txt|ads.txt|opengraph-image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
