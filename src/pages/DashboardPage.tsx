import React from "react";
import { User, Trophy, Calendar, Trash2, Code, Star, Award, TrendingUp, Sparkles, BookOpen, Clock, Heart } from "lucide-react";
import { UserProfile, SavedProject } from "../types";

interface DashboardPageProps {
  darkMode: boolean;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
  setActiveTool: (tool: any) => void;
}

export default function DashboardPage({
  darkMode,
  user,
  setUser,
  setCurrentTab,
  setActiveTool,
}: DashboardPageProps) {
  
  // Calculate next level XP
  const xpNeeded = user.level * 100;
  const xpPercentage = Math.min(100, Math.floor((user.xp / xpNeeded) * 100));

  // Handle deleting saved project
  const handleDeleteProject = (id: string) => {
    const updatedProjects = user.savedProjects.filter((p) => p.id !== id);
    const updatedActivities = [
      {
        id: `act-${Date.now()}`,
        type: "save",
        description: `Removed project from your saved list`,
        date: new Date().toLocaleDateString(),
      },
      ...user.recentActivities,
    ];
    setUser({
      ...user,
      savedProjects: updatedProjects,
      recentActivities: updatedActivities,
    });
  };

  // Mock leaderboard users
  const leaderboard = [
    { rank: 1, name: "Siddharth Sharma", xp: 4850, role: "Computer Science", isMe: false },
    { rank: 2, name: "Emily Watson", xp: 4120, role: "Bioinformatics", isMe: false },
    { rank: 3, name: "Yuki Tanaka", xp: 3980, role: "Robotics Student", isMe: false },
    { rank: 4, name: user.name, xp: user.xp + (user.level - 1) * 100, role: "AI & DS Student", isMe: true },
    { rank: 5, name: "Lucas Dupont", xp: 850, role: "Software Engineer", isMe: false },
  ].sort((a, b) => b.xp - a.xp);

  // SVG Analytics Data calculations
  const statsKeys = Object.keys(user.stats) as Array<keyof typeof user.stats>;
  const totalInvocations = statsKeys.reduce((sum, key) => sum + user.stats[key], 0);

  const chartData = [
    { name: "Chat", value: user.stats.chatCount, color: "bg-indigo-500", fill: "#6C63FF" },
    { name: "Summ.", value: user.stats.summariesCount, color: "bg-emerald-500", fill: "#10B981" },
    { name: "Code", value: user.stats.codeCount, color: "bg-cyan-500", fill: "#06B6D4" },
    { name: "Resume", value: user.stats.resumesCount, color: "bg-rose-500", fill: "#F43F5E" },
    { name: "Interv.", value: user.stats.interviewsCount, color: "bg-purple-500", fill: "#A855F7" },
    { name: "Recomm.", value: user.stats.recommendationsCount, color: "bg-amber-500", fill: "#F59E0B" },
  ];

  const maxStatValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="relative min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card & XP Header */}
        <div className={`rounded-3xl border p-6 sm:p-8 mb-8 transition-all ${
          darkMode 
            ? "glass-panel border-indigo-500/25 shadow-xl shadow-indigo-950/10" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: User Metadata */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary p-1">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-brand-secondary border border-indigo-500/20 uppercase tracking-wide">
                    AI Pathfinder
                  </span>
                </div>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {user.email}
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-teal-400 font-semibold">
                  <Trophy className="h-4 w-4" />
                  <span>Level {user.level} Innovator</span>
                </div>
              </div>
            </div>

            {/* Right: XP ProgressBar */}
            <div className="w-full md:max-w-md space-y-2">
              <div className="flex justify-between items-end text-xs">
                <span className={darkMode ? "text-slate-400" : "text-slate-600"}>XP Progress to Next Level</span>
                <span className="font-mono font-bold text-brand-secondary">{user.xp} / {xpNeeded} XP ({xpPercentage}%)</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
              <p className={`text-[10px] text-right ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Solve coding exercises or conduct resume ATS reviews to earn massive XP rewards!
              </p>
            </div>

          </div>
        </div>

        {/* Bento Grid: Analytics & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* SVG Analytics Column Bar Chart (2 cols width) */}
          <div className={`lg:col-span-2 rounded-2xl border p-6 transition-all flex flex-col justify-between ${
            darkMode ? "glass-panel border-white/10 shadow-lg" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold">AI Usage Statistics</h3>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total platform calls: {totalInvocations}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-secondary font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded-lg">
                  <TrendingUp className="h-4 w-4" /> Real-time Update
                </div>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2 pt-6">
                {chartData.map((d, i) => {
                  const barHeight = Math.max(8, Math.floor((d.value / maxStatValue) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                      
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute translate-y-[-120%] bg-slate-950 text-white text-[10px] px-2 py-1 rounded border border-slate-800 pointer-events-none font-semibold">
                        {d.value} runs
                      </div>

                      {/* Bar fill */}
                      <div className="w-full max-w-[28px] rounded-t-md relative overflow-hidden bg-slate-850 h-full flex flex-col justify-end">
                        <div
                          className={`w-full rounded-t-md transition-all duration-700`}
                          style={{
                            height: `${barHeight}%`,
                            backgroundColor: d.fill
                          }}
                        ></div>
                      </div>

                      <span className={`text-[10px] font-semibold truncate max-w-full ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {d.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800/10 dark:border-slate-800 pt-4 mt-6 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className={`block text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Most Used</span>
                <span className="font-display font-bold text-sm text-brand-secondary">
                  {chartData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name}
                </span>
              </div>
              <div>
                <span className={`block text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Completed</span>
                <span className="font-display font-bold text-sm text-emerald-400">
                  {totalInvocations * 10} XP
                </span>
              </div>
              <div>
                <span className={`block text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Status</span>
                <span className="font-display font-bold text-sm text-teal-400">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Gamified Leaderboard */}
          <div className={`rounded-2xl border p-6 transition-all ${
            darkMode ? "glass-panel border-white/10 shadow-lg" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h3 className="font-display text-lg font-bold mb-1">Global Leaderboard</h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"} mb-6`}>Earn XP to climb ranks.</p>

            <div className="space-y-3">
              {leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    item.isMe
                      ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                      : darkMode
                        ? "bg-slate-950/40 border-slate-900 hover:bg-slate-900 text-slate-300"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-extrabold ${
                      item.rank === 1
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : item.rank === 2
                          ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                          : item.isMe
                            ? "bg-indigo-500/20 text-brand-secondary border border-indigo-500/30"
                            : "text-slate-400"
                    }`}>
                      {item.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{item.name} {item.isMe && " (You)"}</p>
                      <p className={`text-[10px] truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{item.role}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-400">{item.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Lower Grid: Saved Projects & Unlocked Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Saved Projects Board (2 cols) */}
          <div className={`lg:col-span-2 rounded-2xl border p-6 transition-all ${
            darkMode ? "glass-panel border-white/10 shadow-lg" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-lg font-bold">Saved AI Projects</h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Hands-on sandbox ideas you bookmarked.</p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-bold">
                {user.savedProjects.length} Total
              </span>
            </div>

            {user.savedProjects.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-pulse" />
                <p className="text-xs font-bold">No saved projects yet</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Go to "AI Tools" and generate a customized roadmap or projects list to save ideas here.
                </p>
                <button
                  onClick={() => {
                    setActiveTool("recommend");
                    setCurrentTab("tools");
                  }}
                  className="mt-4 px-4 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  Get Project Recommendations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.savedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      darkMode
                        ? "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          proj.difficulty === "Beginner"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : proj.difficulty === "Intermediate"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {proj.difficulty}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className={`p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all cursor-pointer`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold font-display line-clamp-1 mb-1">{proj.title}</h4>
                      <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {proj.description}
                      </p>
                    </div>

                    {/* Tech tag list */}
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-800/10 dark:border-slate-800/50 pt-3 mt-auto">
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded ${
                          darkMode ? "bg-slate-900 text-slate-300" : "bg-slate-200/50 text-slate-700"
                        }`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unlocked Badges Shelf (1 col) */}
          <div className={`rounded-2xl border p-6 transition-all ${
            darkMode ? "glass-panel border-white/10 shadow-lg" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h3 className="font-display text-lg font-bold mb-1">Badges & Achievements</h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"} mb-6`}>Gamify your technical progression.</p>

            <div className="grid grid-cols-2 gap-4">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                    badge.unlocked
                      ? darkMode
                        ? "bg-slate-950 border-brand-primary/40 text-white"
                        : "bg-white border-brand-primary/30 text-slate-850"
                      : "opacity-40 border-slate-900 bg-slate-950/20"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 shadow ${
                    badge.unlocked
                      ? "bg-brand-primary/20 text-brand-secondary border border-brand-primary/30"
                      : "bg-slate-900 text-slate-600 border border-slate-800"
                  }`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="text-[11px] font-bold truncate w-full mb-0.5">{badge.name}</h4>
                  <p className={`text-[9px] line-clamp-2 leading-relaxed ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Activity Feed Section */}
        <div className={`rounded-2xl border p-6 mt-8 transition-all ${
          darkMode ? "glass-panel border-white/10 shadow-lg" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <h3 className="font-display text-lg font-bold mb-1">Recent Activities</h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"} mb-6`}>Log of your latest cognitive runs.</p>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {user.recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="h-6 w-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-brand-secondary flex items-center justify-center mt-0.5 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <p className={darkMode ? "text-slate-300" : "text-slate-600"}>{act.description}</p>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{act.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
