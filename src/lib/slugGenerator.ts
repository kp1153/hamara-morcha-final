// lib/slugGenerator.ts
import supabase from './supabaseClient';

// Simple Hindi to Roman converter
function convertToRoman(text: string): string {
  const hindiToRoman: { [key: string]: string } = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nja',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
    'श': 'sha', 'ष': 'shha', 'स': 'sa', 'ह': 'ha',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    ' ': ' ', '-': '-'
  };

  return text.split('').map(char => hindiToRoman[char] || char).join('');
}

interface SlugGeneratorOptions {
  addTimestamp?: boolean;
  maxLength?: number;
}

// Database में slug exist करती है या नहीं check करना
async function checkSlugExists(slug: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No rows found - slug doesn't exist
      return false;
    }
    
    // If data exists, slug already exists
    return !!data;
  } catch (error) {
    console.error('Error checking slug existence:', error);
    return false;
  }
}

export function generateUniqueSlug(
  title: string, 
  options: SlugGeneratorOptions = {}
): string {
  const { addTimestamp = true, maxLength = 100 } = options;
  
  // Convert Hindi to Roman
  const romanTitle = convertToRoman(title);
  
  // Make basic slug
  let baseSlug = romanTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') // Multiple hyphens को single में convert करो
    .trim()
    .replace(/^-+|-+$/g, ''); // Start और end से hyphens हटाओ
  
  // Limit length
  if (baseSlug.length > maxLength) {
    baseSlug = baseSlug.substring(0, maxLength);
  }
  
  // Add timestamp for uniqueness
  if (addTimestamp) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseSlug}-${timestamp}-${randomSuffix}`;
  }
  
  return baseSlug;
}

// Database check के साथ unique slug generate करना
export async function generateUniqueSlugWithCheck(title: string): Promise<string> {
  const baseSlug = generateUniqueSlug(title, { addTimestamp: false });
  let finalSlug = baseSlug;
  let counter = 1;
  
  // Check if slug exists, if yes then add counter
  while (await checkSlugExists(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
}

// Simple version with guaranteed uniqueness
export async function generateSimpleSlug(title: string): Promise<string> {
  // First try with timestamp
  const timestampSlug = generateUniqueSlug(title, { addTimestamp: true });
  
  // Check if it exists (very unlikely but possible)
  const exists = await checkSlugExists(timestampSlug);
  
  if (!exists) {
    return timestampSlug;
  }
  
  // If somehow timestamp slug exists, use database check method
  return await generateUniqueSlugWithCheck(title);
}
