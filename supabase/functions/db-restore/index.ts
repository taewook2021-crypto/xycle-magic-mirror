import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import m00 from "./m00.ts";
import m01 from "./m01.ts";
import m02 from "./m02.ts";
import m03 from "./m03.ts";
import m04 from "./m04.ts";
import m05 from "./m05.ts";
import m06 from "./m06.ts";
import m07 from "./m07.ts";
import m08 from "./m08.ts";
import m09 from "./m09.ts";
import m10 from "./m10.ts";
import m11 from "./m11.ts";
import m12 from "./m12.ts";
import m13 from "./m13.ts";
import m14 from "./m14.ts";
import m15 from "./m15.ts";
import m16 from "./m16.ts";
import m17 from "./m17.ts";
import m18 from "./m18.ts";
import m19 from "./m19.ts";
import m20 from "./m20.ts";
import m21 from "./m21.ts";
import m22 from "./m22.ts";
import m23 from "./m23.ts";
import m24 from "./m24.ts";
import m25 from "./m25.ts";
import m26 from "./m26.ts";
import m27 from "./m27.ts";
import m28 from "./m28.ts";
import m29 from "./m29.ts";
import m30 from "./m30.ts";
import m31 from "./m31.ts";
import m32 from "./m32.ts";
import m33 from "./m33.ts";
import m34 from "./m34.ts";
import m35 from "./m35.ts";
import m36 from "./m36.ts";
import m37 from "./m37.ts";
import m38 from "./m38.ts";
import m39 from "./m39.ts";
import m40 from "./m40.ts";
import m41 from "./m41.ts";
import m42 from "./m42.ts";
import m43 from "./m43.ts";
import m44 from "./m44.ts";
import m45 from "./m45.ts";
import m46 from "./m46.ts";
import m47 from "./m47.ts";
import m48 from "./m48.ts";
import m49 from "./m49.ts";
import m50 from "./m50.ts";
import m51 from "./m51.ts";
import m52 from "./m52.ts";
import m53 from "./m53.ts";
import m54 from "./m54.ts";
import m55 from "./m55.ts";
import m56 from "./m56.ts";
import m57 from "./m57.ts";
import m58 from "./m58.ts";
import m59 from "./m59.ts";
import m60 from "./m60.ts";
import m61 from "./m61.ts";
import m62 from "./m62.ts";
import m63 from "./m63.ts";
import m64 from "./m64.ts";
import m65 from "./m65.ts";
import m66 from "./m66.ts";
import m67 from "./m67.ts";
import m68 from "./m68.ts";
import m69 from "./m69.ts";
import m70 from "./m70.ts";
import m71 from "./m71.ts";
import m72 from "./m72.ts";
import m73 from "./m73.ts";
import m74 from "./m74.ts";
import m75 from "./m75.ts";
import m76 from "./m76.ts";
import m77 from "./m77.ts";
import m78 from "./m78.ts";
import m79 from "./m79.ts";
import m80 from "./m80.ts";
import m81 from "./m81.ts";

const MIGRATIONS: {name:string; sql:string}[] = [
  { name: "20260316153230_2a408686-1d67-4722-93cc-d261c2f5f933.sql", sql: m00 },
  { name: "20260316153330_a6c94cc9-036f-49fd-9184-2745a5974dfa.sql", sql: m01 },
  { name: "20260316153354_ad84250f-bd97-40de-b224-6d225dd1cc17.sql", sql: m02 },
  { name: "20260316153439_6ffd5e09-9c6f-48a1-b10a-4068372e6ffd.sql", sql: m03 },
  { name: "20260316153520_edf68544-780c-430e-af3c-9a198d6038d0.sql", sql: m04 },
  { name: "20260316153612_9da52f9e-fb9e-4450-9458-aeab407e499f.sql", sql: m05 },
  { name: "20260316153712_102a840a-2c81-438e-b3a0-a1149b17dea5.sql", sql: m06 },
  { name: "20260316154057_bcac09ff-874a-4476-8ee0-1127efd7349f.sql", sql: m07 },
  { name: "20260316154145_4b53d5d6-0906-4e60-b4ad-c767da651c6b.sql", sql: m08 },
  { name: "20260316154316_8960f7aa-0d30-4d38-a2df-f0a0f8f026b8.sql", sql: m09 },
  { name: "20260316155544_1f8b2033-79fc-45c6-afc4-d97e0e0858d4.sql", sql: m10 },
  { name: "20260316155756_654dd050-30eb-4bd1-bf34-aec2eed33fc6.sql", sql: m11 },
  { name: "20260316164438_805b0473-2d9a-4ebe-ab22-7976892683d7.sql", sql: m12 },
  { name: "20260316164815_c470c2c1-8d6f-46bf-ac35-b97242192122.sql", sql: m13 },
  { name: "20260316172247_bafbec6d-2d46-4937-a9b9-d917199a7b16.sql", sql: m14 },
  { name: "20260319111254_6fe79678-3b9c-4dc2-a525-a1ae2dc17a51.sql", sql: m15 },
  { name: "20260319111539_daf2f580-7147-4a02-a16b-80bd95938d61.sql", sql: m16 },
  { name: "20260319113114_7b7e2626-a733-490a-ba95-9ab9ee21ee2f.sql", sql: m17 },
  { name: "20260319113736_153224fc-098d-4229-9787-54a2db1406d0.sql", sql: m18 },
  { name: "20260319114949_9dcb89df-03c7-403e-a6fd-9fb4df37c98b.sql", sql: m19 },
  { name: "20260319115133_7234d8ba-18c4-4f5f-9700-a58f15967d4a.sql", sql: m20 },
  { name: "20260319123435_5dd7a526-1fba-45cc-bed2-74ea21df79d4.sql", sql: m21 },
  { name: "20260319125409_9b8f670f-1b07-470e-b33d-10a5fef69462.sql", sql: m22 },
  { name: "20260319130139_221521f3-9778-40a7-b54c-289b04b8d731.sql", sql: m23 },
  { name: "20260320063136_33861d1e-0070-424b-b181-2dfbef5b1502.sql", sql: m24 },
  { name: "20260320063354_d683b18b-89e1-4313-91fb-c8e97dafb957.sql", sql: m25 },
  { name: "20260320063559_7e5260cc-f510-41df-9614-e0c201e375f2.sql", sql: m26 },
  { name: "20260320063732_3707d82f-648c-4021-8f64-53f5e5a6cac9.sql", sql: m27 },
  { name: "20260320070002_a58af44e-eec1-488e-89bc-21660683fc07.sql", sql: m28 },
  { name: "20260320070359_a1ad45f0-37d1-4ab6-b9ef-4edc54d1cf6c.sql", sql: m29 },
  { name: "20260322040201_151a7350-d229-47b4-af8e-be1865d83392.sql", sql: m30 },
  { name: "20260322040303_09a82b73-facd-440a-942e-028f23fe5e0b.sql", sql: m31 },
  { name: "20260322041348_fa7122ff-d2a9-4b42-8d76-1082339ad9eb.sql", sql: m32 },
  { name: "20260322043515_e1395585-cac4-42b6-a215-5559ddc3e633.sql", sql: m33 },
  { name: "20260323060425_a75cf0ba-7a68-4484-a7fb-1b8e1816baae.sql", sql: m34 },
  { name: "20260323062323_be1e4aba-90ae-4520-861a-83f64ad4ce7b.sql", sql: m35 },
  { name: "20260323063123_1ab3a175-8564-48e4-a730-6668142ada25.sql", sql: m36 },
  { name: "20260323063302_49333eb7-0a5e-4041-b17d-5722dac2eec9.sql", sql: m37 },
  { name: "20260323063555_2e657a91-4441-4800-8fb2-2ba7bac57a15.sql", sql: m38 },
  { name: "20260323063758_3d2f640e-50c6-472b-a1c8-1784d94c5af4.sql", sql: m39 },
  { name: "20260323063954_2dc5a95f-3b8e-4701-8989-fecd275290b1.sql", sql: m40 },
  { name: "20260323064352_530f7b8f-252f-406b-a440-614efd0fafb9.sql", sql: m41 },
  { name: "20260323072010_60ca26c5-daf2-45db-8fdf-09977b3de938.sql", sql: m42 },
  { name: "20260323072331_df5a0b1a-3426-4d9c-84f8-50e0f63b053a.sql", sql: m43 },
  { name: "20260323074905_3ced4edf-24d6-4d4d-8623-0ee4261befba.sql", sql: m44 },
  { name: "20260323075454_46dcd826-8490-41fb-82f4-6f1c7ecf9561.sql", sql: m45 },
  { name: "20260323075704_554d55d1-517c-4b82-8bd5-be2b0b970f9e.sql", sql: m46 },
  { name: "20260323075926_ae9f7359-5413-4d3b-914e-8d968d312fbe.sql", sql: m47 },
  { name: "20260323080918_aea8d66e-3aef-4e32-80a2-7513207b494f.sql", sql: m48 },
  { name: "20260323081808_a5f00078-ec09-4a27-99c0-282b94663bc0.sql", sql: m49 },
  { name: "20260324020618_7892665a-1421-44ab-bf78-92c27af1f31b.sql", sql: m50 },
  { name: "20260324024909_3dbdb4df-17a0-413a-b213-c30358a966be.sql", sql: m51 },
  { name: "20260324025012_bf0d3bdb-4e56-426d-8dba-471ff73cd42c.sql", sql: m52 },
  { name: "20260324025236_a3de741f-428c-4084-9ab1-5042506f9ce7.sql", sql: m53 },
  { name: "20260324030940_6339d1bc-7186-46e8-bebd-4017e94610de.sql", sql: m54 },
  { name: "20260324150802_b7a81729-f2b5-4acc-805b-1a905c860e88.sql", sql: m55 },
  { name: "20260324151526_7494f044-c17f-42dc-8a67-dc8d1d5376c3.sql", sql: m56 },
  { name: "20260327080617_db815711-9b5b-460a-a9b5-a5ee3a0ab1e3.sql", sql: m57 },
  { name: "20260327091053_90af7c83-91b4-410d-b5c7-f4e528efa9a9.sql", sql: m58 },
  { name: "20260328030014_cff97321-3f5c-4f90-9f36-91812a3cde20.sql", sql: m59 },
  { name: "20260328030636_7c3d098a-34ad-4b50-9108-4bcdcde933f1.sql", sql: m60 },
  { name: "20260328031159_75e7b86d-3ab3-4bfa-95f8-f719813b9b9a.sql", sql: m61 },
  { name: "20260328041657_cd035a05-564d-431c-8d22-363d6e84a37c.sql", sql: m62 },
  { name: "20260328041755_ec7a4f32-3690-4c7e-b7d8-4f4c100046b2.sql", sql: m63 },
  { name: "20260328042016_66f80efb-97f9-4ba0-9787-69e9fb492bd8.sql", sql: m64 },
  { name: "20260328042737_d942c4ed-6e0f-4ebe-b91c-5d771b74f136.sql", sql: m65 },
  { name: "20260328043318_921b1796-6153-4abe-a9c3-668898c8b3c3.sql", sql: m66 },
  { name: "20260328043944_c88c594d-a5f4-47b4-a69d-d92b6c147c33.sql", sql: m67 },
  { name: "20260328044737_0ed3b62c-f5ff-47d4-a5f6-c32b1283821a.sql", sql: m68 },
  { name: "20260328045352_24dc1e4d-8f47-4fbf-9f75-320f71c1d7ea.sql", sql: m69 },
  { name: "20260330021201_d4671204-7303-47ca-b8f6-b7f8621a4f38.sql", sql: m70 },
  { name: "20260330030639_d0f60c21-3cd6-4b2c-ad61-f74c888a4193.sql", sql: m71 },
  { name: "20260330032200_d64e7c14-56a9-42f3-9ac4-d9cca4e5fe84.sql", sql: m72 },
  { name: "20260330044118_2aea4871-4585-48d9-a426-8d4354a89657.sql", sql: m73 },
  { name: "20260330044828_d104f9a3-8b66-42ca-a439-454bd13afac4.sql", sql: m74 },
  { name: "20260330045452_f61c78c9-8d71-43fb-8425-9e222c2ca708.sql", sql: m75 },
  { name: "20260330045929_c9123820-7a01-4de3-8f1a-4995dd032667.sql", sql: m76 },
  { name: "20260330050034_a296165b-b9de-4508-96b7-887021e1ca93.sql", sql: m77 },
  { name: "20260330052539_aba841bd-8301-493a-a9fb-f938d6c932d1.sql", sql: m78 },
  { name: "20260330053301_6ecbe46e-4618-4bde-b025-c3b43c14813c.sql", sql: m79 },
  { name: "20260401012428_ff26827a-fdf7-4a4f-9a48-a3bd0505ef8c.sql", sql: m80 },
  { name: "20260401013251_0ca3cc6e-06ae-43c9-8cf7-389a6f5a977a.sql", sql: m81 },
];

const TOKEN = "1b0f0b79c00bae79baf718d816e53c21";

Deno.serve(async (req) => {
  if (req.headers.get("x-restore-token") !== TOKEN) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const url = new URL(req.url);
  const from = Number(url.searchParams.get("from") ?? "0");
  const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
  const client = new Client(dbUrl);
  const applied: string[] = [];
  await client.connect();
  try {
    for (let i = from; i < MIGRATIONS.length; i++) {
      const m = MIGRATIONS[i];
      try {
        await client.queryArray(m.sql);
        applied.push(`${i}:${m.name}`);
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, failedIndex: i, failed: m.name, error: String(e), appliedCount: applied.length, applied: applied.slice(-3) }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }
    const res = await client.queryObject<{ n: bigint }>("select count(*)::bigint as n from information_schema.tables where table_schema='public'");
    return new Response(JSON.stringify({ ok: true, appliedCount: applied.length, public_tables: Number(res.rows[0].n) }), { headers: { "Content-Type": "application/json" } });
  } finally {
    try { await client.end(); } catch (_) { /* ignore */ }
  }
});
