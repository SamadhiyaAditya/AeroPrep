"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

interface InteractiveAgentProps {
  textToSpeak?: string;
  isListening?: boolean;
  onUserSpeak?: (text: string) => void;
  onFinishedSpeaking?: () => void;
}

const Agent = ({ textToSpeak, isListening, onUserSpeak, onFinishedSpeaking }: InteractiveAgentProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null); // Type 'any' for WebkitSpeechRecognition

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
               // interim
               setTranscript(event.results[i][0].transcript);
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
            if (onUserSpeak) onUserSpeak(finalTranscript);
          }
        };
      }
    }
  }, []);

  // Handle Text to Speech
  useEffect(() => {
    if (textToSpeak && synthRef.current) {
      // Cancel previous speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onFinishedSpeaking) onFinishedSpeaking();
      };
      
      synthRef.current.speak(utterance);
    }
  }, [textToSpeak]);

  // Handle Listening State
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      if(!isSpeaking) { // Don't listen while speaking
         try { recognitionRef.current.start(); } catch(e) {/* already started */}
      }
    } else if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {/* already stopped */}
    }
  }, [isListening, isSpeaking]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <div className={cn(
            "relative rounded-full p-2 transition-all duration-300",
            isSpeaking ? "ring-4 ring-primary/50 scale-105" : "",
            isListening ? "ring-4 ring-green-500/50" : ""
        )}>
           <div className="avatar size-40 relative">
            <Image
              src="/ai-avatar.png" 
              alt="AI Interviewer"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
           {isSpeaking && <span className="text-primary text-sm font-semibold animate-pulse">Speaking...</span>}
           {isListening && <span className="text-green-600 text-sm font-semibold animate-pulse">Listening...</span>}
        </div>
      </div>

      {/* Transcript Area */}
      {transcript && (
        <div className="glassmorphism p-4 rounded-xl max-w-lg w-full text-center min-h-[100px] flex items-center justify-center">
          <p className="text-lg text-foreground/80">"{transcript}"</p>
        </div>
      )}
    </div>
  );
};

export default Agent;
