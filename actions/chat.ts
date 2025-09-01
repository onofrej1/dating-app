"use server";

import { prisma } from "@/db/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function startConversation(userId: string) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user1Conversation = await prisma.conversationMember.findMany({
    where: { userId },
    select: {
      conversationId: true,
    },
  });
  const user2conversation = await prisma.conversationMember.findFirst({
    where: { 
      userId: session.user.id,
      conversationId: {
        in: user1Conversation.map(x => x.conversationId),
      }
    },
    select: {
      conversationId: true,
    },
  });
  if (user2conversation) {
    throw new Error('Conversation already exists.');
  }

  const conversation = await prisma.conversation.create({
    data: {
      isGroup: false,
    },
    select: {
      id: true,
    },
  });

  await prisma.conversationMember.create({
    data: {
      user: { connect: { id: session.user.id } },
      conversation: { connect: { id: conversation.id } },
    },
  });

  await prisma.conversationMember.create({
    data: {
      user: { connect: { id: userId } },
      conversation: { connect: { id: conversation.id } },
    },
  });
  return { success: true };
}

export async function getMessages(conversationId: number) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return prisma.message.findMany({
    where: {
      conversationId,
    },
    select: {
      id: true,
      content: true,
      type: true,
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function createMessage(
  conversationId: number,
  content: string,
  type: string = "text"
) {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  const message = await prisma.message.create({
    data: {
      content,
      type,
      senderId: session.user.id,
      conversationId,
    },
    select: {
      id: true,
      content: true,
      type: true,
      sender: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessage: { connect: { id: message.id } },
    },
  });
}

export async function getConversations() {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const loggedUserConversations = await prisma.conversationMember.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      conversationId: true,
    },
  });
  return prisma.conversationMember.findMany({
    where: {
      conversationId: {
        in: loggedUserConversations.map((c) => c.conversationId),
      },
      userId: {
        not: session.user.id,
      },
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      lastSeenMessage: true,
      conversation: {
        select: {
          id: true,
          isGroup: true,
          name: true,
          lastMessage: {
            select: {
              sender: true,
              content: true,
            },
          },
          messages: {
            select: {
              content: true,
              type: true,
              sender: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
