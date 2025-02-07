'use client'
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface params {
  userId: string;
}

export default function ProfileSettingsButton({ userId } : params) {

  const router = useRouter()
  return (
    <div className="cursor-pointer" onClick={() => router.push(`/create/profile`)}>
      <Settings size={36}/>
    </div>
  )
}
