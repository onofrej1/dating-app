"use client";
import { addPhotos, getUserPhotos, uploadFiles } from "@/actions/files";
import MediaUploader from "@/components/mediaUploader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {  
  Home,
  Search,
  Upload,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { UserPhoto } from "@/generated/prisma";
import Image from "next/image";
import "./gallery.css";

export default function PhotosPage() {
  const { data } = useSession();
  const { data: images = [], refetch } = useQuery({
    queryKey: ["getFiles"],
    refetchOnWindowFocus: false,
    queryFn: () => getUserPhotos(data?.user.id), //readDirectory("/public/gallery"),
  });

  useEffect(() => {
    console.log("refetch");
    //refetch();
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
    <div className="p-4 flex gap-6 mx-auto max-w-7xl">
      <div className="rounded-xl mt-6 self-start relative flex flex-col  bg-white shadow-sm border border-slate-200 w-96">
        <div className="flex flex-col gap-3 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-2">User menu</h2>
          <p className="text-gray-700 text-base"></p>

          <h5 className="flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
            <Home /> Môj profil
          </h5>
          <h5 className="flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
            <Upload /> Nahrať fotky
          </h5>
          <h5 className="flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
            <Search /> Vyhľadávanie
          </h5>

          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Logout
          </button>
          <p className="text-slate-600 leading-normal font-light"></p>
        </div>
      </div>

      <div className="flex-1 mt-6">
        <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg">
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
                </div>
              ))}
            </div>
            <div>
              <div className="my-6">
                <MediaUploader onChange={onChange} />
                <Button onClick={upload}>Upload files</Button>
              </div>
            </div>

            {lightboxDisplay && imageToShow && (
              <div className="lightbox" onClick={hideLightBox}>
                <picture data-icon="icon-heart" className="test">
                  <Image
                    layout="fill"
                    className="lightboximg"
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
    </div>
  );
}
