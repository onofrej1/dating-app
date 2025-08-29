import { Filter, Resource } from "@/lib/resources";
import { Question, QuestionChoice, User } from "@/generated/prisma";
//import { userService } from "./user-service";
import { questionService } from "./question-service";
import { questionChoiceService } from "./question-choice-service";

export type Pagination = {
  limit: number;
  offset: number;
};

export type OrderBy = {
  id: string;
  desc: boolean;
};

export type Search = {
  filters: Filter[];
  operator: "and" | "or";
};

export type SearchParam = {
  filters: Filter[];
  operator: "and" | "or";
};

export type ResourceFormData = Record<string, unknown>;

export type Resources = 
| User
| Question
| QuestionChoice;

export type UpsertData = UnionToIntersection<Resources>; 

export type UnionToIntersection<U> = 
  (U extends unknown ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never;

type Service =  
  //| typeof userService
  | typeof questionService
  | typeof questionChoiceService;  

const services = new Map<Resource, Service>([
  //["users", userService],
  ["questions", questionService],
  ["questionChoices", questionChoiceService]
]);

export function getDataService(resource: Resource) {
  if (services.has(resource)) {
    return services.get(resource)!;
  }
  throw new Error('Service not found');
}



