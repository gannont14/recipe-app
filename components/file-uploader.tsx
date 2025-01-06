'use client'

import { createClient } from '@/utils/supabase/client';

export default function FileUploader() {
  const supabase = createClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        console.error('No file selected');
        return;
      }

      console.log('Attempting to upload file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });


      // List the buckets to see if this even works
      //const bucketsRequest = await supabase
      //  .storage
      //  .listBuckets()
      //console.log("bucketsRequestData:", bucketsRequest.data)
      //console.log("bucketsRequestError:", bucketsRequest.error)

      // Make sure the bucket exists and is properly named
      const bucketName = 'images'; // Confirm this matches your Supabase bucket name
      
      // Create a unique file path
      const filePath = `public/${file.name}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        alert(`Error uploading file: ${error.message}`);
        return;
      }

      console.log('Upload successful:', data);
      alert('File uploaded successfully!');
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileUpload}
        accept="image/*" 
      />
    </div>
  );
}
