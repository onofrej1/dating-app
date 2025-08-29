"use client";
import { ControllerRenderProps } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "../../ui/form";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  onChange?: (value: string) => void;
  field: ControllerRenderProps;
}

export default function FormSelect({
  label,
  options,
  field,
  placeholder,
  onChange,
  className,
}: SelectProps) {
  const { error } = useFormField();

  const Element = (
    <Select
      name={field.name}
      onValueChange={(value) => {
        field.onChange(value);
        if (onChange) {
          onChange(value);
        }
      }}
      defaultValue={field.value?.toString()}
      value={field.value?.toString()}
    >
      <SelectTrigger
        className={cn(
          error && "text-destructive border-destructive",
          "w-full",
          className
        )}
        value={field.value?.toString()}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options &&
          options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
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
