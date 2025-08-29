import {
  count,
  eq,
  desc,
  asc,
  inArray,
} from "drizzle-orm";
import { db } from "@/db";
import { [TABLE] } from "@/db/schema";
import { Pagination, OrderBy, Search } from "@/services";
import { filterData } from "@/lib/filter-data";

export const [NAME]Service = {
  getAll: async (
    pagination: Pagination,    
    search: Search<typeof [TABLE]>,
    orderBy: OrderBy[],
  ): Promise<[typeof [TABLE].$inferSelect[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const where = filterData({
      table: [TABLE],
      filters: filters,
      joinOperator: operator,
    });

    const rowCount = await db
      .select({ count: count() })
      .from([TABLE])
      .where(where)

    const pageCount = Math.ceil(rowCount[0].count / Number(limit));

    const orderByQuery = orderBy.map((item) => {
      const key = item.id as keyof typeof [TABLE].$inferInsert;
      return item.desc ? desc([TABLE][key]) : asc([TABLE][key])
    });

    const data = await db.query.[TABLE].findMany({
      limit,
      offset,
      orderBy: orderByQuery,
      where,
    });

    return [ data, pageCount ];
  },

  getOptions: async () => {
    return db
      .select({
        value: [TABLE].id,
        label: [TABLE].[OPTION_FIELD],
      })
      .from([TABLE]);
  },

  get: (id: number) =>
    db.query.[TABLE].findFirst({ where: eq([TABLE].id, Number(id)) }),

  create: (data: typeof [TABLE].$inferInsert) =>
    db.insert([TABLE]).values(data).returning(),

  update: (data: typeof [TABLE].$inferInsert) =>
    db
      .update([TABLE])
      .set(data)
      .where(eq([TABLE].id, Number(data.id)))
      .returning(),

  remove: (idList: number[]) => db.delete([TABLE]).where(inArray([TABLE].id, idList)),
};
