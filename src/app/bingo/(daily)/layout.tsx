import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.bingo);

export default function BingoLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="bingo" seo={pageSeo.bingo}>
      {children}
    </GameSeo>
  );
}
