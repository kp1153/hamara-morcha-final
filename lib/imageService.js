import { storage } from "@/firebase/config"; // ← यह import missing है
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file) => {
  try {
    const timestamp = Date.now();
    const filename = `news-images/${timestamp}-${file.name}`;

    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("इमेज अपलोड में त्रुटि");
  }
};
