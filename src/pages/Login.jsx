// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// /* ══════════════════════════════════════════════════════════
//    BACKEND-READY AUTH API
//    Replace with real fetch() when backend is ready:
//    loginUser  → POST /api/auth/login
//    loginAdmin → POST /api/auth/admin/login
// ══════════════════════════════════════════════════════════ */
// const AUTH_API = {
//   async loginUser(email, password) {
//     await new Promise(r => setTimeout(r, 1100));
//     if (email === "user@hortiverse.com" && password === "user123")
//       return { token: "mock-user-jwt", user: { id:1, name:"Ravi Kumar", role:"user", email } };
//     throw new Error("Invalid email or password");
//   },
//   async loginAdmin(email, password) {
//     await new Promise(r => setTimeout(r, 1100));
//     if (email === "admin@hortiverse.com" && password === "admin123")
//       return { token: "mock-admin-jwt", admin: { id:1, name:"HortiVerse Admin", role:"admin", email } };
//     throw new Error("Invalid admin credentials");
//   },
// };

// const SLIDES = [
//   "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1800&q=80",
//   "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1800&q=80",
//   "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80",
//   "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1800&q=80",
// ];

// export default function Login() {
//   const navigate = useNavigate();
//   const [role,     setRole]     = useState("user");
//   const [email,    setEmail]    = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading,  setLoading]  = useState(false);
//   const [error,    setError]    = useState("");
//   const [success,  setSuccess]  = useState(false);
//   const [slideIdx, setSlideIdx] = useState(0);
//   const [nextIdx,  setNextIdx]  = useState(1);
//   const [xfade,    setXfade]    = useState(false);
//   const timer = useRef(null);

//   useEffect(() => {
//     timer.current = setInterval(() => {
//       const n = (slideIdx + 1) % SLIDES.length;
//       setNextIdx(n); setXfade(true);
//       setTimeout(() => { setSlideIdx(n); setXfade(false); }, 900);
//     }, 5000);
//     return () => clearInterval(timer.current);
//   }, [slideIdx]);

//   useEffect(() => {
//     setEmail(""); setPassword(""); setError(""); setShowPass(false);
//   }, [role]);

//   const submit = async () => {
//     if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
//     setLoading(true); setError("");
//     try {
//       if (role === "admin") {
//         const d = await AUTH_API.loginAdmin(email, password);
//         localStorage.setItem("hv_token", d.token);
//         localStorage.setItem("hv_user", JSON.stringify(d.admin));
//       } else {
//         const d = await AUTH_API.loginUser(email, password);
//         localStorage.setItem("hv_token", d.token);
//         localStorage.setItem("hv_user", JSON.stringify(d.user));
//       }
//       setSuccess(true);
//       setTimeout(() => navigate(role === "admin" ? "/admin/dashboard" : "/"), 1800);
//     } catch(e) { setError(e.message); }
//     finally    { setLoading(false); }
//   };

//   const isAdmin = role === "admin";
//   const acc  = isAdmin ? "#e53935" : "#43a047";
//   const accD = isAdmin ? "#b71c1c" : "#1b5e20";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,700&display=swap');

//         *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
//         html, body { height:100%; overflow:hidden; }

//         .fr { font-family:'Fraunces',serif; }
//         .jk { font-family:'Plus Jakarta Sans',sans-serif; }

//         .lp-root {
//           position:fixed; inset:0;
//           display:flex; align-items:center; justify-content:center;
//           overflow:hidden;
//         }

//         /* bg */
//         .bg-img {
//           position:absolute; inset:0;
//           background-size:cover; background-position:center;
//           transition:opacity .9s ease;
//         }
//         .bg-overlay {
//           position:absolute; inset:0;
//           background:linear-gradient(135deg,rgba(4,18,4,.86) 0%,rgba(8,28,8,.68) 45%,rgba(4,14,20,.76) 100%);
//           z-index:1;
//         }
//         .bg-blur-ring {
//           position:absolute; inset:0; z-index:2;
//           backdrop-filter:blur(2px);
//           -webkit-backdrop-filter:blur(2px);
//           mask-image:radial-gradient(ellipse 65% 65% at 50% 50%, transparent 35%, black 100%);
//           -webkit-mask-image:radial-gradient(ellipse 65% 65% at 50% 50%, transparent 35%, black 100%);
//         }

//         /* floating orbs */
//         @keyframes orbFloat {
//           0%   { transform:translate(0,0) scale(1); }
//           33%  { transform:translate(20px,-30px) scale(1.05); }
//           66%  { transform:translate(-15px,-20px) scale(.95); }
//           100% { transform:translate(0,0) scale(1); }
//         }
//         .orb {
//           position:absolute; border-radius:50%;
//           filter:blur(60px); pointer-events:none; z-index:1;
//           animation:orbFloat ease-in-out infinite;
//         }

//         /* card */
//         .lp-card {
//           position:relative; z-index:10;
//           width:min(420px, calc(100vw - 32px));
//           background:rgba(255,255,255,.96);
//           backdrop-filter:blur(48px);
//           -webkit-backdrop-filter:blur(48px);
//           border-radius:26px;
//           box-shadow:
//             0 0 0 1px rgba(255,255,255,.55),
//             0 40px 100px rgba(0,0,0,.5),
//             0 10px 28px rgba(0,0,0,.28);
//           overflow:hidden;
//           animation:cardIn .55s cubic-bezier(.23,1,.32,1) both;
//         }
//         @keyframes cardIn {
//           from { opacity:0; transform:translateY(32px) scale(.96); }
//           to   { opacity:1; transform:translateY(0)   scale(1);    }
//         }

//         /* animated top bar */
//         .top-bar {
//           height:4px;
//           background-size:200% 100%;
//           animation:barShift 2.8s linear infinite;
//         }
//         @keyframes barShift { 0%{background-position:0%} 100%{background-position:200%} }

//         /* role tabs */
//         .r-tabs { display:flex; background:#f1f5f1; border-radius:13px; padding:4px; gap:3px; }
//         .r-tab {
//           flex:1; padding:9px 0; border-radius:10px; border:none;
//           cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif;
//           font-size:12.5px; font-weight:700; letter-spacing:.03em;
//           transition:all .26s; display:flex; align-items:center;
//           justify-content:center; gap:6px; color:#7a9a7a; background:transparent;
//         }
//         .r-tab.on { background:#fff; box-shadow:0 2px 10px rgba(0,0,0,.09); }
//         .r-tab:hover:not(.on) { background:rgba(255,255,255,.55); color:#2d4a2d; }

//         /* inputs */
//         .f-row { display:flex; flex-direction:column; gap:5px; }
//         .f-label {
//           font-family:'Plus Jakarta Sans',sans-serif; font-size:10.5px;
//           font-weight:700; letter-spacing:.07em; text-transform:uppercase;
//         }
//         .f-wrap { position:relative; }
//         .f-ico  {
//           position:absolute; left:14px; top:50%; transform:translateY(-50%);
//           font-size:14px; pointer-events:none; z-index:1; opacity:.45;
//         }
//         .f-inp {
//           width:100%; padding:12px 14px 12px 42px;
//           background:#f8fdf8; border:1.5px solid #dfeadf;
//           border-radius:12px; outline:none;
//           font-family:'Plus Jakarta Sans',sans-serif; font-size:13.5px;
//           color:#1a2e1a; transition:all .24s;
//         }
//         .f-inp:focus { background:#fff; border-color:var(--a); box-shadow:0 0 0 3px color-mix(in srgb,var(--a) 14%,transparent); }
//         .f-inp::placeholder { color:#b4cbb4; }
//         .f-inp.e { border-color:#e53935; background:#fff5f5; }
//         .f-inp.e:focus { box-shadow:0 0 0 3px rgba(229,57,53,.12); }
//         .f-eye {
//           position:absolute; right:13px; top:50%; transform:translateY(-50%);
//           background:none; border:none; cursor:pointer; font-size:14px;
//           color:#9ab89a; padding:3px; transition:color .2s; line-height:1;
//         }
//         .f-eye:hover { color:var(--a); }

//         /* submit */
//         .s-btn {
//           width:100%; padding:13px; border-radius:12px; border:none;
//           cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif;
//           font-size:13.5px; font-weight:700; letter-spacing:.04em; color:#fff;
//           display:flex; align-items:center; justify-content:center; gap:7px;
//           position:relative; overflow:hidden; transition:all .3s;
//           background:linear-gradient(135deg,var(--a),var(--ad));
//           box-shadow:0 5px 18px color-mix(in srgb,var(--a) 38%,transparent);
//         }
//         .s-btn::before {
//           content:''; position:absolute; inset:0;
//           background:linear-gradient(180deg,rgba(255,255,255,.16),transparent);
//         }
//         .s-btn:hover:not(:disabled) {
//           transform:translateY(-2px);
//           box-shadow:0 10px 28px color-mix(in srgb,var(--a) 46%,transparent);
//           filter:brightness(1.07);
//         }
//         .s-btn:disabled { opacity:.7; cursor:not-allowed; }

//         /* error */
//         .e-msg {
//           display:flex; align-items:center; gap:8px;
//           background:#fff1f0; border:1px solid #ffcdd2;
//           border-radius:10px; padding:9px 13px;
//           font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; color:#c62828;
//           animation:shake .36s ease;
//         }
//         @keyframes shake {
//           0%,100%{transform:translateX(0)}
//           20%,60%{transform:translateX(-5px)}
//           40%,80%{transform:translateX(5px)}
//         }

//         /* link btn */
//         .lnk { background:none; border:none; cursor:pointer;
//           font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
//           transition:opacity .2s; }
//         .lnk:hover { opacity:.7; text-decoration:underline; }

//         /* spinner */
//         @keyframes spin { to{transform:rotate(360deg)} }
//         .sp { width:16px; height:16px; border-radius:50%;
//           border:2.5px solid rgba(255,255,255,.3);
//           border-top-color:#fff; animation:spin .6s linear infinite; }

//         /* success */
//         @keyframes sIn { from{transform:scale(.7);opacity:0} to{transform:scale(1);opacity:1} }
//         @keyframes pRing { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.55);opacity:0} }
//         @keyframes prog { from{width:0%} to{width:100%} }

//         /* register btn */
//         .reg-btn {
//           width:100%; padding:12px; border-radius:12px;
//           font-family:'Plus Jakarta Sans',sans-serif;
//           font-size:13.5px; font-weight:700; letter-spacing:.03em;
//           cursor:pointer; transition:all .24s; border:1.5px solid;
//         }

//         /* bottom strip */
//         .bot-strip {
//           display:flex; gap:8px; margin-top:14px;
//           justify-content:center; align-items:center;
//         }
//       `}</style>

//       <div className="lp-root" style={{ "--a": acc, "--ad": accD }}>

//         {/* ── full-bleed background ── */}
//         {SLIDES.map((url, i) => (
//           <div key={url} className="bg-img" style={{
//             backgroundImage: `url(${url})`,
//             opacity: i === slideIdx ? 1 : (xfade && i === nextIdx ? 1 : 0),
//             zIndex:  i === slideIdx ? 0 : (xfade && i === nextIdx ? 1 : -1),
//           }} />
//         ))}
//         <div className="bg-overlay" />
//         <div className="bg-blur-ring" />

//         {/* ambient orbs */}
//         <div className="orb" style={{ width:340, height:340, top:"-10%", left:"-8%", background:"rgba(67,160,71,.13)", animationDuration:"12s" }} />
//         <div className="orb" style={{ width:280, height:280, bottom:"5%",  right:"-6%", background:"rgba(46,125,50,.1)",  animationDuration:"15s", animationDelay:"3s" }} />
//         <div className="orb" style={{ width:200, height:200, top:"40%",   left:"3%",   background:"rgba(129,199,132,.08)", animationDuration:"10s", animationDelay:"6s" }} />

//         {/* slide dots */}
//         <div style={{ position:"absolute", bottom:22, left:0, right:0, display:"flex", justifyContent:"center", gap:6, zIndex:5 }}>
//           {SLIDES.map((_, i) => (
//             <div key={i} style={{ height:3, borderRadius:2, transition:"all .4s", width: i===slideIdx?22:6, background: i===slideIdx?"rgba(129,199,132,.9)":"rgba(255,255,255,.3)" }} />
//           ))}
//         </div>

//         {/* brand stamp */}
//         <div style={{ position:"absolute", bottom:8, left:0, right:0, textAlign:"center", zIndex:5 }}>
//           <span className="jk" style={{ fontSize:11, color:"rgba(255,255,255,.22)", letterSpacing:".12em", textTransform:"uppercase" }}>
//             HortiVerse · Cultivating Tomorrow's Agriculture
//           </span>
//         </div>

//         {/* ════ CARD ════ */}
//         <div className="lp-card">

//           {/* animated bar */}
//           <div className="top-bar" style={{
//             background: isAdmin
//               ? "linear-gradient(90deg,#e53935,#ff7043,#e53935)"
//               : "linear-gradient(90deg,#43a047,#81c784,#2e7d32,#81c784,#43a047)",
//           }} />

//           <div style={{ padding:"24px 30px 28px" }}>

//             {/* ── SUCCESS ── */}
//             {success ? (
//               <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
//                 <div style={{ position:"relative", display:"inline-flex", marginBottom:16 }}>
//                   <div style={{ position:"absolute", inset:-9, borderRadius:"50%", border:`2px solid ${acc}`, animation:"pRing .9s ease-out infinite" }} />
//                   <div style={{ width:68, height:68, borderRadius:"50%", background:`linear-gradient(135deg,${acc},${accD})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, animation:"sIn .45s cubic-bezier(.23,1,.32,1)" }}>✓</div>
//                 </div>
//                 <h3 className="fr" style={{ fontSize:22, color:"#1a3a1a", fontWeight:700, marginBottom:6 }}>
//                   {isAdmin ? "Welcome, Admin!" : "Welcome back!"}
//                 </h3>
//                 <p className="jk" style={{ fontSize:12.5, color:"#8aaa8a", fontWeight:300 }}>
//                   Redirecting {isAdmin ? "to dashboard" : "home"}…
//                 </p>
//                 <div style={{ marginTop:16, height:3, background:"#edf3ed", borderRadius:2, overflow:"hidden" }}>
//                   <div style={{ height:"100%", background:`linear-gradient(90deg,${acc},${accD})`, borderRadius:2, animation:"prog 1.8s ease forwards" }} />
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* ── header ── */}
//                 <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:9 }}>
//                     <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#66bb6a,#1b5e20)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 3px 10px rgba(76,175,80,.38)", flexShrink:0 }}>🌿</div>
//                     <span className="fr" style={{ fontSize:17, fontWeight:700, color:"#1a3a1a" }}>
//                       Horti<span style={{ color:"#43a047" }}>Verse</span>
//                     </span>
//                   </div>
//                   <span className="jk" style={{ fontSize:10.5, color:isAdmin?"#e53935":"#43a047", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", background:isAdmin?"rgba(229,57,53,.07)":"rgba(67,160,71,.07)", padding:"3px 11px", borderRadius:50, border:`1px solid ${isAdmin?"rgba(229,57,53,.2)":"rgba(67,160,71,.2)"}` }}>
//                     {isAdmin ? "🛡️ Admin" : "🌿 Member"}
//                   </span>
//                 </div>

//                 <h1 className="fr" style={{ fontSize:26, fontWeight:900, color:"#1a3a1a", lineHeight:1.1, marginBottom:3 }}>
//                   {isAdmin ? "Admin Portal" : "Welcome back"}
//                 </h1>
//                 <p className="jk" style={{ fontSize:12.5, color:"#9aba9a", marginBottom:20, fontWeight:300 }}>
//                   {isAdmin ? "Restricted — authorised personnel only" : "Sign in to your HortiVerse account"}
//                 </p>

//                 {/* role tabs */}
//                 <div className="r-tabs" style={{ marginBottom:18 }}>
//                   {[
//                     { key:"user",  icon:"🌱", label:"Member" },
//                     { key:"admin", icon:"🛡️", label:"Admin"  },
//                   ].map(r => (
//                     <button key={r.key} className={`r-tab ${role===r.key?"on":""}`}
//                       style={{ color: role===r.key ? (r.key==="admin"?"#c62828":"#2e7d32") : undefined }}
//                       onClick={() => setRole(r.key)}>
//                       <span style={{ fontSize:14 }}>{r.icon}</span>{r.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* form fields */}
//                 <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:12 }}>
//                   <div className="f-row">
//                     <label className="f-label" style={{ color: isAdmin?"#c62828":"#5a7a5a" }}>
//                       {isAdmin?"Admin Email":"Email Address"}
//                     </label>
//                     <div className="f-wrap">
//                       <span className="f-ico">✉️</span>
//                       <input className={`f-inp${error?" e":""}`} type="email"
//                         placeholder={isAdmin?"admin@hortiverse.com":"you@example.com"}
//                         value={email}
//                         onChange={e => { setEmail(e.target.value); setError(""); }}
//                         onKeyDown={e => e.key==="Enter"&&submit()} />
//                     </div>
//                   </div>

//                   <div className="f-row">
//                     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                       <label className="f-label" style={{ color: isAdmin?"#c62828":"#5a7a5a" }}>Password</label>
//                       <button className="lnk" style={{ color:acc, fontSize:11.5, marginBottom:4 }}>Forgot?</button>
//                     </div>
//                     <div className="f-wrap">
//                       <span className="f-ico">🔒</span>
//                       <input className={`f-inp${error?" e":""}`}
//                         type={showPass?"text":"password"}
//                         placeholder="Enter your password"
//                         style={{ paddingRight:42 }}
//                         value={password}
//                         onChange={e => { setPassword(e.target.value); setError(""); }}
//                         onKeyDown={e => e.key==="Enter"&&submit()} />
//                       <button className="f-eye" onClick={() => setShowPass(p=>!p)}>
//                         {showPass?"🙈":"👁️"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* error */}
//                 {error && <div className="e-msg" style={{ marginBottom:12 }}>⚠️ {error}</div>}

//                 {/* submit */}
//                 <button className="s-btn" onClick={submit} disabled={loading} style={{ marginBottom:14 }}>
//                   {loading
//                     ? <><div className="sp"/>Signing in…</>
//                     : <>{isAdmin?"🛡️ Sign in as Admin":"🌿 Sign in"}</>}
//                 </button>

//                 {/* demo hint */}
//                 <div style={{ background:isAdmin?"rgba(229,57,53,.05)":"rgba(67,160,71,.05)", border:`1px solid ${isAdmin?"rgba(229,57,53,.15)":"rgba(67,160,71,.15)"}`, borderRadius:10, padding:"9px 13px", marginBottom:14 }}>
//                   <p className="jk" style={{ fontSize:10.5, fontWeight:700, color:isAdmin?"#c62828":"#2e7d32", letterSpacing:".06em", textTransform:"uppercase", marginBottom:3 }}>Demo</p>
//                   <p className="jk" style={{ fontSize:12, color:"#6a8a6a", lineHeight:1.7, fontWeight:300 }}>
//                     {isAdmin
//                       ? <><b style={{fontWeight:600}}>admin@hortiverse.com</b> &nbsp;·&nbsp; admin123</>
//                       : <><b style={{fontWeight:600}}>user@hortiverse.com</b> &nbsp;·&nbsp; user123</>}
//                   </p>
//                 </div>

//                 {/* register / note */}
//                 {!isAdmin ? (
//                   <button className="reg-btn" onClick={() => navigate("/register")}
//                     style={{ color:acc, borderColor:`${acc}30`, background:`${acc}07` }}
//                     onMouseEnter={e=>{ e.currentTarget.style.background=`${acc}12`; e.currentTarget.style.borderColor=`${acc}55`; }}
//                     onMouseLeave={e=>{ e.currentTarget.style.background=`${acc}07`; e.currentTarget.style.borderColor=`${acc}30`; }}>
//                     New here? Create a free account →
//                   </button>
//                 ) : (
//                   <p className="jk" style={{ textAlign:"center", fontSize:11.5, color:"#b0b8b0", lineHeight:1.7, fontWeight:300 }}>
//                     🔐 Contact your system administrator for access issues.
//                   </p>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════
   BACKEND-READY AUTH API (unchanged)
══════════════════════════════════════════════════════════ */
const AUTH_API = {
  async loginUser(email, password) {
    await new Promise(r => setTimeout(r, 1100));
    if (email === "user@hortiverse.com" && password === "user123")
      return { token: "mock-user-jwt", user: { id:1, name:"Ravi Kumar", role:"user", email } };
    throw new Error("Invalid email or password");
  },
  async loginAdmin(email, password) {
    await new Promise(r => setTimeout(r, 1100));
    if (email === "admin@hortiverse.com" && password === "admin123")
      return { token: "mock-admin-jwt", admin: { id:1, name:"HortiVerse Admin", role:"admin", email } };
    throw new Error("Invalid admin credentials");
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [role,     setRole]     = useState("user");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  useEffect(() => {
    setEmail(""); setPassword(""); setError(""); setShowPass(false);
  }, [role]);

  const submit = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      if (role === "admin") {
        const d = await AUTH_API.loginAdmin(email, password);
        localStorage.setItem("hv_token", d.token);
        localStorage.setItem("hv_user", JSON.stringify(d.admin));
      } else {
        const d = await AUTH_API.loginUser(email, password);
        localStorage.setItem("hv_token", d.token);
        localStorage.setItem("hv_user", JSON.stringify(d.user));
      }
      setSuccess(true);
      setTimeout(() => navigate(role === "admin" ? "/admin/dashboard" : "/"), 1800);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  };

  const isAdmin = role === "admin";

  // Modern clay color palette
  const userColor = "#2A9D8F";
  const adminColor = "#9D4EDD";
  const accent = isAdmin ? adminColor : userColor;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700;14..32,800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          overflow: hidden;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        /* === MODERN BACKGROUND (ANIMATED) === */
        .clay-bg {
          position: fixed;
          inset: 0;
          background: #0cad9d;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          width: 60vmax;
          height: 60vmax;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.4), rgba(42, 157, 143, 0.2));
          filter: blur(80px);
          animation: orbMove 25s infinite alternate ease-in-out;
        }

        .orb2 {
          width: 70vmax;
          height: 70vmax;
          background: radial-gradient(circle at 70% 70%, rgba(42, 157, 143, 0.35), rgba(157, 78, 221, 0.2));
          animation: orbMove2 30s infinite alternate-reverse;
        }

        @keyframes orbMove {
          0% { transform: translate(-20%, -20%) scale(1); }
          100% { transform: translate(10%, 10%) scale(1.2); }
        }
        @keyframes orbMove2 {
          0% { transform: translate(20%, 20%) scale(1); }
          100% { transform: translate(-10%, -10%) scale(1.3); }
        }

        .grain {
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNDUiIC8+PC9zdmc+');
          opacity: 0.2;
          pointer-events: none;
        }

        /* === MAIN CARD – COMPACT & STABLE === */
        .clay-card {
          position: relative;
          width: min(420px, 92%);
          background: rgba(20, 30, 40, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 40px;
          padding: 1.8rem 1.8rem;            /* 🔹 reduced padding */
          box-shadow:
            0 30px 50px -20px rgba(0,0,0,0.6),
            inset 0 -6px 8px rgba(255,255,255,0.06),
            inset 0 6px 8px rgba(255,255,255,0.1),
            0 0 0 1px rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.05);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          z-index: 10;
        }

        .clay-card:hover {
          box-shadow:
            0 40px 60px -20px rgba(0,0,0,0.7),
            inset 0 -6px 8px rgba(255,255,255,0.08),
            inset 0 6px 8px rgba(255,255,255,0.12);
        }

        /* === SLIDING TOGGLE – EXTRA SMOOTH + NEW ANIMATIONS === */
        .role-switch {
          display: flex;
          background: rgba(10, 20, 30, 0.6);
          border-radius: 60px;
          padding: 6px;
          margin: 1rem 0 1.5rem;              /* 🔹 reduced margins */
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.05);
          position: relative;
        }

        .switch-option {
          flex: 1;
          text-align: center;
          padding: 10px 0;                     /* 🔹 slightly smaller */
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: color 0.2s ease;
          z-index: 2;
          position: relative;
        }

        .switch-option.active {
          color: white;
        }

        .switch-slider {
          position: absolute;
          top: 6px;
          left: 6px;
          width: calc(50% - 6px);
          height: calc(100% - 12px);
          background: ${accent};
          border-radius: 50px;
          transition: left 0.4s cubic-bezier(0.34, 1.5, 0.64, 1), background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
          will-change: left, background, box-shadow, transform;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4);
          z-index: 1;
        }

        /* 🔥 new glow + scale on active change */
        .switch-slider.admin {
          left: calc(50% + 0px);
        }

        .switch-slider:active {
          transform: scale(0.98);
        }

        /* add a subtle pulse when role changes (triggered via keyframe) */
        @keyframes softPulse {
          0% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4); }
          50% { box-shadow: 0 8px 20px ${accent}80, inset 0 1px 4px white; }
          100% { box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4); }
        }

        .switch-slider {
          animation: softPulse 0.6s ease-out 1;
        }

        /* === INPUTS – COMPACT === */
        .input-group {
          margin-bottom: 1rem;                  /* 🔹 reduced from 1.5rem */
        }

        .input-label {
          display: block;
          font-size: 0.65rem;                   /* 🔹 slightly smaller */
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.4rem;
        }

        .input-wrapper {
          position: relative;
          background: rgba(15, 25, 35, 0.7);
          border-radius: 30px;
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02);
          transition: box-shadow 0.2s ease;
        }

        .input-wrapper:focus-within {
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 0 0 3px ${accent}40;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          opacity: 0.5;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 16px 14px 44px;        /* 🔹 smaller padding */
          font-size: 0.9rem;
          color: white;
          outline: none;
          border-radius: 30px;
        }

        .input-field::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .input-field.error {
          box-shadow: inset 0 0 0 2px #f28482;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
        }
        .password-toggle:hover {
          color: ${accent};
        }

        /* === SUBMIT BUTTON – COMPACT + ANIMATION === */
        .submit-btn {
          width: 100%;
          padding: 15px;                        /* 🔹 reduced from 18px */
          border: none;
          border-radius: 36px;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: white;
          background: ${accent};
          box-shadow:
            0 12px 20px -10px rgba(0,0,0,0.6),
            inset 0 -3px 0 rgba(0,0,0,0.2),
            inset 0 1px 2px rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.15s ease, background 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 1.5rem 0 0.8rem;              /* 🔹 reduced margins */
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 25px -12px rgba(0,0,0,0.7),
            inset 0 -3px 0 rgba(0,0,0,0.2),
            inset 0 1px 3px rgba(255,255,255,0.6);
        }

        .submit-btn:active {
          transform: translateY(2px);
          box-shadow:
            0 8px 15px -8px rgba(0,0,0,0.6),
            inset 0 2px 4px rgba(0,0,0,0.3);
        }

        /* subtle ripple effect on click */
        .submit-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .submit-btn:active::after {
          width: 200px;
          height: 200px;
        }

        /* === ERROR MESSAGE === */
        .error-msg {
          background: rgba(242, 132, 130, 0.15);
          border-radius: 24px;
          padding: 10px 14px;
          font-size: 0.85rem;
          color: #f28482;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0.8rem 0;
          border: 1px solid rgba(242, 132, 130, 0.3);
        }

        /* === SUCCESS STATE (unchanged) === */
        .success-container {
          text-align: center;
          padding: 0.5rem 0;
        }
        .success-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 1rem;
          background: ${accent};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: 0 20px 30px -10px rgba(0,0,0,0.5), inset 0 -4px 0 rgba(0,0,0,0.2);
          animation: pop 0.4s cubic-bezier(0.3, 1.3, 0.4, 1);
        }
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .progress-bar {
          height: 5px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          margin-top: 1.5rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: ${accent};
          width: 0%;
          animation: progress 1.8s ease forwards;
        }
        @keyframes progress {
          to { width: 100%; }
        }

        /* === REGISTER LINK & DEMO HINT – COMPACT === */
        .register-link {
          background: none;
          border: none;
          color: ${accent};
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 8px 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .register-link:hover {
          opacity: 0.8;
          transform: translateX(4px);
        }

        .demo-hint {
          background: rgba(255,255,255,0.03);
          border-radius: 28px;
          padding: 10px 14px;
          margin: 1rem 0 0.5rem;                /* 🔹 reduced margins */
          text-align: center;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .demo-hint small {
          display: block;
          font-size: 0.55rem;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 4px;
        }
        .demo-hint code {
          color: ${accent};
          background: rgba(0,0,0,0.3);
          padding: 3px 8px;
          border-radius: 30px;
          font-size: 0.75rem;
        }

        /* === LAYOUT – NO SCROLL === */
        .center-wrapper {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow: hidden;
        }
      `}</style>

      <div className="clay-bg">
        <div className="orb"></div>
        <div className="orb orb2"></div>
        <div className="grain"></div>
      </div>

      <div className="center-wrapper">
        <div className="clay-card">

          {success ? (
            <div className="success-container">
              <div className="success-icon">
                {isAdmin ? '🛡️' : '🌿'}
              </div>
              <h2 style={{ color: 'white', marginBottom: '0.3rem', fontWeight: 600, fontSize: '1.6rem' }}>
                {isAdmin ? 'Welcome, Admin' : 'Welcome back!'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                Redirecting {isAdmin ? 'to dashboard' : 'home'}...
              </p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>🌱</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
                  Horti<span style={{ color: accent }}>Verse</span>
                </span>
              </div>

              <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 600, lineHeight: 1.2 }}>
                {isAdmin ? 'Admin Portal' : 'Welcome back'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                {isAdmin ? 'Authorized personnel only' : 'Sign in to continue'}
              </p>

              {/* SLIDING TOGGLE – with extra animation */}
              <div className="role-switch">
                <div className={`switch-option ${!isAdmin ? 'active' : ''}`} onClick={() => setRole('user')}>
                  🌱 Member
                </div>
                <div className={`switch-option ${isAdmin ? 'active' : ''}`} onClick={() => setRole('admin')}>
                  🛡️ Admin
                </div>
                <div className={`switch-slider ${isAdmin ? 'admin' : ''}`} />
              </div>

              {/* FORM */}
              <div className="input-group">
                <label className="input-label">{isAdmin ? 'ADMIN EMAIL' : 'EMAIL'}</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    className={`input-field ${error ? 'error' : ''}`}
                    placeholder={isAdmin ? 'admin@hortiverse.com' : 'user@example.com'}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="input-label">PASSWORD</label>
                  <button className="register-link" style={{ fontSize: '0.65rem', textTransform: 'uppercase', padding: 0 }}>Forgot?</button>
                </div>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input-field ${error ? 'error' : ''}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                  <button className="password-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-msg">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button className="submit-btn" onClick={submit} disabled={loading}>
                {loading ? (
                  <>⏳ Signing in...</>
                ) : (
                  <>{isAdmin ? '🛡️ Sign in as Admin' : '🌿 Sign in'}</>
                )}
              </button>

              <div className="demo-hint">
                <small>DEMO CREDENTIALS</small>
                <code>{isAdmin ? 'admin@hortiverse.com / admin123' : 'user@hortiverse.com / user123'}</code>
              </div>

              {!isAdmin ? (
                <button className="register-link" onClick={() => navigate('/register')} style={{ width: '100%' }}>
                  New here? Create a free account →
                </button>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textAlign: 'center', marginTop: '0.3rem' }}>
                  🔐 Contact your system administrator
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}