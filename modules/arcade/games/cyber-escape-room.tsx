"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconDoor, IconBrain, IconNetwork,
  IconTerminal, IconLock, IconFlag,
  IconRefresh, IconBulb, IconRobot, IconCheck,
  IconBinary, IconHash,
} from "@tabler/icons-react";

type RoomId = "welcome" | "network" | "terminal" | "cipher" | "logic" | "binary" | "hash" | "final";

interface Room {
  id: RoomId;
  title: string;
  desc: string;
  icon: typeof IconDoor;
  color: string;
  gradient: string;
  unlocked: boolean;
}

interface Puzzle {
  question: string;
  options: string[];
  correct: number;
  hint: string;
}

interface PuzzleRoom {
  room: RoomId;
  puzzles: Puzzle[];
  intro: string;
  success: string;
}

const ROOMS: Room[] = [
  { id: "welcome", title: "Welcome", desc: "The escape begins", icon: IconDoor, color: "text-cyan-400", gradient: "from-cyan-500/20 to-blue-500/20", unlocked: true },
  { id: "network", title: "Network Nexus", desc: "Match protocols to ports", icon: IconNetwork, color: "text-blue-400", gradient: "from-blue-500/20 to-purple-500/20", unlocked: false },
  { id: "terminal", title: "Terminal Takedown", desc: "Linux command challenges", icon: IconTerminal, color: "text-green-400", gradient: "from-green-500/20 to-cyan-500/20", unlocked: false },
  { id: "cipher", title: "Cipher Chamber", desc: "Decode encrypted messages", icon: IconLock, color: "text-purple-400", gradient: "from-purple-500/20 to-pink-500/20", unlocked: false },
  { id: "logic", title: "Logic Labyrinth", desc: "Boolean gate puzzles", icon: IconBrain, color: "text-amber-400", gradient: "from-amber-500/20 to-orange-500/20", unlocked: false },
  { id: "binary", title: "Binary Bunker", desc: "Binary & hex conversions", icon: IconBinary, color: "text-pink-400", gradient: "from-pink-500/20 to-red-500/20", unlocked: false },
  { id: "hash", title: "Hash Hold", desc: "Identify hash algorithms", icon: IconHash, color: "text-cyan-400", gradient: "from-cyan-500/20 to-green-500/20", unlocked: false },
  { id: "final", title: "Final Escape", desc: "Ultimate challenge", icon: IconFlag, color: "text-red-400", gradient: "from-red-500/20 to-amber-500/20", unlocked: false },
];

const ROOM_PUZZLES: Record<RoomId, PuzzleRoom> = {
  welcome: { room: "welcome", puzzles: [], intro: "", success: "" },
  network: {
    room: "network", intro: "A locked gateway bars your path. It accepts only the correct protocol-to-port mappings.", success: "The gateway hums and slides open. Network access granted.",
    puzzles: [
      { question: "Which port does SSH use for secure remote access?", options: ["22", "23", "443", "3389"], correct: 0, hint: "SSH replaced Telnet (port 23) for secure remote access." },
      { question: "What port serves HTTPS traffic?", options: ["80", "443", "8080", "8443"], correct: 1, hint: "HTTPS is HTTP over TLS — one port higher than standard HTTP." },
      { question: "Which port is used by DNS for name resolution?", options: ["25", "53", "110", "161"], correct: 1, hint: "DNS uses a port number that's also a famous radio number." },
      { question: "SMTP email delivery uses which port?", options: ["25", "143", "587", "993"], correct: 0, hint: "SMTP is the standard protocol for outgoing mail." },
    ],
  },
  terminal: {
    room: "terminal", intro: "A terminal screen flickers. Only the right commands will reveal the next key.", success: "Terminal access accepted. A digital key materializes.",
    puzzles: [
      { question: "Which command lists all files including hidden ones?", options: ["ls -la", "dir /a", "list -all", "show -h"], correct: 0, hint: "The -a flag shows hidden files (dotfiles) in Linux." },
      { question: "How do you change file permissions to executable?", options: ["chmod +x file", "perm +x file", "chown +x file", "exec file"], correct: 0, hint: "The change mode command controls read/write/execute bits." },
      { question: "Which command searches file contents with regex?", options: ["find", "search", "grep", "lookup"], correct: 2, hint: "Global Regular Expression Print — a classic UNIX tool." },
      { question: "How do you view running processes in real-time?", options: ["ps", "top", "jobs", "proc"], correct: 1, hint: "Think of it as a constantly updating process table." },
    ],
  },
  cipher: {
    room: "cipher", intro: "An encrypted message blocks your path. Decode it to proceed.", success: "The cipher breaks. Hidden mechanisms whir to life.",
    puzzles: [
      { question: 'Base64 decode: "Q3liZXIgTmV4dXM="', options: ["Cyber Nexus", "CyberSec", "Escape Room", "Cipher Text"], correct: 0, hint: "Base64 encodes binary data into ASCII characters ending with =." },
      { question: 'Caesar shift: "FRQJUDWXODWLRQV" (shift 3)', options: ["Congratulations", "Commemoration", "Computation", "Configuration"], correct: 0, hint: "Caesar cipher shifts each letter forward by a fixed number." },
      { question: 'ROT13 decode: "Plevre Arkhf"', options: ["Plevre Arkhf", "Cipher Nexus", "Cyber Nexus", "Secret Room"], correct: 2, hint: "ROT13 rotates letters by 13 positions — since 13+13=26, encoding and decoding are the same." },
      { question: 'Hex to ASCII: "48656C6C6F"', options: ["Help", "Hello", "He110", "Hexa"], correct: 1, hint: "Each pair of hex characters represents one ASCII character." },
    ],
  },
  logic: {
    room: "logic", intro: "Logic gates guard the next corridor. Complete the truth tables.", success: "The logic circuits align. A pathway illuminates.",
    puzzles: [
      { question: "What is the output of AND gate with inputs 1 and 0?", options: ["0", "1", "Error", "Depends"], correct: 0, hint: "AND requires both inputs to be true (1) for a true output." },
      { question: "What is the output of XOR gate with inputs 1 and 1?", options: ["0", "1", "2", "Depends"], correct: 0, hint: "XOR is true when inputs differ. Same inputs = false." },
      { question: "What is the output of NAND gate with inputs 1 and 1?", options: ["0", "1", "Error", "Undefined"], correct: 0, hint: "NAND is the inverse of AND. Think about what AND(1,1) gives, then invert it." },
      { question: "What does the NOR gate output when both inputs are 0?", options: ["0", "1", "Error", "Floating"], correct: 1, hint: "NOR is NOT OR. When OR has 0+0, it outputs 0; NOR inverts that." },
    ],
  },
  binary: {
    room: "binary", intro: "The vault speaks in binary. Translate to unlock.", success: "Binary sequences align. The vault clicks open.",
    puzzles: [
      { question: "Convert binary 1010 to decimal:", options: ["8", "10", "12", "16"], correct: 1, hint: "1010 = 1×8 + 0×4 + 1×2 + 0×1 = 8+2" },
      { question: "Convert decimal 15 to binary:", options: ["1110", "1111", "10000", "1101"], correct: 1, hint: "15 in binary is four 1s — the largest 4-bit number." },
      { question: "Convert binary 11001010 to hex:", options: ["0xCA", "0xAB", "0xBC", "0xDE"], correct: 0, hint: "Split into nibbles: 1100 = C, 1010 = A." },
      { question: "Convert hex 0xFF to decimal:", options: ["127", "255", "256", "65535"], correct: 1, hint: "0xFF = 15×16 + 15 = 240 + 15." },
    ],
  },
  hash: {
    room: "hash", intro: "Hash digests guard the exit. Identify each algorithm.", success: "The hash chamber decrypts. The final door appears.",
    puzzles: [
      { question: 'Which algorithm produces a 128-bit hash like "5d41402abc4b2a76b9719d911017c592"?', options: ["SHA-256", "MD5", "SHA-1", "BLAKE2"], correct: 1, hint: "MD5 produces 32 hex characters = 128 bits. It's the shortest common hash." },
      { question: 'Identify: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"', options: ["SHA-1", "MD5", "SHA-256", "BLAKE2b"], correct: 2, hint: "64 hex characters = 256 bits. This is the standard hash used in blockchain." },
      { question: "Which hash is commonly used for password storage with a salt?", options: ["MD5", "SHA-1", "bcrypt", "CRC32"], correct: 2, hint: "This adaptive hash function is designed specifically for password hashing." },
      { question: 'A 40-character hex string like "da39a3ee5e6b4b0d3255bfef95601890afd80709" identifies which hash?', options: ["MD5", "SHA-1", "SHA-256", "SHA-512"], correct: 1, hint: "40 hex chars = 160 bits. This was the standard before SHA-2." },
    ],
  },
  final: {
    room: "final", intro: "The final door integrates all knowledge. One last challenge.", success: "The final door swings open. Congratulations — you escaped!",
    puzzles: [
      { question: "Which port and protocol pair identifies secure web traffic?", options: ["443/HTTPS", "80/HTTP", "22/SSH", "53/DNS"], correct: 0, hint: "Secure websites use TLS/SSL encryption on a port starting with 4." },
      { question: "What Linux command would find all files containing 'password'?", options: ["grep -r password", "find password", "locate password", "search password"], correct: 0, hint: "The recursive grep command searches file contents in all directories." },
      { question: "ROT13 decode 'Fcrrq' and what does it mean?", options: ["Speed", "Stealth", "Sprint", "Secure"], correct: 0, hint: "ROT13 rotates each letter by 13 positions. 'F'→'S', 'c'→'p', 'r'→'e', 'r'→'e', 'q'→'d'." },
      { question: "XOR(1,0) AND OR(0,0) evaluates to:", options: ["0", "1", "Error", "True"], correct: 0, hint: "XOR(1,0)=1, OR(0,0)=0, then AND(1,0)=0." },
    ],
  },
};

const GUIDE_MESSAGES: Record<string, string[]> = {
  welcome: ["Welcome, operative. I'm your AI guide. Six chambers stand between you and escape. Solve each to progress.", "Each room tests a different cybersecurity skill. You have 3 hints per room — use them wisely.", "Begin when ready. The first room, Network Nexus, awaits."],
  network: ["Network protocols are the language of the internet. Match each to its standard port.", "Tip: Well-known ports are below 1024. Think about what each protocol does."],
  terminal: ["The terminal is your weapon. Each question tests your Linux command knowledge.", "Remember: Linux is case-sensitive. Focus on what each command does."],
  cipher: ["Cryptography protects data. You'll need to recognize and reverse common encodings.", "Base64 ends with = or ==. Caesar shifts letters. Hex comes in pairs."],
  logic: ["Boolean logic is the foundation of computing. AND, OR, XOR, NAND, NOR.", "Truth tables have 2^n rows for n inputs. Each gate has a specific pattern."],
  binary: ["Computers speak binary (base-2) and hex (base-16). Master the conversion.", "4 binary bits = 1 hex digit. Memorize the 4-bit patterns for A-F."],
  hash: ["Hashes are one-way functions. Each produces a fixed-length output.", "Count the hex characters: 32=MD5, 40=SHA-1, 64=SHA-256, 128=SHA-512."],
  final: ["The final challenge combines everything you've learned. Take your time.", "You've mastered each discipline. Now apply them together."],
};

const STORAGE_KEY = "cyber-escape-progress";

interface GameState {
  currentRoom: RoomId;
  completedRooms: RoomId[];
  unlockedRooms: RoomId[];
  hintsUsed: Record<string, number>;
  puzzlesSolved: Record<string, number[]>;
  currentPuzzle: number;
  started: boolean;
  escaped: boolean;
}

function loadProgress(): GameState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return null;
}

function saveProgress(state: GameState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function doorAnimProps(direction: "enter" | "exit") {
  return direction === "enter"
    ? { initial: { rotateY: -90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: 90, opacity: 0 } }
    : { initial: { rotateY: 0, opacity: 1 }, animate: { rotateY: -90, opacity: 0 }, exit: { rotateY: 90, opacity: 0 } };
}

export default function CyberEscapeRoom() {
  const [game, setGame] = useState<GameState>(() => {
    const saved = loadProgress();
    if (saved && saved.started) return saved;
    return {
      currentRoom: "welcome", completedRooms: [], unlockedRooms: ["welcome", "network"],
      hintsUsed: {}, puzzlesSolved: {}, currentPuzzle: 0, started: false, escaped: false,
    };
  });
  const [transitioning, setTransitioning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState("");
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [guideMessage, setGuideMessage] = useState("");
  const [guideIndex, setGuideIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const room = ROOMS.find(r => r.id === game.currentRoom)!;
  const puzzleData = ROOM_PUZZLES[game.currentRoom];
  const puzzle = puzzleData?.puzzles[game.currentPuzzle];
  const hintsLeft = 3 - (game.hintsUsed[game.currentRoom] || 0);

  // Auto-save
  useEffect(() => { if (game.started) saveProgress(game); }, [game]);

  const enterRoom = useCallback((roomId: RoomId) => {
    setTransitioning(true);
    setTimeout(() => {
      setGame(prev => ({ ...prev, currentRoom: roomId, currentPuzzle: 0 }));
      setShowHint(false);
      setFeedback(null);
      setGuideIndex(0);
      const msgs = GUIDE_MESSAGES[roomId] || ["Proceed with caution."];
      setGuideMessage(msgs[0]);
      setShowGuide(true);
      setTimeout(() => setTransitioning(false), 100);
    }, 400);
  }, []);

  const completeRoom = useCallback(() => {
    const isFinal = game.currentRoom === "final";
    const nextRoomIdx = ROOMS.findIndex(r => r.id === game.currentRoom) + 1;
    const nextRoom = ROOMS[nextRoomIdx];
    setGame(prev => ({
      ...prev,
      completedRooms: [...prev.completedRooms, game.currentRoom],
      unlockedRooms: nextRoom ? [...prev.unlockedRooms, nextRoom.id] : prev.unlockedRooms,
      currentRoom: isFinal ? prev.currentRoom : nextRoom?.id || prev.currentRoom,
      currentPuzzle: 0,
      escaped: isFinal,
    }));
    setShowHint(false);
    setFeedback(null);
    setSelectedIdx(null);
    if (!isFinal && nextRoom) {
      setGuideIndex(0);
      const msgs = GUIDE_MESSAGES[nextRoom.id] || ["Proceed."];
      setGuideMessage(msgs[0]);
      setShowGuide(true);
    }
  }, [game.currentRoom]);

  const submitAnswer = useCallback((selected: number) => {
    if (!puzzle) return;
    setSelectedIdx(selected);
    const correct = selected === puzzle.correct;
    setFeedback({ correct, msg: correct ? "✓ Correct!" : "✗ Not quite. Try again." });
    if (correct) {
      setTimeout(() => {
        const nextIdx = game.currentPuzzle + 1;
        const roomPuzzles = puzzleData.puzzles.length;
        if (nextIdx >= roomPuzzles) {
          completeRoom();
        } else {
          setGame(prev => ({ ...prev, currentPuzzle: nextIdx }));
          setShowHint(false);
          setFeedback(null);
          setSelectedIdx(null);
        }
      }, 1200);
    }
  }, [puzzle, game.currentPuzzle, puzzleData?.puzzles.length, completeRoom]);

  const useHint = useCallback(() => {
    if (!puzzle || hintsLeft <= 0) return;
    setGame(prev => ({ ...prev, hintsUsed: { ...prev.hintsUsed, [prev.currentRoom]: (prev.hintsUsed[prev.currentRoom] || 0) + 1 } }));
    setCurrentHint(puzzle.hint);
    setShowHint(true);
  }, [puzzle, hintsLeft]);

  const advanceGuide = useCallback(() => {
    const msgs = GUIDE_MESSAGES[game.currentRoom] || ["Proceed."];
    const next = guideIndex + 1;
    if (next < msgs.length) {
      setGuideMessage(msgs[next]);
      setGuideIndex(next);
    } else {
      setShowGuide(false);
    }
  }, [guideIndex, game.currentRoom]);

  const startGame = useCallback(() => {
    setGame(prev => ({ ...prev, started: true }));
    setGuideMessage("Welcome, operative. I'm your AI guide. Six chambers stand between you and escape. Solve each to progress.");
    setGuideIndex(0);
    setShowGuide(true);
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGame({
      currentRoom: "welcome", completedRooms: [], unlockedRooms: ["welcome", "network"],
      hintsUsed: {}, puzzlesSolved: {}, currentPuzzle: 0, started: false, escaped: false,
    });
    setShowGuide(false);
    setShowHint(false);
    setFeedback(null);
  }, []);

  if (!game.started) {
    return (
      <div className="min-h-screen pb-12 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 mb-6">
              <IconDoor size={48} className="text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Cyber Escape Room</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Six chambers. Six cybersecurity disciplines. One way out.<br />
              Solve every puzzle to unlock the final door and escape.
            </p>
            <div className="space-y-3 mb-8">
              {ROOMS.slice(1).map(r => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm">
                  <div className={cn("p-1.5 rounded-lg bg-white/5", r.color)}><r.icon size={16} /></div>
                  <span className="flex-1 text-left">{r.title}</span>
                  <span className={cn("text-xs font-mono", r.color)}>{r.desc}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="primary" size="lg" onClick={startGame}>
                <IconDoor size={16} className="mr-2" /> Enter
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (game.escaped) {
    return (
      <div className="min-h-screen pb-12 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/20 mb-6">
              <IconFlag size={48} className="text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Escaped!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              You solved every chamber and unlocked the final door. The Cyber Escape Room is conquered.
            </p>
            <GlassCard glow="cyan" className="p-6 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-cyan-400">{game.completedRooms.length}</div><div className="text-xs text-muted-foreground">Rooms Cleared</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-purple-400">{Object.values(game.hintsUsed).reduce((a, b) => a + b, 0)}</div><div className="text-xs text-muted-foreground">Hints Used</div></div>
              </div>
            </GlassCard>
            <div className="flex justify-center gap-3">
              <Button variant="primary" size="md" onClick={resetProgress}>
                <IconRefresh size={14} className="mr-1.5" /> Play Again
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
              <IconDoor size={10} /> Cyber Escape Room
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {game.completedRooms.length}/{ROOMS.length - 1} rooms
            </span>
          </div>
          <button onClick={resetProgress} className="text-xs text-muted-foreground hover:text-foreground font-mono flex items-center gap-1">
            <IconRefresh size={10} /> Reset
          </button>
        </div>

        {/* Room selection */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {ROOMS.filter(r => r.id !== "welcome").map(r => {
            const locked = !game.unlockedRooms.includes(r.id);
            const completed = game.completedRooms.includes(r.id);
            const isCurrent = game.currentRoom === r.id;
            return (
              <button key={r.id} onClick={() => !locked && enterRoom(r.id)}
                disabled={locked || isCurrent || transitioning}
                className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all whitespace-nowrap",
                  isCurrent ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" :
                  completed ? "bg-green-500/10 border-green-500/20 text-green-400" :
                  locked ? "bg-white/[0.02] border-white/5 text-muted-foreground/30 cursor-not-allowed" :
                  "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20")}>
                {completed ? <IconCheck size={10} /> : locked ? <IconLock size={10} /> : <r.icon size={10} />}
                {r.title}
              </button>
            );
          })}
        </div>

        {/* AI Guide */}
        <AnimatePresence>
          {showGuide && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4">
              <GlassCard glow="cyan" className="p-3 border-cyan-500/20">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <IconRobot size={12} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{guideMessage}</p>
                    <button onClick={advanceGuide} className="text-xs text-cyan-400 font-mono mt-1 hover:underline">
                      {guideIndex < (GUIDE_MESSAGES[game.currentRoom]?.length || 1) - 1 ? "Next →" : "Got it"}
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Room content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={game.currentRoom + game.currentPuzzle}
            {...doorAnimProps("enter")}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ perspective: 800 }}
          >
            {game.currentRoom === "welcome" ? (
              <GlassCard glow="none" className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Ready, Operative?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Select a room to begin. Each chamber tests a different skill.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROOMS.filter(r => r.id !== "welcome" && r.id !== "final").map(r => {
                    const locked = !game.unlockedRooms.includes(r.id);
                    const completed = game.completedRooms.includes(r.id);
                    return (
                      <button key={r.id} onClick={() => !locked && enterRoom(r.id)} disabled={locked}
                        className={cn("p-4 rounded-xl border text-center transition-all relative overflow-hidden",
                          locked ? "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed" :
                          completed ? "bg-green-500/5 border-green-500/20" :
                          "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20")}>
                        {completed && <div className="absolute top-1 right-1"><IconCheck size={10} className="text-green-400" /></div>}
                        <div className={cn("flex justify-center mb-2", r.color)}><r.icon size={24} /></div>
                        <div className="text-xs font-semibold">{r.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            ) : puzzle ? (
              <>
                {/* Room header */}
                <GlassCard glow="none" className="p-6 mb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", room.color)}>
                        <room.icon size={20} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold">{room.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{puzzleData.intro}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted-foreground">{game.currentPuzzle + 1}/{puzzleData.puzzles.length}</span>
                      <button onClick={useHint} disabled={hintsLeft <= 0}
                        className={cn("flex items-center gap-1 px-2 py-1 rounded-lg border transition-all",
                          hintsLeft > 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20" :
                          "bg-white/5 border-white/10 text-muted-foreground/30 cursor-not-allowed")}>
                        <IconBulb size={10} /> {hintsLeft}
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Puzzle */}
                <GlassCard glow="none" className="p-6 mb-3">
                  <p className="text-sm mb-4">{puzzle.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {puzzle.options.map((opt, idx) => {
                      return (
                        <button key={idx} onClick={() => !feedback && submitAnswer(idx)}
                          disabled={!!feedback}
                          className={cn("p-3 rounded-xl border text-sm font-mono text-left transition-all",
                            feedback && idx === puzzle.correct ? "bg-green-500/10 border-green-500/30 text-green-400" :
                            feedback && selectedIdx === idx && idx !== puzzle.correct ? "bg-red-500/10 border-red-500/30 text-red-400" :
                            "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-muted-foreground disabled:opacity-50")}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>

                {/* Hint */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <GlassCard glow="none" className="p-3 mb-3 border-amber-500/20">
                        <div className="flex items-start gap-2 text-xs">
                          <IconBulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{currentHint}</span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <GlassCard glow={feedback.correct ? "green" : "none"} className={cn("p-3 text-center text-sm", feedback.correct ? "text-green-400" : "text-red-400")}>
                        {feedback.msg}
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

