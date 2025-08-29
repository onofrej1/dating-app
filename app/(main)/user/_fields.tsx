import { Question, QuestionChoice } from "@/generated/prisma";
import { getCityOptions, regionOptions } from "@/lib/countries";
import { FormField } from "@/types/resources";

const getOptions = (choices: QuestionChoice[]) => {
  const options = choices.map((d) => ({
    value: d.id.toString(),
    label: d.title,
  }));
  options.unshift({ value: "all", label: "Nechcem uviesť" });
  return options;
};

type GetUserFieldsProps = {
  questions?: (Question & { questionChoices: QuestionChoice[] })[];
};

export const useUserFields = (props?: GetUserFieldsProps) => {
  const fields = [
    {
      name: "gender",
      type: "select",
      label: "Som",
      placeholder: "Vyber pohlavie ...",
      options: [
        { label: "Muž", value: "man" },
        { label: "Žena", value: "woman" },
      ],
    },
    {
      name: "genderSearch",
      type: "select",
      label: "Hladam",
      placeholder: "Vyber pohlavie ...",
      options: [
        { label: "Muža", value: "man" },
        { label: "Ženu", value: "woman" },
      ],
    },
    {
      name: "dob",
      type: "date-picker",
      className: "w-fit",
      label: "Datum narodenia",
      placeholder: "Datum narodenia",
    },
    {
      type: "cascader",
      name: "country-cascader",
      fields: [
        {
          type: "select",
          name: "country",
          label: "Krajina",
          populate: "region",
          onChange: (country: string) => {
            return country === "SK" ? regionOptions : [];
          },
          options: [
            { label: "Všetky krajiny", value: "all" },
            { label: "Česko", value: "CZ" },
            { label: "Slovensko", value: "SK" },
            { label: "Zahraničie - Rakusko", value: "UTA" },
          ],
        },
        {
          type: "select",
          name: "region",
          populate: "city",
          label: "Region",
          options: [],
          onChange: (region: string) => {
            return getCityOptions(region);
          },
        },
        { type: "select", name: "city", label: "Mesto", options: [] },
      ],
    },
    {
      name: "bio",
      type: "textarea",
      label: "O mne",
    },
  ] as FormField[];

  props?.questions?.forEach((question) => {
    const type = {
      select: "select",
      "multiple-select": "select",
      //'multiple-select': 'multiple-select',
      "checkbox-group": "checkbox-group",
    } as const;
    fields.push({
      name: question.name,
      type: type[question.type as keyof typeof type],
      label: question.title,
      //placeholder: 'Nechcem uviesť',
      options: getOptions(question.questionChoices),
    });
  });
  return { fields };
};
