"use client";
import { getUserInfo } from "@/actions/user-info";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getUserPhotos } from "@/actions/files";
import "./page.css";
import { H3, H4, Small } from "@/components/typography";
import {
  Calendar,
  CalendarIcon,
  Image as LucideImage,
  MapPin,
  Mars,
  User,
  Venus,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();

  const { data: images = [], refetch } = useQuery({
    queryKey: ["getFiles"],
    refetchOnWindowFocus: false,
    queryFn: () => getUserPhotos(params.id), //readDirectory("/public/gallery"),
  });

  const [selectedImage, setSelectedImage] = useState<(typeof images)[0]>();

  console.log(images);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

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
    <>
    <div className="relative p-6 bg-white shadow-sm border border-slate-200 rounded-lg">
      <div className="border-gray-400 p-3 flex items-start gap-8 mb-4">
        

        <div className="flex-2 space-y-3">
          <div className="flex gap-3 items-center mb-3">
            <H3>{data?.userInfo["name"]}</H3>{" "}
            {data?.userInfo.gender === "man" ? <Mars /> : <Venus />}{" "}
          </div>
          <div className="flex">
            <div className="flex-1 space-y-2">
              <div className="flex gap-3 items-start">
                <MapPin className="mt-1" />
                <div>
                  <H4>Lokalita</H4>
                  <div>Slovensko</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Calendar className="mt-1" />
                <div>
                  <H4>Vek</H4>
                  <div>25r</div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex gap-3 items-start">
                <User className="mt-1" />
                <div>
                  <H4>Hlada</H4>
                  <div>{data?.userInfo.genderSearch || "Neuvedene"}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <CalendarIcon className="mt-1" />
                <div>
                  <H4>Naposledy prihlaseny</H4>
                  <div>{data?.userInfo.createdAt?.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <H4 className="flex gap-3 items-baseline">
        Nahrane fotky{" "}
        {images && images.length > 0 && <Small>Kliknutim na obrazok zobrazite fotky v plnej velkosti</Small>}
      </H4>

      {images && images.length > 0 ? (
        <div className="flex mt-4 gap-3 border-2 border-dashed border-gray-300 p-2">
          {images?.map((file) => (
            <div
              key={file.id}
              className="rounded-md relative w-[70px] h-[70px]"
            >
              <Image
                layout={"fill"}
                className=" object-cover w-full h-full cursor-pointer"
                onClick={() => setSelectedImage(file)}
                //src={URL.createObjectURL(file)}
                //className="h-auto max-w-full rounded-lg"
                src={"/uploads/" + file.userId + "/" + file.link}
                alt=""
              />
            </div>
          ))}
        </div>
      ) : <div>Uzivatel nepridal ziadne fotky</div>}

      </div>
      
      <div className="mt-4 relative p-6 bg-white shadow-sm border border-slate-200 rounded-lg">


      <div className="flex flex-col gap-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Blizsie informácie
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
    </>
  );
}
