import { GuidesHub } from "@/components/content/GuidesHub";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.guides);

export default function GuidesPage() {
  return <GuidesHub />;
}
