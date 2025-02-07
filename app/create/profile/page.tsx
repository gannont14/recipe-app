'use client'
import React, { useState, useEffect } from 'react';
import UserProfileForm from '@/components/profile/upload-user-profile';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

export default function CreateProfilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session |  null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        setUserId(session.user.id);
      }
      setIsLoading(false);
    };

    fetchSession();
  }, []);

  if(isLoading){
    return (<div> loading... </div>);
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <div>
      <h1>Create Your User Profile</h1>
      <UserProfileForm userId={userId} />
    </div>
  );
}
