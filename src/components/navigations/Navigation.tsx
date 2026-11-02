"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/LocalLink";
import { splitLanguage } from "@/lib/i18n";
import {
  ArrowUpDown,
  ChevronDown,
  Grid3x3,
  Home,
  LayoutGrid,
  Menu,
  Route,
  ScanFace,
  Shirt,
  Timer,
  UserSearch,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

type NavLink = {
  title: Record<Language, string>;
  href: string;
  icon: typeof Home;
  // Aparece direto na barra do desktop; os demais ficam no dropdown "Mais".
  primary?: boolean;
};

// Mesma ordem dos cards da home (src/app/page.tsx).
const links: NavLink[] = [
  { title: { pt: "Início", en: "Home", es: "Inicio" }, href: "/", icon: Home, primary: true },
  { title: { pt: "CS Bingo", en: "CS Bingo", es: "CS Bingo" }, href: "/bingo", icon: Grid3x3, primary: true },
  {
    title: { pt: "Jogador misterioso", en: "Mystery player", es: "Jugador misterioso" },
    href: "/jogador-misterioso",
    icon: ScanFace,
    primary: true,
  },
  {
    title: { pt: "Adivinhe o jogador", en: "Guess the player", es: "Adivina el jugador" },
    href: "/guess-name",
    icon: UserSearch,
    primary: true,
  },
  { title: { pt: "Caminho de carreira", en: "Career path", es: "Camino de carrera" }, href: "/career-path", icon: Route },
  { title: { pt: "Escalação", en: "Lineup", es: "Alineación" }, href: "/lineup", icon: Shirt },
  { title: { pt: "Agrupe os 16", en: "Sort the 16", es: "Agrupa los 16" }, href: "/groups", icon: LayoutGrid },
  { title: { pt: "60 segundos", en: "60 seconds", es: "60 segundos" }, href: "/60-seconds", icon: Timer },
  { title: { pt: "Mais ou menos", en: "Higher or lower", es: "Más o menos" }, href: "/higher-or-lower", icon: ArrowUpDown },
  {
    title: { pt: "Bingo multiplayer", en: "Bingo multiplayer", es: "Bingo multijugador" },
    href: "/bingo/multiplayer",
    icon: Users,
  },
];

const primaryLinks = links.filter((link) => link.primary);
const moreLinks = links.filter((link) => !link.primary);

const menuCopy: Record<Language, { nav: string; open: string; close: string; more: string }> = {
  pt: { nav: "Jogos", open: "Abrir menu", close: "Fechar menu", more: "Mais" },
  en: { nav: "Games", open: "Open menu", close: "Close menu", more: "More" },
  es: { nav: "Juegos", open: "Abrir menú", close: "Cerrar menú", more: "Más" },
};

export function Navigation() {
  // Sem o prefixo de idioma: "/pt/bingo" e "/bingo" marcam o mesmo item.
  const pathname = splitLanguage(usePathname()).path;
  // Guarda a página em que o menu foi aberto: ao navegar, deixa de bater e o menu fecha.
  const [openOnPath, setOpenOnPath] = useState<string>();
  const open = openOnPath === pathname;
  const setOpen = (nextOpen: boolean) => setOpenOnPath(nextOpen ? pathname : undefined);
  const [moreOnPath, setMoreOnPath] = useState<string>();
  const moreOpen = moreOnPath === pathname;
  const setMoreOpen = (nextOpen: boolean) => setMoreOnPath(nextOpen ? pathname : undefined);
  const moreRef = useRef<HTMLLIElement>(null);
  const language = useLanguage();
  const copy = menuCopy[language];
  const moreActive = moreLinks.some((link) => link.href === pathname);

  // Fecha o dropdown "Mais" ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOnPath(undefined);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOnPath(undefined);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  return (
    <nav aria-label={copy.nav}>
      <ul className="hidden items-center gap-1 lg:flex">
        {primaryLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "cs-cut-sm inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition",
                  active ? "bg-cs-orange text-cs-bg" : "text-cs-text/70 hover:bg-cs-raised hover:text-cs-orange"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.title[language]}
              </Link>
            </li>
          );
        })}
        <li ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            aria-expanded={moreOpen}
            aria-controls="more-menu"
            className={cn(
              "cs-cut-sm inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition",
              moreActive ? "bg-cs-orange text-cs-bg" : "text-cs-text/70 hover:bg-cs-raised hover:text-cs-orange"
            )}
          >
            {copy.more}
            <ChevronDown className={cn("h-4 w-4 transition", moreOpen && "rotate-180")} />
          </button>
          {moreOpen ? (
            <ul
              id="more-menu"
              className="absolute right-0 top-full mt-2 min-w-56 border-2 border-cs-orange/60 bg-cs-panel py-1 shadow-2xl shadow-black/60"
            >
              {moreLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 whitespace-nowrap border-l-4 px-3 py-2 text-sm font-bold uppercase tracking-wider transition",
                        active
                          ? "border-cs-orange bg-cs-raised text-cs-orange"
                          : "border-transparent text-cs-text/80 hover:border-cs-line hover:bg-cs-surface hover:text-cs-orange"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.title[language]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </li>
      </ul>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? copy.close : copy.open}
        className="cs-cut-sm grid h-9 w-9 place-items-center bg-cs-raised text-cs-text transition hover:text-cs-orange lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b-2 border-cs-orange/60 bg-cs-panel px-4 py-2 shadow-2xl shadow-black/60 sm:grid sm:grid-cols-2 sm:gap-x-4 lg:hidden"
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 border-l-4 px-3 py-3 text-lg font-bold uppercase tracking-wider transition",
                    active
                      ? "border-cs-orange bg-cs-raised text-cs-orange"
                      : "border-transparent text-cs-text/80 hover:border-cs-line hover:bg-cs-surface"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.title[language]}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </nav>
  );
}
