import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, FileText, Code, GraduationCap, Compass, HelpCircle, Send, Sparkles, Mic, MicOff, Volume2, VolumeX, User, ArrowRight, Bookmark, Plus, CheckCircle2, ChevronRight, Award, Trophy } from "lucide-react";
import { UserProfile, Message, AIToolId, SavedProject, LearningPhase, RecommendedProject } from "../types";

// Types for Speech Recognition browser support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AIToolsPageProps {
  darkMode: boolean;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  activeTool: AIToolId;
  setActiveTool: (tool: AIToolId) => void;
}

export default function AIToolsPage({
  darkMode,
  user,
  setUser,
  activeTool,
  setActiveTool,
}: AIToolsPageProps) {
  
  // Gamified XP Addition Helper
  const addXP = (amount: number, activityDescription: string, badgeCheck?: string) => {
    let newXP = user.xp + amount;
    let newLevel = user.level;
    const xpNeeded = user.level * 100;
    
    // Level up logic
    if (newXP >= xpNeeded) {
      newXP = newXP - xpNeeded;
      newLevel += 1;
    }

    // Unlock badge logic
    const updatedBadges = user.badges.map((b) => {
      if (b.id === badgeCheck) {
        return { ...b, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
      }
      return b;
    });

    const newActivity = {
      id: `act-${Date.now()}`,
      type: "tool",
      description: `${activityDescription} (+${amount} XP)`,
      date: new Date().toLocaleDateString(),
    };

    const newStats = { ...user.stats };
    if (activeTool === "chat") newStats.chatCount += 1;
    else if (activeTool === "summarizer") newStats.summariesCount += 1;
    else if (activeTool === "code") newStats.codeCount += 1;
    else if (activeTool === "resume") newStats.resumesCount += 1;
    else if (activeTool === "recommend") newStats.recommendationsCount += 1;
    else if (activeTool === "interview") newStats.interviewsCount += 1;

    setUser({
      ...user,
      xp: newXP,
      level: newLevel,
      badges: updatedBadges,
      stats: newStats,
      recentActivities: [newActivity, ...user.recentActivities],
    });
  };

  // --- TOOL 1: CHAT ASSISTANT STATE ---
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your AlphaThink Companion. How can I assist you with your learning, coding, or research today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatSystemInstruction, setChatSystemInstruction] = useState("You are AlphaThink AI, a helpful coaching assistant optimized for students, developers, and academic researchers.");
  const [chatLoading, setChatLoading] = useState(false);
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [voiceOutputActive, setVoiceOutputActive] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Voice Assistant: Text to Speech (TTS)
  const speakText = (text: string) => {
    if (!voiceOutputActive || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    // Find a nice natural English voice if possible
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural"));
    if (premiumVoice) utterance.voice = premiumVoice;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Assistant: Speech to Text (STT)
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setChatInput(prev => prev + " " + text);
        setVoiceInputActive(false);
      };

      rec.onerror = () => {
        setVoiceInputActive(false);
      };

      rec.onend = () => {
        setVoiceInputActive(false);
      };

      setRecognitionInstance(rec);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionInstance) {
      alert("Speech recognition is not fully supported in this browser window.");
      return;
    }
    if (voiceInputActive) {
      recognitionInstance.stop();
      setVoiceInputActive(false);
    } else {
      setVoiceInputActive(true);
      recognitionInstance.start();
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          systemInstruction: chatSystemInstruction,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const assistantMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, assistantMsg]);
        speakText(data.text);
        
        // Reward gamification XP
        addXP(10, "Interacted with AlphaThink AI Chatbot", "first_prompt");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `Oops! I couldn't reach the backend. Error: ${err.message || "Unknown error."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- TOOL 2: TEXT SUMMARIZER STATE ---
  const [summarizerText, setSummarizerText] = useState("");
  const [summarizerFormat, setSummarizerFormat] = useState("Bullet Points");
  const [summarizerLength, setSummarizerLength] = useState("Medium");
  const [summarizerResult, setSummarizerResult] = useState("");
  const [summarizerLoading, setSummarizerLoading] = useState(false);

  const handleSummarizerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summarizerText.trim()) return;

    setSummarizerLoading(true);
    setSummarizerResult("");

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: summarizerText,
          format: summarizerFormat,
          targetLength: summarizerLength,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummarizerResult(data.summary);
        addXP(15, "Summarized a research reference text", "summary_expert");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setSummarizerResult(`Error: ${err.message || "Failed to summarize text."}`);
    } finally {
      setSummarizerLoading(false);
    }
  };

  // --- TOOL 3: CODING ASSISTANT STATE ---
  const [codePrompt, setCodePrompt] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("TypeScript");
  const [codeContext, setCodeContext] = useState("");
  const [codeResult, setCodeResult] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codePrompt.trim()) return;

    setCodeLoading(true);
    setCodeResult("");

    try {
      const response = await fetch("/api/gemini/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: codePrompt,
          language: codeLanguage,
          context: codeContext,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCodeResult(data.result);
        addXP(20, "Generated code structure using AI Sandbox", "code_master");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setCodeResult(`Error: ${err.message || "Failed to generate code."}`);
    } finally {
      setCodeLoading(false);
    }
  };

  // --- TOOL 4: RESUME ATS SCORER STATE ---
  const [resumeText, setResumeText] = useState("");
  const [resumeTargetRole, setResumeTargetRole] = useState("");
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setResumeLoading(true);
    setResumeResult(null);

    try {
      const response = await fetch("/api/gemini/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole: resumeTargetRole,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResumeResult(data);
        addXP(35, "Completed CV ATS compatibility check");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "Failed to analyze resume."}`);
    } finally {
      setResumeLoading(false);
    }
  };

  // --- TOOL 5: INTERVIEW PREPARATION STATE ---
  const [interviewRole, setInterviewRole] = useState("Full Stack Developer");
  const [interviewStage, setInterviewStage] = useState("Mid-level");
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [interviewAnswerInput, setInterviewAnswerInput] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  const startInterview = async () => {
    setInterviewLoading(true);
    setInterviewActive(true);
    setInterviewHistory([]);

    try {
      const response = await fetch("/api/gemini/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interviewRole,
          stage: interviewStage,
          answerHistory: [],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setInterviewHistory([{ role: "interviewer", content: data.response }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setInterviewActive(false);
      alert(`Error starting mock interview: ${err.message}`);
    } finally {
      setInterviewLoading(false);
    }
  };

  const submitInterviewAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewAnswerInput.trim() || interviewLoading) return;

    const userAns = { role: "candidate", content: interviewAnswerInput };
    const updatedHistory = [...interviewHistory, userAns];
    
    setInterviewHistory(updatedHistory);
    setInterviewAnswerInput("");
    setInterviewLoading(true);

    try {
      const response = await fetch("/api/gemini/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interviewRole,
          stage: interviewStage,
          answerHistory: updatedHistory,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setInterviewHistory(prev => [...prev, { role: "interviewer", content: data.response }]);
        addXP(25, "Submitted verbal mock interview response", "interview_ready");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(`Error submitting answer: ${err.message}`);
    } finally {
      setInterviewLoading(false);
    }
  };

  // --- TOOL 6: ROADMAP & PROJECTS GENERATOR STATE ---
  const [recommendSkills, setRecommendSkills] = useState("");
  const [recommendInterests, setRecommendInterests] = useState("");
  const [recommendGoal, setRecommendGoal] = useState("");
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendPath, setRecommendPath] = useState<LearningPhase[] | null>(null);
  const [recommendProjects, setRecommendProjects] = useState<RecommendedProject[] | null>(null);
  const [recommendAdvice, setRecommendAdvice] = useState<string[] | null>(null);

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendSkills.trim() || !recommendInterests.trim()) return;

    setRecommendLoading(true);
    setRecommendPath(null);
    setRecommendProjects(null);
    setRecommendAdvice(null);

    try {
      const response = await fetch("/api/gemini/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: recommendSkills,
          interests: recommendInterests,
          careerGoal: recommendGoal,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendPath(data.learningPath);
        setRecommendProjects(data.projects);
        setRecommendAdvice(data.careerAdvice);
        addXP(30, "Generated personalized AI learning roadmap");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(`Error generating recommendations: ${err.message}`);
    } finally {
      setRecommendLoading(false);
    }
  };

  const handleSaveRecommendedProject = (proj: RecommendedProject) => {
    // Check if already saved
    if (user.savedProjects.some((p) => p.title === proj.title)) {
      alert("This project is already saved to your Dashboard!");
      return;
    }

    const saved: SavedProject = {
      id: `proj-${Date.now()}`,
      title: proj.title,
      description: proj.description,
      difficulty: (proj.difficulty as any) || "Intermediate",
      techStack: proj.techStack,
      dateSaved: new Date().toLocaleDateString(),
    };

    const updatedProjects = [...user.savedProjects, saved];
    const updatedActivities = [
      {
        id: `act-${Date.now()}`,
        type: "save",
        description: `Bookmarked project: ${proj.title}`,
        date: new Date().toLocaleDateString(),
      },
      ...user.recentActivities,
    ];

    setUser({
      ...user,
      savedProjects: updatedProjects,
      recentActivities: updatedActivities,
    });

    alert(`Saved project "${proj.title}" directly to your Dashboard board!`);
  };

  return (
    <div className="relative min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/10 dark:border-slate-800">
          <div>
            <h1 className="font-display text-3xl font-bold">AlphaThink AI Suite</h1>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"} mt-1`}>
              Interact with state-of-the-art models designed to summarize research, review portfolios, generate code, and conduct interviews.
            </p>
          </div>
          
          {/* Quick Stats widget */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 shrink-0 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="h-9 w-9 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className={`block text-[10px] uppercase font-bold text-slate-400`}>Level {user.level}</span>
              <span className="font-mono text-sm font-bold text-teal-400">{user.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-thin">
          <button
            onClick={() => setActiveTool("chat")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTool === "chat"
                ? "bg-gradient-to-r from-brand-primary to-indigo-700 text-white shadow-lg"
                : darkMode
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> AI Chat Assistant
          </button>
          <button
            onClick={() => setActiveTool("summarizer")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTool === "summarizer"
                ? "bg-gradient-to-r from-brand-primary to-indigo-700 text-white shadow-lg"
                : darkMode
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            }`}
          >
            <FileText className="h-4 w-4" /> Text Summarizer
          </button>
          <button
            onClick={() => setActiveTool("code")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTool === "code"
                ? "bg-gradient-to-r from-brand-primary to-indigo-700 text-white shadow-lg"
                : darkMode
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            }`}
          >
            <Code className="h-4 w-4" /> Coding Assistant
          </button>
          <button
            onClick={() => setActiveTool("resume")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTool === "resume"
                ? "bg-gradient-to-r from-brand-primary to-indigo-700 text-white shadow-lg"
                : darkMode
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            }`}
          >
            <Award className="h-4 w-4" /> Resume Scorer
          </button>
          <button
            onClick={() => setActiveTool("interview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTool === "interview"
                ? "bg-gradient-to-r from-brand-primary to-indigo-700 text-white shadow-lg"
                : darkMode
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            }`}
          >
            <HelpCircle className="h-4 w-4" /> Mock Interview
          </button>
          <button
            onClick={() => setActiveTool("recommend")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTool === "recommend"
                ? "bg-gradient-to-r from-brand-primary to-indigo-700 text-white shadow-lg"
                : darkMode
                  ? "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            }`}
          >
            <Compass className="h-4 w-4" /> Curriculum & Project Gen
          </button>
        </div>

        {/* Content Box */}
        <div className={`rounded-2xl border p-4 sm:p-6 min-h-[500px] ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        }`}>

          {/* -------------------- TOOL 1: CHAT ASSISTANT WORKFLOW -------------------- */}
          {activeTool === "chat" && (
            <div className="space-y-6">
              
              {/* Top Configuration Area */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-secondary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Configure System Prompt</h3>
                </div>
                <input
                  type="text"
                  value={chatSystemInstruction}
                  onChange={(e) => setChatSystemInstruction(e.target.value)}
                  placeholder="e.g. 'You are an expert compiler engineer, answer questions strictly with TS examples.'"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 text-white focus:border-brand-primary"
                      : "bg-white border-slate-200 text-slate-800 focus:border-brand-primary"
                  }`}
                />
              </div>

              {/* Chat Thread */}
              <div className={`h-[350px] overflow-y-auto border rounded-xl p-4 space-y-4 ${
                darkMode ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-2xl ${
                      msg.role === "user" ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full border shrink-0 flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-brand-primary border-brand-primary/20 text-white"
                        : "bg-slate-800 border-slate-700 text-brand-secondary"
                    }`}>
                      <User className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-brand-primary text-white rounded-tr-none"
                          : darkMode
                            ? "bg-slate-900 border border-slate-850 text-slate-100 rounded-tl-none"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <span className="block text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-3 max-w-[150px] mr-auto">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-secondary">
                      <User className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <div className={`px-4 py-2.5 rounded-2xl text-xs bg-slate-900 border border-slate-850 text-slate-100 rounded-tl-none`}>
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 bg-brand-secondary rounded-full animate-bounce"></span>
                          <span className="h-1.5 w-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="h-1.5 w-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Send bar with Voice Synthesis / STT controls */}
              <form onSubmit={handleChatSend} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question or use the microphone..."
                  disabled={chatLoading}
                  className={`flex-1 px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 text-white focus:border-brand-primary"
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-primary"
                  }`}
                />

                {/* Voice Input (Speech to Text) */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    voiceInputActive
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                      : darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-950"
                  }`}
                  title="Toggle Microphone Input"
                >
                  {voiceInputActive ? <MicOff className="h-4 sm:h-5 w-4 sm:w-5 animate-pulse" /> : <Mic className="h-4 sm:h-5 w-4 sm:w-5" />}
                </button>

                {/* Voice Read aloud (Text to Speech) toggle */}
                <button
                  type="button"
                  onClick={() => setVoiceOutputActive(!voiceOutputActive)}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    voiceOutputActive
                      ? "bg-teal-500/15 border-teal-500/30 text-teal-400"
                      : darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-950"
                  }`}
                  title="Toggle Narration Reader"
                >
                  {voiceOutputActive ? <Volume2 className="h-4 sm:h-5 w-4 sm:w-5" /> : <VolumeX className="h-4 sm:h-5 w-4 sm:w-5" />}
                </button>

                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-5 bg-gradient-to-r from-brand-primary to-indigo-700 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:opacity-95 cursor-pointer shadow-md shadow-indigo-500/10"
                >
                  Send <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          )}

          {/* -------------------- TOOL 2: TEXT SUMMARIZER WORKFLOW -------------------- */}
          {activeTool === "summarizer" && (
            <div className="space-y-6">
              <form onSubmit={handleSummarizerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Source Reference Text</label>
                  <textarea
                    rows={6}
                    value={summarizerText}
                    onChange={(e) => setSummarizerText(e.target.value)}
                    placeholder="Paste textbook details, academic abstracts, meeting minutes, or report lines here..."
                    className={`w-full p-4 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                      darkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-brand-primary"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-primary"
                    }`}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Summary Format</label>
                    <select
                      value={summarizerFormat}
                      onChange={(e) => setSummarizerFormat(e.target.value)}
                      className={`w-full p-2 text-xs rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="Bullet Points">Key Bullet Points Only</option>
                      <option value="Structured Paragraph">Cohesive Structured Paragraph</option>
                      <option value="TL;DR & Actions">TL;DR with Core Action items</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Summary Length</label>
                    <select
                      value={summarizerLength}
                      onChange={(e) => setSummarizerLength(e.target.value)}
                      className={`w-full p-2 text-xs rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="Short">Short & Snappy (~100 words)</option>
                      <option value="Medium">Medium & Informative (~250 words)</option>
                      <option value="Comprehensive">Comprehensive Outline (~400 words)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={summarizerLoading || !summarizerText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer hover:opacity-95 transition-all shadow-md"
                >
                  {summarizerLoading ? "Extracting insights..." : "Extract Cohesive Summary"}
                </button>
              </form>

              {/* Summarizer Result Box */}
              {summarizerResult && (
                <div className={`p-5 rounded-xl border space-y-3 transition-all ${
                  darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-2 border-b border-slate-800/10 pb-2">
                    <Sparkles className="h-4.5 w-4.5 text-brand-secondary" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Summarization Result</span>
                  </div>
                  <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {summarizerResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------- TOOL 3: CODING ASSISTANT WORKFLOW -------------------- */}
          {activeTool === "code" && (
            <div className="space-y-6">
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-semibold">Request/Task</label>
                    <input
                      type="text"
                      value={codePrompt}
                      onChange={(e) => setCodePrompt(e.target.value)}
                      placeholder="e.g. 'Build a recursive binary search with test cases...'"
                      className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Target Language</label>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="TypeScript">TypeScript</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                      <option value="Rust">Rust</option>
                      <option value="Go">Go</option>
                      <option value="SQL">SQL</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">Optional Context/Error logs</label>
                  <textarea
                    rows={4}
                    value={codeContext}
                    onChange={(e) => setCodeContext(e.target.value)}
                    placeholder="Paste console error outputs, current configurations, or variable structures..."
                    className={`w-full p-3 text-xs sm:text-sm rounded-lg border outline-none ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={codeLoading || !codePrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer hover:opacity-95 transition-all shadow-md"
                >
                  {codeLoading ? "Synthesizing code blocks..." : "Generate Safe Implementation"}
                </button>
              </form>

              {/* Code Result Box */}
              {codeResult && (
                <div className={`p-5 rounded-xl border space-y-3 transition-all ${
                  darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-2 border-b border-slate-800/10 pb-2">
                    <Code className="h-4.5 w-4.5 text-brand-secondary" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Coding Result</span>
                  </div>
                  <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 rounded-xl ${
                    darkMode ? "bg-slate-950 text-emerald-400" : "bg-white text-slate-850"
                  }`}>
                    {codeResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------- TOOL 4: RESUME ATS SCORER WORKFLOW -------------------- */}
          {activeTool === "resume" && (
            <div className="space-y-6">
              <form onSubmit={handleResumeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Resume / CV Raw Text</label>
                  <textarea
                    rows={5}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the raw text of your resume or CV (Skills, Experience, Projects, Education) here..."
                    className={`w-full p-4 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
                      darkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-brand-primary"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-primary"
                    }`}
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">Target Job Role</label>
                  <input
                    type="text"
                    value={resumeTargetRole}
                    onChange={(e) => setResumeTargetRole(e.target.value)}
                    placeholder="e.g. 'Frontend Engineer', 'Machine Learning Research Intern'"
                    className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={resumeLoading || !resumeText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer hover:opacity-95 transition-all shadow-md"
                >
                  {resumeLoading ? "Scoring resume and mapping keywords..." : "Run ATS Comparison Scan"}
                </button>
              </form>

              {/* Resume Scorer Results layout */}
              {resumeResult && (
                <div className="space-y-6 border-t border-slate-800/10 dark:border-slate-800 pt-6">
                  
                  {/* Circle Score & feedback */}
                  <div className={`p-6 rounded-xl border flex flex-col md:flex-row items-center gap-6 ${
                    darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"
                  }`}>
                    
                    {/* SVG Radial Progress */}
                    <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" fill="transparent" stroke={darkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="10" />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          fill="transparent"
                          stroke="#14B8A6"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={2 * Math.PI * 48 * (1 - resumeResult.atsScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute font-mono font-extrabold text-2xl text-teal-400">{resumeResult.atsScore}%</span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <h4 className="font-display font-bold text-lg">ATS Scorer Assessment</h4>
                      <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {resumeResult.feedback}
                      </p>
                    </div>

                  </div>

                  {/* Strengths & Improvements grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Strengths */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Key Strengths Found</h4>
                      <ul className="space-y-2">
                        {resumeResult.strengths?.map((str: string, i: number) => (
                          <li key={i} className="flex gap-2 text-xs">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Actionable Improvements</h4>
                      <ul className="space-y-2">
                        {resumeResult.improvements?.map((imp: string, i: number) => (
                          <li key={i} className="flex gap-2 text-xs">
                            <span className="text-rose-400 mt-0.5">✗</span>
                            <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Keywords analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/10 dark:border-slate-800/50">
                    
                    {/* Matched Keywords */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Keywords Matched</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {resumeResult.keywordsMatched?.map((key: string, i: number) => (
                          <span key={i} className="text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Recommended Keywords to Add</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {resumeResult.keywordsMissing?.map((key: string, i: number) => (
                          <span key={i} className="text-[10px] font-semibold bg-amber-500/15 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full">
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* -------------------- TOOL 5: MOCK INTERVIEW WORKFLOW -------------------- */}
          {activeTool === "interview" && (
            <div className="space-y-6">
              
              {!interviewActive ? (
                <div className="space-y-6 max-w-xl mx-auto py-6">
                  <div className="text-center space-y-2">
                    <Trophy className="h-10 w-10 text-amber-400 mx-auto animate-bounce" />
                    <h3 className="font-display font-bold text-xl">Interactive Corporate Interview Room</h3>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Select your target role and stage level. Step inside to answer technical and behavioral questions from elite company templates. Get scores and feedback.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold">Target Job Role</label>
                        <select
                          value={interviewRole}
                          onChange={(e) => setInterviewRole(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                            darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Machine Learning Specialist">Machine Learning Specialist</option>
                          <option value="Product Manager">Product Manager</option>
                          <option value="Data Scientist">Data Scientist</option>
                          <option value="Systems Engineer">Systems Engineer</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold">Experience Level</label>
                        <select
                          value={interviewStage}
                          onChange={(e) => setInterviewStage(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                            darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <option value="Associate / Graduate">Associate / Graduate</option>
                          <option value="Mid-level">Mid-level (3-5 yrs exp)</option>
                          <option value="Senior Lead">Senior Lead (6+ yrs exp)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={startInterview}
                      className="w-full py-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg hover:opacity-95 transition-all"
                    >
                      Step into the Interview Room
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-brand-primary/10 border border-brand-primary/20 p-3 rounded-xl">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Mock Interviewing for:</span>
                      <p className="text-xs font-bold text-white">{interviewRole} ({interviewStage})</p>
                    </div>
                    <button
                      onClick={() => setInterviewActive(false)}
                      className="text-xs border border-rose-500/30 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-rose-500/25 transition-all cursor-pointer"
                    >
                      Exit Room
                    </button>
                  </div>

                  {/* Interview Chat Log */}
                  <div className={`h-[350px] overflow-y-auto border rounded-xl p-4 space-y-4 ${
                    darkMode ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    {interviewHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 max-w-2xl ${
                          item.role === "candidate" ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-full border shrink-0 flex items-center justify-center ${
                          item.role === "candidate"
                            ? "bg-brand-primary border-brand-primary/20 text-white"
                            : "bg-slate-800 border-slate-700 text-amber-400"
                        }`}>
                          <User className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            item.role === "candidate"
                              ? "bg-brand-primary text-white rounded-tr-none"
                              : darkMode
                                ? "bg-slate-900 border border-slate-850 text-slate-100 rounded-tl-none"
                                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                          }`}>
                            <p className="whitespace-pre-wrap">{item.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {interviewLoading && (
                      <div className="flex gap-3 max-w-[150px] mr-auto">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-secondary">
                          <User className="h-4 w-4 animate-spin" />
                        </div>
                        <div className="space-y-1">
                          <div className="px-4 py-2.5 rounded-2xl text-xs bg-slate-900 border border-slate-850 text-slate-100 rounded-tl-none">
                            <div className="flex gap-1">
                              <span className="h-1.5 w-1.5 bg-brand-secondary rounded-full animate-bounce"></span>
                              <span className="h-1.5 w-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                              <span className="h-1.5 w-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission box */}
                  <form onSubmit={submitInterviewAnswer} className="flex gap-2">
                    <input
                      type="text"
                      value={interviewAnswerInput}
                      onChange={(e) => setInterviewAnswerInput(e.target.value)}
                      placeholder="Type your response to the interviewer..."
                      disabled={interviewLoading}
                      className={`flex-1 px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                        darkMode
                          ? "bg-slate-950 border-slate-800 text-white focus:border-brand-primary"
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-primary"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={interviewLoading || !interviewAnswerInput.trim()}
                      className="px-6 bg-gradient-to-r from-brand-primary to-indigo-700 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:opacity-95 cursor-pointer shadow-md"
                    >
                      Submit Answer <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* -------------------- TOOL 6: ROADMAP & PROJECTS GENERATOR WORKFLOW -------------------- */}
          {activeTool === "recommend" && (
            <div className="space-y-6">
              
              <form onSubmit={handleRecommendSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Your Current Skills</label>
                    <input
                      type="text"
                      value={recommendSkills}
                      onChange={(e) => setRecommendSkills(e.target.value)}
                      placeholder="e.g. 'JavaScript, Basic SQL, CSS'"
                      className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Interests & Topics</label>
                    <input
                      type="text"
                      value={recommendInterests}
                      onChange={(e) => setRecommendInterests(e.target.value)}
                      placeholder="e.g. 'Robotics, NLP, Web Development'"
                      className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">Aspirational Career Goal</label>
                  <input
                    type="text"
                    value={recommendGoal}
                    onChange={(e) => setRecommendGoal(e.target.value)}
                    placeholder="e.g. 'Senior AI & DS Platform Engineer'"
                    className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={recommendLoading || !recommendSkills.trim() || !recommendInterests.trim()}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer hover:opacity-95 transition-all shadow-md"
                >
                  {recommendLoading ? "Architecting roadmap and project ideas..." : "Construct Personalized Learning Space"}
                </button>
              </form>

              {/* Recommendations output */}
              {(recommendPath || recommendProjects) && (
                <div className="space-y-8 border-t border-slate-800/10 dark:border-slate-800 pt-6">
                  
                  {/* Part A: Study Roadmap Timeline */}
                  {recommendPath && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-lg text-teal-400">Your Tailored Study Roadmap</h4>
                      <div className="relative pl-4 border-l-2 border-brand-primary/30 space-y-6">
                        {recommendPath.map((phase, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute left-[-21px] top-1.5 h-3 w-3 rounded-full bg-brand-primary border border-white dark:border-slate-950"></span>
                            <span className="block text-[10px] font-mono text-brand-secondary font-bold uppercase">{phase.duration}</span>
                            <h5 className="font-display font-semibold text-sm text-white">{phase.phase}: {phase.topic}</h5>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {phase.resources?.map((res, rIdx) => (
                                <span key={rIdx} className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Part B: Recommended Projects list */}
                  {recommendProjects && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-lg text-teal-400">Hands-on Sandbox Project Recommendations</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendProjects.map((proj, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                              darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-secondary border border-brand-primary/20">
                                  {proj.difficulty}
                                </span>
                                <button
                                  onClick={() => handleSaveRecommendedProject(proj)}
                                  className="text-[10px] flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold"
                                >
                                  <Bookmark className="h-3 w-3" /> Save to Board
                                </button>
                              </div>
                              <h5 className="font-display font-bold text-sm text-white mb-1">{proj.title}</h5>
                              <p className={`text-xs line-clamp-3 leading-relaxed mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                                {proj.description}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-800/10 dark:border-slate-800/50">
                              {proj.techStack?.map((tech, tIdx) => (
                                <span key={tIdx} className="text-[9px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Part C: Strategic advice */}
                  {recommendAdvice && (
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-lg text-teal-400 font-display">General Career Guidance Advice</h4>
                      <ul className="space-y-2">
                        {recommendAdvice.map((adv, idx) => (
                          <li key={idx} className="flex gap-2 text-xs">
                            <span className="text-teal-400 mt-0.5">✓</span>
                            <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
