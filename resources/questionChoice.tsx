import { Question, QuestionChoice } from "@/generated/prisma";
import { Resource } from "@/types/resources";
import { CreateQuestionChoice } from "@/validation";

const questionChoice: Resource = {
  name: "Question choice",
  name_plural: "Question choices",
  model: "questionChoice",
  resource: "questionChoices",
  menuIcon: "",
  relations: ["question"],
  rules: CreateQuestionChoice,
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "displayOrder", type: "text", label: "Display order" },
    {
      name: "questionId",
      type: "foreignKey",
      relation: "question",
      label: "Question",
      resource: "questions",
      renderLabel: (row) => `${row.question}`,
    },
  ],
  list: [
    {
      name: "question",
      header: "Question",
      render: ({ row }) => (
        <span>
          {
            (row.original as QuestionChoice & { question: Question }).question
              .title
          }
        </span>
      ),
    },
    { name: "title", header: "Title" },
    { name: "displayOrder", header: "Display order" },
  ],
};

export { questionChoice };
