import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.higherLower, { game: "higherLower" });

export default function HigherOrLowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="higherLower" seo={pageSeo.higherLower}>
      {children}
    </GameSeo>
  );
}
