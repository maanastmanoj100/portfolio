"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);

  const globePoints = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];
    const r = 1.5;
    for (let i = 0; i < 800; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      points.push(x, y, z);
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.5 + Math.random() * 0.3);
      colors.push(c.r, c.g, c.b);
    }
    return { positions: new Float32Array(points), colors: new Float32Array(colors) };
  }, []);

  const linesPositions = useMemo(() => {
    const pos: number[] = [];
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = 0; lng <= 360; lng += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lng * (Math.PI / 180);
        const r = 1.52;
        pos.push(r * Math.sin(phi) * Math.cos(theta));
        pos.push(r * Math.cos(phi));
        pos.push(r * Math.sin(phi) * Math.sin(theta));
      }
    }
    for (let lng = 0; lng < 360; lng += 20) {
      for (let lat = -80; lat <= 80; lat += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lng * (Math.PI / 180);
        const r = 1.52;
        pos.push(r * Math.sin(phi) * Math.cos(theta));
        pos.push(r * Math.cos(phi));
        pos.push(r * Math.sin(phi) * Math.sin(theta));
      }
    }
    return new Float32Array(pos);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshBasicMaterial color="#0a1628" transparent opacity={0.8} wireframe={false} />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={globePoints.positions.length / 3}
            array={globePoints.positions}
            itemSize={3}
            args={[globePoints.positions, 3] as any}
          />
          <bufferAttribute
            attach="attributes-color"
            count={globePoints.colors.length / 3}
            array={globePoints.colors}
            itemSize={3}
            args={[globePoints.colors, 3] as any}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linesPositions.length / 3}
            array={linesPositions}
            itemSize={3}
            args={[linesPositions, 3] as any}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
}

export function AttackGlobe() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <GlobeMesh />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
