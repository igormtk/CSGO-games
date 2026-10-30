import { TeamsIndex } from "@/components/pros/ProIndexes";
import { teamsIndexSeo } from "@/lib/proPages";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(teamsIndexSeo);

export default function TeamsPage() {
  return <TeamsIndex />;
}
