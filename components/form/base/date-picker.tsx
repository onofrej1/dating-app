"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface DatePickerProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export function DatePicker(props: DatePickerProps) {
  const { label, field, className } = props;
  const value = field.value;

  React.useEffect(() => {
    if (value && typeof value === "string") {
      const dateValue = new Date(value);
      field.onChange(dateValue);
    }
  }, [field, value]);

  const Element = (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-full",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {field.value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(e) => {
            field.onChange(e);
          }}
          //initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
