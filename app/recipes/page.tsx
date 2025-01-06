import { getAllRecipes } from '@/lib/repositories/recipeRepository'

export default async function RecipesPage() {
  const recipes = await getAllRecipes()

  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Recipes</h1>
      <pre>{JSON.stringify(recipes, null, 2)}</pre>
    </div>
  )
}
