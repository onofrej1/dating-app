"use client";

import {
  Control,
  ControllerRenderProps,
  useFieldArray,
  UseFormUnregister,
} from "react-hook-form";
import { JSX, ReactElement } from "react";
import { FormField } from "@/types/resources";
import { Button } from "../ui/button";
import { DefaultFormData } from "./form";
import { FormItem, FormLabel } from "../ui/form";

export type RepeaterRenderFunc = (props: RepeaterProps) => ReactElement;

interface RepeaterProps {
  label?: string;
  fields: FormField[];
  renderField: (formField: FormField) => JSX.Element;
  unregister: UseFormUnregister<DefaultFormData>;
  field: ControllerRenderProps;
  control: Control;
  render?: RepeaterRenderFunc;
}

export default function RepeaterInput(props: RepeaterProps) {
  const { label, field, fields, renderField, render, control } = props;

  const {
    fields: arrayFields,
    append,
    remove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: field.name,
  });

  const defaultValue = fields.reduce((acc, current) => {
    acc[current.name] = "";
    return acc;
  }, {} as Record<string, string>);

  if (arrayFields.length === 0) {
    append(defaultValue);
  }

  if (render) {
    return render(props);
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-col ga-3">
        {arrayFields.map((item, index) => {
          return (
            <div className="mb-5 flex flex-col gap-3" key={item.id}>
              {fields.map((f) => (
                <div key={f.name}>
                  {renderField({
                    ...f,
                    name: field.name + "." + index + "." + f.name,
                  })}
                </div>
              ))}
              <Button
                className="self-end"
                type="button"
                onClick={() => remove(index)}
              >
                Remove field
              </Button>
            </div>
          );
        })}
        <Button type="button" onClick={() => append(defaultValue)}>
          Add field
        </Button>
      </div>
    </FormItem>
  );
}
