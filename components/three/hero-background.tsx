"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function useMousePosition() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      ref.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      ref.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return ref;
}

function ParticleField({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 1200;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.5, 0.2 + Math.random() * 0.25);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = 0.02 + Math.random() * 0.06;
    }
    return [pos, col, siz];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = Math.sin(t * 0.015) * 0.2 + mouse.current.y * 0.05;
      ref.current.rotation.y = Math.sin(t * 0.02) * 0.2 + mouse.current.x * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} sizes={sizes}>
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

function NetworkLines({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Group>(null!);
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const radius = 6 + Math.random() * 4;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 6, Math.sin(angle) * radius));
    }
    return pts;
  }, []);

  const linePositions = useMemo(() => {
    const pairs: number[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 4 && Math.random() > 0.7) {
          pairs.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
        }
      }
    }
    return new Float32Array(pairs);
  }, [points.length]);

  const lineRef = useRef<THREE.BufferGeometry>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = mouse.current.y * 0.03;
      ref.current.rotation.y = mouse.current.x * 0.03 + state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={ref}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00b4d8" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
}

function SoftLights() {
  const lights = useMemo(() => [
    { position: [-8, 4, -5] as [number, number, number], color: "#00b4d8", intensity: 0.15 },
    { position: [8, -3, -5] as [number, number, number], color: "#3b82f6", intensity: 0.1 },
    { position: [0, 6, -8] as [number, number, number], color: "#8b5cf6", intensity: 0.08 },
  ], []);

  return (
    <>
      {lights.map((light, i) => (
        <pointLight key={i} position={light.position} color={light.color} intensity={light.intensity} distance={20} />
      ))}
    </>
  );
}

function GlowOrbs() {
  const orbs = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      position: [
        Math.cos(i * 1.57 + 0.5) * 7,
        Math.sin(i * 1.57 + 0.5) * 2 - 1,
        Math.sin(i * 1.57 + 0.5) * 5,
      ] as [number, number, number],
      color: ["#00b4d8", "#3b82f6", "#8b5cf6", "#10b981"][i],
      scale: 0.6 + Math.random() * 0.8,
      speed: 0.15 + Math.random() * 0.2,
    })), []
  );

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.3} floatIntensity={0.8}>
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[0.25, 24, 24]} />
            <meshBasicMaterial color={orb.color} transparent opacity={0.08} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <SoftLights />
      <ParticleField mouse={mouse} />
      <NetworkLines mouse={mouse} />
      <GlowOrbs />
    </>
  );
}

export function HeroBackground() {
  const mouse = useMousePosition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene mouse={mouse} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-[#08090c]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090c]/40 via-transparent to-[#08090c]/40 pointer-events-none" />
    </div>
  );
}

function Points({ ref, positions, colors, stride, sizes, children }: any) {
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, stride]}
          count={positions.length / stride}
          array={positions}
          itemSize={stride}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, stride]}
          count={colors.length / stride}
          array={colors}
          itemSize={stride}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      {children}
    </points>
  );
}

function PointMaterial(props: any) {
  return <pointsMaterial {...props} />;
}
