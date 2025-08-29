import { Resource } from "@/types/resources";
import { CreateQuestion } from "@/validation";

const question: Resource = {
  name: "Question",
  name_plural: "Questions",
  model: "question",
  resource: "questions",
  menuIcon: "",
  rules: CreateQuestion,
  form: [
    { name: "question", type: "text", label: "Question" },
    { name: "questionType", type: "text", label: "Question type" },
  ],
  list: [    
    { name: "question", header: "Question" },
    { name: "questionType", header: "Question type" },
  ],
};

export { question };
