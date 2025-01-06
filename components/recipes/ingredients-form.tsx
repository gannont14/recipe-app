import React from "react";


interface Ingredient{
  unit: string,
  amount: number,
  ingredient: string,
}


interface IngredientsFormProps {
  ingredients : Ingredient[];
  onIngredientChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
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
        <div key={index}>
          <input
            type="text"
            name="unit"
            value={ingredient.unit}
            onChange={(e) => onIngredientChange(e, index)}
            placeholder="Unit"
          />
          <input
            type="number"
            name="amount"
            value={ingredient.amount}
            onChange={(e) => onIngredientChange(e, index)}
            placeholder="Amount"
          />
          <input
            type="text"
            name="ingredient"
            value={ingredient.ingredient}
            onChange={(e) => onIngredientChange(e, index)}
            placeholder="Ingredient"
          />
          <button className="border rounded-sm border-black p-1 m-1" type="button" onClick={() => onRemoveIngredient(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="border rounded-sm border-black p-1 m-1" type="button" onClick={onAddIngredient}>
        Add Ingredient
      </button>
    </div>
  );
};

export default IngredientsForm;
