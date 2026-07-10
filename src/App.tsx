import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Library, PlayCircle, BookOpen, Volume2, HelpCircle, Loader2, ArrowRight } from "lucide-react";

import { Lesson } from "./types";
import { prebuiltLessons } from "./data";
import CustomLessonPlayer from "./components/CustomLessonPlayer";

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(prebuiltLessons[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState("");

  const handleGenerateCustomLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic || customTopic.trim().length === 0) return;

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStatus("Connecting to Gemini AI Engine...");

    // Create realistic teaching status updates for visual delight
    const statusSteps = [
      "Structuring learning objectives...",
      "Drafting spoken narrator script...",
      "Designing responsive slide layouts...",
      "Mapping math equations & simulation layers...",
      "Assembling interactive animators...",
    ];

    let stepIdx = 0;
    const statusInterval = setInterval(() => {
      if (stepIdx < statusSteps.length) {
        setGenerationStatus(statusSteps[stepIdx]);
        stepIdx++;
      }
    }, 2500);

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: customTopic }),
      });

      clearInterval(statusInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to compile custom AI animation script.");
      }

      const generatedLesson: Lesson = await response.json();
      setSelectedLesson(generatedLesson);
      setCustomTopic("");
    } catch (err: any) {
      clearInterval(statusInterval);
      console.error(err);
      setGenerationError(
        err.message || "An unexpected error occurred. Please check your connection or secrets configuration."
      );
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00FF66] selection:text-black pb-12" id="main-container">
      
      {/* Subtle futuristic circular ambient glow in background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 bg-[radial-gradient(circle_at_50%_50%,#00FF66_0%,transparent_70%)] pointer-events-none -z-10" />

      {/* Primary Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Navigation & Header */}
        <header className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#00FF66] rounded-sm"></div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">Academy of Neural Arts</span>
          </div>
          <div className="flex space-x-8 items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 hidden sm:inline">Resources</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 hidden sm:inline">Classroom Logs</span>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00FF66] flex items-center gap-1.5 bg-[#00FF66]/10 px-2.5 py-1 rounded-md border border-[#00FF66]/20">
              <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-full animate-pulse" />
              Active Class
            </span>
          </div>
        </header>

        {/* Hero Header block with Bold Typography */}
        <div className="py-2">
          <h2 className="text-[#00FF66] text-xs font-bold tracking-[0.3em] uppercase mb-3">Module 04 // Interactive Simulations</h2>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase">
            AI Animation <br/>
            <span className="stroke-text-white">Classroom</span>
          </h1>
          <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-xl font-medium italic">
            "An interactive, high-fidelity visualizer and vocal presentation engine designed to teach students neural networks, convolutional filters, and deep learning architectures."
          </p>
        </div>

        {/* Dashboard grid layout: Lessons Navigator (Left) & Active Player (Right) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: PREBUILT LIBRARY & CUSTOM GENERATION FORM (4 columns) */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Custom Lesson Creation Form */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-sm relative overflow-hidden" id="custom-builder">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#00FF66]/5 rounded-full blur-xl" />

              <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>Create Custom Lesson</span>
              </h3>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                Enter any AI topic below. Gemini will structure custom slide configurations, a step-by-step spoken script, and compile it instantly!
              </p>

              <form onSubmit={handleGenerateCustomLesson} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    disabled={isGenerating}
                    placeholder="e.g., Reinforcement Learning, GANs..."
                    className="w-full text-xs font-semibold border border-white/10 bg-black/40 focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none rounded-xl px-4 py-3 text-white disabled:opacity-50 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !customTopic.trim()}
                  className="w-full py-3 bg-[#00FF66] text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-[#00FF66] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling Lesson...</span>
                    </>
                  ) : (
                    <>
                      <span>Animate Lesson Topic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Status Display */}
              {isGenerating && (
                <motion.div
                  className="mt-3 text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/20 p-2.5 rounded-lg flex items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                  <span>{generationStatus}</span>
                </motion.div>
              )}

              {/* Error Display */}
              {generationError && (
                <motion.div
                  className="mt-3 text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="font-bold mb-1">Compilation Blocked</p>
                  <p className="leading-normal">{generationError}</p>
                  <p className="mt-2 text-white/40 text-[9px] font-sans">
                    💡 Tip: Ensure your GEMINI_API_KEY is defined in the Secrets panel, or explore the prebuilt modules below immediately!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Prebuilt Modules Library styled as Chapter List */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-4" id="prebuilt-library">
              <div>
                <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase flex items-center gap-2">
                  <Library className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>Syllabus Modules</span>
                </h3>
                <p className="text-[11px] text-white/40 mt-0.5 font-medium">
                  Select a live neural animation presentation to load onto the visualizer.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {prebuiltLessons.map((lesson, idx) => {
                  const isSelected = selectedLesson.topic === lesson.topic;
                  const formattedIdx = String(idx + 1).padStart(2, "0");
                  return (
                    <button
                      key={lesson.topic}
                      onClick={() => {
                        if (!isGenerating) {
                          setSelectedLesson(lesson);
                          setGenerationError(null);
                        }
                      }}
                      disabled={isGenerating}
                      className={`text-left w-full group flex items-center justify-between border-b py-2.5 transition-all ${
                        isSelected
                          ? "border-white/40 text-[#00FF66]"
                          : "border-white/10 text-white/70 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-black italic ${isSelected ? "text-[#00FF66]" : "text-white/20 group-hover:text-[#00FF66] transition-colors"}`}>
                          {formattedIdx}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-widest leading-tight">
                            {lesson.topic.split(" (")[0]}
                          </span>
                          <span className="text-[9px] text-white/40 font-medium">
                            {lesson.slides.length} slides
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono ${isSelected ? "text-[#00FF66] font-bold" : "text-white/30"}`}>
                        {isSelected ? "PLAYING" : "LOAD"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pedagogical helper instructions card */}
            <div className="bg-black border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF66]/5 rounded-full blur-2xl" />
              <h4 className="text-[10px] font-black tracking-widest uppercase text-[#00FF66] mb-3 font-mono">
                // Teacher's Guide
              </h4>
              <ul className="text-xs text-white/60 leading-relaxed space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#00FF66] font-mono">▸</span>
                  <span><strong>Sound Synthesizer:</strong> Keep audio unmuted! The browser will read the presenter scripts using voice synthesis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FF66] font-mono">▸</span>
                  <span><strong>Presentation controls:</strong> Use pause anytime to hold the animation and explain deep technical code directly to students.</span>
                </li>
              </ul>
            </div>

          </section>

          {/* RIGHT PANEL: CORE PRESENTATION ANIMATION PLAYER (8 columns) */}
          <section className="lg:col-span-8">
            <CustomLessonPlayer
              lesson={selectedLesson}
              onFinished={() => {
                // optional hook on completion
              }}
            />
          </section>

        </main>

        {/* Bottom Status Bar from Bold Typography theme */}
        <footer className="px-6 md:px-10 py-5 bg-[#00FF66] text-black flex flex-col md:flex-row justify-between items-center gap-4 rounded-xl mt-4">
          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-tighter block leading-none opacity-60">Current Syllabus Module</span>
              <span className="text-base md:text-lg font-black uppercase tracking-tight leading-none">{selectedLesson.topic}</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-black/20" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-tighter block leading-none opacity-60">Student Presence</span>
              <span className="text-base md:text-lg font-black uppercase tracking-tight leading-none">24 Active Connections</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span className="text-[9px] font-black uppercase tracking-tighter block leading-none opacity-60 italic">Live Session Status</span>
            <span className="text-base md:text-lg font-black uppercase tracking-tight leading-none">REC // 00:45:22:04</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
