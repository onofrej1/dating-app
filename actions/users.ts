"use server";

import { Filter } from "@/components/user-filter";
import { prisma } from "@/db/prisma";
import { Region } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { subtractYears } from "@/lib/utils";
import { headers } from "next/headers";

function getFilter(filters: Filter[], filterName: string) {
  return filters.find((filter) => filter.name === filterName);
}

export async function getUsers(filters: Filter[] = []) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const minAge = getFilter(filters, 'age-min');
  const maxAge = getFilter(filters, 'age-max');
  let userIds: string[] = [];

  if (minAge && maxAge) {
    const date = new Date();
    const maxDate = new Date(subtractYears(date, Number(minAge.value)));
    const minDate = new Date(subtractYears(date, Number(maxAge.value)));

    const users = await prisma.user.findMany({
      where: {
        dob: { gte: minDate, lte: maxDate },
      },
    });
    userIds = users.map((user) => user.id);
  }

  const country = getFilter(filters, 'country');
  const region = getFilter(filters, 'region');
  const city = getFilter(filters, 'city');

  if (country || region || city) {
    const userLocations = await prisma.userLocation.findMany({
      where: {
        country: country?.value as string,
        region: region?.value as Region,
        city: city?.value as string,
        userId: {
          in: minAge && maxAge ? userIds : undefined,
        },
      },
    });
    userIds = userLocations.map((userLocation) => userLocation.userId);
  }

  //console.log("get users with filters:", filters, userIds);

  const customFilters = ["age-min", "age-max", "country", "region", "city"];
  const checkFilters = filters.filter((filter) => !customFilters.includes(filter.name));

  for (const filter of checkFilters) {
    console.log("search", filter);
    const inValue = Array.isArray(filter.value)
      ? filter.value
      : filter.value
      ? [Number(filter.value)]
      : undefined;
    const data = await prisma.userInfo.findMany({
      where: {
        userId: {
          in: userIds.length > 0 ? userIds : undefined,
        },
        question: {
          name: filter.name,
        },
        //value: value && typeof value === 'string' ? value : undefined,
        questionChoiceId: {
          in: inValue as number[],
        },
      },
    });
    if (data.length === 0) {
      userIds = [];
      break;
    }
    userIds = data.map((d) => d.userId);
  }

  if (filters.length > 0 && userIds.length === 0) {
    return [];
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      image: true,
      email: true,
      nickname: true,
      dob: true,
      lastLogin: true,
      gender: true,
      genderSearch: true,
      name: true,
      userLocation: true,
      userInfo: {
        include: {
          question: true,
          questionChoice: true,
        },
      },
    },
    where: {
      id: {
        in: userIds && userIds.length > 0 ? userIds : undefined,
      },
    },
  });
  console.log('users length:', users.length);

  return users;
}

export async function getUser() {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
  });

  return { user };
}
