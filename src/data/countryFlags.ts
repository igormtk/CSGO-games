export const countryFlags: Record<string, string> = {
  Brazil: "🇧🇷",
  Denmark: "🇩🇰",
  France: "🇫🇷",
  Russia: "🇷🇺",
  Ukraine: "🇺🇦",
  Israel: "🇮🇱",
  "Bosnia and Herzegovina": "🇧🇦",
  Canada: "🇨🇦",
  Estonia: "🇪🇪",
  Norway: "🇳🇴",
  Sweden: "🇸🇪",
  "United States": "🇺🇸",
  Kazakhstan: "🇰🇿",
  Latvia: "🇱🇻",
  "United Kingdom": "🇬🇧",
  Hungary: "🇭🇺",
  Slovakia: "🇸🇰",
  Romania: "🇷🇴",
  Finland: "🇫🇮",
  Lithuania: "🇱🇹",
  Mongolia: "🇲🇳",
  Poland: "🇵🇱",
  Bulgaria: "🇧🇬",
  Australia: "🇦🇺",
  Spain: "🇪🇸",
  "Czech Republic": "🇨🇿",
  Germany: "🇩🇪",
  Turkey: "🇹🇷",
  "South Africa": "🇿🇦",
  Kosovo: "🇽🇰",
  Guatemala: "🇬🇹",
  "South Korea": "🇰🇷",
  Belgium: "🇧🇪",
  Belarus: "🇧🇾",
  Argentina: "🇦🇷",
};

export const getCountryFlag = (country: string) => countryFlags[country] ?? "🏳️";

const LOCALE_BY_LANGUAGE = { pt: "pt-BR", en: "en", es: "es" } as const;

// A bandeira é o código ISO em letras regionais (🇧🇷 = B R): o navegador traduz o nome do país.
export const getCountryName = (country: string, language: keyof typeof LOCALE_BY_LANGUAGE) => {
  const flag = countryFlags[country];
  if (!flag) return country;
  const code = [...flag].map((char) => String.fromCharCode(char.codePointAt(0)! - 0x1f1e6 + 65)).join("");
  try {
    return new Intl.DisplayNames([LOCALE_BY_LANGUAGE[language]], { type: "region" }).of(code) ?? country;
  } catch {
    return country;
  }
};
