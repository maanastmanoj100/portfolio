import type { IntelCategory } from "./types";
import type { SourceDef } from "./sources";

/**
 * Keyword classification.
 *
 * Most sources don't carry a category, so we infer one from the headline and
 * excerpt. The result is always recorded as `categoryBasis: "keyword"` so the
 * UI can say "categorised from the headline" instead of implying that the
 * publisher labelled it. Sources that *are* category-specific (KEV, NVD, the
 * Indian alert index, leak-site claims) never go through this path.
 */

interface Rule {
  category: IntelCategory;
  patterns: RegExp[];
}

/**
 * Order matters: the first rule that matches wins. Ransomware and breaches are
 * placed before the generic "vulnerability" rule so that "ransomware gang
 * exploits CVE-…" is filed under ransomware, not vulnerabilities.
 */
const RULES: Rule[] = [
  {
    category: "ransomware",
    patterns: [
      /\bransomware\b/i,
      /\bransom(?:ed|ware)?\b/i,
      /\blockbit\b/i,
      /\bblackcat\b/i,
      /\balphv\b/i,
      /\bcl0p\b|\bclop\b/i,
      /\bqilin\b/i,
      /\bakira\b/i,
      /\bblack basta\b/i,
      /\brhysida\b/i,
      /\bmedusa\b/i,
      /\bmallox\b/i,
      /\bleak site\b/i,
      /\bmalware\b/i,
      /\btrojan\b/i,
      /\bbotnet\b/i,
      /\binfo-?stealer\b/i,
      /\bspyware\b/i,
      /\bbackdoor\b/i,
      /\brootkit\b/i,
      /\bkeylogger\b/i,
      /\bremote access trojan\b|\brat\b/i,
      /\bloader\b/i,
      /\bworm\b/i,
    ],
  },
  {
    category: "breach",
    patterns: [
      /\bdata breach\b/i,
      /\bbreach(?:ed|es)?\b/i,
      /\bdata leak\b/i,
      /\bleaked\b/i,
      /\bexpos(?:ed|ure)\b/i,
      /\bexfiltrat(?:ed|ion)\b/i,
      /\bstolen (?:data|credentials|records)\b/i,
      /\b(?:customer|user|employee|patient) (?:data|records|information)\b/i,
      /\bmillions? of records\b/i,
      /\bcredential (?:dump|stuffing|leak)\b/i,
    ],
  },
  {
    category: "exploit",
    patterns: [
      /\bzero[- ]day\b/i,
      /\b0-day\b/i,
      /\bexploited in the wild\b/i,
      /\bactively exploited\b/i,
      /\bknown exploited\b/i,
      /\bexploitation\b/i,
      /\bproof[- ]of[- ]concept\b/i,
      /\bkev catalog\b/i,
      /\bpatch (?:bypass|escapes?)\b/i,
    ],
  },
  {
    category: "threat-actor",
    patterns: [
      /\bapt[- ]?\d{1,2}\b/i,
      /\bthreat actor\b/i,
      /\bthreat group\b/i,
      /\bnation[- ]state\b/i,
      /\bstate[- ]sponsored\b/i,
      /\bhacktivist\b/i,
      /\bcyber ?espionage\b/i,
      /\bespionage\b/i,
      /\blazarus\b/i,
      /\bkimsuky\b/i,
      /\bsandworm\b/i,
      /\bfin\d{1,2}\b/i,
      /\bscattered spider\b/i,
      /\bmidnight blizzard\b/i,
      /\bvolt typhoon\b/i,
      /\bsalt typhoon\b/i,
      /\b(?:campaign|operation) (?:targeting|against)\b/i,
    ],
  },
  {
    category: "vulnerability",
    patterns: [
      /\bCVE-\d{4}-\d{4,7}\b/i,
      /\bvulnerabilit(?:y|ies)\b/i,
      /\bsecurity advisory\b/i,
      /\badvisory\b/i,
      /\bCVSS\b/i,
      /\bCWE-\d+/i,
      /\bflaw\b/i,
      /\bpatch(?:es|ed|ing)?\b/i,
      /\bsecurity update\b/i,
      /\bremote code execution\b/i,
      /\bprivilege escalation\b/i,
      /\bdenial of service\b/i,
      /\bauthentication bypass\b/i,
    ],
  },
  {
    category: "incident",
    patterns: [
      /\bcyber ?attack\b/i,
      /\battack(?:ed|s|ing)?\b/i,
      /\bintrusion\b/i,
      /\bcompromis(?:ed|e)\b/i,
      /\bhit by\b/i,
      /\bdisrupt(?:ed|ion)\b/i,
      /\boutage\b/i,
      /\bshut ?down\b/i,
      /\bddos\b/i,
      /\bdefac(?:ed|ement)\b/i,
      /\bstolen\b/i,
    ],
  },
  {
    category: "india",
    patterns: [
      /\bcert-in\b/i,
      /\bcyber swachhta\b/i,
      /\bindian (?:government|agencies|organisations|organizations)\b/i,
      /\bmeity\b/i,
      /\b(?:rbi|sebi|npci|uidai)\b/i,
    ],
  },
  {
    category: "research",
    patterns: [
      /\bresearch(?:ers)?\b/i,
      /\banalysis\b/i,
      /\bguidance\b/i,
      /\bbest practice/i,
      /\bhardening\b/i,
      /\bmitigat(?:e|ion)\b/i,
      /\bdefen[cs]e in depth\b/i,
      /\b(?:blue|red) team\b/i,
      /\bdetection engineering\b/i,
      /\bthreat model/i,
      /\bframework\b/i,
    ],
  },
];

/** Sources whose own typing is authoritative; keyword rules must not override it. */
const STRICT_SOURCE_IDS = new Set([
  "cisa-kev",
  "nvd-cve",
  "csk-alerts",
  "ransomware-live",
]);

export interface Classification {
  category: IntelCategory;
  basis: "source" | "keyword" | "type";
}

export function classify(
  source: SourceDef,
  input: { title: string; summary?: string; tags?: string[] },
): Classification {
  if (source.defaultCategory && STRICT_SOURCE_IDS.has(source.id)) {
    return { category: source.defaultCategory, basis: "source" };
  }

  const haystack = [input.title, input.summary ?? "", (input.tags ?? []).join(" ")].join(" ");

  for (const rule of RULES) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return { category: rule.category, basis: "keyword" };
    }
  }

  if (source.defaultCategory) {
    return { category: source.defaultCategory, basis: "source" };
  }

  return { category: "general", basis: "type" };
}
