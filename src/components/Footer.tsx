import React from "react";
import { Cpu, Github, Twitter, Linkedin, Sparkles, Send, GraduationCap } from "lucide-react";

interface FooterProps {
  darkMode: boolean;
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ darkMode, setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t transition-all duration-300 ${
      darkMode 
        ? "border-slate-800 bg-slate-950 text-white" 
        : "border-slate-200 bg-slate-50 text-slate-800"
    }`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand section */}
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab("home")}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                AlphaThink
              </span>
            </div>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} max-w-sm`}>
              Bridging the gap between artificial intelligence and human ambition. Empowering students, researchers, and builders with tailored learning, coding, and problem-solving companion systems.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className={`hover:text-brand-secondary transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={`hover:text-brand-secondary transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`hover:text-brand-secondary transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-300" : "text-slate-900"}`}>
                Platform Hub
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => setCurrentTab("tools")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    AI Chatbot
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("tools")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Text Summarizer
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("tools")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Code Assistant
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("tools")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Resume Matcher
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-300" : "text-slate-900"}`}>
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => setCurrentTab("about")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("blog")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    AI Insights Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("contact")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Frequently Asked
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("contact")} className={`text-sm transition-all hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 md:col-span-1">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-300" : "text-slate-900"}`}>
                Subscribe to AI News
              </h3>
              <p className={`mt-2 text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Get high-quality research, coding tips, and updates sent straight to your inbox.
              </p>
              <form className="mt-4 sm:flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 text-sm rounded-lg border outline-none transition-all ${
                    darkMode
                      ? "bg-slate-900 border-slate-800 text-white focus:border-brand-primary"
                      : "bg-white border-slate-300 text-slate-800 focus:border-brand-primary"
                  }`}
                />
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-1 bg-brand-primary hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer"
                >
                  Join <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            &copy; {currentYear} AlphaThink Inc. Powered by Gemini Pro AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <a href="#privacy" className={`hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Privacy Policy</a>
            <a href="#terms" className={`hover:text-brand-secondary ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
