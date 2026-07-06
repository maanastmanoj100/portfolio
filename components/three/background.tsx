"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const count = 2000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.3 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = Math.sin(t * 0.02) * 0.3;
      ref.current.rotation.y = Math.sin(t * 0.03) * 0.3;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        size={0.05}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GlowingOrbs() {
  const orbs = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      position: [Math.cos(i * 1.256) * 8, Math.sin(i * 1.256) * 4 - 2, Math.sin(i * 1.256) * 6] as [number, number, number],
      color: i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#3b82f6" : "#8b5cf6",
      scale: 0.8 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.3,
    })), []
  );

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <MeshDistortMaterial
              color={orb.color}
              transparent
              opacity={0.15}
              roughness={0}
              metalness={0.5}
              distort={0.3}
              speed={2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Grid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial
        color="#00f0ff"
        transparent
        opacity={0.03}
        wireframe
      />
    </mesh>
  );
}

export function SceneBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <GlowingOrbs />
        <Grid />
      </Canvas>
    </div>
  );
}
