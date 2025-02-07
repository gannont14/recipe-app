import { getAllRecipes } from '@/lib/repositories/recipeRepository'
import RecipeCard from '@/components/recipes/recipe-card'
import { Recipe } from '@/types/recipes/recipes'

export default async function Home() {
  const recipes: Recipe[] = await getAllRecipes()

  if(!recipes){
    return (<div> No recipes available </div>);
  }


  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe: Recipe) => (
          <RecipeCard
            recipe={recipe}
            cardKey={recipe.id}
          />
        ))}
      </div>
    </div>
  )
}
