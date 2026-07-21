import React from "react";
import { Award, Compass, Heart, Users, Target, Calendar } from "lucide-react";

interface AboutProps {
  darkMode: boolean;
}

export default function About({ darkMode }: AboutProps) {
  const team = [
    {
      name: "Dr. Aisha Patel",
      role: "Founder & Chief AI Scientist",
      bio: "Former Principal Researcher at DeepMind, specializing in reinforcement learning and cognitive tutors.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop",
    },
    {
      name: "Dimitri Volkov",
      role: "Lead Platform Engineer",
      bio: "Distributed systems specialist, former tech lead at Vercel. Obsessed with low-latency LLM interfaces.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
    },
    {
      name: "Sarah Jenkins",
      role: "Lead UI/UX Architect",
      bio: "Crafts accessible, dark-themed developer visual spaces. Built interfaces for multiple unicorn platforms.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop",
    },
  ];

  const timeline = [
    {
      year: "2024",
      title: "Conceptualization",
      description: "AlphaThink founded by academic researchers looking to democratize world-class technical coaching.",
    },
    {
      year: "2025",
      title: "Seed Phase & V1 Launch",
      description: "Released first ATS resume scorer and coding debugger. Reached 50,000 active student users.",
    },
    {
      year: "2026",
      title: "Full-Stack v2.0 Release",
      description: "Re-engineered with Gemini 3.5, introducing voice synthesis, dynamic roadmaps, and gamification.",
    },
  ];

  return (
    <div className="relative min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            A Platform Born at the Intersection of{" "}
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              AI and Ambition
            </span>
          </h1>
          <p className={`text-base sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Our core mission is to provide equal-opportunity access to high-performance learning roadmaps, coding coaches, and job placement helpers.
          </p>
        </div>

        {/* Mission and Vision Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* Mission Card */}
          <div className={`p-8 rounded-2xl border transition-all duration-300 ${
            darkMode ? "glass-panel border-white/10 hover:border-brand-primary/30" : "bg-white border border-slate-200"
          }`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-brand-primary mb-6 border border-indigo-500/20">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">Our Mission</h2>
            <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              We aim to reduce the noise in learning artificial intelligence and engineering topics. By parsing complicated curricula, academic research PDFs, and industry qualifications, AlphaThink designs interactive environments where students learn by doing rather than scrolling.
            </p>
          </div>

          {/* Vision Card */}
          <div className={`p-8 rounded-2xl border transition-all duration-300 ${
            darkMode ? "glass-panel border-white/10 hover:border-brand-secondary/30" : "bg-white border border-slate-200"
          }`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-brand-secondary mb-6 border border-cyan-500/20">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">Our Vision</h2>
            <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Our vision is a future where every aspiring developer, regardless of geography or background, possesses an elite virtual tutor. An intelligent, contextual assistant that answers code errors, points out resume deficiencies, and generates customized step-by-step career path structures.
            </p>
          </div>

        </div>

        {/* Timeline Section */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
              Company Journey
            </h2>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              How AlphaThink evolved from an academic script into a worldwide full-stack tutoring engine.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative pl-6 sm:pl-0">
            {/* Center line */}
            <div className="absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800/20 dark:bg-slate-800"></div>

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={idx} className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                  idx % 2 === 0 ? "sm:flex-row-reverse" : ""
                }`}>
                  {/* Point */}
                  <div className="absolute left-[-2.5px] sm:left-1/2 sm:translate-x-[-10px] h-5 w-5 rounded-full border-4 bg-brand-primary border-white dark:border-slate-950 shadow z-10"></div>

                  {/* Content block */}
                  <div className="w-full sm:w-1/2 px-0 sm:px-8 text-left sm:text-right">
                    <div className={`inline-block ${idx % 2 === 0 ? "sm:text-left" : "sm:text-right"}`}>
                      <div className="flex items-center gap-2 mb-1 justify-start sm:justify-end">
                        <Calendar className="h-4 w-4 text-brand-secondary" />
                        <span className="font-mono font-bold text-brand-secondary text-lg">{item.year}</span>
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-1">{item.title}</h3>
                      <p className={`text-sm leading-relaxed max-w-md ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Dummy side to keep layout balanced */}
                  <div className="hidden sm:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
              The Thinkers Behind AlphaThink
            </h2>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Meet our world-class team of interface designers, AI researchers, and engineering mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${
                darkMode ? "glass-panel border-white/10 hover:border-brand-primary/30" : "bg-white border border-slate-200 shadow-sm"
              }`}>
                <div className="h-24 w-24 rounded-full overflow-hidden mb-6 border-2 border-brand-primary/30 shadow-md">
                  <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{m.name}</h3>
                <p className="text-xs text-brand-secondary font-semibold uppercase tracking-wider mb-3">{m.role}</p>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
