import { DEFAULT_LANGUAGE, isLanguage } from "@/lib/i18n";
import { isOgGame, renderGameImage, renderSiteImage } from "@/lib/ogImage";

// Imagem de prévia dos links (WhatsApp, X, Discord): /og-image?game=careerPath&lang=pt.
// Sem "game" (ou com um jogo desconhecido), a prévia geral do site.
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lang = params.get("lang");
  const language = isLanguage(lang) ? lang : DEFAULT_LANGUAGE;
  const game = params.get("game");
  return isOgGame(game) ? renderGameImage(game, language) : renderSiteImage(language);
}
