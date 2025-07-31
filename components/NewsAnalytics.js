"use client";
import { useEffect } from "react";
import { event } from "@/lib/gtag";

export default function NewsAnalytics({ newsData }) {
  useEffect(() => {
    if (newsData) {
      // Individual news view track करने के लिए
      event({
        action: "view_news",
        category: "News",
        label: `${newsData.category} - ${newsData.title}`,
        value: 1,
      });

      // Category wise tracking भी
      event({
        action: "view_category",
        category: "Category",
        label: newsData.category,
        value: 1,
      });
    }
  }, [newsData]);

  return null; // यह component कुछ render नहीं करता, सिर्फ tracking के लिए है
}
