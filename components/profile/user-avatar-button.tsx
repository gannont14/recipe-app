'use client'
import { CircleUser } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface params{
  userId: string;
}

export default function UserAvatarButton({ userId} : params) {
  const router = useRouter();
  return (
    <div className="cursor-pointer" onClick={() => router.push(`/profile/${userId}`)}>
      <CircleUser />
    </div>
  )

}
