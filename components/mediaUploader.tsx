import React, { useState } from "react";
import { UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";

interface MediaUploaderProps {
  name?: string;
  onChange: (files: File[]) => void;
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
}

export default function MediaUploader(props: MediaUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const {
    onChange,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
    maxFiles = 10,
    //uploadText,
  } = props;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(event.target.files);
    const uploaded = [...selectedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert("This file type is not supported !");
        return;
      }

      if (file.size > maxSize) {
        //alert("Uploaded file is too big !");
        //return;
      }
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length > maxFiles) {
          alert(`You can only add a maximum of ${maxFiles} files`);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) {
      setSelectedFiles(uploaded);
      onChange(uploaded);
    }
  };

  /*const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files as File[];
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
    }
  };*/

  const removeFile = (file: File) => {
    const files = selectedFiles.filter((f) => f.name !== file.name);
    setSelectedFiles(files);
    onChange(files);
  };

  /*const onFileUpload = () => {
    onChange(selectedFiles);
  }*/

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center justify-center w-full mb-3"
        //onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloudIcon />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 10Mb)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="flex flex-wrap mb-2 gap-2">
          {selectedFiles.map((file) => (
            <div className="relative w-[150px] h-[150px] max-w-[150px]" key={file.name}>
              <Image
                alt="img"
                layout="fill"
                className="object-cover w-full h-full"
                src={URL.createObjectURL(file)}
              />
              <div className="bg-white rounded-full w-6 h-6 absolute top-3 right-3 flex items-center justify-center">
                <XIcon onClick={() => removeFile(file)} className="size-4 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
