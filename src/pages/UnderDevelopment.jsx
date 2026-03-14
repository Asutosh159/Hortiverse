import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════════════════════════════════════
   HORTIVERSE: FULL-SCREEN TRACTOR RUN ENGINE
   Features: 60FPS JS Engine, Infinite Parallax, Edge-to-Edge Gameplay,
   Day/Night Cycle, Particle Physics, and Dynamic Collision.
══════════════════════════════════════════════════════════════════════════ */

// --- PHYSICS & GAME TUNING ---
const GRAVITY = 0.65;
const JUMP_VELOCITY = 15;
const INITIAL_SPEED = 7;
const SPEED_MULTIPLIER = 0.0015; // Smooth speed scaling
const TRACTOR_X_POS = 100; // Fixed horizontal position of the tractor
const HITBOX_TOLERANCE = 12; // Forgiving collision boundaries
const GROUND_HEIGHT = 40; // Height of the moving grass

const OBSTACLE_TYPES = [
  { emoji: '⛰️', width: 60, height: 60, yOffset: -5 },
  { emoji: '🪨', width: 45, height: 45, yOffset: -5 },
  { emoji: '🚧', width: 50, height: 50, yOffset: -10 },
  { emoji: '🪵', width: 50, height: 40, yOffset: -5 }
];

export default function UnderDevelopment() {
  const navigate = useNavigate();

  // --- REACT STATE ---
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('hortiverse_highscore')) || 0
  );
  const [dayPhase, setDayPhase] = useState('day'); // 'day', 'sunset', 'night'

  // --- MUTABLE GAME ENGINE REFS (Avoids React re-render lag for 60fps) ---
  const requestRef = useRef(null);
  const engine = useRef({
    speed: INITIAL_SPEED,
    scoreTracker: 0,
    tractor: { y: 0, vy: 0, isJumping: false },
    obstacles: [],
    particles: [],
    parallax: { ground: 0, hills: 0, clouds: 0 },
    lastObstacleSpawn: 0
  });

  // --- DOM REFS FOR DIRECT MANIPULATION ---
  const tractorRef = useRef(null);
  const obstaclesContainerRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const groundRef = useRef(null);
  const hillsRef = useRef(null);
  const cloudsRef = useRef(null);

  // ══════════════════════════════════════════════════════════════════════════
  // CORE GAME LOOP (Runs ~60 times per second)
  // ══════════════════════════════════════════════════════════════════════════
  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;
    const state = engine.current;
    const screenWidth = window.innerWidth;

    // 1. DYNAMIC SPEED & SCORE INCREMENT
    state.speed += SPEED_MULTIPLIER;
    state.scoreTracker += (state.speed * 0.05);
    const currentDisplayScore = Math.floor(state.scoreTracker);
    setScore(currentDisplayScore);

    // 2. DAY / NIGHT CYCLE (Based on score progression)
    if (currentDisplayScore > 1800 && dayPhase !== 'night') setDayPhase('night');
    else if (currentDisplayScore > 800 && currentDisplayScore <= 1800 && dayPhase !== 'sunset') setDayPhase('sunset');

    // 3. TRACTOR PHYSICS (Gravity)
    if (state.tractor.isJumping) {
      state.tractor.vy -= GRAVITY;
      state.tractor.y += state.tractor.vy;

      // Hit the ground
      if (state.tractor.y <= 0) {
        state.tractor.y = 0;
        state.tractor.vy = 0;
        state.tractor.isJumping = false;
      }
    }

    // Apply tractor position (scaleX(-1) keeps it facing forward!)
    if (tractorRef.current) {
      tractorRef.current.style.transform = `scaleX(-1) translateY(-${state.tractor.y}px)`;
    }

    // 4. DUST PARTICLE PHYSICS (Spawns at the back tire)
    if (!state.tractor.isJumping && Math.random() > 0.4) {
      state.particles.push({
        id: Date.now() + Math.random(),
        x: TRACTOR_X_POS - 10,
        y: GROUND_HEIGHT + Math.random() * 10,
        size: Math.random() * 12 + 6,
        opacity: 0.7,
        vx: -(Math.random() * 3 + state.speed * 0.6), // Blow left (backward)
        vy: Math.random() * 2 + 1
      });
    }

    // Update existing particles
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= 0.02;
      p.size += 0.3;
    });
    state.particles = state.particles.filter(p => p.opacity > 0);

    // 5. OBSTACLE MANAGEMENT (Dynamic Spawning off-screen)
    state.lastObstacleSpawn += state.speed;
    
    // Gap scales with speed so it's always jumpable
    const minGap = 500 + (state.speed * 20); 
    if (state.lastObstacleSpawn > minGap && Math.random() > 0.96) {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      state.obstacles.push({
        id: Date.now(),
        x: screenWidth + 100, // Spawn securely off the right side of the screen
        ...type
      });
      state.lastObstacleSpawn = 0;
    }

    // Move & Cleanup Obstacles
    state.obstacles.forEach(obs => {
      obs.x -= state.speed;
    });
    state.obstacles = state.obstacles.filter(obs => obs.x > -150);

    // 6. COLLISION DETECTION (Precise AABB Hitboxes)
    const tBox = {
      left: TRACTOR_X_POS + HITBOX_TOLERANCE,
      right: TRACTOR_X_POS + 80 - HITBOX_TOLERANCE, // Tractor width approx 80px
      bottom: state.tractor.y + GROUND_HEIGHT,
      top: state.tractor.y + GROUND_HEIGHT + 80 - HITBOX_TOLERANCE
    };

    for (let obs of state.obstacles) {
      const oBox = {
        left: obs.x + HITBOX_TOLERANCE + 5,
        right: obs.x + obs.width - HITBOX_TOLERANCE,
        bottom: GROUND_HEIGHT + obs.yOffset,
        top: GROUND_HEIGHT + obs.yOffset + obs.height - HITBOX_TOLERANCE
      };

      if (
        tBox.right > oBox.left &&
        tBox.left < oBox.right &&
        tBox.bottom < oBox.top
      ) {
        handleGameOver();
        return; 
      }
    }

    // 7. INFINITE PARALLAX SCROLLING
    state.parallax.ground += state.speed;
    state.parallax.hills += state.speed * 0.4;
    state.parallax.clouds += state.speed * 0.15;

    // 8. DIRECT DOM RENDERING
    renderDOM(state);

    // Loop
    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, dayPhase]);


  // --- BATCH DOM RENDERER ---
  const renderDOM = (state) => {
    if (groundRef.current) groundRef.current.style.backgroundPositionX = `-${state.parallax.ground}px`;
    if (hillsRef.current) hillsRef.current.style.backgroundPositionX = `-${state.parallax.hills}px`;
    if (cloudsRef.current) cloudsRef.current.style.backgroundPositionX = `-${state.parallax.clouds}px`;

    if (obstaclesContainerRef.current) {
      obstaclesContainerRef.current.innerHTML = state.obstacles.map(obs => 
        `<div style="
          position: absolute; 
          left: ${obs.x}px; 
          bottom: ${GROUND_HEIGHT + obs.yOffset}px; 
          font-size: ${obs.width}px;
          line-height: 1;
          filter: drop-shadow(-5px 10px 5px rgba(0,0,0,0.3));
        ">${obs.emoji}</div>`
      ).join('');
    }

    if (particlesContainerRef.current) {
      particlesContainerRef.current.innerHTML = state.particles.map(p => 
        `<div style="
          position: absolute;
          left: ${p.x}px;
          bottom: ${p.y}px;
          width: ${p.size}px;
          height: ${p.size}px;
          background: rgba(220, 226, 220, ${p.opacity});
          border-radius: 50%;
          filter: blur(3px);
        "></div>`
      ).join('');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GAME CONTROLS & LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════
  const jump = () => {
    if (gameState === 'playing' && !engine.current.tractor.isJumping) {
      engine.current.tractor.isJumping = true;
      engine.current.tractor.vy = JUMP_VELOCITY;
    }
  };

  const startGame = () => {
    engine.current = {
      speed: INITIAL_SPEED,
      scoreTracker: 0,
      tractor: { y: 0, vy: 0, isJumping: false },
      obstacles: [],
      particles: [],
      parallax: { ground: 0, hills: 0, clouds: 0 },
      lastObstacleSpawn: 0
    };
    setScore(0);
    setDayPhase('day');
    setGameState('playing');
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(updateGame);
  };

  const handleGameOver = () => {
    setGameState('gameover');
    cancelAnimationFrame(requestRef.current);
    
    const finalScore = Math.floor(engine.current.scoreTracker);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('hortiverse_highscore', finalScore.toString());
    }
  };

  const handleInteraction = (e) => {
    if (e && e.type === 'keydown') {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
      e.preventDefault(); 
    }
    if (gameState === 'start' || gameState === 'gameover') {
      startGame();
    } else {
      jump();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('keydown', handleInteraction);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, updateGame]);


  // ══════════════════════════════════════════════════════════════════════════
  // UI RENDER & STYLES
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <style>{`
        /* Global Cleanup */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes floatIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseSpace {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* 🟢 THE FIX: Forced min-height stops the game from being squished by the footer! */
        .game-world {
          flex: 1; 
          min-height: 500px; 
          position: relative;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          transition: background 3s ease-in-out;
        }

        /* Dynamic Environment Colors */
        .game-world.theme-day { background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%); }
        .game-world.theme-sunset { background: linear-gradient(180deg, #fca5a5 0%, #fef08a 100%); }
        .game-world.theme-night { background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); }

        /* Infinite Parallax Layers */
        .layer-clouds {
          position: absolute; top: 0; left: 0; width: 100%; height: 50%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Cpath fill='%23ffffff' fill-opacity='0.6' d='M50 40a15 15 0 0 1 25-5 20 20 0 0 1 35 5 15 15 0 0 1-60 0z'/%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M200 120a10 10 0 0 1 15-3 15 15 0 0 1 25 3 10 10 0 0 1-40 0z'/%3E%3C/svg%3E");
          background-repeat: repeat-x; z-index: 1; transition: opacity 2s;
        }
        .theme-night .layer-clouds { opacity: 0.1; }

        .layer-hills {
          position: absolute; bottom: 40px; left: 0; width: 100%; height: 150px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='150'%3E%3Cpath fill='%2310b981' fill-opacity='0.15' d='M0 150L150 40L300 150L450 60L600 150z'/%3E%3C/svg%3E");
          background-repeat: repeat-x; background-position: bottom; z-index: 2; transition: opacity 2s;
        }
        .theme-night .layer-hills { opacity: 0.05; }

        /* The Ground */
        .layer-ground {
          position: absolute; bottom: 0; left: 0; width: 100%; height: 40px;
          background-color: #059669;
          background-image: radial-gradient(#047857 15%, transparent 16%), radial-gradient(#047857 15%, transparent 16%);
          background-size: 20px 20px; background-position: 0 0, 10px 10px;
          border-top: 8px solid #10b981; z-index: 10;
        }
        .theme-night .layer-ground { background-color: #064e3b; border-top-color: #047857; }

        /* Player & Celestial Bodies */
        .celestial-body {
          position: absolute; top: 10%; right: 15%; font-size: 80px; z-index: 0;
          transition: all 3s ease-in-out; filter: drop-shadow(0 0 20px rgba(255,255,255,0.8));
        }

        .tractor-entity {
          position: absolute; bottom: 40px; font-size: 80px; z-index: 20;
          filter: drop-shadow(-10px 15px 10px rgba(0,0,0,0.3));
          transform: scaleX(-1) translateY(0); 
        }

        /* UI Overlays */
        .hud-scores {
          position: absolute; top: 40px; right: 50px; z-index: 30;
          font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 800;
          text-shadow: 0 2px 10px rgba(255,255,255,1); display: flex; gap: 30px;
          transition: color 2s;
        }
        .theme-night .hud-scores { color: #f8fafc; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }

        .glass-menu {
          position: absolute; inset: 0; z-index: 40;
          background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; color: #0f172a; padding: 20px;
        }

        .menu-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 32px; padding: 60px 80px;
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2);
          animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-width: 700px; width: 100%;
        }

        .pulse-text {
          font-weight: 800; color: #059669; font-size: 18px; text-transform: uppercase;
          letter-spacing: 2px; margin-top: 30px; animation: pulseSpace 1.5s infinite;
        }

        .btn-exit {
          background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px);
          color: #0f172a; border: 1px solid rgba(0,0,0,0.1);
          padding: 12px 24px; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: inline-flex; gap: 8px; align-items: center;
          position: relative; z-index: 50;
        }
        .btn-exit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); background: #ffffff; }

        /* Floating button for active gameplay */
        .btn-exit-floating {
          position: absolute; top: 40px; left: 50px;
        }
      `}</style>

      {/* 🟢 FULL-SCREEN GAME WORLD */}
      <main 
        className={`game-world theme-${dayPhase}`} 
        onClick={handleInteraction}
      >
        
        {/* Escape Button (Only visible during gameplay so user isn't trapped) */}
        {gameState === 'playing' && (
          <button className="btn-exit btn-exit-floating" onClick={(e) => { e.stopPropagation(); navigate('/'); }}>
            <span>🔙</span> Exit Simulator
          </button>
        )}

        {/* Live HUD */}
        <div className="hud-overlay">
          <span style={{ color: dayPhase === 'night' ? '#94a3b8' : '#64748b' }}>
            HI {String(highScore).padStart(5, '0')}
          </span>
          <span style={{ color: gameState === 'gameover' ? '#ef4444' : (dayPhase === 'night' ? '#34d399' : '#059669') }}>
            {String(score).padStart(5, '0')}
          </span>
        </div>

        {/* Environment Layers */}
        <div className="celestial-body">
          {dayPhase === 'day' ? '☀️' : dayPhase === 'sunset' ? '🌅' : '🌙'}
        </div>
        <div ref={cloudsRef} className="layer-clouds" />
        <div ref={hillsRef} className="layer-hills" />

        {/* DOM Containers updated by the 60fps loop */}
        <div ref={particlesContainerRef} style={{ position: "absolute", inset: 0, zIndex: 15 }} />
        <div ref={obstaclesContainerRef} style={{ position: "absolute", inset: 0, zIndex: 18 }} />

        {/* The Player */}
        <div 
          ref={tractorRef} 
          className="tractor-entity"
          style={{ left: `${TRACTOR_X_POS}px` }}
        >
          🚜
        </div>

        {/* The Ground */}
        <div ref={groundRef} className="layer-ground" />

        {/* 🟢 START SCREEN OVERLAY */}
        {gameState === 'start' && (
          <div className="glass-menu">
            <div className="menu-card" style={{ animation: "floatIdle 6s infinite ease-in-out" }}>
              <span style={{ display:"inline-block", background:"#ecfdf5", color:"#059669", fontSize:12, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20, border: "1px solid #d1fae5" }}>
                Under Construction
              </span>
              <h1 className="fr" style={{ fontSize: "clamp(40px, 6vw, 64px)", color: "#0f172a", fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
                Tractor Run! 🚜
              </h1>
              <p className="jk" style={{ fontSize: 18, color: "#475569", fontWeight: 500, lineHeight: 1.6, marginBottom: 10 }}>
                The Community dashboard is currently being engineered. In the meantime, jump the terrain and set a high score!
              </p>
              
              <div className="pulse-text">Press Space or Tap to Start</div>
              
              <div style={{ marginTop: 40 }}>
                <button className="btn-exit" onClick={(e) => { e.stopPropagation(); navigate('/'); }}>
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🟢 GAME OVER OVERLAY */}
        {gameState === 'gameover' && (
          <div className="glass-menu" style={{ background: "rgba(15, 23, 42, 0.4)" }}>
            <div className="menu-card">
              <div style={{ fontSize: 70, marginBottom: 10 }}>💥</div>
              <h2 className="fr" style={{ fontSize: 42, fontWeight: 900, color: "#ef4444", marginBottom: 20 }}>Tractor Crashed!</h2>
              
              <div style={{ background: "#f8faf9", padding: "24px 40px", borderRadius: 24, border: "1px solid #e2e8f0", display: "inline-block", marginBottom: 30 }}>
                <p style={{ fontSize: 14, color: "#64748b", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>Final Score</p>
                <p style={{ fontSize: 48, color: "#0f172a", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{score}</p>
              </div>
              
              <div className="pulse-text">Press Space or Tap to Restart</div>

              <div style={{ marginTop: 40 }}>
                <button className="btn-exit" onClick={(e) => { e.stopPropagation(); navigate('/'); }}>
                  Abandon Tractor & Return Home
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 🟢 FOOTER */}
      <div style={{ flexShrink: 0, width: "100%", zIndex: 100 }}>
        <Footer />
      </div>

    </div>
  );
}