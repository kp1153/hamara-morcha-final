// lib/newsService.js

import { db } from "@/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export async function getAllNews() {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const newsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id, // ✅ Fallback to ID if slug missing
      created_at: doc.data().created_at?.seconds
        ? new Date(doc.data().created_at.seconds * 1000).toISOString()
        : new Date().toISOString(),
    }));

    return newsData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getNewsByCategory(categoryName) {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const allNews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id, // ✅ Fallback to ID if slug missing
      created_at: doc.data().created_at?.seconds
        ? new Date(doc.data().created_at.seconds * 1000).toISOString()
        : new Date().toISOString(),
    }));

    const filteredNews = allNews.filter(
      (news) => news.category === categoryName
    );
    return filteredNews.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } catch (error) {
    console.error("Error fetching news by category:", error);
    return [];
  }
}

export async function fetchNewsBySlugAndCategory(slug, category) {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const allNews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id, // ✅ Fallback to ID if slug missing
      created_at: doc.data().created_at?.seconds
        ? new Date(doc.data().created_at.seconds * 1000).toISOString()
        : new Date().toISOString(),
    }));

    const news = allNews.find(
      (news) =>
        news.category === category && (news.slug === slug || news.id === slug) // ✅ Check both slug and ID
    );

    return news || null;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return null;
  }
}
