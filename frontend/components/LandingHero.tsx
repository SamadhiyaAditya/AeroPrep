"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Target, TrendingUp, Zap, Award, CheckCircle2, BarChart3, Brain, Volume2, VolumeX } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export function LandingHero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video at the end frame (where AeroPrep branding appears)
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Keep the last frame visible
      videoRef.current.currentTime = videoRef.current.duration;
    }
  };

  const timelineData = [
    {
      title: "Step 1",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-semibold mb-2">
            Choose Your Role
          </p>
          <p className="text-gray-400 text-xs md:text-sm font-normal mb-8">
            Select from Frontend, Backend, or Full Stack developer tracks. Our AI adapts interview questions based on your chosen specialization and experience level.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary-200/10 to-primary-300/10 border border-primary-200/20 rounded-xl p-6 backdrop-blur-sm hover:border-primary-200/40 transition-all cursor-pointer">
              <Code className="h-8 w-8 text-primary-200 mb-3" />
              <p className="text-white font-semibold mb-1">Frontend</p>
              <p className="text-gray-400 text-xs">React, Vue, Angular</p>
            </div>
            <div className="bg-gradient-to-br from-primary-300/10 to-blue-400/10 border border-primary-300/20 rounded-xl p-6 backdrop-blur-sm hover:border-primary-300/40 transition-all cursor-pointer">
              <Target className="h-8 w-8 text-primary-300 mb-3" />
              <p className="text-white font-semibold mb-1">Backend</p>
              <p className="text-gray-400 text-xs">Node.js, Python, Java</p>
            </div>
            <div className="bg-gradient-to-br from-blue-400/10 to-indigo-500/10 border border-blue-400/20 rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/40 transition-all cursor-pointer">
              <Zap className="h-8 w-8 text-blue-400 mb-3" />
              <p className="text-white font-semibold mb-1">Full Stack</p>
              <p className="text-gray-400 text-xs">End-to-end development</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-semibold mb-2">
            Real-Time AI Interview
          </p>
          <p className="text-gray-400 text-xs md:text-sm font-normal mb-8">
            Practice with our advanced AI interviewer that asks follow-up questions, analyzes your code in real-time, and provides instant feedback on your approach.
          </p>
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="h-6 w-6 text-primary-200 flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-medium mb-2">AI Interview Coach</p>
                <p className="text-gray-400 text-sm mb-3">
                  Our AI interviewer asks contextual follow-up questions based on your answers, simulating real interview scenarios.
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary-200" />
                <span>Live code syntax checking</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary-200" />
                <span>Performance optimization tips</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary-200" />
                <span>Best practice suggestions</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-semibold mb-2">
            Detailed Performance Analytics
          </p>
          <p className="text-gray-400 text-xs md:text-sm font-normal mb-4">
            Get comprehensive feedback immediately after each session with detailed breakdowns of your performance.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <BarChart3 className="h-4 w-4 text-primary-200" />
              <span>Overall interview score</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <BarChart3 className="h-4 w-4 text-primary-300" />
              <span>Code quality assessment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <span>Communication effectiveness</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span>Problem-solving approach</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary-200/10 to-primary-200/5 border border-primary-200/20 rounded-xl p-6">
              <TrendingUp className="h-8 w-8 text-primary-200 mb-2" />
              <p className="text-2xl font-bold text-white mb-1">85%</p>
              <p className="text-gray-400 text-xs">Average Score</p>
            </div>
            <div className="bg-gradient-to-br from-primary-300/10 to-primary-300/5 border border-primary-300/20 rounded-xl p-6">
              <Award className="h-8 w-8 text-primary-300 mb-2" />
              <p className="text-2xl font-bold text-white mb-1">12</p>
              <p className="text-gray-400 text-xs">Completed Interviews</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 4",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-semibold mb-2">
            Track Your Progress
          </p>
          <p className="text-gray-400 text-xs md:text-sm font-normal mb-8">
            Monitor your improvement over time with comprehensive analytics and personalized recommendations for your interview success path.
          </p>
          <div className="bg-gradient-to-br from-primary-200/5 via-primary-300/5 to-blue-400/5 border border-primary-200/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Technical Knowledge</span>
                  <span className="text-primary-200 text-sm font-semibold">92%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-200 to-primary-300 w-[92%]"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Code Quality</span>
                  <span className="text-primary-300 text-sm font-semibold">78%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-300 to-blue-400 w-[78%]"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Problem Solving</span>
                  <span className="text-blue-400 text-sm font-semibold">85%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden font-sans antialiased selection:bg-primary-200/30 bg-black text-white">
        
      {/* Background gradient for non-video areas */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>

      {/* Volume Control - Fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
          <button 
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white p-3 rounded-full transition-all border border-white/20 shadow-2xl hover:scale-110 cursor-pointer"
              title={isMuted ? "Unmute Video" : "Mute Video"}
          >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
      </div>

      {/* Animations for floating elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
              <Link href="/" className="group flex items-center gap-3 cursor-pointer">
                  <Logo size="md" /> 
                  <span className="text-2xl font-bold text-white group-hover:text-primary-200 transition-colors duration-300">AeroPrep</span>
              </Link>

              <div className="flex items-center gap-4">
                  <Link href="/sign-in">
                      <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
                          Login
                      </button>
                  </Link>
                  <Link href="/sign-up">
                      <Button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-200 hover:to-primary-300 text-white px-6 py-6 font-medium shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-pointer">
                          <span className="relative z-10 flex items-center gap-2">
                              Get Started 
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </Button>
                  </Link>
              </div>
          </div>
      </header>

      {/* Hero Content - Side by Side Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20">
              {/* Left: Text Content */}
              <div className="flex-1 max-w-2xl">
                  {/* Main Headline */}
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[0.95]">
                      <span className="block text-white">Ace Your</span>
                      <span className="block bg-gradient-to-r from-primary-200 via-primary-300 to-blue-400 bg-clip-text text-transparent">
                        Technical Interviews
                      </span>
                  </h1>
                  
                  {/* Subheadline */}
                  <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed font-light">
                      Master your coding skills with advanced AI feedback. Get real-time performance insights, detailed analytics, and a personalized path to interview success.
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                      <Link href="/sign-up">
                          <Button className="group h-14 px-10 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-200 hover:to-primary-300 text-white shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-pointer">
                             Test Yourself Now
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                      </Link>
                  </div>
              </div>

              {/* Right: Video */}
              <div className="flex-1 w-full max-w-xl lg:max-w-2xl">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-200/20 border border-white/10">
                      <video 
                        ref={videoRef}
                        autoPlay 
                        muted={isMuted}
                        playsInline 
                        onEnded={handleVideoEnd}
                        className="w-full h-auto object-cover"
                      >
                          <source src="/herovideo.mp4" type="video/mp4" />
                      </video>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                  </div>
              </div>
          </div>

      </main>

      {/* How It Works Timeline Section */}
      <div className="relative z-10 -mt-20">
        <Timeline data={timelineData} />
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Final CTA Section */}
      <CTASection />

      {/* Updated Footer */}
      <Footer />

    </div>
  );
}
