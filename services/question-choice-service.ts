import { Pagination, OrderBy, SearchParam } from "@/services";
import { prisma } from "@/db/prisma";
import { QuestionChoice } from "@/generated/prisma";
import { applyFilters } from "@/lib/resources-filter";
import { questionChoice } from "@/resources/questionChoice";
import { setRelations } from "@/lib/resources";

export const questionChoiceService = {
  getAll: async (
    pagination: Pagination,
    search: SearchParam,
    orderBy: OrderBy[]
  ): Promise<[QuestionChoice[], number]> => {
    const { limit, offset } = pagination;
    const { filters, operator } = search;

    const orderByQuery = orderBy.map((item) => {
      return { [item.id]: item.desc ? "desc" : "asc" };
    });

    const where = applyFilters(filters, operator);
    const rowCount = await prisma.questionChoice.aggregate({
      where,
      _count: {
        id: true,
      },
    });

    const pageCount = Math.ceil(rowCount._count.id / Number(limit));

    const data = await prisma.questionChoice.findMany({
      take: limit,
      skip: offset,
      orderBy: orderByQuery,
      include: {
        question: true,
      },
      where,
    });

    return [data, pageCount];
  },

  get: async (id: number) => {
    return await prisma.questionChoice.findFirst({
      where: { id: Number(id) },
    });
  },

  create: async (data: QuestionChoice) => {
    setRelations(data, null, questionChoice.form);

    await prisma.questionChoice.create({ data });
  },

  update: async (data: QuestionChoice) => {
    const oldData = await questionChoiceService.get(data.id);
    setRelations(data, oldData, questionChoice.form);
    const { id, ...rest } = data;

    await prisma.questionChoice.update({ where: { id }, data: rest });
  },

  delete: async (id: number[]) => {
    await prisma.questionChoice.deleteMany({ where: { id: { in: id } } });
  },

  getOptions: async () => {
    const questionChoices = await prisma.questionChoice.findMany();

    return questionChoices.map((questionChoice) => ({
      value: questionChoice.id,
      label: questionChoice.title,
    }));
  },
};
