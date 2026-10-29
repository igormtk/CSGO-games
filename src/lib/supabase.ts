import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Projeto "CS GO" (organização igormtk). URL e chave publicável são públicas por natureza: o banco
// só permite leitura com elas, e o multiplayer usa canais temporários do Realtime (sem tabelas).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tjcfnqjxnhmqrxnqowuf.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_Syug7J7CRK-QlPyJ-lMINw_-inNmgT_";

let client: SupabaseClient | undefined;

export const getSupabase = () => {
  client ??= createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return client;
};
