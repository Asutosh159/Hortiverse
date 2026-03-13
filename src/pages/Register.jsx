import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ══════════════════════════════════════════════════════════
   LIVE BACKEND API LAYER (Connected to SQLite)
══════════════════════════════════════════════════════════ */
const REGISTER_API = {
  async checkEmail(email) {
    // Simulating a quick network check for the UI green checkmark.
    // The actual database will definitively catch duplicates on final submit.
    await new Promise(r => setTimeout(r, 520));
    return { available: true };
  },
  async register({ name, email, password }) {
    // 🟢 REAL DATABASE CALL
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        full_name: name, // Mapping frontend 'name' to backend 'full_name'
        email: email, 
        password: password 
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Registration failed. Please try again.");
    }
    
    return data;
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

/* ── Password strength (restyled for clay) ── */
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
            background: i < score ? bars[score-1] : "rgba(255,255,255,.12)",
            transition:"background .35s",
          }}/>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'Inter',serif", fontSize:10.5, fontStyle:"italic", color: score>0 ? bars[score-1] : "#aaa", fontWeight:600 }}>
          {labels[score-1] || "Weak"}
        </span>
        <div style={{ display:"flex", gap:10 }}>
          {checks.map(c=>(
            <span key={c.label} style={{ fontFamily:"'Inter',sans-serif", fontSize:9.5, color:c.pass?"#aed581":"#888", fontWeight:500, display:"flex", alignItems:"center", gap:2.5, transition:"color .3s" }}>
              <span style={{ fontSize:8 }}>{c.pass?"●":"○"}</span>{c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN — compact claymorphism register
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
      await REGISTER_API.register({name, email, password});
      setSuccess(true);
      // Once successfully registered, send them to login page
      setTimeout(()=>navigate("/login"), 2600);
    }catch(e){
      setError(e.message);
      // If the email is taken, kick them back to step 1 to fix it
      if (e.message.toLowerCase().includes("email")) {
        setStep(1);
        setEmailOk(false);
      }
    }
    finally{setLoading(false);}
  };

  const accent = "#2A9D8F"; 

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700;14..32,800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: 'Inter', sans-serif; }

        .clay-bg { position: fixed; inset: 0; background: #0cad9d; overflow: hidden; }

        .orb { position: absolute; width: 60vmax; height: 60vmax; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.4), rgba(42, 157, 143, 0.2)); filter: blur(80px); animation: orbMove 25s infinite alternate ease-in-out; }
        .orb2 { width: 70vmax; height: 70vmax; background: radial-gradient(circle at 70% 70%, rgba(42, 157, 143, 0.35), rgba(157, 78, 221, 0.2)); animation: orbMove2 30s infinite alternate-reverse; }

        @keyframes orbMove { 0% { transform: translate(-20%, -20%) scale(1); } 100% { transform: translate(10%, 10%) scale(1.2); } }
        @keyframes orbMove2 { 0% { transform: translate(20%, 20%) scale(1); } 100% { transform: translate(-10%, -10%) scale(1.3); } }

        .grain { position: absolute; inset: 0; background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNDUiIC8+PC9zdmc+'); opacity: 0.2; pointer-events: none; }

        .clay-card { position: relative; width: min(480px, 92%); background: rgba(20, 30, 40, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 40px; padding: 1.5rem 1.5rem; box-shadow: 0 30px 50px -20px rgba(0,0,0,0.6), inset 0 -6px 8px rgba(255,255,255,0.06), inset 0 6px 8px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); z-index: 10; }

        .input-group { margin-bottom: 0.9rem; }
        .input-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 0.3rem; }
        .input-wrapper { position: relative; background: rgba(15, 25, 35, 0.7); border-radius: 28px; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02); transition: box-shadow 0.2s ease; }
        .input-wrapper:focus-within { box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 0 0 3px ${accent}40; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 0.95rem; opacity: 0.5; pointer-events: none; }
        .input-field { width: 100%; background: transparent; border: none; padding: 12px 16px 12px 44px; font-size: 0.9rem; color: white; outline: none; border-radius: 28px; }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .input-field.error { box-shadow: inset 0 0 0 2px #f28482; }

        .password-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 0.95rem; cursor: pointer; color: rgba(255,255,255,0.4); transition: color 0.2s; }
        .password-toggle:hover { color: ${accent}; }

        .clay-select { width: 100%; background: rgba(15, 25, 35, 0.7); border: none; border-radius: 28px; padding: 12px 16px; font-size: 0.9rem; color: white; outline: none; appearance: none; cursor: pointer; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02); transition: box-shadow 0.2s; }
        .clay-select:focus { box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 0 0 3px ${accent}40; }
        .clay-select option { background: #1a2a35; color: white; }

        .role-grid { display: flex; gap: 6px; flex-wrap: wrap; }
        .role-btn { flex: 1 0 calc(50% - 3px); background: rgba(15, 25, 35, 0.7); border: none; border-radius: 28px; padding: 8px 4px; color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02); display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .role-btn.on { background: ${accent}; color: white; box-shadow: 0 8px 16px -8px ${accent}80, inset 0 2px 4px rgba(255,255,255,0.3); }
        .role-btn:hover { background: rgba(25, 35, 45, 0.9); color: white; }

        .chips-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip { background: rgba(15, 25, 35, 0.7); border: none; border-radius: 36px; padding: 8px 14px; color: rgba(255,255,255,0.6); font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02); display: flex; align-items: center; gap: 4px; }
        .chip.on { background: ${accent}; color: white; box-shadow: 0 8px 16px -8px ${accent}80, inset 0 2px 4px rgba(255,255,255,0.3); }
        .chip:hover { background: rgba(25, 35, 45, 0.9); color: white; }

        .btn-primary, .btn-ghost { padding: 12px 16px; border: none; border-radius: 36px; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-primary { background: ${accent}; color: white; box-shadow: 0 12px 20px -10px rgba(0,0,0,0.6), inset 0 -3px 0 rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4); }
        .btn-primary:active { transform: translateY(2px); box-shadow: 0 8px 15px -5px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-ghost { background: rgba(15, 25, 35, 0.7); color: white; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02); }
        .btn-ghost:hover { background: rgba(25, 35, 45, 0.9); }

        .error-msg { background: rgba(242, 132, 130, 0.15); border-radius: 24px; padding: 8px 12px; font-size: 0.8rem; color: #f28482; display: flex; align-items: center; gap: 8px; margin: 0.5rem 0; border: 1px solid rgba(242, 132, 130, 0.3); }

        .step-indicator { display: flex; align-items: center; margin: 1rem 0 1.2rem; }
        .step-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .step-circle { width: 28px; height: 28px; border-radius: 50%; background: rgba(15, 25, 35, 0.7); border: 2px solid transparent; color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5); transition: all 0.3s; }
        .step-circle.active { border-color: ${accent}; color: ${accent}; box-shadow: 0 0 0 3px ${accent}30; }
        .step-circle.done { background: ${accent}; color: white; box-shadow: 0 8px 16px -8px ${accent}80; }
        .step-label { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.4); }
        .step-label.active { color: ${accent}; }
        .step-line { flex: 1; height: 2px; background: rgba(255,255,255,0.1); margin: 0 4px 16px; }

        .success-container { text-align: center; padding: 0.5rem 0; }
        .success-icon { width: 70px; height: 70px; margin: 0 auto 1rem; background: ${accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.5), inset 0 -4px 0 rgba(0,0,0,0.2); animation: pop 0.4s cubic-bezier(0.3, 1.3, 0.4, 1); }
        @keyframes pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .progress-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 1rem; overflow: hidden; }
        .progress-fill { height: 100%; background: ${accent}; width: 0%; animation: progress 2.6s ease forwards; }
        @keyframes progress { to { width: 100%; } }

        .clay-checkbox { display: flex; align-items: flex-start; gap: 10px; background: rgba(15, 25, 35, 0.5); border-radius: 24px; padding: 12px 14px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: 0.2s; }
        .clay-checkbox:hover { background: rgba(25, 35, 45, 0.7); }
        .checkbox-custom { width: 18px; height: 18px; border-radius: 5px; background: rgba(15, 25, 35, 0.7); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; transition: 0.2s; }
        .checkbox-custom.checked { background: ${accent}; box-shadow: 0 4px 8px -4px ${accent}80; }

        .fade-step { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .center-wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 0.5rem; overflow: hidden; }
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
              <div className="success-icon">🌿</div>
              <h2 style={{ color: 'white', marginBottom: '0.3rem', fontWeight: 600, fontSize: '1.4rem' }}>
                Welcome to HortiVerse!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                Your account is ready. Redirecting to login...
              </p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          ) : (
            <>
              {/* header with logo and link to login */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.6rem' }}>🌱</span>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                    Horti<span style={{ color: accent }}>Verse</span>
                  </span>
                </div>
                <Link to="/login" style={{ color: accent, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in →
                </Link>
              </div>

              <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.2 }}>
                {step === 1 && <>Create your <span style={{ color: accent }}>account</span></>}
                {step === 2 && <>Your <span style={{ color: accent }}>profile</span></>}
                {step === 3 && <>Your <span style={{ color: accent }}>interests</span></>}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.1rem', marginBottom: '0.8rem' }}>
                {step === 1 && "Set up your login credentials."}
                {step === 2 && "A little about yourself."}
                {step === 3 && "Pick topics that matter to you."}
              </p>

              {/* step indicator */}
              <div className="step-indicator">
                {[1,2,3].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', width: i < 3 ? '100%' : 'auto' }}>
                    <div className="step-item">
                      <div className={`step-circle ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                        {i < step ? '✓' : i}
                      </div>
                      <span className={`step-label ${i === step ? 'active' : ''}`}>
                        {i === 1 ? 'Account' : i === 2 ? 'Profile' : 'Interests'}
                      </span>
                    </div>
                    {i < 3 && <div className="step-line" />}
                  </div>
                ))}
              </div>

              {error && (
                <div className="error-msg">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* step 1 */}
              {step === 1 && (
                <div className="fade-step">
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon">✉️</span>
                      <input
                        type="email"
                        className={`input-field ${emailOk === false ? 'error' : ''}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                        {checkingEmail ? (
                          <div style={{ width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:accent,animation:'spin .65s linear infinite' }} />
                        ) : emailOk === true ? (
                          <span style={{ color: accent }}>✓</span>
                        ) : emailOk === false ? (
                          <span style={{ color: '#f28482' }}>✗</span>
                        ) : null}
                      </div>
                    </div>
                    {emailOk === false && (
                      <p style={{ color: '#f28482', fontSize: '0.65rem', marginTop: 2 }}>Email check in progress...</p>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input-field"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: 40 }}
                      />
                      <button className="password-toggle" onClick={() => setShowPass(!showPass)}>
                        {showPass ? '👁️' : '🙈'}
                      </button>
                    </div>
                    <PasswordStrength password={password} />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className={`input-field ${confirm && confirm !== password ? 'error' : ''}`}
                        placeholder="Repeat your password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                      {confirm && (
                        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                          {confirm === password ? <span style={{ color: accent }}>✓</span> : <span style={{ color: '#f28482' }}>✗</span>}
                        </div>
                      )}
                    </div>
                    {confirm && confirm !== password && (
                      <p style={{ color: '#f28482', fontSize: '0.65rem', marginTop: 2 }}>Passwords do not match.</p>
                    )}
                  </div>

                  <button className="btn-primary" disabled={!canStep1} onClick={() => { setError(''); setStep(2); }}>
                    Continue — Profile
                  </button>
                  <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginTop: 8 }}>
                    Free forever · No credit card required
                  </p>
                </div>
              )}

              {/* step 2 */}
              {step === 2 && (
                <div className="fade-step">
                  <div className="input-group">
                    <label className="input-label">Country</label>
                    <select className="clay-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="">Select your country…</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">I am a…</label>
                    <div className="role-grid">
                      {[
                        {val:"student",    icon:"🎓", label:"Student"},
                        {val:"farmer",     icon:"🌾", label:"Farmer"},
                        {val:"educator",   icon:"📖", label:"Educator"},
                        {val:"researcher", icon:"🔬", label:"Researcher"},
                      ].map(r => (
                        <button
                          key={r.val}
                          className={`role-btn ${userRole === r.val ? 'on' : ''}`}
                          onClick={() => setUserRole(r.val)}
                        >
                          <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
                          <span>{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Bio <span style={{ color: 'rgba(255,255,255,0.3)' }}>(optional)</span></label>
                    <textarea
                      className="input-field"
                      style={{ padding: 10, resize: 'vertical', minHeight: 60 }}
                      placeholder="Tell the community a little about yourself…"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-primary" style={{ flex: 2 }} disabled={!canStep2} onClick={() => { setError(''); setStep(3); }}>
                      Continue — Interests
                    </button>
                  </div>
                </div>
              )}

              {/* step 3 */}
              {step === 3 && (
                <div className="fade-step">
                  <div className="input-group">
                    <label className="input-label">Pick your interests <span style={{ color: 'rgba(255,255,255,0.3)' }}>(at least one)</span></label>
                    <div className="chips-grid">
                      {INTERESTS.map(({icon, label}) => (
                        <button
                          key={label}
                          className={`chip ${interests.includes(label) ? 'on' : ''}`}
                          onClick={() => toggleInterest(label)}
                        >
                          <span>{icon}</span> {label}
                        </button>
                      ))}
                    </div>
                    {interests.length > 0 && (
                      <p style={{ color: accent, fontSize: '0.75rem', marginTop: 4 }}>
                        ✓ {interests.length} selected
                      </p>
                    )}
                  </div>

                  <div className="clay-checkbox" onClick={() => setAgreed(!agreed)}>
                    <div className={`checkbox-custom ${agreed ? 'checked' : ''}`}>
                      {agreed && '✓'}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                      I agree to HortiVerse's <span style={{ color: accent, fontWeight: 600 }}>Terms</span> and <span style={{ color: accent, fontWeight: 600 }}>Privacy Policy</span>. I'm at least 16.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-primary" style={{ flex: 2 }} disabled={!canStep3 || loading} onClick={handleSubmit}>
                      {loading ? (
                        <><div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',animation:'spin .65s linear infinite' }} /> Creating…</>
                      ) : (
                        <>🌿 Create Account</>
                      )}
                    </button>
                  </div>
                  <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginTop: 10 }}>
                    Free forever. No credit card required.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
} 