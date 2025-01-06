import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function GET() {
  // Test the database connection
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .limit(4)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ 
    message: 'Connected to Supabase!',
    recipes: data 
  })
}

export async function POST(request: Request) {
  try {
    // Get the data from the request body
    const body = await request.json()

    // Validate that required fields are present
    if (!body.title || !body.ingredients) {
      return Response.json(
        { error: 'Title and ingredients are required' },
        { status: 400 }
      )
    }

    // Insert the recipe into Supabase
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        title: body.title,
        description: body.description,
        ingredients: body.ingredients,
        instructions: body.instructions,
        image_url: body.image_url
      })
      .select()

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return Response.json({ 
      message: 'Recipe created successfully',
      recipe: data[0]
    })

  } catch (error) {
    return Response.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}
