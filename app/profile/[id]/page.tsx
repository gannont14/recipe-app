import { createClient } from "@/utils/supabase/server";
import { UserProfile } from "@/types/profiles/profiles";
import {  getUserProfile } from "@/lib/repositories/profileRepository";
import ProfileCard from "@/components/profile/profile-card";


interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: PageParams){

  // params
  const { id } = await params;
  // getting the params profile data
  const profile: UserProfile = await getUserProfile(id);



  // getting the current user's id
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;

  // if this is the current user's id, then they can edit
  const isEditable: boolean = userId === id;

  console.log("found page")
  console.log("editable: ", isEditable);
  console.log("hasProfile: ", profile);

  // no profile is fetched
  if(!profile){
    // this is the current user's, prompt to setup
    if(isEditable){
      return (<div> You haven't set up your profile </div>);
    }
    else{
      return (<div> User not found, or they haven't set up their profile </div>);
    }
  } 

  return (
    <ProfileCard userProfile={profile} isEditable={isEditable} />
  );


}
