// lib/imageService.js

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

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "unsigned_preset"; // इस नाम का unsigned preset Cloudinary में बनाओ

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("तस्वीर अपलोड असफल:", error);
    throw error;
  }
};
