'use client'

import { createClient } from '@/utils/supabase/client';

const uploadImage = async (file: File) => {
  try {
    const supabase = createClient();
    const bucketName = 'recipe_images';
    const filePath = `${Date.now()}-${file.name}`; // Add timestamp to prevent naming conflicts

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
