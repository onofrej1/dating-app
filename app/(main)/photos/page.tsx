"use client";
import { addPhotos, getUserPhotos, uploadFiles } from "@/actions/files";
import MediaUploader from "@/components/mediaUploader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Home, Search, Upload, XIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { UserPhoto } from "@/generated/prisma";
import Image from "next/image";
import "./gallery.css";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

export default function PhotosPage() {
  const { data } = useSession();
  const { data: images = [], refetch } = useQuery({
    queryKey: ["getFiles"],
    refetchOnWindowFocus: false,
    queryFn: () => getUserPhotos(data?.user.id), //readDirectory("/public/gallery"),
  });

  useEffect(() => {
    console.log("refetch");
    refetch();
  }, [data?.user.id, refetch]);

  console.log(images, data?.user.id);

  const [files, setFiles] = useState<File[]>([]);
  const onChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const [lightboxDisplay, setLightBoxDisplay] = useState(false);
  const [imageToShow, setImageToShow] = useState<UserPhoto>();

  const showImage = (image: UserPhoto) => {
    //set imageToShow to be the one that's been clicked on
    setImageToShow(image); //set lightbox visibility to true
    setLightBoxDisplay(true);
  };

  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  /*const showNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === imageToShow?.id);
    if (currentIndex >= images.length - 1) {
      setLightBoxDisplay(false);
    } else {
      const nextImage = images[currentIndex + 1];
      setImageToShow(nextImage);
    }
  };

  const showPrev = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === imageToShow?.id);
    if (currentIndex <= 0) {
      setLightBoxDisplay(false);
    } else {
      const nextImage = images[currentIndex - 1];
      setImageToShow(nextImage);
    }
  };*/

  const upload = async () => {
    const uploadData = new FormData();
    for (const file of files) {
      uploadData.append(file.name, file);
    }

    if (!uploadData.entries().next().done) {
      await uploadFiles(uploadData, data?.user.id);
    }
    await addPhotos(
      files.map((f) => f.name),
      data?.user.id
    );
    setFiles([]);
    refetch();
  };

  return (
    <div className="gap-6 mx-auto max-w-7xl">
      <div className="relative bg-white shadow-sm border border-slate-200 rounded-lg">
        <div className="p-4">
          <div className="photos">
            {images?.map((file) => (
              <div key={file.id} className={"relative"}>
                <Image
                  layout="fill"
                  key={file.id}
                  onClick={() => showImage(file)}
                  src={"/uploads/" + file.userId + "/" + file.link}
                  alt={file.link}
                />
                <div className="bg-white rounded-full w-6 h-6 absolute top-3 right-3 flex items-center justify-center">
                  <XIcon onClick={() => console.log(file)} className="size-4" />
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-center font-bold text-md my-2">
            Maximalny pocet fotografii: 10, maximalne velkost subory: 10mb
          </h3>
          <Credenza>
            <CredenzaTrigger asChild>
              <div className="flex justify-center">
                <Button
                  className="text-center mt-2"
                  variant="default"
                  size="lg"
                >
                  <Upload /> Nahrat fotky
                </Button>
              </div>
            </CredenzaTrigger>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>Credenza</CredenzaTitle>
                <CredenzaDescription>
                  A responsive modal component for shadcn/ui.
                </CredenzaDescription>
              </CredenzaHeader>
              <CredenzaBody>
                <MediaUploader onChange={onChange} />
              </CredenzaBody>
              <CredenzaFooter>
                <Button onClick={upload}>
                  <Upload /> Upload files
                </Button>
              </CredenzaFooter>
            </CredenzaContent>
          </Credenza>

          {lightboxDisplay && imageToShow && (
            <div className="lightbox" onClick={hideLightBox}>
              <picture data-icon="icon-heart" className="test">
                <Image
                  layout="fill"
                  className="lightbox-img"
                  alt={imageToShow.link}
                  src={
                    "/uploads/" + imageToShow.userId + "/" + imageToShow.link
                  }
                />
              </picture>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
