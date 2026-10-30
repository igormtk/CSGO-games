import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.careerPath);

export default function CareerPathLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="careerPath" seo={pageSeo.careerPath}>
      {children}
    </GameSeo>
  );
}
