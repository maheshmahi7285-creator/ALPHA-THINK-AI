import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import FeaturesHub from "./pages/FeaturesHub";
import DashboardPage from "./pages/DashboardPage";
import AIToolsPage from "./pages/AIToolsPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import { UserProfile, AIToolId } from "./types";

export default function App() {
  
  // Theme Toggle state (defaults to dark mode for modern AI feeling)
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // App routing state
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Specific AI Tools preset tab
  const [activeTool, setActiveTool] = useState<AIToolId>("chat");

  // Multi-language translation support
  const [language, setLanguage] = useState<string>("en");

  // Core User Profile data
  const [user, setUser] = useState<UserProfile>({
    name: "Alex Rivera",
    email: "alex.rivera@stanford.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    level: 1,
    xp: 45,
    badges: [
      { id: "first_prompt", name: "AI Initiate", description: "Successfully run your first interactive chatbot prompt.", unlocked: true, unlockedAt: "07/19/2026" },
      { id: "summary_expert", name: "Insight Extractor", description: "Summarize a research reference or textbook chapter.", unlocked: false },
      { id: "code_master", name: "Sandbox Synthesizer", description: "Generate a full software engineering block using the code terminal.", unlocked: false },
      { id: "interview_ready", name: "Career Pathfinder", description: "Submit answers inside the corporate mock interview room.", unlocked: false },
    ],
    stats: {
      chatCount: 1,
      summariesCount: 0,
      codeCount: 0,
      resumesCount: 0,
      recommendationsCount: 0,
      interviewsCount: 0,
    },
    savedProjects: [
      {
        id: "proj-init-1",
        title: "Recursive Directory Compression Engine",
        description: "A fast, low-memory directory compressor built in Rust that recursively indexes paths and compresses contents into CJS-safe formats.",
        difficulty: "Intermediate",
        techStack: ["Rust", "Binary Buffers", "FS I/O"],
        dateSaved: "07/18/2026",
      }
    ],
    recentActivities: [
      { id: "act-1", type: "system", description: "Account created successfully with Path-Finder status", date: "07/18/2026" },
      { id: "act-2", type: "tool", description: "Completed AI Chat Assistant onboarding session (+10 XP)", date: "07/19/2026" },
    ],
  });

  // Manage body theme classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#0F172A";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#F8FAFC";
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Navbar header */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        user={user}
      />

      {/* Main viewport transition panel */}
      <main className="flex-grow">
        
        {currentTab === "home" && (
          <Home
            darkMode={darkMode}
            setCurrentTab={setCurrentTab}
            language={language}
          />
        )}

        {currentTab === "about" && (
          <About
            darkMode={darkMode}
          />
        )}

        {currentTab === "features" && (
          <FeaturesHub
            darkMode={darkMode}
            setCurrentTab={setCurrentTab}
            setActiveTool={setActiveTool}
          />
        )}

        {currentTab === "dashboard" && (
          <DashboardPage
            darkMode={darkMode}
            user={user}
            setUser={setUser}
            setCurrentTab={setCurrentTab}
            setActiveTool={setActiveTool}
          />
        )}

        {currentTab === "tools" && (
          <AIToolsPage
            darkMode={darkMode}
            user={user}
            setUser={setUser}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
          />
        )}

        {currentTab === "blog" && (
          <BlogPage
            darkMode={darkMode}
          />
        )}

        {currentTab === "contact" && (
          <ContactPage
            darkMode={darkMode}
            user={user}
            setUser={setUser}
          />
        )}

      </main>

      {/* Static Brand Footer */}
      <Footer darkMode={darkMode} setCurrentTab={setCurrentTab} />

    </div>
  );
}
