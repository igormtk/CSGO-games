import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.multiplayer);

export default function BingoMultiplayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
