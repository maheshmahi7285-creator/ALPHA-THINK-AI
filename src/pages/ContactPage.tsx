import React, { useState } from "react";
import { Mail, MessageSquare, MapPin, Sparkles, Send, CheckCircle2, ChevronDown, HelpCircle, PhoneCall } from "lucide-react";
import { UserProfile } from "../types";

interface ContactPageProps {
  darkMode: boolean;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

export default function ContactPage({ darkMode, user, setUser }: ContactPageProps) {
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What artificial intelligence models power AlphaThink?",
      a: "AlphaThink integrates directly with Google's state-of-the-art Gemini 3.5-Flash model suites. All interactions are handled on custom Express backend proxy layers, keeping your data confidential, low latency, and highly tailored.",
    },
    {
      q: "How does the ATS Resume matching scoring system operate?",
      a: "Our Resume Scorer parses your pasted experience text, runs a mathematical keyword-frequency matching diagnostic against industry target role profiles, grades resume structure and layout, and generates a rating out of 100 with actionable missing keyword lists.",
    },
    {
      q: "Can I save generated projects and curricula to my dashboard?",
      a: "Yes! When you input your goals inside our personalized roadmap generator, you will receive recommended project cards. Simply click 'Save to Board' and they will instantly sync to your personal Dashboard page.",
    },
    {
      q: "Is there any cost associated with using these engineering tools?",
      a: "Currently, AlphaThink is completely free for academic students, individual researchers, and developers. We support our API quotas through research grants and direct platform sponsorships.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);

    // Simulate network latency
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      // Reward user with 5 XP for submitting feedback/query
      const newActivity = {
        id: `act-${Date.now()}`,
        type: "contact",
        description: "Sent support/collaboration message to AlphaThink Labs (+5 XP)",
        date: new Date().toLocaleDateString(),
      };
      
      let updatedXP = user.xp + 5;
      let updatedLevel = user.level;
      const xpNeeded = user.level * 100;
      if (updatedXP >= xpNeeded) {
        updatedXP -= xpNeeded;
        updatedLevel += 1;
      }

      setUser({
        ...user,
        xp: updatedXP,
        level: updatedLevel,
        recentActivities: [newActivity, ...user.recentActivities],
      });

      // Clear fields
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen py-16">
      
      {/* Background Decor */}
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-display text-4xl font-bold tracking-tight mb-3">
            Get in Touch with AlphaThink Labs
          </h1>
          <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Have questions about academic integrations, professional sponsorships, or developer features? Contact our advisory team directly.
          </p>
        </div>

        {/* Lower Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Left: Contact Form / Success state */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
            darkMode ? "glass-panel border-white/10 shadow-xl shadow-slate-950/25" : "bg-white border-slate-200 shadow-sm"
          }`}>
            
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display font-bold text-xl">Message Transmitted!</h3>
                <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  We have received your inquiries, details, and feedback. Our research or support department will get in touch with you at your provided email within 24 hours.
                </p>
                <div className="text-xs text-brand-secondary font-mono bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block mt-2">
                  +5 XP Awarded to your profile!
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-700 transition-all"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className="font-display font-bold text-lg mb-4">Send a Secure Inquiry</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. 'John Doe'"
                      className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. 'john@university.edu'"
                      className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border outline-none ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">Role Profile</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="Student">Academic Student</option>
                    <option value="Researcher">Academic Researcher / Professor</option>
                    <option value="Developer">Software Developer / Engineer</option>
                    <option value="Startup">Corporate Recruiter / HR Lead</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">Message Text</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can assist you, what feature suggestions you have, or academic partnership inquiries..."
                    className={`w-full p-3 text-xs sm:text-sm rounded-lg border outline-none ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-850"
                    }`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      In transit...
                    </>
                  ) : (
                    <>
                      Transmit Inquiry <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Right: FAQ Panel & Contact details */}
          <div className="space-y-8 text-left">
            
            {/* Direct Channels */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${
              darkMode ? "glass-panel border-white/10 shadow-lg" : "bg-white border border-slate-200 shadow-sm"
            }`}>
              <h3 className="font-display font-bold text-base mb-4">Direct Communication Channels</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-brand-secondary flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">AlphaThink Labs Contact</h4>
                    <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>support@alphathink.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-brand-secondary flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">In-person Research Campus</h4>
                    <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>450 Serra Mall, Stanford University, CA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-brand-secondary" /> Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                        darkMode
                          ? "glass-panel border-white/5 hover:border-indigo-500/25 shadow-md"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${
                          isOpen ? "transform rotate-180" : ""
                        }`} />
                      </button>

                      {isOpen && (
                        <div className={`px-4 pb-4 text-xs leading-relaxed ${
                          darkMode ? "text-slate-400 border-t border-slate-800/40" : "text-slate-600 border-t border-slate-100"
                        } pt-2`}>
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
