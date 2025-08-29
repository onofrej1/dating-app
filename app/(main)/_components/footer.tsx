import "./style.css";

export default function Footer() {
  return (
    <footer className="fade-imgx footer py-8 px-20 shadow-md z-10 flex justify-center items-center">      
      <div className="text-sm font-bold bg-white rounded-2xl p-3">
        Copyright © 2025 Onlinle zoznamka
      </div>
      <div className="flex ml-auto gap-4 border border-gray-300 p-2 bg-white rounded-2xl">
        <a href="#" className="font-bold text-lg">
          Contact: Jon Done
        </a>{" "}
        |
        <a href="#" className="">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
