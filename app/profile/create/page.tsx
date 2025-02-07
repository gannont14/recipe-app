import React from 'react';
import UserProfileForm from '@/components/profile/upload-user-profile';
import { createClient } from '@/utils/supabase/client';

export default async function CreateProfilePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  console.log(session)
  if(!session) return (<div> session not found </div>)
  const userId = session.user.id;

  return (
    <div>
      <h1>Create Your User Profile</h1>
      <UserProfileForm  userId={userId}/>
    </div>
  );
}
