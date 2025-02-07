'use client'
import { Recipe } from "@/types/recipes/recipes"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import UserAvatarButton from "../profile/user-avatar-button";


export default function RecipePage (
  {recipe}: { recipe: Recipe}
) {

  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const supabase = createClient();
      const { data: {session} } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();
  })


  return (
    <div className="w-[85vw]  card bg-white rounded-lg flex-column items-center p-5 m-auto">
      <div className="flex justify-between">
        {session?.user.id === recipe.user_id && (
          <button 
            onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
            className="px-4 py-2 bg-white text-black rounded hover:border hover: border-black"
          >
            Edit
          </button>
        )}
        <div className="mr-5 mt-5">
          <UserAvatarButton userId={recipe.user_id} />
        </div>
      </div>
      <div className="flex-column">
        {/* Text section */}
        <div className="flex-column text-center justify-center mx-auto text-xl">
          <h1 className="text-xl">{recipe.title}</h1>

            
          {/* div with servings and prep time, could add amount slider here */}
          <div className="flex justify-center gap-5"> 
            <div>
              <h1> <b>Cook Time</b>: </h1>
              <h1> {recipe.cook_time} </h1>
            </div>
            <div>
              <h1> <b>Servings</b>: </h1>
              <h1> {recipe.servings} </h1>
            </div>
          </div>
          <h1 className="text-m">{recipe.description}</h1>
        </div>

        {/*
        <div className="w-96 h-96 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 m-5 flex">
          <img 
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
        */}
          <div>
          <h1 className="text-3xl m-2 font-bold"> Ingredients:  </h1>
                  {recipe.ingredients.map((ingredient, index) => (
              <div className="flex text-2xl" key={index}>
                <input type="checkbox" className="mr-5"></input>
                <h1> {ingredient.amount} {ingredient.unit} {ingredient.ingredient} </h1>
              </div>
                  ))}
          </div>
      </div>
          <h1 className="text-3xl m-2 font-bold"> Instructions:  </h1>
        <div className="space-y-2 text-xl">
          {recipe.instructions
            .replace(/\\n\\n/g, '\n\n')  // Replace literal \n\n with actual newlines
            .split('\n')
            .map((instruction, index) => (
              <p key={index} className="text-gray-700">
                {instruction}
              </p>
            ))}
        </div>
    </div>
  )

}
