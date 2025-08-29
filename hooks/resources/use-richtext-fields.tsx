"use client";
import { DefaultFormData } from "@/components/form/form";
import { FormField } from "@/types/resources";
import { useEffect, useState } from "react";

export function useRichtextFields(
  formFields: FormField[],
  formData: DefaultFormData, // Record<string, unknown>
) {
  const [data, setData] = useState(formData);

  useEffect(() => {    
    async function parseRichTextFields() {
      const richtextFields = formFields.filter((field) => field.type === "richtext");

      for (const field of richtextFields) {
        try {
          const value = JSON.parse(formData[field.name] as string);
          formData[field.name] = value; // { type: "doc", content: value.content };
        } catch {
          console.log("Cannto parse richtext content:", formData[field.name]);
        }
      }
      setData(formData);
    }
    if (formData?.id) {
      parseRichTextFields();
    }
  }, [formFields, formData]);

  return { data };
}
