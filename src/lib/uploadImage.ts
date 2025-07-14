import supabase from './supabaseClient';
export async function uploadImageAndGetURL(file: File): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `news-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("news-images") // 👈 अपने bucket का नाम
    .upload(filePath, file);

  if (uploadError) {
    console.error("Image upload failed:", uploadError.message);
    return null;
  }

  const { data } = supabase.storage
    .from("news-images")
    .getPublicUrl(filePath);

  return data?.publicUrl || null;
}
