import { Recipe } from "@/types/recipes/recipes"

export default function RecipePage (
  {recipe}: { recipe: Recipe}
) {
  return (
    <div className="w-[85vw]  border border-red-500 flex-column items-center p-5 m-auto">
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
                  {recipe.ingredients.map((ingredient) => (
              <div className="flex text-2xl">
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
            .split('\n\n')
            .map((instruction, index) => (
              <p key={index} className="text-gray-700">
                {instruction}
              </p>
            ))}
        </div>
    </div>
  )

}
