"use server";

import { prisma } from "@/db/prisma";
import { Region } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserInfo() {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  if (!session?.user.id) return;

  const userLocation = await prisma.userLocation.findFirst({
    where: {
      userId: session?.user.id,
    },
  });

  const baseUserInfo = {
    email: session.user.email,
    emailVerified: session.user.email,
    nickname: session.user.nickname,
    bio: session.user.bio,
    lastLogin: session.user.lastLogin,
    dob: session.user.dob,
    userLocation: userLocation,
    gender: session.user.gender,
    genderSearch: session.user.genderSearch,
  };

  const userInfo = await prisma.userInfo.findMany({
    where: {
      userId: session?.user.id,
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
    /*await prisma.userInfo.deleteMany({
      where: {
        userId: session.user.id,
      },
    });*/
  
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
        if (!entry || entry === 'all') {
          await prisma.userInfo.deleteMany({
            where: {
              userId: session.user.id,
              questionId: question.id,
            },
          });
          continue;
        }

        if (Array.isArray(entry) && entry.length > 0) {
          for (const choice of entry) {
            await prisma.userInfo.upsert({
              where: {
                questionIdentifier: {
                  questionId: question.id!,
                  userId: session?.user.id,
                },
              },
              create: {
                questionId: question.id,
                userId: session?.user.id,
                questionChoiceId: Number(choice),
              },
              update: {
                questionId: question.id!,
                userId: session?.user.id,
                questionChoiceId: Number(choice),
              },
            });
          }
        }
        if (!Array.isArray(entry)) {
          await prisma.userInfo.upsert({
            where: {
              questionIdentifier: {
                questionId: question.id!,
                userId: session?.user.id,
              },
            },
            create: {
              questionId: question.id,
              userId: session?.user.id,
              questionChoiceId: Number(entry),
            },
            update: {
              questionId: question.id!,
              userId: session?.user.id,
              questionChoiceId: Number(entry),
            },
          });
        }
      }
    }
  
    return { success: true };
  }
  