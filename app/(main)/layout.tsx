import { Home, Search, Upload } from "lucide-react";
import Footer from "./_components/footer";
import { Navbar } from "./_components/navbar";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
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
                <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <svg
                    className="absolute w-12 h-12 text-gray-400 -left-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                John (johndoe@example.com)
              </h5>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <h5 className="flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
                <Home /> Môj profil
              </h5>
              <h5 className="flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
                <Upload /> Nahrať fotky
              </h5>
              <h5 className="flex gap-3 mb-2 text-slate-800 text-xl font-semibold">
                <Search /> Vyhľadávanie
              </h5>
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
