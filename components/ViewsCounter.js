// components/ViewsCounter.js
"use client";
import { useState, useEffect } from "react";

export default function ViewsCounter({ slug }) {
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/views?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setViews(data.views || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return <span>👁️ {loading ? "..." : views} views</span>;
}
