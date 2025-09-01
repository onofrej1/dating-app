"use client";
import { getUserInfo } from "@/actions/user-info";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  console.log(params);

  const isCurrentUser = session?.user.id === params.id;

  const { data } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["getUserInfo", params.id],
    queryFn: () => getUserInfo(params.id),
  });
  console.log(data);

  const baseInfo = [
    "gender",
    "genderSearch",
    "dob",
    "email",
    "name",
    "createdAt",
    "lastLogin",
    "country",
    "city",
    "region",
  ];
  const render = (label: string, key: string) => {
    let value;
    if (!baseInfo.includes(key)) {
      const question = data?.questions.find((q) => q.name === key);
      const choice = question?.questionChoices.find(
        (d) =>
          d.id === Number(data?.userInfo[key as keyof typeof data.userInfo])
      );
      value = choice?.title;
    } else {
      value = data?.userInfo[key as keyof typeof data.userInfo];
    }
    if (["dob", "lastLogin"].includes(key)) {
      value = new Date(value as string).toLocaleDateString();
    }
    if (["createdAt"].includes(key)) {
      value = new Date(value as string).toLocaleString("en-us", {
        month: "short",
        year: "numeric",
      });
    } else if (["emailVerified"].includes(key)) {
      value = value ? "ano" : "nie";
    } else if (key === "locality") {
      value = data?.userInfo.country;
      if (data?.userInfo.city) {
        value += " (" + data.userInfo.city + ")";
      }
    }

    return (
      <>
        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
          {label}
        </dt>
        <dd className="text-lg font-semibold mb-2">
          {(value as string) || "neuvedené"}
        </dd>
      </>
    );
  };

  return (
    <div className="relative flex flex-col p-6 bg-white shadow-sm border border-slate-200 rounded-lg">
      <div className="flex flex-col gap-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Základne informácie
        </h3>
        <div className="flex gap-3">
          <div className="flex-1">{render("Meno", "name")}</div>
          <div className="flex-1">{render("Lokalita", "locality")}</div>
        </div>

        {isCurrentUser && (
          <div className="flex gap-3">
            <div className="flex-1">{render("Datum narodenia", "dob")}</div>
            <div className="flex-1">{render("Emailova adresa", "email")}</div>
          </div>
        )}

        {/*<div className="flex-1">
            {render("Overeny email", "emailVerified")}
          </div>*/}

        <div className="flex gap-3">
          <div className="flex-1">{render("Pohlavie", "gender")}</div>
          <div className="flex-1">{render("Hladam", "genderSearch")}</div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            {render("Datum registracie", "createdAt")}
          </div>
          <div className="flex-1">
            {render("Posledne prihlasenie", "lastLogin")}
          </div>
        </div>

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Doplňujúce informácie
        </h3>
        <div className="flex gap-3">
          <div className="flex-1">{render("Vyska", "height")}</div>
          <div className="flex-1">{render("Postava", "figure")}</div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">{render("Farba oci", "eye-color")}</div>
          <div className="flex-1">{render("Vlasy", "hair")}</div>
        </div>

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Životný štýl
        </h3>
        <div className="flex gap-3">
          <div className="flex-1">{render("Vzdelanie", "education")}</div>
          <div className="flex-1">{render("Stav", "marital-status")}</div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">{render("Fajcim", "smoking")}</div>
          <div className="flex-1">{render("Alkohol", "drinking")}</div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">{render("Zamestnanie", "job")}</div>
          <div className="flex-1">{render("Vierovyznanie", "religion")}</div>
        </div>
      </div>
    </div>
  );
}
