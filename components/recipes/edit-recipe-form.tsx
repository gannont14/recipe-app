'use client';

import React, { useState, useEffect } from 'react';
import IngredientsForm from './ingredients-form';
import { updateRecipe } from '@/lib/repositories/recipeRepository';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Recipe, RecipeType } from '@/types/recipes/recipes';


export interface CustomAmountChangeEvent {
  target: {
    name: string;
    value: number;
  };
}

const uploadImage = async (file: File) => {
 try {
   const supabase = createClient();
   const bucketName = 'images';
   const filePath = `public/${Date.now()}-${file.name}`;

   const { data, error } = await supabase.storage
     .from(bucketName)
     .upload(filePath, file);

   if (error) throw error;

   const { data: { publicUrl } } = supabase.storage
     .from(bucketName)
     .getPublicUrl(filePath);

   return publicUrl;
 } catch (error) {
   console.error('Error uploading image:', error);
   throw error;
 }
};

interface EditRecipeFormProps {
 recipe: Recipe;
}

const EditRecipeForm: React.FC<EditRecipeFormProps> = ({ recipe }) => {

  console.log(recipe);
 const router = useRouter();
 const [formData, setFormData] = useState<Recipe>({
   ...recipe
 });

 const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [isUploading, setIsUploading] = useState(false);

 useEffect(() => {
   const fetchRecipeTypes = async () => {
     try {
       setIsLoading(true);
       const response = await fetch('/api/recipe-types');
       
       if (!response.ok) {
         throw new Error('Failed to fetch recipe types');
       }

       const data = await response.json();
       setRecipeTypes(Array.isArray(data) ? data : []);
     } catch (error) {
       console.error('Error in fetchRecipeTypes:', error);
     } finally {
       setIsLoading(false);
     }
   };
   
   fetchRecipeTypes();
 }, []);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   const { name, value } = e.target;
   setFormData((prevData) => ({
     ...prevData,
     [name]: value,
   }));
 };

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;

   try {
     setIsUploading(true);
     const publicUrl = await uploadImage(file);
     setFormData(prev => ({
       ...prev,
       image_url: publicUrl
     }));
   } catch (error) {
     console.error('Error uploading image:', error);
     alert('Failed to upload image');
   } finally {
     setIsUploading(false);
   }
 };

 const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement> | CustomAmountChangeEvent, index: number) => {
   const { name, value } = e.target;
   setFormData((prevData) => {
     const ingredients = [...prevData.ingredients];
     ingredients[index] = {
       ...ingredients[index],
       [name]: name === 'amount' ? parseFloat(value.toString()) : value,
     };
     return {
       ...prevData,
       ingredients,
     };
   });
 };

 const addIngredient = () => {
   setFormData((prevData) => ({
     ...prevData,
     ingredients: [...prevData.ingredients, { unit: '', amount: 0, ingredient: '' }],
   }));
 };

 const removeIngredient = (index: number) => {
   setFormData((prevData) => {
     const ingredients = [...prevData.ingredients];
     ingredients.splice(index, 1);
     return {
       ...prevData,
       ingredients,
     };
   });
 };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();

   try {
     if (!formData.title || !formData.instructions) {
       throw new Error('Please fill in all required fields');
     }
     
     if (formData.ingredients.length === 0) {
       throw new Error('Please add at least one ingredient');
     }
     
     if (!formData.recipe_type) {
       throw new Error('Please select a recipe type');
     }

     const result = await updateRecipe(recipe.id.toString(), formData);
     console.log('Recipe updated successfully:', result);
     router.push(`/recipes/${recipe.id}`);
     
   } catch (error) {
     console.error('Error updating recipe:', error);
     alert(error instanceof Error ? error.message : 'Failed to update recipe');
   }
 };

 // Return same form JSX as RecipeForm but with handleSubmit updated
 return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          //required
          className="w-full"
        />
      </div>
      <IngredientsForm
        ingredients={formData.ingredients}
        onIngredientChange={handleIngredientChange}
        onAddIngredient={addIngredient}
        onRemoveIngredient={removeIngredient}
      />
      <div>
        <label htmlFor="instructions">Instructions:</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="servings">Servings:</label>
        <input
          type="number"
          id="servings"
          name="servings"
          value={formData.servings}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="cook_time">Cook Time (Hours):</label>
        <input
          type="number"
          id="cook_time"
          name="cook_time"
          value={formData.cook_time}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          //required
          disabled={isUploading}
          className="w-full"
        />
        {isUploading && <p>Uploading image...</p>}
        {formData.image_url && (
          <div className="mt-2">
            <img 
              src={formData.image_url} 
              alt="Recipe preview" 
              className="max-w-xs rounded" 
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="type_id">Type:</label>
        {isLoading ? (
          <div>Loading recipe types...</div>
        ) : (
          <select
            id="type_id"
            name="type_id"
            value={formData.recipe_type.id}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              type_id: parseInt(e.target.value)
            }))}
            required
            className="w-full"
          >
            <option value="">Select a type</option>
            {recipeTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <button 
        type="submit" 
        disabled={isUploading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isUploading ? 'Uploading...' : 'Submit Recipe'}
      </button>
    </form>
 );
};

export default EditRecipeForm;
