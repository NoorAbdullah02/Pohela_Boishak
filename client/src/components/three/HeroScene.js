"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import { useRef, Suspense, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ─────────────── 3-D Objects ─────────────── */

function MangalPradip({ position, color }) {
  const ref = useRef();
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.4;
    ref.current.position.y =
      position[1] + Math.sin(s.clock.elapsedTime * 0.6 + position[0]) * 0.25;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ref} position={position} scale={0.55}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.4, 0.15, 8]} />
          <meshStandardMaterial color="#d4a843" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.18, 0.35, 8]} />
          <meshStandardMaterial color="#b8860b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0.6, 0]} color="#ff8c00" intensity={1.5} distance={3} />
      </group>
    </Float>
  );
}

function Dhol({ position }) {
  const ref = useRef();
  useFrame((s) => {
    ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.3) * 0.12;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.5) * 0.06;
  });
  return (
    <Float speed={1} rotationIntensity={0.15}>
      <group ref={ref} position={position} rotation={[0, 0, Math.PI / 5]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.55, 10]} />
          <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.03, 12]} />
          <meshStandardMaterial color="#f5deb3" metalness={0.1} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.03, 12]} />
          <meshStandardMaterial color="#f5deb3" metalness={0.1} roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function Mask({ position }) {
  const ref = useRef();
  useFrame((s) => {
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.35 + position[0]) * 0.35;
  });
  return (
    <Float speed={1} rotationIntensity={0.15}>
      <group ref={ref} position={position} scale={0.5}>
        <mesh>
          <sphereGeometry args={[0.4, 10, 10, 0, Math.PI]} />
          <meshStandardMaterial color="#e63946" side={THREE.DoubleSide} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[-0.12, 0.1, 0.32]}>
          <sphereGeometry args={[0.065, 6, 6]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0.12, 0.1, 0.32]}>
          <sphereGeometry args={[0.065, 6, 6]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0, -0.08, 0.35]}>
          <boxGeometry args={[0.15, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>
    </Float>
  );
}

function AlponaRing({ position, scale = 1 }) {
  const ref = useRef();
  useFrame((s) => { ref.current.rotation.z = s.clock.elapsedTime * 0.1; });
  return (
    <Float speed={0.5} floatIntensity={0.3}>
      <group ref={ref} position={position} scale={scale} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.04, 4, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.35, 0.025, 4, 16]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 300; i++) pos[i] = (Math.random() - 0.5) * 25;
    return pos;
  }, []);
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.02;
    ref.current.rotation.x = s.clock.elapsedTime * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={100} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffd700" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#fff5e6" />
      <pointLight position={[0, 3, 0]} intensity={1.2} color="#ff6b35" distance={10} />

      <Stars radius={80} depth={60} count={300} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles count={30} scale={12} size={2.5} speed={0.3} color="#ffd700" />

      <MangalPradip position={[-3.5, 1.2, -1]} color="#ff6b35" />
      <MangalPradip position={[3.2, -0.8, -2.5]} color="#e63946" />
      <MangalPradip position={[0.5, 2.5, -3]} color="#ffd700" />

      <Dhol position={[2.5, 1.8, -1.5]} />
      <Dhol position={[-2.8, -1.2, -2]} />

      <Mask position={[-1.2, -1.8, 0.5]} />
      <Mask position={[3, 0.3, -0.5]} />

      <AlponaRing position={[0, 0, -3]} scale={1.3} />
      <AlponaRing position={[-3.5, -2.2, -4]} scale={0.7} />
      <AlponaRing position={[3.5, 2.5, -5]} scale={0.9} />

      <FloatingParticles />
      <fog attach="fog" args={["#0a0a1a", 6, 28]} />
    </>
  );
}

/* ─────────────── Decorative SVG Petals ─────────────── */
function FloralDivider() {
  return (
    <div className="hero-floral-divider" aria-hidden="true">
      <svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <line x1="0" y1="20" x2="145" y2="20" stroke="url(#lineGrad)" strokeWidth="1" />
        <g transform="translate(200,20)">
          <circle cx="-40" cy="0" r="3" fill="#ff6b35" opacity="0.6" />
          <circle cx="-20" cy="0" r="2" fill="#ffd700" opacity="0.5" />
          <circle cx="0" cy="0" r="5" fill="url(#petalCentre)" />
          <circle cx="20" cy="0" r="2" fill="#ffd700" opacity="0.5" />
          <circle cx="40" cy="0" r="3" fill="#ff6b35" opacity="0.6" />
        </g>
        <line x1="255" y1="20" x2="400" y2="20" stroke="url(#lineGrad2)" strokeWidth="1" />
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <radialGradient id="petalCentre">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ff6b35" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─────────────── Stat Badges ─────────────── */
const stats = [
  { value: "৫০+", label: "আইটেম" },
  { value: "১০০%", label: "তাজা" },
  { value: "১ দিন", label: "উৎসব" },
];

/* ─────────────── Main HeroScene ─────────────── */
export default function HeroScene() {
  const [videoReady, setVideoReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  /* scroll helper */
  const scrollToMenu = () =>
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="hero-section"
      aria-label="পহেলা বৈশাখ স্টল হিরো সেকশন"
    >
      {/* ── 3-D Background Canvas ── */}
      <div className="hero-canvas-wrap" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          gl={{ antialias: false, alpha: true, powerPreference: "default" }}
          dpr={[1, 1.2]}
          performance={{ min: 0.5 }}
          style={{ background: "linear-gradient(180deg,#0a0a1a 0%,#1a1a2e 50%,#0a0a1a 100%)" }}
          onCreated={({ camera }) => {
            const adjust = () => {
              const w = window.innerWidth;
              if (w < 480) { camera.fov = 80; camera.position.z = 11; }
              else if (w < 768) { camera.fov = 72; camera.position.z = 10; }
              else if (w < 1024) { camera.fov = 65; camera.position.z = 9; }
              else { camera.fov = 55; camera.position.z = 8; }
              camera.updateProjectionMatrix();
            };
            window.addEventListener("resize", adjust);
            adjust();
            return () => window.removeEventListener("resize", adjust);
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Gradient overlays ── */}
      <div className="hero-overlay-top" aria-hidden="true" />
      <div className="hero-overlay-bottom" aria-hidden="true" />
      <div className="hero-overlay-sides" aria-hidden="true" />

      {/* ── Main content wrapper ── */}
      <div className="hero-content">

        {/* ── Text block ── */}
        <motion.div
          className="hero-text-block"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
        >
          {/* Department tag */}
          <motion.p
            className="hero-dept-tag"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.7, duration: 0.9 }}
          >
            আইসিই বিভাগ উপস্থাপন করছে
          </motion.p>

          {/* Main title */}
          <h1 className="hero-main-title">
            <span className="hero-title-bn text-gradient-gold">শুভ নববর্ষ</span>
          </h1>

          {/* Bengali year */}
          <motion.div
            className="hero-year-wrap"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <span className="hero-year">১৪৩৩</span>
          </motion.div>

          {/* Floral divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.7 }}
          >
            <FloralDivider />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            পহেলা বৈশাখ স্টল
          </motion.p>

          {/* Stat pills */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.7 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="hero-stat-pill"
                whileHover={{ scale: 1.07, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="hero-cta-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.7 }}
          >
            <motion.button
              id="hero-menu-cta"
              className="btn-primary hero-cta-primary"
              onClick={scrollToMenu}
              whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(255,107,53,0.55)" }}
              whileTap={{ scale: 0.95 }}
            >
              🍽️ মেনু দেখুন
            </motion.button>

            <motion.button
              id="hero-scroll-cta"
              className="hero-cta-ghost"
              onClick={scrollToMenu}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              আরও জানুন ↓
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Video card ── */}
        <motion.div
          className="hero-video-wrap"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.9 }}
        >
          {/* glow halo */}
          <div className="hero-video-glow" aria-hidden="true" />

          {/* spinning border */}
          <div className="hero-video-card">
            <motion.div
              className="hero-video-border-spin"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              aria-hidden="true"
            />
            <div className="hero-video-inner-mask" aria-hidden="true" />

            {/* Loading shimmer */}
            <AnimatePresence>
              {!videoReady && (
                <motion.div
                  className="hero-video-skeleton"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  aria-hidden="true"
                >
                  <div className="hero-video-skeleton-shimmer" />
                </motion.div>
              )}
            </AnimatePresence>

            <video
              src="/pohela_boishak.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
              onError={(e) => {
                console.error("Video load error:", e);
                setVideoReady(true);
              }}
              className="hero-video"
              aria-label="পহেলা বৈশাখ উৎসবের ভিডিও"
            />
          </div>

          {/* video label badge */}
          <motion.div
            className="hero-video-badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            <span className="hero-video-badge-dot" />
            Dept. of ICE
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        onClick={scrollToMenu}
        role="button"
        aria-label="নিচে স্ক্রোল করুন"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToMenu()}
      >
        <motion.div
          className="hero-scroll-mouse"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <div className="hero-scroll-wheel" />
        </motion.div>
        <p className="hero-scroll-label">স্ক্রোল করুন</p>
      </motion.div>

      {/* ── Bottom fade ── */}
      <div className="hero-bottom-fade" aria-hidden="true" />
    </section>
  );
}