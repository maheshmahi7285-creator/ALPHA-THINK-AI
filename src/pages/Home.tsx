import React, { useState } from "react";
import { Sparkles, ArrowRight, Brain, Terminal, FileText, Compass, ArrowUpRight, CheckCircle2, Star, Quote } from "lucide-react";

interface HomeProps {
  darkMode: boolean;
  setCurrentTab: (tab: string) => void;
  language: string;
}

export default function Home({ darkMode, setCurrentTab, language }: HomeProps) {
  // Mini AI Demo State
  const [demoPrompt, setDemoPrompt] = useState("");
  const [demoResponse, setDemoResponse] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoPrompt.trim()) return;

    setDemoLoading(true);
    setDemoResponse("");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: `You are in a demo box on our landing page. Answer this very concisely (under 2 sentences) in a highly smart/inspiring tone: "${demoPrompt}"` }],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setDemoResponse(data.text);
      } else {
        setDemoResponse(`Error: ${data.error || "Failed to contact Gemini."}`);
      }
    } catch (err: any) {
      setDemoResponse("Error: Could not reach the server. Make sure your server is running.");
    } finally {
      setDemoLoading(false);
    }
  };

  const featureCards = [
    {
      icon: <Brain className="h-6 w-6 text-brand-secondary" />,
      title: "Interactive AI Chatbot",
      description: "Chat with an advanced model optimized for engineering, humanities, and software engineering questions.",
      tabId: "tools",
    },
    {
      icon: <Compass className="h-6 w-6 text-emerald-400" />,
      title: "Personalized Learning Maps",
      description: "Input your skill set and aspirations to auto-generate custom, step-by-step educational paths.",
      tabId: "tools",
    },
    {
      icon: <Terminal className="h-6 w-6 text-brand-primary" />,
      title: "Intelligent Coding Sandbox",
      description: "Prompt the system to generate, document, optimize, or debug sophisticated scripts and configurations.",
      tabId: "tools",
    },
    {
      icon: <FileText className="h-6 w-6 text-amber-400" />,
      title: "Smart Resume ATS Analyzer",
      description: "Submit resume text and target roles for deep grading, missing keyword diagnostics, and score optimization.",
      tabId: "tools",
    },
  ];

  const translations: Record<string, { title: string; subtitle: string; tagline: string; startBtn: string; demoPlaceholder: string; demoBtn: string }> = {
    en: {
      title: "Learn, Innovate, Solve",
      subtitle: "Unleash your cognitive potential with tailored artificial intelligence assistance designed for students, developers, and researchers.",
      tagline: "Think Beyond Limits",
      startBtn: "Launch AlphaThink Tools",
      demoPlaceholder: "Ask anything... (e.g. 'Explain Quantum Computing like I'm 10')",
      demoBtn: "Ask Gemini",
    },
    es: {
      title: "Aprende, Innova, Resuelve",
      subtitle: "Desata tu potencial cognitivo con asistencia de inteligencia artificial personalizada y diseñada para estudiantes, desarrolladores e investigadores.",
      tagline: "Piensa más allá de los límites",
      startBtn: "Iniciar herramientas",
      demoPlaceholder: "Pregunta lo que sea... (ej. 'Explica Computación Cuántica')",
      demoBtn: "Preguntar a Gemini",
    },
    fr: {
      title: "Apprendre, Innover, Résoudre",
      subtitle: "Libérez votre potentiel cognitif grâce à une assistance d'intelligence artificielle sur mesure pour étudiants, développeurs et chercheurs.",
      tagline: "Penser au-delà des limites",
      startBtn: "Lancer les outils",
      demoPlaceholder: "Posez votre question... (ex. 'Explique l'informatique quantique')",
      demoBtn: "Demander à Gemini",
    },
    de: {
      title: "Lernen, Innovieren, Lösen",
      subtitle: "Setzen Sie Ihr kognitives Potenzial frei mit maßgeschneiderter KI-Unterstützung für Studenten, Entwickler und Forscher.",
      tagline: "Denken über Grenzen hinweg",
      startBtn: "AlphaThink starten",
      demoPlaceholder: "Fragen Sie alles... (z. B. 'Erkläre Quantencomputing')",
      demoBtn: "Gemini fragen",
    },
    ja: {
      title: "学び、革新し、解決する",
      subtitle: "学生、開発者、研究者向けに設計されたカスタムAI支援で、あなたの無限の可能性を解き放ちましょう。",
      tagline: "限界を超えて思考する",
      startBtn: "ツールを起動",
      demoPlaceholder: "何でも聞いてください... (例:「量子コンピュータをわかりやすく説明して」)",
      demoBtn: "Geminiに聞く",
    },
    hi: {
      title: "सीखें, नवाचार करें, समाधान करें",
      subtitle: "छात्रों, डेवलपर्स और शोधकर्ताओं के लिए विशेष रूप से डिज़ाइन की गई कृत्रिम बुद्धिमत्ता सहायता के साथ अपनी संज्ञानात्मक क्षमता को अनलॉक करें।",
      tagline: "सीमाओं से परे सोचें",
      startBtn: "टूल्स लॉन्च करें",
      demoPlaceholder: "कुछ भी पूछें... (जैसे 'क्वांटम कंप्यूटिंग को समझाइए')",
      demoBtn: "Gemini से पूछें",
    },
  };

  const t = translations[language] || translations.en;

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "M.S. Robotics Student at Stanford",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
      quote: "The ATS Resume Matcher helped me tailor my CV for tech-lab applications, and the custom learning roadmap got me up to speed on deep reinforcement learning models in weeks.",
      stars: 5,
    },
    {
      name: "Dr. Elena Vance",
      role: "AI Lead, Quantum Solutions",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
      quote: "AlphaThink's summarizer handles complex arXiv PDF text effortlessly, outputting structured key themes, gaps, and future project suggestions. An absolute necessity for researchers.",
      stars: 5,
    },
    {
      name: "Marcus Chen",
      role: "Full Stack Startup Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
      quote: "The Code sandbox helped me debug structural React 19 hook cycles. Combining code generation with standard interview prep gave me the edge I needed for our latest system rebuild.",
      stars: 5,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Glow Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-indigo-500/10 text-brand-secondary border border-indigo-500/20 mb-8 animate-pulse uppercase">
          <Sparkles className="h-4.5 w-4.5" />
          {t.tagline}
        </div>

        {/* Display Title */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          {t.title} with{" "}
          <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-teal-400 bg-clip-text text-transparent">
            AlphaThink AI
          </span>
        </h1>

        <p className={`text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {t.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setCurrentTab("tools")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 glow-btn transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-500/20 group"
          >
            {t.startBtn}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setCurrentTab("features")}
            className={`w-full sm:w-auto px-8 py-4 font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              darkMode
                ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            Explore Capabilities
          </button>
        </div>

        {/* Live Demo Assistant Panel */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className={`rounded-2xl text-left overflow-hidden shadow-2xl transition-all ${
            darkMode ? "glass-panel border-indigo-500/20 shadow-indigo-950/20" : "bg-white border border-slate-200"
          }`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              darkMode ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                <span className="h-3 w-3 rounded-full bg-teal-400"></span>
                <span className="text-xs text-slate-400 font-mono ml-2">sandbox-shell // alphathink-demo</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-brand-secondary px-2 py-0.5 rounded-full border border-indigo-500/20 font-semibold uppercase">
                <Sparkles className="h-3 w-3" /> Real API
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={demoPrompt}
                    onChange={(e) => setDemoPrompt(e.target.value)}
                    placeholder={t.demoPlaceholder}
                    disabled={demoLoading}
                    className={`w-full px-4 py-3.5 pr-28 text-sm sm:text-base rounded-xl border outline-none transition-all ${
                      darkMode
                        ? "bg-slate-950/80 border-white/10 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={demoLoading || !demoPrompt.trim()}
                    className={`absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer text-white bg-brand-primary hover:bg-indigo-700 transition-all ${
                      (demoLoading || !demoPrompt.trim()) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {demoLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        {t.demoBtn}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Demo Response Block */}
              {(demoResponse || demoLoading) && (
                <div className={`mt-4 p-4 rounded-xl border font-mono text-xs sm:text-sm transition-all leading-relaxed ${
                  darkMode ? "bg-slate-950/80 border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800/10 text-brand-secondary font-semibold">
                    <Sparkles className="h-4 w-4" />
                    <span>Gemini-3.5-Flash Says:</span>
                  </div>
                  {demoLoading ? (
                    <div className="space-y-2 py-1">
                      <div className="h-3 bg-slate-800 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-800 rounded animate-pulse w-1/2"></div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{demoResponse}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section className={`py-20 border-t ${darkMode ? "bg-slate-950/40 border-white/5" : "bg-white border-slate-100"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              AI Tools Customized for Future Innovators
            </h2>
            <p className={`text-base sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              AlphaThink compiles cutting-edge Large Language Capabilities into discrete modular tools optimized for students, developers, and corporate professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureCards.map((card, i) => (
              <div
                key={i}
                onClick={() => setCurrentTab(card.tabId)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
                  darkMode
                    ? "glass-panel border-white/10 hover:border-brand-primary/40 shadow-lg"
                    : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-950 border border-white/5" : "bg-white"} shadow-sm border border-slate-500/10`}>
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-lg font-semibold group-hover:text-brand-secondary transition-colors">
                        {card.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 border-t ${darkMode ? "bg-slate-950/20 border-white/5" : "bg-slate-50 border-slate-200"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
              Empowering Success Worldwide
            </h2>
            <p className={`text-sm sm:text-base ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              See what engineers, students, and technology directors say about learning and developing with AlphaThink.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border relative flex flex-col justify-between transition-all duration-300 ${
                darkMode ? "glass-panel border-white/10 hover:border-brand-primary/30" : "bg-white border-slate-200 text-slate-800"
              }`}>
                <div>
                  <Quote className="h-8 w-8 text-brand-primary/20 mb-4" />
                  <p className={`text-sm italic leading-relaxed mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    "{t.quote}"
                  </p>
                </div>
                <div className={`flex items-center gap-3 border-t pt-4 mt-auto ${darkMode ? "border-white/5" : "border-slate-100"}`}>
                  <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover border border-indigo-500/20" />
                  <div>
                    <h4 className="text-xs font-bold font-display">{t.name}</h4>
                    <p className={`text-[10px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-primary to-indigo-950 text-white p-8 sm:p-16 text-center shadow-2xl">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 z-0"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Accelerate Your Learning Potential?
            </h2>
            <p className="text-sm sm:text-lg text-indigo-100 max-w-xl mx-auto leading-relaxed">
              Unlock personalized roadmap generators, ATS compatibility analyzers, coding tutors, and a gamified system that rewards cognitive development.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setCurrentTab("tools")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:shadow-white/20 transition-all cursor-pointer hover:scale-105"
              >
                Access All AI Tools For Free
                <ArrowRight className="h-5 w-5 text-brand-primary" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
