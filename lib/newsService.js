// lib/newsService.js
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

function normalizeText(text) {
  return text ? text.trim().toLowerCase().normalize("NFC") : "";
}

export async function getAllNews() {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const newsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id,
      created_at:
        doc.data().createdAt ||
        doc.data().created_at ||
        new Date().toISOString(),
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
      slug: doc.data().slug || doc.id,
      created_at:
        doc.data().createdAt ||
        doc.data().created_at ||
        new Date().toISOString(),
    }));

    const targetCategory = normalizeText(categoryName);

    const filteredNews = allNews.filter(
      (news) => normalizeText(news.category) === targetCategory
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
      slug: doc.data().slug || doc.id,
      created_at:
        doc.data().createdAt ||
        doc.data().created_at ||
        new Date().toISOString(),
    }));

    const targetSlug = normalizeText(slug);
    const targetCategory = normalizeText(category);

    const news = allNews.find(
      (news) =>
        normalizeText(news.category) === targetCategory &&
        (normalizeText(news.slug) === targetSlug ||
          normalizeText(news.id) === targetSlug)
    );

    return news || null;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return null;
  }
}
