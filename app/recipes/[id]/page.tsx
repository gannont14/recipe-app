import { getRecipeById } from '@/lib/repositories/recipeRepository';
import RecipePage from '@/components/recipes/recipe-page';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function DynamicRecipePage({ params }: PageProps) {
  // Fetch recipe data
  const { id } = await params;
  const recipe = await getRecipeById(id);

  console.log(recipe);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }


  const recipeData = {
    id: recipe.id,
    user_id: recipe.user_id,
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    servings: recipe.servings,
    cook_time: recipe.cook_time,
    image_url: recipe.image_url,
    recipe_type: recipe.recipe_type,
  };



  return (
    <RecipePage recipe={recipeData} />
  )

};

