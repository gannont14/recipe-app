import { createClient } from '@/utils/supabase/client';
import { Recipe } from '@/types/recipes/recipes';

export const postNewRecipe = async (recipeData: {
  title: string;
  description: string;
  ingredients: Array<{ unit: string; amount: number; ingredient: string }>;
  instructions: string;
  servings: number;
  cook_time: number;
  image_url: string;
  type_id: number;
}) => {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('You must be logged in to create a recipe');
  }

  const dataWithUser = {
    ...recipeData,
    user_id: session.user.id
  };

  const { data, error } = await supabase
    .from('recipes')
    .insert([dataWithUser])
    .select()
    .single();

  if (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
  return data;
};

export async function getAllRecipes() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_types(id, name)
      `);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function getRecipesByType(type: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_types(id, name)
      `)
      .eq('recipe_types.id', type);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recipes by type:', error);
    return [];
  }
}

export async function getRecipesByUser(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_types(id, name)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recipes by user:', error);
    return [];
  }
}

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_types(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Recipe not found');
    
    return data as Recipe;
  } catch {
    return null;
  }
};
