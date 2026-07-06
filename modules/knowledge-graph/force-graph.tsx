"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { nodes as rawNodes, edges as rawEdges, type GraphNode, type GraphEdge, getNode, labelByType } from "./graph-data";

interface ForceGraphProps {
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  filterTypes: string[];
  searchQuery: string;
}

const REPULSION = 800;
const ATTRACTION = 0.005;
const CENTERING = 0.01;
const DAMPING = 0.85;
const MIN_VELOCITY = 0.1;

const TYPE_SHAPES: Record<string, string> = {
  project: "rect", skill: "circle", certification: "diamond",
  technology: "circle", tool: "diamond", blog: "rect",
  ctf: "diamond", lab_vm: "rect", research: "rect",
  learning_path: "circle", future_goal: "star", os: "circle", framework: "circle",
};

function calculateLayout(nodes: GraphNode[], edges: GraphEdge[]) {
  const centerX = 400, centerY = 300;
  const angleStep = (2 * Math.PI) / nodes.length;
  nodes.forEach((node, i) => {
    if (!node.pinned) {
      const angle = angleStep * i;
      const radius = 150 + Math.random() * 100;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
      node.vx = 0;
      node.vy = 0;
    }
  });
}

export default function ForceGraph({ selectedNode, onSelectNode, filterTypes, searchQuery }: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [nodesState, setNodesState] = useState<GraphNode[]>([]);
  const [simulationReady, setSimulationReady] = useState(false);

  const filtered = nodesState.filter((n) => {
    if (filterTypes.length > 0 && !filterTypes.includes(n.type)) return false;
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase()) && !n.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredIds = new Set(filtered.map((n) => n.id));
  const visibleEdges = rawEdges.filter((e) => filteredIds.has(e.source) && filteredIds.has(e.target));

  const isHighlighted = useCallback(
    (id: string) => {
      if (!selectedNode) return false;
      if (id === selectedNode) return true;
      return rawEdges.some((e) => (e.source === selectedNode && e.target === id) || (e.target === selectedNode && e.source === id));
    },
    [selectedNode]
  );

  useEffect(() => {
    const initialized = rawNodes.map((n) => ({ ...n }));
    calculateLayout(initialized, rawEdges);
    setNodesState(initialized);
    setSimulationReady(true);
  }, []);

  useEffect(() => {
    if (!simulationReady) return;
    let running = true;
    const simulate = () => {
      if (!running) return;
      setNodesState((prev) => {
        const next = prev.map((n) => ({ ...n }));
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[i].x - next[j].x;
            const dy = next[i].y - next[j].y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const force = REPULSION / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (!next[i].pinned && next[i].id !== dragging) { next[i].vx += fx; next[i].vy += fy; }
            if (!next[j].pinned && next[j].id !== dragging) { next[j].vx -= fx; next[j].vy -= fy; }
          }
        }

        for (const edge of rawEdges) {
          const src = next.find((n) => n.id === edge.source);
          const tgt = next.find((n) => n.id === edge.target);
          if (!src || !tgt) continue;
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = (dist - 100) * ATTRACTION;
          const fx = (dx / Math.max(dist, 1)) * force;
          const fy = (dy / Math.max(dist, 1)) * force;
          if (!src.pinned && src.id !== dragging) { src.vx += fx; src.vy += fy; }
          if (!tgt.pinned && tgt.id !== dragging) { tgt.vx -= fx; tgt.vy -= fy; }
        }

        let totalKinetic = 0;
        for (const n of next) {
          if (n.pinned || n.id === dragging) continue;
          n.vx += (centerX - n.x) * CENTERING;
          n.vy += (centerY - n.y) * CENTERING;
          n.vx *= DAMPING;
          n.vy *= DAMPING;
          if (Math.abs(n.vx) < MIN_VELOCITY && Math.abs(n.vy) < MIN_VELOCITY) { n.vx = 0; n.vy = 0; }
          n.x += n.vx;
          n.y += n.vy;
          n.x = Math.max(20, Math.min(dimensions.width * 2, n.x));
          n.y = Math.max(20, Math.min(dimensions.height * 2, n.y));
          totalKinetic += Math.abs(n.vx) + Math.abs(n.vy);
        }
        return next;
      });
      animRef.current = requestAnimationFrame(simulate);
    };
    animRef.current = requestAnimationFrame(simulate);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [dimensions, simulationReady, dragging]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDragging(nodeId);
    setNodesState((prev) => prev.map((n) => (n.id === nodeId ? { ...n, pinned: true } : n)));
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setNodesState((prev) => prev.map((n) => (n.id === dragging ? { ...n, x, y } : n)));
    },
    [dragging, zoom, pan]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(0.2, Math.min(5, z * delta)));
  }, []);

  const panRef = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  const handlePanStart = (e: React.MouseEvent) => {
    if (dragging) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
    }
  };

  const handlePanEnd = () => { isPanning.current = false; };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/40"
      style={{ height: 600 }}
      onMouseMove={(e) => { handleMouseMove(e); handlePanMove(e); }}
      onMouseUp={() => { handleMouseUp(); handlePanEnd(); }}
      onMouseLeave={() => { handleMouseUp(); handlePanEnd(); }}
      onWheel={handleWheel}
    >
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        <button onClick={() => setZoom((z) => Math.min(5, z * 1.3))} className="px-2 py-2 rounded bg-white/10 text-white text-xs hover:bg-white/20">+</button>
        <button onClick={() => setZoom((z) => Math.max(0.2, z * 0.7))} className="px-2 py-2 rounded bg-white/10 text-white text-xs hover:bg-white/20">−</button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="px-2 py-2 rounded bg-white/10 text-white text-xs hover:bg-white/20">Reset</button>
      </div>
      <div className="absolute top-3 right-3 z-10 text-xs text-muted-foreground bg-black/60 px-2 py-1 rounded">
        {filtered.length} nodes · {visibleEdges.length} edges · Drag to pan · Scroll to zoom
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handlePanStart}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {visibleEdges.map((edge) => {
            const src = nodesState.find((n) => n.id === edge.source);
            const tgt = nodesState.find((n) => n.id === edge.target);
            if (!src || !tgt) return null;
            const highlight = selectedNode && (selectedNode === edge.source || selectedNode === edge.target);
            return (
              <g key={edge.id}>
                <line
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={highlight ? "#22d3ee" : "#ffffff15"}
                  strokeWidth={highlight ? 2 : 0.8}
                  className="transition-all duration-300"
                />
                {hovered && (hovered === edge.source || hovered === edge.target) && (
                  <text
                    x={(src.x + tgt.x) / 2} y={(src.y + tgt.y) / 2 - 6}
                    fill="#22d3ee" fontSize={8} textAnchor="middle" className="select-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodesState.map((node) => {
            const highlight = selectedNode ? isHighlighted(node.id) : false;
            const isSelected = selectedNode === node.id;
            const isFiltered = filteredIds.has(node.id);
            const cx = node.x;
            const cy = node.y;
            const s = (node.size / 2) * (isSelected ? 1.4 : 1);
            const fill = isSelected ? node.color : "#ffffff15";
            const stroke = isSelected ? node.color : highlight ? "#22d3ee80" : "#ffffff30";
            const strokeW = isSelected ? 2 : highlight ? 1.5 : 0.5;

            if (!isFiltered) return null;

            let shape: React.ReactNode = null;
            if (node.type === "project" || node.type === "blog" || node.type === "lab_vm" || node.type === "research") {
              shape = <rect x={cx - s} y={cy - s * 0.7} width={s * 2} height={s * 1.4} rx={3} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
            } else if (node.type === "certification" || node.type === "tool" || node.type === "ctf") {
              shape = (
                <polygon
                  points={`${cx},${cy - s} ${cx + s * 0.7},${cy} ${cx},${cy + s} ${cx - s * 0.7},${cy}`}
                  fill={fill} stroke={stroke} strokeWidth={strokeW}
                />
              );
            } else {
              shape = <circle cx={cx} cy={cy} r={s} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
            }

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: selectedNode && !highlight && !isSelected ? 0.3 : 1 }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={(e) => { e.stopPropagation(); onSelectNode(isSelected ? null : node.id); }}
              >
                {shape}
                <text
                  x={cx} y={cy + s + 10}
                  fill={isSelected || highlight ? "#ffffff" : "#ffffff80"}
                  fontSize={isSelected ? 9 : 7}
                  textAnchor="middle" className="select-none pointer-events-none"
                >
                  {node.label.length > 16 ? node.label.slice(0, 14) + "…" : node.label}
                </text>
                {isSelected && (
                  <circle cx={cx} cy={cy} r={s + 4} fill="none" stroke={node.color} strokeWidth={1} opacity={0.5}>
                    <animate attributeName="r" from={s + 4} to={s + 8} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from={0.5} to={0} dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
