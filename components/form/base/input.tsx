"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import {
  ControllerRenderProps,  
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface InputProps {
  type: string;
  placeholder?: string;
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export default function FormInput(props: InputProps) {
  const { type, placeholder, label, field, className } = props;
  const { error } = useFormField();

  const Element = (
    <Input
      {...field}
      placeholder={placeholder}
      value={field.value || ""}
      className={cn(error && "text-destructive border-destructive", className)}
      type={type || "text"}
    />
  );

  if (!label || type === 'hidden') {
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
