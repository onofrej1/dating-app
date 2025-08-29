"use server";

import { Option } from "@/components/multiple-selector";
import { Filter } from "@/components/user-filter";
import { prisma } from "@/db/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserPreferences() {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  if (!session?.user.id) throw new Error("Unauthorized");

  const userPreferences = await prisma.userPreferences.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      question: true,
      questionChoice: true,
    },
  });

  const questions = await prisma.question.findMany({
    include: { questionChoices: true },
  });

  const options = questions.map((question) => {
    const options = question.questionChoices.map((questionChoice) => ({
      value: questionChoice.id.toString(),
      label: questionChoice.title,
    }));
    return { ...question, options };
  });

  let preferences: Filter[] = [];
  const defaultData: Record<string, string | number | Option[]> = {};

  userPreferences.forEach((userPreference) => {
    let filter: Filter;
    if (userPreference.value) {
      filter = {
        name: userPreference.question.name,
        value: userPreference.value,
        type: userPreference.question.type,
      };
      preferences.push(filter);
      defaultData[userPreference.question.name] = userPreference.value;
    } else {
      const exist = preferences.find((p) => p.name === userPreference.question.name);
      if (!exist) {
        preferences.push({
          name: userPreference.question.name,
          value: [],
          type: userPreference.question.type,
        });
        defaultData[userPreference.question.name] = [];
      }
      if (userPreference.questionChoice) {
        const option: Option = {
          value: userPreference.questionChoice.id.toString(),
          label: userPreference.questionChoice.title,
        };
        (defaultData[userPreference.question.name] as Option[]).push(option);
        //(defaultData[entry.question.name] as number[]).push(entry.questionChoiceId);
      }
      preferences = preferences.map((p) => {
        if (p.name === userPreference.question.name && userPreference.questionChoiceId) {
          (p.value as number[]).push(userPreference.questionChoiceId);
        }
        return p;
      });
    }
  });

  return { userPreferences: preferences, defaultData, filterOptions: options };
}

export async function saveUserPreferences(
    name: string,
    value: number | number[] | string
  ) {
    const header = await headers();
    const session = await auth.api.getSession({
      headers: header,
    });
    if (!session?.user.id) return;
  
    const question = await prisma.question.findFirst({
      where: {
        name,
      },
    });
    if (!question) return;
  
    await prisma.userPreferences.deleteMany({
      where: {
        userId: session.user.id,
        questionId: question.id,
      },
    });
  
    if (typeof value === "string" && value !== 'empty') {
      await prisma.userPreferences.create({
        data: {
          questionId: question.id,
          userId: session?.user.id,
          value: value,
        },
      });
    }
  
    if (typeof value === "number") {
      await prisma.userPreferences.create({
        data: {
          questionId: question.id,
          userId: session?.user.id,
          questionChoiceId: value,
        },
      });
    }
  
    if (Array.isArray(value) && value.length > 0) {
      for (const choice of value) {
        await prisma.userPreferences.create({
          data: {
            questionId: question.id,
            userId: session?.user.id,
            questionChoiceId: choice,
          },
        });
      }
    }
    return { success: true };
  }

  export async function saveLocation(filter: {
    country?: string | null,
    region?: string | null,
    city?: string | null,
  }) {
    const header = await headers();
    const session = await auth.api.getSession({
      headers: header,
    });
    if (!session?.user.id) return;
  
    let question = await prisma.question.findFirst({
      where: {
        name: 'country',
      },
    });
    if (question && filter.country !== undefined) {
      await prisma.userPreferences.deleteMany({
        where: {
          userId: session.user.id,
          questionId: question.id,
        },
      });
  
      if (filter.country && filter.country !== 'all') {
        await prisma.userPreferences.create({
          data: {
            questionId: question.id,
            userId: session?.user.id,
            value: filter.country,
          },
        });
      }
    }
  
    question = await prisma.question.findFirst({
      where: {
        name: 'region',
      },
    });
    if (question && filter.region !== undefined) {
      await prisma.userPreferences.deleteMany({
        where: {
          userId: session.user.id,
          questionId: question.id,
        },
      });
  
      if (filter.region && filter.region !== 'all') {
        await prisma.userPreferences.create({
          data: {
            questionId: question.id,
            userId: session?.user.id,
            value: filter.region,
          },
        });
      }
    }
  
    question = await prisma.question.findFirst({
      where: {
        name: 'city',
      },
    });
    if (question && filter.city !== undefined) {
      await prisma.userPreferences.deleteMany({
        where: {
          userId: session.user.id,
          questionId: question.id,
        },
      });
  
      if (filter.city && filter.city !== 'all') {
        await prisma.userPreferences.create({
          data: {
            questionId: question.id,
            userId: session?.user.id,
            value: filter.city,
          },
        });
      }
    }
  }