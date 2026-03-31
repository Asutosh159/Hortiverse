// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer';

// /* ══════════════════════════════════════════════════════════════════════════
//    HORTIVERSE: FULL-SCREEN TRACTOR RUN ENGINE
//    Features: 60FPS JS Engine, Infinite Parallax, Edge-to-Edge Gameplay,
//    Day/Night Cycle, Particle Physics, and Dynamic Collision.
// ══════════════════════════════════════════════════════════════════════════ */

// // --- PHYSICS & GAME TUNING ---
// const GRAVITY = 0.65;
// const JUMP_VELOCITY = 15;
// const INITIAL_SPEED = 7;
// const SPEED_MULTIPLIER = 0.0015; // Smooth speed scaling
// const TRACTOR_X_POS = 100; // Fixed horizontal position of the tractor
// const HITBOX_TOLERANCE = 12; // Forgiving collision boundaries
// const GROUND_HEIGHT = 40; // Height of the moving grass

// const OBSTACLE_TYPES = [
//   { emoji: '⛰️', width: 60, height: 60, yOffset: -5 },
//   { emoji: '🪨', width: 45, height: 45, yOffset: -5 },
//   { emoji: '🚧', width: 50, height: 50, yOffset: -10 },
//   { emoji: '🪵', width: 50, height: 40, yOffset: -5 }
// ];

// export default function UnderDevelopment() {
//   const navigate = useNavigate();

//   // --- REACT STATE ---
//   const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
//   const [score, setScore] = useState(0);
//   const [highScore, setHighScore] = useState(
//     parseInt(localStorage.getItem('hortiverse_highscore')) || 0
//   );
//   const [dayPhase, setDayPhase] = useState('day'); // 'day', 'sunset', 'night'

//   // --- MUTABLE GAME ENGINE REFS (Avoids React re-render lag for 60fps) ---
//   const requestRef = useRef(null);
//   const engine = useRef({
//     speed: INITIAL_SPEED,
//     scoreTracker: 0,
//     tractor: { y: 0, vy: 0, isJumping: false },
//     obstacles: [],
//     particles: [],
//     parallax: { ground: 0, hills: 0, clouds: 0 },
//     lastObstacleSpawn: 0
//   });

//   // --- DOM REFS FOR DIRECT MANIPULATION ---
//   const tractorRef = useRef(null);
//   const obstaclesContainerRef = useRef(null);
//   const particlesContainerRef = useRef(null);
//   const groundRef = useRef(null);
//   const hillsRef = useRef(null);
//   const cloudsRef = useRef(null);

//   // 🟢 FIXED: Defined handleGameOver BEFORE the game loop so it doesn't cause a ReferenceError
//   const handleGameOver = useCallback(() => {
//     setGameState('gameover');
//     cancelAnimationFrame(requestRef.current);
    
//     const finalScore = Math.floor(engine.current.scoreTracker);
//     if (finalScore > highScore) {
//       setHighScore(finalScore);
//       localStorage.setItem('hortiverse_highscore', finalScore.toString());
//     }
//   }, [highScore]);

//   // ══════════════════════════════════════════════════════════════════════════
//   // CORE GAME LOOP (Runs ~60 times per second)
//   // ══════════════════════════════════════════════════════════════════════════
//   const updateGame = useCallback(() => {
//     if (gameState !== 'playing') return;
//     const state = engine.current;
//     const screenWidth = window.innerWidth;

//     // 1. DYNAMIC SPEED & SCORE INCREMENT
//     state.speed += SPEED_MULTIPLIER;
//     state.scoreTracker += (state.speed * 0.05);
//     const currentDisplayScore = Math.floor(state.scoreTracker);
//     setScore(currentDisplayScore);

//     // 2. DAY / NIGHT CYCLE (Based on score progression)
//     if (currentDisplayScore > 1800 && dayPhase !== 'night') setDayPhase('night');
//     else if (currentDisplayScore > 800 && currentDisplayScore <= 1800 && dayPhase !== 'sunset') setDayPhase('sunset');

//     // 3. TRACTOR PHYSICS (Gravity)
//     if (state.tractor.isJumping) {
//       state.tractor.vy -= GRAVITY;
//       state.tractor.y += state.tractor.vy;

//       // Hit the ground
//       if (state.tractor.y <= 0) {
//         state.tractor.y = 0;
//         state.tractor.vy = 0;
//         state.tractor.isJumping = false;
//       }
//     }

//     // Apply tractor position (scaleX(-1) keeps it facing forward!)
//     if (tractorRef.current) {
//       tractorRef.current.style.transform = `scaleX(-1) translateY(-${state.tractor.y}px)`;
//     }

//     // 4. DUST PARTICLE PHYSICS (Spawns at the back tire)
//     if (!state.tractor.isJumping && Math.random() > 0.4) {
//       state.particles.push({
//         id: Date.now() + Math.random(),
//         x: TRACTOR_X_POS - 10,
//         y: GROUND_HEIGHT + Math.random() * 10,
//         size: Math.random() * 12 + 6,
//         opacity: 0.7,
//         vx: -(Math.random() * 3 + state.speed * 0.6), // Blow left (backward)
//         vy: Math.random() * 2 + 1
//       });
//     }

//     // Update existing particles
//     state.particles.forEach(p => {
//       p.x += p.vx;
//       p.y += p.vy;
//       p.opacity -= 0.02;
//       p.size += 0.3;
//     });
//     state.particles = state.particles.filter(p => p.opacity > 0);

//     // 5. OBSTACLE MANAGEMENT (Dynamic Spawning off-screen)
//     state.lastObstacleSpawn += state.speed;
    
//     // Gap scales with speed so it's always jumpable
//     const minGap = 500 + (state.speed * 20); 
//     if (state.lastObstacleSpawn > minGap && Math.random() > 0.96) {
//       const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
//       state.obstacles.push({
//         id: Date.now(),
//         x: screenWidth + 100, // Spawn securely off the right side of the screen
//         ...type
//       });
//       state.lastObstacleSpawn = 0;
//     }

//     // Move & Cleanup Obstacles
//     state.obstacles.forEach(obs => {
//       obs.x -= state.speed;
//     });
//     state.obstacles = state.obstacles.filter(obs => obs.x > -150);

//     // 6. COLLISION DETECTION (Precise AABB Hitboxes)
//     const tBox = {
//       left: TRACTOR_X_POS + HITBOX_TOLERANCE,
//       right: TRACTOR_X_POS + 80 - HITBOX_TOLERANCE, // Tractor width approx 80px
//       bottom: state.tractor.y + GROUND_HEIGHT,
//       top: state.tractor.y + GROUND_HEIGHT + 80 - HITBOX_TOLERANCE
//     };

//     for (let obs of state.obstacles) {
//       const oBox = {
//         left: obs.x + HITBOX_TOLERANCE + 5,
//         right: obs.x + obs.width - HITBOX_TOLERANCE,
//         bottom: GROUND_HEIGHT + obs.yOffset,
//         top: GROUND_HEIGHT + obs.yOffset + obs.height - HITBOX_TOLERANCE
//       };

//       if (
//         tBox.right > oBox.left &&
//         tBox.left < oBox.right &&
//         tBox.bottom < oBox.top
//       ) {
//         handleGameOver();
//         return; 
//       }
//     }

//     // 7. INFINITE PARALLAX SCROLLING
//     state.parallax.ground += state.speed;
//     state.parallax.hills += state.speed * 0.4;
//     state.parallax.clouds += state.speed * 0.15;

//     // 8. DIRECT DOM RENDERING
//     renderDOM(state);

//     // Loop
//     requestRef.current = requestAnimationFrame(updateGame);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gameState, dayPhase, handleGameOver]);


//   // --- BATCH DOM RENDERER ---
//   const renderDOM = (state) => {
//     if (groundRef.current) groundRef.current.style.backgroundPositionX = `-${state.parallax.ground}px`;
//     if (hillsRef.current) hillsRef.current.style.backgroundPositionX = `-${state.parallax.hills}px`;
//     if (cloudsRef.current) cloudsRef.current.style.backgroundPositionX = `-${state.parallax.clouds}px`;

//     if (obstaclesContainerRef.current) {
//       obstaclesContainerRef.current.innerHTML = state.obstacles.map(obs => 
//         `<div style="
//           position: absolute; 
//           left: ${obs.x}px; 
//           bottom: ${GROUND_HEIGHT + obs.yOffset}px; 
//           font-size: ${obs.width}px;
//           line-height: 1;
//           filter: drop-shadow(-5px 10px 5px rgba(0,0,0,0.3));
//         ">${obs.emoji}</div>`
//       ).join('');
//     }

//     if (particlesContainerRef.current) {
//       particlesContainerRef.current.innerHTML = state.particles.map(p => 
//         `<div style="
//           position: absolute;
//           left: ${p.x}px;
//           bottom: ${p.y}px;
//           width: ${p.size}px;
//           height: ${p.size}px;
//           background: rgba(220, 226, 220, ${p.opacity});
//           border-radius: 50%;
//           filter: blur(3px);
//         "></div>`
//       ).join('');
//     }
//   };

//   // ══════════════════════════════════════════════════════════════════════════
//   // GAME CONTROLS & LIFECYCLE
//   // ══════════════════════════════════════════════════════════════════════════
//   const jump = () => {
//     if (gameState === 'playing' && !engine.current.tractor.isJumping) {
//       engine.current.tractor.isJumping = true;
//       engine.current.tractor.vy = JUMP_VELOCITY;
//     }
//   };

//   const startGame = () => {
//     engine.current = {
//       speed: INITIAL_SPEED,
//       scoreTracker: 0,
//       tractor: { y: 0, vy: 0, isJumping: false },
//       obstacles: [],
//       particles: [],
//       parallax: { ground: 0, hills: 0, clouds: 0 },
//       lastObstacleSpawn: 0
//     };
//     setScore(0);
//     setDayPhase('day');
//     setGameState('playing');
    
//     if (requestRef.current) cancelAnimationFrame(requestRef.current);
//     requestRef.current = requestAnimationFrame(updateGame);
//   };

//   const handleInteraction = useCallback((e) => {
//     if (e && e.type === 'keydown') {
//       if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
//       e.preventDefault(); 
//     }
//     if (gameState === 'start' || gameState === 'gameover') {
//       startGame();
//     } else {
//       jump();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gameState]);

//   useEffect(() => {
//     window.addEventListener('keydown', handleInteraction);
//     return () => {
//       window.removeEventListener('keydown', handleInteraction);
//       cancelAnimationFrame(requestRef.current);
//     };
//   }, [handleInteraction]);

//   useEffect(() => {
//     if (gameState === 'playing') {
//       requestRef.current = requestAnimationFrame(updateGame);
//     }
//     return () => cancelAnimationFrame(requestRef.current);
//   }, [gameState, updateGame]);


//   // ══════════════════════════════════════════════════════════════════════════
//   // UI RENDER & STYLES
//   // ══════════════════════════════════════════════════════════════════════════
//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
//       <style>{`
//         /* Global Cleanup */
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes popIn {
//           0% { opacity: 0; transform: scale(0.95) translateY(20px); }
//           100% { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes floatIdle {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes pulseSpace {
//           0%, 100% { opacity: 0.5; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.05); }
//         }

//         .game-world {
//           flex: 1; 
//           min-height: 500px; 
//           position: relative;
//           overflow: hidden;
//           cursor: pointer;
//           user-select: none;
//           transition: background 3s ease-in-out;
//           /* Prevents tap highlight on mobile phones */
//           -webkit-tap-highlight-color: transparent;
//         }

//         /* Dynamic Environment Colors */
//         .game-world.theme-day { background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%); }
//         .game-world.theme-sunset { background: linear-gradient(180deg, #fca5a5 0%, #fef08a 100%); }
//         .game-world.theme-night { background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); }

//         /* Infinite Parallax Layers */
//         .layer-clouds {
//           position: absolute; top: 0; left: 0; width: 100%; height: 50%;
//           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Cpath fill='%23ffffff' fill-opacity='0.6' d='M50 40a15 15 0 0 1 25-5 20 20 0 0 1 35 5 15 15 0 0 1-60 0z'/%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M200 120a10 10 0 0 1 15-3 15 15 0 0 1 25 3 10 10 0 0 1-40 0z'/%3E%3C/svg%3E");
//           background-repeat: repeat-x; z-index: 1; transition: opacity 2s;
//         }
//         .theme-night .layer-clouds { opacity: 0.1; }

//         .layer-hills {
//           position: absolute; bottom: 40px; left: 0; width: 100%; height: 150px;
//           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='150'%3E%3Cpath fill='%2310b981' fill-opacity='0.15' d='M0 150L150 40L300 150L450 60L600 150z'/%3E%3C/svg%3E");
//           background-repeat: repeat-x; background-position: bottom; z-index: 2; transition: opacity 2s;
//         }
//         .theme-night .layer-hills { opacity: 0.05; }

//         /* The Ground */
//         .layer-ground {
//           position: absolute; bottom: 0; left: 0; width: 100%; height: 40px;
//           background-color: #059669;
//           background-image: radial-gradient(#047857 15%, transparent 16%), radial-gradient(#047857 15%, transparent 16%);
//           background-size: 20px 20px; background-position: 0 0, 10px 10px;
//           border-top: 8px solid #10b981; z-index: 10;
//         }
//         .theme-night .layer-ground { background-color: #064e3b; border-top-color: #047857; }

//         /* Player & Celestial Bodies */
//         .celestial-body {
//           position: absolute; top: 10%; right: 15%; font-size: 80px; z-index: 0;
//           transition: all 3s ease-in-out; filter: drop-shadow(0 0 20px rgba(255,255,255,0.8));
//         }

//         .tractor-entity {
//           position: absolute; bottom: 40px; font-size: 80px; z-index: 20;
//           filter: drop-shadow(-10px 15px 10px rgba(0,0,0,0.3));
//           transform: scaleX(-1) translateY(0); 
//         }

//         /* UI Overlays */
//         /* 🟢 CHANGED: top: 100px so it clears the Navbar */
//         .hud-scores {
//           position: absolute; top: 100px; right: 50px; z-index: 30;
//           font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 800;
//           text-shadow: 0 2px 10px rgba(255,255,255,1); display: flex; gap: 30px;
//           transition: color 2s;
//         }
//         .theme-night .hud-scores { color: #f8fafc; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }

//         .glass-menu {
//           position: absolute; inset: 0; z-index: 40;
//           background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           text-align: center; color: #0f172a; padding: 20px;
//         }

//         .menu-card {
//           background: rgba(255, 255, 255, 0.95);
//           border: 1px solid rgba(255, 255, 255, 1);
//           border-radius: 32px; padding: 60px 80px;
//           box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2);
//           animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//           max-width: 700px; width: 100%; margin-top: 50px;
//         }

//         .score-display {
//           background: #f8faf9; padding: 24px 40px; border-radius: 24px; 
//           border: 1px solid #e2e8f0; display: inline-block; margin-bottom: 30px;
//         }

//         .pulse-text {
//           font-weight: 800; color: #059669; font-size: 18px; text-transform: uppercase;
//           letter-spacing: 2px; margin-top: 30px; animation: pulseSpace 1.5s infinite;
//         }

//         .btn-exit {
//           background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px);
//           color: #0f172a; border: 1px solid rgba(0,0,0,0.1);
//           padding: 12px 24px; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif;
//           font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: inline-flex; gap: 8px; align-items: center;
//           position: relative; z-index: 50;
//         }
//         .btn-exit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); background: #ffffff; }

//         /* Floating button for active gameplay */
//         /* 🟢 CHANGED: top: 100px so it clears the Navbar */
//         .btn-exit-floating {
//           position: absolute; top: 100px; left: 50px;
//         }

//         /* 📱 MOBILE RESPONSIVENESS */
//         @media (max-width: 768px) {
//           .menu-card { padding: 30px 20px !important; border-radius: 20px !important; margin-top: 60px; }
//           .hud-scores { top: 90px !important; right: 20px !important; font-size: 20px !important; gap: 15px !important; }
//           .btn-exit-floating { top: 90px !important; left: 20px !important; padding: 10px 16px !important; font-size: 12px !important; }
//           .celestial-body { font-size: 50px !important; }
//           .pulse-text { font-size: 14px !important; margin-top: 20px; }
//           .score-display { padding: 16px 24px !important; border-radius: 16px !important; }
//           .score-display p:last-child { font-size: 36px !important; }
//         }
//       `}</style>

//       {/* 🟢 FULL-SCREEN GAME WORLD */}
//       <main 
//         className={`game-world theme-${dayPhase}`} 
//         onClick={handleInteraction}
//         /* 🟢 ADDED: onTouchStart gives instant mobile jump responses without the 300ms click delay */
//         onTouchStart={(e) => { 
//           // Only prevent default if they didn't tap a button inside the game world
//           if(e.target.tagName !== 'BUTTON') {
//              e.preventDefault(); 
//              handleInteraction();
//           }
//         }}
//       >
        
//         {/* Escape Button (Only visible during gameplay so user isn't trapped) */}
//         {gameState === 'playing' && (
//           <button 
//             className="btn-exit btn-exit-floating" 
//             onClick={(e) => { e.stopPropagation(); navigate('/'); }}
//             onTouchStart={(e) => { e.stopPropagation(); navigate('/'); }}
//           >
//             <span>🔙</span> Exit Simulator
//           </button>
//         )}

//         {/* Live HUD */}
//         <div className="hud-overlay hud-scores">
//           <span style={{ color: dayPhase === 'night' ? '#94a3b8' : '#64748b' }}>
//             HI {String(highScore).padStart(5, '0')}
//           </span>
//           <span style={{ color: gameState === 'gameover' ? '#ef4444' : (dayPhase === 'night' ? '#34d399' : '#059669') }}>
//             {String(score).padStart(5, '0')}
//           </span>
//         </div>

//         {/* Environment Layers */}
//         <div className="celestial-body">
//           {dayPhase === 'day' ? '☀️' : dayPhase === 'sunset' ? '🌅' : '🌙'}
//         </div>
//         <div ref={cloudsRef} className="layer-clouds" />
//         <div ref={hillsRef} className="layer-hills" />

//         {/* DOM Containers updated by the 60fps loop */}
//         <div ref={particlesContainerRef} style={{ position: "absolute", inset: 0, zIndex: 15 }} />
//         <div ref={obstaclesContainerRef} style={{ position: "absolute", inset: 0, zIndex: 18 }} />

//         {/* The Player */}
//         <div 
//           ref={tractorRef} 
//           className="tractor-entity"
//           style={{ left: `${TRACTOR_X_POS}px` }}
//         >
//           🚜
//         </div>

//         {/* The Ground */}
//         <div ref={groundRef} className="layer-ground" />

//         {/* 🟢 START SCREEN OVERLAY */}
//         {gameState === 'start' && (
//           <div className="glass-menu">
//             <div className="menu-card" style={{ animation: "floatIdle 6s infinite ease-in-out" }}>
//               <span style={{ display:"inline-block", background:"#ecfdf5", color:"#059669", fontSize:12, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20, border: "1px solid #d1fae5" }}>
//                 Under Construction
//               </span>
//               <h1 className="fr" style={{ fontSize: "clamp(36px, 6vw, 64px)", color: "#0f172a", fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
//                 Tractor Run! 🚜
//               </h1>
//               <p className="jk" style={{ fontSize: "clamp(14px, 3vw, 18px)", color: "#475569", fontWeight: 500, lineHeight: 1.6, marginBottom: 10 }}>
//                 The Community dashboard is currently being engineered. In the meantime, jump the terrain and set a high score!
//               </p>
              
//               <div className="pulse-text">Press Space or Tap to Start</div>
              
//               <div style={{ marginTop: 40 }}>
//                 <button 
//                   className="btn-exit" 
//                   onClick={(e) => { e.stopPropagation(); navigate('/'); }}
//                   onTouchStart={(e) => { e.stopPropagation(); navigate('/'); }}
//                 >
//                   Return to Homepage
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 🟢 GAME OVER OVERLAY */}
//         {gameState === 'gameover' && (
//           <div className="glass-menu" style={{ background: "rgba(15, 23, 42, 0.4)" }}>
//             <div className="menu-card">
//               <div style={{ fontSize: 70, marginBottom: 10 }}>💥</div>
//               <h2 className="fr" style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 900, color: "#ef4444", marginBottom: 20 }}>Tractor Crashed!</h2>
              
//               <div className="score-display">
//                 <p style={{ fontSize: 14, color: "#64748b", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>Final Score</p>
//                 <p style={{ fontSize: 48, color: "#0f172a", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{score}</p>
//               </div>
              
//               <div className="pulse-text">Press Space or Tap to Restart</div>

//               <div style={{ marginTop: 40 }}>
//                 <button 
//                   className="btn-exit" 
//                   onClick={(e) => { e.stopPropagation(); navigate('/'); }}
//                   onTouchStart={(e) => { e.stopPropagation(); navigate('/'); }}
//                 >
//                   Abandon Tractor & Return Home
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       </main>

//       {/* 🟢 FOOTER */}
//       <div style={{ flexShrink: 0, width: "100%", zIndex: 100 }}>
//         <Footer />
//       </div>

//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';

// Custom icons using SVG
const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-emerald-400 animate-float drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] relative z-10">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.45m.311-.06a15.09 15.09 0 012.448 2.45m0 0a2.002 2.002 0 01-2.828-2.828m2.828 2.828l4.242 4.243M9.418 14.58l-4.242 4.242" />
  </svg>
);

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 ml-2">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// 🟢 Native Canvas Particle System (Zero Dependencies)
const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particlesArray = [];

    // Handle Resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse interactions
    let mouse = { x: null, y: null, radius: 150 };
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    const handleMouseLeave = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle Class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        // Bounce off walls
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        // Check mouse collision (Repel effect)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 5;
          const directionY = forceDirectionY * force * 5;

          this.x -= directionX;
          this.y -= directionY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize Particles
    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.height * canvas.width) / 15000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = 'rgba(52, 211, 153, 0.4)'; // Emerald tint
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    // Connecting lines between close particles
    const connect = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          if (distance < (canvas.width / 10) * (canvas.height / 10)) {
            let opacity = 1 - (distance / 15000);
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      // 🟢 FIXED: Added window. prefix to innerWidth and innerHeight
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
};

export default function UnderDevelopment() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [textIndex, setTextIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const phrases = [
    "We are working on something awesome...",
    "Brewing fresh ideas...",
    "Writing lines of code...",
    "Designing beautiful interfaces...",
    "Almost ready to launch..."
  ];

  // Smooth text cycling with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % phrases.length);
        setIsFading(false);
      }, 400); 
    }, 3500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 🟢 Our Custom Zero-Dependency Particle Canvas */}
      <InteractiveBackground />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        .stagger-1 { animation: fade-in-up 0.6s ease-out 0.1s both; }
        .stagger-2 { animation: fade-in-up 0.6s ease-out 0.2s both; }
        .stagger-3 { animation: fade-in-up 0.6s ease-out 0.3s both; }
        .stagger-4 { animation: fade-in-up 0.6s ease-out 0.4s both; }
        .stagger-5 { animation: fade-in-up 0.6s ease-out 0.5s both; }
        
        .glass-panel {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }
      `}} />

      {/* --- GLOWING BLOBS --- */}
      <div className="absolute top-[-10%] -left-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob pointer-events-none"></div>
      <div className="absolute top-[10%] -right-10 w-96 h-96 bg-teal-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-10 left-[20%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Subtle Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* --- MAIN COMPACT CONTENT --- */}
      <div className="relative z-20 w-full max-w-lg px-6 flex flex-col items-center text-center">
        
        <div className="stagger-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          COMING SOON
        </div>

        <div className="stagger-2 mb-2">
          <RocketIcon />
        </div>
        
        <h1 className="stagger-3 text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-emerald-400 mb-4 pb-1">
          Under Construction
        </h1>

        <div className="stagger-4 h-6 md:h-8 mb-8">
          <p className={`text-base md:text-lg text-slate-400 font-medium transition-all duration-400 transform ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {phrases[textIndex]}
          </p>
        </div>

        <div className="stagger-5 glass-panel w-full rounded-2xl p-1.5 pl-5 flex items-center transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 mb-10">
          {submitted ? (
            <div className="w-full flex items-center justify-center py-2.5 text-emerald-400 font-bold text-sm">
              🎉 You're on the list! We'll be in touch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex items-center">
              <input 
                type="email" 
                required
                placeholder="Enter email to get notified..." 
                className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm md:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="ml-2 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 disabled:opacity-70 text-sm"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>Notify Me <SparklesIcon /></>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="stagger-5 w-full mt-2">
          <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
            <span>Development Progress</span>
            <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">85%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full relative" style={{ width: '85%' }}>
              <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[shimmer_1.5s_infinite] transform -skew-x-12"></div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.history.back()}
          className="stagger-5 mt-10 text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1.5 group cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          RETURN TO SAFETY
        </button>

      </div>
    </div>
  );
}