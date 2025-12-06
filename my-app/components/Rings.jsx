import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// --- Shader Material ---
const TubeShaderMaterial = shaderMaterial(
  { uTime: 0, uSpeed: 1, uOffset: 0 },
  /* vertex shader */
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment shader */
  `
    uniform float uTime;
    uniform float uSpeed;
    uniform float uOffset;
    varying vec2 vUv;

    void main() {
      float c = fract(vUv.x - uTime * uSpeed + uOffset);
      c = smoothstep(0.7, 1.0, c);
      c = pow(c, 2.0);

      float d = abs(fract(vUv.x * 200.0) - 0.5) * 2.0;
      c *= d;
      
      gl_FragColor = vec4((c) * vec3(0.,0.9,1.0) * 30.0, c);
    }
  `
);

extend({ TubeShaderMaterial });

// --- Component ---
const Rings = () => {
  const count = 13;
  
  // Create separate refs for each ring
  const materialRefs = Array.from({ length: count }, () => useRef());
  const meshRefs = Array.from({ length: count }, () => useRef());

  // Animate each shader individually with different speeds
  useFrame((state) => {
    materialRefs.forEach((ref, i) => {
      if (ref.current) {
        // Different speeds for each ring
        const speed = 0.3 + (i % 3) * 0.1;
        ref.current.uTime = state.clock.elapsedTime * speed;
      }
    });
  });

  const orbits = useMemo(() => {
  const curves = [];

  // Create unique random seeds for each ring
  const seeds = Array.from({ length: count }, (_, i) => i * 0.6180339887); // Golden ratio for distribution

  for (let i = 0; i < count; i++) {
    const points = [];

    // Base radius
    const radiusBase = 1.1 + (i / count) * 0.3; // Between 1.1 and 1.4 roughly
    const radiusVariation = Math.abs(Math.sin(seeds[i] * 6) * 0.15); // smaller variation to stay within 1.1-1.4

    // Clamp to [1.1, 1.4]
    const radiusX = THREE.MathUtils.clamp(radiusBase + radiusVariation, 1.1, 1.2);
    const radiusY = THREE.MathUtils.clamp(
      radiusBase * (0.5 + Math.abs(Math.cos(seeds[i] * 3) * 0.5)),
      1.1,
      1.2
    );

    // Create more complex, uneven orbits by adding perturbations
    const perturbationScale = 0.15 + (i % 5) * 0.05;

    for (let j = 0; j <= 150; j++) {
      const t = (j / 150) * Math.PI * 2;
      const perturbation = Math.sin(t * 3 + seeds[i]) * perturbationScale;

      const x = Math.cos(t) * radiusX * (1 + perturbation * 0.1);
      const y = Math.sin(t) * radiusY * (1 + perturbation * 0.1);
      const z = perturbation * 0.1; // vertical perturbation

      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);

    // Apply uneven, varied tilts to each ring
    const tiltX = (seeds[i] * 2.3) % (Math.PI * 0.6); // X-axis tilt
    const tiltY = (seeds[i] * 3.1) % (Math.PI * 0.8); // Y-axis tilt  
    const tiltZ = (seeds[i] * 1.7) % (Math.PI * 0.4); // Z-axis rotation

    const wobbleX = Math.sin(seeds[i] * 7) * 0.3;
    const wobbleY = Math.cos(seeds[i] * 5) * 0.2;

    curve.points.forEach((p, idx) => {
      p.applyAxisAngle(new THREE.Vector3(1, 0, 0), tiltX + wobbleX);
      p.applyAxisAngle(new THREE.Vector3(0, 1, 0), tiltY + wobbleY);
      p.applyAxisAngle(new THREE.Vector3(0, 0, 1), tiltZ);

      const progress = idx / points.length;
      const dynamicTilt = Math.sin(progress * Math.PI * 2 + seeds[i]) * 0.15;
      p.applyAxisAngle(new THREE.Vector3(0, 1, 0), dynamicTilt);

      p.z += (i - count/2) * 0.08 + Math.sin(seeds[i]) * 0.1;
    });

    curves.push(curve);
  }

  return curves;
}, [count]);

  return (
    <>
      {orbits.map((curve, i) => (
        <mesh 
          key={i} 
          ref={meshRefs[i]}
        >
          <tubeGeometry args={[curve, 150, 0.01 + (i % 3) * 0.005, 8, true]} />
          <tubeShaderMaterial
            transparent 
            depthWrite={false}
            ref={materialRefs[i]}
            uSpeed={0.45 + (i % 4) * 0.08}
            uOffset={i * 0.1}
            doubleSide={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
};

export default Rings;