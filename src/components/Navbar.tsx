'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'होम' },
  { href: '/desh-videsh', label: 'देश-विदेश' },
  { href: '/jeevan-ke-rang', label: 'जीवन के रंग' },
  { href: '/coding-ki-duniya', label: 'कोडिंग की दुनिया' },
  { href: '/pratirodh', label: 'प्रतिरोध' },
  { href: '/team', label: 'टीम' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Title - Centered */}
        <div className="flex justify-between items-center py-3">
          <div className="md:hidden w-8"></div> {/* Spacer for mobile */}
          
          <Link href="/" className="flex flex-col items-center mx-auto">
            <h1 className="text-pink-100 text-3xl font-extrabold tracking-wide leading-none drop-shadow-lg">
              हमारा मोर्चा
            </h1>
            <span className="text-green-200 text-sm font-urdu mt-1">
              ہمارا مورچہ
            </span>
            <span className="text-amber-100 text-xs font-medium mt-1">
              सच का साथ पर व्यावहारिकता का तकाजा पहले
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Nav Links - Below Title */}
        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center md:justify-center gap-2 pb-3 transition-all duration-300 ease-in-out`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-purple-900 shadow-lg scale-105'
                    : 'hover:bg-white/20 hover:scale-105'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}