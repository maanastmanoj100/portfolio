"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { galaxySkills, galaxyConnections, skillConstellations } from "@/data/skills-galaxy";
import type { GalaxySkill, GalaxyNodeType, GalaxyConnection } from "@/types";

function getNodeSize(nodeType: GalaxyNodeType): number {
  switch (nodeType) {
    case "core": return 0.35;
    case "intermediate": return 0.25;
    case "learning": return 0.18;
    case "expert": return 0.4;
  }
}

function getNodeGeometry(nodeType: GalaxyNodeType): [number, number, number] {
  const s = getNodeSize(nodeType);
  return [s, nodeType === "expert" ? 8 : 16, nodeType === "expert" ? 8 : 16];
}

interface GalaxyNodeProps {
  skill: GalaxySkill;
  position: [number, number, number];
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  onSelect: (name: string) => void;
  onHover: (name: string | null) => void;
}

function GalaxyNode({ skill, position, isSelected, isHighlighted, isDimmed, onSelect, onHover }: GalaxyNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const hovered = useRef(false);

  const [hoverGlow, setHoverGlow] = useState(0);

  const color = new THREE.Color(skill.color);
  const size = getNodeSize(skill.nodeType);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const float = Math.sin(t * 0.6 + position[0] * 2) * 0.08;
      meshRef.current.position.y = position[1] + float;
    }
    if (glowRef.current) {
      const pulse = isSelected ? 1.2 : 0.6 + Math.sin(t * 1.2 + position[0]) * 0.3;
      glowRef.current.scale.setScalar(1 + pulse * 0.15 * (isHighlighted ? 1.5 : 1));
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (isDimmed ? 0.1 : 0.15 + pulse * 0.12) + hoverGlow * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      ringRef.current.rotation.y = t * 0.2;
      const ringScale = 1 + Math.sin(t * 0.5) * 0.05;
      ringRef.current.scale.setScalar(ringScale);
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(skill.name);
  }, [skill.name, onSelect]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = true;
    setHoverGlow(1);
    onHover(skill.name);
    document.body.style.cursor = "pointer";
  }, [skill.name, onHover]);

  const handlePointerOut = useCallback(() => {
    hovered.current = false;
    setHoverGlow(0);
    onHover(null);
    document.body.style.cursor = "default";
  }, [onHover]);

  const opacity = isDimmed ? 0.15 : isSelected ? 1 : isHighlighted ? 0.9 : 0.7;

  return (
    <group position={position}>
      <mesh
        ref={glowRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[size * 1.8, 16, 16]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {skill.nodeType === "expert" ? (
          <octahedronGeometry args={[size, 0]} />
        ) : (
          <sphereGeometry args={[size, 20, 20]} />
        )}
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.15}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : isHighlighted ? 0.4 : 0.15}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>

      <mesh ref={ringRef}>
        <ringGeometry args={[size * 1.4, size * 1.6, 32]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.15 * opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group>
        <Text
          position={[0, -size - 0.35, 0]}
          fontSize={0.12}
          color="#e8edf5"
          anchorX="center"
          anchorY="top"
          font="Geist"
        >
          {skill.name}
        </Text>
      </group>
    </group>
  );
}

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  isActive: boolean;
  isDimmed: boolean;
}

function ConnectionLine({ start, end, color, isActive, isDimmed }: ConnectionLineProps) {
  const ref = useRef<any>(null!);
  const points = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    );
    return curve.getPoints(20);
  }, [start, end]);

  useFrame((state) => {
    if (ref.current && isActive) {
      ref.current.material.dashOffset -= 0.005;
    }
  });

  const opacity = isDimmed ? 0.02 : isActive ? 0.4 : 0.08;

  return (
    <Line
      ref={ref}
      points={points}
      color={color}
      lineWidth={isActive ? 1.5 : 0.5}
      transparent
      opacity={opacity}
      dashed={isActive}
      dashSize={0.05}
      dashScale={4}
    />
  );
}

interface ParticleFieldProps {
  count: number;
}

function ParticleField({ count }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.6, 0.3 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.008;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.005) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        size={0.04}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Import Points and PointMaterial from drei
import { Points, PointMaterial } from "@react-three/drei";

function ConstellationLabel({ id, label, color, position, active }: { id: string; label: string; color: string; position: [number, number, number]; active: boolean }) {
  return (
    <Text
      position={position}
      fontSize={0.3}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="Geist"
    >
      {label}
    </Text>
  );
}

interface GalaxySceneProps {
  selectedSkill: string | null;
  hoveredSkill: string | null;
  searchQuery: string;
  activeClusters: string[];
  onSelectSkill: (name: string) => void;
  onHoverSkill: (name: string | null) => void;
  onCameraMove?: (pos: [number, number, number]) => void;
}

function GalaxyScene({ selectedSkill, hoveredSkill, searchQuery, activeClusters, onSelectSkill, onHoverSkill }: GalaxySceneProps) {
  const controlsRef = useRef<any>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const nodePositions = useMemo(() => {
    const positions: Map<string, [number, number, number]> = new Map();
    const angleStep = (Math.PI * 2) / galaxySkills.length;

    galaxySkills.forEach((skill, i) => {
      const constellation = skillConstellations.find((c) => c.id === skill.cluster);
      if (constellation) {
        const clusterSkills = skillConstellations
          .find((c) => c.id === skill.cluster)?.skills || [];
        const idx = clusterSkills.indexOf(skill.name);
        const spread = 2.5;
        const count = clusterSkills.length;
        const cAngle = (idx / count) * Math.PI * 2;
        const radius = 1.2 + (idx % 3) * 0.6;
        positions.set(skill.name, [
          constellation.position.x + Math.cos(cAngle) * radius,
          constellation.position.y + Math.sin(cAngle) * radius * 0.8,
          constellation.position.z + (idx % 2 === 0 ? 0.5 : -0.5),
        ]);
      } else {
        const theta = angleStep * i;
        const phi = Math.cos(i * 1.1) * 0.5;
        const radius = 6 + Math.sin(i * 0.5) * 1.5;
        positions.set(skill.name, [
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi) * 1.5,
          radius * Math.sin(theta) * Math.cos(phi),
        ]);
      }
    });

    return positions;
  }, []);

  const isHighlighted = useCallback((skillName: string): boolean => {
    if (!selectedSkill && !hoveredSkill) return true;
    const target = selectedSkill || hoveredSkill;
    if (!target) return true;
    if (skillName === target) return true;
    return galaxyConnections.some(
      (c) => (c.source === target && c.target === skillName) || (c.target === target && c.source === skillName)
    );
  }, [selectedSkill, hoveredSkill]);

  const isDimmed = useCallback((skillName: string): boolean => {
    if (!selectedSkill && !hoveredSkill && !searchQuery && activeClusters.length === 0) return false;
    if (activeClusters.length > 0) {
      const skill = galaxySkills.find((s) => s.name === skillName);
      if (skill && !activeClusters.includes(skill.cluster)) return true;
    }
    if (searchQuery) {
      return !skillName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    const target = selectedSkill || hoveredSkill;
    if (!target) return true;
    return skillName !== target && !galaxyConnections.some(
      (c) => (c.source === target && c.target === skillName) || (c.target === target && c.source === skillName)
    );
  }, [selectedSkill, hoveredSkill, searchQuery, activeClusters]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -5, -10]} intensity={0.4} color="#4040ff" />
      <fog attach="fog" args={["#08090c", 15, 30]} />

      <ParticleField count={3000} />

      <group ref={groupRef}>
        {skillConstellations.map((constellation) => {
          const active = activeClusters.length === 0 || activeClusters.includes(constellation.id);
          return (
            <ConstellationLabel
              key={constellation.id}
              {...constellation}
              position={[constellation.position.x, constellation.position.y + 2.5, constellation.position.z]}
              active={active}
            />
          );
        })}

        {galaxySkills.map((skill) => {
          const pos = nodePositions.get(skill.name);
          if (!pos) return null;
          const highlighted = isHighlighted(skill.name);
          const dimmed = isDimmed(skill.name);
          if (activeClusters.length > 0 && !activeClusters.includes(skill.cluster)) return null;
          return (
            <GalaxyNode
              key={skill.name}
              skill={skill}
              position={pos}
              isSelected={selectedSkill === skill.name}
              isHighlighted={highlighted}
              isDimmed={dimmed}
              onSelect={onSelectSkill}
              onHover={onHoverSkill}
            />
          );
        })}

        {galaxyConnections.map((conn, i) => {
          const start = nodePositions.get(conn.source);
          const end = nodePositions.get(conn.target);
          if (!start || !end) return null;
          const target = selectedSkill || hoveredSkill;
          const isActive = target ? (conn.source === target || conn.target === target) : false;
          const dimmed = !!(selectedSkill || hoveredSkill) && !isActive;
          return (
            <ConnectionLine
              key={`conn-${i}`}
              start={start}
              end={end}
              color="#4a9eff"
              isActive={isActive}
              isDimmed={dimmed}
            />
          );
        })}
      </group>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.3}
        zoomSpeed={0.5}
        panSpeed={0.3}
        minDistance={3}
        maxDistance={25}
        target={[0, 0, 0]}
      />
    </>
  );
}

export function SkillsGalaxyThree({
  selectedSkill,
  hoveredSkill,
  searchQuery,
  activeClusters,
  onSelectSkill,
  onHoverSkill,
}: {
  selectedSkill: string | null;
  hoveredSkill: string | null;
  searchQuery: string;
  activeClusters: string[];
  onSelectSkill: (name: string) => void;
  onHoverSkill: (name: string | null) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <GalaxyScene
        selectedSkill={selectedSkill}
        hoveredSkill={hoveredSkill}
        searchQuery={searchQuery}
        activeClusters={activeClusters}
        onSelectSkill={onSelectSkill}
        onHoverSkill={onHoverSkill}
      />
    </Canvas>
  );
}
