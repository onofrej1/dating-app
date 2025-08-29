import { prisma } from "@/db/prisma";
import { faker } from "@faker-js/faker";
import {
  Question,
  QuestionChoice,
  UserInfo,
  UserLocation,
  UserPreferences,
} from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Regions, regions } from "@/lib/countries";

function random<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET() {
  await prisma.conversation.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userInfo.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionChoice.deleteMany();

  let count = Array.from({ length: 10 });

  /*for (const i of Array.from({ length: 100 })) {
    console.log(i);
    let title = faker.lorem.word();
    categories.push({
      name: title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });
  }*/

  const dateOfBirth = [
    new Date("1985-04-05"),
    new Date("1995-04-05"),
    new Date("1978-04-06"),
    new Date("2002-03-05"),
    new Date("2004-04-05"),
    new Date("1985-04-07"),
    new Date("1994-09-05"),
  ];

  await auth.api.signUpEmail({
    body: {
      name: faker.person.fullName(),
      email: "admin@example.com",
      password: process.env.TEST_USER_PASSWORD!,
      nickname: faker.person.firstName(),
      popularity: 0,
      gender: "man",
      genderSearch: "woman",
      dob: random(dateOfBirth),
      bio: faker.person.bio(),
      image: "",
    },
  });

  for (const [] of count.entries()) {
    const gender = random(["man", "woman"]);
    const genderSearch = gender === "man" ? "woman" : "man";
    await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: faker.person.lastName().toLocaleLowerCase() + "@example.com",
        password: process.env.TEST_USER_PASSWORD!,
        nickname: faker.person.firstName(),
        popularity: 0,
        gender,
        genderSearch,
        dob: random(dateOfBirth),
        bio: faker.person.bio(),
        //image: '',
      },
    });
  }

  const ids = await prisma.user.findMany({ select: { id: true } });
  const userIds = ids.map((i) => i.id);

  const userLocations: Partial<UserLocation>[] = [];
  const locationCount = Array.from({ length: 5 });

  for (const [index] of locationCount.entries()) {
    const region = random(['KE', 'PO', 'ZA']); // random(Object.keys(Regions));
    userLocations.push({
      country: 'SK',
      region: region as keyof typeof Regions,
      city: random(regions[region as keyof typeof regions]),
      userId: userIds[index],
    });
  }
  await prisma.userLocation.createMany({ data: userLocations as UserLocation[] });

  count = Array.from({ length: 10 });

  const questions: Partial<Question>[] = [
    {
      id: 1,
      title: "Výška",
      name: "height",
      text: "Moja výška",
      category: "basic-info",
      type: "multiple-select",
      order: 1,
    },
    {
      id: 2,
      title: "Farba očí",
      name: "eye-color",
      category: "basic-info",
      type: "multiple-select",
      order: 2,
    },
    {
      id: 3,
      title: "Postava",
      name: "figure",
      category: "basic-info",
      type: "multiple-select",
      order: 3,
    },
    {
      id: 4,
      title: "Vlasy",
      name: "hair",
      category: "basic-info",
      type: "multiple-select",
      order: 4,
    },
    {
      id: 5,
      title: "Fajčím",
      name: "smoking",
      category: "live-style",
      type: "multiple-select",
      order: 5,
    },
    {
      id: 6,
      title: "Pijem alkohol",
      name: "drinking",
      category: "live-style",
      type: "multiple-select",
      order: 6,
    },
    {
      id: 7,
      title: "Vzdelanie",
      name: "education",
      category: "live-style",
      type: "multiple-select",
      order: 7,
    },
    {
      id: 8,
      title: "Manželský stav",
      name: "marital-status",
      category: "live-style",
      type: "multiple-select",
      order: 8,
    },
    {
      id: 9,
      title: "Vierovyznanie",
      name: "religion",
      text: "Ake je tvoje vierovyznanie",
      category: "live-style",
      type: "multiple-select",
      order: 9,
    },
    {
      id: 10,
      title: "Zamestnanie",
      name: "job",
      category: "live-style",
      type: "multiple-select",
      order: 10,
    },
    {
      id: 11,
      title: "Záľuby",
      name: "hobby",
      category: "live-style",
      type: "checkbox-group",
      order: 11,
    },
    {
      id: 12,
      title: "Hladam",
      name: "gender-search",
      category: "user-info",
      type: "select",
      order: 11,
    },
    {
      id: 13,
      title: "Vek min",
      name: "age-min",
      category: "user-info",
      type: "range",
      order: 11,
    },
    {
      id: 14,
      title: "Vek max",
      name: "age-max",
      category: "user-info",
      type: "range",
      order: 11,
    },
    {
      id: 15,
      title: "Kraj",
      name: "country",
      category: "user-info",
      type: "checkbox-group",
      order: 11,
    },
    {
      id: 16,
      title: "Region",
      name: "region",
      category: "user-info",
      type: "checkbox-group",
      order: 11,
    },
    {
      id: 17,
      title: "Mesto",
      name: "city",
      category: "user-info",
      type: "checkbox-group",
      order: 11,
    },
  ];

  await prisma.question.createMany({ data: questions as Question[] });
  const newQuestions = await prisma.question.findMany();

  const questionChoices: Partial<QuestionChoice>[] = [];

  let height = 131;
  for (const [index] of count.entries()) {
    questionChoices.push({
      questionId: 1,
      title: `${height} - ${height + 4}`,
      displayOrder: index + 1,
    });
    height = height + 5;
  }

  const eyeColor = ["Cierne", "Modre", "Hnede", "Sive", "Zelene", "Ine"];
  for (const [index] of eyeColor.entries()) {
    questionChoices.push({
      questionId: 2,
      title: eyeColor[index],
      displayOrder: index + 1,
    });
  }

  const figure = ["Chuda", "Stihla", "Primerna", "Atleticka", "Plnostihla"];
  for (const [index] of figure.entries()) {
    questionChoices.push({
      questionId: 3,
      title: figure[index],
      displayOrder: index + 1,
    });
  }

  const hair = ["Cierne", "Blond", "Rysave", "Cervene"];
  for (const [index] of hair.entries()) {
    questionChoices.push({
      questionId: 4,
      title: hair[index],
      displayOrder: index + 1,
    });
  }

  const smoking = ["Nie", "Prilezitostne", "Denne"];
  for (const [index] of smoking.entries()) {
    questionChoices.push({
      questionId: 5,
      title: smoking[index],
      displayOrder: index + 1,
    });
  }

  const alcohol = ["Nie", "Prilezitostne", "Casto"];
  for (const [index] of alcohol.entries()) {
    questionChoices.push({
      questionId: 6,
      title: alcohol[index],
      displayOrder: index + 1,
    });
  }

  const education = [
    "Zakladne",
    "Stredne",
    "Stredne s maturitou",
    "Vysokoskolske",
    "Post gradualne",
  ];
  for (const [index] of education.entries()) {
    questionChoices.push({
      questionId: 7,
      title: education[index],
      displayOrder: index + 1,
    });
  }

  const status = [
    "Slobodny/a, nikdy zenaty/vydata",
    "Rozvedeny/a",
    "Ovdoveny/a",
  ];
  for (const [index] of status.entries()) {
    questionChoices.push({
      questionId: 8,
      title: status[index],
      displayOrder: index + 1,
    });
  }

  const religion = [
    "Rimskokatolicke",
    "Evanielicke",
    "Greckokatolicke",
    "Krestanske",
  ];

  for (const [index] of religion.entries()) {
    questionChoices.push({
      questionId: 9,
      title: religion[index],
      displayOrder: index + 1,
    });
  }

  const jobs = [
    "Programator",
    "Ucitel",
    "Lekar",
    "Lektor",
    "Vodic",
    "Uctovnik"
  ];

  for (const [index] of jobs.entries()) {
    questionChoices.push({
      questionId: 10,
      title: jobs[index],
      displayOrder: index + 1,
    });
  }

  const hobby = [
    "Cestovanie",
    "Divadlo",
    "Knihy",
    "Nakupovanie",
    "Domace zvierata",
    "Pc/internet",
    "Sport",
    "Turistika",
    "Veda",
    "Tanec",
    "Varenie",
    "Domace prace",
    "Politika",
    "Malovanie",
  ];

  for (const [index] of hobby.entries()) {
    questionChoices.push({
      questionId: 11,
      title: hobby[index],
      displayOrder: index + 1,
    });
  }

  const genderSearch = [
    "Muza",
    "Zenu",
  ];

  for (const [index] of genderSearch.entries()) {
    questionChoices.push({
      questionId: 12,
      title: genderSearch[index],
      displayOrder: index + 1,
    });
  }

  await prisma.questionChoice.createMany({
    data: questionChoices as QuestionChoice[],
  });

  const userInfo: Partial<UserInfo>[] = [];

  let choices;
  let choicesIds;
  for (const question of newQuestions) {
    choices = await prisma.questionChoice.findMany({
      where: {
        questionId: question.id,
      },
    });
    choicesIds = choices.map((q) => q.id);

    for (const [index] of userIds.entries()) {
      userInfo.push({
        userId: userIds[index],
        questionId: question.id,
        questionChoiceId: random(choicesIds),
      });
    }
  }

  await prisma.userInfo.createMany({
    data: userInfo as UserInfo[],
  });

  const userPreferences: Partial<UserPreferences>[] = [];

  for (const question of newQuestions) {
    choices = await prisma.questionChoice.findMany({
      where: {
        questionId: question.id,
      },
    });
    choicesIds = choices.map((q) => q.id);

    for (const [index] of userIds.entries()) {
      const choiceIds: number[] = [];
      const l = choicesIds.length > 2 ? Math.floor(choicesIds.length / 2) : 1;
      const arr = Array.from({ length: l }, (_, i) => i + 1);
      const length = random(arr);
      do {
        const val = random(choicesIds);
        if (!choiceIds.includes(val)) {
          choiceIds.push(val);
          userPreferences.push({
            userId: userIds[index],
            questionId: question.id,
            questionChoiceId: val,
          });
        }
      } while (choiceIds.length !== length);
    }
  }

  await prisma.userPreferences.createMany({
    data: userPreferences as UserPreferences[],
  });

  for (const [] of count.entries()) {
    //const i = index + 1;
    //console.log(i);
    /*posts.push({
      title: faker.lorem.word(),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 5 }),
      slug: faker.lorem.slug(),
      authorId: random(userIds),
      status: random(["DRAFT", "PUBLISHED"]),
      metaTitle: faker.lorem.word(),
    });*/
  }

  return NextResponse.json({ result: "done" });
}
