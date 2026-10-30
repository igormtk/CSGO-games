import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.sixtySeconds);

export default function SixtySecondsLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="sixtySeconds" seo={pageSeo.sixtySeconds}>
      {children}
    </GameSeo>
  );
}
