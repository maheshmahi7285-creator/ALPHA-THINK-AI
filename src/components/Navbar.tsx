import React, { useState } from "react";
import { Cpu, Sun, Moon, Bell, Menu, X, User, Sparkles, ChevronDown, Trophy, Bookmark } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  user: UserProfile;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  user,
  language,
  setLanguage,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const notifications = [
    { id: "1", title: "Achievement unlocked!", text: "Earned 'First Prompt' badge", time: "10m ago" },
    { id: "2", title: "New AI Article", text: "Read the latest in AI: 'The Rise of Gemini 3.5'", time: "2h ago" },
    { id: "3", title: "Welcome to AlphaThink!", text: "Set up your target role to generate paths.", time: "1d ago" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "hi", name: "हिन्दी" },
  ];

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "features", label: "Features" },
    { id: "dashboard", label: "Dashboard" },
    { id: "tools", label: "AI Tools" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ];

  const activeLangName = languages.find((l) => l.code === language)?.name || "English";

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      darkMode 
        ? "border-slate-800 bg-slate-950/80 text-white backdrop-blur-md" 
        : "border-slate-200 bg-white/80 text-slate-950 backdrop-blur-md"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab("home")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              AlphaThink
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              v2.0
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTab === item.id
                    ? darkMode
                      ? "bg-slate-800 text-brand-secondary shadow-sm"
                      : "bg-slate-100 text-brand-primary shadow-sm"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Multi-Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangOpen(!langOpen);
                  setProfileOpen(false);
                  setNotifOpen(false);
                }}
                className={`p-2 rounded-lg text-sm flex items-center gap-1 transition-all hover:bg-slate-800/10 ${
                  darkMode ? "text-slate-300 hover:text-white hover:bg-slate-900" : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                <span className="uppercase text-xs font-semibold">{language}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border p-1 z-50 ${
                  darkMode ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800"
                }`}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-all ${
                        language === l.code
                          ? "bg-brand-primary/20 text-brand-secondary font-medium"
                          : darkMode
                            ? "hover:bg-slate-800 text-slate-300 hover:text-white"
                            : "hover:bg-slate-100 text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all hover:bg-slate-800/10 ${
                darkMode ? "text-slate-300 hover:text-white hover:bg-slate-900" : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                  setLangOpen(false);
                }}
                className={`p-2 rounded-lg transition-all relative ${
                  darkMode ? "text-slate-300 hover:text-white hover:bg-slate-900" : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950"></span>
              </button>
              {notifOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border p-2 z-50 ${
                  darkMode ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800"
                }`}>
                  <div className="flex justify-between items-center px-2 py-1.5 border-b border-slate-800 mb-1">
                    <span className="text-sm font-semibold">Notifications</span>
                    <span className="text-[10px] bg-brand-primary/20 text-brand-secondary px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg transition-all cursor-pointer ${
                        darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                      }`}>
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                  setLangOpen(false);
                }}
                className="flex items-center gap-1.5 cursor-pointer p-1 rounded-lg hover:bg-slate-800/10 transition-all"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-500/20 bg-slate-800 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="User Avatar" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold">{user.name}</p>
                  <p className="text-[10px] text-teal-400">XP Level {user.level}</p>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {profileOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border p-2 z-50 ${
                  darkMode ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800"
                }`}>
                  <div className="px-3 py-2 border-b border-slate-800/50 mb-1.5">
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setCurrentTab("dashboard");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-left hover:bg-slate-800 transition-all text-slate-300 hover:text-white"
                    >
                      <User className="h-4 w-4 text-brand-secondary" /> Profile Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab("dashboard");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-left hover:bg-slate-800 transition-all text-slate-300 hover:text-white"
                    >
                      <Trophy className="h-4 w-4 text-amber-400" /> Achievements ({user.badges.filter(b => b.unlocked).length})
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Dark Mode (Mobile) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${
                darkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t px-2 pt-2 pb-4 space-y-1 ${
          darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full text-left block px-3 py-2 rounded-lg text-base font-medium ${
                currentTab === item.id
                  ? darkMode
                    ? "bg-slate-800 text-brand-secondary"
                    : "bg-slate-100 text-brand-primary font-semibold"
                  : darkMode
                    ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-800/50 mt-4 pt-4 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold">{user.name}</p>
                <p className="text-[10px] text-teal-400">Level {user.level}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentTab("dashboard");
                setIsOpen(false);
              }}
              className="text-xs bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-secondary px-3 py-1.5 rounded-lg font-medium transition-all"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
