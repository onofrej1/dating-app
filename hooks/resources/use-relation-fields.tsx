"use client";
import { getOptions } from "@/actions/resources";
import { DefaultFormData } from "@/components/form/form";
import {
  ForeignKeyType,
  FormField,
  MultipleSelectorType,
} from "@/types/resources";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type RelationFormType = ForeignKeyType | MultipleSelectorType;

export function useRelations(formFields: FormField[], formData: DefaultFormData, isEdit: boolean) {
  const [fields, setFields] = useState<FormField[]>(formFields);
  const [done, setDone] = useState(false);
  const [data, setData] = useState(formData);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFields() {
      const relations = formFields.filter((f) =>
        ["foreignKey", "manyToMany"].includes(f.type!)
      );

      for (const field of relations as RelationFormType[]) {
        field.options = await queryClient.fetchQuery({
          queryKey: ['getOptions', field.resource],
          queryFn: () => getOptions(field.resource),
        });

        if (field.type === 'manyToMany' && formData?.id && Array.isArray(formData[field.name])) {
          const valueArr = formData[field.name] as Record<string, number>[];
          const optionValues = valueArr.map(
            (valueObj: Record<string, number>) => {
              const value = valueObj[field.field].toString();
              const option = field.options?.find((o) => o.value === value);
              return { label: option?.label, value };
            }
          );
          formData[field.name] = optionValues;
        }        
      }
      const idField: FormField = { name: "id", type: "hidden" };

      if (formData?.id) {
        setData(formData);
      }
      //console.log('done');
      setDone(true);
      setFields(formData?.id ? [idField, ...formFields] : [...formFields]);
    }

    if (done) return;
    if ((isEdit && formData.id) || !isEdit) {
      getFields();
    }
    
  }, [formFields, formData, queryClient, done, isEdit]);

  return { fields, data };
}
