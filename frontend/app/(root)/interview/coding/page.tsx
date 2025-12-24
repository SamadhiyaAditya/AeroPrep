"use client";

import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { generateCodingChallenge, evaluateCode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

export default function CodingRoundPage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState("// Loading starter code...");
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  useEffect(() => {
    const fetchChallenge = async () => {
       setLoading(true);
       try {
           const resumeURL = localStorage.getItem('resumeURL');
           if (!resumeURL) {
               alert("Resume URL missing. Please start a new interview.");
               router.push('/interview/create');
               return;
           }
           
           const data = await generateCodingChallenge(resumeURL);
           setChallenge(data);
           setCode(data.starterCode || "// Write your solution here");
           setSelectedLanguage(data.language || 'javascript');
       } catch (error) {
           console.error("Failed to load challenge", error);
       } finally {
           setLoading(false);
       }
    };
    
    fetchChallenge();
  }, []);

  const handleRun = async () => {
      if (!challenge) return;
      setEvaluating(true);
      setOutput(null);
      try {
          const result = await evaluateCode(code, selectedLanguage, challenge);
          setOutput(result);
      } catch (error) {
          console.error("Evaluation failed", error);
      } finally {
          setEvaluating(false);
      }
  };

  const handleFinish = () => {
     // Save results and go to feedback
     localStorage.setItem('codingResult', JSON.stringify(output));
     localStorage.setItem('codingChallenge', JSON.stringify(challenge));
     localStorage.setItem('codingCode', code);
     router.push('/interview/feedback');
  };

  const handleSkip = () => {
     // Skip coding round - save empty results
     localStorage.setItem('codingResult', JSON.stringify({ passed: false, feedback: 'Skipped coding round', skipped: true }));
     localStorage.setItem('codingChallenge', JSON.stringify(challenge || { title: 'Skipped' }));
     localStorage.setItem('codingCode', '// Coding round was skipped');
     router.push('/interview/feedback');
  };

  if (loading || !challenge) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Generating Coding Challenge...</p>
          <p className="text-sm text-muted-foreground mt-2">(AI is creating a personalized problem based on your resume)</p>
          <Button variant="outline" className="mt-6" onClick={handleSkip}>
            Skip Coding Round
          </Button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Panel: Problem Statement */}
      <div className="w-full md:w-1/3 p-6 border-r overflow-y-auto h-screen">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            <Button variant="ghost" size="sm" onClick={handleSkip}>Skip Round</Button>
          </div>
          
          {/* AI Evaluation Info Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ <strong>Note:</strong> Code is evaluated by AI analysis, not actual execution. 
              The AI reviews your logic and determines if it would pass test cases.
            </p>
          </div>
          
          <div className="prose dark:prose-invert">
              <p className="mb-4">{challenge.description}</p>
              
              <h3 className="text-lg font-semibold mt-4">Problem Statement</h3>
              <div className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md mb-4">
                  {challenge.problemStatement}
              </div>

              <h3 className="text-lg font-semibold mt-4">Constraints</h3>
              <p className="text-sm">{challenge.constraints}</p>

              <h3 className="text-lg font-semibold mt-4">Example Test Cases</h3>
              <div className="space-y-2">
                  {challenge.testCases?.map((tc:any, i:number) => (
                      <div key={i} className="bg-muted p-2 rounded text-xs font-mono">
                          Input: {tc.input} <br/>
                          Expected: {tc.expectedOutput}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Right Panel: Editor & Output */}
      <div className="w-full md:w-2/3 flex flex-col h-screen">
          {/* Language Selector Bar */}
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center gap-4">
            <label className="text-sm text-slate-300">Language:</label>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1.5 rounded-md text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value || "")}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
              />
          </div>
          
          {/* Output Console */}
          <div className="h-1/3 bg-slate-900 border-t p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold">Output / Console</h3>
                  <div className="flex gap-2">
                      <Button onClick={handleRun} disabled={evaluating} size="sm">
                          {evaluating ? 'Evaluating...' : 'Run & Submit'}
                      </Button>
                      
                      <Button onClick={handleFinish} variant="secondary" size="sm">
                          Finish & View Feedback
                      </Button>
                  </div>
              </div>
              
              {output ? (
                  <div className={`text-sm font-mono ${output.passed ? "text-green-400" : "text-red-400"}`}>
                      <p className="font-bold mb-2">{output.passed ? "All Test Cases Passed!" : "Test Cases Failed"}</p>
                      <p className="whitespace-pre-wrap mb-4">{output.feedback}</p>
                      
                      {output.testResults && (
                          <div className="space-y-1">
                              {output.testResults.map((res:any, i:number) => (
                                  <div key={i} className={res.passed ? "text-green-500" : "text-red-500"}>
                                      Test {i+1}: {res.passed ? "PASS" : `FAIL (Expected: ${res.expected}, Got: ${res.actual})`}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              ) : (
                  <div className="text-slate-500 text-sm">
                      Click "Run & Submit" to have AI evaluate your solution against test cases.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
