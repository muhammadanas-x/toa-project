'use client'

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import FresnelSphere from "./FresnelSphere";
import Rings from "./Rings";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import M from "./M";
import Navbar from "./Navbar";

// LandingPage.jsx
// Cyberpunk Math Visualizer Landing Page with Glitch Effects

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchClick = () => {
    router.push('/chat');
  };

  return (
    <div style={styles.page}>
      {/* Background Elements */}
      <div className="cyber-grid"></div>
      <div className="scan-line"></div>
      <div className="data-overlay"></div>

      {/* Glitch Text Overlay */}
      <div className="glitch-container">
        <div className="glitch-text" data-text="MANIMATIONS">MANIMATIONS</div>
        <div className="glitch-text" data-text="MANIMATIONS">MANIMATIONS</div>
        <div className="glitch-text" data-text="MANIMATIONS">MANIMATIONS</div>
      </div>

      {/* Hero Content */}
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>
          MANIMATIONS
        </h1>
        
        <p style={styles.heroSubtitle}>
          VISUALIZE <span className="glitch-word">MATHEMATICS</span>
        </p>
        
        <div style={styles.mathEquation}>
          <span>lim<sub>n→∞</sub></span>
          <span style={styles.integral}>∫</span>
          <span>f(x)dx = ∞</span>
        </div>
        
        <p style={styles.heroDescription}>
          Interactive <span className="highlight">Manim Visualizer</span> for exploring 
          <span className="matrix-text"> [complex mathematical concepts]</span> through 
          immersive visualization.
        </p>
        
        <div style={styles.buttonContainer}>
          <button style={styles.heroButton} onClick={handleLaunchClick}>
            <span className="button-text">LAUNCH</span>
            <span className="button-glitch">LAUNCH</span>
            <div className="button-line"></div>
          </button>
          
       
        </div>
      </div>

      {/* Data Terminal */}
      <div style={styles.dataTerminal}>
        <div className="terminal-header">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
          <span>SYSTEM_READY</span>
        </div>
        <div className="terminal-content">
          <p> LOADING_MANIM_ENGINE...</p>
          <p> INITIALIZING_3D_VISUALIZER...</p>
          <p className="blink"> AWAITING_USER_INPUT_</p>
        </div>
      </div>

      {/* Canvas */}
      <div style={styles.canvasWrap}>
        <Canvas
          orthographic
          camera={{
            zoom: 350,
            position: [0, 1.5, 5],
          }}
        >
          <EffectComposer>
            <Bloom intensity={2.5}/>
          </EffectComposer>
          <group position={[1.5,0,0]}>
          <M/>
          <FresnelSphere/>
          <Rings/>
          </group>
         

          <OrbitControls
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
      </div>

      {/* Inline CSS */}
      <style>{`
        /* Base Styles */
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700&family=Source+Code+Pro:wght@300;400;600&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }
        
        /* Cyber Grid Background */
        .cyber-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 1;
          pointer-events: none;
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        /* Scan Line Effect */
        .scan-line {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #00ffff 20%, 
            #00ffff 80%, 
            transparent 100%);
          box-shadow: 0 0 10px #00ffff;
          z-index: 3;
          pointer-events: none;
          animation: scan 3s linear infinite;
        }
        
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        
        /* Data Overlay */
        .data-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(
              0deg,
              rgba(0, 20, 40, 0.15) 0px,
              rgba(0, 20, 40, 0.15) 1px,
              transparent 1px,
              transparent 2px
            );
          z-index: 2;
          pointer-events: none;
          opacity: 0.3;
        }
        
        /* Glitch Text Effect */
        .glitch-container {
          position: fixed;
          top: 10%;
          right: 5%;
          z-index: 3;
          pointer-events: none;
        }
        
        .glitch-text {
          position: absolute;
          font-family: 'Orbitron', monospace;
          font-size: 4rem;
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1px #00ffff;
          text-transform: uppercase;
          opacity: 0.1;
          animation: glitchFloat 6s ease-in-out infinite;
        }
        
        .glitch-text:nth-child(1) {
          animation-delay: 0s;
          transform: translate(2px, 2px);
        }
        
        .glitch-text:nth-child(2) {
          animation-delay: 2s;
          transform: translate(-2px, -2px);
          -webkit-text-stroke: 1px #ff00ff;
        }
        
        .glitch-text:nth-child(3) {
          animation-delay: 4s;
          transform: translate(1px, -1px);
          -webkit-text-stroke: 1px #ffff00;
        }
        
        @keyframes glitchFloat {
          0%, 100% { opacity: 0.05; transform: translate(0, 0); }
          25% { opacity: 0.1; transform: translate(2px, -2px); }
          50% { opacity: 0.07; transform: translate(-2px, 2px); }
          75% { opacity: 0.12; transform: translate(1px, 1px); }
        }
        
        /* Math Character Animation */
        .math-char {
          display: inline-block;
          animation: mathPulse 4s ease-in-out infinite;
          filter: drop-shadow(0 0 5px #00ffff);
        }
        
        @keyframes mathPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }
        
        /* Glitch Word Effect */
        .glitch-word {
          position: relative;
          display: inline-block;
          color: #00ffff;
        }
        
        .glitch-word::before,
        .glitch-word::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          overflow: hidden;
        }
        
        .glitch-word::before {
          left: 2px;
          text-shadow: -2px 0 #ff00ff;
          animation: glitch-1 2s infinite linear alternate-reverse;
        }
        
        .glitch-word::after {
          left: -2px;
          text-shadow: 2px 0 #00ff00;
          animation: glitch-2 3s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-1 {
          0% { clip: rect(20px, 9999px, 21px, 0); }
          5% { clip: rect(32px, 9999px, 40px, 0); }
          10% { clip: rect(54px, 9999px, 55px, 0); }
          15% { clip: rect(1px, 9999px, 35px, 0); }
          20% { clip: rect(86px, 9999px, 87px, 0); }
          25% { clip: rect(43px, 9999px, 44px, 0); }
          30% { clip: rect(65px, 9999px, 66px, 0); }
          35% { clip: rect(12px, 9999px, 13px, 0); }
          40% { clip: rect(77px, 9999px, 78px, 0); }
          45% { clip: rect(33px, 9999px, 34px, 0); }
          50% { clip: rect(90px, 9999px, 91px, 0); }
          55% { clip: rect(8px, 9999px, 9px, 0); }
          60% { clip: rect(60px, 9999px, 61px, 0); }
          65% { clip: rect(23px, 9999px, 24px, 0); }
          70% { clip: rect(85px, 9999px, 86px, 0); }
          75% { clip: rect(5px, 9999px, 6px, 0); }
          80% { clip: rect(48px, 9999px, 49px, 0); }
          85% { clip: rect(29px, 9999px, 30px, 0); }
          90% { clip: rect(71px, 9999px, 72px, 0); }
          95% { clip: rect(15px, 9999px, 16px, 0); }
          100% { clip: rect(99px, 9999px, 100px, 0); }
        }
        
        @keyframes glitch-2 {
          0% { clip: rect(85px, 9999px, 90px, 0); }
          5% { clip: rect(3px, 9999px, 6px, 0); }
          10% { clip: rect(66px, 9999px, 71px, 0); }
          15% { clip: rect(22px, 9999px, 27px, 0); }
          20% { clip: rect(44px, 9999px, 49px, 0); }
          25% { clip: rect(8px, 9999px, 13px, 0); }
          30% { clip: rect(77px, 9999px, 82px, 0); }
          35% { clip: rect(55px, 9999px, 60px, 0); }
          40% { clip: rect(11px, 9999px, 16px, 0); }
          45% { clip: rect(33px, 9999px, 38px, 0); }
          50% { clip: rect(99px, 9999px, 104px, 0); }
          55% { clip: rect(62px, 9999px, 67px, 0); }
          60% { clip: rect(19px, 9999px, 24px, 0); }
          65% { clip: rect(41px, 9999px, 46px, 0); }
          70% { clip: rect(5px, 9999px, 10px, 0); }
          75% { clip: rect(88px, 9999px, 93px, 0); }
          80% { clip: rect(26px, 9999px, 31px, 0); }
          85% { clip: rect(48px, 9999px, 53px, 0); }
          90% { clip: rect(14px, 9999px, 19px, 0); }
          95% { clip: rect(70px, 9999px, 75px, 0); }
          100% { clip: rect(37px, 9999px, 42px, 0); }
        }
        
        /* Matrix Text Effect */
        .matrix-text {
          display: inline-block;
          position: relative;
          color: #00ff00;
          font-family: 'Source Code Pro', monospace;
        }
        
        .matrix-text::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 255, 0, 0.1) 50%,
            transparent 100%
          );
          animation: matrixFlow 3s linear infinite;
        }
        
        @keyframes matrixFlow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        /* Button Glitch Effect */
        .button-text {
          position: relative;
          z-index: 1;
        }
        
        .button-glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          color: #ff00ff;
          clip-path: inset(0 0 0 0);
          animation: buttonGlitch 0.3s infinite;
          opacity: 0;
        }
        
        .button-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00ffff;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        button:hover .button-line {
          transform: scaleX(1);
        }
        
        @keyframes buttonGlitch {
          0% {
            clip-path: inset(20% 0 30% 0);
            opacity: 0.3;
            transform: translate(-1px, 1px);
          }
          20% {
            clip-path: inset(50% 0 20% 0);
            opacity: 0.5;
            transform: translate(1px, -1px);
          }
          40% {
            clip-path: inset(30% 0 60% 0);
            opacity: 0.3;
            transform: translate(-1px, 0);
          }
          60% {
            clip-path: inset(80% 0 10% 0);
            opacity: 0.5;
            transform: translate(1px, 1px);
          }
          80% {
            clip-path: inset(10% 0 70% 0);
            opacity: 0.3;
            transform: translate(0, -1px);
          }
          100% {
            clip-path: inset(40% 0 40% 0);
            opacity: 0.5;
            transform: translate(-1px, 1px);
          }
        }
        
        /* Terminal Styles */
        .terminal-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(0, 20, 40, 0.8);
          border-bottom: 1px solid #00ffff;
        }
        
        .terminal-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .terminal-dot.red { background: #ff5555; }
        .terminal-dot.yellow { background: #ffff55; }
        .terminal-dot.green { background: #55ff55; }
        
        .terminal-content {
          padding: 15px;
          font-family: 'Source Code Pro', monospace;
          font-size: 12px;
          line-height: 1.6;
          color: #00ff00;
        }
        
        .terminal-content p {
          margin: 5px 0;
          text-shadow: 0 0 5px #00ff00;
        }
        
        .blink {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Highlight Effect */
        .highlight {
          position: relative;
          color: #00ffff;
          z-index: 1;
        }
        
        .highlight::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00ffff;
          box-shadow: 0 0 10px #00ffff;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    background: "linear-gradient(180deg, #000814 0%, #001428 35%, #002244 70%, #003366 100%)",
    fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
    color: "#e6f7ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroContent: {
    position: "absolute",
    top: "50%",
    left: "10%",
    transform: "translateY(-50%)",
    zIndex: 10,
    textAlign: "left",
    maxWidth: "600px",
    padding: "30px",
    background: "rgba(0, 20, 40, 0.3)",
  
  },

  heroTitle: {
    margin: "0 0 20px 0",
    fontSize: "4.5rem",
    letterSpacing: "6px",
    color: "#00ffff",
    textShadow: `
      0 0 10px #00ffff,
      0 0 20px #00ffff,
      0 0 40px #00ffff,
      0 0 80px #00ffff
    `,
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: "900",
    textTransform: "uppercase",
    animation: "textGlow 2s ease-in-out infinite alternate",
  },

  heroSubtitle: {
    margin: "10px 0 20px 0",
    fontSize: "1.5rem",
    color: "#9fe1ff",
    letterSpacing: "3px",
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: "uppercase",
  },

  mathEquation: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "25px 0",
    padding: "15px",
    background: "rgba(0, 40, 80, 0.3)",
    border: "1px solid rgba(0, 255, 255, 0.3)",
    borderRadius: "5px",
    fontFamily: "'Source Code Pro', monospace",
    fontSize: "1.2rem",
    color: "#00ff00",
    textShadow: "0 0 5px #00ff00",
  },

  integral: {
    fontSize: "2rem",
    animation: "mathPulse 4s ease-in-out infinite",
  },

  heroDescription: {
    margin: "20px 0 30px 0",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    color: "#b3e0ff",
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: "300",
  },

  buttonContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "30px",
  },

  heroButton: {
    position: "relative",
    padding: "15px 35px",
    fontSize: "1rem",
    fontWeight: "bold",
    letterSpacing: "2px",
    cursor: "pointer",
    background: "linear-gradient(45deg, #003366, #0066cc)",
    color: "#00ffff",
    border: "2px solid #00ffff",
    borderRadius: "4px",
    textTransform: "uppercase",
    fontFamily: "'Orbitron', sans-serif",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
    boxShadow: `
      0 0 15px rgba(0, 255, 255, 0.5),
      0 0 30px rgba(0, 255, 255, 0.3),
      inset 0 0 20px rgba(0, 255, 255, 0.1)
    `,
  },

  secondaryButton: {
    padding: "15px 25px",
    fontSize: "1rem",
    letterSpacing: "1px",
    cursor: "pointer",
    background: "transparent",
    color: "#ff00ff",
    border: "1px solid #ff00ff",
    borderRadius: "4px",
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: "uppercase",
    transition: "all 0.3s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  buttonIcon: {
    fontSize: "1.2rem",
    animation: "spin 4s linear infinite",
  },

  dataTerminal: {
    position: "absolute",
    bottom: "40px",
    right: "40px",
    width: "300px",
    background: "rgba(0, 10, 20, 0.9)",
    border: "1px solid #00ff00",
    borderRadius: "5px",
    overflow: "hidden",
    zIndex: 10,
    fontFamily: "'Source Code Pro', monospace",
    boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)",
  },

  canvasWrap: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
  },
};