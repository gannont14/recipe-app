'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipes/recipes';
import { getPaginatedRecipesByUser } from '@/lib/repositories/recipeRepository';
import InfiniteScrollList from '../infinite-scroll-list';

interface RecipeListParams {
  userId: string;
}

export default function ScrollingRecipesList({ userId }: RecipeListParams) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [initRecipes, setInitRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const recipes: Recipe[] = await getPaginatedRecipesByUser(userId, 0);
        setInitRecipes(recipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial recipes:', error);
        setLoading(false);
      }
    };
    fetchInitial();
  }, [userId]);

  const loadMoreRecipes = useCallback(async () => {
    const nextPage = page + 1;
    try {
      const newRecipes = await getPaginatedRecipesByUser(userId, nextPage);
      if (newRecipes.length > 0) {
        setPage(nextPage);
      }
      return newRecipes;
    } catch (error) {
      console.error('Error loading more recipes:', error);
      return [];
    }
  }, [page, userId]);

  const handleItemClick = (recipe: Recipe) => {
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <InfiniteScrollList
      initialItems={initRecipes}
      fetchMore={loadMoreRecipes}
      onItemClick={handleItemClick}
      loading={loading}
    />
  );
}
