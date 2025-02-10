'use client';
import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/lib/repositories/profileRepository';
import { createClient } from '@/utils/supabase/client';
import { getRecipesByUser } from '@/lib/repositories/recipeRepository';
import ShowcasedRecipeSelector from './showcased-recipe-selector';
import { Recipe } from '@/types/recipes/recipes';

const uploadImage = async (file: File) => {
  try {
    const supabase = createClient();
    const bucketName = 'images';
    const uniqueSuffix = Date.now().toString() + '-' + Math.round(Math.random() * 1E9);
    const filePath = `public/${uniqueSuffix}-${file.name}`;
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default function UserProfileForm({ userId }: { userId: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showcasedRecipeId, setShowcasedRecipeId] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  //const [recipesLoading, setRecipesLoading] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(userId);
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setProfileImageUrl(profile.profile_image_URL);
        setShowcasedRecipeId(profile.showcased_recipe_id);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchUserRecipes = async () => {
      const recipes: Recipe[] = await getRecipesByUser(userId);
      setRecipes(recipes);
    }

    fetchUserProfile();
    fetchUserRecipes();
  }, [userId]);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const publicUrl = await uploadImage(file);
      setProfileImageUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updatedProfileData = {
        //id: userId,
        first_name: firstName,
        last_name: lastName,
        profile_image_URL: profileImageUrl,
        showcased_recipe_id: showcasedRecipeId,
      };
      const data = await updateUserProfile(userId, updatedProfileData);
      console.log('User profile updated:', data);
      alert('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('An error occurred while updating the user profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='py-5'> 
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className='my-5'>
        <label htmlFor="profileImage">Profile Image:</label>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleProfileImageUpload}
          disabled={isUploading}
        />
        {isUploading && <p>Uploading image...</p>}
        {profileImageUrl && (
          <div className="mt-2">
            <img 
              src={profileImageUrl}
              alt="Profile preview"
              className="max-w-xs rounded"
            />
          </div>
        )}
      </div>
      {/*
      <div>
        <label htmlFor="showcasedRecipeId">Showcased Recipe ID:</label>
        <input
          type="number"
          id="showcasedRecipeId"
          value={showcasedRecipeId}
          onChange={(e) => setShowcasedRecipeId(Number(e.target.value))}
        />
      </div>
      */}

      <ShowcasedRecipeSelector  userRecipes={recipes} showcasedRecipeId={showcasedRecipeId} setShowcasedRecipeId={setShowcasedRecipeId}  />
      <button 
        type="submit"
        disabled={isUploading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Update User Profile
      </button>
    </form>
  );
}
