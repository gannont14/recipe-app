import { Recipe } from "@/types/recipes/recipes";


interface Params {
  userRecipes: Recipe[];
  showcasedRecipeId: number;
  setShowcasedRecipeId: (id:number) => (void)
}

export default function ShowcasedRecipeSelector ({ userRecipes, showcasedRecipeId, setShowcasedRecipeId } : Params) {

  return (
    <div>
      <label 
        htmlFor="showcasedRecipeId" 
        className="block text-sm font-medium mb-2"
      >
        Showcased Recipe:
      </label>
      <select
        id="showcasedRecipeId"
        value={showcasedRecipeId}
        onChange={(e) => setShowcasedRecipeId(Number(e.target.value))}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="">Select a recipe</option>
        {userRecipes.map((recipe: Recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.title}
          </option>
        ))}
      </select>
    </div>
  );
};
