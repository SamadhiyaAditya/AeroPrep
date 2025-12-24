"use client";

import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { isAuthenticated, getUser, logout } from '@/lib/auth'
import { getInterviewHistory } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Interview {
  id: number;
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

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
      fetchRecentInterviews();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchRecentInterviews() {
    try {
      const data = await getInterviewHistory();
      setInterviews(data.slice(0, 3)); // Show only 3 recent
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    setUser(null);
    router.refresh();
  };

  return (
    <>
      {/* Auth Header */}
      <div className="flex justify-end gap-4 mb-6">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview Ready with AI Powered Practice and Feedback</h2>
          <p className="text-lg">
            Practice real interview questions and get instant AI feedback
          </p>
          <div className="flex gap-4">
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview/create">Start an Interview</Link>
            </Button>
            {user && (
              <Button asChild variant="outline" className="max-sm:w-full">
                <Link href="/interview/history">View History</Link>
              </Button>
            )}
          </div>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Recent Interviews */}
      {user && (
        <section className="flex flex-col gap-6 mt-8">
          <div className="flex justify-between items-center">
            <h2>Recent Interviews</h2>
            <Link href="/interview/history" className="text-primary text-sm hover:underline">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No interviews yet. Start your first one!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {interviews.map((interview) => (
                <Link 
                  key={interview.id} 
                  href={`/interview/history/${interview.id}`}
                  className="bg-card border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      interview.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                    {interview.feedback && (
                      <span className="font-bold text-lg">
                        {interview.feedback.totalScore}/100
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {interview._count.questions} questions
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA for non-logged in users */}
      {!user && !loading && (
        <section className="flex flex-col gap-6 mt-8 text-center py-10 bg-muted/20 rounded-lg">
          <h3 className="text-xl">Sign in to save your interview history</h3>
          <p className="text-muted-foreground">Track your progress and review past interviews</p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/sign-up">Create Account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
