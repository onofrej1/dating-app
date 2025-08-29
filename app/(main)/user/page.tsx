"use client";
import { getUserInfo, saveUserInfo } from "@/actions/user-info";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/types/resources";
import { default as BaseForm, DefaultFormData } from "@/components/form/form";
import { useUserFields } from "./_fields";
//import z from "zod";
//import { zodResolver } from "@hookform/resolvers/zod";

//const FormSchema = z.object({
/*items: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),*/
//});

type FormType = Record<string, number | number[]>;

export default function UserPage() {
  const [formData, setFormData] = useState<DefaultFormData>();
  const form = useForm<FormType>({
    //resolver: zodResolver(FormSchema),
  });

  const [initialized, setInitialized] = useState(false);

  const { data, isFetching } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["getUserInfo"],
    queryFn: () => getUserInfo(),
  });

  const { fields } = useUserFields({ questions: data?.questions });
  const [formFields, setFormFields] = useState<FormField[]>([]);

  useEffect(() => {
    if (formFields.length === 0 && data?.questions?.length) {
      setFormFields(fields);
    }
  }, [formFields, fields, data?.questions?.length]);

  useEffect(() => {
    if (data?.questions && data.questions.length > 0) {
      const defaultData: Record<string, unknown> = data.userInfo;
      //console.log("default data", defaultData);

      if (defaultData.dob) {
        const date = defaultData.dob as Date;
        defaultData.year = date.getFullYear().toString();
        defaultData.month = (date.getMonth() + 1).toString();
        defaultData.day = date.getDate().toString();
      }

      setFormData(defaultData as DefaultFormData);
      setInitialized(true);
    }
  }, [data, form]);

  if (isFetching || !initialized) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {formFields.length > 0 && (
        <BaseForm
          fields={formFields}
          data={formData}
          action={async (data) => {
            console.log(data);
            saveUserInfo(data as FormType);
            return data;
          }}
        >
          {({ fields }) => (
            <div className="flex flex-col gap-4">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Základne informácie
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">{fields.gender}</div>
                <div className="flex-1">{fields.dob}</div>
              </div>

              {fields["country-cascader"]}
              {fields.bio}

              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Doplňujúce informácie
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">{fields["height"]}</div>
                <div className="flex-1">{fields["figure"]}</div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">{fields["eye-color"]}</div>
                <div className="flex-1">{fields["hair"]}</div>
              </div>

              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Životný štýl
              </h3>
              <div className="flex gap-3">
                <div className="flex-1">{fields["education"]}</div>
                <div className="flex-1">{fields["marital-status"]}</div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">{fields["drinking"]}</div>
                <div className="flex-1">{fields["smoking"]}</div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">{fields["job"]}</div>
                <div className="flex-1">{fields["religion"]}</div>
              </div>

              <Button type="submit" className="mt-4">
                Ulož zmeny
              </Button>
            </div>
          )}
        </BaseForm>
      )}
    </div>
  );
}
