"use client";

import { ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "../../ui/form";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/resources";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";

interface RadioGroupProps {
  label?: string;
  className?: string;
  options: SelectOption[];
  field: ControllerRenderProps;
}

export default function RadioGroup_({
  label,
  className,
  options,
  field,
}: RadioGroupProps) {
  const { error } = useFormField();

  console.log('val', field.value);

  const Element = (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      value={field.value}
      className={cn(error && "text-destructive border-destructive", className)}
    >
      {options &&
        options?.map((option) => (
          <FormItem key={option.value} className="flex items-center gap-3">
            <FormControl>
              <RadioGroupItem checked={option.value === field.value?.toString()} value={option.value} />
            </FormControl>
            <FormLabel className="font-normal">{option.label}</FormLabel>
          </FormItem>
        ))}
    </RadioGroup>
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
