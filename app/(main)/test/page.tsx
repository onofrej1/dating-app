'use client';
import { useState } from "react"
import { Content } from "@tiptap/react"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap"
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/actions/users";

export default function App () {
  const { data: userData, isFetching } = useQuery({
    queryKey: ["getUsers"],
    queryFn: () => getUsers(),
  });
  
  const [value, setValue] = useState<Content>("");

  console.log(userData);

  if (isFetching ||!userData) {
    return null;
  }

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={setValue}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-hidden"
    />
  )
}