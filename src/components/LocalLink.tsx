"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocalizePath } from "@/lib/language";

// Link interno que fica no idioma do endereço: em /pt/..., href="/bingo" leva a /pt/bingo. Assim a
// navegação não sai do idioma (e o buscador encontra as páginas de cada idioma pelos links).
export default function LocalLink({ href, ...props }: ComponentProps<typeof Link>) {
  const localize = useLocalizePath();
  return <Link href={typeof href === "string" ? localize(href) : href} {...props} />;
}
