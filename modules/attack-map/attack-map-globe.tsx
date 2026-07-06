"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { COUNTRIES, ATTACK_EVENTS, severityColors, getCountryByCode } from "./attack-map-data";
import type { CountryData, AttackEvent } from "./attack-map-data";

const GLOBE_RADIUS = 1.5;
const MARKER_RADIUS = 0.04;
const ARC_HEIGHT = 0.8;

function latLngToPos(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function createArcPath(start: THREE.Vector3, end: THREE.Vector3, height: number): THREE.QuadraticBezierCurve3 {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + height);
  return new THREE.QuadraticBezierCurve3(start, mid, end);
}

interface ParticleLineProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  speed: number;
  index: number;
}

function ParticleLine({ start, end, color, speed, index }: ParticleLineProps) {
  const curve = useMemo(() => createArcPath(start, end, ARC_HEIGHT), [start, end]);
  const particleRef = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Points>(null!);
  const progressRef = useRef(index * 0.15);

  const trailPositions = useMemo(() => new Float32Array(30 * 3), []);

  useFrame((_, delta) => {
    progressRef.current += delta * speed * 0.4;
    if (progressRef.current > 1) progressRef.current -= 1;

    if (particleRef.current) {
      const pt = curve.getPoint(progressRef.current);
      particleRef.current.position.copy(pt);
    }

    if (trailRef.current) {
      const geo = trailRef.current.geometry as THREE.BufferGeometry;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 29; i > 0; i--) {
        pos[i * 3] = pos[(i - 1) * 3];
        pos[i * 3 + 1] = pos[(i - 1) * 3 + 1];
        pos[i * 3 + 2] = pos[(i - 1) * 3 + 2];
      }
      const head = curve.getPoint(progressRef.current);
      pos[0] = head.x;
      pos[1] = head.y;
      pos[2] = head.z;
      geo.attributes.position.needsUpdate = true;
    }
  });

  const points = useMemo(() => {
    const pts = curve.getPoints(32);
    return new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]));
  }, [curve]);

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} count={33} array={points} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </line>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} count={30} array={trailPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

function PulseRing({ position, color }: { position: THREE.Vector3; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const s = 1 + (Math.sin(t * 1.5) * 0.5 + 0.5) * 0.5;
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - (s - 1) / 0.5;
    }
  });
  return (
    <mesh ref={ringRef} position={position}>
      <ringGeometry args={[0.04, 0.08, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface CountryMarkerProps {
  country: CountryData;
  isSelected: boolean;
  onClick: (code: string) => void;
  onHover: (code: string | null) => void;
}

function CountryMarker({ country, isSelected, onClick, onHover }: CountryMarkerProps) {
  const pos = useMemo(() => latLngToPos(country.lat, country.lng, GLOBE_RADIUS), [country]);
  const glowRef = useRef<THREE.Mesh>(null!);
  const color = country.threatScore > 70 ? "#ef4444" : country.threatScore > 50 ? "#f97316" : "#3b82f6";
  const size = 0.03 + (country.activeAttacks / 10) * 0.04;

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const p = Math.sin(clock.getElapsedTime() * 1.5 + country.lat) * 0.3 + 0.7;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = p * (isSelected ? 0.8 : 0.3);
    }
  });

  const handlePointer = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.type === "click") onClick(country.code);
    if (e.type === "pointerover") onHover(country.code);
    if (e.type === "pointerout") onHover(null);
  }, [country.code, onClick, onHover]);

  return (
    <group>
      <mesh position={pos} onClick={handlePointer} onPointerOver={handlePointer} onPointerOut={handlePointer}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowRef} position={pos}>
        <sphereGeometry args={[size * 2.5, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {isSelected && <PulseRing position={pos} color={color} />}
    </group>
  );
}

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

function generateHeatPoints(): HeatPoint[] {
  const points: HeatPoint[] = [];
  for (let i = 0; i < 300; i++) {
    const lat = Math.random() * 140 - 70;
    const lng = Math.random() * 360 - 180;
    let intensity = 0;
    for (const c of COUNTRIES) {
      const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2);
      if (d < 30) intensity += (c.threatScore / 100) * (1 - d / 30);
    }
    points.push({ lat, lng, intensity: Math.min(intensity, 1) });
  }
  return points;
}

function HeatMap() {
  const points = useMemo(generateHeatPoints, []);
  const positions = useMemo(() => {
    const arr: number[] = [];
    const alphas: number[] = [];
    const cols: number[] = [];
    for (const p of points) {
      if (p.intensity < 0.05) continue;
      const pos = latLngToPos(p.lat, p.lng, GLOBE_RADIUS * 1.01);
      arr.push(pos.x, pos.y, pos.z);
      alphas.push(p.intensity);
      cols.push(1, 0.2, 0.1);
    }
    return { positions: new Float32Array(arr), alphas: new Float32Array(alphas), colors: new Float32Array(cols) };
  }, [points]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.positions, 3]} count={positions.positions.length / 3} array={positions.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[positions.colors, 3]} count={positions.colors.length / 3} array={positions.colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" args={[new Float32Array(positions.alphas.map((a) => a * 0.08 + 0.02)), 1]} count={positions.alphas.length} array={new Float32Array(positions.alphas.map((a) => a * 0.08 + 0.02))} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function GlobeWireframe() {
  const positions = useMemo(() => {
    const arr: number[] = [];
    for (let lat = -80; lat <= 80; lat += 15) {
      for (let lng = 0; lng <= 360; lng += 4) {
        const p = latLngToPos(lat, lng, GLOBE_RADIUS * 1.01);
        arr.push(p.x, p.y, p.z);
      }
    }
    for (let lng = 0; lng < 360; lng += 15) {
      for (let lat = -80; lat <= 80; lat += 4) {
        const p = latLngToPos(lat, lng, GLOBE_RADIUS * 1.01);
        arr.push(p.x, p.y, p.z);
      }
    }
    return new Float32Array(arr);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#00b4d8" transparent opacity={0.08} depthWrite={false} />
    </lineSegments>
  );
}

function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const p = Math.sin(clock.getElapsedTime() * 0.3) * 0.02 + 0.06;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = p;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.06, 32, 32]} />
      <meshBasicMaterial color="#00b4d8" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

interface AttackSceneProps {
  selectedCountry: string | null;
  hoveredCountry: string | null;
  onCountryClick: (code: string) => void;
  onCountryHover: (code: string | null) => void;
  activeAttacks: AttackEvent[];
  autoRotate: boolean;
}

function AttackScene({ selectedCountry, hoveredCountry, onCountryClick, onCountryHover, activeAttacks, autoRotate }: AttackSceneProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const visibleArcs = useMemo(
    () => activeAttacks.filter((a) => getCountryByCode(a.sourceCode) && getCountryByCode(a.destCode)),
    [activeAttacks],
  );

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshBasicMaterial color="#080a14" transparent opacity={0.9} />
      </mesh>
      <GlobeWireframe />
      <HeatMap />
      <Atmosphere />

      {COUNTRIES.map((c) => (
        <CountryMarker
          key={c.code}
          country={c}
          isSelected={selectedCountry === c.code}
          onClick={onCountryClick}
          onHover={onCountryHover}
        />
      ))}

      {visibleArcs.map((attack, i) => {
        const src = getCountryByCode(attack.sourceCode)!;
        const dst = getCountryByCode(attack.destCode)!;
        const start = latLngToPos(src.lat, src.lng, GLOBE_RADIUS);
        const end = latLngToPos(dst.lat, dst.lng, GLOBE_RADIUS);
        const color = severityColors[attack.severity] || "#3b82f6";
        return (
          <group key={attack.id}>
            <ParticleLine start={start} end={end} color={color} speed={0.3 + i * 0.05} index={i} />
            <PulseRing position={end} color={color} />
          </group>
        );
      })}
    </group>
  );
}

export interface AttackMapGlobeProps {
  selectedCountry: string | null;
  hoveredCountry: string | null;
  onCountryClick: (code: string) => void;
  onCountryHover: (code: string | null) => void;
  activeAttacks?: AttackEvent[];
  autoRotate?: boolean;
}

export function AttackMapGlobe({
  selectedCountry,
  hoveredCountry,
  onCountryClick,
  onCountryHover,
  activeAttacks = ATTACK_EVENTS,
  autoRotate = true,
}: AttackMapGlobeProps) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0.5, 4.5], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <AttackScene
          selectedCountry={selectedCountry}
          hoveredCountry={hoveredCountry}
          onCountryClick={onCountryClick}
          onCountryHover={onCountryHover}
          activeAttacks={activeAttacks}
          autoRotate={autoRotate}
        />
        <OrbitControls enablePan={false} enableZoom={true} zoomSpeed={0.6} rotateSpeed={0.4} minDistance={2.5} maxDistance={8} />
      </Canvas>
    </div>
  );
}
