import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types/profiles/profiles";


export async function getUserProfile(userId: string){
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('id', userId)
      .single();


    // if it throws an error, there was an error fetching, or the user doesn't exist
    if(error) null;
    console.log("Returning user", data);
    return data;
}

export const postUserProfile = async (userProfileData: {
  first_name: string;
  last_name: string;
  profile_image_URL: string;
  showcased_recipe_id: number;
}) => {
  // unused, background_image_URL, recipe_ids
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('You must be logged in to create your user profile');
  }

  const newData = {
    ...userProfileData,
    id: session.user.id,
    background_image_URL: "",
    recipe_ids: []
  };


  const { data, error } = await supabase
    .from('user_profile')
    .insert([newData])
    .select()
    .single();

  if (error) {
    console.error('Error creating new User Profile:', error);
    throw error;
  }
  return data;
}


export const updateUserProfile = async (userId: string, profileData: any) => {
  console.log("sending patch request to user: ", userId);
  console.log("profileData:", profileData);
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_profile')
    .update(profileData)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error){
    console.log("error in update");
    throw error;
  } 
  return data;
};


