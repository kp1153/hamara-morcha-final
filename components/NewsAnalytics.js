"use client";
import { useEffect } from "react";
import { event } from "@/lib/gtag";

const NewsAnalytics = ({ newsData }) => {
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

  return null;
};

export default NewsAnalytics;
