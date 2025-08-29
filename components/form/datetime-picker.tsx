/*"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "../ui/form";
import {
  DateTimePicker as DateTimePicker_,
} from "../datetime-picker";
import { cn } from "@/lib/utils";

type Granularity = "day" | "hour" | "minute" | "second";

interface DateTimeProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
  granularity: Granularity;
  displayFormat?: { hour24?: string; hour12?: string };
}

export function DateTimePicker(props: DateTimeProps) {
  const { label, field, className, granularity = "second", displayFormat } = props;
  const value = field.value;
  const { error } = useFormField();

  React.useEffect(() => {
    if (value && typeof value === "string") {
      field.onChange(new Date(value));
    }
  }, [value]);

  const Element = (
    <DateTimePicker_
      granularity={granularity}
      displayFormat={displayFormat}
      value={value ? new Date(value) : undefined}
      onChange={field.onChange}
      className={cn(error && "text-destructive border-destructive", className)}
    />
  );

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}*/
