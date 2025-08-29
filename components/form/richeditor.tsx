"use client";

import { ControllerRenderProps } from "react-hook-form";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichEditorProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
  contentClassName?: string;
}

export default function RichEditor({
  label,
  field,
  contentClassName,
}: RichEditorProps) {

  useEffect(() => {
    if (typeof field.value === "string") {
      try {
        field.value = JSON.parse(field.value);
      } catch {
        console.log("Cannot parse content:", field.value);
        field.value = "";
      }
      field.onChange(field.value);
    }
  }, [field, field.value]);

  if (typeof field.value === "string") return null;  

  const Element = (
    <MinimalTiptapEditor
      value={field.value}
      onChange={field.onChange}
      className="w-full"
      editorContentClassName={cn("p-5", contentClassName)}
      output="json"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
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
