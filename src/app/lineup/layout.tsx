import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.lineup);

export default function LineupLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="lineup" seo={pageSeo.lineup}>
      {children}
    </GameSeo>
  );
}
