// FresnelSphere.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define shader materials properly
const FresnelShaderMaterial = shaderMaterial(
  {
    colorA: new THREE.Color(0.04, 0.08, 0.25),
    colorB: new THREE.Color(0.2, 0.6, 1.0),
    power: 2.6,
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform float power;
    
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), power);
      vec3 color = mix(colorA, colorB, fresnel);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

const FresnelShaderMaterialCyan = shaderMaterial(
  {
    colorA: new THREE.Color(0.02, 0.15, 0.18),
    colorB: new THREE.Color(0.0, 1.0, 1.0),
    power: 3.0,
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform float power;
    
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), power);
      vec3 color = mix(colorA, colorB, fresnel);
      gl_FragColor = vec4(color, );
    }
  `
);

// Extend the materials so they can be used as JSX components
extend({ FresnelShaderMaterial, FresnelShaderMaterialCyan });

export default function FresnelSphere() {
  return (
      <Scene />
   
  );
}

function Scene() {
  const group = useRef();
  useFrame((_, delta) => (group.current.rotation.y += delta * 0.15));
  return (
    <group ref={group}>
      {/* <FresnelMesh /> */}
      {/* <FresnelMeshCyan /> */}
      <SurfacePoints count={1200} />
    </group>
  );
}

/* ------------------------------------------------- */
/* ---------------  BLUE FRESNEL  ------------------ */
/* ------------------------------------------------- */
function FresnelMesh() {
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <fresnelShaderMaterial />
    </mesh>
  );
}

/* ------------------------------------------------- */
/* ---------------  CYAN FRESNEL  ------------------ */
/* ------------------------------------------------- */
function FresnelMeshCyan() {
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} /> {/* Same radius as blue sphere */}
      <fresnelShaderMaterialCyan transparent/>
    </mesh>
  );
}

/* ------------------------------------------------- */
/* ---------------  SURFACE POINTS  ---------------- */

// Custom shader material for the points
const SparkPointMaterial = shaderMaterial(
  {
    time: 0,
    size: 0.012,
    baseOpacity: 0.8,
    glitterIntensity: 0.3,
    glitterFrequency: 8.0,
    lifeTime: 3.0,
    fadeInTime: 0.5,
    fadeOutTime: 0.5,
  },
  // Vertex Shader
  `
    uniform float time;
    uniform float size;
    uniform float lifeTime;
    uniform float fadeInTime;
    uniform float fadeOutTime;
    
    attribute float birthTime;
    attribute vec3 color;
    attribute vec3 customColor;
    
    varying float vLifeProgress;
    varying vec3 vColor;
    varying float vGlitter;
    varying float vGaussianSize;
    
    // Random function for variations
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // Gaussian function for size curve
    float gaussian(float x, float mean, float sigma) {
      return exp(-pow(x - mean, 2.0) / (2.0 * sigma * sigma));
    }
    
    void main() {
      // Calculate lifetime progress
      float age = mod(time - birthTime, lifeTime);
      vLifeProgress = age / lifeTime;
      
      // Calculate visibility with ease-out
      float visibility = 1.0;
      
      // Fade in at start
      if (age < fadeInTime) {
        float fadeInProgress = age / fadeInTime;
        visibility = fadeInProgress * fadeInProgress; // Ease-out quad
      }
      // Fade out at end
      else if (age > (lifeTime - fadeOutTime)) {
        float fadeOutProgress = (age - (lifeTime - fadeOutTime)) / fadeOutTime;
        float t = 1.0 - fadeOutProgress;
        visibility = t * t; // Ease-out quad
      }
      
      // Gaussian size curve - peaks in middle of lifetime
      float gaussianProgress = gaussian(vLifeProgress, 0.5, 0.25);
      vGaussianSize = gaussianProgress;
      
      // Glitter effect based on vertex position and time
      float vertexSeed = random(vec2(gl_Position.x, gl_Position.y));
      vGlitter = sin(time * 10.0 + vertexSeed * 6.2831) * 0.5 + 0.5;
      
      // Base color with some variation
      vColor = mix(color, customColor, 0.3);
      
      // Transform position (scaling happens in geometry update)
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Apply size with Gaussian curve
      float pointSize = size * (0.8 + vGaussianSize * 0.4) * visibility;
      gl_PointSize = pointSize * (300.0 / -mvPosition.z); // Size attenuation
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform float baseOpacity;
    uniform float glitterIntensity;
    uniform float glitterFrequency;
    
    varying float vLifeProgress;
    varying vec3 vColor;
    varying float vGlitter;
    varying float vGaussianSize;
    
    // Sharp circular point with anti-aliasing
    float circle(vec2 uv, float radius, float feather) {
      float dist = length(uv);
      return smoothstep(radius + feather, radius - feather, dist);
    }
    
    // Sparkle function
    float sparkle(vec2 uv, float frequency, float time) {
      vec2 grid = floor(uv * frequency);
      float randomValue = fract(sin(dot(grid, vec2(12.9898, 78.233))) * 43758.5453);
      float pulse = sin(time * 5.0 + randomValue * 6.2831) * 0.5 + 0.5;
      return pulse * pulse;
    }
    
    void main() {
      // Discard pixels outside circular point
      vec2 uv = gl_PointCoord * 2.0 - 1.0;
      
      // Sharp circular point with slight glow
      float circleAlpha = circle(uv, 0.7, 0.1);
      float innerGlow = circle(uv, 0.5, 0.2);
      
      if (circleAlpha <= 0.0) {
        discard;
      }
      
      // Cyan glitter effect
      float glitter = sparkle(gl_PointCoord, glitterFrequency, time);
      glitter *= vGlitter * glitterIntensity * vGaussianSize;
      
      // Base color with cyan tint
      vec3 baseColor = vColor;
      vec3 cyanTint = vec3(0.0, 1.0, 1.0);
      
      // Mix base color with cyan based on glitter
      vec3 finalColor = mix(baseColor, cyanTint, glitter * 0.8);
      
      // Brighten the center
      finalColor += innerGlow * 0.3 * cyanTint;
      
      // Alpha calculations
      float alpha = baseOpacity * circleAlpha;
      
      // Add glitter pulses to alpha
      alpha += glitter * 0.3;
      
      // Vary alpha slightly with Gaussian size
      alpha *= 0.8 + vGaussianSize * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

// Extend the custom material for use in JSX
extend({ SparkPointMaterial })

/* ------------------------------------------------- */
/* ---------------  SURFACE POINTS  ---------------- */
/* ------------------------------------------------- */
function SurfacePoints({ count = 800 }) {
  const radius = 1.01;
  
  const { positions, colors, customColors, birthTimes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const customCol = new Float32Array(count * 3);
    const births = new Float32Array(count);
    
    const now = performance.now() / 1000;

    for (let i = 0; i < count; i++) {
      // Uniform sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      // Store position
      pos.set([x, y, z], i * 3);

      // Base color based on height
      const t = (z + 1) / 2;
      const r = 0.05 * (1 - t) + 0.12 * t;
      const g = 0.15 * (1 - t) + 0.55 * t;
      const b = 0.25 * (1 - t) + 1.0 * t;
      
      col.set([
        Math.min(1, r + (Math.random() - 0.5) * 0.05),
        Math.min(1, g + (Math.random() - 0.5) * 0.05),
        Math.min(1, b + (Math.random() - 0.5) * 0.05),
      ], i * 3);
      
      // Custom color for cyan variations
      const cyanStrength = Math.random() * 0.7;
      customCol.set([
        0.0, // R - cyan has no red
        cyanStrength * 0.5 + 0.5, // G
        cyanStrength * 0.8 + 0.2, // B
      ], i * 3);
      
      // Stagger birth times for continuous animation
      births[i] = now - Math.random() * 3.0;
    }
    
    return { 
      positions: pos, 
      colors: col, 
      customColors: customCol,
      birthTimes: births 
    };
  }, [count]);

  const pointsRef = useRef();
  const geometryRef = useRef();
  const materialRef = useRef();
  const startTime = useRef(performance.now() / 1000);
  
  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime();
    
    // Update material time uniform
    if (materialRef.current) {
      materialRef.current.time = currentTime;
    }
    
    // Scale positions to radius
    if (pointsRef.current && geometryRef.current) {
      const scaleFactor = radius;
      const positionAttribute = geometryRef.current.attributes.position;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        
        const length = Math.sqrt(x * x + y * y + z * z);
        if (length > 0) {
          const normalizedX = x / length;
          const normalizedY = y / length;
          const normalizedZ = z / length;
          
          positionAttribute.setXYZ(
            i,
            normalizedX * scaleFactor,
            normalizedY * scaleFactor,
            normalizedZ * scaleFactor
          );
        }
      }
      positionAttribute.needsUpdate = true;
      
      // Add subtle rotation
      pointsRef.current.rotation.y = currentTime * 0.05;
      const scale = 1 + Math.sin(currentTime * 0.7) * 0.002;
      pointsRef.current.scale.setScalar(scale);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={customColors.length / 3}
          array={customColors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-birthTime"
          count={birthTimes.length}
          array={birthTimes}
          itemSize={1}
        />
      </bufferGeometry>
      {/* @ts-ignore - Custom extended material */}
      <sparkPointMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        size={0.07}
        baseOpacity={1.0}
        glitterIntensity={2.3}
        glitterFrequency={10.0}
        lifeTime={2.0}
        fadeInTime={1.0}
        fadeOutTime={1.5}
      />
    </points>
  );
}