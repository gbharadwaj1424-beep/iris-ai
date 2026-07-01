"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { seededRandom } from "@/lib/utils";

/** Procedurally paints an equirectangular planet texture on a canvas — no external image assets required. */
function usePlanetTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const rand = seededRandom(42);

    // Ocean base
    const ocean = ctx.createLinearGradient(0, 0, 0, 512);
    ocean.addColorStop(0, "#0a3f63");
    ocean.addColorStop(0.5, "#0c5f86");
    ocean.addColorStop(1, "#0a3f63");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, 1024, 512);

    // Landmasses as soft blobs
    const landColors = ["#1f6b4a", "#2a8a5c", "#3aa86c", "#16523a"];
    for (let i = 0; i < 26; i++) {
      const cx = rand() * 1024;
      const cy = 80 + rand() * 350;
      const r = 40 + rand() * 90;
      ctx.fillStyle = landColors[Math.floor(rand() * landColors.length)];
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.4) {
        const rr = r * (0.7 + rand() * 0.6);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr * 0.6;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Polar ice caps
    const iceTop = ctx.createLinearGradient(0, 0, 0, 60);
    iceTop.addColorStop(0, "rgba(235,245,255,0.9)");
    iceTop.addColorStop(1, "rgba(235,245,255,0)");
    ctx.fillStyle = iceTop;
    ctx.fillRect(0, 0, 1024, 60);
    const iceBottom = ctx.createLinearGradient(0, 452, 0, 512);
    iceBottom.addColorStop(0, "rgba(235,245,255,0)");
    iceBottom.addColorStop(1, "rgba(235,245,255,0.9)");
    ctx.fillStyle = iceBottom;
    ctx.fillRect(0, 452, 1024, 60);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function useCloudTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const rand = seededRandom(7);
    ctx.clearRect(0, 0, 1024, 512);
    for (let i = 0; i < 70; i++) {
      const cx = rand() * 1024;
      const cy = rand() * 512;
      const r = 18 + rand() * 50;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, "rgba(255,255,255,0.55)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
}

function Planet() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const planetTexture = usePlanetTexture();
  const cloudTexture = useCloudTexture();

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.06;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.085;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          map={planetTexture ?? undefined}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.62, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture ?? undefined}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

      {/* Layered atmosphere halo (no custom shaders, additive backside spheres) */}
      {[1.66, 1.72, 1.82].map((r, i) => (
        <mesh key={r}>
          <sphereGeometry args={[r, 48, 48]} />
          <meshBasicMaterial
            color="#2EE6FF"
            transparent
            opacity={0.12 - i * 0.03}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
}) {
  const satRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += delta * speed;
    if (satRef.current) {
      satRef.current.position.set(
        Math.cos(angleRef.current) * radius,
        0,
        Math.sin(angleRef.current) * radius
      );
      satRef.current.rotation.y = -angleRef.current;
    }
  });

  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.004, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <group ref={satRef}>
        <mesh>
          <boxGeometry args={[0.045, 0.045, 0.045]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.07, 0.018, 0.005]} />
          <meshStandardMaterial color="#0FB8D4" />
        </mesh>
        <mesh position={[-0.06, 0, 0]}>
          <boxGeometry args={[0.07, 0.018, 0.005]} />
          <meshStandardMaterial color="#0FB8D4" />
        </mesh>
        <pointLight color={color} intensity={2} distance={1} />
      </group>
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = (state.pointer.y * 0.12);
    const targetY = (state.pointer.x * 0.18);
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03 + 0.0008;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.6} color="#eaf2ff" />
      <pointLight position={[-6, -2, -4]} intensity={0.4} color="#7C5CFF" />
      <Stars radius={60} depth={40} count={2400} factor={2.2} saturation={0} fade speed={0.4} />
      <group ref={groupRef}>
        <Planet />
        <OrbitRing radius={2.15} tilt={[0.3, 0, 0.1]} speed={0.32} color="#2EE6FF" />
        <OrbitRing radius={2.5} tilt={[-0.2, 0.4, 0]} speed={0.22} color="#34F5A8" />
        <OrbitRing radius={2.85} tilt={[0.5, -0.3, 0.2]} speed={0.16} color="#7C5CFF" />
      </group>
    </>
  );
}

export default function Earth3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.2], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
