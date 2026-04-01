import { supabase } from "@/integrations/supabase/client";

export async function fetchAllRows<T>(
  table: string,
  query: string,
  filters?: (q: any) => any,
  pageSize = 1000
): Promise<T[]> {
  const all: T[] = [];
  let from = 0;
  while (true) {
    let q = supabase.from(table).select(query).range(from, from + pageSize - 1);
    if (filters) q = filters(q);
    const { data } = await q;
    if (!data || data.length === 0) break;
    all.push(...(data as T[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}
