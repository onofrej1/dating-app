import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { User } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { setRelations } from "@/lib/resources";
import { user } from "@/resources/user";

export const userService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[User[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.user.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: string) => {
    return await prisma.user.findFirst({
      where: { id },      
    });
  },

  create: async (data: User) => {
    await prisma.user.create({ data });
  },

  update: async (data: User) => {
    const oldData = await userService.get(data.id);
    setRelations(data, oldData, user.form);
    const { id, ...rest } = data;
  
    await prisma.user.update({ where: { id }, data: rest });
  },

  delete: async (id: string[]) => {
    await prisma.user.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const users = await prisma.user.findMany();

    return users.map((user) => ({
      value: user.id,
      label: user.name,
    }));
  },
};
