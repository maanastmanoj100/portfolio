"use client";

import { useState, useMemo, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useOsStore } from "@/modules/cyber-os/os-store";
import { cn } from "@/lib/utils";
import {
  GAMES, CATEGORIES, ACHIEVEMENTS, DAILY_CHALLENGES,
  LEADERBOARD, DEFAULT_STATS, CONTINUE_GAMES,
  type Game, type GameCategory, type ArcadeAchievement,
  type ArcadeStats, type DailyChallenge,
} from "./arcade-data";
import {
  IconSearch, IconX, IconStar, IconTrophy, IconUsers,
  IconSettings, IconHeart, IconClock, IconPlaystationCircle,
  IconFlame, IconBolt, IconCheck, IconPlus, IconRefresh,
  IconChevronLeft, IconChevronRight, IconArrowRight,
  IconBrain, IconGridDots, IconDatabase, IconShield,
  IconRobot, IconFlag, IconSparkles,
  IconCode, IconLock, IconNetwork, IconMail,
  IconAlertTriangle, IconKey, IconChartBar,
  IconAward, IconCalendar, IconCategory,
  IconStarFilled, IconHeartFilled,
  IconExternalLink, IconMenu2, IconPlayerPlay,
  IconDeviceGamepad2, IconCards,
} from "@tabler/icons-react";

const CATEGORY_ICONS: Record<string, React.FC<{ size?: number }>> = {
  IconBrain, IconGridDots, IconDatabase, IconShield,
  IconRobot, IconFlag, IconSparkles, IconBolt, IconCode,
  IconLock, IconNetwork, IconMail, IconAlertTriangle,
  IconKey, IconChartBar, IconPlayerPlay, IconAward, IconCalendar,
  IconCategory, IconDeviceGamepad2, IconStarFilled, IconHeartFilled,
  IconUsers, IconCards, IconStar, IconTrophy, IconHeart,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
  expert: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

function GameCard({ game, onPlay, onFavorite, favorited }: { game: Game; onPlay: () => void; onFavorite: () => void; favorited: boolean }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="group relative">
      <GlassCard glow="none" className={cn("p-4 cursor-pointer transition-all duration-300 border-white/5 hover:border-white/15", game.daily && "border-amber-500/20")}>
        <div className={cn("absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", game.gradient)} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg bg-white/5", game.color)}>{CATEGORY_ICONS[game.icon] ? <div className={game.color}>{createElement(CATEGORY_ICONS[game.icon]!, { size: 16 })}</div> : <IconPlayerPlay size={16} />}</div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">{game.title}</h3>
                <p className="text-xs text-muted-foreground">{game.duration} · {game.xpReward} XP</p>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              className={cn("p-1 rounded-lg transition-colors", favorited ? "text-pink-400" : "text-muted-foreground hover:text-pink-400 opacity-0 group-hover:opacity-100")}>
              {favorited ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{game.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full border", DIFFICULTY_COLORS[game.difficulty])}>{game.difficulty}</span>
              {game.new && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">New</span>}
              {game.daily && <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Daily</span>}
            </div>
            <Button variant="glass" size="sm" onClick={onPlay}>
              <IconPlayerPlay size={10} className="mr-1" /> Play
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function TopBar({ searchQuery, setSearchQuery, activeCategory, setActiveCategory, showAchievements, setShowAchievements, showLeaderboard, setShowLeaderboard }: {
  searchQuery: string; setSearchQuery: (q: string) => void;
  activeCategory: string | null; setActiveCategory: (c: string | null) => void;
  showAchievements: boolean; setShowAchievements: (v: boolean) => void;
  showLeaderboard: boolean; setShowLeaderboard: (v: boolean) => void;
}) {
  return (
    <div className="sticky top-0 z-40 pb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search games..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><IconX size={14} /></button>}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button onClick={() => setActiveCategory(null)} className={cn("px-4 py-2 text-xs rounded-lg font-mono whitespace-nowrap transition-all", !activeCategory ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-white/5 text-muted-foreground border border-white/10 hover:text-foreground")}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id === activeCategory ? null : c.id)}
              className={cn("px-4 py-2 text-xs rounded-lg font-mono whitespace-nowrap transition-all flex items-center gap-1.5", c.id === activeCategory ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-white/5 text-muted-foreground border border-white/10 hover:text-foreground")}>
              <span className={c.color}>{
                c.icon === "IconBrain" ? <IconBrain size={12} /> :
                c.icon === "IconGridDots" ? <IconGridDots size={12} /> :
                c.icon === "IconDatabase" ? <IconDatabase size={12} /> :
                c.icon === "IconShield" ? <IconShield size={12} /> :
                c.icon === "IconRobot" ? <IconRobot size={12} /> :
                c.icon === "IconFlag" ? <IconFlag size={12} /> :
                c.icon === "IconSparkles" ? <IconSparkles size={12} /> :
                c.icon === "IconBolt" ? <IconBolt size={12} /> :
                <IconPlayerPlay size={12} />
              }</span>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => { setShowAchievements(!showAchievements); setShowLeaderboard(false); }}
            className={cn("p-2.5 rounded-lg transition-all", showAchievements ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-white/5 text-muted-foreground border border-white/10 hover:text-foreground")}><IconTrophy size={16} /></button>
          <button onClick={() => { setShowLeaderboard(!showLeaderboard); setShowAchievements(false); }}
            className={cn("p-2.5 rounded-lg transition-all", showLeaderboard ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-white/5 text-muted-foreground border border-white/10 hover:text-foreground")}><IconUsers size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function FeaturedGame({ game, onPlay }: { game: Game; onPlay: () => void }) {
  return (
    <section className="mb-8">
      <GlassCard glow="cyan" className="relative overflow-hidden p-6 md:p-8">
        <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-br", game.gradient)} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10", game.color)}>
            <div className={game.color}>{CATEGORY_ICONS[game.icon] ? createElement(CATEGORY_ICONS[game.icon]!, { size: 32 }) : <IconPlayerPlay size={32} />}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Featured Game</span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full border", DIFFICULTY_COLORS[game.difficulty])}>{game.difficulty}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{game.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{game.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><IconClock size={12} />{game.duration}</span>
              <span className="flex items-center gap-1"><IconStar size={12} />{game.xpReward} XP</span>
              {game.players && <span className="flex items-center gap-1"><IconUsers size={12} />{game.players.toLocaleString()} players</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {game.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{t}</span>)}
            </div>
            <Button variant="primary" size="lg" className="mt-4" onClick={onPlay}>
              <IconPlayerPlay size={16} className="mr-1.5" /> Play Now
            </Button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

function ContinuePlaying({ games, onPlay }: { games: Game[]; onPlay: (id: string) => void }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><IconRefresh size={18} className="text-cyan-400" /> Continue Playing</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {games.map(game => (
          <GlassCard key={game.id} glow="none" className="p-3 flex items-center gap-3 cursor-pointer hover:border-white/15 transition-all" onClick={() => onPlay(game.id)}>
            <div className={cn("p-2 rounded-lg bg-white/5", game.color)}><div className={game.color}>{CATEGORY_ICONS[game.icon] ? createElement(CATEGORY_ICONS[game.icon]!, { size: 16 }) : <IconPlayerPlay size={16} />}</div></div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{game.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{game.duration}</span>
                <span>·</span>
                <span>{game.category}</span>
              </div>
            </div>
            <IconPlayerPlay size={16} className="text-muted-foreground" />
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function CategorySection({ category, games, favorites, onPlay, onFavorite }: {
  category: { id: GameCategory; label: string; description: string; color: string; icon: string };
  games: Game[]; favorites: Set<string>; onPlay: (id: string) => void; onFavorite: (id: string) => void;
}) {
  if (games.length === 0) return null;
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className={cn("p-1 rounded-lg", category.color)}>{
              category.icon === "IconBrain" ? <IconBrain size={16} /> :
              category.icon === "IconGridDots" ? <IconGridDots size={16} /> :
              category.icon === "IconDatabase" ? <IconDatabase size={16} /> :
              category.icon === "IconShield" ? <IconShield size={16} /> :
              category.icon === "IconRobot" ? <IconRobot size={16} /> :
              category.icon === "IconFlag" ? <IconFlag size={16} /> :
              category.icon === "IconSparkles" ? <IconSparkles size={16} /> :
              category.icon === "IconBolt" ? <IconBolt size={16} /> :
              <IconPlayerPlay size={16} />
            }</span>
            {category.label}
          </h2>
          <p className="text-xs text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {games.map(game => (
          <GameCard key={game.id} game={game} onPlay={() => onPlay(game.id)} onFavorite={() => onFavorite(game.id)} favorited={favorites.has(game.id)} />
        ))}
      </div>
    </section>
  );
}

function AchievementsPanel({ achievements, onClose }: { achievements: ArcadeAchievement[]; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
      <GlassCard glow="amber" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><IconTrophy size={18} className="text-amber-400" /> Achievements</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><IconX size={14} /></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {achievements.map(a => (
            <div key={a.id} className={cn("p-3 rounded-xl border text-center transition-all", a.unlocked ? "bg-white/[0.03] border-white/10" : "bg-white/[0.01] border-white/5 opacity-50")}>
              <div className={cn(a.unlocked ? a.color : "text-muted-foreground")}>
                {a.icon === "IconStar" ? <IconStar size={20} /> :
                 a.icon === "IconPlayerPlay" ? <IconPlayerPlay size={20} /> :
                 a.icon === "IconTrophy" ? <IconTrophy size={20} /> :
                 a.icon === "IconAward" ? <IconAward size={20} /> :
                 a.icon === "IconCalendar" ? <IconCalendar size={20} /> :
                 <IconGridDots size={20} />}
              </div>
              <h3 className="text-xs font-semibold mt-1">{a.title}</h3>
              <p className="text-xs text-muted-foreground">{a.description}</p>
              <span className="text-xs text-cyan-400 font-mono">{a.xp} XP</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function LeaderboardPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
      <GlassCard glow="cyan" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><IconUsers size={18} className="text-cyan-400" /> Leaderboard</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><IconX size={14} /></Button>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map(e => (
            <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <span className={cn("w-6 text-center font-bold text-sm", e.rank === 1 ? "text-yellow-400" : e.rank === 2 ? "text-gray-400" : e.rank === 3 ? "text-amber-600" : "text-muted-foreground")}>{e.rank}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">{e.avatar}</div>
              <div className="flex-1"><div className="text-sm font-medium">{e.name}</div></div>
              <span className="text-sm font-mono text-cyan-400">{e.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function DailyChallengeCard({ challenge, game, onPlay }: { challenge: DailyChallenge; game?: Game; onPlay: () => void }) {
  return (
    <GlassCard glow="amber" className="p-4 border-amber-500/20">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><IconCalendar size={18} /></div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Daily Challenge</span>
            <IconFlame size={14} className="text-amber-400" />
          </div>
          <h3 className="font-semibold">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>Target: {challenge.targetScore}</span>
            <span>Reward: {challenge.xpReward} XP</span>
            {game && <span>{game.duration}</span>}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="primary" size="sm" onClick={onPlay}><IconPlayerPlay size={12} className="mr-1" />Play</Button>
            {challenge.completed && <span className="flex items-center gap-1 text-xs text-green-400"><IconCheck size={12} />Completed</span>}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function StatsBar({ stats }: { stats: ArcadeStats }) {
  return (
    <GlassCard glow="none" className="p-4 mt-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="text-center"><div className="text-lg font-bold text-cyan-400">{stats.gamesPlayed}</div><div className="text-xs text-muted-foreground font-mono">Games</div></div>
          <div className="text-center"><div className="text-lg font-bold text-amber-400">3/{stats.totalAchievements}</div><div className="text-xs text-muted-foreground font-mono">Achievements</div></div>
          <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.xp}</div><div className="text-xs text-muted-foreground font-mono">XP</div></div>
          <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.completion}%</div><div className="text-xs text-muted-foreground font-mono">Complete</div></div>
          <div className="text-center"><div className="text-lg font-bold text-pink-400">{stats.favorites}</div><div className="text-xs text-muted-foreground font-mono">Favorites</div></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><IconFlame size={14} className="text-orange-400" />{stats.streak} day streak</div>
          <div className="w-24 h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground font-mono">Lvl {stats.level}</span>
        </div>
      </div>
    </GlassCard>
  );
}

export default function ArcadePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["phishing-spot", "cipher-crack", "binary-sentinel"]));
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const openWindow = useOsStore((s) => s.openWindow);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const playGame = (id: string) => {
    const game = GAMES.find(g => g.id === id);
    if (!game) return;
    const gameRoutes: Record<string, string> = {
      "password-cracker": "/arcade/password-cracker",
      "phishing-detective": "/arcade/phishing-detective",
      "packet-defender": "/arcade/packet-defender",
      "soc-alert-rush": "/arcade/soc-alert-rush",
      "cyber-escape-room": "/arcade/cyber-escape-room",
    };
    const route = gameRoutes[id] || `/arcade?game=${id}`;
    openWindow(`arcade-${id}`, `Arcade — ${game.title}`, route);
  };

  const featured = GAMES.find(g => g.featured && g.id === "flag-hunter") || GAMES.find(g => g.featured) || GAMES[0];
  const continueGames = CONTINUE_GAMES.map(id => GAMES.find(g => g.id === id)).filter(Boolean) as Game[];
  const dailyChallenges = DAILY_CHALLENGES.map(dc => ({ ...dc, game: GAMES.find(g => g.id === dc.gameId) }));

  const filteredGames = useMemo(() => {
    let result = GAMES;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.tags.some(t => t.includes(q)));
    }
    if (activeCategory) result = result.filter(g => g.category === activeCategory);
    if (difficultyFilter) result = result.filter(g => g.difficulty === difficultyFilter);
    return result;
  }, [search, activeCategory, difficultyFilter]);

  const gamesByCategory = useMemo(() => {
    const map = new Map<GameCategory, Game[]>();
    CATEGORIES.forEach(c => {
      const games = filteredGames.filter(g => g.category === c.id);
      if (games.length > 0) map.set(c.id, games);
    });
    return map;
  }, [filteredGames]);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4">
            <IconDeviceGamepad2 size={14} /> Cyber Nexus Arcade
          </div>
        </div>

        {/* Top Bar */}
        <TopBar
          searchQuery={search} setSearchQuery={setSearch}
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          showAchievements={showAchievements} setShowAchievements={setShowAchievements}
          showLeaderboard={showLeaderboard} setShowLeaderboard={setShowLeaderboard}
        />

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 mb-6">
          {["easy", "medium", "hard", "expert"].map(d => (
            <button key={d} onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
              className={cn("px-4 py-2 text-xs font-mono rounded-full border transition-all", difficultyFilter === d ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground")}>
              {d}
            </button>
          ))}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {showAchievements && <AchievementsPanel achievements={ACHIEVEMENTS} onClose={() => setShowAchievements(false)} />}
          {showLeaderboard && <LeaderboardPanel onClose={() => setShowLeaderboard(false)} />}
        </AnimatePresence>

        {/* Daily Challenges */}
        {dailyChallenges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {dailyChallenges.map(dc => (
              <DailyChallengeCard key={dc.id} challenge={dc} game={dc.game} onPlay={() => dc.game && playGame(dc.game.id)} />
            ))}
          </div>
        )}

        {/* Featured Game */}
        {!activeCategory && !search && <FeaturedGame game={featured} onPlay={() => playGame(featured.id)} />}

        {/* Continue Playing */}
        {!activeCategory && !search && <ContinuePlaying games={continueGames} onPlay={playGame} />}

        {/* Game Categories */}
        {CATEGORIES.map(cat => {
          const games = gamesByCategory.get(cat.id);
          if (!games || games.length === 0) return null;
          return (
            <CategorySection key={cat.id} category={cat} games={games}
              favorites={favorites} onPlay={playGame} onFavorite={toggleFavorite} />
          );
        })}

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <IconSearch size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No games found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats Bar */}
        <StatsBar stats={DEFAULT_STATS} />
      </div>
    </div>
  );
}
