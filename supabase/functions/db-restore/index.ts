import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const TOKEN = "1b0f0b79c00bae79baf718d816e53c21";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok");

  if (req.headers.get("x-restore-token") !== TOKEN) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const chunk = url.searchParams.get("chunk");
  if (!chunk || !/^[0-9]{2}$/.test(chunk)) {
    return new Response(JSON.stringify({ error: "bad chunk" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!dbUrl) {
    return new Response(JSON.stringify({ error: "no SUPABASE_DB_URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let sql: string;
  try {
    sql = await Deno.readTextFile(
      new URL(`./chunk${chunk}.sql`, import.meta.url),
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: `read failed: ${e}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Client(dbUrl);
  try {
    await client.connect();
    await client.queryArray(sql);
    const res = await client.queryObject<{ n: bigint }>(
      "select count(*)::bigint as n from information_schema.tables where table_schema='public'",
    );
    return new Response(
      JSON.stringify({
        ok: true,
        chunk,
        bytes: sql.length,
        public_tables: Number(res.rows[0].n),
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, chunk, error: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } finally {
    try {
      await client.end();
    } catch (_) {
      // ignore
    }
  }
});
