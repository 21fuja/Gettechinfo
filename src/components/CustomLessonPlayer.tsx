import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronRight, ChevronLeft, Video, HelpCircle } from "lucide-react";
import { Lesson, Slide } from "../types";

// Visualizer Imports
import NeuralNetworkVisualizer from "./NeuralNetworkVisualizer";
import GraphPlotVisualizer from "./GraphPlotVisualizer";
import BlockDiagramVisualizer from "./BlockDiagramVisualizer";
import GridScannerVisualizer from "./GridScannerVisualizer";
import ComparisonMatrixVisualizer from "./ComparisonMatrixVisualizer";

interface CustomLessonPlayerProps {
  lesson: Lesson;
  onFinished?: () => void;
}

export default function CustomLessonPlayer({ lesson, onFinished }: CustomLessonPlayerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1); // 1x, 1.2x, 1.5x
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isPlayingRef = useRef(isPlaying);
  const activeIdxRef = useRef(activeIdx);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const activeSlide: Slide = lesson.slides[activeIdx] || lesson.slides[0];

  // Fetch available Web Speech voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Filter to English or standard clear voices
        const englishVoices = voices.filter(v => v.lang.startsWith("en"));
        setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices);
        if (englishVoices.length > 0 && !selectedVoiceName) {
          // Default to a clear sounding voice (like Google US English or natural voices)
          const preferred = englishVoices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || englishVoices[0];
          setSelectedVoiceName(preferred.name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Stop any active speech
  const stopSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  // Speak the script for the current slide
  const speakCurrentSlide = () => {
    stopSpeech();
    if (isMuted || !activeSlide) return;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(activeSlide.script);
      
      // Assign selected voice
      if (selectedVoiceName) {
        const matchingVoice = availableVoices.find(v => v.name === selectedVoiceName);
        if (matchingVoice) u.voice = matchingVoice;
      }

      u.rate = playbackRate;
      u.pitch = 1.05; // Slightly friendly pitch

      // When the speech ends, if we are in "Play" mode, auto-advance to the next slide!
      u.onend = () => {
        if (isPlayingRef.current) {
          // Delay briefly for natural pacing before advancing
          playTimerRef.current = setTimeout(() => {
            if (activeIdxRef.current < lesson.slides.length - 1) {
              setActiveIdx(prev => prev + 1);
            } else {
              setIsPlaying(false);
              if (onFinishedRef.current) onFinishedRef.current();
            }
          }, 1500);
        }
      };

      u.onerror = () => {
        // Safe fallback in case speech is blocked
        if (isPlayingRef.current) {
          playTimerRef.current = setTimeout(() => {
            if (activeIdxRef.current < lesson.slides.length - 1) {
              setActiveIdx(prev => prev + 1);
            } else {
              setIsPlaying(false);
            }
          }, 8000); // 8 second fallback per slide
        }
      };

      speechUtteranceRef.current = u;
      window.speechSynthesis.speak(u);
    } else {
      // Offline fallback when speech synthesis isn't supported
      if (isPlayingRef.current) {
        playTimerRef.current = setTimeout(() => {
          if (activeIdxRef.current < lesson.slides.length - 1) {
            setActiveIdx(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, 8000);
      }
    }
  };

  // Trigger speech whenever the active slide or mute status changes
  useEffect(() => {
    speakCurrentSlide();
    return () => stopSpeech();
  }, [activeIdx, isMuted, selectedVoiceName, playbackRate]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (isPlaying) {
      // If we clicked play, trigger speech (which in turn chains the onend auto-advance)
      speakCurrentSlide();
    } else {
      stopSpeech();
    }
    return () => stopSpeech();
  }, [isPlaying]);

  const handleNext = () => {
    if (activeIdx < lesson.slides.length - 1) {
      setActiveIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(prev => prev - 1);
    }
  };

  const handleReset = () => {
    stopSpeech();
    setActiveIdx(0);
    setIsPlaying(false);
  };

  // Render the appropriate animation visualizer
  const renderVisualizer = () => {
    if (!activeSlide) return null;
    
    const { visualType, visualConfig, title } = activeSlide;

    switch (visualType) {
      case "neural_network":
        return (
          <NeuralNetworkVisualizer
            layers={visualConfig?.layers}
            animateWeights={visualConfig?.animateWeights}
            isBackprop={title.toLowerCase().includes("backpropagation") || title.toLowerCase().includes("backprop")}
          />
        );
      case "graph_plot":
        return (
          <GraphPlotVisualizer
            title={visualConfig?.title}
            xAxis={visualConfig?.xAxis}
            yAxis={visualConfig?.yAxis}
            curve={visualConfig?.curve}
          />
        );
      case "block_diagram":
        return (
          <BlockDiagramVisualizer
            blocks={visualConfig?.blocks}
            highlightIndex={visualConfig?.highlightIndex}
          />
        );
      case "grid_scanner":
        return (
          <GridScannerVisualizer
            label={visualConfig?.label}
            size={visualConfig?.size}
          />
        );
      case "comparison_matrix":
        return (
          <ComparisonMatrixVisualizer
            headers={visualConfig?.headers}
            rows={visualConfig?.rows}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-400">
            <HelpCircle className="w-12 h-12 mb-2 animate-bounce" />
            <span>Generating simulation...</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col gap-6" id="lesson-player">
      {/* Upper Panel: Video Title & Narrator settings */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 uppercase">
              <Video className="w-3 h-3 text-[#00FF66] animate-pulse" />
              <span>Active Lesson Simulation</span>
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">{lesson.topic}</h2>
          <p className="text-xs text-white/50 font-medium mt-0.5 max-w-xl">{lesson.overview}</p>
        </div>

        {/* Narrator Settings Panel */}
        <div className="flex flex-wrap items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg transition-all ${
              isMuted ? "bg-rose-500/20 text-rose-400" : "bg-white/5 text-white hover:bg-white/10"
            }`}
            title={isMuted ? "Unmute Narrator Voice" : "Mute Narrator Voice"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Voice Select */}
          {availableVoices.length > 0 && (
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="text-[11px] font-mono bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none max-w-[150px]"
              title="Change Voice Accent"
            >
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name} className="bg-black text-white">
                  {voice.name.replace("Microsoft", "").replace("Google", "").trim()}
                </option>
              ))}
            </select>
          )}

          {/* Playback speed selector */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="text-[11px] font-mono bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] outline-none"
            title="Narrator Speed"
          >
            <option value="0.8" className="bg-black">0.8x Speed</option>
            <option value="1" className="bg-black">1.0x Speed</option>
            <option value="1.2" className="bg-black">1.2x Speed</option>
            <option value="1.5" className="bg-black">1.5x Speed</option>
          </select>
        </div>
      </div>

      {/* Main Content Stage: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visual Animation Screen (65%) */}
        <div className="lg:col-span-7 flex flex-col min-h-[260px]">
          <div className="flex-1 bg-black rounded-xl relative border border-white/10 overflow-hidden flex items-center justify-center p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {renderVisualizer()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Narrative Explanations & Bulletpoints (35%) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            {/* Slide Index & Title */}
            <div>
              <div className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#00FF66]">
                Slide {activeIdx + 1} // {lesson.slides.length}
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mt-1">
                {activeSlide?.title}
              </h3>
            </div>

            {/* Bullet points on slide */}
            <div className="flex flex-col gap-2.5">
              {activeSlide?.content.map((point, idx) => (
                <motion.div
                  key={`pt-${idx}`}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 bg-[#00FF66] mt-1.5 shrink-0" />
                  <p className="text-xs text-white/75 leading-relaxed font-semibold">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subtitles/Captions block (Narrator speech script) */}
          <div className="bg-black text-white p-5 rounded-xl border border-white/10 relative overflow-hidden flex flex-col justify-center min-h-[100px]">
            <div className="absolute top-2 right-3 text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">
              // Spoken Captions
            </div>
            <div className="text-xs font-bold uppercase tracking-tight leading-snug text-white/90">
              <span className="text-white/40">"</span>
              {activeSlide?.script}
              <span className="text-white/40">"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Interactive Timeline controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/40 px-5 py-4 rounded-xl border border-white/10">
        
        {/* Timeline Slider ticks */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[10px] font-mono text-white/40 uppercase font-black tracking-widest mr-1">Timeline:</span>
          {lesson.slides.map((_, idx) => (
            <button
              key={`tick-${idx}`}
              onClick={() => {
                stopSpeech();
                setActiveIdx(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIdx
                  ? "w-8 bg-[#00FF66]"
                  : idx < activeIdx
                  ? "w-4 bg-[#00FF66]/50"
                  : "w-2.5 bg-white/10 hover:bg-white/20"
              }`}
              title={`Jump to Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Controls: Back, Play, Next, Reset */}
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={handlePrev}
            disabled={activeIdx === 0}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-20 disabled:hover:bg-transparent rounded-lg transition"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-black uppercase text-xs tracking-wider transition-all shadow-md ${
              isPlaying
                ? "bg-white text-black hover:bg-white/90"
                : "bg-[#00FF66] text-black hover:bg-emerald-400"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={activeIdx === lesson.slides.length - 1}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-20 disabled:hover:bg-transparent rounded-lg transition"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Separator */}
          <div className="w-[1px] h-6 bg-white/10" />

          {/* Restart button */}
          <button
            onClick={handleReset}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/75 hover:text-white rounded-lg transition"
            title="Restart Presentation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
