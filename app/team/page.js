import React from "react";

const teamMembers = [
  {
    id: 1,
    name: "माननीय चीकू सिंह बुंदेला उर्फ दीवान जी",
    role: "संरक्षक",
    photo: "/images/1.jpg",
  },
  {
    id: 2,
    name: "दिगंत शुक्ल",
    role: "प्रधान संपादक",
    photo: "/images/2.jpg",
  },
  {
    id: 3,
    name: "अद्वय शुक्ल",
    role: "संपादक",
    photo: "/images/3.jpg",
  },
  {
    id: 4,
    name: "कामता प्रसाद",
    role: "कार्यकारी संपादक",
    photo: "/images/4.jpg",
  },
  {
    id: 5,
    name: "अन्य सदस्य",
    role: "",
    photo: "/images/5.jpg",
  },
];

export default function Team() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">टीम</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {teamMembers.map(({ id, name, role, photo }) => (
          <div
            key={id}
            className="bg-gray-800 rounded-lg p-4 text-center text-white shadow-lg"
          >
            <img
              src={photo}
              alt={name}
              className="w-40 h-40 mx-auto mb-4 object-cover rounded"
            />
            <h2 className="text-xl font-semibold">{name}</h2>
            {role && <p className="text-blue-400 mt-1">{role}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
