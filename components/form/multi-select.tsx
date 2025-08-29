"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { MultiSelectOption } from "@/types/resources";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  field: ControllerRenderProps;
}

export function MultiSelect(props: MultiSelectProps) {
  const { label, options, field } = props;
  const [open, setOpen] = React.useState(false);

  /*React.useEffect(() => {
    field.onChange(value);
  }, []);*/

  const handleSelect = (selected: string) => {
    if (value.includes(selected)) {
      const newValue = value.filter((item) => item !== selected);
      field.onChange(newValue);
    } else {
      const newValue = [...value, selected];
      field.onChange(newValue);
    }
  };

  const value: string[] = field.value;

  const Element = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex gap-2 justify-start">
            {value?.length
              ? value.map((val) => (
                  <div
                    key={val}
                    className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                  >
                    {options.find((option) => option.value === val)?.label}
                  </div>
                ))
              : "Select option..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
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
