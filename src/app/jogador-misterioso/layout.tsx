import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.mystery);

export default function MysteryPlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="mystery" seo={pageSeo.mystery}>
      {children}
    </GameSeo>
  );
}
