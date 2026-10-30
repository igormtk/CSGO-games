import Link from "@/components/LocalLink";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  description: string;
  linkTo: string;
  icon: LucideIcon;
  tag: string;
  cta: string;
};

export function DefaultCard({ title, description, linkTo, icon: Icon, tag, cta }: CardProps) {
  return (
    <Link
      href={linkTo}
      className="cs-cut group block h-full bg-cs-line p-[2px] shadow-2xl shadow-black/50 transition hover:bg-cs-orange/70"
    >
      <div className="cs-cut flex h-full flex-col bg-cs-surface">
        <div className="flex items-center justify-between gap-3 border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-4 py-2.5 sm:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="cs-cut-sm grid h-10 w-10 shrink-0 place-items-center bg-cs-bg text-cs-orange">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="min-w-0 text-xl font-bold uppercase leading-none tracking-wide sm:text-2xl lg:text-xl">{title}</h2>
          </div>
          <span className="cs-cut-sm shrink-0 whitespace-nowrap bg-cs-bg px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-cs-gold">
            {tag}
          </span>
        </div>
        <p className="flex-1 px-4 py-2 text-sm font-semibold leading-5 text-cs-text/70 sm:py-3 sm:text-base sm:leading-6">{description}</p>
        <div className="px-4 pb-3 sm:pb-4">
          <span className="cs-cut-sm inline-flex items-center gap-1 bg-cs-orange px-4 py-1.5 text-base font-bold uppercase tracking-wider text-cs-bg transition group-hover:bg-[#ffb85a]">
            {cta} <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
