'use client'

import { Recipe } from "@/types/recipes/recipes";
import { redirect } from "next/navigation";


interface RecipeCardParams {
  recipe: Recipe | null
}

export default function ShowcasedRecipeCard( { recipe }: RecipeCardParams){

  if(recipe == null){
    return (<div> user doesn't have a showcased recipe </div>);
  }

  const handleClick = () => {
  redirect(`/recipes/${recipe.id}`)
  };

  return (
  <div 
      className="w-full h-full flex bg-white shadow-lg text-center cursor-hover rounded-lg"
      onClick={handleClick}
    >
      <div className="none basis-1/3 p-3">
        <img
          src={recipe.image_url}
          alt={`${recipe.title} image`}
          className="h-full aspect-square rounded-lg object-cover shadow-md"
        />
      </div>
      <div className="flex grow flex-col p-5 gap-5">
        <h1 className="text-xl">
          {recipe.title}
        </h1>
        <div className="flex justify-center gap-5">
          <h1>
            serves: {recipe.servings}
          </h1>
          <h1>
            time: {recipe.cook_time}
          </h1>
        </div>
        <p>
          {recipe.description}
        </p>
      </div>
  </div>
  )

}
