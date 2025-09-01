"use server";

import path from "node:path";

import fs from "node:fs";
import { prisma } from "@/db/prisma";
const fsp = fs.promises;

const baseUploadDir = process.env.UPLOAD_DIR!;

export async function addPhotos(photos: string[], userId?: string) {
  if (!userId) {
    throw new Error("Missing user id");
  }

  for (const photo of photos) {
    await prisma.userPhoto.create({
      data: {
        userId,
        link: photo,
        addedAt: new Date(),
        details: "",
      },
    });
  }
}

export async function deletePhotos(photos: number[], userId?: string) {
  if (!userId) {
    throw new Error("Missing user id");
  }

  await prisma.userPhoto.deleteMany({
    where: {
      userId,
      id: {
        in: photos,
      },
    },
  });
}

export async function uploadFiles(
  formData: FormData,
  uploadDir: string | Record<string, string> = ""
) {
  const keys = Array.from(formData.keys());

  for (let i = 0; i < Number(keys.length); i++) {
    const file = formData.get(keys[i]) as File;

    /*if (!file || file.name === 'img4.jpg') {
      throw new Error("Missing file data:" + keys[i]);
    }*/

    const dir =
      typeof uploadDir === "string" ? uploadDir : uploadDir?.[keys[i]];
    const targetPath = path.join(process.cwd(), baseUploadDir, dir);

    try {
      fs.mkdirSync(targetPath, { recursive: true });
      const filePath = path.join(targetPath, file.name);
      console.log("f", file);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      console.log(error);
      return { status: "error" };
    }
  }
  return { status: "success" };
}

export async function deleteFile(filePath: string) {
  const file = path.join(process.cwd(), baseUploadDir, filePath);
  if (!fs.existsSync(file)) {
    return { success: false, message: `File ${file} does not exists.` };
  }
  const fileToDelete = await fsp.readFile(file);
  if (fileToDelete) {
    await fsp.unlink(file);
  }
  return { success: true };
}

export async function getUserPhotos(userId?: string) {
  console.log(userId);
  if (!userId) {
    return [];
  }

  const data = await prisma.userPhoto.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });

  return data;
}

export async function readDirectory(dir: string) {
  const dirPath = path.join(process.cwd(), dir);
  const files = await fsp.readdir(dirPath, { withFileTypes: true });
  const data = [];
  for (const file of files) {
    const filePath = path.join(file.path, file.name);
    const f = await fsp.readFile(filePath, {
      encoding: "base64",
    });
    data.push({
      src: f,
      name: file.name,
      path: file.path,
    });
  }
  return data;
}
