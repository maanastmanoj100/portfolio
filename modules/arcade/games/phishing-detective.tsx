"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconMail, IconShield, IconAlertTriangle, IconCheck,
  IconX, IconClock, IconBolt, IconStar, IconTrophy,
  IconRefresh, IconArrowLeft, IconFlag, IconBrain,
  IconBulb, IconFlame, IconPlayerPlay, IconAward,
  IconTarget, IconChevronDown, IconArrowRight,
} from "@tabler/icons-react";

type Difficulty = "easy" | "medium" | "hard" | "expert";
type Judgment = "safe" | "phishing" | "unsure" | null;

interface Clue {
  type: "sender" | "link" | "urgency" | "grammar" | "branding" | "domain" | "greeting" | "attachment";
  text: string;
  explanation: string;
}

interface Email {
  id: string;
  difficulty: Difficulty;
  subject: string;
  senderName: string;
  senderEmail: string;
  recipient: string;
  body: string;
  isPhishing: boolean;
  clues: Clue[];
  timeLimit: number;
}

interface CompletedEmail extends Email {
  judgment: Judgment;
  correct: boolean;
  timeMs: number;
  revealedClues: Clue[];
}

const EMAILS: Email[] = [
  // ═══ EASY ═══
  {
    id: "e1", difficulty: "easy",
    subject: "URGENT: Your Account Has Been Suspended!",
    senderName: "Security Team", senderEmail: "security@secure-bank-verify.com",
    recipient: "valued-customer@email.com",
    body: `Dear Valued Customer,

We have detected suspicious activity on your account. Your account has been temporarily suspended.

To restore access, you must verify your identity immediately by clicking the link below:

🔗 https://secure-bank-verify.com/restore

Failure to do so within 24 hours will result in permanent account closure.

Thank you,
Security Department
SecureBank™

This is an automated message. Please do not reply.`,
    isPhishing: true,
    clues: [
      { type: "urgency", text: "Urgent threat with 24-hour deadline", explanation: "Phishing emails create false urgency to pressure you into acting without thinking. Legitimate companies rarely threaten immediate account closure." },
      { type: "sender", text: "Suspicious sender domain", explanation: "The sender is 'secure-bank-verify.com' — not the bank's real domain. Scammers register lookalike domains to trick you." },
      { type: "link", text: "Fake verification link", explanation: "The link leads to 'secure-bank-verify.com', not the bank's actual website. Hover over links before clicking to verify the destination." },
      { type: "greeting", text: "Generic greeting", explanation: "The email uses 'Dear Valued Customer' instead of your name. Legitimate banks address you by name." },
    ],
    timeLimit: 30,
  },
  {
    id: "e2", difficulty: "easy",
    subject: "CONGRATULATIONS! You Have Won $1,000,000!!!",
    senderName: "Lucky Draw", senderEmail: "winner@prize-claim-center.net",
    recipient: "user@email.com",
    body: `CONGRATULATIONS!!!

You have been selected as the grand prize winner of our Million Dollar Giveaway! You have won $1,000,000 USD!

To claim your prize, please send your full name, address, bank account details, and a processing fee of $50 to:

claims@prize-claim-center.net

Hurry! This offer expires in 48 hours!

Warmest congratulations,
John Smith
Prize Claim Center`,
    isPhishing: true,
    clues: [
      { type: "urgency", text: "48-hour expiration", explanation: "Real contests don't demand immediate action or require fees. The urgency is designed to prevent you from thinking critically." },
      { type: "grammar", text: "Poor grammar and excessive punctuation", explanation: "Legitimate organizations use professional communication. Excessive exclamation marks and ALL CAPS are red flags." },
      { type: "link", text: "Requests sensitive information via email", explanation: "No legitimate contest asks for bank details or processing fees via email. This is an advance-fee scam." },
      { type: "sender", text: "Fake prize domain", explanation: "'prize-claim-center.net' is not associated with any real lottery or giveaway organization." },
    ],
    timeLimit: 25,
  },
  {
    id: "e3", difficulty: "easy",
    subject: "Your package is out for delivery",
    senderName: "ShipLogistics", senderEmail: "notifications@shiplogistics.com",
    recipient: "customer@email.com",
    body: `Hi there,

Your package #SHIP-4829-1 is out for delivery and will arrive today between 2-5 PM.

Tracking: https://shiplogistics.com/track/SHIP-4829-1

If you are not home, the driver will leave the package at your door or with a neighbor.

Thank you for choosing ShipLogistics!

— ShipLogistics Team`,
    isPhishing: false,
    clues: [
      { type: "domain", text: "Legitimate tracking domain", explanation: "The tracking link matches the sender's domain (shiplogistics.com) and leads to a legitimate tracking page." },
      { type: "sender", text: "Professional sender", explanation: "The sender address matches the company name with no suspicious variations or misspellings." },
    ],
    timeLimit: 25,
  },

  // ═══ MEDIUM ═══
  {
    id: "m1", difficulty: "medium",
    subject: "Security Alert: New Login From Unknown Device",
    senderName: "CloudShare Support", senderEmail: "security@cloudshare-security.com",
    recipient: "user@cloudshare.com",
    body: `Hello,

We detected a new sign-in to your CloudShare account from an unknown device.

📍 Location: Moscow, Russia
🕐 Time: Today at 3:14 AM
💻 Device: Chrome on Windows

If this was you, you can ignore this alert.

If this wasn't you, please secure your account immediately:
🔗 https://cloudshare-security.com/verify

CloudShare Security Team`,
    isPhishing: true,
    clues: [
      { type: "domain", text: "Lookalike security domain", explanation: "The real CloudShare uses 'cloudshare.com', not 'cloudshare-security.com'. The hyphenated domain is a spoof." },
      { type: "link", text: "Verification link leads to spoofed domain", explanation: "The 'secure your account' link goes to 'cloudshare-security.com', a fake domain designed to steal your credentials." },
      { type: "sender", text: "Mismatched sender domain", explanation: "The email comes from 'cloudshare-security.com' but your account is on 'cloudshare.com'. Legitimate alerts come from the service's actual domain." },
    ],
    timeLimit: 35,
  },
  {
    id: "m2", difficulty: "medium",
    subject: "Quick sync: project timeline update",
    senderName: "Alex Chen", senderEmail: "alex.chen@team-workspace.io",
    recipient: "team@workspace.io",
    body: `Hi team,

Just a reminder about our sync tomorrow at 10 AM. I've updated the project timeline in our shared doc.

Please review before the meeting:

https://team-workspace.io/docs/project-timeline-q3

Also, could everyone add their status updates to the doc before tomorrow?

Thanks,
Alex`,
    isPhishing: false,
    clues: [
      { type: "sender", text: "Consistent sender identity", explanation: "Alex Chen's email matches the team workspace domain and the name matches the signature." },
      { type: "link", text: "Link matches the sender's domain", explanation: "The doc link goes to 'team-workspace.io', the same domain as the sender's email. No redirection or spoofing." },
      { type: "urgency", text: "No urgent demands or threats", explanation: "The email is a normal meeting reminder with no pressure tactics, threats, or requests for sensitive information." },
    ],
    timeLimit: 35,
  },
  {
    id: "m3", difficulty: "medium",
    subject: "Your Password Will Expire in 3 Days",
    senderName: "IT Help Desk", senderEmail: "noreply@it-support-portal.net",
    recipient: "employee@company.com",
    body: `Dear Employee,

Your network password will expire in 3 days. To avoid interruption, please reset it using the link below:

🔗 https://it-support-portal.net/reset-password

This link will expire in 24 hours.

Do not share your password with anyone. IT will never ask for your password.

Thank you,
IT Support Desk`,
    isPhishing: true,
    clues: [
      { type: "domain", text: "External portal domain", explanation: "The reset link goes to 'it-support-portal.net', not your company's internal domain. Legitimate password resets happen within your company's own systems." },
      { type: "link", text: "Suspicious reset link", explanation: "Company password resets should use your internal domain (e.g., 'company.com/reset'), not an external third-party portal." },
      { type: "sender", text: "Non-company sender domain", explanation: "The email comes from 'it-support-portal.net' rather than your company's domain. IT departments email from the company domain." },
    ],
    timeLimit: 30,
  },

  // ═══ HARD ═══
  {
    id: "h1", difficulty: "hard",
    subject: "Invoice #INV-2024-8912 Attached",
    senderName: "Sarah Mitchell", senderEmail: "s.mitchell@partnernet-biz.com",
    recipient: "accountspay@company.com",
    body: `Hello,

Please find attached invoice #INV-2024-8912 for the Q3 consulting services rendered.

Total amount: $12,450.00
Due date: October 15, 2024

Please process payment at your earliest convenience and let me know if you have any questions.

Best regards,
Sarah Mitchell
Finance Department
PartnerNet Business Solutions

📎 Invoice_INV-2024-8912.pdf`,
    isPhishing: true,
    clues: [
      { type: "attachment", text: "Unexpected invoice attachment", explanation: "Invoice attachments are a common phishing vector. Always verify with the sender through a separate channel before opening attachments." },
      { type: "sender", text: "Slightly off sender identity", explanation: "The sender's email 'partnernet-biz.com' uses a hyphen. Verify if this matches known partner domains. Typosquatting is common." },
      { type: "grammar", text: "Subtle formality inconsistencies", explanation: "Professional invoices typically include a PO number, reference, or more detailed breakdown. The vagueness is a subtle red flag." },
    ],
    timeLimit: 40,
  },
  {
    id: "h2", difficulty: "hard",
    subject: "Team lunch this Friday?",
    senderName: "Marcus Johnson", senderEmail: "marcus.johnson@company.com",
    recipient: "engineering-team@company.com",
    body: `Hey everyone,

I was thinking we could do a team lunch this Friday to celebrate shipping the release. 

There's a new place downtown — "Szechuan Fusion" on 5th Street. They do group bookings.

Let me know if you're interested and I'll make a reservation for 12:30.

Also — has anyone seen the updated deployment schedule? I think we're supposed to review it before Friday's standup.

Cheers,
Marcus`,
    isPhishing: false,
    clues: [
      { type: "sender", text: "Internal company email", explanation: "Marcus's email uses the company domain and the name is consistent throughout the email." },
      { type: "domain", text: "No external links or suspicious requests", explanation: "There are no links, attachments, or requests for credentials. The email is purely social with a work-related question." },
    ],
    timeLimit: 30,
  },
  {
    id: "h3", difficulty: "hard",
    subject: "Your Netflix Subscription Has Been Upgraded",
    senderName: "Netflix", senderEmail: "billing@netflix-subscription.net",
    recipient: "user@gmail.com",
    body: `Hi,

Your Netflix subscription has been upgraded to Premium Ultra plan ($23.99/month).

If you made this change, no action is needed.

If you did NOT authorize this upgrade, please cancel immediately:
🔗 https://netflix-subscription.net/cancel

You will be charged the new rate starting next billing cycle.

— Netflix Billing Team`,
    isPhishing: true,
    clues: [
      { type: "domain", text: "Fake Netflix domain", explanation: "Netflix sends emails from 'netflix.com', not 'netflix-subscription.net'. The hyphenated subdomain is a phishing tactic." },
      { type: "link", text: "Cancel link goes to fraudulent domain", explanation: "The cancellation link leads to 'netflix-subscription.net', a credential harvesting site designed to look like Netflix." },
      { type: "urgency", text: "Implicit urgency with financial threat", explanation: "The email creates urgency by implying you'll be charged if you don't act. Netflix communicates billing changes through their platform, not via email." },
    ],
    timeLimit: 40,
  },

  // ═══ EXPERT ═══
  {
    id: "x1", difficulty: "expert",
    subject: "Q4 Board Meeting — Agenda Review",
    senderName: "Board Secretary", senderEmail: "secretary@board-company.com",
    recipient: "directors@company.com",
    body: `Dear Board Members,

Please find the preliminary agenda for the Q4 board meeting scheduled for November 15th.

https://board-company.com/agenda/q4-prelim

Topics include:
• Q4 Financial Review
• Strategic Initiative Updates
• Committee Reports
• New Business

Please submit any additional agenda items to the secretary by November 1st.

Regards,
Board Secretary`,
    isPhishing: false,
    clues: [
      { type: "sender", text: "Matches company branding", explanation: "The email uses a consistent subdomain (board-company.com) for board communications, which is a common pattern for corporate governance." },
      { type: "link", text: "Domain matches sender", explanation: "The agenda link goes to 'board-company.com', the same domain as the sender's email. No redirection or mismatched domains." },
      { type: "urgency", text: "Professional tone, no pressure", explanation: "The email is informational with reasonable deadlines and no threats, urgent demands, or requests for sensitive information." },
    ],
    timeLimit: 30,
  },
  {
    id: "x2", difficulty: "expert",
    subject: "Action Required: DocuSign — Compensation Agreement",
    senderName: "HR Department", senderEmail: "hr@cornpany.com",
    recipient: "employee@cornpany.com",
    body: `Hi,

Please review and sign the updated compensation agreement for the current fiscal year.

📄 https://docusign.cornpany.com/agreement/comp-2024

This document outlines your salary, benefits, and equity package. Please sign by end of week.

If you have questions, contact your HR representative directly.

This is a confidential document. Please do not forward.

Best,
HR Department`,
    isPhishing: true,
    clues: [
      { type: "domain", text: "Typosquatted domain", explanation: "Look closely at 'cornpany.com' — it has an 'r' before the 'n'. The real company name would be spelled correctly. This is a typosquatting attack." },
      { type: "link", text: "Spoofed DocuSign link", explanation: "The DocuSign link goes to a subdomain of 'cornpany.com', not the real DocuSign domain. Real DocuSign documents come from 'docusign.com' or 'docusign.net'." },
      { type: "sender", text: "Email domain matches the fake domain", explanation: "The sender's email also uses the typosquatted domain. This is a coordinated phishing campaign targeting the company." },
    ],
    timeLimit: 45,
  },
  {
    id: "x3", difficulty: "expert",
    subject: "Updated health insurance enrollment",
    senderName: "Benefits Team", senderEmail: "benefits@company-benefits-portal.com",
    recipient: "all-staff@company.com",
    body: `Hi everyone,

Open enrollment for health insurance has been extended to November 30th.

To review your options and make changes, visit:

https://company-benefits-portal.com/enroll

Changes made after November 30th will take effect in the new plan year.

Please review your current coverage and select the plan that best fits your needs.

Benefits Team`,
    isPhishing: true,
    clues: [
      { type: "domain", text: "Third-party benefits portal", explanation: "Legitimate benefits enrollment typically happens through an internal HR system or a well-known benefits provider, not a generic 'company-benefits-portal.com' domain." },
      { type: "link", text: "External portal not matching known benefits system", explanation: "If your company uses a specific benefits provider, the link should go there. Always verify benefits portals through official internal communications." },
      { type: "sender", text: "Sender domain mismatch", explanation: "The email comes from 'company-benefits-portal.com' rather than the company's standard HR domain. Benefits teams usually email from the company domain." },
    ],
    timeLimit: 45,
  },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; multiplier: number }> = {
  easy: { label: "Easy", color: "text-green-400", multiplier: 1 },
  medium: { label: "Medium", color: "text-amber-400", multiplier: 1.5 },
  hard: { label: "Hard", color: "text-red-400", multiplier: 2 },
  expert: { label: "Expert", color: "text-purple-400", multiplier: 3 },
};

type GamePhase = "menu" | "inbox" | "email" | "result" | "summary";

interface GameState {
  phase: GamePhase;
  currentIndex: number;
  emails: Email[];
  completed: CompletedEmail[];
  score: number;
  streak: number;
  bestStreak: number;
  startTime: number;
  emailStartTime: number;
  totalCorrect: number;
  totalSeen: number;
  difficulty: Difficulty;
}

const EMAILS_PER_ROUND = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PhishingDetective() {
  const [game, setGame] = useState<GameState>({
    phase: "menu", currentIndex: 0, emails: [], completed: [],
    score: 0, streak: 0, bestStreak: 0, startTime: 0,
    emailStartTime: 0, totalCorrect: 0, totalSeen: 0,
    difficulty: "medium",
  });
  const [selectedJudgment, setSelectedJudgment] = useState<Judgment>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [showInbox, setShowInbox] = useState(true);
  const [animateEmail, setAnimateEmail] = useState(false);

  const startGame = useCallback((difficulty: Difficulty) => {
    const difficultyEmails = EMAILS.filter(e => e.difficulty === difficulty);
    const shuffled = shuffle(difficultyEmails).slice(0, EMAILS_PER_ROUND);
    setGame({
      phase: "inbox", currentIndex: 0, emails: shuffled, completed: [],
      score: 0, streak: 0, bestStreak: 0, startTime: Date.now(),
      emailStartTime: 0, totalCorrect: 0, totalSeen: 0,
      difficulty,
    });
  }, []);

  const currentEmail = game.emails[game.currentIndex];
  const isLastEmail = game.currentIndex >= game.emails.length - 1;
  const config = DIFFICULTY_CONFIG[game.difficulty];

  const openEmail = useCallback(() => {
    setShowInbox(false);
    setAnimateEmail(true);
    setSelectedJudgment(null);
    setShowResult(false);
    setSelectedClue(null);
    setTimeout(() => {
      setAnimateEmail(false);
      setGame(prev => ({ ...prev, phase: "email", emailStartTime: Date.now() }));
    }, 500);
  }, []);

  const submitJudgment = useCallback((judgment: Judgment) => {
    if (showResult) return;
    setSelectedJudgment(judgment);
    setShowResult(true);

    const timeMs = Date.now() - game.emailStartTime;
    const correct = judgment === "phishing" ? currentEmail.isPhishing : judgment === "safe" ? !currentEmail.isPhishing : currentEmail.isPhishing;

    const timeBonus = Math.max(0, Math.round((currentEmail.timeLimit * 1000 - timeMs) / 1000 * 5));
    const basePoints = correct ? 100 * config.multiplier : -50;
    const streakBonus = correct ? game.streak * 10 : 0;
    const points = basePoints + (correct ? timeBonus + streakBonus : 0);

    setGame(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        score: Math.max(0, prev.score + points),
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        totalSeen: prev.totalSeen + 1,
        completed: [...prev.completed, {
          ...currentEmail,
          judgment,
          correct,
          timeMs,
          revealedClues: currentEmail.clues,
        }],
      };
    });
  }, [currentEmail, game.emailStartTime, game.streak, config.multiplier, showResult]);

  const nextEmail = useCallback(() => {
    if (isLastEmail) {
      setGame(prev => ({ ...prev, phase: "summary" }));
    } else {
      setGame(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
      setShowInbox(true);
      setShowResult(false);
      setSelectedJudgment(null);
      setSelectedClue(null);
    }
  }, [isLastEmail]);

  const accuracy = game.totalSeen > 0 ? Math.round((game.totalCorrect / game.totalSeen) * 100) : 0;

  const achievements = useMemo(() => {
    const list: { label: string; unlocked: boolean; icon: typeof IconStar }[] = [];
    list.push({ label: "First Catch", unlocked: game.totalCorrect >= 1, icon: IconTarget });
    list.push({ label: "Perfect Round", unlocked: game.completed.length === 6 && game.completed.every(e => e.correct), icon: IconAward });
    list.push({ label: "Streak Master", unlocked: game.bestStreak >= 3, icon: IconFlame });
    list.push({ label: "Speed Reader", unlocked: game.completed.some(e => e.timeMs < 8000 && e.correct), icon: IconBolt });
    list.push({ label: "Expert Eye", unlocked: game.difficulty === "expert" && game.totalCorrect >= 4, icon: IconBrain });
    return list;
  }, [game]);

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-2">
              <IconShield size={12} /> Phishing Detective
            </div>
            <h1 className="text-lg sm:text-xl font-bold">Spot the Phish</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Identify phishing emails and learn to spot the clues</p>
          </div>
        </div>

          {/* Score Bar */}
        {game.phase !== "menu" && (
          <GlassCard glow="none" className="p-3 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[10px] sm:text-xs font-mono">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Score: <span className="text-cyan-400 font-bold">{game.score}</span></span>
                <span>Streak: <span className="text-orange-400 font-bold">{game.streak}</span></span>
                <span>Accuracy: <span className="text-green-400 font-bold">{accuracy}%</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("px-2 py-0.5 rounded-full text-xs", config.color + " bg-white/5")}>{config.label}</span>
                <span>{game.currentIndex + 1}/{game.emails.length}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all" style={{ width: `${((game.currentIndex + (showResult ? 1 : 0)) / game.emails.length) * 100}%` }} />
            </div>
          </GlassCard>
        )}

        {/* Menu */}
        {game.phase === "menu" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <IconShield size={40} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Phishing Detective</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Analyze emails and decide if they&apos;re safe or phishing. Each email contains hidden clues — 
              learn to spot them all. Choose your difficulty level to begin.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
              {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, cfg]) => (
                <button key={key} onClick={() => startGame(key)}
                  style={{ touchAction: "manipulation" }}
                  className={cn("p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all text-center min-h-[80px]",
                    cfg.color + " border-white/10 hover:border-white/20")}>
                  <div className="text-lg font-bold">{cfg.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">×{cfg.multiplier} points</div>
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🛡️ 6 emails per round · No real credentials used</p>
              <p>🎯 All examples are educational simulations</p>
            </div>
          </motion.div>
        )}

        {/* Inbox View */}
        {game.phase === "inbox" && showInbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-2 mb-4">
              <h2 className="text-sm font-semibold">Inbox ({game.emails.length - game.completed.length} unread)</h2>
              {game.emails.slice(game.currentIndex).map((email, idx) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <GlassCard
                    glow="none"
                    className={cn("p-3 cursor-pointer transition-all border-white/5 hover:border-cyan-500/20",
                      idx === 0 && "border-cyan-500/30 bg-cyan-500/5")}
                    onClick={idx === 0 ? openEmail : undefined}
                    style={idx === 0 ? { touchAction: "manipulation" } : undefined}
                  >
                    <div className="flex items-start gap-3 min-h-[44px]">
                      <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0",
                        email.isPhishing ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400")}>
                        {email.senderName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-xs font-medium", idx === 0 ? "text-foreground" : "text-muted-foreground")}>{email.senderName}</span>
                          <span className="text-xs text-muted-foreground">Now</span>
                        </div>
                        <div className={cn("text-xs sm:text-sm truncate", idx === 0 ? "font-semibold" : "text-muted-foreground")}>{email.subject}</div>
                        <div className="text-xs text-muted-foreground truncate">{email.body.split("\n").find(l => l.trim())}</div>
                      </div>
                      {idx === 0 && <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2" />}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Email Opening Animation */}
        <AnimatePresence>
          {animateEmail && (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-6xl"
              >
                <IconMail size={64} className="text-cyan-400" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Detail View */}
        {game.phase === "email" && currentEmail && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => { setShowInbox(true); setGame(prev => ({ ...prev, phase: "inbox" })); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 transition-all min-h-[44px]" style={{ touchAction: "manipulation" }}>
              <IconArrowLeft size={14} /> Back to inbox
            </button>

            <GlassCard glow="none" className="p-4 sm:p-6">
              {/* Email Header */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-white/5">
                <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0",
                  currentEmail.isPhishing ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400")}>
                  {currentEmail.senderName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-semibold break-words">{currentEmail.subject}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 break-all">
                    From: <span className={cn(showResult && currentEmail.isPhishing && "text-red-400")}>{currentEmail.senderName} &lt;{currentEmail.senderEmail}&gt;</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground break-all">To: {currentEmail.recipient}</div>
                </div>
                <div className={cn("text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full shrink-0", config.color + " bg-white/5")}>
                  {config.label}
                </div>
              </div>

              {/* Email Body */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono text-muted-foreground mb-6 break-words">
                {currentEmail.body}
              </div>

              {/* Judgment Buttons */}
              {!showResult && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 justify-center">
                  <button onClick={() => submitJudgment("safe")}
                    style={{ touchAction: "manipulation" }}
                    className="px-4 py-3 sm:px-6 sm:py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px]">
                    <IconShield size={16} /> Safe
                  </button>
                  <button onClick={() => submitJudgment("unsure")}
                    style={{ touchAction: "manipulation" }}
                    className="px-4 py-3 sm:px-6 sm:py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px]">
                    <IconAlertTriangle size={16} /> Unsure
                  </button>
                  <button onClick={() => submitJudgment("phishing")}
                    style={{ touchAction: "manipulation" }}
                    className="px-4 py-3 sm:px-6 sm:py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px]">
                    <IconFlag size={16} /> Phishing
                  </button>
                </div>
              )}

              {/* Result & Clues */}
              {showResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Verdict */}
                  <div className={cn("p-4 rounded-xl text-center border",
                    selectedJudgment === "phishing" && currentEmail.isPhishing ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    selectedJudgment === "safe" && !currentEmail.isPhishing ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    "bg-red-500/10 border-red-500/20 text-red-400")}>
                    <div className="text-lg font-bold">
                      {selectedJudgment === "phishing" && currentEmail.isPhishing ? "✓ Correct! This is phishing." :
                       selectedJudgment === "safe" && !currentEmail.isPhishing ? "✓ Correct! This is safe." :
                       selectedJudgment === "unsure" && currentEmail.isPhishing ? "This is phishing — trust your instincts!" :
                       selectedJudgment === "unsure" && !currentEmail.isPhishing ? "This is safe — good to be cautious!" :
                       "✗ Incorrect"}
                    </div>
                    <div className="text-xs mt-1 opacity-80">
                      {currentEmail.isPhishing ? "This email contains phishing indicators." : "This email is legitimate."}
                    </div>
                  </div>

                  {/* Clue Cards */}
                  <div>
                    <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                      <IconBulb size={12} className="text-amber-400" /> Clue Analysis
                    </h3>
                    <div className="space-y-2">
                      {currentEmail.clues.map((clue, idx) => (
                        <div key={idx}>
                          <button onClick={() => setSelectedClue(selectedClue === idx ? null : idx)}
                            className={cn("w-full text-left p-3 rounded-xl border transition-all text-sm flex items-start gap-2",
                              selectedClue === idx ? "bg-cyan-500/10 border-cyan-500/20" : "bg-white/5 border-white/10 hover:border-white/20")}>
                            <span className={cn("text-xs px-1.5 py-0.5 rounded font-mono shrink-0 mt-0.5",
                              clue.type === "sender" ? "bg-red-500/10 text-red-400" :
                              clue.type === "link" ? "bg-purple-500/10 text-purple-400" :
                              clue.type === "urgency" ? "bg-orange-500/10 text-orange-400" :
                              clue.type === "grammar" ? "bg-yellow-500/10 text-yellow-400" :
                              clue.type === "branding" ? "bg-blue-500/10 text-blue-400" :
                              clue.type === "domain" ? "bg-pink-500/10 text-pink-400" :
                              clue.type === "greeting" ? "bg-cyan-500/10 text-cyan-400" :
                              "bg-gray-500/10 text-gray-400")}>
                              {clue.type}
                            </span>
                            <span className="text-muted-foreground">{clue.text}</span>
                            <IconChevronDown size={14} className={cn("shrink-0 mt-0.5 text-muted-foreground transition-transform", selectedClue === idx && "rotate-180")} />
                          </button>
                          <AnimatePresence>
                            {selectedClue === idx && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden">
                                <div className="p-3 text-xs text-muted-foreground bg-white/[0.02] rounded-b-xl border-x border-b border-white/5 flex items-start gap-2">
                                  <IconBrain size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                                  {clue.explanation}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-center pt-2">
                    <Button variant="primary" size="md" onClick={nextEmail} className="w-full sm:w-auto min-h-[44px]" style={{ touchAction: "manipulation" }}>
                      {isLastEmail ? "View Results" : "Next Email"}
                      <IconArrowRight size={14} className="ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Summary */}
        {game.phase === "summary" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard glow="cyan" className="p-8 text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <IconTrophy size={32} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Round Complete!</h2>
              <p className="text-sm text-muted-foreground mb-6">Here&apos;s how you did</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto mb-6">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-xl font-bold text-cyan-400">{game.score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-xl font-bold text-green-400">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-xl font-bold text-orange-400">{game.bestStreak}</div>
                  <div className="text-xs text-muted-foreground">Best Streak</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-xl font-bold text-purple-400">{game.difficulty}</div>
                  <div className="text-xs text-muted-foreground">Difficulty</div>
                </div>
              </div>
            </GlassCard>

            {/* Achievements */}
            <GlassCard glow="none" className="p-6 mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <IconAward size={14} className="text-amber-400" /> Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {achievements.map((a, i) => (
                  <div key={i} className={cn("p-3 rounded-xl border text-center transition-all",
                    a.unlocked ? "bg-white/5 border-white/10" : "bg-white/[0.02] border-white/5 opacity-40")}>
                    <div className={cn("flex justify-center mb-1", a.unlocked ? "text-cyan-400" : "text-muted-foreground")}>
                      <a.icon size={18} />
                    </div>
                    <div className="text-xs font-mono">{a.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Review */}
            <GlassCard glow="none" className="p-6 mb-6">
              <h3 className="text-sm font-semibold mb-3">Email Review</h3>
              <div className="space-y-2">
                {game.completed.map((email, idx) => (
                  <div key={email.id} className={cn("p-3 rounded-xl border text-xs flex items-center gap-3",
                    email.correct ? "bg-green-500/[0.03] border-green-500/10" : "bg-red-500/[0.03] border-red-500/10")}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      email.correct ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                      {email.correct ? <IconCheck size={12} /> : <IconX size={12} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{email.subject}</div>
                      <div className="text-muted-foreground">{email.isPhishing ? "Phishing" : "Safe"} · {email.judgment} · {(email.timeMs / 1000).toFixed(1)}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="primary" size="md" onClick={() => startGame(game.difficulty)} className="w-full sm:w-auto min-h-[44px]" style={{ touchAction: "manipulation" }}>
                <IconRefresh size={14} className="mr-1.5" /> Play Again
              </Button>
              <Button variant="glass" size="md" onClick={() => setGame(prev => ({ ...prev, phase: "menu" }))} className="w-full sm:w-auto min-h-[44px]" style={{ touchAction: "manipulation" }}>
                Change Difficulty
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
