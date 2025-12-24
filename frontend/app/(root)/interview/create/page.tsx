"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInterview } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateInterviewPage() {
  const router = useRouter();
  const [resumeURL, setResumeURL] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      // Clear any previous interview data
      localStorage.removeItem('generatedFeedback');
      localStorage.removeItem('codingChallenge');
      localStorage.removeItem('codingResult');
      localStorage.removeItem('codingCode');
      localStorage.removeItem('interviewAnswers');
      
      if (!isAuthenticated()) {
        const { generateQuestions } = await import('@/lib/api');
        const questions = await generateQuestions(resumeURL, jobDescription);
        localStorage.setItem('interviewQuestions', JSON.stringify(questions));
        localStorage.setItem('resumeURL', resumeURL);
        localStorage.setItem('interviewId', '');
        router.push('/interview/session');
        return;
      }

      const data = await createInterview(resumeURL, jobDescription);
      
      localStorage.setItem('interviewId', String(data.interview.id));
      localStorage.setItem('interviewQuestions', JSON.stringify(data.questions));
      localStorage.setItem('resumeURL', resumeURL);
      
      router.push('/interview/session');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="cursor-pointer">
            <Link href="/">← Back</Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Start New Interview</h1>
        </div>
        
        {!isAuthenticated() && (
          <div className="mb-6 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">
              ⚠️ You're not signed in. Your interview won't be saved.{' '}
              <Link href="/sign-in" className="underline font-medium cursor-pointer">Sign in</Link> to save your progress.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Resume PDF URL</label>
            <input
              type="url"
              required
              disabled={loading}
              className="w-full p-3 border rounded-lg bg-background text-sm sm:text-base cursor-text disabled:opacity-50"
              placeholder="https://example.com/resume.pdf"
              value={resumeURL}
              onChange={(e) => setResumeURL(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be a publicly accessible PDF URL.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description (Optional)</label>
            <textarea
              disabled={loading}
              className="w-full p-3 border rounded-lg bg-background min-h-[120px] sm:min-h-[150px] text-sm sm:text-base cursor-text disabled:opacity-50"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary cursor-pointer py-6 text-base sm:text-lg"
          >
            {loading ? '⏳ Generating Interview...' : '🚀 Start Interview'}
          </Button>
        </form>
      </div>
    </div>
  );
}
