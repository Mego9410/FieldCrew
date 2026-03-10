"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { uniforms, vertexShader, fragmentShader } = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#5b7cff") },
      uColor2: { value: new THREE.Color("#9d6cff") },
      uColor3: { value: new THREE.Color("#2de2e6") },
    };

    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float fbm(vec2 p) {
        float f = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          f += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return f;
      }

      void main() {
        vec2 uv = vUv - 0.5;
        uv *= 1.5;
        float t = uTime * 0.15;
        vec2 q = vec2(
          fbm(uv + t),
          fbm(uv + vec2(1.0) + t * 0.8)
        );
        vec2 r = vec2(
          fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
          fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.5)
        );
        float f = fbm(uv + 4.0 * r);

        vec3 col = mix(uColor1, uColor2, clamp((f + q.x) * 0.5, 0.0, 1.0));
        col = mix(col, uColor3, clamp(r.y, 0.0, 0.4));
        float alpha = 0.4 + 0.3 * f;
        gl_FragColor = vec4(col, alpha);
      }
    `;

    return { uniforms, vertexShader, fragmentShader };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} scale={[4, 4, 1]} position={[0, 0, -2]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#5b7cff" />
      <pointLight position={[-2, -1, 1]} intensity={0.6} color="#9d6cff" />
      <GradientMesh />
    </>
  );
}

export function HeroGradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden will-change-transform">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="absolute inset-0"
      >
        <Scene />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(10,10,10,0.85) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
