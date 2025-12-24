"use client";

import React, { useEffect, useState } from 'react';
import { generateFeedback, saveInterviewCoding, saveInterviewFeedback } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const interviewId = localStorage.getItem('interviewId');
        const interviewQuestions = JSON.parse(localStorage.getItem('interviewQuestions') || '[]');
        const interviewAnswers = JSON.parse(localStorage.getItem('interviewAnswers') || '[]');
        
        const interviewData = {
            questions: interviewQuestions,
            answers: interviewAnswers
        };
        
        const codingChallenge = JSON.parse(localStorage.getItem('codingChallenge') || '{}');
        const codingResult = JSON.parse(localStorage.getItem('codingResult') || '{}');
        const codingCode = localStorage.getItem('codingCode') || "";
        
        const codingData = {
            challenge: codingChallenge,
            code: codingCode,
            result: codingResult
        };
        
        // Generate feedback from AI
        const data = await generateFeedback(interviewData, codingData);
        setFeedback(data);
        
        // Save to database if authenticated
        if (isAuthenticated() && interviewId) {
          const id = parseInt(interviewId);
          
          // Save coding result
          await saveInterviewCoding(id, codingChallenge, codingCode, codingResult, codingResult?.skipped || false);
          
          // Save feedback
          await saveInterviewFeedback(id, data);
          
          setSaved(true);
        }
      } catch (error) {
        console.error("Failed to generate feedback", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Generating Comprehensive Report...</p>
        <p className="text-sm text-muted-foreground mt-2">(AI is analyzing your interview performance)</p>
      </div>
    );
  }
  
  if (!feedback) return <div className="p-10 text-center text-red-500">Failed to load feedback.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Interview Report</h1>
        <div className="text-2xl font-semibold text-primary">
            Overall Score: {feedback.totalScore}/100
        </div>
        <div className="text-xl font-medium px-4 py-2 bg-muted rounded-full inline-block">
            Recommendation: {feedback.hiringRecommendation}
        </div>
        
        {saved && (
          <div className="text-sm text-green-600">
            ✓ Interview saved to your history
          </div>
        )}
        
        {!isAuthenticated() && (
          <div className="text-sm text-amber-600">
            ⚠️ Sign in to save this to your history
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-xl bg-card">
            <h3 className="text-xl font-bold mb-4">Interview Performance</h3>
            <div className="text-4xl font-bold mb-2">{feedback.interviewScore}/100</div>
            <p className="text-muted-foreground">Based on Q&A session.</p>
        </div>
        <div className="p-6 border rounded-xl bg-card">
            <h3 className="text-xl font-bold mb-4">Coding Performance</h3>
            <div className="text-4xl font-bold mb-2">{feedback.codingScore}/100</div>
            <p className="text-muted-foreground">Based on code correctness and quality.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
             <h3 className="text-lg font-bold text-green-600 mb-2">Strengths</h3>
             <ul className="list-disc list-inside space-y-1">
                 {feedback.strengths?.map((s:string, i:number) => <li key={i}>{s}</li>)}
             </ul>
         </div>
         <div>
             <h3 className="text-lg font-bold text-red-600 mb-2">Areas for Improvement</h3>
             <ul className="list-disc list-inside space-y-1">
                 {feedback.weaknesses?.map((w:string, i:number) => <li key={i}>{w}</li>)}
             </ul>
         </div>
      </div>

      <div className="p-6 border rounded-xl bg-muted/30">
          <h3 className="text-xl font-bold mb-4">Detailed Feedback</h3>
          <p className="leading-relaxed whitespace-pre-wrap">{feedback.detailedFeedback}</p>
      </div>

      <div className="flex justify-center gap-4 pt-8">
          <Button onClick={() => router.push('/')} size="lg" variant="outline">Back to Home</Button>
          {isAuthenticated() && (
            <Button asChild size="lg">
              <Link href="/interview/history">View History</Link>
            </Button>
          )}
      </div>
    </div>
  );
}
