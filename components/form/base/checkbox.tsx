"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormLabel, FormMessage, useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export default function FormCheckbox({
  label,
  className,
  field,
}: CheckboxProps) {
  const { error } = useFormField();

  const Element = (
    <Checkbox
      checked={!!field.value}
      onCheckedChange={field.onChange}
      className={cn(error && "text-destructive border-destructive", className)}
      {...field}
    />
  );

  if (!label) {
    return Element;
  }

  return (
    <div className="flex items-center space-x-2">
      <FormControl>{Element}</FormControl>
      <FormLabel>{label}</FormLabel>
      <FormMessage />
    </div>
  );
}
