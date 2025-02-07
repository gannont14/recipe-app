import { getRecipeById } from "@/lib/repositories/recipeRepository";
import { UserProfile } from "@/types/profiles/profiles";
import ShowcasedRecipeCard from "./showcased-recipe-card";
import { Recipe } from "@/types/recipes/recipes";
import ScrollingRecipesList from "./scrolling-recipes-list";


interface ProfileCardProps {
  userProfile: UserProfile;
  isEditable: boolean;
}

export default async function ProfileCard({ userProfile, isEditable } : ProfileCardProps){
  const showcasedRecipe: Recipe | null = await getRecipeById(userProfile.showcased_recipe_id.toString());

  return (
    <div 
      className="w-full h-[85vh] mx-auto p-auto bg-white shadow-lg rounded-lg flex flex-col"
    > 
      
      {/*
          top div with user image and name and showcased recipe
      */}
      <div className="p-5 h-[50%] w-full flex flex-row gap-3">
      {/* User profile image */}
        <img 
          className="h-full aspect-square rounded-full object-cover" 
          src={userProfile.profile_image_URL}
        />
      {/* User's name and showcased recipe */}
        <div className="grow flex flex-col justify-center text-center">
          <h1 className="text-5xl">
            {userProfile.first_name} {userProfile.last_name}
          </h1>
          <div className="grow p-6">
            <h1 className="text-left text-2xl"> Showcased Recipe: </h1>
            <ShowcasedRecipeCard 
              recipe={showcasedRecipe} 
            />
          </div>

        </div>

      </div>
      <div className="w-full h-[50%]">
        <ScrollingRecipesList userId={userProfile.id} />

      </div>

    </div>

  )

}
