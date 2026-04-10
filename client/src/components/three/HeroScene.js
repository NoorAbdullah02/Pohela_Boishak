"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

function MangalPradip({ position, color }) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={ref} position={position} scale={0.55}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.4, 0.15, 12]} />
          <meshStandardMaterial
            color="#d4a843"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.06, 0.18, 0.35, 12]} />
          <meshStandardMaterial
            color="#b8860b"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <MeshDistortMaterial
            color={color}
            speed={4}
            distort={0.5}
            radius={1}
          />
        </mesh>
        <pointLight
          position={[0, 0.6, 0]}
          color="#ff8c00"
          intensity={3}
          distance={5}
        />
      </group>
    </Float>
  );
}

function Dhol({ position }) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    ref.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25}>
      <group ref={ref} position={position} rotation={[0, 0, Math.PI / 5]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.55, 12]} />
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.03, 16]} />
          <meshStandardMaterial
            color="#f5deb3"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.03, 16]} />
          <meshStandardMaterial
            color="#f5deb3"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Mask({ position }) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.35 + position[0]) * 0.35;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2}>
      <group ref={ref} position={position} scale={0.5}>
        <mesh>
          <sphereGeometry args={[0.4, 12, 12, 0, Math.PI]} />
          <meshStandardMaterial
            color="#e63946"
            side={THREE.DoubleSide}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-0.12, 0.1, 0.32]}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0.12, 0.1, 0.32]}>
          <sphereGeometry args={[0.065, 8, 8]} />
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

  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={0.6} floatIntensity={0.4}>
      <group
        ref={ref}
        position={position}
        scale={scale}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh>
          <torusGeometry args={[0.5, 0.04, 6, 32]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.35, 0.025, 6, 32]} />
          <meshStandardMaterial
            color="#ff6b35"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.2, 0.015, 6, 32]} />
          <meshStandardMaterial
            color="#e63946"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const count = 100;
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#fff5e6" />
      <pointLight position={[0, 3, 0]} intensity={1} color="#ff6b35" distance={10} />

      <Stars
        radius={80}
        depth={60}
        count={2500}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />
      <Sparkles
        count={80}
        scale={12}
        size={2.5}
        speed={0.4}
        color="#ffd700"
      />

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

export default function HeroScene() {
  return (
    <div className="relative w-full h-auto sm:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-32" id="hero">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1a] z-[5] pointer-events-none" />

      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.25]}
          style={{
            background: "linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)",
          }}
          onCreated={({ camera }) => {
            const handleResize = () => {
              if (window.innerWidth < 640) {
                camera.fov = 75;
                camera.position.z = 10;
              } else if (window.innerWidth < 1024) {
                camera.fov = 65;
                camera.position.z = 9;
              } else {
                camera.fov = 55;
                camera.position.z = 8;
              }
              camera.updateProjectionMatrix();
            };
            window.addEventListener("resize", handleResize);
            handleResize();
            return () => window.removeEventListener("resize", handleResize);
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative flex flex-col items-center justify-center z-10 pointer-events-none px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-sm md:text-base text-amber-300/60 tracking-[0.3em] uppercase mb-4"
          >
            আইসিই বিভাগ উপস্থাপন করছে
          </motion.p>

          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-gold mb-3 leading-tight">
            শুভ নববর্ষ
          </h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="hero-year text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-light text-amber-200/70 mb-4 sm:mb-6"
          >
            ১৪৩৩
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <p className="text-base md:text-lg text-gray-400">
              পহেলা বৈশাখ স্টল
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,107,53,0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-2xl"
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            🍽️ মেনু দেখুন
          </motion.button>


        </motion.div>

        {/* New Video Section - EXTRACTED FROM WRAPPER */}
        <div className="w-full flex justify-center items-center mt-12 sm:mt-24 mb-10 sm:mb-12 pointer-events-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto relative group"
          >
            {/* Background Glow acting like playing from top */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 rounded-[2rem] sm:rounded-[2.5rem] opacity-70 blur-2xl group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

            {/* Animated Border Container */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-[3px] sm:p-[4px] bg-[#0a0a1a]">

              {/* Rotating glowing border beam */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] aspect-square bg-[conic-gradient(from_0deg,transparent_0_280deg,#f59e0b_360deg)] z-0"
              />

              {/* Solid inner background to mask the rotating beam */}
              <div className="absolute inset-[3px] sm:inset-[4px] bg-[#0a0a1a] rounded-[13px] sm:rounded-[20px] z-0" />

              <video
                src="/pohela_boishak.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="relative z-10 w-full aspect-[4/3] sm:aspect-video object-cover rounded-[13px] sm:rounded-[20px] shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-amber-500/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-3 rounded-full bg-amber-500/50" />
        </motion.div>
      </motion.div>
    </div>
  );
}