"use client";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea as TextareaInput } from "@/components/ui/textarea";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  field: ControllerRenderProps;
  rows?: number;
}

export default function Textarea(props: TextareaProps) {
  const { label, rows, placeholder, field, className } = props;
  const { error } = useFormField();  

  const Element = (
    <TextareaInput
      {...field}
      placeholder={placeholder}
      value={field.value || ""}
      className={cn(error && "text-destructive border-destructive", className)}
      rows={rows || 3}
    />
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
