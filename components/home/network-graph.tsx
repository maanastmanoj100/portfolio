"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRouter } from "next/navigation";

interface GraphNode {
  id: string;
  label: string;
  href: string;
  description: string;
  color: string;
}

const nodes: GraphNode[] = [
  { id: "projects", label: "Projects", href: "/projects", description: "Security tools & write-ups", color: "#00b4d8" },
  { id: "skills", label: "Skills", href: "/skills", description: "Technical expertise", color: "#3b82f6" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard", description: "Live SOC metrics", color: "#8b5cf6" },
  { id: "certifications", label: "Certs", href: "/certifications", description: "Industry credentials", color: "#10b981" },
  { id: "blog", label: "Blog", href: "/blog", description: "Security research", color: "#f59e0b" },
  { id: "resume", label: "Resume", href: "/resume", description: "Experience & education", color: "#ef4444" },
  { id: "contact", label: "Contact", href: "/contact", description: "Get in touch", color: "#ec4899" },
];

function getNodePositions(count: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 2.2 + Math.random() * 0.8;
    positions.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.7,
        (Math.random() - 0.5) * 1.5,
      ),
    );
  }
  return positions;
}

function NetworkScene({ onNodeClick }: { onNodeClick: (href: string) => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  const hoveredRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const nodePositions = useMemo(() => getNodePositions(nodes.length), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05 + mouseRef.current.y * 0.02;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.05 + mouseRef.current.x * 0.02;
    }
  });

  const lines = useMemo(() => {
    const pairs: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 3.5) {
          pairs.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z,
          );
        }
      }
    }
    return new Float32Array(pairs);
  }, [nodePositions.length]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 4]} intensity={0.2} color="#00b4d8" />

      <group ref={groupRef}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[lines, 3]}
              count={lines.length / 3}
              array={lines}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00b4d8" transparent opacity={0.08} />
        </lineSegments>

        {nodePositions.map((pos, i) => {
          const node = nodes[i];
          const isHovered = hoveredId === i;
          return (
            <NodeSphere
              key={node.id}
              position={pos}
              color={node.color}
              isHovered={isHovered}
              index={i}
              onPointerOver={() => setHoveredId(i)}
              onPointerOut={() => setHoveredId(null)}
              onClick={() => onNodeClick(node.href)}
            />
          );
        })}
      </group>
    </>
  );
}

function NodeSphere({
  position,
  color,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  position: THREE.Vector3;
  color: string;
  isHovered: boolean;
  index: number;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      const pulse = 0.08 + Math.sin(state.clock.getElapsedTime() * 0.8 + position.x) * 0.04;
      ref.current.scale.setScalar(isHovered ? 1.5 : 1 + pulse);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

export function NetworkGraph({ onNavigate, className }: { onNavigate?: (href: string) => void; className?: string }) {
  const router = useRouter();

  const handleClick = useCallback((href: string) => {
    if (onNavigate) onNavigate(href);
    else router.push(href);
  }, [router, onNavigate]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%", minHeight: 280 }}
      >
        <NetworkScene onNodeClick={handleClick} />
      </Canvas>
    </div>
  );
}
