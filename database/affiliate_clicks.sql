-- Cliques nos links de afiliado da Amazon (/go/amazon/<produto>), para saber quais produtos e quais
-- lugares do site geram cliques. Aplicado no Supabase pelas migrações "affiliate_clicks" e
-- "affiliate_clicks_insert_policy".
--
-- Sem dado pessoal: só produto, lugar, loja e país (o que a Vercel informa), sem IP nem identificador.
-- O site só consegue gravar (com a chave publicável); ninguém lê a tabela pela API. Os números ficam
-- no painel do Supabase (SQL Editor): SELECT * FROM affiliate_clicks_summary;

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  product TEXT NOT NULL CHECK (char_length(product) <= 80),
  -- rail: colunas laterais; post-game: fim de jogo; guide: guias de equipamento.
  placement TEXT NOT NULL CHECK (placement IN ('rail', 'post-game', 'guide', 'other')),
  store TEXT NOT NULL CHECK (store IN ('br', 'us')),
  country TEXT CHECK (country IS NULL OR char_length(country) = 2)
);

CREATE INDEX IF NOT EXISTS affiliate_clicks_clicked_at_idx ON affiliate_clicks (clicked_at);

-- Visitante anônimo só insere, e só as colunas de dados (data e id são do banco).
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON affiliate_clicks FROM anon, authenticated;
GRANT INSERT (product, placement, store, country) ON affiliate_clicks TO anon;
CREATE POLICY "site grava cliques" ON affiliate_clicks FOR INSERT TO anon WITH CHECK (true);

-- Resumo dos últimos 30 dias, por produto e lugar. Só para o painel (sem acesso pela API).
CREATE OR REPLACE VIEW public.affiliate_clicks_summary
WITH (security_invoker = true) AS
SELECT
  product,
  placement,
  store,
  count(*) AS clicks,
  max(clicked_at) AS last_click
FROM public.affiliate_clicks
WHERE clicked_at > now() - INTERVAL '30 days'
GROUP BY product, placement, store
ORDER BY clicks DESC;

REVOKE ALL ON public.affiliate_clicks_summary FROM anon, authenticated;
