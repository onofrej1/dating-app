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
import { ChevronLeft, ChevronRight, Info, Upload, XIcon } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PhotosPage() {
  const { data } = useSession();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: images = [], refetch } = useQuery({
    queryKey: ["getImages", data?.user.id],
    refetchOnWindowFocus: false,
    queryFn: () => getUserPhotos(data?.user.id),
  });

  useEffect(() => {
    refetch();
  }, [data?.user.id, refetch]);

  console.log(images, data?.user.id);

  const [files, setFiles] = useState<File[]>([]);
  const onChange = (selectedFiles: File[]) => {
    if (images.length + selectedFiles.length > 10) {
      alert('Prekroceny maximalny pocet fotiek.');
      return;
    }
    setFiles(selectedFiles);
  };

  const [lightboxDisplay, setLightBoxDisplay] = useState(false);
  const [imageToShow, setImageToShow] = useState<UserPhoto>();

  const showImage = (image: UserPhoto) => {
    setImageToShow(image);
    setLightBoxDisplay(true);
  };

  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  const showNext = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === imageToShow?.id);
    if (currentIndex >= images.length - 1) {
      setImageToShow(images[0]);
    } else {
      const nextImage = images[currentIndex + 1];
      setImageToShow(nextImage);
    }
  };

  const showPrev = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === imageToShow?.id);
    if (currentIndex <= 0) {
      setImageToShow(images[images.length - 1]);
    } else {
      const nextImage = images[currentIndex - 1];
      setImageToShow(nextImage);
    }
  };

  const upload = async () => {
    if (images.length + files.length > 10) {
      alert('Prekroceny maximalny pocet fotiek.');
      return;
    }
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
    await deleteFile(file.userId + "/" + file.link);
    await deletePhotos([file.id], file.userId);
    refetch();
  };

  return (
    <Card className="gap-6 mx-auto max-w-7xl">
      {images.length > 0 && (
        <CardHeader>
          <CardTitle>Pocet fotiek: {images?.length} / 10</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="gallery mb-4">
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

        <div className="flex p-4 mb-4 text-blue-800 rounded-lg bg-blue-50">
          <Info className="mr-4" />

          <div>
            <span className="font-medium">Pravidla pre nahravanie fotiek:</span>
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
                <div className="flex mt-5">
                  <Button>
                    <Upload size={"16"} /> Nahrat fotky
                  </Button>
                </div>
              </CredenzaTrigger>
              <CredenzaContent className="min-w-[750px]">
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
                    disabled={files.length === 0}
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
            <div className="nav-wrapper">
              <div className="nav-prev cursor-pointer" onClick={showPrev}>
                <ChevronLeft size={"28px"} color="#000000" />
              </div>
              <div className="nav-next cursor-pointer" onClick={showNext}>
                <ChevronRight size={"28px"} color="#000000" />
              </div>
            </div>

            <picture className="lightbox-pict">
              <Image
                layout="fill"
                className="lightbox-img"
                alt={imageToShow.link}
                src={"/uploads/" + imageToShow.userId + "/" + imageToShow.link}
              />
            </picture>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
