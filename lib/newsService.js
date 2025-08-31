import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function fetchNewsBySlugAndCategory(slug, category) {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const allNews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id,
    }));

    const news = allNews.find(
      (newsItem) => newsItem.slug === slug && newsItem.category === category
    );

    // अगर लेख नहीं मिलता है तो एक खाली ऑब्जेक्ट ({}) लौटाएँ
    return news || {};
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    // एरर होने पर भी एक खाली ऑब्जेक्ट ({}) लौटाएँ
    return {};
  }
}

export async function getAllNews() {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const allNews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id,
    }));

    return allNews;
  } catch (error) {
    console.error("Error fetching all news:", error);
    return [];
  }
}

export async function getNewsByCategory(category) {
  try {
    const newsCollection = collection(db, "news");
    const querySnapshot = await getDocs(newsCollection);

    const allNews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      slug: doc.data().slug || doc.id,
    }));

    const categoryNews = allNews.filter(
      (newsItem) => newsItem.category === category
    );

    return categoryNews;
  } catch (error) {
    console.error("Error fetching news by category:", error);
    return [];
  }
}
