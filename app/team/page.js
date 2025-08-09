"use client";
import React from "react";
import Image from "next/image";

const teamMembers = [
  {
    id: 1,
    name: "माननीय चीकू सिंह बुंदेला उर्फ दीवान जी, जिन्हें गोद में उठाए हुए हैं हमारे प्रधान संपादक दिगंत शुक्ल और उनके साथ में विक्ट्री का चिह्न बनाकर खड़े हुए हैं संपादक अद्वय शुक्ल",
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
    address: "तिवारी भवन, ग्रामः गहरपुर, पोस्टः पुआरीकलां -221202, वाराणसी।",
    phone: "9996865069",
    email: "hamaramorcha1153@gmail.com",
  },
  {
    id: 5,
    name: "सुमन तिवारी",
    role: "प्रबंध निदेशक",
    photo: "/images/5.jpg",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 tracking-wide">
            हमारी टीम
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
          <p className="text-gray-300 text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
            "हमारा मोर्चा" की प्रेरणा-शक्ति है उसकी टीम के युवा साथी।
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map(
            ({ id, name, role, photo, address, phone, email }, index) => (
              <div
                key={id}
                className={`group relative ${
                  id === 1 ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-orange-500/25 min-h-[500px]">
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-400/30 to-transparent rounded-bl-3xl"></div>

                  {/* Image Container */}
                  <div className="relative p-4 pb-2">
                    <div className="relative mx-auto w-56 h-64 rounded-lg overflow-hidden shadow-xl transition-all duration-500">
                      <img
                        src={photo}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-8 left-8 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-8 right-8 w-2 h-2 bg-amber-300 rounded-full animate-ping"></div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-6 text-center">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        {role}
                      </span>
                    </div>

                    <h2 className="text-white font-semibold text-sm leading-tight mb-3 min-h-[40px] flex items-center justify-center">
                      {name}
                    </h2>

                    {/* Contact Info for Kamta Prasad */}
                    {id === 4 && (
                      <div className="text-gray-300 text-xs space-y-1 mb-3">
                        <p className="flex items-center justify-center text-center">
                          <span className="text-orange-400 mr-1">📍</span>
                          <span className="leading-tight">{address}</span>
                        </p>
                        <p className="flex items-center justify-center">
                          <span className="text-orange-400 mr-1">📞</span>
                          {phone}
                        </p>
                        <p className="flex items-center justify-center">
                          <span className="text-orange-400 mr-1">✉️</span>
                          {email}
                        </p>
                      </div>
                    )}

                    {/* Decorative Line */}
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>

                {/* Floating Animation */}
                <div className="absolute -z-10 inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110"></div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="relative py-12 text-center">
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            पूरी टीम समाचारों की दुनिया में इसलिए जूझ रही है ताकि कोडिंग के जरिए
            दुनिया को बेहतर बना सके। अब आप कहेंगे कि कंप्यूटर लैंग्वेजेज और
            समाचारों की दुनिया में क्या संबंध है भला, तो बताता चलूँ कि गहरा
            संबंध है। हमारी आजीविक का जरिया पत्रकारिता नहीं, वरन कोडिंग है।
          </p>
        </div>
      </div>
    </div>
  );
}
