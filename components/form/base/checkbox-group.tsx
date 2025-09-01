"use client";

import { Control, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { SelectOption } from "@/types/resources";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  label?: string;
  className?: string;
  elementClassName?: string;
  options: SelectOption[];
  field: ControllerRenderProps;
  control: Control;
  onChange?: (value: string[]) => void;
}

export default function CheckboxGroup_({
  label,
  options,
  field,
  control,
  onChange,
  elementClassName,
}: CheckboxGroupProps) {
  const Element = (
    <div className={elementClassName}>
      {options &&
        options?.map((option) => (
          <FormField
            key={option.value}
            control={control}
            name={field.name}
            render={({ field }) => {
              const value = field.value as string[];

              return (
                <FormItem
                  key={option.value}
                  className="flex flex-row items-center gap-2 mb-3"
                >
                  <FormControl>
                    <Checkbox
                      checked={value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(value || []), option.value]
                          : value.filter((value) => value !== option.value);
                        field.onChange(newValue);
                        onChange?.(newValue);
                        return newValue;
                      }}
                    />
                  </FormControl>
                  <FormLabel>{option.label}</FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
    </div>
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel className="text-xl">{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
