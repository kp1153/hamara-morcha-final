"use client";

import { useRouter, useSearchParams } from "next/navigation"; // ✅ Next.js 15 navigation
import { useCallback } from "react";

export default function CategoryMenu({
  categories,
  selectedCategory,
  onSelect,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Next.js 15 way to handle category change
  const handleCategoryChange = useCallback(
    (categoryValue) => {
      if (onSelect) {
        // If parent component handles the selection
        onSelect(categoryValue);
      } else {
        // Handle navigation using Next.js router
        const params = new URLSearchParams(searchParams.toString());

        if (categoryValue === "न्यूज") {
          // Remove category param for default category
          params.delete("category");
        } else {
          params.set("category", categoryValue);
        }

        // ✅ Use Next.js router instead of window.location
        const newUrl = params.toString() ? `?${params.toString()}` : "";
        router.push(newUrl, { scroll: false });
      }
    },
    [onSelect, router, searchParams]
  );

  return (
    <nav
      className="bg-white shadow-sm border-b mb-6"
      aria-label="News Categories"
    >
      <ul className="flex flex-wrap justify-center gap-4 py-4" role="list">
        {categories.map((cat) => (
          <li key={cat.value}>
            <button
              className={`px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${
                  selectedCategory === cat.value
                    ? "bg-blue-700 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800 hover:shadow-sm"
                }
              `}
              onClick={() => handleCategoryChange(cat.value)}
              aria-pressed={selectedCategory === cat.value}
              type="button"
            >
              {cat.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
