'use client'
import { Home, LogOut, Search, Upload } from "lucide-react";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";
import Image from "next/image";
import { H3 } from "@/components/typography";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

  return (
    <div>
      <Navbar />
      <section className="relative h-[300px] flex flex-col items-center justify-center text-center text-white py-0 px-3">
        <div className="video-docker absolute top-0 left-0 w-full h-[300px] overflow-hidden">
          <Image
            src="/images/header.jpg"
            alt="Dice"
            width={1080}
            height={300}
            className="object-cover object-center w-full h-[300px]"
          />
        </div>
      </section>

      <div className="mx-auto">
        <div className="p-4 flex gap-6 mx-auto max-w-7xl">
          <div className="relative self-start flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
            <div className="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1">
              <h5 className="items-center flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {data?.user.name} ({data?.user.email})
              </h5>
            </div>

            <div className="p-4 flex flex-col gap-4">
              <Link href="/profile">
                <H3 className="flex gap-3 items-center">
                  <Home /> Môj profil
                </H3>
              </Link>
              <Link href="/photos">
                <H3 className="flex gap-3 items-center">
                  <Upload /> Nahrať fotky
                </H3>
              </Link>
              <Link href="/users">
                <H3 className="flex gap-3 items-center">
                  <Search /> Vyhľadávanie
                </H3>
              </Link>
              <Link href="/signout">
                <H3 className="flex gap-3 items-center">
                  <LogOut color="#000000" /> Odhlasit
                </H3>
              </Link>
            </div>
            <p className="text-slate-600 leading-normal font-light"></p>
          </div>

          <div className="flex-1 mt-6">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
