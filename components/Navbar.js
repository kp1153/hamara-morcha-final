"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "होम" },
  { href: "/desh-videsh", label: "देश-विदेश" },
  { href: "/jeevan-ke-rang", label: "जीवन के रंग" },
  { href: "/vividha", label: "विविध" },
  { href: "/pratirodh", label: "प्रतिरोध" },
  { href: "/team", label: "टीम" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b-2 border-orange-200 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Site Title */}
        <Link href="/" className="flex flex-col items-center mb-4 group">
          <h1 className="text-pink-700 text-4xl font-bold tracking-wide hover:text-red-600 transition-colors duration-300">
            हमारा मोर्चा
          </h1>
          <span className="text-green-700 text-base font-semibold mt-1">
            ہمارا مورچہ
          </span>
          <span className="text-gray-600 text-sm font-medium mt-1 text-center leading-relaxed">
            सच का साथ पर व्यावहारिकता का तकाजा पहले
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-3">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border-2 ${
                  isActive
                    ? "bg-blue-600 text-white border-purple-600 shadow-lg transform scale-105"
                    : "text-purple-700 border-orange-200 hover:bg-orange-50 hover:border-sky-400 hover:text-cyan-800 hover:shadow-md"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
