'use client';

import React from "react";
import FractionInput from "@/components/recipes/fraction-input"
import { CustomAmountChangeEvent } from "./upload-recipe-form";

interface Ingredient {
  unit: string;
  amount: number;
  ingredient: string;
}

interface IngredientsFormProps {
  ingredients: Ingredient[];
  onIngredientChange: (e: React.ChangeEvent<HTMLInputElement> | CustomAmountChangeEvent, index: number) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
}

const IngredientsForm: React.FC<IngredientsFormProps> = ({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}) => {
  return (
    <div>
      <h3>Ingredients:</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <FractionInput 
            value={ingredient.amount}
            name="amount"
            onChange={(e) => onIngredientChange(e, index)}
            placeholder="Amount"
          />
          <input
            type="text"
            name="unit"
            value={ingredient.unit}
            onChange={(e) => onIngredientChange(e, index)}
            placeholder="Unit"
          />
          <input
            type="text"
            name="ingredient"
            value={ingredient.ingredient}
            onChange={(e) => onIngredientChange(e, index)}
            placeholder="Ingredient"
          />
          <button 
            type="button" 
            onClick={() => onRemoveIngredient(index)}
            className="border rounded-sm border-black p-1"
          >
            Remove
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={onAddIngredient}
        className="border rounded-sm border-black p-1"
      >
        Add Ingredient
      </button>
    </div>
  );
};

export default IngredientsForm;
