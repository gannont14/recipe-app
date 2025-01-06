import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

const supabaseClient = createSupabaseClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: Request) {
 try {
   const { searchParams } = new URL(request.url)
   const type = searchParams.get('type')
   const userId = searchParams.get('userId')
   const limit = searchParams.get('limit') || '10'
   const page = searchParams.get('page') || '1'

   let query = supabaseClient
     .from('recipes')
     .select(`
       *,
       recipe_types (
         name
       )
     `, { count: 'exact' })

   if (type) {
     query = query.eq('recipe_types.name', type)
   }
   if (userId) {
     query = query.eq('user_id', userId)
   }

   const offset = (parseInt(page) - 1) * parseInt(limit)
   query = query
     .range(offset, offset + parseInt(limit) - 1)
     .order('created_at', { ascending: false })

   const { data, error, count } = await query
   if (error) {
     return Response.json({ error: error.message }, { status: 500 })
   }

   return Response.json({
     recipes: data,
     page: parseInt(page),
     limit: parseInt(limit),
     total: count
   })
 } catch (error) {
   return Response.json({ error: 'Error processing request' }, { status: 500 })
 }
}

export async function POST(request: Request) {
  try {
    // Regular client for auth
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create an admin client for storage operations
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for admin operations
    );

    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use the admin client for storage operations
    const { data: imageData, error: imageError } = await supabaseAdmin.storage
      .from('recipe-images')
      .upload(`${Date.now()}_${image.name}`, buffer, {
        contentType: image.type,
        upsert: true
      });

    if (imageError) {
      console.error('Upload error:', imageError);
      return Response.json({ error: imageError.message }, { status: 500 });
    }

    // Use regular client for database operations
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        title:        formData.get('title'),
        description:  formData.get('description'),
        ingredients:  JSON.parse(formData.get('ingredients') as string),
        instructions: formData.get('instructions'),
        servings:     parseFloat(formData.get('servings') as string),
        cook_time:    parseFloat(formData.get('cook_time') as string) ,
        image_url:    imageData.path,                      
        user_id:      user.id,
        type_id:      parseInt(formData.get('type_id') as string)
      })
      .select()
      .single();


   if (recipeError) {
     console.error('Recipe insert error:', recipeError);
     return Response.json({ error: recipeError.message }, { status: 500 });
   }

   return Response.json({
     message: 'Recipe created successfully',
     recipe: recipeData,
   });

 } catch (error) {
   console.error('Server error:', error);
   return Response.json({ error: 'Server error' }, { status: 500 });
 }
}
