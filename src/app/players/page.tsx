import { PlayersIndex } from "@/components/pros/ProIndexes";
import { playersIndexSeo } from "@/lib/proPages";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(playersIndexSeo);

export default function PlayersPage() {
  return <PlayersIndex />;
}
