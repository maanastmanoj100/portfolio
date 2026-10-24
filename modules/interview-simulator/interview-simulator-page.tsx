"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import {
  ROLE_LABELS, ROLE_DESCRIPTIONS, getQuestionsForRole, evaluateResponse, generateInterviewSummary,
  INTERVIEW_QUESTIONS,
  type RoleId, type Difficulty, type InterviewConfig, type InterviewSession,
  type InterviewQuestion, type InterviewResponse, type FeedbackResult,
} from "./interview-engine";
import { projects } from "@/data/projects";
import {
  IconSend, IconX, IconBrain, IconTarget, IconCheck,
  IconStar, IconArrowRight, IconHistory, IconBulb, IconBook, IconSearch,
  IconUserShield, IconRefresh,
  IconFileText, IconChevronDown,
} from "@tabler/icons-react";

type Phase = "hero" | "config" | "interview" | "report" | "question-bank";

function SectionHeader({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="text-cyan"><Icon size={14} /></div>
      <h2 className="text-xs font-mono text-foreground-tertiary uppercase tracking-widest">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
    </div>
  );
}

function HeroSection({ onStart, onPractice, onQuestionBank }: { onStart: () => void; onPractice: () => void; onQuestionBank: () => void }) {
  return (
    <section className="mb-12 pt-6 sm:pt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-2">
          <IconBrain size={14} className="text-cyan" />
          <span className="text-xs font-mono text-cyan tracking-widest uppercase">Interview Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-2">
          AI Interview <span className="text-cyan">Simulator</span>
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 max-w-2xl mb-6 leading-relaxed">
          Experience realistic cybersecurity interviews powered by Cyber AI and inspired by the projects, skills, and certifications showcased in this portfolio.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={onStart}><IconBrain size={12} /> Start Interview</Button>
          <Button variant="secondary" size="sm" onClick={onPractice}><IconBulb size={12} /> Practice Mode</Button>
          <Button variant="secondary" size="sm" onClick={onQuestionBank}><IconSearch size={12} /> View Question Bank</Button>
        </div>
      </motion.div>
    </section>
  );
}

const ROLES: RoleId[] = ["soc-analyst", "penetration-tester", "security-engineer", "cloud-security-engineer", "threat-hunter", "incident-responder", "blue-team", "red-team", "devsecops", "intern", "general"];

function RoleSelection({ onSelect, onBack }: { onSelect: (role: RoleId) => void; onBack: () => void }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <SectionHeader label="Select Role" icon={IconUserShield} />
        <button onClick={onBack} className="text-xs font-mono text-foreground-tertiary hover:text-foreground transition-colors px-3 py-2 touch-action-manipulation" style={{ minHeight: 44 }}>Back</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {ROLES.map((role, i) => (
          <motion.button
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelect(role)}
            className="text-left p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-cyan/30 transition-all touch-action-manipulation"
            style={{ minHeight: 44 }}
          >
            <div className="text-xs font-medium text-cyan mb-0.5">{ROLE_LABELS[role]}</div>
            <p className="text-xs text-foreground/60 leading-relaxed">{ROLE_DESCRIPTIONS[role]}</p>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: "beginner", label: "Beginner", desc: "Fundamental concepts" },
  { id: "intermediate", label: "Intermediate", desc: "Applied knowledge" },
  { id: "advanced", label: "Advanced", desc: "Deep technical expertise" },
  { id: "expert", label: "Expert", desc: "Architect-level depth" },
];

function InterviewConfigPanel({ role, onStart, onBack }: { role: RoleId; onStart: (config: InterviewConfig) => void; onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [includeBehavioral, setIncludeBehavioral] = useState(true);
  const [includeScenario, setIncludeScenario] = useState(true);
  const [includePortfolio, setIncludePortfolio] = useState(true);
  const [includeTechnical, setIncludeTechnical] = useState(true);

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <SectionHeader label="Interview Configuration" icon={IconTarget} />
        <button onClick={onBack} className="text-xs font-mono text-foreground-tertiary hover:text-foreground transition-colors px-3 py-2 touch-action-manipulation" style={{ minHeight: 44 }}>Change Role</button>
      </div>

      <GlassCard className="p-5" glow="cyan" intensity="low">
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan">Role</span>
          </div>
          <p className="text-sm font-medium text-foreground">{ROLE_LABELS[role]}</p>
          <p className="text-xs text-foreground/60">{ROLE_DESCRIPTIONS[role]}</p>
        </div>

        <div className="mb-5">
          <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2.5">Difficulty</div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-mono border transition-colors touch-action-manipulation",
                  difficulty === d.id ? "bg-cyan/20 border-cyan/30 text-cyan" : "bg-white/[0.02] border-white/10 text-foreground-tertiary hover:text-foreground"
                )}
                style={{ minHeight: 44 }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Questions</span>
            <span className="text-xs font-mono text-cyan">{questionCount}</span>
          </div>
          <input
            type="range" min={3} max={12} value={questionCount}
            onChange={e => setQuestionCount(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-cyan cursor-pointer"
          />
        </div>

        <div className="mb-5">
          <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2.5">Question Types</div>
          <div className="flex flex-wrap gap-2">
            {[{ id: "includeTechnical" as const, label: "Technical" }, { id: "includeBehavioral" as const, label: "Behavioral" }, { id: "includeScenario" as const, label: "Scenario" }, { id: "includePortfolio" as const, label: "Portfolio" }].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  const setters = { includeTechnical: setIncludeTechnical, includeBehavioral: setIncludeBehavioral, includeScenario: setIncludeScenario, includePortfolio: setIncludePortfolio };
                  setters[t.id](v => !v);
                }}
                className={cn(
                  "px-2.5 py-2 rounded-lg text-xs font-mono border transition-colors touch-action-manipulation",
                  (t.id === "includeTechnical" ? includeTechnical : t.id === "includeBehavioral" ? includeBehavioral : t.id === "includeScenario" ? includeScenario : includePortfolio)
                    ? "bg-purple/20 border-purple/30 text-purple" : "bg-white/[0.02] border-white/10 text-foreground-tertiary"
                )}
                style={{ minHeight: 44 }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => onStart({
          role, difficulty, duration: questionCount * 5, questionCount,
          includeBehavioral, includeScenario, includePortfolio, includeTechnical,
        })}>
          <IconBrain size={12} /> Start Interview
        </Button>
      </GlassCard>
    </motion.section>
  );
}

function QuestionCard({ question, number, total }: { question: InterviewQuestion; number: number; total: number }) {
  const typeColors: Record<string, string> = { technical: "#06b6d4", behavioral: "#8b5cf6", scenario: "#f59e0b", architecture: "#22c55e", project: "#6366f1", research: "#a855f7" };
  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-foreground-tertiary">Question {number}/{total}</span>
        <span className="text-xs font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: (typeColors[question.type] || "#6366f1") + "20", color: typeColors[question.type] || "#6366f1" }}>{question.type}</span>
        <span className="text-xs font-mono text-foreground-tertiary capitalize">{question.category.replace(/-/g, " ")}</span>
        <span className="text-xs font-mono text-foreground-tertiary capitalize">{question.difficulty}</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{question.question}</p>
      {question.context && (
        <p className="text-xs text-foreground/50 mt-1 italic">{question.context}</p>
      )}
    </motion.div>
  );
}

function FeedbackCard({ feedback }: { feedback: FeedbackResult }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
      <GlassCard className="p-4" glow="purple" intensity="low">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-purple uppercase tracking-wider">AI Feedback</span>
          <button onClick={() => setExpanded(!expanded)} className="text-xs font-mono text-foreground-tertiary hover:text-foreground px-3 py-2 touch-action-manipulation" style={{ minHeight: 44 }}>
            {expanded ? "Less" : "More"} <IconChevronDown size={8} className={cn("inline ml-0.5 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>

        <div className="space-y-2">
          {feedback.strengths.length > 0 && (
            <div>
              <span className="text-xs font-mono text-green uppercase tracking-wider mb-1 block">Strengths</span>
              <ul className="space-y-0.5">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                    <IconCheck size={8} className="text-green mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.improvements.length > 0 && (
            <div>
              <span className="text-xs font-mono text-amber uppercase tracking-wider mb-1 block">Areas to Improve</span>
              <ul className="space-y-0.5">
                {feedback.improvements.map((imp, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                    <IconStar size={8} className="text-amber mt-0.5 shrink-0" /> {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-2 border-t border-white/5 pt-3">
              {feedback.relatedProjects.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-cyan uppercase tracking-wider mb-1 block">Related Projects</span>
                  <div className="flex flex-wrap gap-1.5">
                    {feedback.relatedProjects.map(p => (
                      <a key={p.href} href={p.href} className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20 transition-colors">{p.title}</a>
                    ))}
                  </div>
                </div>
              )}
              {feedback.relatedSkills.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-purple uppercase tracking-wider mb-1 block">Related Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {feedback.relatedSkills.map(s => (
                      <span key={s} className="text-xs font-mono px-1 py-0.5 rounded bg-white/[0.04] text-foreground-secondary">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {feedback.relatedCerts.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-amber uppercase tracking-wider mb-1 block">Related Certifications</span>
                  <div className="flex flex-wrap gap-1.5">
                    {feedback.relatedCerts.map(c => (
                      <span key={c} className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber/10 text-amber border border-amber/20">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {feedback.suggestedReading.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-green uppercase tracking-wider mb-1 block">Suggested Reading</span>
                  <ul className="space-y-0.5">
                    {feedback.suggestedReading.map((r, i) => (
                      <li key={i} className="text-xs text-foreground/60 flex items-start gap-1">
                        <IconBook size={8} className="text-green mt-0.5 shrink-0" /> {r.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

export function InterviewSimulatorPage() {
  const [phase, setPhase] = useState<Phase>("hero");
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [mode, setMode] = useState<"interview" | "practice">("interview");
  const [practiceHint, setPracticeHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    return session.questions[currentQuestionIndex] || null;
  }, [session, currentQuestionIndex]);

  const progress = useMemo(() => {
    if (!session) return 0;
    return ((currentQuestionIndex) / session.questions.length) * 100;
  }, [session, currentQuestionIndex]);

  const startInterview = useCallback((role: RoleId) => {
    setSelectedRole(role);
    setPhase("config");
  }, []);

  const beginInterview = useCallback((c: InterviewConfig) => {
    setConfig(c);
    const questions = getQuestionsForRole(c.role, c.difficulty, c.questionCount, c);
    const newSession: InterviewSession = {
      id: Date.now().toString(36),
      role: c.role,
      difficulty: c.difficulty,
      config: c,
      questions,
      responses: [],
      startedAt: Date.now(),
    };
    setSession(newSession);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setAnswer("");
    setShowFeedback(false);
    setFeedback(null);
    setPhase("interview");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || !answer.trim() || !session) return;
    setIsProcessing(true);
    setShowFeedback(false);

    const result = evaluateResponse(currentQuestion, answer.trim());

    const resp: InterviewResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: answer.trim(),
      feedback: result,
      timestamp: Date.now(),
    };

    const newResponses = [...responses, resp];
    setResponses(newResponses);
    setFeedback(result);
    setShowFeedback(true);

    if (mode === "practice") {
      setIsProcessing(false);
      return;
    }

    if (currentQuestionIndex < session.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(i => i + 1);
        setAnswer("");
        setShowFeedback(false);
        setFeedback(null);
        setIsProcessing(false);
        inputRef.current?.focus();
      }, 1500);
    } else {
      const completedSession = { ...session, responses: newResponses, completedAt: Date.now() };
      setSession(completedSession);
      setHistory(prev => [...prev, completedSession]);
      setIsProcessing(false);
    }
  }, [currentQuestion, answer, session, responses, currentQuestionIndex, mode]);

  const requestHint = useCallback(() => {
    if (!currentQuestion || currentQuestion.hints.length === 0) return;
    const usedHints = answer ? currentQuestion.hints.filter(h => {
      const words = h.toLowerCase().split(" ").filter(w => w.length > 4);
      return !words.some(w => answer.toLowerCase().includes(w));
    }) : currentQuestion.hints;

    if (usedHints.length > 0) {
      setPracticeHint(usedHints[0]);
    } else {
      setPracticeHint("You've addressed all the key hints. Consider sharing specific examples from your experience.");
    }
  }, [currentQuestion, answer]);

  const nextQuestion = useCallback(() => {
    if (!session) return;
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setAnswer("");
      setShowFeedback(false);
      setFeedback(null);
      setIsProcessing(false);
      setPracticeHint(null);
      inputRef.current?.focus();
    } else {
      const completedSession = { ...session, responses, completedAt: Date.now() };
      setSession(completedSession);
      setHistory(prev => [...prev, completedSession]);
      setPhase("report");
    }
  }, [session, currentQuestionIndex, responses]);

  const finishInterview = useCallback(() => {
    if (!session) return;
    const completedSession = { ...session, responses, completedAt: Date.now() };
    setSession(completedSession);
    setHistory(prev => [...prev, completedSession]);
    setPhase("report");
  }, [session, responses]);

  const summary = useMemo(() => {
    if (!session || responses.length === 0) return null;
    const s = { ...session, responses };
    return generateInterviewSummary(s);
  }, [session, responses]);

  return (
    <PageTransition>
      <main className="min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          {phase === "hero" && (
            <>
              <HeroSection
                onStart={() => { setMode("interview"); setPhase("config"); }}
                onPractice={() => { setMode("practice"); setPhase("config"); }}
                onQuestionBank={() => setPhase("question-bank")}
              />
              <RoleSelection onSelect={(role) => startInterview(role)} onBack={() => {}} />
              {history.length > 0 && (
                <section className="mb-12">
                  <SectionHeader label="Interview History" icon={IconHistory} />
                  <div className="space-y-2">
                    {history.slice(-5).reverse().map(h => (
                      <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div>
                          <span className="text-xs font-mono text-cyan">{ROLE_LABELS[h.role]}</span>
                          <span className="text-xs font-mono text-foreground-tertiary ml-2">{h.difficulty}</span>
                          <span className="text-xs font-mono text-foreground-tertiary ml-2">{h.responses.length} questions</span>
                        </div>
                        <div className="text-xs font-mono text-foreground-tertiary">
                          {h.completedAt ? new Date(h.completedAt).toLocaleDateString() : "In progress"}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {phase === "config" && (
            <InterviewConfigPanel
              role={selectedRole || "general"}
              onStart={beginInterview}
              onBack={() => setPhase("hero")}
            />
          )}

          {phase === "question-bank" && (
            <section className="mb-12 pt-6">
              <div className="flex items-center justify-between mb-5">
                <SectionHeader label="Question Bank" icon={IconSearch} />
                <button onClick={() => setPhase("hero")} className="text-xs font-mono text-foreground-tertiary hover:text-foreground transition-colors">Back</button>
              </div>
              <div className="space-y-3">
                {(() => {
                  const cats = new Map<string, InterviewQuestion[]>();
                  for (const q of INTERVIEW_QUESTIONS) {
                    const cat = q.category.replace(/-/g, " ");
                    if (!cats.has(cat)) cats.set(cat, []);
                    cats.get(cat)!.push(q);
                  }
                  return Array.from(cats.entries()).map(([cat, qs]) => (
                    <GlassCard key={cat} className="p-4" glow="cyan" intensity="low">
                      <h3 className="text-xs font-mono text-cyan uppercase tracking-wider mb-2">{cat}</h3>
                      <div className="space-y-2">
                        {qs.slice(0, 4).map(q => (
                          <div key={q.id} className="p-2 rounded-lg bg-white/[0.02]">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-xs font-mono px-1 py-0.5 rounded bg-white/[0.04] text-foreground-tertiary uppercase">{q.type}</span>
                              <span className="text-xs font-mono text-foreground-tertiary capitalize">{q.difficulty}</span>
                              <span className="text-xs font-mono text-foreground-tertiary">{ROLE_LABELS[q.role[0]]}</span>
                            </div>
                            <p className="text-xs text-foreground/80">{q.question}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  ));
                })()}
              </div>
            </section>
          )}

          {phase === "interview" && session && currentQuestion && (
            <>
              <div className="mb-6 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconBrain size={12} className="text-cyan" />
                    <span className="text-xs font-mono text-cyan uppercase tracking-wider">{mode === "practice" ? "Practice Mode" : "Interview"} </span>
                    <span className="text-xs font-mono text-foreground-tertiary">| {ROLE_LABELS[session.role]}</span>
                    <span className="text-xs font-mono text-foreground-tertiary capitalize">| {session.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {mode === "practice" && (
                      <Button variant="ghost" size="sm" onClick={requestHint}><IconBulb size={10} /> Hint</Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={finishInterview}><IconX size={10} /> End</Button>
                  </div>
                </div>

                <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-4">
                  <motion.div className="h-full rounded-full bg-cyan" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>

                <QuestionCard question={currentQuestion} number={currentQuestionIndex + 1} total={session.questions.length} />
              </div>

              <div className="mb-3">
                <textarea
                  ref={inputRef}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={mode === "practice" ? "Type your answer here..." : "Type your response..."}
                  className="w-full min-h-[120px] p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-foreground/90 font-mono leading-relaxed resize-none outline-none focus:border-cyan/30 transition-colors placeholder:text-foreground-tertiary touch-action-manipulation"
                  style={{ minHeight: 120 }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (answer.trim()) submitAnswer(); } }}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {mode === "practice" && practiceHint && (
                      <div className="flex items-center gap-1 text-xs font-mono text-amber">
                        <IconBulb size={8} /> {practiceHint}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground-tertiary">{answer.length} chars</span>
                    <Button variant="primary" size="sm" onClick={submitAnswer} disabled={!answer.trim() || isProcessing}>
                      <IconSend size={10} /> {mode === "practice" ? "Submit" : "Submit"}
                    </Button>
                    {mode === "practice" && showFeedback && (
                      <Button variant="secondary" size="sm" onClick={nextQuestion}>
                        Next <IconArrowRight size={10} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {showFeedback && feedback && <FeedbackCard feedback={feedback} />}
            </>
          )}

          {phase === "report" && summary && session && (
            <section className="pt-6">
              <div className="flex items-center justify-between mb-5">
                <SectionHeader label="Performance Report" icon={IconFileText} />
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setPhase("hero")}><IconRefresh size={10} /> New Interview</Button>
                </div>
              </div>

              <GlassCard className="p-5 mb-4" glow="purple" intensity="low">
                <p className="text-xs text-foreground/80 leading-relaxed mb-3">{summary.summary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <AnimatedStat value={session.responses.length} label="Questions" color="#06b6d4" />
                  <AnimatedStat value={session.questions.length} label="Total Available" color="#8b5cf6" />
                  <AnimatedStat value={summary.topicsCovered.length} label="Topics" color="#f59e0b" />
                  <AnimatedStat value={summary.strengths.length} label="Strengths Found" color="#22c55e" />
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {summary.strengths.length > 0 && (
                  <GlassCard className="p-4" glow="green" intensity="low">
                    <h3 className="text-xs font-mono text-green uppercase tracking-wider mb-2.5">Strengths</h3>
                    <ul className="space-y-1">
                      {summary.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><IconCheck size={8} className="text-green mt-0.5 shrink-0" />{s}</li>
                      ))}
                    </ul>
                  </GlassCard>
                )}
                {summary.improvements.length > 0 && (
                  <GlassCard className="p-4" glow="amber" intensity="low">
                    <h3 className="text-xs font-mono text-amber uppercase tracking-wider mb-2.5">Growth Areas</h3>
                    <ul className="space-y-1">
                      {summary.improvements.map((imp, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5"><IconStar size={8} className="text-amber mt-0.5 shrink-0" />{imp}</li>
                      ))}
                    </ul>
                  </GlassCard>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {summary.recommendedProjects.length > 0 && (
                  <GlassCard className="p-4" glow="cyan" intensity="low">
                    <h3 className="text-xs font-mono text-cyan uppercase tracking-wider mb-2.5">Recommended Projects</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.recommendedProjects.map(p => (
                        <a key={p.href} href={p.href} className="text-xs font-mono px-2 py-1 rounded bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20 transition-colors">{p.title}</a>
                      ))}
                    </div>
                  </GlassCard>
                )}
                {summary.topicsCovered.length > 0 && (
                  <GlassCard className="p-4" glow="blue" intensity="low">
                    <h3 className="text-xs font-mono text-blue uppercase tracking-wider mb-2.5">Topics Covered</h3>
                    <div className="flex flex-wrap gap-1">
                      {summary.topicsCovered.map(t => (
                        <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-foreground-secondary">{t}</span>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>

              {responses.length > 0 && (
                <GlassCard className="p-4" glow="purple" intensity="low">
                  <h3 className="text-xs font-mono text-purple uppercase tracking-wider mb-3">Question History</h3>
                  <div className="space-y-3">
                    {responses.map((r, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-mono text-foreground-tertiary">Q{i + 1}</span>
                        </div>
                        <p className="text-xs text-foreground/80 mb-1">{r.question}</p>
                        <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2">{r.answer.slice(0, 200)}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-xs font-mono text-foreground-tertiary">
                  This report summarizes interview responses. It is an educational simulation, not a definitive hiring assessment.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </PageTransition>
  );
}

function AnimatedStat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
      <div className="text-lg sm:text-xl font-light tabular-nums" style={{ color }}>{value}</div>
      <div className="text-xs font-mono text-foreground-tertiary mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  );
}
