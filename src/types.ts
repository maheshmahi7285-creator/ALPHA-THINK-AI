export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type AIToolId =
  | "chat"
  | "summarizer"
  | "code"
  | "resume"
  | "interview"
  | "recommend";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  badges: Badge[];
  recentActivities: Activity[];
  savedProjects: SavedProject[];
  stats: {
    chatCount: number;
    summariesCount: number;
    codeCount: number;
    resumesCount: number;
    interviewsCount: number;
    recommendationsCount: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  unlocked: boolean;
}

export interface Activity {
  id: string;
  type: string; // "chat" | "tool" | "badge" | "save"
  description: string;
  date: string;
}

export interface SavedProject {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  techStack: string[];
  dateSaved: string;
}

export interface RecommendedProject {
  title: string;
  description: string;
  difficulty: string;
  techStack: string[];
}

export interface LearningPhase {
  phase: string;
  topic: string;
  duration: string;
  resources: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: "AI News" | "Tutorial" | "Success Story";
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
