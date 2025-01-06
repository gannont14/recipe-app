'use client'

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

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

export default function RecipeImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(''); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const url = await uploadImage(selectedFile);
      setImageUrl(url);
      setSelectedFile(null); // Reset file selection
      // You might want to do something with the URL here, like saving it or passing it to a parent component
      console.log('Upload successful. Image URL:', url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input 
          type="file" 
          onChange={handleFileSelect}
          accept="image/*"
          className="mb-2"
          disabled={isUploading}
        />
      </div>

      {selectedFile && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Selected file: {selectedFile.name}</p>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm mb-2">Uploaded image:</p>
          <img 
            src={imageUrl} 
            alt="Uploaded recipe" 
            className="max-w-xs rounded shadow"
          />
          <p className="text-sm mt-2 break-all">URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
}
