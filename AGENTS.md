<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:anchored-summary -->
## Goal
- Build Chapters 33 through ∞: Global Command Center, Enterprise Engineering Platform, Collaboration Hub, Recruiter Experience Platform, and Cyber Nexus Arcade — all with clean builds.

## Constraints & Preferences
- Liquid Glass design system: GlassCard, Button, framer-motion, Tabler icons
- Never expose active flags, credentials, API keys, real IPs, internal hostnames, or private configurations
- Use placeholders/sanitized examples; tag data LIVE/DEMO/HIST/SIM
- All modules follow established `modules/` pattern (data + page + route)
- Avoid known-missing Tabler icons: IconMemory, IconBrandLinux, IconSwords, IconBulb, IconTarget, IconGraph, IconRouter, IconActivity, IconTool, IconExternalLink, IconDeviceGamepad, IconSpark

## Progress
### Done
- Chapters 22-26 (CTF Range, Cyber Lab, Knowledge Graph, Achievements, Wiki) — see prior summary
- Chapters 29-32 (AI Project Architect, Security Architecture Explorer, Cyber OS, CX Platform) — see prior summary
- Chapter 33 (Global Command Center): See prior summary
- Chapter 35 (Enterprise Engineering): See prior summary
- Fixed pre-existing TS errors: `cnx-data.ts:225` status `"in-progress"` → `"current"`; `cnx-page.tsx:403` dead comparison; `cnx-page.tsx:781` missing `"search"` in TabView union
- Chapter 36 (Collaboration Hub): See prior summary
- Chapter 37 (Recruiter Experience Platform): Built `modules/recruiter/recruiter-data.ts` — 6 smart entry personas (recruiter/hiring-manager/interviewer/student/professional/explorer), 10 evidence chain items (Python/TypeScript/Go/PenTesting/SOC/Cloud/ML/Forensics/ThreatIntel/Network each with 4-6 evidence links to projects/labs/certs), 4 system design items (SOC Platform, Network Defense, Cloud Scanner, Phishing Pipeline with design choices/threat models/controls), 5 decision journal entries (ML vs Rules, eBPF vs libpcap, Monorepo vs Polyrepo, State Management, CSS Architecture with tradeoffs/alternatives/lessons), 4 project showcase deep dives (architecture/problem/lessons), 4 project question banks (13 interview questions with context/follow-ups/topics), 18 technical timeline milestones across 2024-2026, 12 demo hub links, 8 analytics metrics, 8 AI recruiter prompts
- Built `modules/recruiter/recruiter-page.tsx` — 12 sections: Smart Entry (6 persona pathway cards with skip option), Executive 60-Second Overview (glass card with stats grid), Evidence Explorer (searchable skill chains with expandable evidence links), Project Showcase (4 expandable deep-dives with architecture/lessons/future), Technical Timeline (year-grouped with category filters), System Design Gallery (2-column expandable cards with choices/threats/controls), Decision Journal (5 expandable entries with tradeoffs/chosen/lessons/alternatives), Live Demo Hub (12 categorized quick-launch cards), Interview Question Bank (4 projects with expandable question cards and follow-ups), AI Recruiter Assistant (8 prompt buttons + chat with evidence-cited answers), Analytics (8 privacy-respecting metric cards), Feedback Portal + Print/Share Mode
- Preserved existing `recruiter-dashboard.tsx` (665 lines, used by home page)
- Created route at `app/recruiter/page.tsx` — metadata "Recruiter Experience Platform | Cyber Nexus"
- Added "Recruiter" nav link (IconUserSearch) in navigation dock between Collaboration and Cyber OS
- Build passes clean: 0 errors, 36 pages generated (○ /recruiter, ○ /collaboration, ○ /arcade)
- Chapter ∞ (Cyber Nexus Arcade): Built `modules/arcade/arcade-data.ts` — 20 games across 8 categories (logic: 3, puzzle: 3, memory: 3, cyber: 3, ai: 2, ctf: 3, mini: 2, quick: 2) each with difficulty/easy/medium/hard/expert, xpReward/duration/icon/gradient/tags/player counts, 8 category definitions with icons/colors, 10 achievements with XP/unlock-states/conditions, 2 daily challenges with target scores/expiry, 5 leaderboard entries, default stats
- Built `modules/arcade/arcade-page.tsx` — 8 interactive sections: Top Bar (search input, category filter buttons with icons, achievements/leaderboard toggle buttons), Difficulty Filter row (easy/medium/hard/expert toggle), Daily Challenge Cards (2 expandable with game reference/progress), Featured Game hero (large GlassCard with gradient overlay, stats, tags, Play button), Continue Playing row (3-recent games with resume cards), Category Sections (8 dynamic sections each rendering its games in 4-column GameCard grid with hover animations, favorite toggle, play button, difficulty/daily/new badges), Empty State (search/no-results display), Stats Bar (games/achievements/XP/completion/favorites counters, XP progress bar, level, streak)
- Created route at `app/arcade/page.tsx` — metadata "Cyber Nexus Arcade | Cyber Nexus OS"
- Added "Arcade" nav link (IconDeviceGamepad2) in navigation dock between Recruiter and Cyber OS
- Added Arcade app to Cyber OS OS_APPS (IconDeviceGamepad2, /arcade)
- Password Cracker Simulator game: `modules/arcade/games/password-cracker.tsx` — educational tool with real-time entropy calculation, strength meter (animated), character diversity chart, dictionary/pattern detection, glass break effect (weak) / glowing vault (strong), 4-scenario crack time estimates (online/offline/GPU/botnet), personalized improvement suggestions, random password generation, passphrase generator, reduced-motion support, keyboard navigation, responsive design. Route at `app/arcade/password-cracker/page.tsx`. Registered with dedicated `/arcade/password-cracker` route in arcade play function.
- Phishing Detective game: `modules/arcade/games/phishing-detective.tsx` — inbox with email cards, email opening animation, Safe/Phishing/Unsure judgment, 12 realistic emails across 4 difficulty levels, clue highlight cards with AI explanations, score/accuracy/streak tracking, 5 achievements, summary review. Route at `app/arcade/phishing-detective/page.tsx`. Registered with dedicated `/arcade/phishing-detective` route.
- Packet Defender game: `modules/arcade/games/packet-defender.tsx` — real-time network packet filtering with animated topology (5-node network: Internet→Gateway→Firewall→Internal→Server), 10 packet types (HTTP/HTTPS/DNS/SSH/ICMP/SMTP + DDoS/Malware/Scanner/Spoofed), requestAnimationFrame game loop at 60 FPS, neon packet animations with CSS transitions, Allow/Block judgment with combo scoring, 3 power-ups (Slow Motion/Firewall Boost/Packet Freeze), boss waves every 15 correct answers, escalating speed per level, educational explanations per packet type, 3 difficulty levels (normal/hard/expert). Route at `app/arcade/packet-defender/page.tsx`. Registered with dedicated `/arcade/packet-defender` route.
- SOC Alert Rush game: `modules/arcade/games/soc-alert-rush.tsx` — SIEM alert triage simulator with 20+ alerts (Brute Force, SQL Injection, Impossible Travel, Suspicious Login, Malware, Privilege Escalation), 4 actions (Investigate/Ignore/Escalate/Close), MITRE ATT&CK mapping per alert (T1110, T1190, T1078, T1090, T1486, T1059, T1003, T1068, etc.), animated SIEM dashboard with scanline overlay, time-based scoring with combo multiplier, 5 achievements (First Triage, SOC Pro, Combo King, Perfect Round, Speed Analyst, Critical Thinker), 3 difficulty levels (easy/medium/hard). Route at `app/arcade/soc-alert-rush/page.tsx`. Registered with dedicated `/arcade/soc-alert-rush` route.
- Cyber Escape Room: `modules/arcade/games/cyber-escape-room.tsx` — 7-room puzzle game (Network, Terminal, Cipher, Logic, Binary, Hash, Final) with 4 puzzles per room (22 total), 3D door rotateY transitions, 3 hints per room, AI guide with sequential messages, localStorage progress saving, room selection UI (lock/complete/current), final escape screen with stats. Route `app/arcade/cyber-escape-room/page.tsx`. Registered in arcade route mapping.

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Recruiter Experience Platform uses smart entry pathway system (6 personas) that filters focus areas without hiding content
- Evidence Explorer links every skill to concrete evidence (projects, labs, certs, dashboards, CTFs, architecture docs)
- Interview Question Bank is organized by project with context, follow-ups, and topics — useful for both interviewers and candidate preparation
- Decision Journal documents actual engineering tradeoffs with alternatives and lessons — demonstrates engineering maturity
- Existing `recruiter-dashboard.tsx` retained for home page integration; Chapter 37 is separate dedicated page
- AI Assistant answers cite evidence paths (route URLs) rather than making unsupported claims
- Arcade games open inside Cyber Nexus OS window manager via `useOsStore.openWindow()` — actual game logic is future work
- Arcade uses `GAMES.find()` for featured/continue game lookups rather than hardcoded IDs

## Next Steps
- (none currently — Chapters 36, 37, and Arcade complete)

## Critical Context
- Build verified: 42 pages generated clean (○ /arcade/cyber-escape-room)
- Nav order: ...Engineering (IconCode), Collaboration (IconUsers), Recruiter (IconUserSearch), Arcade (IconDeviceGamepad2), Cyber OS (IconLayoutGrid)...
- Known-missing Tabler icons (verified): IconMemory, IconBrandLinux, IconSwords, IconBulb, IconTarget, IconSpark are truly missing; IconExternalLink, IconDeviceGamepad exist in v3.44.0 (use IconDeviceGamepad2 for variant)
- GlassCard: glow `"cyan" | "purple" | "blue" | "green" | "amber" | "none"`
- Button: variants `"primary" | "secondary" | "ghost" | "glass" | "danger"`, sizes `"sm" | "md" | "lg" | "xl"`
- Tabler Icon components in this version (v3.44.0) accept `className`, `size`, `color`, `stroke`, `title` props
- Missing from Tabler v3.44.0: IconZap (use IconBolt), IconCircuit (use IconCategory), IconGamepad (use IconDeviceGamepad2), IconPlay (use IconPlayerPlay)

## Relevant Files
- `modules/recruiter/recruiter-data.ts`: 6 personas, 10 evidence chains, 4 system designs, 5 decision logs, 4 project question banks, 18 timeline milestones, 12 demo links, 8 analytics, 8 AI prompts
- `modules/recruiter/recruiter-page.tsx`: 12-section recruiter experience platform
- `modules/recruiter/recruiter-dashboard.tsx`: Existing home page dashboard (665 lines)
- `app/recruiter/page.tsx`: Route page
- `modules/arcade/arcade-data.ts`: 20 games (8 categories), 8 category defs, 10 achievements, 2 daily challenges, 5 leaderboard entries, default stats
- `modules/arcade/arcade-page.tsx`: 8-section arcade with TopBar, difficulty filter, daily challenges, featured game, continue playing, 8 category sections, empty state, stats bar
- `app/arcade/page.tsx`: Route page with metadata
- `components/layout/navigation-dock.tsx`: IconDeviceGamepad2 "Arcade" added between Recruiter and Cyber OS
- `modules/collaboration/collaboration-data.ts`: 8 OSS projects, 8 stats, 15 events, 8 mentorships, 10 activities, 8 discussions, 7 governance, 10 recognitions, 8 AI prompts
- `modules/collaboration/collaboration-page.tsx`: 11-section OSS ecosystem page
- `app/collaboration/page.tsx`: Route page
- `modules/cyber-os/os-data.ts`: IconDeviceGamepad2 Arcade app added to OS_APPS
- `modules/cyber-os/os-store.ts`: `openWindow()` for arcade game launching
- Password Cracker Simulator game: `modules/arcade/games/password-cracker.tsx` — educational tool with real-time entropy calculation, strength meter (animated), character diversity chart, dictionary/pattern detection, glass break effect (weak) / glowing vault (strong), 4-scenario crack time estimates (online/offline/GPU/botnet), personalized improvement suggestions, random password generation, passphrase generator, reduced-motion support, keyboard navigation, responsive design. Route at `app/arcade/password-cracker/page.tsx`. Registered with dedicated `/arcade/password-cracker` route in arcade play function.
- Phishing Detective game: `modules/arcade/games/phishing-detective.tsx` — inbox with email cards, email opening animation, Safe/Phishing/Unsure judgment, 12 realistic emails across 4 difficulty levels, clue highlight cards with AI explanations, score/accuracy/streak tracking, 5 achievements, summary review. Route at `app/arcade/phishing-detective/page.tsx`. Registered with dedicated `/arcade/phishing-detective` route.
- Packet Defender game: `modules/arcade/games/packet-defender.tsx` — real-time network packet filtering with animated topology (5-node network: Internet→Gateway→Firewall→Internal→Server), 10 packet types (HTTP/HTTPS/DNS/SSH/ICMP/SMTP + DDoS/Malware/Scanner/Spoofed), requestAnimationFrame game loop at 60 FPS, neon packet animations with CSS transitions, Allow/Block judgment with combo scoring, 3 power-ups (Slow Motion/Firewall Boost/Packet Freeze), boss waves every 15 correct answers, escalating speed per level, educational explanations per packet type, 3 difficulty levels (normal/hard/expert). Route at `app/arcade/packet-defender/page.tsx`. Registered with dedicated `/arcade/packet-defender` route.
- SOC Alert Rush game: `modules/arcade/games/soc-alert-rush.tsx` — SIEM alert triage simulator with 20+ alerts (Brute Force, SQL Injection, Impossible Travel, Suspicious Login, Malware, Privilege Escalation), 4 actions (Investigate/Ignore/Escalate/Close), MITRE ATT&CK mapping per alert (T1110, T1190, T1078, T1090, T1486, T1059, T1003, T1068, etc.), animated SIEM dashboard with scanline overlay, time-based scoring with combo multiplier, 5 achievements (First Triage, SOC Pro, Combo King, Perfect Round, Speed Analyst, Critical Thinker), 3 difficulty levels (easy/medium/hard). Route at `app/arcade/soc-alert-rush/page.tsx`. Registered with dedicated `/arcade/soc-alert-rush` route.
<!-- END:anchored-summary -->