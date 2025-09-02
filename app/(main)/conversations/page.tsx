"use client";
import { getConversations } from "@/actions/chat";
import Chat from "@/components/chat/chat";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export default function Conversations() {
  const [conversationId, setConversationId] = useState<number>();
  const { data: conversations = [], isFetching } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchOnWindowFocus: false,
  });
  if (isFetching) return null;

  return (
    <div className="max-w-6xlxx mx-auto p-6 border border-gray-300 rounded-2xl">
      <div className="flex h-[calc(100vh-120px)]">
        <div className="h-full p-3 border-r border-dashed border-gray-300">
          {conversations.map((conversation) => {
            return (
              <div key={conversation.id} className="mb-3">
                <div className="flex items-center gap-4">
                  <img
                    className="w-10 h-10 rounded-full"
                    src="https://github.com/shadcn.png"
                    alt=""
                  />
                  <div
                    className="font-medium dark:text-white"
                    onClick={() =>
                      setConversationId(conversation.conversation.id)
                    }
                  >
                    <div>
                      {conversation.user.name} ({conversation.user.email})
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Joined in August 2014
                    </div>

                    <div className="pl-4xx">
                      <small>
                        {conversation.conversation.lastMessage?.content}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 p-4">
          {conversationId && <Chat conversationId={conversationId} />}
        </div>
      </div>
    </div>
  );
}
