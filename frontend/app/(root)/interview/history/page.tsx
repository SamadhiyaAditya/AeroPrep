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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Interview History</h1>
          <Button asChild>
            <Link href="/interview/create">New Interview</Link>
          </Button>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg">
            <h3 className="text-xl mb-4">No interviews yet</h3>
            <p className="text-muted-foreground mb-6">Start your first AI interview practice session</p>
            <Button asChild>
              <Link href="/interview/create">Start Interview</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <Link 
                key={interview.id} 
                href={`/interview/history/${interview.id}`}
                className="block"
              >
                <div className="bg-card border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          interview.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(interview.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {interview.jobDescription || 'General Interview'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {interview._count.questions} questions
                      </p>
                    </div>
                    
                    {interview.feedback && (
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
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
