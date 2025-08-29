"use client";

import {
  Control,
  ControllerRenderProps,
  UseFormGetValues,
} from "react-hook-form";
import { JSX, ReactElement, useCallback, useEffect, useState } from "react";
import { FormField, SelectOption, SelectType } from "@/types/resources";
import { FormItem, FormLabel } from "../ui/form";
import { DefaultFormData } from "./form";

export type RepeaterRenderFunc = (props: RepeaterProps) => ReactElement;

type PopulateField = SelectType & { populate: string };

interface RepeaterProps {
  label?: string;
  fields: FormField[];
  getValues: UseFormGetValues<DefaultFormData>;
  renderField: (formField: FormField) => JSX.Element;
  field: ControllerRenderProps;
  control: Control;
  render?: RepeaterRenderFunc;
}

export default function CascadeInput(props: RepeaterProps) {
  const { label, fields, renderField, getValues } = props;
  const [initialized, setInitialized] = useState(false);

  const [options, setOptions] = useState({
    [fields[0].name]: (fields[0] as SelectType).options,
  });

  const onSelectChange = useCallback(
    (field: PopulateField, value: string) => {
      if (field.onChange) {
        let newOptions = { ...options };
        const populateData = field.onChange(value) as unknown as SelectOption[];
        if (populateData?.length > 0) {
          newOptions = {
            ...newOptions,
            [field.populate]: populateData,
          };
        } else {
          delete newOptions[field.populate];
        }

        let childInput = field;
        do {
          childInput = fields.find((f) => f.name === childInput?.populate)! as PopulateField;
          if (childInput && childInput.populate) {
            delete newOptions[childInput.populate];
          }
        } while (childInput);
        setOptions({ ...newOptions });
      }
    },
    [fields, options]
  );

  const initSelect = useCallback((field: PopulateField, value: string) => {
    if (field.onChange) {
      const populateData = field.onChange(value) as unknown as SelectOption[];
      if (populateData?.length > 0) {
        setOptions((oldOptions) => ({
          ...oldOptions,
          [field.populate]: populateData,
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      for (const field of fields as PopulateField[]) {
        const value = getValues(field.name);
        if (
          value &&
          (!options[field.populate] || options[field.populate]?.length === 0)
        ) {
          initSelect(field, value as string);
        }
      }
      setInitialized(true);
    }
  }, [
    fields,
    getValues,
    initSelect,
    initialized,
    onSelectChange,
    options,
    setInitialized,
  ]);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            {options[field.name]
              ? renderField({
                  ...field,
                  options: options[field.name],
                  onChange: (value) => onSelectChange(field as PopulateField, value),
                  name: field.name,
                } as SelectType)
              : null}
          </div>
        ))}
      </div>
    </FormItem>
  );
}
