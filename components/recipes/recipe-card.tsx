"use client"

import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipes/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  cardKey: string | number;
}


// TODO: update to use the recipe type instead of just hardcoding the values

export default function RecipeCard({recipe, cardKey} : RecipeCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/recipes/${recipe.id}`)}
      className="w-full max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pt-[100%]">
        {/* Base image */}
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        
        {/* Hover overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/0 hover:bg-black/60 
                         transition-all duration-300 ease-in-out flex items-center justify-center">
            <p className="w-full h-full text-white text-center p-4 opacity-0 hover:opacity-100 
                         transition-opacity duration-300">
              {recipe.description}
            <br/>
              serves: {recipe.servings}
            </p>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate text-black">{recipe.title}</h2>
      </div>
    </div>
  );
}
