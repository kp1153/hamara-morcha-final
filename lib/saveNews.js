import { db } from "@/firebase/config"; // ✅ आपके प्रोजेक्ट के अनुसार path ठीक करें
import { addDoc, collection } from "firebase/firestore";

// ✅ यह फ़ंक्शन डेटाबेस में लेख को सेव करेगा
export async function saveNewsArticle(newsData) {
  try {
    // 1. लेख के कंटेंट को छोटे-छोटे टुकड़ों में तोड़ें
    const content = newsData.content;
    const chunkSize = 900000; // 900KB, 1MB की सीमा से थोड़ा कम
    const contentParts = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      contentParts.push(content.substring(i, i + chunkSize));
    }

    // 2. original data में content की जगह content_parts को जोड़ें
    const articleToSave = {
      ...newsData,
      content: null, // पुराने content को null करें
      content_parts: contentParts,
      created_at: new Date().toISOString(),
      views: 0,
      // slug को सर्वर-साइड पर या कहीं और संभालें
    };

    // 3. डेटा को Firebase में सेव करें
    const docRef = await addDoc(collection(db, "news"), articleToSave);

    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("लेख अपलोड करने में त्रुटि:", error);
    return { success: false, error: error.message };
  }
}