'use client';

interface Category {
  label: string;
  value: string;
}

export default function CategoryMenu({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: Category[];
  selectedCategory: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <nav className="bg-white shadow-sm border-b mb-6">
      <ul className="flex flex-wrap justify-center gap-4 py-4">
        {categories.map((cat) => (
          <li key={cat.value}>
            <button
              className={`px-5 py-2 rounded-full text-base font-semibold transition
                ${selectedCategory === cat.value
                  ? 'bg-blue-700 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}
              `}
              onClick={() => {
                if (onSelect) {
                  onSelect(cat.value);
                } else {
                  window.location.search =
                    cat.value === "न्यूज"
                      ? ""
                      : `?category=${encodeURIComponent(cat.value)}`;
                }
              }}
            >
              {cat.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
