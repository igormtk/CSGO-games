import { ArchiveView } from "@/components/daily/ArchiveView";
import { pageSeo } from "@/data/pageSeo";
import { localizedMetadata } from "@/lib/seo";

export const generateMetadata = () => localizedMetadata(pageSeo.archive);

export default function ArchivePage() {
  return <ArchiveView />;
}
