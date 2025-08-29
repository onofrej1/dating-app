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
    <div className="max-w-6xl mx-auto p-6 border border-gray-300 my-4 rounded-2xl">
      <div className="flex h-[calc(100vh-120px)]">
        <div className="h-full p-3">
          {conversations.map((conversation) => {
            return (
              <div key={conversation.id} className="mb-1">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setConversationId(conversation.conversation.id)
                  }
                >
                  {conversation.user.nickname} - {conversation.user.email}
                </Button>
                <div className="pl-4">
                  <small>
                    {conversation.conversation.lastMessage?.content}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 ">
          {conversationId && <Chat conversationId={conversationId} />}
        </div>
      </div>
    </div>
  );
}
