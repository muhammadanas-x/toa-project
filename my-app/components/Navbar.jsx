// Navbar.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME', icon: '⌂' },
    { id: 'visualizer', label: 'VISUALIZER', icon: '◉' },
    { id: 'tutorials', label: 'TUTORIALS', icon: '▶' },
    { id: 'gallery', label: 'GALLERY', icon: '▣' },
    { id: 'about', label: 'ABOUT', icon: 'ⓘ' },
  ];

  const socialLinks = [
    { icon: 'github', label: 'GitHub', href: '#' },
    { icon: 'discord', label: 'Discord', href: '#' },
    { icon: 'twitter', label: 'Twitter', href: '#' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Left Logo */}
        <div className="nav-logo">
          <motion.div 
            className="logo-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span className="math-symbol">∑</span>
          </motion.div>
          <div className="logo-text">
            <span className="logo-main">MANIMATIONS</span>
            <span className="logo-sub">MATH VISUALIZED</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveItem(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activeItem === item.id && (
                <motion.div 
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {/* Social Links */}
          <div className="social-links">
            {socialLinks.map((social) => (
              <motion.a
                key={social.icon}
                href={social.href}
                className="social-link"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                <span className={`icon-${social.icon}`} />
              </motion.a>
            ))}
          </div>

          {/* Auth Button */}
          <motion.button 
            className="auth-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="auth-text">LOGIN</span>
            <span className="auth-glitch">LOGIN</span>
            <div className="button-line"></div>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button 
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`hamburger ${isOpen ? 'open' : ''}`}>
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-content">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  className={`mobile-nav-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: item.id * 0.1 }}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                  <span className="mobile-nav-arrow">→</span>
                </motion.button>
              ))}
              
              {/* Mobile Social Links */}
              <div className="mobile-social">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.icon}
                    href={social.href}
                    className="mobile-social-link"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (socialLinks.indexOf(social) * 0.1) }}
                  >
                    <span className={`icon-${social.icon}`} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Styles */}
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          background: rgba(0, 20, 40, 0.2);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 255, 255, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(0, 10, 20, 0.8);
          padding: 15px 40px;
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          box-shadow: 0 5px 20px rgba(0, 255, 255, 0.1);
        }

        /* Logo Styles */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top: 2px solid #00ffff;
          animation: spin 4s linear infinite;
        }

        .math-symbol {
          font-size: 20px;
          color: #00ffff;
          font-weight: bold;
          position: relative;
          z-index: 1;
          text-shadow: 0 0 10px #00ffff;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-main {
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #00ffff;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .logo-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #9fe1ff;
          letter-spacing: 1px;
          opacity: 0.8;
        }

        /* Desktop Navigation */
        .nav-desktop {
          display: flex;
          gap: 2px;
          background: rgba(0, 30, 60, 0.2);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid rgba(0, 255, 255, 0.1);
        }

        @media (max-width: 1024px) {
          .nav-desktop {
            display: none;
          }
        }

        .nav-item {
          position: relative;
          padding: 12px 20px;
          background: transparent;
          border: none;
          color: #b3e0ff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          border-radius: 6px;
          min-width: 120px;
          justify-content: center;
        }

        .nav-item:hover {
          color: #00ffff;
          background: rgba(0, 255, 255, 0.05);
        }

        .nav-item.active {
          color: #00ffff;
        }

        .nav-icon {
          font-size: 14px;
          filter: drop-shadow(0 0 5px currentColor);
        }

        .nav-indicator {
          position: absolute;
          bottom: -2px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: #00ffff;
          border-radius: 2px;
          box-shadow: 0 0 10px #00ffff;
        }

        /* Right Section */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .social-links {
            display: none;
          }
        }

        .social-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9fe1ff;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .social-link:hover {
          color: #00ffff;
          border-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .social-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .social-link:hover::before {
          left: 100%;
        }

        .icon-github::before { content: '⎋'; font-size: 16px; }
        .icon-discord::before { content: '◈'; font-size: 16px; }
        .icon-twitter::before { content: '⏴'; font-size: 16px; }

        /* Auth Button */
        .auth-button {
          position: relative;
          padding: 10px 24px;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 2px;
          cursor: pointer;
          background: rgba(0, 255, 255, 0.1);
          color: #00ffff;
          border: 1px solid #00ffff;
          border-radius: 4px;
          text-transform: uppercase;
          font-family: 'Orbitron', sans-serif;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .auth-button:hover {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
        }

        .auth-text {
          position: relative;
          z-index: 1;
        }

        .auth-glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          color: #ff00ff;
          clip-path: inset(0 0 0 0);
          animation: buttonGlitch 2s infinite;
          opacity: 0;
        }

        /* Menu Toggle */
        .menu-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          z-index: 1001;
        }

        @media (max-width: 1024px) {
          .menu-toggle {
            display: block;
          }
        }

        .hamburger {
          width: 24px;
          height: 18px;
          position: relative;
          transition: all 0.3s ease;
        }

        .line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: #00ffff;
          border-radius: 2px;
          transition: all 0.3s ease;
          left: 0;
        }

        .line1 { top: 0; }
        .line2 { top: 50%; transform: translateY(-50%); }
        .line3 { bottom: 0; }

        .hamburger.open .line1 {
          transform: translateY(8px) rotate(45deg);
          top: 50%;
        }

        .hamburger.open .line2 {
          opacity: 0;
        }

        .hamburger.open .line3 {
          transform: translateY(-8px) rotate(-45deg);
          top: 50%;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: rgba(0, 10, 20, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          z-index: 999;
          overflow: hidden;
        }

        .mobile-menu-content {
          padding: 20px;
        }

        .mobile-nav-item {
          width: 100%;
          padding: 18px 20px;
          background: transparent;
          border: none;
          color: #b3e0ff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          letter-spacing: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 6px;
          margin-bottom: 5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          background: rgba(0, 255, 255, 0.1);
          color: #00ffff;
        }

        .mobile-nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: #00ffff;
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .mobile-nav-item:hover::before,
        .mobile-nav-item.active::before {
          transform: scaleY(1);
        }

        .mobile-nav-icon {
          font-size: 16px;
          margin-right: 15px;
          filter: drop-shadow(0 0 5px currentColor);
        }

        .mobile-nav-label {
          flex: 1;
          text-align: left;
        }

        .mobile-nav-arrow {
          color: #00ffff;
          opacity: 0.7;
        }

        .mobile-social {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 255, 255, 0.1);
        }

        .mobile-social-link {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9fe1ff;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .mobile-social-link:hover {
          color: #00ffff;
          border-color: #00ffff;
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
      `}</style>
    </>
  );
};

export default Navbar;