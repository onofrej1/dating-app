"use server";

import { prisma } from "@/db/prisma";
import { Region } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserInfo(id?: string) {
  console.log('id', id);

  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  if (!session?.user.id) return;
  const userId = id || session.user.id;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    }
  });
  const userLocation = await prisma.userLocation.findFirst({
    where: {
      userId,
    },
  });

  const baseUserInfo = {
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    userLocation: userLocation,
    gender: user.gender,
    genderSearch: user.genderSearch,
  };

  if (userId === session.user.id) {
    /*baseUserInfo.email = user.email;
    baseUserInfo.emailVerified = user.email;
    baseUserInfo.dob = user.dob;*/
  }

  const userInfo = await prisma.userInfo.findMany({
    where: {
      userId,
    },
    include: {
      question: true,
    },
  });

  const info = userInfo.reduce((acc, data) => {
    if (data.question.allowMultiple) {
      if (!acc[data.question.name]) {
        acc[data.question.name] = [];
      }
      if (data.questionChoiceId) {
        (acc[data.question.name] as string[]).push(
          data.questionChoiceId.toString()
        );
      }
    } else {
      if (data.questionChoiceId) {
        acc[data.question.name] = data.questionChoiceId.toString();
      }
    }

    return acc;
  }, {} as Record<string, string | string[]>);

  const questions = await prisma.question.findMany({
    include: { questionChoices: true },
  });

  return {
    questions,
    userInfo: {
      ...baseUserInfo,
      ...info,
      country: userLocation?.country,
      region: userLocation?.region,
      city: userLocation?.city,
    },
  };
}

export async function saveUserInfo(
  data: Record<string, string | Date | number | number[]>
) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  if (!session?.user.id) return;

  const questions = await prisma.question.findMany();  

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio: data.bio as string,
      gender: data.gender as string,
      genderSearch: data.genderSearch as string,
      dob: data.dob as Date,
    },
  });

  if (data.country) {
    await prisma.userLocation.upsert({
      create: {
        userId: session.user.id,
        country: (data.country as string) || undefined,
        region: (data.region as Region) || undefined,
        city: (data.city as string) || undefined,
      },
      update: {
        country: (data.country as string) || undefined,
        region: (data.region as Region) || undefined,
        city: (data.city as string) || undefined,
      },
      where: {
        userId: session.user.id,
      },
    });
  }

  for (const question of questions) {
    if (data[question.name]) {
      const entry = data[question.name];
      console.log("entry", question.id, entry);

      await prisma.userInfo.deleteMany({
        where: {
          userId: session.user.id,
          questionId: question.id,
        },
      });

      if (!entry || entry === "all") {
        continue;
      }

      if (Array.isArray(entry)) {
        for (const choice of entry) {
          await prisma.userInfo.create({
            data: {
              questionId: question.id,
              userId: session?.user.id,
              questionChoiceId: Number(choice),
            },
          });
        }
      }
      if (!Array.isArray(entry)) {
        await prisma.userInfo.create({
          data: {
            questionId: question.id,
            userId: session?.user.id,
            questionChoiceId: Number(entry),
          },
        });
      }
    }
  }

  return { success: true };
}

export const saveUserLocation = async (
  userId: string,
  country: string,
  region?: string,
  city?: string
) => {
  await prisma.userLocation.create({
    data: {
      userId,
      country,
      region: (region as Region) || undefined,
      city: (city as string) || undefined,
    },
  });
  return { success: true };
};
