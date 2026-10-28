import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Política de conteúdo com nonce: a cada visita sai um código novo, e só os scripts que o Next
// marca com ele podem rodar ('strict-dynamic' libera os que esses scripts carregarem). Sem nonce
// seria preciso 'unsafe-inline', que deixa passar qualquer script injetado na página.
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";

  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self' https://*.supabase.co${isDev ? " ws:" : ""}`,
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
      source: "/((?!_next/static|_next/image|teams/|partners/|icon.svg|robots.txt|sitemap.xml|llms.txt|opengraph-image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
