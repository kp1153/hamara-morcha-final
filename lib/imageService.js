import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file) => {
  try {
    // (1) फाइल मिल रही है या नहीं
    console.log("📂 File to upload:", file);

    const timestamp = Date.now();
    const filename = `news-images/${timestamp}-${file.name}`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytes(storageRef, file);

    // (2) डाउनलोड URL मिला या नहीं
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("✅ Uploaded image URL:", downloadURL);

    return downloadURL;
  } catch (error) {
    // (3) अगर कुछ गड़बड़ हो गई
    console.error("❌ Image upload failed:", error);
    return null;
  }
};
