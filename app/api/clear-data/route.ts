import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  await prisma.user.deleteMany();
  await prisma.userInfo.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionChoice.deleteMany();

  return NextResponse.json({ result: "done" });
}