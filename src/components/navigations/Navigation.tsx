"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3x3, Home, Menu, UserSearch, X } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { title: "Início", href: "/", icon: Home },
  { title: "CS Bingo", href: "/bingo", icon: Grid3x3 },
  { title: "Adivinhe o jogador", href: "/guess-name", icon: UserSearch },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav aria-label="Jogos">
      <ul className="hidden items-center gap-1 sm:flex">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "cs-cut-sm inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition",
                  active ? "bg-cs-orange text-cs-bg" : "text-cs-text/70 hover:bg-cs-raised hover:text-cs-orange"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="cs-cut-sm grid h-9 w-9 place-items-center bg-cs-raised text-cs-text transition hover:text-cs-orange sm:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b-2 border-cs-orange/60 bg-cs-panel px-4 py-2 shadow-2xl shadow-black/60 sm:hidden"
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
                  {link.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </nav>
  );
}
