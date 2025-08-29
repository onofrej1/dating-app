import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, File as FileIcon } from "lucide-react";
import { formatFileSize, generateVideoThumbnail, urlToFile } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import Image from "next/image";

interface FileUploaderProps {
  field: ControllerRenderProps;
  allowedTypes?: string[];
  maxSize?: number;
  label?: string;
}

export default function FileUploader(props: FileUploaderProps) {
  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
  ];
  const {
    label,
    field,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
  } = props;
  const [file, setFile] = useState<File | null>();
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFile = async (filePath: string) => {
    const uploadPath = process.env.NEXT_PUBLIC_UPLOAD_DIR;
    return await urlToFile(`${uploadPath}/${filePath}`, filePath, "image/png");
  };

  useEffect(() => {
    if (field.value?.file) {
      setFile(field.value.file);
    } else if (field.value && typeof field.value === "string") {
      getFile(field.value).then((file) => {
        const fieldValue = { file, previousFile: file, isDirty: false };

        field.onChange(fieldValue);
        setFile(file);
      });
    }
  }, [field, field.value]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (!uploadedFile) return;

    if (!allowedTypes.includes(uploadedFile.type.toLowerCase())) {
      alert("This file type is not supported !");
      return;
    }

    if (uploadedFile.size > maxSize) {
      alert("Uploaded file is too big !");
      return;
    }

    if (uploadedFile.type.startsWith("video")) {
      const thumbnail = await generateVideoThumbnail(uploadedFile);
      if (imageRef && imageRef.current) {
        imageRef.current.src = thumbnail;
      }
    }
    setFile(uploadedFile);
    field.onChange({ ...field.value, file: uploadedFile, isDirty: true });
  };

  const removeFile = async () => {
    setFile(null);
    field.onChange({ ...field.value, file: null, isDirty: true });
  };

  const isImage = (type: string) => {
    return ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
      type.toLowerCase()
    );
  };

  const isVideo = (type: string) => {
    return ["video/mp4", "video/avi"].includes(type);
  };

  const uploadMessage = () => {
    const types = allowedFileTypes.map((t) => {
      const type = t.split("/");
      if (type.length === 2) {
        return type[1];
      }
      return t;
    });
    return `${types
      .map((t) => t.toUpperCase())
      .join(", ")} (MAX. ${formatFileSize(maxSize)})`;
  };

  return (
    <div>
      {file ? (
        <div className="flex flex-col justify-center">
          {isImage(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <Image
                alt="imagePreview"
                className="w-full"
                width={100}
                height={100}
                src={URL.createObjectURL(file)}
              />
            </div>
          )}

          {isVideo(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <Image
                alt="videoPreview"
                ref={imageRef}
                width={100}
                height={100}
                src="/assets/images/upload.png"
              />
            </div>
          )}

          {!isVideo(file.type) && !isImage(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <FileIcon /> {file.name} [${formatFileSize(file.size)}]
            </div>
          )}

          <div className="flex justify-between gap-3 text-center">
            <Button
              type="button"
              variant="secondary"
              size={"sm"}
              onClick={removeFile}
            >
              <Trash2 /> Remove file
            </Button>
            <Button
              type="button"
              size={"sm"}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload /> Change file
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2">{label}</div>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload />
                <p className="mb-2 mt-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">{uploadMessage()}</p>
              </div>
            </label>
          </div>
        </>
      )}
      <input
        id="dropzone-file"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
