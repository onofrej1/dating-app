"use client";
import {
  addPhotos,
  deleteFile,
  deletePhotos,
  getUserPhotos,
  uploadFiles,
} from "@/actions/files";
import MediaUploader from "@/components/mediaUploader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Upload, XIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { UserPhoto } from "@/generated/prisma";
import Image from "next/image";
import "./gallery.css";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import Loader from "@/components/loader";
import {
  Card,  
  CardContent,  
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PhotosPage() {
  const { data } = useSession();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    setIsUploading(true);
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
    setIsUploading(false);
  };

  const removeFile = async (file: (typeof images)[0]) => {
    console.log(file);
    await deleteFile(file.userId + "/" + file.link);
    await deletePhotos([file.id], file.userId);
    refetch();
  };

  return (
    <Card className="gap-6 mx-auto max-w-7xl">
      <CardHeader>
        <CardTitle>Pocet fotiek: {images?.length} / 10</CardTitle>
      </CardHeader>
      <CardContent>
        
          <div className="photos mb-4">
            {images?.map((file) => (
              <div key={file.id} className={"relative"}>
                <Image
                  layout="fill"
                  key={file.id}
                  onClick={() => showImage(file)}
                  src={"/uploads/" + file.userId + "/" + file.link}
                  alt={file.link}
                />
                <div className="bg-white rounded-full w-6 h-6 absolute top-2 right-2 flex items-center justify-center">
                  <XIcon
                    onClick={() => removeFile(file)}
                    className="size-4 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <svg
              className="shrink-0 inline w-4 h-4 me-3 mt-[2px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">
                Pravidla pre nahravanie fotiek:
              </span>
              <ul className="mt-1.5 list-disc list-inside">
                <li>Maximalna velkost: 10mb</li>
                <li>Nevhodne subory budu zmazane</li>
                <li>Maximalny pocet suborov: 10</li>
                <li>
                  Fotky sa zobrazia po schvaleni administratorom (do 24h od
                  pridania)
                </li>
              </ul>

              <Credenza
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
              >
                <CredenzaTrigger asChild>
                  <div className="flex justify-center mt-5">
                    <button
                      type="button"
                      className="gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                    >
                      <Upload size={"16"} /> Nahrat fotky
                    </button>
                  </div>
                </CredenzaTrigger>
                <CredenzaContent>
                  {isUploading && <Loader />}
                  <CredenzaHeader>
                    <CredenzaTitle>Upload</CredenzaTitle>
                    <CredenzaDescription>
                      Vyberte subory pre nahranie.
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody>
                    <MediaUploader onChange={onChange} />
                  </CredenzaBody>
                  <CredenzaFooter>
                    <Button
                      onClick={async () => {
                        await upload();
                        setUploadDialogOpen(false);
                      }}
                    >
                      <Upload /> Nahrat fotky
                    </Button>
                  </CredenzaFooter>
                </CredenzaContent>
              </Credenza>
            </div>
          </div>

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
        
      </CardContent>
    </Card>
  );
}
