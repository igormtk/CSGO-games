import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.guessName);

export default function GuessNameLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="guessName" seo={pageSeo.guessName}>
      {children}
    </GameSeo>
  );
}
