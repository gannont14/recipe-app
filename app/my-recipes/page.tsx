import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getRecipesByUser } from '@/lib/repositories/recipeRepository'
import RecipeCard from '@/components/recipes/recipe-card'
import { Recipe } from '@/types/recipes/recipes'

export default async function MyRecipesPage() {
  const supabase = await createClient()
  
  const session = await supabase.auth.getSession()
  if (!session.data.session) {
    redirect('/sign-in')
  }
  const userId = session.data.session.user.id
  const recipes = await getRecipesByUser(userId)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe: Recipe) => (
          <RecipeCard
            recipe={recipe}
            cardKey={recipe.id}
          />
        ))}
      </div>
    </div>
  );
}
