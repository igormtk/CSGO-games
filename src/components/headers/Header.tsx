import Link from "@/components/LocalLink";
import { Crosshair } from "lucide-react";
import { Navigation } from "../navigations/Navigation";
import { LanguageSelect } from "./LanguageSelect";

export default function Header() {
  return (
    <header className="relative z-40 shrink-0 border-b-2 border-cs-orange/60 bg-cs-panel">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-4 sm:h-14 short:h-11">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xl font-bold uppercase tracking-[0.1em] transition hover:opacity-80 sm:text-2xl"
        >
          <Crosshair className="h-5 w-5 text-cs-orange" />
          CS<span className="text-cs-orange">Games</span>
        </Link>
        <div className="flex items-center gap-2">
          <Navigation />
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
}
