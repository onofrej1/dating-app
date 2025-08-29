"use client";
import { FormField } from "@/types/resources";
import { useState } from "react";
import { deleteFile, uploadFiles } from "@/actions/files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Resource } from "@/lib/resources";
import { UpsertData } from "@/services";
import { DefaultFormData } from "@/components/form/form";
import { create, update } from "@/actions/resources";

export function useSubmitForm(resource: Resource, fields: FormField[]) {
  const queryClient = useQueryClient();
  type Status = "success" | "error" | "idle";

  const [status, setStatus] = useState<Status>("idle");
  const [responseData, setResponseData] =
    useState<Awaited<ReturnType<typeof create | typeof update>>>();

  const { mutate } = useMutation({
    mutationFn: ({
      resource,
      data,
    }: {
      resource: Resource;
      data: Record<string, unknown>;
    }) => {
      return data.id
        ? update(resource, data as UpsertData)
        : create(resource, data as UpsertData);
    },
    onSuccess: (data) => {
      setStatus("success");
      setResponseData(data);
      queryClient.invalidateQueries({
        queryKey: ["getAll", resource],
      });
    },
    onError: () => {
      setStatus("error");
    },
  });

  const submitForm = async (data: DefaultFormData) => {
    const uploadData = new FormData();
    const uploadFields = fields.filter((f) => f.type === "upload");

    for (const field of uploadFields) {
      const value = data[field.name];
      if (value && typeof value === "object" && "file" in value) {
        const { file, previousFile, isDirty } = value;
        if (!isDirty) {
          delete data[field.name];
          continue;
        }
        if (previousFile) {
          await deleteFile(previousFile.name);
        }
        if (file) {
          uploadData.append(field.name, file, file.name);
          data[field.name] = file.name;
        } else if (data[field.name]) {
          data[field.name] = null;
        }
      }
    }

    if (!uploadData.entries().next().done) {
      await uploadFiles(uploadData);
    }

    await mutate({ resource, data });
    return { message: "Data saved" };
  };

  return { submitForm, status, responseData };
}
