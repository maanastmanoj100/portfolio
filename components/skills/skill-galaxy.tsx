"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/data/skills";

function SkillNode({ position, color, name, size }: { position: [number, number, number]; color: string; name: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = Math.sin(t * 0.5 + position[0]) * 0.1;
      ref.current.rotation.y = Math.cos(t * 0.5 + position[1]) * 0.1;
      const scale = 1 + Math.sin(t * 0.8 + position[0] + position[1]) * 0.05;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.2}>
        <mesh ref={ref}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshPhysicalMaterial
            color={color}
            transparent
            opacity={0.6}
            roughness={0.2}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, size + 0.3, 0]}
          fontSize={0.15}
          color="#e8edf5b3"
          anchorX="center"
          anchorY="middle"
          font="Geist"
        >
          {name}
        </Text>
      </Float>
    </group>
  );
}

function GalaxySystem() {
  const nodes = useMemo(() => {
    return skills.map((skill, i) => {
      const theta = (i / skills.length) * Math.PI * 6;
      const phi = Math.cos(i * 1.3) * 0.8;
      const radius = 2 + Math.sin(i * 0.7) * 1.5;
      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi) * 1.2;
      const z = radius * Math.sin(theta) * Math.cos(phi);
      const size = 0.08 + (skill.level / 100) * 0.12;
      return { position: [x, y, z] as [number, number, number], color: skill.color, name: skill.name, size };
    });
  }, []);

  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <SkillNode key={i} {...node} />
      ))}
    </group>
  );
}

export function SkillGalaxy() {
  return (
    <div className="h-[400px] sm:h-[500px] rounded-2xl overflow-hidden glass border border-border/50">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <GalaxySystem />
      </Canvas>
    </div>
  );
}
