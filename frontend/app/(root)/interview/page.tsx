"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InterviewPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new interview creation page
    router.replace('/interview/create');
  }, [router]);
  
  return (
    <div className="p-10 text-center">
      <p>Redirecting to interview creation...</p>
    </div>
  );
}
