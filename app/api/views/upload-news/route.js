// app/api/upload-news/route.js

import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { addDoc, collection } from "firebase/firestore";

export async function POST(request) {
  try {
    const data = await request.json();

    const content = data.content;
    const chunkSize = 900000;
    const contentParts = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      contentParts.push(content.substring(i, i + chunkSize));
    }

    const newsData = {
      ...data,
      content: null,
      content_parts: contentParts,
      created_at: new Date().toISOString(),
      views: 0,
      slug: data.slug || Date.now().toString(),
      // ✅ यहाँ बदलाव है: मुख्य तस्वीर और कैप्शन के लिए नई फ़ील्ड
      featured_image_url: data.featured_image_url || null,
      featured_caption: data.featured_caption || "",
      // ✅ गैलरी वाली तस्वीरें
      images: data.images || [],
      // ✅ image_url फ़ील्ड को हटा दें
    };

    const docRef = await addDoc(collection(db, "news"), newsData);

    return NextResponse.json(
      { success: true, message: "लेख सफलतापूर्वक अपलोड हुआ", docId: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("लेख अपलोड करने में त्रुटि:", error);
    return NextResponse.json(
      { success: false, message: "लेख अपलोड करने में असफल रहे" },
      { status: 500 }
    );
  }
}
