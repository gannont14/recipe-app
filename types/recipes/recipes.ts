export interface Ingredient{
    unit: string;
    amount: number;
    ingredient: string;
}

export interface RecipeType{
    id: number;
    name: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
  cook_time: number;
  image_url: string;
  recipe_types: RecipeType[];
}
