"use client";
import { Suspense } from 'react';
import { ProfileTabs } from './profile-tabs';
import { Loader2 } from 'lucide-react';

export default function ProfileWrapper() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ProfileTabs />
    </Suspense>
  );
}
