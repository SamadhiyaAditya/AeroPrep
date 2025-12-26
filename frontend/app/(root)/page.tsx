"use client";

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { isAuthenticated, getUser, logout } from '@/lib/auth'
import { getInterviewHistory } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Rocket, BarChart2, Palette, Server, Layers, Clock, CheckCircle } from 'lucide-react'

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
      setInterviews(data.slice(0, 3));
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Auth Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">PrepAero</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Welcome, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="cursor-pointer">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="cursor-pointer">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>



      {/* Hero Section */}
      <section className="card-cta flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 lg:p-10 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border">
        <div className="flex flex-col gap-4 sm:gap-6 flex-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Get Interview Ready with AI Powered Practice
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Practice real interview questions and get instant AI feedback
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Button asChild className="btn-primary cursor-pointer w-full sm:w-auto">
              <Link href="/interview/create">
                <Rocket className="mr-2 h-4 w-4" /> Start an Interview
              </Link>
            </Button>
            {user && (
              <Button asChild variant="outline" className="cursor-pointer w-full sm:w-auto">
                <Link href="/interview/history">
                  <BarChart2 className="mr-2 h-4 w-4" /> View History
                </Link>
              </Button>
            )}
          </div>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          width={300}
          height={300}
          className="hidden md:block w-48 lg:w-72 h-auto"
        />
      </section>

      {/* Practice Quick Start */}
      <section className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Practice Quick Start</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {['Frontend Developer', 'Full Stack Developer', 'Backend Developer'].map((role) => (
             <Link 
               key={role}
               href={`/interview/create?role=${encodeURIComponent(role)}`}
               className="bg-card hover:bg-muted/50 border rounded-xl p-6 transition-all cursor-pointer flex flex-col gap-2 group"
             >
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                 {role.includes('Frontend') ? <Palette className="h-5 w-5" /> : role.includes('Backend') ? <Server className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
               </div>
               <h3 className="font-semibold">{role} Interview</h3>
               <p className="text-xs text-muted-foreground">Practice typically asked questions for {role} roles.</p>
             </Link>
           ))}
        </div>
      </section>

      {/* Recent Interviews */}
      {user && (
        <section className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold">Recent Interviews</h2>
            <Link href="/interview/history" className="text-primary text-sm hover:underline cursor-pointer">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground text-sm sm:text-base">No interviews yet. Start your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {interviews.map((interview) => (
                <Link 
                  key={interview.id} 
                  href={`/interview/history/${interview.id}`}
                  className="bg-card border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                      interview.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {interview.status === 'completed' 
                        ? <><CheckCircle className="h-3 w-3" /> Completed</>
                        : <><Clock className="h-3 w-3" /> In Progress</>
                      }
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
        <section className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8 text-center py-8 sm:py-10 px-4 bg-muted/20 rounded-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Sign in to save your interview history</h3>
          <p className="text-muted-foreground text-sm sm:text-base">Track your progress and review past interviews</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button asChild className="cursor-pointer w-full sm:w-auto">
              <Link href="/sign-up">Create Account</Link>
            </Button>
            <Button asChild variant="outline" className="cursor-pointer w-full sm:w-auto">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
