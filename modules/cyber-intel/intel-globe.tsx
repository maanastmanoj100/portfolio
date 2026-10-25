"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CATEGORIES, type GeoCluster, type IntelCategory } from "@/lib/cyber-intel/types";

/**
 * Country-level globe.
 *
 * Deliberate constraints:
 *  - One marker per country, never per article, and only for countries that a
 *    source reported in a structured field. There is no fallback placement.
 *  - No particles, no arcs, no auto-rotation, no pulsing. The scene renders on
 *    demand (`frameloop="demand"`) and only redraws when the camera moves or
 *    the marker set changes.
 *  - Country-level markers sit at a representative point for the country, so
 *    the UI labels them as "victim country", not as an event location.
 */

const RADIUS = 1.5;
const DEFAULT_CAMERA = new THREE.Vector3(0, 0.45, 4.2);
const MIN_RADIUS = 2.7;
const MAX_RADIUS = 6.5;

function latLngToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function dominantCategory(cluster: GeoCluster): IntelCategory {
  let best: IntelCategory = "general";
  let bestCount = -1;
  for (const [category, count] of Object.entries(cluster.categories) as [IntelCategory, number][]) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }
  return best;
}

function markerColor(cluster: GeoCluster): string {
  return CATEGORIES[dominantCategory(cluster)].color;
}

function buildGraticule(radius: number): Float32Array {
  const positions: number[] = [];
  const push = (lat: number, lon: number, nextLat: number, nextLon: number) => {
    const a = latLngToVector3(lat, lon, radius);
    const b = latLngToVector3(nextLat, nextLon, radius);
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  };

  for (let lat = -80; lat <= 80; lat += 20) {
    for (let lon = -180; lon < 180; lon += 6) push(lat, lon, lat, lon + 6);
  }
  for (let lon = -180; lon < 180; lon += 20) {
    for (let lat = -90; lat < 90; lat += 6) push(lat, lon, lat + 6, lon);
  }
  return new Float32Array(positions);
}

interface GlobeApi {
  rotate: (deltaLonDeg: number, deltaLatDeg: number) => void;
  zoom: (factor: number) => void;
  reset: () => void;
  focus: (lat: number, lon: number) => void;
}

function CameraRig({
  apiRef,
  controlsRef,
  focus,
}: {
  apiRef: RefObject<GlobeApi | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  focus: GeoCluster | null;
}) {
  const camera = useThree((state) => state.camera);
  const lastFocused = useRef<string | null>(null);

  const apply = useCallback(
    (mutate: (spherical: THREE.Spherical) => void) => {
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      mutate(spherical);
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.25, Math.PI - 0.25);
      spherical.radius = THREE.MathUtils.clamp(spherical.radius, MIN_RADIUS, MAX_RADIUS);
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
      controlsRef.current?.update();
    },
    [camera, controlsRef],
  );

  useEffect(() => {
    apiRef.current = {
      rotate: (deltaLonDeg, deltaLatDeg) =>
        apply((spherical) => {
          spherical.theta += THREE.MathUtils.degToRad(deltaLonDeg);
          spherical.phi -= THREE.MathUtils.degToRad(deltaLatDeg);
        }),
      zoom: (factor) =>
        apply((spherical) => {
          spherical.radius *= factor;
        }),
      reset: () => {
        camera.position.copy(DEFAULT_CAMERA);
        camera.lookAt(0, 0, 0);
        controlsRef.current?.update();
      },
      focus: (lat, lon) => {
        const radius = THREE.MathUtils.clamp(camera.position.length(), MIN_RADIUS, MAX_RADIUS);
        camera.position.copy(latLngToVector3(lat, lon, radius));
        camera.lookAt(0, 0, 0);
        controlsRef.current?.update();
      },
    };
  }, [apiRef, apply, camera, controlsRef]);

  useEffect(() => {
    if (!focus) {
      lastFocused.current = null;
      return;
    }
    // Only re-frame when the selected country changes, not on every refetch.
    if (lastFocused.current === focus.countryCode) return;
    lastFocused.current = focus.countryCode;
    apiRef.current?.focus(focus.lat, focus.lon);
  }, [focus, apiRef]);

  return null;
}

/** Re-renders the demand-driven canvas whenever the camera changes. */
function InvalidateOnControl({ controlsRef }: { controlsRef: RefObject<OrbitControlsImpl | null> }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onChange = () => invalidate();
    controls.addEventListener("change", onChange);
    return () => controls.removeEventListener("change", onChange);
  }, [controlsRef, invalidate]);

  return null;
}

function CountryMarker({
  cluster,
  selected,
  onSelect,
  onHover,
}: {
  cluster: GeoCluster;
  selected: boolean;
  onSelect: (code: string | null) => void;
  onHover: (cluster: GeoCluster | null) => void;
}) {
  const position = useMemo(
    () => latLngToVector3(cluster.lat, cluster.lon, RADIUS * 1.004),
    [cluster.lat, cluster.lon],
  );
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );

  const color = markerColor(cluster);
  const size = 0.016 + Math.min(0.028, Math.sqrt(cluster.count) * 0.008);

  return (
    <group position={position}>
      <mesh quaternion={quaternion}>
        <circleGeometry args={[size * 2.6, 24]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.28 : 0.12} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(selected ? null : cluster.countryCode);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(cluster);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[Math.max(size * 1.9, 0.05), 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {selected && (
        <mesh quaternion={quaternion} position={[0, 0, 0.002]}>
          <ringGeometry args={[size * 2.9, size * 3.6, 32]} />
          <meshBasicMaterial color="#e4e8f0" transparent opacity={0.8} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function GlobeScene({
  clusters,
  selectedCountry,
  onSelect,
  onHover,
  apiRef,
  controlsRef,
  focus,
}: {
  clusters: GeoCluster[];
  selectedCountry: string | null;
  onSelect: (code: string | null) => void;
  onHover: (cluster: GeoCluster | null) => void;
  apiRef: RefObject<GlobeApi | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  focus: GeoCluster | null;
}) {
  const graticule = useMemo(() => buildGraticule(RADIUS * 1.001), []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 48]} />
        <meshBasicMaterial color="#080d12" />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graticule, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#243a46" transparent opacity={0.55} depthWrite={false} />
      </lineSegments>

      <mesh scale={1.055}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial color="#00b4d8" transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {clusters.map((cluster) => (
        <CountryMarker
          key={cluster.countryCode}
          cluster={cluster}
          selected={selectedCountry === cluster.countryCode}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      <CameraRig apiRef={apiRef} controlsRef={controlsRef} focus={focus} />
      <InvalidateOnControl controlsRef={controlsRef} />
    </>
  );
}

function GlobeSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="relative h-32 w-32 sm:h-40 sm:w-40">
        <span className="absolute inset-0 rounded-full border border-[var(--color-border)]" />
        <span className="absolute inset-5 rounded-full border border-[var(--color-border)]" />
        <span className="absolute inset-10 rounded-full border border-[var(--color-border)]" />
      </div>
    </div>
  );
}

export interface GlobeListFallbackProps {
  clusters: GeoCluster[];
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
  reason: string;
}

/**
 * List-only equivalent of the globe. Used when WebGL is unavailable and as the
 * always-visible alternative for keyboard and screen-reader users.
 */
export function GlobeListFallback({
  clusters,
  selectedCountry,
  onSelectCountry,
  reason,
}: GlobeListFallbackProps) {
  return (
    <div className="flex h-full flex-col">
      <p className="border-b border-[var(--color-border)] px-4 py-3 text-xs text-[var(--color-foreground-secondary)]">
        {reason}
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {clusters.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-[var(--color-foreground-tertiary)]">
            No reports in the current filter carry a verified country.
          </p>
        ) : (
          <ul className="space-y-1">
            {clusters.map((cluster) => {
              const selected = cluster.countryCode === selectedCountry;
              return (
                <li key={cluster.countryCode}>
                  <button
                    type="button"
                    onClick={() => onSelectCountry(selected ? null : cluster.countryCode)}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs transition-colors ${
                      selected
                        ? "bg-white/[0.07] text-[var(--color-foreground)]"
                        : "text-[var(--color-foreground-secondary)] hover:bg-white/[0.04] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: markerColor(cluster) }}
                      />
                      <span className="truncate">{cluster.countryName}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-foreground-tertiary)]">
                      {cluster.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function detectWebgl(): boolean | null {
  if (typeof document === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export interface IntelGlobeProps {
  clusters: GeoCluster[];
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
}

export function IntelGlobe({ clusters, selectedCountry, onSelectCountry }: IntelGlobeProps) {
  // Client-only component (loaded with `ssr: false`), so support is resolved
  // once during the first render instead of via a state-setting effect.
  const [webgl] = useState<boolean | null>(detectWebgl);
  const [hovered, setHovered] = useState<GeoCluster | null>(null);
  const apiRef = useRef<GlobeApi | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const zoomIn = useCallback(() => {
    apiRef.current?.zoom(0.9);
  }, []);
  const zoomOut = useCallback(() => {
    apiRef.current?.zoom(1.1);
  }, []);
  const resetView = useCallback(() => {
    apiRef.current?.reset();
  }, []);

  const focus = useMemo(
    () => clusters.find((cluster) => cluster.countryCode === selectedCountry) ?? null,
    [clusters, selectedCountry],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const api = apiRef.current;
      if (!api) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          api.rotate(-10, 0);
          break;
        case "ArrowRight":
          event.preventDefault();
          api.rotate(10, 0);
          break;
        case "ArrowUp":
          event.preventDefault();
          api.rotate(0, 10);
          break;
        case "ArrowDown":
          event.preventDefault();
          api.rotate(0, -10);
          break;
        case "+":
        case "=":
          event.preventDefault();
          api.zoom(0.9);
          break;
        case "-":
        case "_":
          event.preventDefault();
          api.zoom(1.1);
          break;
        case "0":
        case "Home":
          event.preventDefault();
          api.reset();
          break;
        case "Escape":
          onSelectCountry(null);
          break;
        default:
          break;
      }
    },
    [onSelectCountry],
  );

  if (webgl === null) return <GlobeSkeleton />;

  if (!webgl) {
    return (
      <GlobeListFallback
        clusters={clusters}
        selectedCountry={selectedCountry}
        onSelectCountry={onSelectCountry}
        reason="3D rendering is unavailable in this browser (WebGL is disabled), so the map is shown as a country list."
      />
    );
  }

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Globe of reported cybersecurity incidents by victim country. Drag or use the arrow keys to rotate, plus and minus to zoom, and zero to reset the view."
      onKeyDown={handleKeyDown}
      className="relative h-full w-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [DEFAULT_CAMERA.x, DEFAULT_CAMERA.y, DEFAULT_CAMERA.z], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onPointerMissed={() => onSelectCountry(null)}
      >
        <GlobeScene
          clusters={clusters}
          selectedCountry={selectedCountry}
          onSelect={onSelectCountry}
          onHover={setHovered}
          apiRef={apiRef}
          controlsRef={controlsRef}
          focus={focus}
        />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping={false}
          rotateSpeed={0.45}
          zoomSpeed={0.6}
          minDistance={MIN_RADIUS}
          maxDistance={MAX_RADIUS}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/35 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-foreground-tertiary)] backdrop-blur-sm">
        Drag to rotate · scroll to zoom
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-black/40 text-sm text-[var(--color-foreground-secondary)] backdrop-blur-sm transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
        >
          <span aria-hidden="true">+</span>
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-black/40 text-sm text-[var(--color-foreground-secondary)] backdrop-blur-sm transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
        >
          <span aria-hidden="true">−</span>
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset view"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-black/40 text-sm text-[var(--color-foreground-secondary)] backdrop-blur-sm transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
        >
          <span aria-hidden="true">⟲</span>
        </button>
      </div>

      {(hovered || focus) && (
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-[70%] rounded-md border border-[var(--color-border)] bg-black/50 px-2.5 py-1.5 text-xs backdrop-blur-sm">
          <span className="text-[var(--color-foreground)]">{(hovered ?? focus)?.countryName}</span>
          <span className="ml-2 font-mono text-[11px] text-[var(--color-foreground-tertiary)]">
            {(hovered ?? focus)?.count} report{(hovered ?? focus)?.count === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {clusters.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <p className="max-w-xs rounded-lg border border-[var(--color-border)] bg-black/55 px-4 py-3 text-center text-xs leading-relaxed text-[var(--color-foreground-secondary)] backdrop-blur-sm">
            No reports in this filter have a verified country. Advisories and research are unlocated by nature
            and stay in the feed below.
          </p>
        </div>
      )}
    </div>
  );
}
