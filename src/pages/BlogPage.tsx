import React, { useState } from "react";
import { Search, Filter, Calendar, Clock, Heart, MessageSquare, ArrowRight, X, Sparkles, Newspaper, BookOpen, ThumbsUp } from "lucide-react";
import { BlogPost } from "../types";

interface BlogPageProps {
  darkMode: boolean;
}

export default function BlogPage({ darkMode }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  // Initial Articles state
  const [articles, setArticles] = useState<BlogPost[]>([
    {
      id: "1",
      title: "The Emergence of Gemini 3.5: Redefining LLM Efficiency",
      summary: "Explore how Google DeepMind's latest Gemini 3.5 models achieve lightning-fast latencies and powerful multi-modal reasonings at fractional costs.",
      category: "AI News",
      date: "July 20, 2026",
      readTime: "4 min read",
      likes: 124,
      comments: 18,
      tags: ["Gemini", "AI Research", "DeepMind"],
      author: {
        name: "Dr. Aisha Patel",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop",
        role: "Advisory AI Scientist",
      },
      content: `Large language models are rapidly shifting from high-latency multi-billion parameter giants to hyper-optimized, low-latency reasoning layers. Google's release of Gemini 3.5-Flash represents this transition beautifully.

By leveraging advanced distillation techniques and parallel reasoning execution, the model cuts down token generation latency by more than 40% while maintaining absolute state-of-the-art results on standard academic benchmarks.

For students and developers, this translates to real-time interactive sandboxes, fluid speech synthesizers, and instant multi-document context analysis without heavy server resource bottlenecks.`
    },
    {
      id: "2",
      title: "Step-by-Step Guide: Optimizing React 19 State Cycles",
      summary: "Learn how to eliminate infinite re-renders and stabilize large dependency arrays inside useEffect hooks using React 19's native compiler and compiler optimizations.",
      category: "Tutorial",
      date: "July 15, 2026",
      readTime: "6 min read",
      likes: 98,
      comments: 11,
      tags: ["React 19", "Web Dev", "Performance"],
      author: {
        name: "Dimitri Volkov",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
        role: "Lead Platform Engineer",
      },
      content: `React 19 and the new React Compiler change how we think about rendering. However, basic state-cycle mistakes still occur frequently.

When designing complex dashboard state routers, updating state directly in the component body or adding non-primitive variables into useEffect dependency arrays results in performance exhaustion.

To fix this:
1. Prefer primitive state variables (booleans, strings, numbers) inside dependency triggers.
2. Utilize useMemo and useCallback exclusively for variables declared inside the render scope.
3. Trust the compiler to optimize generic component renders, but maintain strict modular component boundaries.`
    },
    {
      id: "3",
      title: "How I Landed a Robotics Internship Using Custom AI Roadmaps",
      summary: "A university sophomore shares their story of self-teaching deep reinforcement learning models and landing their dream research offer using AlphaThink's recommendations.",
      category: "Success Story",
      date: "July 11, 2026",
      readTime: "5 min read",
      likes: 185,
      comments: 24,
      tags: ["Success Story", "Robotics", "Careers"],
      author: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
        role: "M.S. Stanford Student",
      },
      content: `Six months ago, I was struggling to find structured resources for robotics simulations. Standard university coursework felt too theoretical, and online bootcamps felt too superficial.

I used AlphaThink's Recommendation Engine to construct a customized 4-phase learning path. By building three hands-on projects, saving them directly to my board, and refining my resume utilizing the ATS matching grader, I was prepared.

Last week, I received my official offer letter. Learn by doing, build real sandboxes, and utilize modern AI assistance to grade your work!`
    }
  ]);

  // Handle Incremental Likes locally
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(prev => prev.map(art => {
      if (art.id === id) {
        return { ...art, likes: art.likes + 1 };
      }
      return art;
    }));
  };

  // Filter logic
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tight mb-3">
            AlphaThink AI Insights
          </h1>
          <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Read cutting-edge tutorials, platform updates, AI research reports, and inspiring community success stories.
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category tabs */}
          <div className="flex overflow-x-auto gap-1.5 w-full md:w-auto pb-2 md:pb-0">
            {["All", "AI News", "Tutorial", "Success Story"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-primary text-white shadow-md"
                    : darkMode
                      ? "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat === "All" ? "All Articles" : cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles, tags..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-all ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-white focus:border-brand-primary"
                  : "bg-white border-slate-200 text-slate-800 focus:border-brand-primary"
              }`}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          </div>

        </div>

        {/* Articles list */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-pulse" />
            <p className="text-xs font-bold">No articles match your criteria</p>
            <p className="text-[11px] text-slate-400 mt-1">Try resetting your category filters or search queries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className={`rounded-2xl border overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                  darkMode
                    ? "glass-panel border-white/10 hover:border-brand-primary/45 shadow-lg shadow-slate-950/20"
                    : "bg-white border-slate-200 hover:border-slate-350 shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  {/* Category & Date bar */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      art.category === "AI News"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : art.category === "Tutorial"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {art.category}
                    </span>
                    <span className={`text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"} font-mono`}>{art.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg mb-2 group-hover:text-brand-secondary transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  
                  <p className={`text-xs leading-relaxed mb-6 line-clamp-3 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {art.summary}
                  </p>
                </div>

                <div className="space-y-4 mt-auto">
                  
                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1">
                    {art.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`text-[9px] px-2 py-0.5 rounded ${
                        darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-100 text-slate-600"
                      }`}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer interaction bar */}
                  <div className="flex justify-between items-center border-t border-slate-800/10 dark:border-slate-800/50 pt-3">
                    <div className="flex items-center gap-2">
                      <img src={art.author.avatar} alt={art.author.name} referrerPolicy="no-referrer" className="h-6 w-6 rounded-full object-cover border border-slate-500/10" />
                      <span className={`text-[10px] font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{art.author.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLike(art.id, e)}
                        className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Like this post"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{art.likes}</span>
                      </button>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{art.comments}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

        {/* Article Full Modal Overlay */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className={`relative w-full max-w-2xl rounded-2xl border p-6 overflow-y-auto max-h-[85vh] shadow-2xl transition-all ${
              darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-850"
            }`}>
              
              {/* Close Button */}
              <button
                onClick={() => setActiveArticle(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all cursor-pointer ${
                  darkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950"
                }`}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Author & date row */}
              <div className="flex items-center gap-3 mb-6">
                <img src={activeArticle.author.avatar} alt={activeArticle.author.name} referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover border border-indigo-500/20" />
                <div>
                  <h4 className="text-xs font-bold font-display">{activeArticle.author.name}</h4>
                  <p className="text-[10px] text-brand-secondary font-semibold uppercase">{activeArticle.author.role}</p>
                </div>
                <span className={`text-[10px] ml-auto font-mono ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{activeArticle.date}</span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">
                {activeArticle.title}
              </h2>

              {/* Content body */}
              <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap mb-8 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {activeArticle.content}
              </div>

              {/* Footer metadata */}
              <div className="flex flex-wrap gap-1 border-t border-slate-800/10 dark:border-slate-850 pt-4 items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {activeArticle.tags.map((tag, idx) => (
                    <span key={idx} className={`text-[9px] px-2.5 py-1 rounded font-semibold ${
                      darkMode ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-600"
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className={`text-[10px] font-mono ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{activeArticle.readTime}</div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
