import React from "react";
import { MessageSquare, Compass, Award, FileText, Code2, Briefcase, Sparkles, ArrowRight, Star } from "lucide-react";
import { AIToolId } from "../types";

interface FeaturesHubProps {
  darkMode: boolean;
  setCurrentTab: (tab: string) => void;
  setActiveTool: (tool: AIToolId) => void;
}

export default function FeaturesHub({ darkMode, setCurrentTab, setActiveTool }: FeaturesHubProps) {
  
  const features = [
    {
      id: "chat" as AIToolId,
      icon: <MessageSquare className="h-6 w-6 text-indigo-400" />,
      title: "AI Chat Assistant",
      tag: "Conversational Core",
      xpReward: "+15 XP",
      description: "Engage in multi-turn conversations with a highly specialized assistant. Perfect for general inquiries, theory proofreading, and conceptual breakdowns.",
      bullets: [
        "Interactive Q&A regarding engineering and tech",
        "Supports dynamic custom system instructions",
        "Full speech voice capabilities (SST & TTS)"
      ],
      color: "from-indigo-500/20 to-indigo-500/5",
      borderColor: "border-indigo-500/30"
    },
    {
      id: "recommend" as AIToolId,
      icon: <Compass className="h-6 w-6 text-emerald-400" />,
      title: "Personalized Learning Maps",
      tag: "Interactive Curriculum",
      xpReward: "+30 XP",
      description: "Generates custom step-by-step curricula, timelines, and study material suggestions based on your input skills and interests.",
      bullets: [
        "Structured learning phases with duration metrics",
        "Tailored web links and documentation lists",
        "Exportable study plans saved to your Profile"
      ],
      color: "from-emerald-500/20 to-emerald-500/5",
      borderColor: "border-emerald-500/30"
    },
    {
      id: "recommend" as AIToolId, // Linked to the recommend engine layout
      icon: <Star className="h-6 w-6 text-amber-400" />,
      title: "Project Recommendations",
      tag: "Hands-on Creator",
      xpReward: "+25 XP",
      description: "Generates highly contextual project ideas including complete difficulty indicators, complete tech stacks, and step-by-step requirements.",
      bullets: [
        "Custom bento-box difficulty classification",
        "Detailed framework and library recommendations",
        "Allows direct saving to your 'Saved Projects' board"
      ],
      color: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-amber-500/30"
    },
    {
      id: "resume" as AIToolId,
      icon: <FileText className="h-6 w-6 text-rose-400" />,
      title: "Resume ATS Analyzer",
      tag: "Career Optimization",
      xpReward: "+40 XP",
      description: "Grades resume text against standard Applicant Tracking Systems. Outlines crucial industry keywords, matches, missing variables, and suitable roles.",
      bullets: [
        "Generates direct numerical ATS scores (0-100)",
        "Outlines missing technical keywords for target roles",
        "Lists direct structural resume recommendations"
      ],
      color: "from-rose-500/20 to-rose-500/5",
      borderColor: "border-rose-500/30"
    },
    {
      id: "code" as AIToolId,
      icon: <Code2 className="h-6 w-6 text-cyan-400" />,
      title: "Intelligent Coding Assistant",
      tag: "Developer Productivity",
      xpReward: "+20 XP",
      description: "An advanced coding terminal designed to generate fully-documented snippets, debug circular dependency errors, and optimize existing scripts.",
      bullets: [
        "Generates clean, production-ready code blocks",
        "Includes inline comments explaining optimizations",
        "Supports over 15 programming languages"
      ],
      color: "from-cyan-500/20 to-cyan-500/5",
      borderColor: "border-cyan-500/30"
    },
    {
      id: "interview" as AIToolId,
      icon: <Briefcase className="h-6 w-6 text-purple-400" />,
      title: "Career & Interview Guidance",
      tag: "Professional Preparation",
      xpReward: "+50 XP",
      description: "Step into an elite corporate interview room. Test your verbal/behavioral responses, and get scores and progressive follow-ups.",
      bullets: [
        "Realistic corporate behavioral & tech questions",
        "Constructive score metrics (out of 10) for answers",
        "Prepares for senior, mid, and associate-level roles"
      ],
      color: "from-purple-500/20 to-purple-500/5",
      borderColor: "border-purple-500/30"
    },
  ];

  const handleLaunch = (id: AIToolId) => {
    setActiveTool(id);
    setCurrentTab("tools");
  };

  return (
    <div className="relative min-h-screen py-16">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brand-secondary/10 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-indigo-500/10 text-brand-secondary border border-indigo-500/20 mb-4 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Capabilities Overview
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Powerful AI Workflows at Your Fingertips
          </h1>
          <p className={`text-base sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Our platform splits complicated tasks into focused, lightning-fast micro-tools. Gain XP as you learn, create projects, and prepare for your next career stage.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${f.borderColor} ${
                darkMode ? "glass-panel text-white shadow-xl shadow-slate-950/20 hover:border-brand-primary/45" : "text-slate-800 bg-white border border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl border border-slate-500/10 ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                    {f.icon}
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{f.tag}</span>
                    <span className="inline-block text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full mt-1">{f.xpReward}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
                <p className={`text-xs leading-relaxed mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {f.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mb-6">
                  {f.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs">
                      <span className="mt-0.5 text-brand-secondary">✓</span>
                      <span className={darkMode ? "text-slate-400" : "text-slate-600"}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLaunch(f.id)}
                className="w-full py-2.5 bg-gradient-to-r from-brand-primary to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-95 cursor-pointer shadow-md group"
              >
                Launch Tool
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
