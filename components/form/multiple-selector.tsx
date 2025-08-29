"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "../ui/form";
import MultipleSelector_, { Option } from "../multiple-selector";
import { cn } from "@/lib/utils";

interface MultipleSelectorProps {
  label?: string;
  options: Option[];
  className?: string;
  field: ControllerRenderProps;
  onChange?: (value: Option[]) => void;
}

export function MultipleSelector(props: MultipleSelectorProps) {
  const { label, options, field, className, onChange } = props;
  const { error } = useFormField();

  const Element = (
    <MultipleSelector_
      key={options?.length ? 'options' : 'no-options'}
      value={field.value}
      onChange={(value) => {
        field.onChange(value);
        if (onChange) {
          onChange(value);
        }
      }}
      className={cn(error && "text-destructive border-destructive", className)}
      defaultOptions={options}
      placeholder={`Select ${label?.toLowerCase()}...`}
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
          no results found.
        </p>
      }
    />
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div>{Element}</div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
