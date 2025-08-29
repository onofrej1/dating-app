import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { Question } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";

export const questionService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[Question[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.question.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.question.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.question.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: Question) => {
    await prisma.question.create({ data });
  },

  update: async (data: Question) => {
    await prisma.question.update({ where: { id: data.id }, data });
  },

  delete: async (id: number[]) => {
    await prisma.question.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const questions = await prisma.question.findMany();

    return questions.map((question) => ({
      value: question.id,
      label: question.title,
    }));
  },
};
