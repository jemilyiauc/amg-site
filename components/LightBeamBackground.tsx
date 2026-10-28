"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Animated light beam — Three.js shader (ref: public/"To recreate the animated light beam.txt").
// Shader and uniforms are unchanged from the original main.ts.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;

  // Value noise (replaces the broken Perlin stub in the reference)
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv  = vUv;
    vec2 muv = uv * 2.0 - 1.0;   // origin at center

    // 1. Vertical beam — both ends widen as user scrolls
    float topWidth    = mix(0.04, 0.70, uScroll);
    float bottomWidth = mix(0.20, 1.20, uScroll);
    float beamWidth   = mix(topWidth, bottomWidth, pow(1.0 - uv.y, 2.0));
    float yBeam = 1.0 - smoothstep(0.001, beamWidth, abs(muv.x));
    yBeam *= noise(uv * 1.5 + vec2(0.0, uTime * 0.18)) * 1.0;
    vec3 yBeamCol = mix(
      vec3(0.88, 0.94, 1.00),
      vec3(0.15, 0.32, 0.82),
      smoothstep(0.0, 1.0, abs(muv.x) / max(beamWidth, 0.001))
    );

    // 2. Horizontal radial spread at origin
    float spread = smoothstep(0.35, 0.0,
      length(vec2(muv.x * 0.65, uv.y * 0.75 + noise(uv * 0.4 + vec2(uTime * 0.08, 0.0)) * 0.08))
    );
    spread *= (noise(uv * 1.2 + vec2(uTime * 0.12, 0.0)) + 0.3) * 0.7;
    vec3 spreadCol = mix(vec3(0.48, 0.64, 1.00), vec3(0.06, 0.14, 0.48), uv.y);

    // Combine
    vec3 bgCol  = vec3(0.063, 0.075, 0.118);
    float mask  = clamp(yBeam + spread, 0.0, 1.0);
    vec3  beams = yBeam * yBeamCol + spread * spreadCol;
    vec3  final = mix(bgCol, beams, mask);

    gl_FragColor = vec4(final, 1.0);
  }
`;

export const LightBeamBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = { uTime: { value: 0.0 }, uScroll: { value: 0.0 } };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    scene.add(new THREE.Mesh(geometry, material));

    const onResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      uniforms.uScroll.value = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let frame = 0;
    const animate = (t: number) => {
      uniforms.uTime.value = t * 0.001;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="vanta-bg"
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}
    />
  );
};
