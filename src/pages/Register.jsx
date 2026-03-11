import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ══════════════════════════════════════════════════════════
   BACKEND API LAYER
   POST /api/auth/register  → { name, email, password, country, role:"user" }
   GET  /api/auth/check-email?email=x → { available: bool }
══════════════════════════════════════════════════════════ */
const REGISTER_API = {
  async checkEmail(email) {
    await new Promise(r => setTimeout(r, 520));
    const taken = ["taken@example.com", "admin@hortiverse.com"];
    return { available: !taken.includes(email.toLowerCase()) };
  },
  async register({ name, email, password, country, interests }) {
    await new Promise(r => setTimeout(r, 1400));
    if (!name || !email || !password) throw new Error("All fields are required.");
    return {
      token: "mock-jwt-new-user",
      user: { id: Date.now(), name, email, role: "user", country, interests },
    };
  },
};

const COUNTRIES = [
  "India","United States","United Kingdom","Germany","Australia",
  "Canada","Brazil","Japan","South Africa","Netherlands",
  "France","Italy","Spain","Mexico","Kenya","Nigeria","Other"
];

const INTERESTS = [
  { icon:"🌾", label:"Sustainable Farming" },
  { icon:"🚜", label:"AgriTech"            },
  { icon:"💧", label:"Hydroponics"         },
  { icon:"🐄", label:"Livestock"           },
  { icon:"🌽", label:"Crop Science"        },
  { icon:"🌿", label:"Plant Pathology"     },
  { icon:"🌍", label:"Global Agriculture"  },
  { icon:"🤖", label:"Precision Farming"   },
];

/* ── Animated seedling SVG — grows per step ── */
function SeedlingGrow({ step }) {
  // step 1 = seed, step 2 = sprout, step 3 = full plant
  const stems = [
    null,
    // step 1: just seed
    <g key="s1">
      <ellipse cx="50" cy="80" rx="9" ry="6" fill="#5d4037" opacity=".7"/>
      <ellipse cx="50" cy="79" rx="6" ry="4" fill="#795548" opacity=".5"/>
    </g>,
    // step 2: stem + one leaf
    <g key="s2">
      <ellipse cx="50" cy="84" rx="9" ry="6" fill="#5d4037" opacity=".7"/>
      <line x1="50" y1="84" x2="50" y2="55" stroke="#558b2f" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M50 68 Q35 58 32 45 Q45 52 50 62" fill="#7cb342" opacity=".9"/>
      <path d="M50 60 Q63 50 67 37 Q55 45 50 55" fill="#558b2f" opacity=".85"/>
    </g>,
    // step 3: full plant
    <g key="s3">
      <ellipse cx="50" cy="88" rx="9" ry="6" fill="#5d4037" opacity=".7"/>
      <line x1="50" y1="88" x2="50" y2="30" stroke="#558b2f" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M50 75 Q30 62 26 44 Q42 55 50 68" fill="#8bc34a" opacity=".9"/>
      <path d="M50 65 Q68 52 72 34 Q57 47 50 60" fill="#558b2f" opacity=".85"/>
      <path d="M50 52 Q32 38 30 20 Q44 35 50 47" fill="#7cb342" opacity=".88"/>
      <path d="M50 42 Q66 28 70 10 Q56 26 50 38" fill="#33691e" opacity=".8"/>
      <ellipse cx="50" cy="28" rx="7" ry="5" fill="#aed581" opacity=".9"/>
    </g>,
  ];

  return (
    <div style={{ textAlign:"center", marginBottom:8 }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ overflow:"visible" }}>
        {/* pot */}
        <path d="M36 90 L40 96 L60 96 L64 90 Z" fill="#8d6e63"/>
        <rect x="34" y="86" width="32" height="5" rx="2" fill="#a1887f"/>
        <rect x="34" y="86" width="32" height="2" rx="1" fill="#bcaaa4" opacity=".5"/>
        {/* soil */}
        <ellipse cx="50" cy="88" rx="14" ry="3" fill="#6d4c41"/>
        {/* plant */}
        <g style={{ transition:"all .5s cubic-bezier(.23,1,.32,1)" }}>
          {stems[step]}
        </g>
        {/* sparkle on step 3 */}
        {step === 3 && [
          {x:28,y:22,s:.7,d:0},
          {x:72,y:18,s:.5,d:.2},
          {x:20,y:50,s:.6,d:.1},
          {x:78,y:42,s:.55,d:.15},
        ].map((sp,i)=>(
          <g key={i} style={{ animation:`sparkle 1.4s ease ${sp.d}s infinite` }}>
            <line x1={sp.x} y1={sp.y-5*sp.s} x2={sp.x} y2={sp.y+5*sp.s} stroke="#c5e1a5" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1={sp.x-5*sp.s} y1={sp.y} x2={sp.x+5*sp.s} y2={sp.y} stroke="#c5e1a5" strokeWidth="1.2" strokeLinecap="round"/>
          </g>
        ))}
      </svg>
      <style>{`@keyframes sparkle{0%,100%{opacity:0;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

/* ── Password strength ── */
function PasswordStrength({ password }) {
  const checks = [
    { label:"8+ chars",  pass: password.length >= 8          },
    { label:"Uppercase", pass: /[A-Z]/.test(password)        },
    { label:"Number",    pass: /\d/.test(password)           },
    { label:"Symbol",    pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score  = checks.filter(c => c.pass).length;
  const bars   = ["#e57373","#ffb74d","#fff176","#aed581"];
  const labels = ["Weak","Fair","Good","Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop:9 }}>
      <div style={{ display:"flex", gap:4, marginBottom:6 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex:1, height:2.5, borderRadius:3,
            background: i < score ? bars[score-1] : "rgba(70,50,30,.12)",
            transition:"background .35s",
          }}/>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'Lora',serif", fontSize:10.5, fontStyle:"italic", color: score>0 ? bars[score-1] : "#b8a898", fontWeight:600 }}>
          {labels[score-1] || "Weak"}
        </span>
        <div style={{ display:"flex", gap:10 }}>
          {checks.map(c=>(
            <span key={c.label} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9.5, color:c.pass?"#558b2f":"#c9bdb0", fontWeight:500, display:"flex", alignItems:"center", gap:2.5, transition:"color .3s" }}>
              <span style={{ fontSize:8 }}>{c.pass?"●":"○"}</span>{c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function Register() {
  const navigate = useNavigate();

  const [step,          setStep]          = useState(1);
  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [emailOk,       setEmailOk]       = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [password,      setPassword]      = useState("");
  const [confirm,       setConfirm]       = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [country,       setCountry]       = useState("");
  const [userRole,      setUserRole]      = useState("");
  const [bio,           setBio]           = useState("");
  const [interests,     setInterests]     = useState([]);
  const [agreed,        setAgreed]        = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);

  const emailTimer = useRef(null);

  useEffect(()=>{
    clearTimeout(emailTimer.current);
    if(!email||!email.includes("@")){setEmailOk(null);return;}
    setCheckingEmail(true);
    emailTimer.current=setTimeout(async()=>{
      try{ const {available}=await REGISTER_API.checkEmail(email); setEmailOk(available); }
      finally{ setCheckingEmail(false); }
    },620);
  },[email]);

  const toggleInterest = l => setInterests(p=>p.includes(l)?p.filter(i=>i!==l):[...p,l]);

  const canStep1 = name.trim().length>=2 && emailOk===true && password.length>=8 && confirm===password;
  const canStep2 = country!=="";
  const canStep3 = interests.length>=1 && agreed;

  const handleSubmit = async()=>{
    if(!canStep3){setError("Select at least one interest and agree to the terms.");return;}
    setLoading(true); setError("");
    try{
      const data = await REGISTER_API.register({name,email,password,country,bio,interests});
      localStorage.setItem("hv_token",data.token);
      localStorage.setItem("hv_user", JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(()=>navigate("/"),2600);
    }catch(e){setError(e.message);}
    finally{setLoading(false);}
  };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>

      {/* ══════════ GLOBAL STYLES ══════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        .pf { font-family:'Playfair Display',serif; }
        .lr { font-family:'Lora',serif; }
        .dm { font-family:'DM Sans',sans-serif; }

        /* ── paper texture bg ── */
        body { background:#f5efe6; }

        /* ── input ── */
        .inp {
          width:100%; padding:13px 18px 13px 44px;
          background:#fffef9;
          border:1.5px solid rgba(139,106,69,.2);
          border-radius:10px; outline:none;
          font-family:'DM Sans',sans-serif; font-size:14px; color:#2c1a0e;
          transition:all .28s;
          box-shadow: inset 0 1px 3px rgba(0,0,0,.04);
        }
        .inp:focus {
          border-color:rgba(85,139,47,.6);
          background:#fff;
          box-shadow: inset 0 1px 3px rgba(0,0,0,.04), 0 0 0 3.5px rgba(85,139,47,.1);
        }
        .inp::placeholder { color:#c5b8aa; }
        .inp.err { border-color:rgba(198,40,40,.4); background:rgba(255,245,245,.97); }
        .inp.ok  { border-color:rgba(85,139,47,.55); }
        .no-icon { padding-left:16px; }

        .iw { position:relative; display:flex; align-items:center; }
        .ii { position:absolute; left:13px; font-size:14px; pointer-events:none; opacity:.5; }
        .ie { position:absolute; right:13px; }

        /* ── label ── */
        .lbl {
          display:block;
          font-family:'Lora',serif; font-style:italic;
          font-size:12px; font-weight:400; color:#7a5c3a;
          letter-spacing:.04em; margin-bottom:7px;
        }

        /* ── select ── */
        .sel {
          width:100%; padding:13px 16px;
          background:#fffef9; border:1.5px solid rgba(139,106,69,.2);
          border-radius:10px; outline:none;
          font-family:'DM Sans',sans-serif; font-size:14px; color:#2c1a0e;
          appearance:none; cursor:pointer; transition:all .28s;
          box-shadow:inset 0 1px 3px rgba(0,0,0,.04);
        }
        .sel:focus { border-color:rgba(85,139,47,.6); box-shadow:inset 0 1px 3px rgba(0,0,0,.04), 0 0 0 3.5px rgba(85,139,47,.1); }
        .sel option { background:#fff; color:#2c1a0e; }

        /* ── primary btn ── */
        .btn-primary {
          width:100%; padding:14.5px 20px; border-radius:10px; border:none;
          background:linear-gradient(135deg,#33691e 0%,#558b2f 60%,#7cb342 100%);
          color:#fff; cursor:pointer;
          font-family:'Playfair Display',serif; font-size:15px;
          font-weight:700; letter-spacing:.06em;
          display:flex; align-items:center; justify-content:center; gap:9px;
          transition:all .3s; position:relative; overflow:hidden;
          box-shadow:0 5px 20px rgba(85,139,47,.32), 0 1px 0 rgba(255,255,255,.18) inset;
        }
        .btn-primary::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(180deg,rgba(255,255,255,.1),transparent);
          pointer-events:none;
        }
        .btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 9px 28px rgba(85,139,47,.42); filter:brightness(1.06); }
        .btn-primary:active:not(:disabled){ transform:translateY(0); }
        .btn-primary:disabled { opacity:.5; cursor:not-allowed; }

        /* ── ghost btn ── */
        .btn-ghost {
          flex:1; padding:13px; border-radius:10px;
          background:transparent; border:1.5px solid rgba(139,106,69,.28);
          color:#7a5c3a; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500;
          transition:all .28s;
        }
        .btn-ghost:hover { background:rgba(139,106,69,.06); border-color:rgba(139,106,69,.5); color:#4a3520; }

        /* ── interest chip ── */
        .chip {
          padding:9px 16px; border-radius:50px; cursor:pointer;
          border:1.5px solid rgba(139,106,69,.2);
          font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:500;
          transition:all .22s; display:flex; align-items:center; gap:6px;
          background:#fffef9; color:#5a3e28;
        }
        .chip:hover { border-color:rgba(85,139,47,.45); background:rgba(85,139,47,.05); color:#2e5a14; }
        .chip.on {
          background:linear-gradient(135deg,#33691e,#558b2f);
          color:#fff; border-color:transparent;
          box-shadow:0 3px 12px rgba(85,139,47,.28);
        }

        /* ── role button ── */
        .role-btn {
          flex:1; padding:11px 6px; border-radius:10px;
          border:1.5px solid rgba(139,106,69,.18);
          background:#fffef9; color:#7a5c3a; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
          transition:all .22s; display:flex; flex-direction:column;
          align-items:center; gap:5px;
        }
        .role-btn:hover { border-color:rgba(85,139,47,.45); background:rgba(85,139,47,.05); color:#2e5a14; }
        .role-btn.on { background:linear-gradient(135deg,#33691e,#558b2f); color:#fff; border-color:transparent; box-shadow:0 3px 10px rgba(85,139,47,.25); }

        /* ── checkbox ── */
        .cb {
          width:19px; height:19px; border-radius:5px; flex-shrink:0;
          border:1.5px solid rgba(139,106,69,.3); background:#fffef9;
          display:flex; align-items:center; justify-content:center;
          transition:all .22s; cursor:pointer;
        }
        .cb.on { background:linear-gradient(135deg,#33691e,#7cb342); border-color:transparent; box-shadow:0 2px 8px rgba(85,139,47,.3); }

        /* ── step line ── */
        .sline { flex:1; height:1.5px; margin-bottom:20px; transition:background .4s; }

        /* ── spinner ── */
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{ width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;animation:spin .65s linear infinite; }

        /* ── entrance animations ── */
        @keyframes riseIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .rise { animation:riseIn .55s cubic-bezier(.23,1,.32,1) both; }

        @keyframes slideStep { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        .ss { animation:slideStep .38s cubic-bezier(.23,1,.32,1) both; }

        /* ── success ── */
        @keyframes popIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes ringOut{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.65);opacity:0}}
        @keyframes prog{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}

        /* ── scrollbar ── */
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#d4bfa0;border-radius:3px}

        /* ── decorative ruled lines on form card ── */
        .ruled {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 27px,
            rgba(139,106,69,.06) 27px,
            rgba(139,106,69,.06) 28px
          );
        }
      `}</style>

      {/* ════ FULL PARCHMENT BACKGROUND ════ */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        background:"linear-gradient(160deg,#f8f1e7 0%,#f2e9d8 35%,#ede0c9 65%,#f4ede0 100%)",
      }}/>

      {/* subtle noise grain */}
      <svg style={{ position:"fixed", inset:0, zIndex:0, opacity:.028, pointerEvents:"none", width:"100%", height:"100%" }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#grain)"/>
      </svg>

      {/* decorative botanical corner — top left */}
      <svg style={{ position:"fixed", top:-10, left:-10, zIndex:0, opacity:.09, pointerEvents:"none", width:340, height:340 }} viewBox="0 0 340 340" fill="none">
        <path d="M0 170 Q60 80 140 60 Q80 100 60 170 Q80 140 120 130 Q70 165 80 220 Q100 180 150 175" stroke="#3d6b1a" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M0 210 Q40 140 100 110 Q50 150 40 210" stroke="#5a8a2e" strokeWidth=".9" strokeLinecap="round"/>
        <path d="M60 0 Q100 60 80 140 Q95 80 130 70 Q110 100 100 160" stroke="#3d6b1a" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M30 0 Q60 40 50 110" stroke="#7cb342" strokeWidth=".8" strokeLinecap="round"/>
        {[[22,180],[90,85],[145,168],[78,50]].map(([x,y],i)=>(
          <g key={i}><ellipse cx={x} cy={y} rx="4" ry="2.5" fill="#558b2f" opacity=".5" transform={`rotate(${i*45},${x},${y})`}/></g>
        ))}
      </svg>

      {/* decorative botanical corner — bottom right */}
      <svg style={{ position:"fixed", bottom:-10, right:-10, zIndex:0, opacity:.08, pointerEvents:"none", width:300, height:300 }} viewBox="0 0 300 300" fill="none">
        <path d="M300 130 Q240 200 160 220 Q220 185 240 130 Q220 160 180 170 Q230 140 220 90" stroke="#3d6b1a" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M300 80 Q260 150 200 180 Q250 145 270 90" stroke="#5a8a2e" strokeWidth=".9" strokeLinecap="round"/>
        <path d="M240 300 Q200 240 220 160" stroke="#558b2f" strokeWidth="1" strokeLinecap="round"/>
      </svg>

      {/* thin horizontal rule across top */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:1, height:3, background:"linear-gradient(90deg,#33691e,#7cb342,#c5e1a5,#7cb342,#33691e)" }}/>

      {/* ════ MAIN LAYOUT ════ */}
      <div style={{ position:"relative", zIndex:2, minHeight:"100vh", display:"flex" }}>

        {/* ── LEFT EDITORIAL PANEL ── */}
        <div className="rise" style={{ width:380, flexShrink:0, padding:"56px 44px 48px 48px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>

          {/* logo */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:52 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#7cb342,#33691e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 14px rgba(85,139,47,.3)" }}>🌿</div>
              <div>
                <span className="pf" style={{ fontSize:20, fontWeight:700, color:"#1a3309", letterSpacing:".02em" }}>Horti<span style={{ color:"#558b2f" }}>Verse</span></span>
                <div className="dm" style={{ fontSize:8.5, letterSpacing:".18em", color:"#a08060", marginTop:1 }}>THE GROWER'S COMMUNITY</div>
              </div>
            </div>

            {/* headline */}
            <h2 className="pf" style={{ fontSize:"clamp(34px,3.5vw,50px)", fontWeight:900, color:"#1a3309", lineHeight:1.04, marginBottom:10 }}>
              Cultivate your<br />
              <span style={{ fontStyle:"italic", color:"#558b2f" }}>knowledge.</span>
            </h2>
            <p className="lr" style={{ fontSize:14, color:"#7a5c3a", lineHeight:1.85, fontWeight:400, fontStyle:"italic", marginBottom:36, maxWidth:280 }}>
              A community of 48,000 growers,<br />researchers & farmers in 45 countries.
            </p>

            {/* seedling illustration */}
            <SeedlingGrow step={step} />

            {/* step progress label */}
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <span className="lr" style={{ fontSize:11.5, fontStyle:"italic", color:"#a08060" }}>
                {step===1 && "Plant the seed — create your login"}
                {step===2 && "Nurture it — tell us about yourself"}
                {step===3 && "Let it grow — choose your interests"}
              </span>
            </div>

            {/* divider */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(139,106,69,.3),rgba(139,106,69,.08))" }}/>
              <span style={{ fontSize:12 }}>🌱</span>
              <div style={{ flex:1, height:1, background:"linear-gradient(270deg,rgba(139,106,69,.3),rgba(139,106,69,.08))" }}/>
            </div>

            {/* perks */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { n:"1,200+", text:"Stories & resources",    icon:"📚" },
                { n:"45+",    text:"Countries represented",  icon:"🌍" },
                { n:"Free",   text:"Open access. Always.",   icon:"🔓" },
              ].map((p,i)=>(
                <div key={p.text} style={{ display:"flex", alignItems:"center", gap:12, animation:`riseIn .6s ease ${.2+i*.07}s both` }}>
                  <div style={{ fontSize:14 }}>{p.icon}</div>
                  <span className="pf" style={{ fontSize:14, fontWeight:700, color:"#2e5a14", marginRight:4 }}>{p.n}</span>
                  <span className="dm" style={{ fontSize:12, color:"#a08060", fontWeight:400 }}>{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* issue / volume tag at bottom */}
          <div style={{ borderTop:"1px solid rgba(139,106,69,.2)", paddingTop:18, marginTop:24 }}>
            <span className="dm" style={{ fontSize:9.5, letterSpacing:".14em", color:"#b8a898", textTransform:"uppercase" }}>
              Vol. I — Issue 1 · HortiVerse Community
            </span>
          </div>
        </div>

        {/* ── VERTICAL DIVIDER ── */}
        <div style={{ width:1, background:"linear-gradient(180deg,transparent,rgba(139,106,69,.25) 20%,rgba(139,106,69,.25) 80%,transparent)", flexShrink:0 }}/>

        {/* ── RIGHT FORM COLUMN ── */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 60px", overflowY:"auto" }}>

          {/* form card */}
          <div className="rise ruled" style={{
            width:"100%", maxWidth:490,
            background:"rgba(255,252,245,.88)",
            borderRadius:18,
            border:"1px solid rgba(139,106,69,.18)",
            boxShadow:"0 2px 0 rgba(255,255,255,.9) inset, 0 24px 64px rgba(80,50,20,.1), 0 4px 16px rgba(80,50,20,.06)",
            padding:"40px 44px",
            backdropFilter:"blur(12px)",
          }}>

            {/* ══ SUCCESS ══ */}
            {success ? (
              <div style={{ textAlign:"center", padding:"28px 0", animation:"popIn .5s ease" }}>
                <div style={{ position:"relative", display:"inline-flex", marginBottom:22 }}>
                  <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:"2px solid #7cb342", animation:"ringOut .9s ease-out infinite" }}/>
                  <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#558b2f,#33691e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, boxShadow:"0 6px 22px rgba(85,139,47,.35)" }}>🌿</div>
                </div>
                <h3 className="pf" style={{ fontSize:30, color:"#1a3309", marginBottom:9, fontWeight:700, fontStyle:"italic" }}>Welcome to HortiVerse.</h3>
                <p className="lr" style={{ fontSize:13.5, color:"#8a6a4a", fontStyle:"italic", marginBottom:22, lineHeight:1.7 }}>Your account is ready. Taking you home…</p>
                <div style={{ height:2.5, borderRadius:2, background:"rgba(85,139,47,.12)", overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#33691e,#7cb342)", animation:"prog 2.6s linear forwards" }}/>
                </div>
              </div>
            ) : (
              <>
                {/* ── form header ── */}
                <div style={{ marginBottom:26 }}>
                  <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:5 }}>
                    <h1 className="pf" style={{ fontSize:"clamp(24px,2.5vw,32px)", fontWeight:900, color:"#1a3309", lineHeight:1.1 }}>
                      {step===1 && <>Create your <em style={{ color:"#558b2f" }}>account</em></>}
                      {step===2 && <>Your <em style={{ color:"#558b2f" }}>profile</em></>}
                      {step===3 && <>Your <em style={{ color:"#558b2f" }}>interests</em></>}
                    </h1>
                    <Link to="/login" className="lr" style={{ fontSize:12, color:"#7cb342", textDecoration:"none", fontStyle:"italic", fontWeight:500, flexShrink:0 }}>
                      Sign in →
                    </Link>
                  </div>
                  <p className="dm" style={{ fontSize:12.5, color:"#a08060", fontWeight:300 }}>
                    {step===1 && "Set up your login credentials."}
                    {step===2 && "A little about yourself."}
                    {step===3 && "Pick topics that matter to you."}
                  </p>
                </div>

                {/* ── step indicator ── */}
                <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
                  {["Account","Profile","Interests"].map((label,i)=>{
                    const n=i+1, done=step>n, active=step===n;
                    return (
                      <div key={label} style={{ display:"flex", alignItems:"center", flex:i<2?1:"none" }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                          <div style={{
                            width:28, height:28, borderRadius:"50%",
                            border:`1.5px solid ${done||active?"#558b2f":"rgba(139,106,69,.25)"}`,
                            background: done?"linear-gradient(135deg,#558b2f,#33691e)":active?"rgba(85,139,47,.1)":"rgba(255,252,245,.8)",
                            color: done?"#fff":active?"#33691e":"#c5b8aa",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontFamily:"'Playfair Display',serif", fontSize:11, fontWeight:700,
                            transition:"all .4s",
                            boxShadow: active?"0 0 0 3px rgba(85,139,47,.15)":"none",
                          }}>
                            {done?"✓":n}
                          </div>
                          <span className="dm" style={{ fontSize:9, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color:active?"#558b2f":"#c5b8aa" }}>{label}</span>
                        </div>
                        {i<2 && <div className="sline" style={{ background:step>n?"linear-gradient(90deg,#7cb342,rgba(124,179,66,.3))":"rgba(139,106,69,.15)" }}/>}
                      </div>
                    );
                  })}
                </div>

                {/* error banner */}
                {error && (
                  <div className="dm" style={{ fontSize:13, color:"#c62828", background:"rgba(198,40,40,.06)", border:"1px solid rgba(198,40,40,.18)", borderRadius:8, padding:"10px 13px", marginBottom:18, display:"flex", gap:8, alignItems:"center", lineHeight:1.5 }}>
                    <span>⚠</span>{error}
                  </div>
                )}

                {/* ══ STEP 1 ══ */}
                {step===1 && (
                  <div className="ss" style={{ display:"flex", flexDirection:"column", gap:15 }}>
                    <div>
                      <label className="lbl">Full Name</label>
                      <div className="iw">
                        <span className="ii">👤</span>
                        <input className="inp" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
                      </div>
                    </div>

                    <div>
                      <label className="lbl">Email Address</label>
                      <div className="iw">
                        <span className="ii">✉️</span>
                        <input className={`inp ${emailOk===false?"err":emailOk===true?"ok":""}`}
                          type="email" placeholder="you@example.com"
                          value={email} onChange={e=>setEmail(e.target.value)}/>
                        <div className="ie" style={{ fontSize:13 }}>
                          {checkingEmail
                            ? <div style={{ width:14,height:14,borderRadius:"50%",border:"2px solid rgba(85,139,47,.25)",borderTopColor:"#558b2f",animation:"spin .65s linear infinite" }}/>
                            : emailOk===true  ? <span style={{ color:"#558b2f" }}>✓</span>
                            : emailOk===false ? <span style={{ color:"#c62828" }}>✗</span>
                            : null}
                        </div>
                      </div>
                      {emailOk===false && <p className="dm" style={{ fontSize:11, color:"#c62828", marginTop:4 }}>This email is already registered.</p>}
                    </div>

                    <div>
                      <label className="lbl">Password</label>
                      <div className="iw">
                        <span className="ii">🔒</span>
                        <input className="inp" type={showPass?"text":"password"}
                          placeholder="Create a strong password" value={password}
                          onChange={e=>setPassword(e.target.value)} style={{ paddingRight:44 }}/>
                        <button className="ie" onClick={()=>setShowPass(p=>!p)}
                          style={{ background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#c5b8aa",padding:4,transition:"color .2s" }}
                          onMouseEnter={e=>e.target.style.color="#558b2f"}
                          onMouseLeave={e=>e.target.style.color="#c5b8aa"}>
                          {showPass?"🙈":"👁️"}
                        </button>
                      </div>
                      <PasswordStrength password={password}/>
                    </div>

                    <div>
                      <label className="lbl">Confirm Password</label>
                      <div className="iw">
                        <span className="ii">🔒</span>
                        <input className={`inp ${confirm&&confirm!==password?"err":confirm&&confirm===password?"ok":""}`}
                          type={showPass?"text":"password"} placeholder="Repeat your password"
                          value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                        {confirm && <div className="ie" style={{ fontSize:13 }}>
                          {confirm===password?<span style={{color:"#558b2f"}}>✓</span>:<span style={{color:"#c62828"}}>✗</span>}
                        </div>}
                      </div>
                      {confirm&&confirm!==password && <p className="dm" style={{ fontSize:11, color:"#c62828", marginTop:4 }}>Passwords do not match.</p>}
                    </div>

                    <button className="btn-primary" style={{ marginTop:6 }} disabled={!canStep1} onClick={()=>{setError("");setStep(2);}}>
                      Continue — Profile
                    </button>

                    <p className="dm" style={{ fontSize:11, color:"#c5b8aa", textAlign:"center", fontWeight:300 }}>
                      Free forever · No credit card required
                    </p>
                  </div>
                )}

                {/* ══ STEP 2 ══ */}
                {step===2 && (
                  <div className="ss" style={{ display:"flex", flexDirection:"column", gap:15 }}>
                    <div>
                      <label className="lbl">Country</label>
                      <div style={{ position:"relative" }}>
                        <select className="sel" value={country} onChange={e=>setCountry(e.target.value)}>
                          <option value="">Select your country…</option>
                          {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                        <span style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"#c5b8aa",pointerEvents:"none",fontSize:11 }}>▾</span>
                      </div>
                    </div>

                    <div>
                      <label className="lbl">I am a…</label>
                      <div style={{ display:"flex", gap:8 }}>
                        {[
                          {val:"student",    icon:"🎓",label:"Student"},
                          {val:"farmer",     icon:"🌾",label:"Farmer"},
                          {val:"educator",   icon:"📖",label:"Educator"},
                          {val:"researcher", icon:"🔬",label:"Researcher"},
                        ].map(r=>(
                          <button key={r.val} className={`role-btn ${userRole===r.val?"on":""}`} onClick={()=>setUserRole(r.val)}>
                            <span style={{ fontSize:18 }}>{r.icon}</span>
                            <span>{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="lbl">Bio <span style={{ fontStyle:"normal", color:"#c5b8aa", fontSize:11 }}>(optional)</span></label>
                      <textarea className="inp no-icon" placeholder="Tell the community a little about yourself…"
                        rows={3} style={{ resize:"vertical", lineHeight:1.75 }}
                        value={bio} onChange={e=>setBio(e.target.value)}/>
                    </div>

                    <div style={{ display:"flex", gap:10, marginTop:4 }}>
                      <button className="btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                      <button className="btn-primary" style={{ flex:2 }} disabled={!canStep2} onClick={()=>{setError("");setStep(3);}}>
                        Continue — Interests
                      </button>
                    </div>
                  </div>
                )}

                {/* ══ STEP 3 ══ */}
                {step===3 && (
                  <div className="ss" style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    <div>
                      <label className="lbl" style={{ marginBottom:11 }}>
                        Pick your interests <span style={{ fontStyle:"normal", color:"#c5b8aa", fontSize:11 }}>(at least one)</span>
                      </label>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                        {INTERESTS.map(({icon,label})=>(
                          <button key={label} className={`chip ${interests.includes(label)?"on":""}`} onClick={()=>toggleInterest(label)}>
                            <span style={{ fontSize:13 }}>{icon}</span>{label}
                          </button>
                        ))}
                      </div>
                      {interests.length>0 && (
                        <p className="lr" style={{ fontSize:12, color:"#558b2f", fontStyle:"italic", marginTop:10 }}>
                          ✓ {interests.length} interest{interests.length>1?"s":""} selected
                        </p>
                      )}
                    </div>

                    {/* terms */}
                    <div style={{ display:"flex",alignItems:"flex-start",gap:11,background:"rgba(85,139,47,.05)",borderRadius:10,padding:"13px 15px",border:"1px solid rgba(85,139,47,.14)",cursor:"pointer" }}
                      onClick={()=>setAgreed(a=>!a)}>
                      <div className={`cb ${agreed?"on":""}`} style={{ marginTop:1 }}>
                        {agreed && <span style={{ color:"#fff",fontSize:11,fontWeight:900 }}>✓</span>}
                      </div>
                      <p className="dm" style={{ fontSize:12.5,color:"#7a5c3a",lineHeight:1.75,fontWeight:300 }}>
                        I agree to HortiVerse's{" "}
                        <span style={{ color:"#558b2f",fontWeight:600 }}>Terms of Service</span>{" "}
                        and <span style={{ color:"#558b2f",fontWeight:600 }}>Privacy Policy</span>.
                        I'm at least 16 years old.
                      </p>
                    </div>

                    <div style={{ display:"flex", gap:10 }}>
                      <button className="btn-ghost" onClick={()=>setStep(2)}>← Back</button>
                      <button className="btn-primary" style={{ flex:2 }} disabled={!canStep3||loading} onClick={handleSubmit}>
                        {loading?<><div className="spin"/>Creating account…</>:<>🌿 Create Free Account</>}
                      </button>
                    </div>

                    <p className="lr" style={{ fontSize:11.5, color:"#c5b8aa", textAlign:"center", lineHeight:1.7, fontStyle:"italic" }}>
                      Free forever. No credit card required. Unsubscribe anytime.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}