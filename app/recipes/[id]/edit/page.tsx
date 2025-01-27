import { getRecipeById } from '@/lib/repositories/recipeRepository';
import EditRecipeForm from '@/components/recipes/edit-recipe-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  if (!session || session.user.id !== recipe.user_id) {
    redirect('/recipes');
  }

  return <EditRecipeForm recipe={recipe} />;
}
