"use client";
import { getUserInfo, saveUserInfo } from "@/actions/user-info";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/types/resources";
import { default as BaseForm, DefaultFormData } from "@/components/form/form";
import { useUserFields } from "./_fields";
import { UserInfo } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Check, Pencil, Save } from "lucide-react";
import { H3 } from "@/components/typography";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
} from "@/components/ui/credenza";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Upload } from "lucide-react";

//import z from "zod";
//import { zodResolver } from "@hookform/resolvers/zod";

//const FormSchema = z.object({
/*items: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),*/
//});

export default function UserPage() {
  const [formData, setFormData] = useState<DefaultFormData>();
  /*const form = useForm<FormType>({
    resolver: zodResolver(UserInfo),
  });*/

  const [initialized, setInitialized] = useState(false);

  const { data, isFetching } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["getUserInfo"],
    queryFn: () => getUserInfo(),
  });

  const { fields } = useUserFields({ questions: data?.questions });
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [hobbyDialogOpen, setHobbyDialogOpen] = useState(false);

  useEffect(() => {
    if (formFields.length === 0 && data?.questions?.length) {
      console.log(fields);
      setFormFields(fields);
    }
  }, [formFields, fields, data?.questions?.length]);

  useEffect(() => {
    if (data?.questions && data.questions.length > 0) {
      const defaultData: Record<string, unknown> = data.userInfo;
      console.log("default data", defaultData);

      setFormData(defaultData as DefaultFormData);
      setInitialized(true);
    }
  }, [data]);

  if (isFetching || !initialized) return <div>Loading...</div>;

  const hobby = data?.questions.find((q) => q.name === "hobby");
  const hobbys = hobby?.questionChoices.reduce((acc, curr) => {
    acc[curr.id] = curr.title;
    return acc;
  }, {} as Record<number, string>);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {formFields.length > 0 && (
        <BaseForm
          fields={formFields}
          data={formData}
          validation={UserInfo}
          action={async (data) => {
            console.log(data);
            saveUserInfo(data as Record<string, any>);
            return data;
          }}
        >
          {({ fields, form }) => (
            <div className="space-y-4">
              <H3>Základne informácie</H3>
              <div className="flex gap-3">
                <div className="flex-1">{fields.gender}</div>
                <div className="flex-1">{fields.dob}</div>
              </div>
              <div>
                Nastavit titulnu fotku
              </div>
              <div className="flex items-center border-gray-400 border border-dashed p-3">
                <Avatar className="mr-2 w-[100px] h-[100px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Button className="mr-1">
                  <Upload /> Nahrat fotku
                </Button>
                <Button variant={"outline"}>
                  <Trash /> Zmazat
                </Button>
              </div>
              

              <div className="border border-gray-400 border-dashed p-4">
                {fields["country-cascader"]}
              </div>
              {fields.bio}

              <H3>Doplňujúce informácie</H3>
              <div className="flex gap-3">
                <div className="flex-1">{fields["height"]}</div>
                <div className="flex-1">{fields["figure"]}</div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">{fields["eye-color"]}</div>
                <div className="flex-1">{fields["hair"]}</div>
              </div>

              <H3>Životný štýl</H3>
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
              <div></div>
              <div className="flex gap-3 align-center">
                <H3>Zaluby / hobby</H3>
                <div className="flex">
                  <Button
                    onClick={() => setHobbyDialogOpen(true)}
                    type="button"
                    size="sm"
                    variant={"outline"}
                  >
                    <Pencil /> Upravit
                  </Button>
                </div>
              </div>
              <div className="flex gap-3">
                {(form.getValues("hobby") as number[])?.map((hobby) => (
                  <div key={hobby}>
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white dark:bg-blue-600"
                    >
                      {hobbys?.[hobby]}
                    </Badge>
                  </div>
                ))}
              </div>
              <Credenza
                open={hobbyDialogOpen}
                onOpenChange={setHobbyDialogOpen}
              >
                <CredenzaContent>
                  {/*<CredenzaHeader>
                    <CredenzaTitle>Zaujmy</CredenzaTitle>
                    <CredenzaDescription>
                      Vyberte zaujmy zo zoznamu.
                    </CredenzaDescription>
                  </CredenzaHeader>*/}
                  <CredenzaBody>{fields["hobby"]}</CredenzaBody>
                  <CredenzaFooter>
                    <Button
                      onClick={() => {
                        setHobbyDialogOpen(false);
                      }}
                    >
                      <Check /> OK
                    </Button>
                  </CredenzaFooter>
                </CredenzaContent>
              </Credenza>

              {!form.formState.isValid && form.formState.isSubmitted && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Nastala chyba.</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      {Object.keys(form.formState.errors).map((key) => (
                        <li key={key}>
                          {form.formState.errors[key]?.message?.toString()}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button size="lg" type="submit" className="mt-4">
                <Save /> Ulož zmeny
              </Button>
            </div>
          )}
        </BaseForm>
      )}
    </div>
  );
}
