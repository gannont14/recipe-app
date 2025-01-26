"use client"
import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipes/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  cardKey: string | number;
}

export default function RecipeCard({recipe, cardKey} : RecipeCardProps) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/recipes/${recipe.id}`)}
      className="w-full max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    >
      <div className="relative pt-[100%]">
        {recipe.image_url ? (
          <div className="absolute inset-0">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/60 
                           transition-all duration-300 ease-in-out flex items-center justify-center">
              <p className="w-full h-full text-white text-center p-4 opacity-0 hover:opacity-100 
                           transition-opacity duration-300">
                {recipe.description}
                <br/>
                serves: {recipe.servings}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
              <h2 className="text-lg font-semibold truncate text-black">{recipe.title}</h2>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-white flex flex-col">
            <div className="flex-grow flex flex-col items-center justify-center p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
              <p className="text-sm text-gray-600 text-center line-clamp-3">{recipe.description}</p>
              <p className="text-sm text-gray-500 mt-2">Serves: {recipe.servings}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
