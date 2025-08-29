"use server";

import { Resource } from "@/lib/resources";
import {
  getDataService,
  OrderBy,
  Pagination,
  UpsertData,
  Search,
} from "@/services";
import { userService } from "@/services/user-service";

export async function getAll(
  resource: Resource,
  pagination: Pagination,
  search: Search,
  orderBy: OrderBy[]
) {
  return getDataService(resource).getAll(pagination, search, orderBy);
}

export async function get(resource: Resource, id: number | string) {
  if (resource === 'users' && typeof id === 'string') {
    return await userService.get(id);
  }
  return await getDataService(resource).get(id as number);
}

function isArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isArrayOfNumbers(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(item => typeof item === "number");
}

export async function getOptions(resource: Resource) {
  if (resource === 'users') {
    return userService.getOptions();
  }
  
  const options = await getDataService(resource).getOptions();
  return options.map((option) => ({
    ...option,
    value: option.value.toString(),
  }));
}

export async function remove(resource: Resource, idList: number[] | string[]) {
  if (resource === 'users' && isArrayOfStrings(idList)) {
    return userService.delete(idList);
  }
  if (isArrayOfNumbers(idList)) {
    await getDataService(resource).delete(idList);
  }  
}

export async function create(resource: Resource, data: UpsertData) {  
  await getDataService(resource).create(data);
}

export async function update(resource: Resource, data: UpsertData) {
  await getDataService(resource).update(data);
}