import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file) => {
  try {
    // वैलिडेशन
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("केवल तस्वीर फाइलें चुनें");
    }

    // फाइल साइज चेक (5MB से कम)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("तस्वीर 5MB से बड़ी नहीं होनी चाहिए");
    }

    // अपलोड
    const timestamp = Date.now();
    // इसके बदले ये 2 लाइन्स डालें
    const fileExtension = file.name.split(".").pop().toLowerCase(); // .jpg/.png निकाले
    const filename = `upload_${Date.now()}.${fileExtension}`; // सिंपल यूनिक नाम
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("तस्वीर अपलोड असफल:", error);
    throw error;
  }
};
