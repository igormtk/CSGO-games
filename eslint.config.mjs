import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Regras do Next (React, hooks, acessibilidade e Core Web Vitals) no formato de configuração do ESLint 9.
const config = [
  ...nextCoreWebVitals,
  { ignores: [".next/**", "node_modules/**", "graphify-out/**", "videos/**", "next-env.d.ts"] },
];

export default config;
