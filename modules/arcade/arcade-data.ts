export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: "easy" | "medium" | "hard" | "expert";
  xpReward: number;
  duration: string;
  icon: string;
  color: string;
  gradient: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  daily?: boolean;
  players?: number;
  completions?: number;
}

export type GameCategory =
  | "logic" | "puzzle" | "memory" | "cyber" | "ai" | "ctf" | "mini" | "quick";

export interface CategoryInfo {
  id: GameCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface ArcadeAchievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  icon: string;
  color: string;
  condition: string;
}

export interface DailyChallenge {
  id: string;
  gameId: string;
  title: string;
  description: string;
  targetScore: number;
  xpReward: number;
  expires: string;
  completed: boolean;
}

export interface ArcadeStats {
  gamesPlayed: number;
  achievements: number;
  totalAchievements: number;
  xp: number;
  nextLevelXp: number;
  level: number;
  completion: number;
  favorites: number;
  streak: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar: string;
  rank: number;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: "logic", label: "Logic", description: "Reasoning and deduction challenges", icon: "IconBrain", color: "text-purple-400" },
  { id: "puzzle", label: "Puzzle", description: "Spatial and pattern-solving games", icon: "IconGridDots", color: "text-amber-400" },
  { id: "memory", label: "Memory", description: "Recall and concentration training", icon: "IconDatabase", color: "text-pink-400" },
  { id: "cyber", label: "Cyber", description: "Security-themed interactive challenges", icon: "IconShield", color: "text-cyan-400" },
  { id: "ai", label: "AI", description: "AI and ML prediction games", icon: "IconRobot", color: "text-green-400" },
  { id: "ctf", label: "CTF", description: "Capture the flag mini challenges", icon: "IconFlag", color: "text-red-400" },
  { id: "mini", label: "Mini Games", description: "Quick play bite-sized games", icon: "IconSparkles", color: "text-blue-400" },
  { id: "quick", label: "Quick Play", description: "Instant action games", icon: "IconBolt", color: "text-yellow-400" },
];

export const GAMES: Game[] = [
  // ═══ LOGIC ═══
  { id: "binary-sentinel", title: "Binary Sentinel", description: "Decode binary sequences to defend the network from intrusion attempts", category: "logic", difficulty: "medium", xpReward: 150, duration: "3m", icon: "IconCode", color: "text-purple-400", gradient: "from-purple-500/20 to-blue-500/20", tags: ["binary", "logic", "network"], featured: true, popular: true, players: 1247, completions: 892 },
  { id: "logic-gates", title: "Logic Gate Forge", description: "Build circuits from AND/OR/NOT gates to solve security puzzles", category: "logic", difficulty: "hard", xpReward: 250, duration: "5m", icon: "IconCategory", color: "text-purple-400", gradient: "from-purple-500/20 to-pink-500/20", tags: ["circuits", "logic", "engineering"], new: true, players: 342 },
  { id: "pattern-defender", title: "Pattern Defender", description: "Identify and complete security patterns before the timer expires", category: "logic", difficulty: "easy", xpReward: 80, duration: "2m", icon: "IconCategory", color: "text-purple-400", gradient: "from-purple-500/20 to-cyan-500/20", tags: ["patterns", "recognition"], popular: true, players: 891 },
  // ═══ PUZZLE ═══
  { id: "cipher-crack", title: "Cipher Crack", description: "Break substitution ciphers and decode encrypted messages", category: "puzzle", difficulty: "medium", xpReward: 200, duration: "4m", icon: "IconLock", color: "text-amber-400", gradient: "from-amber-500/20 to-orange-500/20", tags: ["cryptography", "cipher", "decode"], featured: true, players: 1102, completions: 756 },
  { id: "network-maze", title: "Network Maze", description: "Navigate through complex network topologies to reach the target node", category: "puzzle", difficulty: "hard", xpReward: 300, duration: "6m", icon: "IconNetwork", color: "text-amber-400", gradient: "from-amber-500/20 to-red-500/20", tags: ["networking", "topology", "navigation"], players: 567 },
  { id: "firewall-puzzle", title: "Firewall Puzzle", description: "Configure firewall rules to allow legitimate traffic while blocking attacks", category: "puzzle", difficulty: "medium", xpReward: 180, duration: "3m", icon: "IconShield", color: "text-amber-400", gradient: "from-amber-500/20 to-green-500/20", tags: ["firewall", "rules", "security"], popular: true, players: 978 },
  // ═══ MEMORY ═══
  { id: "threat-match", title: "Threat Match", description: "Match threat actor profiles with their known TTPs and campaigns", category: "memory", difficulty: "medium", xpReward: 160, duration: "3m", icon: "IconUsers", color: "text-pink-400", gradient: "from-pink-500/20 to-purple-500/20", tags: ["threats", "memory", "mitre"], featured: true, players: 834, completions: 623 },
  { id: "packet-memory", title: "Packet Recall", description: "Remember and sequence packet capture patterns in correct order", category: "memory", difficulty: "hard", xpReward: 220, duration: "4m", icon: "IconDatabase", color: "text-pink-400", gradient: "from-pink-500/20 to-blue-500/20", tags: ["packets", "memory", "network"], players: 456 },
  { id: "card-sentry", title: "Card Sentry", description: "Classic memory matching with cybersecurity-themed card pairs", category: "memory", difficulty: "easy", xpReward: 100, duration: "2m", icon: "IconCards", color: "text-pink-400", gradient: "from-pink-500/20 to-cyan-500/20", tags: ["matching", "memory"], popular: true, daily: true, players: 1567 },
  // ═══ CYBER ═══
  { id: "phishing-spot", title: "Phishing Spotter", description: "Identify phishing emails from legitimate communications under time pressure", category: "cyber", difficulty: "medium", xpReward: 200, duration: "3m", icon: "IconMail", color: "text-cyan-400", gradient: "from-cyan-500/20 to-blue-500/20", tags: ["phishing", "detection", "email"], featured: true, popular: true, players: 1890, completions: 1456 },
  { id: "port-scanner", title: "Port Scanner Pro", description: "Identify open ports and services from scan results in record time", category: "cyber", difficulty: "easy", xpReward: 120, duration: "2m", icon: "IconNetwork", color: "text-cyan-400", gradient: "from-cyan-500/20 to-green-500/20", tags: ["ports", "scanning", "recon"], popular: true, players: 1234 },
  { id: "incident-responder", title: "Incident Responder", description: "Make split-second decisions during an active security incident simulation", category: "cyber", difficulty: "hard", xpReward: 350, duration: "5m", icon: "IconAlertTriangle", color: "text-cyan-400", gradient: "from-cyan-500/20 to-red-500/20", tags: ["incident", "response", "decision"], featured: true, new: true, players: 345 },
  { id: "password-cracker", title: "Password Cracker Simulator", description: "Analyze password strength with real-time entropy, cracking estimates, and educational feedback", category: "cyber", difficulty: "easy", xpReward: 100, duration: "5m", icon: "IconLock", color: "text-cyan-400", gradient: "from-cyan-500/20 to-purple-500/20", tags: ["password", "security", "education", "entropy"], new: true, featured: true, players: 0 },
  { id: "phishing-detective", title: "Phishing Detective", description: "Spot phishing emails and learn to identify red flags across multiple difficulty levels", category: "cyber", difficulty: "easy", xpReward: 150, duration: "5m", icon: "IconMail", color: "text-cyan-400", gradient: "from-cyan-500/20 to-amber-500/20", tags: ["phishing", "education", "detection", "email"], new: true, popular: true, players: 0 },
  { id: "packet-defender", title: "Packet Defender", description: "Allow legitimate traffic and block malicious packets in real-time across a live network", category: "cyber", difficulty: "medium", xpReward: 200, duration: "10m", icon: "IconNetwork", color: "text-cyan-400", gradient: "from-cyan-500/20 to-green-500/20", tags: ["network", "firewall", "packets", "real-time"], new: true, players: 0 },
  { id: "soc-alert-rush", title: "SOC Alert Rush", description: "Triage security alerts as a SOC analyst — investigate, escalate, or close each alert with MITRE ATT&CK mapping", category: "cyber", difficulty: "medium", xpReward: 250, duration: "10m", icon: "IconShield", color: "text-cyan-400", gradient: "from-cyan-500/20 to-red-500/20", tags: ["soc", "triage", "mitre", "alerts"], new: true, players: 0 },
  // ═══ AI ═══
  { id: "model-trainer", title: "Model Trainer", description: "Train an AI model by selecting the right parameters and training data", category: "ai", difficulty: "hard", xpReward: 280, duration: "5m", icon: "IconBrain", color: "text-green-400", gradient: "from-green-500/20 to-cyan-500/20", tags: ["ml", "training", "parameters"], players: 678, completions: 234 },
  { id: "ai-detective", title: "AI Detective", description: "Use AI-powered analysis to identify anomalies in network traffic patterns", category: "ai", difficulty: "medium", xpReward: 180, duration: "3m", icon: "IconRobot", color: "text-green-400", gradient: "from-green-500/20 to-purple-500/20", tags: ["anomaly", "detection", "ai"], popular: true, players: 901 },
  // ═══ CTF ═══
  { id: "flag-hunter", title: "Flag Hunter", description: "Find hidden flags across simulated file systems and logs", category: "ctf", difficulty: "medium", xpReward: 250, duration: "4m", icon: "IconFlag", color: "text-red-400", gradient: "from-red-500/20 to-amber-500/20", tags: ["ctf", "flags", "forensics"], featured: true, popular: true, players: 1123, completions: 867 },
  { id: "hash-cracker", title: "Hash Cracker", description: "Identify hash types and crack them using provided wordlists and rules", category: "ctf", difficulty: "hard", xpReward: 300, duration: "5m", icon: "IconKey", color: "text-red-400", gradient: "from-red-500/20 to-purple-500/20", tags: ["hashing", "cracking", "password"], players: 567 },
  { id: "sql-injector", title: "SQL Injector", description: "Craft SQL injection payloads to extract hidden data from simulated databases", category: "ctf", difficulty: "expert", xpReward: 400, duration: "6m", icon: "IconDatabase", color: "text-red-400", gradient: "from-red-500/20 to-orange-500/20", tags: ["sql", "injection", "web"], new: true, players: 234 },
  // ═══ MINI ═══
  { id: "packet-jumper", title: "Packet Jumper", description: "Jump between network nodes collecting packets while avoiding security scans", category: "mini", difficulty: "easy", xpReward: 60, duration: "1m", icon: "IconBolt", color: "text-blue-400", gradient: "from-blue-500/20 to-cyan-500/20", tags: ["arcade", "reflex", "network"], popular: true, players: 2134 },
  { id: "vault-breaker", title: "Vault Breaker", description: "Guess the security code with logic hints in minimal attempts", category: "mini", difficulty: "medium", xpReward: 120, duration: "2m", icon: "IconLock", color: "text-blue-400", gradient: "from-blue-500/20 to-purple-500/20", tags: ["logic", "deduction", "code"], players: 1456 },
  // ═══ QUICK ═══
  { id: "quick-react", title: "Quick React", description: "Test your reaction time against security alert popups", category: "quick", difficulty: "easy", xpReward: 50, duration: "30s", icon: "IconBolt", color: "text-yellow-400", gradient: "from-yellow-500/20 to-orange-500/20", tags: ["reaction", "speed", "reflex"], popular: true, players: 2678 },
  { id: "risk-calculator", title: "Risk Calculator", description: "Quickly calculate CVSS risk scores from given parameters", category: "quick", difficulty: "medium", xpReward: 100, duration: "1m", icon: "IconChartBar", color: "text-yellow-400", gradient: "from-yellow-500/20 to-red-500/20", tags: ["risk", "cvss", "scoring"], players: 789 },
];

export const CONTINUE_GAMES = ["phishing-spot", "cipher-crack", "binary-sentinel"];

export const ACHIEVEMENTS: ArcadeAchievement[] = [
  { id: "ach-first", title: "First Play", description: "Play your first game", xp: 50, unlocked: true, icon: "IconStar", color: "text-yellow-400", condition: "Play 1 game" },
  { id: "ach-ten", title: "Getting Started", description: "Play 10 games", xp: 100, unlocked: true, icon: "IconPlayerPlay", color: "text-cyan-400", condition: "Play 10 games" },
  { id: "ach-fifty", title: "Dedicated Player", description: "Play 50 games", xp: 250, unlocked: false, icon: "IconTrophy", color: "text-amber-400", condition: "Play 50 games" },
  { id: "ach-hundred", title: "Century Club", description: "Play 100 games", xp: 500, unlocked: false, icon: "IconAward", color: "text-purple-400", condition: "Play 100 games" },
  { id: "ach-streak-3", title: "Hat Trick", description: "3-day login streak", xp: 100, unlocked: true, icon: "IconCalendar", color: "text-green-400", condition: "3 day streak" },
  { id: "ach-streak-7", title: "Weekly Warrior", description: "7-day login streak", xp: 300, unlocked: false, icon: "IconCalendar", color: "text-cyan-400", condition: "7 day streak" },
  { id: "ach-perfect", title: "Perfect Score", description: "Get a perfect score on any game", xp: 200, unlocked: false, icon: "IconStar", color: "text-yellow-400", condition: "Perfect score" },
  { id: "ach-all-categories", title: "Category Explorer", description: "Play a game from every category", xp: 350, unlocked: false, icon: "IconGridDots", color: "text-blue-400", condition: "All categories" },
  { id: "ach-daily", title: "Daily Player", description: "Complete the daily challenge", xp: 100, unlocked: true, icon: "IconCalendar", color: "text-cyan-400", condition: "Daily challenge" },
  { id: "ach-favorite", title: "Game Collector", description: "Favorite 5 games", xp: 150, unlocked: false, icon: "IconHeart", color: "text-pink-400", condition: "5 favorites" },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: "dc-1", gameId: "card-sentry", title: "Memory Master", description: "Complete Card Sentry with 0 mistakes", targetScore: 100, xpReward: 200, expires: "2026-07-05", completed: false },
  { id: "dc-2", gameId: "phishing-spot", title: "Phishing Pro", description: "Identify 10 phishing emails in under 60 seconds", targetScore: 200, xpReward: 300, expires: "2026-07-05", completed: false },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { id: "lb-1", name: "Cyber Sentinel", score: 15420, avatar: "CS", rank: 1 },
  { id: "lb-2", name: "Packet Warden", score: 12380, avatar: "PW", rank: 2 },
  { id: "lb-3", name: "Null Pointer", score: 10950, avatar: "NP", rank: 3 },
  { id: "lb-4", name: "Binary Star", score: 9870, avatar: "BS", rank: 4 },
  { id: "lb-5", name: "Firewall Fox", score: 8450, avatar: "FF", rank: 5 },
];

export const DEFAULT_STATS: ArcadeStats = {
  gamesPlayed: 18,
  achievements: 3,
  totalAchievements: ACHIEVEMENTS.length,
  xp: 450,
  nextLevelXp: 1000,
  level: 2,
  completion: 18,
  favorites: 2,
  streak: 4,
};

export const RANDOM_COLORS = [
  "from-cyan-500/20 to-blue-500/20", "from-purple-500/20 to-pink-500/20",
  "from-green-500/20 to-cyan-500/20", "from-amber-500/20 to-orange-500/20",
  "from-red-500/20 to-purple-500/20", "from-pink-500/20 to-blue-500/20",
  "from-blue-500/20 to-green-500/20", "from-yellow-500/20 to-red-500/20",
];
