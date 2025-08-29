import { Filter } from "./resources";

type OperatorMap = {
  eq: "equals";
  ne: "not";
  iLike: "contains";
  notILike: "contains";
  lt: "lt";
  lte: "lte";
  gt: "gt";
  gte: "gte";
  isEmpty: "";
  isBetween: "isBetween";
  inArray: "";
  notInArray: "";
};

export function applyFilters(filters: Filter[], operator: 'and' | 'or') {
  const query: Record<string, unknown>[] = [];

  filters.forEach((filter) => {
    const where: Record<string, unknown> = {};
    const value = filter.value;
    const operator = filter.operator as keyof OperatorMap;

    if (filter.variant === "text") {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          iLike: "contains",
          notILike: "contains",
        };
        const key = operators[operator]!;
        if (operator === "notILike") {
          where["NOT"] = {
            [filter.id]: { [key]: value },
          };
        } else {
          where[filter.id] = { [key]: value };
        }
      }
    }

    if (filter.variant === "number" || filter.variant === 'range') {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? null : { not: null };
      } else if (operator === "isBetween") {

        const firstValue =
          filter.value[0] && filter.value[0].trim() !== ""
            ? Number(filter.value[0])
            : null;
        const secondValue =
          filter.value[1] && filter.value[1].trim() !== ""
            ? Number(filter.value[1])
            : null;
            
        if (firstValue === null && secondValue === null) {
          return;
        }
        if (firstValue !== null && secondValue === null) {
          where[filter.id] = { equals: Number(firstValue) };
        }
        if (firstValue === null && secondValue !== null) {
          where[filter.id] = { equals: Number(secondValue) };
        }
        where["AND"] = [
          { [filter.id]: { gte: firstValue } },
          { [filter.id]: { lte: secondValue } },
        ];
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        const key = operators[operator]!;
        where[filter.id] = { [key]: Number(value) };
      }
    }

    if (filter.variant === "boolean") {
      const operators: Partial<OperatorMap> = {
        eq: "equals",
        ne: "not",
      };
      const key = operators[operator]!;
      where[filter.id] = { [key]: value === "false" ? false : !!value };
    }

    if (filter.variant === "date" || filter.variant === 'dateRange') {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? null : { not: null };
      } else if (
        operator === "isBetween" &&
        Array.isArray(filter.value) &&
        filter.value.length === 2
      ) {
        const startDate = new Date(Number(filter.value[0]));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(Number(filter.value[1]));
        endDate.setHours(23, 59, 59, 999);

        where["AND"] = [
          { [filter.id]: { gte: startDate } },
          { [filter.id]: { lte: endDate } },
        ];
      } else {
        const operators: Partial<OperatorMap> = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        const key = operators[operator]!;

        const date = new Date(Number(filter.value));

        if (["eq", "ne"].includes(operator)) {
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          if (operator === "eq") {
            where["AND"] = [
              { [filter.id]: { gte: date } },
              { [filter.id]: { lte: end } },
            ];
          } else {
            where["OR"] = [
              { [filter.id]: { lt: date } },
              { [filter.id]: { gt: end } },
            ];
          }
        } else if (["gte", "lt"].includes(operator)) {
          date.setHours(0, 0, 0, 0);
          where[filter.id] = { [key]: date };
        } else if (["lte", "gt"].includes(operator)) {
          date.setHours(23, 59, 59, 999);
          where[filter.id] = { [key]: date };
        }
      }
    }

    if (["multiSelect", "select"].includes(filter.variant)) {
      const [key, op] = "categories_".split("_"); //filter.search.split("_");
      const isManyRelation = op !== undefined;

      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        if (isManyRelation) {
          where[key] = {
            [filter.operator === "isEmpty" ? "none" : "some"]: {},
          };
        } else {
          where[key] = {
            [filter.operator === "isEmpty" ? "isNot" : "is"]: {},
          };
        }
      }

      if (["inArray", "notInArray", "eq", "ne"].includes(operator)) {
        const arrayValue = Array.isArray(value)
          ? value.map((v) => parseFloat(v) || v)
          : value
          ? [parseFloat(value) || value]
          : [];

        if (isManyRelation) {
          const columnFilter = ["inArray", "eq"].includes(filter.operator)
            ? "some"
            : "none";
          where[key] = {
            [columnFilter]: {
              id: {
                ["in"]: arrayValue,
              },
            },
          };
        } else {
          const columnFilter = ["inArray", "eq"].includes(filter.operator)
            ? "in"
            : "notIn";
          where[key] = {
            id: {
              [columnFilter]: arrayValue,
            },
          };
        }
      }
    }
    query.push(where);
  });

  return { [operator.toUpperCase()]: query };
}
