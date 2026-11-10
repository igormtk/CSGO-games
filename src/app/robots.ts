import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Robôs de busca e de IA citados nominalmente: o site quer aparecer nas respostas do ChatGPT,
// Claude, Gemini, Perplexity e afins, não só no Google.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /go/ só redireciona para lojas (links de afiliado): não há o que indexar.
      { userAgent: "*", allow: "/", disallow: "/go/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/go/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
