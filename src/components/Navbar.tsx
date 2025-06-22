"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "होम", href: "/" },
  { label: "देश-विदेश", href: "/desh-videsh" },
  { label: "विविध", href: "/vividha" },
  { label: "आलेख", href: "/aalekh" },
  { label: "प्रतिरोध", href: "/pratirodh" },
  { label: "लाइफ-स्टाइल", href: "/lifestyle" },
  { label: "टेक-वर्ल्ड", href: "/tech-world" },
  { label: "टीम", href: "/team" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        {/* Logo / Title */}
        <Link href="/" className="block">
          <div className="leading-tight">
            <div className="text-4xl font-extrabold text-amber-600">
              हमारा मोर्चा
            </div>
            <div className="text-2xl font-extrabold text-green-600 font-urdu mt-1">
              ہمارا مورچہ
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded hover:bg-red-500 transition ${
                pathname === item.href ? "bg-sky-700" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
