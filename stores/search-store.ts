"use client";

import { create } from "zustand";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { blogPosts } from "@/data/blog";
import { certifications } from "@/data/certifications";

export interface SearchResult {
  id: string;
  label: string;
  description: string;
  href: string;
  category: string;
  icon?: string;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  recentSearches: string[];
}

interface SearchActions {
  setQuery: (q: string) => void;
  search: (q: string) => void;
  clearSearch: () => void;
  addRecentSearch: (q: string) => void;
}

function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  projects.forEach((p) => {
    index.push({
      id: `project-${p.id}`,
      label: p.title,
      description: p.description,
      href: `/projects/${p.id}`,
      category: "Project",
    });
  });

  skills.forEach((s) => {
    index.push({
      id: `skill-${s.name}`,
      label: s.name,
      description: s.description,
      href: `/skills/${s.name.toLowerCase().replace(/\s+/g, "-")}`,
      category: "Skill",
    });
  });

  blogPosts.forEach((b) => {
    index.push({
      id: `blog-${b.slug}`,
      label: b.title,
      description: b.description,
      href: `/blog/${b.slug}`,
      category: "Blog",
    });
  });

  certifications.forEach((c) => {
    index.push({
      id: `cert-${c.name}`,
      label: c.name,
      description: c.issuer,
      href: "/certifications",
      category: "Certification",
    });
  });

  return index;
}

const searchIndex = buildSearchIndex();

function performSearch(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return searchIndex
    .filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
    .slice(0, 10);
}

export const useSearchStore = create<SearchState & SearchActions>((set) => ({
  query: "",
  results: [],
  isSearching: false,
  recentSearches: [],

  setQuery: (query) => {
    set({ query, isSearching: query.length > 0 });
    if (query.length > 0) {
      const results = performSearch(query);
      set({ results, isSearching: false });
    } else {
      set({ results: [], isSearching: false });
    }
  },
  search: (q) => {
    set({ query: q, isSearching: true });
    const results = performSearch(q);
    set({ results, isSearching: false });
  },
  clearSearch: () => set({ query: "", results: [], isSearching: false }),
  addRecentSearch: (q) =>
    set((s) => {
      const updated = [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 5);
      return { recentSearches: updated };
    }),
}));
