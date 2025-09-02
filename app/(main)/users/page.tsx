"use client";
import { startConversation } from "@/actions/chat";
import { getUsers } from "@/actions/users";
import { Button } from "@/components/ui/button";
import UserFilter, { Filter } from "@/components/user-filter";
import { Countries, Regions } from "@/lib/countries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {  
  Mars,
  MessageSquareText,  
  UserRoundSearch,
  Venus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const filters = useRef<Filter[]>([]);

  const { data: users, isLoading } = useQuery({
    queryKey: ["getUsers"],
    refetchOnWindowFocus: false,
    queryFn: () => {
      return getUsers(filters.current);
    },
  });

  const getAge = (birthDate: string | Date) =>
    Math.floor(
      (new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e10
    );

  const showProfile = (id: string) => {
    router.push(`/user-profile/${id}`);
  }

  const startUserConversation = async (userId: string) => {
    await startConversation(userId);
    router.push("/conversations");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <UserFilter
        filters={filters}
        onFilterChange={() => {
          queryClient.invalidateQueries({ queryKey: ["getUsers"] });
        }}
      />

      <div className="mt-4">Výsledky vyhľadávania: {users?.length} zaznamov</div>

      <div className="p-4 mb-4 grid grid-cols-1 gap-3">
        {users?.map((user) => (
          <div
            key={user.id}
            className="relative flex w-full bg-white shadow-sm border border-slate-200 rounded-lg"
          >
            <div className="relative shrink-0 overflow-hidden p-4">
              <Image
                src={
                  "/images/" + (user.gender === "man" ? "man.png" : "woman.png")
                }
                alt="card-image"
                width={100}
                height={100}
                className="h-full w-full rounded-md md:rounded-lg object-cover"
              />
            </div>
            <div className="p-3 flex-1">
              <h4 className="flex gap-2 items-center mb-2 text-slate-800 text-xl font-semibold">
                {user.name},{" "}
                <span>{user.gender === "man" ? "muž" : "žena"}</span>
                {user.gender === "man" ? <Mars /> : <Venus />}
              </h4>
              {/*<div className="mb-8 text-slate-600 leading-normal font-light">
                Like so many organizations these days
              </div>*/}
              <div className="flex gap-2">
                <div className="flex-1">
                  <div>
                    <strong>Vek:</strong> {user.dob ? getAge(user.dob) : null}
                  </div>

                  <div>
                    <strong>Lokalita:</strong>{" "}
                    {user.userLocation?.country ? (
                      <span>
                        {
                          Countries[
                            user.userLocation.country as keyof typeof Countries
                          ]
                        }
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <strong>Kraj:</strong>
                    {user.userLocation?.region ? (
                      <span> {Regions[user.userLocation.region]}</span>
                    ) : null}{" "}
                    {user.userLocation?.city ? (
                      <span>({user.userLocation.city})</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex-1">
                  <div>
                    <strong>Naposledy prihlaseny:</strong>{" "}
                    {user.lastLogin?.toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Datum registracie:</strong>{" "}
                    {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={'outline'}
                  size={"sm"}
                  className="mt-2 border-black"
                  onClick={() => showProfile(user.id)}
                >
                  <UserRoundSearch /> <span className="font-bold">Zobrazit profil</span>
                </Button>
                <Button
                  size={"sm"}
                  className="mt-2"
                  onClick={() => startUserConversation(user.id)}
                >
                  <MessageSquareText className="font-bold" /> Poslat spravu
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
