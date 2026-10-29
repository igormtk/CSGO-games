"use client";

import { ExternalLink } from "lucide-react";
import type { Partner } from "@/data/partners";
import { useLanguage } from "@/lib/language";

type PartnerSpotProps = {
  partner: Partner;
  // Sem rótulo, usa "Publicidade" no idioma de quem lê.
  label?: string;
  variant: "card" | "banner" | "rail";
};

const defaultLabel = { pt: "Publicidade", en: "Advertisement", es: "Publicidad" };

// Espaço publicitário identificado como "Publicidade", como exige o CONAR.
export function PartnerSpot({ partner: basePartner, label: labelProp, variant }: PartnerSpotProps) {
  const language = useLanguage();
  const label = labelProp ?? defaultLabel[language];
  const partner = { ...basePartner, ...basePartner.translations?.[language] };
  const hasLink = Boolean(partner.href);
  const Wrapper = hasLink ? "a" : "div";
  const linkProps = hasLink ? { href: partner.href, target: "_blank", rel: "sponsored noopener noreferrer" } : {};

  if (variant === "rail") {
    return (
      <Wrapper
        {...linkProps}
        className="cs-cut-sm group flex h-[600px] w-[160px] flex-col overflow-hidden border-t-2 border-cs-gold bg-cs-surface/90 transition hover:bg-cs-raised"
      >
        <span className="px-2 pt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-cs-text/40">{label}</span>
        {partner.railImageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.railImageSrc} alt={partner.sponsor} className="mt-2 w-full flex-1 object-cover" />
        ) : (
          <div className="cs-grid-bg mt-2 flex flex-1 flex-col items-center justify-center gap-4 bg-cs-bg px-3 text-center">
            <p className="text-2xl font-bold uppercase leading-tight tracking-wide text-cs-gold">{partner.headline}</p>
            {partner.description ? (
              <p className="text-sm font-semibold leading-5 text-cs-text/60">{partner.description}</p>
            ) : null}
          </div>
        )}
        {hasLink ? (
          <span className="flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wider text-cs-gold">
            {partner.cta} <ExternalLink className="h-3 w-3" />
          </span>
        ) : null}
      </Wrapper>
    );
  }

  if (variant === "banner") {
    return (
      <Wrapper
        {...linkProps}
        className="cs-cut-sm flex items-center gap-3 border-l-4 border-cs-gold bg-cs-surface/90 px-3 py-2 transition hover:bg-cs-raised"
      >
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-cs-text/40">{label}</span>
        {partner.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.imageSrc} alt={partner.sponsor} className="h-8 w-auto shrink-0" />
        ) : null}
        <span className="min-w-0 flex-1 truncate text-sm font-bold uppercase tracking-wide">
          {partner.headline}
          {partner.description ? <span className="ml-2 font-semibold normal-case text-cs-text/60">{partner.description}</span> : null}
        </span>
        {hasLink ? <span className="shrink-0 text-sm font-bold uppercase tracking-wider text-cs-gold">{partner.cta}</span> : null}
      </Wrapper>
    );
  }

  return (
    <Wrapper {...linkProps} className="cs-cut group block bg-cs-panel transition hover:bg-cs-raised">
      <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cs-text/40">
        {label} · {partner.sponsor}
      </p>
      {partner.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.imageSrc} alt={partner.headline} className="mt-2 aspect-video w-full object-cover" />
      ) : (
        <div className="cs-grid-bg mt-2 grid aspect-video w-full place-items-center bg-cs-bg px-4 text-center">
          <p className="text-2xl font-bold uppercase leading-tight tracking-wide text-cs-gold">{partner.headline}</p>
        </div>
      )}
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <p className="min-w-0 text-sm font-semibold leading-5 text-cs-text/70">{partner.description}</p>
        {hasLink ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold uppercase tracking-wider text-cs-gold">
            {partner.cta} <ExternalLink className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}
