"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  articles, categories, cheatSheets, securityTools,
  mitreTechniques, learningPaths, owaspTopics,
  getArticleById, getArticlesByCategory, getFeaturedArticles,
  searchArticles, CATEGORY_LABELS,
  type WikiArticle, type WikiCategory,
} from "./wiki-data";
import { WikiDiagram } from "./wiki-diagrams";
import {
  IconBooks, IconSearch, IconX, IconBook, IconCode,
  IconWorld, IconCloud, IconShield, IconTarget,
  IconRoute, IconNetwork, IconTerminal2, IconLock,
  IconBrain, IconStar, IconArrowLeft, IconList,
  IconChevronRight, IconBookmark, IconBookmarkFilled,
  IconPrinter, IconDownload, IconMessage2, IconEye,
  IconEyeOff, IconStarFilled, IconCategory, IconFileText,
  IconServer, IconBrandWindows, IconCpu, IconDatabase,
  IconFlag, IconKey, IconLockAccess, IconShieldCheck,
  IconCheck, IconMenu2, IconFileDescription,
  IconFilterSearch,
} from "@tabler/icons-react";

type ViewMode = "explore" | "article" | "search" | "cheatsheets" | "tools" | "mitre" | "owasp" | "paths";

const CATEGORY_ICONS: Record<string, typeof IconBooks> = {
  networking: IconNetwork, linux: IconTerminal2, windows: IconBrandWindows,
  programming: IconCode, python: IconCode, "web-security": IconWorld,
  owasp: IconShield, "cloud-security": IconCloud, containers: IconServer,
  docker: IconCpu, kubernetes: IconCpu, soc: IconShieldCheck,
  "threat-hunting": IconTarget, "digital-forensics": IconDatabase,
  "incident-response": IconFlag, "malware-analysis": IconBrain,
  cryptography: IconLock, osint: IconEye, "reverse-engineering": IconCode,
  "active-directory": IconServer, siem: IconFilterSearch,
  "mitre-attack": IconTarget, "security-tools": IconLockAccess,
  devsecops: IconCode, "ai-security": IconBrain,
  "career-development": IconStar, "research-notes": IconFileText,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-green-400 border-green-500/20 bg-green-500/10",
  intermediate: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  advanced: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  expert: "text-red-400 border-red-500/20 bg-red-500/10",
};

function HeroSection({ searchQuery, setSearchQuery, onSearch }: {
  searchQuery: string; setSearchQuery: (q: string) => void; onSearch: (q: string) => void;
}) {
  return (
    <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconBooks size={14} />Chapter 26 — Learning Encyclopedia
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Knowledge Wiki
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore cybersecurity concepts, technologies, methodologies, and learning resources connected directly to projects, labs, and practical experience.
          </p>
          <div className="max-w-xl mx-auto relative">
            <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search articles, tools, techniques..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch(searchQuery)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryGrid({ onSelectCategory, onSelectArticle }: {
  onSelectCategory: (cat: WikiCategory) => void; onSelectArticle: (id: string) => void;
}) {
  const featured = getFeaturedArticles();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-12">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || IconBooks;
          return (
            <motion.button key={cat.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.id)}
              className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group">
              <Icon size={18} className="text-cyan-400 mb-1.5" />
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{cat.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{cat.articleCount} articles</div>
              <span className={cn("text-xs px-1 py-0.5 rounded-full mt-1 inline-block", DIFFICULTY_COLORS[cat.difficulty])}>
                {cat.difficulty}
              </span>
            </motion.button>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <IconStarFilled size={18} className="text-amber-400" />
        Featured Articles
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {featured.map((article, i) => (
          <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard glow="none" onClick={() => onSelectArticle(article.id)} className="cursor-pointer h-full hover:border-cyan-500/30 transition-colors">
              <div className="flex items-start gap-2 mb-2">
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", DIFFICULTY_COLORS[article.difficulty])}>
                  {article.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">{article.readingTime} min</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{article.title}</h3>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{article.summary}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {article.keyConcepts.slice(0, 3).map((k) => (
                  <span key={k} className="text-xs px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">{k}</span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <GlassCard glow="cyan" intensity="low" onClick={() => onSelectCategory("networking")} className="cursor-pointer">
          <div className="flex items-center gap-2"><IconTerminal2 size={16} className="text-cyan-400" /><h3 className="text-sm font-semibold text-white">Cheat Sheets</h3></div>
          <p className="text-xs text-muted-foreground mt-1">{cheatSheets.length} quick reference guides</p>
        </GlassCard>
        <GlassCard glow="purple" intensity="low" onClick={() => onSelectCategory("security-tools")} className="cursor-pointer">
          <div className="flex items-center gap-2"><IconShieldCheck size={16} className="text-purple-400" /><h3 className="text-sm font-semibold text-white">Security Tools</h3></div>
          <p className="text-xs text-muted-foreground mt-1">{securityTools.length} tool profiles</p>
        </GlassCard>
        <GlassCard glow="amber" intensity="low" onClick={() => onSelectCategory("mitre-attack")} className="cursor-pointer">
          <div className="flex items-center gap-2"><IconTarget size={16} className="text-amber-400" /><h3 className="text-sm font-semibold text-white">Learning Paths</h3></div>
          <p className="text-xs text-muted-foreground mt-1">{learningPaths.length} structured progressions</p>
        </GlassCard>
      </div>
    </div>
  );
}

function ArticleSidebar({ article, activeSection, onSectionClick, onClose }: {
  article: WikiArticle; activeSection: number; onSectionClick: (i: number) => void; onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white mb-4">
        <IconArrowLeft size={14} /> Back to Explorer
      </button>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Sections</div>
        {article.sections.map((s, i) => (
          <button key={i} onClick={() => onSectionClick(i)}
            className={cn("block w-full text-left text-xs py-1 px-2 rounded transition-colors",
              activeSection === i ? "text-cyan-400 bg-cyan-500/10" : "text-muted-foreground hover:text-white")}>
            {s.title}
          </button>
        ))}
      </div>
      <div className="pt-4 border-t border-white/5 space-y-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Details</div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Difficulty: <span className="text-white">{article.difficulty}</span></div>
          <div>Reading: <span className="text-white">{article.readingTime} min</span></div>
          <div>Updated: <span className="text-white">{article.lastUpdated}</span></div>
          <div>Category: <span className="text-white">{CATEGORY_LABELS[article.category]}</span></div>
        </div>
      </div>
      {article.prerequisites.length > 0 && (
        <div className="pt-4 border-t border-white/5">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Prerequisites</div>
          <div className="space-y-1">
            {article.prerequisites.map((p) => (
              <div key={p} className="text-xs text-muted-foreground flex items-center gap-1">
                <IconChevronRight size={10} className="text-cyan-500/50" /> {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RelatedConnections({ article }: { article: WikiArticle }) {
  const hasAny = article.relatedProjects.length > 0 || article.relatedLabs.length > 0 || article.relatedCTFs.length > 0 ||
    article.relatedCertifications.length > 0 || article.relatedBlogPosts.length > 0 || article.relatedSkills.length > 0 ||
    article.relatedTools.length > 0 || article.mitreTechniques.length > 0 || article.owaspTopics.length > 0;
  if (!hasAny) return null;

  return (
    <GlassCard glow="blue" intensity="low">
      <div className="flex items-center gap-2 mb-3"><IconNetwork size={16} className="text-blue-400" /><h3 className="text-sm font-semibold text-white">Related Connections</h3></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {article.relatedProjects.length > 0 && (
          <div><div className="text-muted-foreground mb-0.5">Projects</div>{article.relatedProjects.map((p) => (<span key={p} className="inline-block px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 mr-1 mb-0.5">{p}</span>))}</div>
        )}
        {article.relatedLabs.length > 0 && (
          <div><div className="text-muted-foreground mb-0.5">Labs</div>{article.relatedLabs.map((l) => (<span key={l} className="inline-block px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 mr-1 mb-0.5">{l}</span>))}</div>
        )}
        {article.relatedCertifications.length > 0 && (
          <div><div className="text-muted-foreground mb-0.5">Certifications</div>{article.relatedCertifications.map((c) => (<span key={c} className="inline-block px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 mr-1 mb-0.5">{c}</span>))}</div>
        )}
        {article.relatedSkills.length > 0 && (
          <div><div className="text-muted-foreground mb-0.5">Skills</div>{article.relatedSkills.map((s) => (<span key={s} className="inline-block px-1.5 py-0.5 rounded bg-green-500/10 text-green-300 mr-1 mb-0.5">{s}</span>))}</div>
        )}
        {article.relatedTools.length > 0 && (
          <div><div className="text-muted-foreground mb-0.5">Tools</div>{article.relatedTools.map((t) => (<span key={t} className="inline-block px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 mr-1 mb-0.5">{t}</span>))}</div>
        )}
        {article.relatedCTFs.length > 0 && (
          <div><div className="text-muted-foreground mb-0.5">CTFs</div>{article.relatedCTFs.map((c) => (<span key={c} className="inline-block px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 mr-1 mb-0.5">{c}</span>))}</div>
        )}
      </div>
    </GlassCard>
  );
}

function ArticleViewer({ article, onClose }: { article: WikiArticle; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.findIndex((ref) => ref === e.target);
            if (idx >= 0) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );
    sectionRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white">
          <IconArrowLeft size={14} /> Back
        </button>
        <div className="h-3 w-px bg-white/10" />
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full", DIFFICULTY_COLORS[article.difficulty])}>{article.difficulty}</span>
        <span className="text-xs text-muted-foreground">{article.readingTime} min read</span>
        <span className="text-xs text-muted-foreground">{article.lastUpdated}</span>
        <button onClick={() => setShowSidebar(!showSidebar)} className="ml-auto text-muted-foreground hover:text-white lg:hidden">
          <IconMenu2 size={16} />
        </button>
      </div>

      <div className="flex gap-8">
        <div className={cn("hidden lg:block w-56 shrink-0", !showSidebar && "lg:hidden")}>
          <div className="sticky top-24">
            <ArticleSidebar article={article} activeSection={activeSection} onSectionClick={(i) => {
              setActiveSection(i);
              sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
            }} onClose={onClose} />
          </div>
        </div>

        <div ref={contentRef} className="flex-1 min-w-0 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{article.title}</h1>
            <p className="text-sm text-muted-foreground mb-6">{article.summary}</p>

            {article.isOriginalResearch && (
              <div className="mb-4 p-2 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-xs text-green-300/80"><IconStar size={12} className="inline mr-1" />Original research — based on personal study and practical experience.</p>
              </div>
            )}
            {article.sourceAttribution && (
              <div className="mb-4 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <p className="text-xs text-amber-300/70">{article.sourceAttribution}</p>
              </div>
            )}

            {article.keyConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {article.keyConcepts.map((k) => (<span key={k} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/5">{k}</span>))}
              </div>
            )}

            <div className="space-y-6">
              {article.sections.map((section, i) => (
                <div key={i} ref={(el) => { sectionRefs.current[i] = el; }} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold text-white mb-2">{section.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                  {section.diagram && <WikiDiagram id={section.diagram} />}
                </div>
              ))}
            </div>

            {article.practicalExamples.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-3">Practical Examples</h2>
                <div className="space-y-2">
                  {article.practicalExamples.map((ex, i) => (
                    <div key={i} className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <div className="flex items-start gap-2">
                        <IconTerminal2 size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{ex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {article.commonMistakes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-3">Common Mistakes</h2>
                <div className="space-y-2">
                  {article.commonMistakes.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <IconX size={12} className="text-red-400 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {article.bestPractices.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-3">Best Practices</h2>
                <div className="space-y-2">
                  {article.bestPractices.map((bp, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <IconCheck size={12} className="text-green-400 mt-0.5 shrink-0" />
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <RelatedConnections article={article} />
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <IconFileText size={12} /> Last updated: {article.lastUpdated}
              {article.readingTime > 0 && <><span>·</span><span>Estimated reading time: {article.readingTime} minutes</span></>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SearchResults({ query, onSelectArticle, onClose }: {
  query: string; onSelectArticle: (id: string) => void; onClose: () => void;
}) {
  const results = useMemo(() => searchArticles(query), [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Search Results</h2>
          <p className="text-xs text-muted-foreground">{results.length} results for "{query}"</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconX size={16} /></button>
      </div>
      {results.length === 0 ? (
        <GlassCard glow="none"><div className="text-center py-8 text-sm text-muted-foreground">No articles match your search. Try different keywords.</div></GlassCard>
      ) : (
        <div className="space-y-2">
          {results.map((article) => (
            <GlassCard key={article.id} glow="none" onClick={() => onSelectArticle(article.id)} className="cursor-pointer hover:border-cyan-500/30 transition-colors">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{article.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{article.summary}</p>
                </div>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", DIFFICULTY_COLORS[article.difficulty])}>{article.difficulty}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function CheatSheetsView({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconArrowLeft size={16} /></button>
        <h2 className="text-2xl font-bold text-white">Cheat Sheets</h2>
        <span className="text-xs text-muted-foreground">{cheatSheets.length} references</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {cheatSheets.map((cs) => (
          <GlassCard key={cs.id} glow={expanded === cs.id ? "cyan" : "none"} intensity="low" onClick={() => setExpanded(expanded === cs.id ? null : cs.id)} className="cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">{cs.title}</h3>
              <span className="text-xs text-muted-foreground capitalize">{cs.category}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {cs.content.map((c) => (<span key={c} className="text-xs px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">{c}</span>))}
            </div>
            {expanded === cs.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <div className="border-t border-white/5 pt-2 mt-2 space-y-1">
                  {cs.commands.map((cmd, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <code className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-300 font-mono shrink-0">{cmd.cmd}</code>
                      <span className="text-muted-foreground">{cmd.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ToolsView({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconArrowLeft size={16} /></button>
        <h2 className="text-2xl font-bold text-white">Security Tool Library</h2>
        <span className="text-xs text-muted-foreground">{securityTools.length} tools</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {securityTools.map((tool) => (
          <GlassCard key={tool.id} glow={expanded === tool.id ? "purple" : "none"} intensity="low" onClick={() => setExpanded(expanded === tool.id ? null : tool.id)} className="cursor-pointer">
            <div className="flex items-start gap-3 mb-2">
              <IconShieldCheck size={20} className="text-purple-400 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">{tool.name}</h3>
                <p className="text-xs text-muted-foreground">{tool.purpose}</p>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 capitalize">{tool.category}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tool.commonUseCases.map((u) => (<span key={u} className="text-xs px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">{u}</span>))}
            </div>
            {expanded === tool.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <div className="border-t border-white/5 pt-2 mt-2 space-y-2">
                  <div><div className="text-xs text-muted-foreground mb-1">Best Practices</div>{tool.bestPractices.map((bp) => (<div key={bp} className="flex items-start gap-1.5 text-xs text-muted-foreground"><IconCheck size={10} className="text-green-400 mt-0.5 shrink-0" />{bp}</div>))}</div>
                  <div><div className="text-xs text-muted-foreground mb-1">Related Labs</div><div className="flex flex-wrap gap-1">{tool.relatedLabs.map((l) => (<span key={l} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">{l}</span>))}</div></div>
                </div>
              </motion.div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function MitreView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconArrowLeft size={16} /></button>
        <h2 className="text-2xl font-bold text-white">MITRE ATT&CK Knowledge</h2>
        <span className="text-xs text-muted-foreground">{mitreTechniques.length} techniques</span>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Common adversary techniques with detection and mitigation guidance. Original educational content based on the MITRE ATT&CK framework.</p>
      <div className="space-y-2">
        {mitreTechniques.map((t) => (
          <GlassCard key={t.id} glow="none">
            <div className="flex items-start gap-2">
              <IconTarget size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300">{t.tactic}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{t.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <div className="text-xs">Detection: <span className="text-cyan-300">{t.detection}</span></div>
                  <div className="text-xs">Mitigation: <span className="text-green-300">{t.mitigation}</span></div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function OwaspView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconArrowLeft size={16} /></button>
        <h2 className="text-2xl font-bold text-white">OWASP Learning Hub</h2>
        <span className="text-xs text-muted-foreground">{owaspTopics.length} topics</span>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Web application security risks based on the OWASP Top 10. Each topic includes risk assessment and mitigation strategies.</p>
      <div className="grid md:grid-cols-2 gap-3">
        {owaspTopics.map((t) => (
          <GlassCard key={t.id} glow="none">
            <div className="flex items-start gap-2">
              <IconShield size={14} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">{t.description}</p>
                <div className="space-y-0.5 text-xs">
                  <div>Risk: <span className="text-red-300">{t.risk}</span></div>
                  <div>Mitigation: <span className="text-green-300">{t.mitigation}</span></div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function LearningPathsView({ onClose, onSelectArticle }: { onClose: () => void; onSelectArticle: (id: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconArrowLeft size={16} /></button>
        <h2 className="text-2xl font-bold text-white">Learning Paths</h2>
        <span className="text-xs text-muted-foreground">{learningPaths.length} paths</span>
      </div>
      <div className="space-y-3">
        {learningPaths.map((path) => (
          <GlassCard key={path.id} glow={expanded === path.id ? "cyan" : "none"} intensity="low">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{path.title}</h3>
                <p className="text-xs text-muted-foreground">{path.description}</p>
              </div>
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", DIFFICULTY_COLORS[path.difficulty])}>{path.difficulty}</span>
            </div>
            <div className="flex flex-wrap items-center gap-0.5">
              {path.steps.map((s, i) => (
                <span key={s.articleId} className="flex items-center gap-0.5">
                  <button onClick={() => onSelectArticle(s.articleId)} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors">
                    {s.label}
                  </button>
                  {i < path.steps.length - 1 && <IconChevronRight size={10} className="text-muted-foreground" />}
                </span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function AIWikiGuide({ onSelectArticle }: { onSelectArticle: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = ["Explain the OSI Model", "What is the best learning path?", "Compare TLS and mTLS", "How do I detect Kerberoasting?"];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("osi") || lower.includes("layer")) {
        answer = "The OSI Model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer serves a specific function in network communication. Start with the 'OSI Model — The Seven Layers of Networking' article for a comprehensive breakdown with practical examples.";
      } else if (lower.includes("learning path") || lower.includes("path")) {
        answer = `There are ${learningPaths.length} learning paths available. The SOC Analyst Progression (${learningPaths[0].steps.length} steps) is recommended for beginners starting from networking fundamentals. The Penetration Testing Path (${learningPaths[1].steps.length} steps) is ideal if you have web security experience.`;
      } else if (lower.includes("tls") && lower.includes("mtls")) {
        answer = "TLS secures communication between a client and server using certificates. Mutual TLS (mTLS) requires both sides to present certificates, verifying both identities. Standard TLS authenticates only the server to the client. mTLS is common in zero-trust architectures and service mesh implementations.";
      } else if (lower.includes("kerberoasting") || lower.includes("kerberos")) {
        answer = "Kerberoasting is an AD attack where attackers request service tickets for SPNs and crack them offline. Detect it by monitoring Event ID 4769 for unusual service ticket request volumes, especially from non-admin accounts. The Active Directory Security Architecture article covers detection and mitigation.";
      } else {
        answer = `The Knowledge Wiki contains ${articles.length} articles across ${categories.length} categories. Use the search bar above to find specific topics, or browse by category. You can also explore ${securityTools.length} security tools, ${cheatSheets.length} cheat sheets, and ${learningPaths.length} learning paths.`;
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <GlassCard glow="cyan" intensity="medium" variant="elevated">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><IconBrain size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Knowledge Assistant</h2>
            <p className="text-xs text-muted-foreground">Ask about any cybersecurity concept, tool, or technique</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cyan-500/30 transition-colors">
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
            placeholder="Ask about cybersecurity topics..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
          <Button variant="primary" size="md" onClick={() => handleAsk(query)} loading={loading}>Ask</Button>
        </div>
        <AnimatePresence>
          {response && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-start gap-2">
                <IconBrain size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{response}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

function RecruiterWikiView() {
  return (
    <div className="min-h-screen">
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-4">
            <IconBooks size={12} />Knowledge Wiki — Recruiter View
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Documentation & Knowledge Base</h1>
          <p className="text-muted-foreground mb-8">{articles.length} articles spanning {categories.length} cybersecurity domains, connected to all portfolio projects and certifications.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <GlassCard glow="cyan" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{articles.length}</div><div className="text-xs text-muted-foreground">Articles</div></GlassCard>
            <GlassCard glow="purple" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{categories.length}</div><div className="text-xs text-muted-foreground">Categories</div></GlassCard>
            <GlassCard glow="amber" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{securityTools.length}</div><div className="text-xs text-muted-foreground">Tools</div></GlassCard>
            <GlassCard glow="green" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{cheatSheets.length}</div><div className="text-xs text-muted-foreground">Cheat Sheets</div></GlassCard>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <GlassCard glow="cyan" intensity="low">
              <h3 className="text-sm font-semibold text-white mb-3">Knowledge Areas</h3>
              <div className="flex flex-wrap gap-1">{categories.filter((c) => c.articleCount > 0).map((c) => (<span key={c.id} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{c.label} ({c.articleCount})</span>))}</div>
            </GlassCard>
            <GlassCard glow="purple" intensity="low">
              <h3 className="text-sm font-semibold text-white mb-3">Learning Paths</h3>
              <div className="space-y-1.5">{learningPaths.map((p) => (<div key={p.id} className="text-xs text-muted-foreground"><span className="text-white">{p.title}</span> — {p.steps.length} steps</div>))}</div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}

function WikiPage() {
  const { recruiterMode } = useUIStore();
  const [view, setView] = useState<ViewMode>("explore");
  const [activeArticle, setActiveArticle] = useState<WikiArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("hero");

  const handleSelectArticle = (id: string) => {
    const article = getArticleById(id);
    if (article) { setActiveArticle(article); setView("article"); }
  };

  const handleSearch = (q: string) => {
    if (q.trim()) { setSearchQuery(q); setView("search"); }
  };

  const handleClose = () => {
    setActiveArticle(null);
    setSearchQuery("");
    setView("explore");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    return () => observer.disconnect();
  }, []);

  if (recruiterMode) return <RecruiterWikiView />;

  return (
    <div className="min-h-screen">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
      {view === "article" && activeArticle ? (
        <ArticleViewer article={activeArticle} onClose={handleClose} />
      ) : view === "search" && searchQuery ? (
        <SearchResults query={searchQuery} onSelectArticle={handleSelectArticle} onClose={handleClose} />
      ) : view === "cheatsheets" ? (
        <CheatSheetsView onClose={handleClose} />
      ) : view === "tools" ? (
        <ToolsView onClose={handleClose} />
      ) : view === "mitre" ? (
        <MitreView onClose={handleClose} />
      ) : view === "owasp" ? (
        <OwaspView onClose={handleClose} />
      ) : view === "paths" ? (
        <LearningPathsView onClose={handleClose} onSelectArticle={handleSelectArticle} />
      ) : (
        <CategoryGrid
          onSelectCategory={(cat) => {
            const filtered = getArticlesByCategory(cat);
            if (filtered.length > 0) handleSelectArticle(filtered[0].id);
          }}
          onSelectArticle={handleSelectArticle}
        />
      )}
      {view === "explore" && <AIWikiGuide onSelectArticle={handleSelectArticle} />}
      {view === "article" && activeArticle && <AIWikiGuide onSelectArticle={handleSelectArticle} />}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Knowledge Wiki — {articles.length} articles · {categories.length} categories · {securityTools.length} tools · {cheatSheets.length} cheat sheets · All content is original educational material
          </p>
        </div>
      </footer>
    </div>
  );
}

export default WikiPage;
