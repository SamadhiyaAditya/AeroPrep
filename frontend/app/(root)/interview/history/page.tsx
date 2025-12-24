"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getInterviewHistory } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';

interface Interview {
  id: number;
  resumeURL: string;
  jobDescription: string | null;
  status: string;
  createdAt: string;
  feedback: {
    totalScore: number;
    recommendation: string;
  } | null;
  _count: {
    questions: number;
  };
}

export default function InterviewHistoryPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/sign-in');
      return;
    }

    async function fetchInterviews() {
      try {
        const data = await getInterviewHistory();
        setInterviews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-500 text-center">{error}</p>
        <Button onClick={() => router.push('/sign-in')} className="cursor-pointer">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="cursor-pointer">
              <Link href="/">← Back</Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Interview History</h1>
          </div>
          <Button asChild className="cursor-pointer w-full sm:w-auto">
            <Link href="/interview/create">+ New Interview</Link>
          </Button>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-muted/30 rounded-lg px-4">
            <h3 className="text-lg sm:text-xl mb-4">No interviews yet</h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">Start your first AI interview practice session</p>
            <Button asChild className="cursor-pointer">
              <Link href="/interview/create">Start Interview</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {interviews.map((interview) => (
              <Link 
                key={interview.id} 
                href={`/interview/history/${interview.id}`}
                className="block"
              >
                <div className="bg-card border rounded-lg p-4 sm:p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          interview.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(interview.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {interview.jobDescription || 'General Interview'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {interview._count.questions} questions
                      </p>
                    </div>
                    
                    {interview.feedback && (
                      <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                        <div className={`text-xl sm:text-2xl font-bold ${
                          interview.feedback.totalScore >= 70 ? 'text-green-500' :
                          interview.feedback.totalScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {interview.feedback.totalScore}/100
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {interview.feedback.recommendation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
