"use client";
import { createMessage, getMessages } from "@/actions/chat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Form, { DefaultFormData, FormRender } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { socket } from "@/socket";
import { useSession } from "@/lib/auth-client";
import { FormField } from "@/types/resources";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatProps {
  conversationId: number;
}

export default function Chat(props: ChatProps) {
  const { conversationId } = props;
  const { isPending, data } = useSession();

  const queryClient = useQueryClient();
  const { data: messages = [], isFetching } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Connected to WebSocket server");
      socket.emit("join-chat", conversationId);
    }

    socket.on("connect", onConnect);

    socket.on("message", (message) => {
      console.log("Received message:", message);
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, [conversationId, queryClient]);

  if (isFetching || isPending) return null;

  const handleMessageSend = async (data: DefaultFormData) => {
    await createMessage(conversationId, data.message as string);
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    socket.emit("message", conversationId);
    return {};
  };

  const renderForm: FormRender = ({ fields }) => {
    return (
      <div className="flex justify-between">
        {fields.message}
        <Button type="submit">Send message</Button>
      </div>
    );
  };

  const fields: FormField[] = [{ name: "message", type: "text", label: "" }];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1  max-h-[600px] overflow-scroll">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={cn(
                "flex mb-4",
                message.sender.id === data?.user.id && "justify-end"
              )}
            >
              <div className="flex items-start gap-2.5">
                <Image
                  className="w-8 h-8 rounded-full"
                  src="/images/avatars/1.png"
                  alt="Jese image"
                  width={140}
                  height={140}
                />
                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {message.sender.nickname}
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      11:46
                    </span>
                  </div>
                  <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                    {message.content} I think our users will really appreciate
                    the improvements.
                  </p>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="">
        <Form
          fields={fields}
          action={handleMessageSend}
          //validation="SendMessage"
          render={renderForm}
        />
      </div>
    </div>
  );
}
