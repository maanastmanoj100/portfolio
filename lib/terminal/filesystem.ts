"use client";

import type { FSNode } from "./types";

export const virtualFS: FSNode = {
  name: "/",
  type: "directory",
  children: [
    {
      name: "home",
      type: "directory",
      children: [
        {
          name: "visitor",
          type: "directory",
          children: [
            { name: "projects", type: "directory", children: [] },
            { name: "skills", type: "directory", children: [] },
            { name: "certifications", type: "directory", children: [] },
            { name: "resume", type: "directory", children: [] },
            { name: "blog", type: "directory", children: [] },
            { name: "contact", type: "directory", children: [] },
            { name: "reports", type: "directory", children: [] },
          ],
        },
      ],
    },
    {
      name: "assets",
      type: "directory",
      children: [
        { name: "logo.svg", type: "file", content: "Cyber Nexus logo - SVG format" },
        { name: "resume.pdf", type: "file", content: "Downloadable resume - PDF format" },
      ],
    },
    {
      name: "etc",
      type: "directory",
      children: [
        { name: "version", type: "file", content: "CyberShell v1.0 | Portfolio v2.0.0" },
        { name: "hostname", type: "file", content: "cybernexus" },
      ],
    },
  ],
};

function findNode(
  node: FSNode,
  parts: string[],
): FSNode | null {
  if (parts.length === 0 || (parts.length === 1 && (parts[0] === "" || parts[0] === "."))) {
    return node;
  }
  if (parts[0] === "..") {
    return null;
  }
  if (!node.children) return null;
  const child = node.children.find((c) => c.name === parts[0]);
  if (!child) return null;
  return findNode(child, parts.slice(1));
}

export function resolvePath(cwd: string, target: string): string[] {
  if (target.startsWith("/")) {
    return target.split("/").filter(Boolean);
  }
  const cwdParts = cwd.split("/").filter(Boolean);
  const targetParts = target.split("/").filter(Boolean);
  const combined = [...cwdParts, ...targetParts];
  const resolved: string[] = [];
  for (const p of combined) {
    if (p === "..") {
      resolved.pop();
    } else if (p !== ".") {
      resolved.push(p);
    }
  }
  return resolved;
}

export function getNode(pathParts: string[]): FSNode | null {
  return findNode(virtualFS, pathParts);
}

export function listDir(pathParts: string[]): FSNode[] | null {
  const node = getNode(pathParts);
  if (!node || node.type !== "directory") return null;
  return node.children ?? [];
}

export function pathExists(pathParts: string[]): boolean {
  return getNode(pathParts) !== null;
}

export function isDirectory(pathParts: string[]): boolean {
  const node = getNode(pathParts);
  return node?.type === "directory";
}
