import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getRecipesByUser } from '@/lib/repositories/recipeRepository'
import UploadRecipeForm from '@/components/recipes/upload-recipe-form'

export default async function MyRecipesPage() {
  const supabase = await createClient()
  
  // Get session using the server client
  const session = await supabase.auth.getSession()
  if (!session.data.session) {
    redirect('/sign-in')
  }
  const userId = session.data.session.user.id
  return (
    <div className="container mx-auto px-4 py-8">
      <UploadRecipeForm />
    </div>
  );
}
