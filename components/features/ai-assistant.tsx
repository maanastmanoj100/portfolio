"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { useUIStore } from "@/stores/ui-store";
import { IconRobot, IconSend, IconX, IconUserShield } from "@tabler/icons-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What projects have you worked on?",
  "What are your top skills?",
  "Tell me about your certifications",
  "Download your resume",
  "How can I contact you?",
];

const recruiterSuggestions = [
  "Summarize the portfolio",
  "What is the strongest project?",
  "Recommend interview questions",
  "Generate a candidate summary",
  "Suggest projects for SOC Analyst",
];

const recruiterResponses: Record<string, string> = {
  summary: "Maanas is a cybersecurity engineer with 6+ years of hands-on experience in penetration testing, incident response, and AI-driven security. He has built enterprise-grade SOC platforms, led security architecture for Fortune 500 companies, and holds multiple industry certifications including OSCP, CEH, and CISSP. His strongest differentiator is combining offensive security expertise with AI/ML engineering to build automated defense systems.",
  "strongest project": "Sentinel AI is his flagship project — an enterprise SOC platform processing 10M+ events daily with 99.7% detection rate and 0.1% false positive rate. It reduced detection time from 48 hours to 3 minutes and saved an estimated $2.4M annually. The project demonstrates full-stack security engineering, AI/ML, and distributed systems expertise.",
  "soc dashboard": "The SOC Dashboard provides real-time threat monitoring with live alert feeds, MITRE ATT&CK coverage mapping, incident investigation tools, and automated response playbooks. It handles 10M+ events daily with sub-50ms latency across 15,000+ endpoints.",
  "interview questions": "1. 'Tell me about yourself' — He covers penetration testing, incident response, AI security, and his flagship Sentinel AI project.\n2. 'What is your strongest project?' — Sentinel AI with specific metrics (99.7% detection, $2.4M savings).\n3. 'How do you approach penetration testing?' — Structured methodology: recon, enumeration, exploitation, privilege escalation, lateral movement, documentation.\n4. 'What are you currently learning?' — OSCP certification, advanced AD attacks, cloud security architecture.",
  "candidate summary": "Strong hire recommendation. Combines deep technical expertise in offensive security with modern AI/ML engineering skills. Has built production systems at scale with measurable business impact. Holds relevant certifications and demonstrates continuous learning. Ideal for security engineering, penetration testing, and SOC roles.",
  "soc analyst relevance": "Highly relevant. His Sentinel AI SOC platform, threat hunting tools, and SOC dashboard demonstrate direct SOC experience. Skills include incident response (92%), threat hunting (90%), and security architecture (85%). He has built the exact tools SOC analysts use daily.",
};

const defaultResponses: Record<string, string> = {
  projects: "I've worked on several impactful cybersecurity projects including Sentinel AI (an AI-powered threat detection platform), ChainGuard (blockchain security auditing), and NetDefend (zero-trust network security). You can explore them all on the Projects page.",
  skills: "My core expertise includes penetration testing (95%), incident response (92%), Python development (95%), and cloud security (90%). I specialize in offensive security, defensive operations, and AI-driven threat detection.",
  certifications: "I hold OSCP, CEH, GCIH, CCSP, and CISSP certifications among others. Each represents validated expertise in different security domains. Check out the Certifications page for the full list.",
  resume: "You can download my resume from the Resume page. It includes my complete work history, education, certifications, and technical skills.",
  contact: "You can reach me through the Contact page, or connect with me on LinkedIn and GitHub. I'm always open to discussing security challenges and opportunities.",
};

const defaultResponse = "I'm your AI assistant for the Cyber Nexus portfolio. I can help you learn about my projects, skills, certifications, and more. What would you like to know?";

function getResponse(input: string, recruiterMode: boolean): string {
  const lower = input.toLowerCase();
  if (recruiterMode) {
    for (const [key, response] of Object.entries(recruiterResponses)) {
      if (lower.includes(key)) return response;
    }
  }
  for (const [key, response] of Object.entries(defaultResponses)) {
    if (lower.includes(key)) return response;
  }
  return defaultResponse;
}

export function AiAssistant() {
  const app = useApp();
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: recruiterMode ? "Recruiter Mode active. I can summarize the portfolio, recommend interview questions, suggest relevant projects, and generate candidate summaries. How can I help?" : defaultResponse },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSuggestions = recruiterMode ? recruiterSuggestions : suggestions;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(userMsg, recruiterMode) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <AnimatePresence>
      {app.aiAssistantOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-end justify-center sm:justify-end p-4 sm:p-6 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pointer-events-auto w-full sm:w-96 glass rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxHeight: "500px" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <IconRobot size={16} className="text-purple" />
                  </div>
                  <span className="text-sm font-medium text-soft-white">AI Assistant</span>
                  {recruiterMode && <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-cyan/10 text-cyan rounded font-mono"><IconUserShield size={9} />Recruiter</span>}
                  <span className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-400 rounded font-mono">BETA</span>
                </div>
              <button onClick={() => app.setAiAssistantOpen(false)} className="p-1 text-soft-white/40 hover:text-soft-white transition-colors">
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-cyan/10 border border-cyan/20 text-cyan"
                        : "bg-white/5 border border-white/10 text-soft-white/80"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-soft-white/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-soft-white/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-soft-white/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border/50">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {activeSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 text-soft-white/40 hover:text-soft-white/60 rounded-lg border border-white/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-soft-white outline-none placeholder:text-soft-white/20 focus:border-cyan/30 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-colors disabled:opacity-30"
                >
                  <IconSend size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
