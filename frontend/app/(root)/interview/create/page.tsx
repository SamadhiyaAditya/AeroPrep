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
    setLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        // Use public API if not logged in
        const { generateQuestions } = await import('@/lib/api');
        const questions = await generateQuestions(resumeURL, jobDescription);
        localStorage.setItem('interviewQuestions', JSON.stringify(questions));
        localStorage.setItem('resumeURL', resumeURL);
        localStorage.setItem('interviewId', ''); // No DB ID
        router.push('/interview/session');
        return;
      }

      // Create interview in database (this also generates questions)
      const data = await createInterview(resumeURL, jobDescription);
      
      // Store interview data
      localStorage.setItem('interviewId', String(data.interview.id));
      localStorage.setItem('interviewQuestions', JSON.stringify(data.questions));
      localStorage.setItem('resumeURL', resumeURL);
      
      router.push('/interview/session');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Start New Interview</h1>
      
      {!isAuthenticated() && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ You're not signed in. Your interview won't be saved to history.{' '}
            <Link href="/sign-in" className="underline font-medium">Sign in</Link> to save your progress.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Resume PDF URL</label>
          <input
            type="url"
            required
            className="w-full p-3 border rounded-lg bg-background"
            placeholder="https://example.com/resume.pdf"
            value={resumeURL}
            onChange={(e) => setResumeURL(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Note: Must be a publicly accessible PDF URL.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Job Description (Optional)</label>
          <textarea
            className="w-full p-3 border rounded-lg bg-background min-h-[150px]"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Generating Interview...' : 'Start Interview'}
        </Button>
      </form>
    </div>
  );
}
