# ADR-008: Security Engineering

**Status:** Accepted  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

As a cybersecurity portfolio, the project must demonstrate security engineering best practices in its own construction.

## Decision

1. **No secrets in repository**: All environment variables excluded via `.gitignore` (`.env*`)
2. **No real credentials**: All demo data uses fictional IPs (10.10.x.x), sanitized configurations
3. **Content Security Policy**: Apply CSP headers in production via `next.config.ts`
4. **Dependency scanning**: Monitor via `npm audit` and GitHub Dependabot (once configured)
5. **Input validation**: All user-facing inputs sanitized (search, terminal, forms)
6. **Data source transparency**: All data tagged LIVE / DEMO / HIST / SIM — never misrepresent
7. **Responsible disclosure**: `SECURITY.md` with contact instructions

## Prohibited

- Real API keys, tokens, or passwords
- Active flags, credentials, or platform-restricted content
- Internal hostnames or IPs (use 10.10.x.x for lab)
- Exaggerated qualifications or unearned certifications

## Consequences
- + Demonstrates security maturity
- + Safe for public repository
- - Requires ongoing dependency maintenance
- - Simulated data may be confused with real data without clear labeling
