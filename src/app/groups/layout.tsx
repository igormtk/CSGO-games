import { GameSeo } from "@/components/seo/GameSeo";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.groups);

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameSeo game="groups" seo={pageSeo.groups}>
      {children}
    </GameSeo>
  );
}
