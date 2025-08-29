import { prisma } from "@/db/prisma";
import { FilterOperator, FilterVariant } from "@/types/data-table";
import { FormField } from "@/types/resources";

export const resources = {
  questions: prisma.question,
  questionChoices: prisma.questionChoice
};

export type Resource = keyof typeof resources | "users";

export type Filter = {
  value: string | string[];
  operator: FilterOperator;
  variant: FilterVariant;
  search: string;
  id: string; //Extract<keyof T, string>;
};

export function arrayToQuery(arr: string[]) {
  return arr.reduce((result, model) => {
    result[model] = true;
    return result;
  }, {} as Record<string, true>);
}

type BaseEntity = {
  id: number | string;
  [key: string]: unknown;
};

function connectData(
  oldValues: BaseEntity[] = [],
  newValues: BaseEntity[]
) {
  const newIds = new Set(newValues.map((item) => item.id));
  const oldIds = new Set(oldValues.map((item) => item.id));

  const connect = Array.from(newIds)
    .filter((id) => !oldIds.has(id))
    .map((id) => ({ id }));

  if (oldValues.length === 0) {
    return {
      connect,
    };
  }

  const disconnect = Array.from(oldIds)
    .filter((id) => !newIds.has(id))
    .map((id) => ({ id }));

  return {
    connect,
    disconnect,
  };
}

type Data = Record<string, unknown>;

export function setRelations(
  data: Data,
  oldData: Data | null,
  fields: FormField[]
) {
  for (const field of fields) {
    const key = field.name;
    if (field.type === "foreignKey") {
      if (data[key]) {
        data[field.relation] = { connect: { id: data[key] } };
      } else {
        data[field.relation] = { disconnect: true };
      }
      delete data[key];
    }

    if (field.type === "manyToMany") {
      const values = (data[key] as number[])
        .filter(Boolean)
        .map((value: number) => ({ id: value }));

      const oldValues = oldData?.[key] as BaseEntity[];

      if (values && values.length > 0) {
        data[key] = connectData(oldValues, values);
      } else {
        if (oldData?.id) {
          data[key] = { set: [] };
        } else {
          delete data[key];
        }
      }
    }
  }
}
