import { API_BASE_URL } from '../apiConfig';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🟢 REAL DATABASE CALL
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }

      // Save user to browser storage so the site "remembers" they are logged in
      localStorage.setItem("hv_user", JSON.stringify(data.user));
      
      // Send them to the Home page and refresh to update the Navbar
      navigate("/");
      window.location.reload(); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const accent = "#2A9D8F"; // teal matches register page

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700;14..32,800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: 'Inter', sans-serif; }

        /* === CLAYMORPHISM BACKGROUND === */
        .clay-bg { position: fixed; inset: 0; background: #0cad9d; overflow: hidden; }

        .orb { position: absolute; width: 60vmax; height: 60vmax; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.4), rgba(42, 157, 143, 0.2)); filter: blur(80px); animation: orbMove 25s infinite alternate ease-in-out; }
        .orb2 { width: 70vmax; height: 70vmax; background: radial-gradient(circle at 70% 70%, rgba(42, 157, 143, 0.35), rgba(157, 78, 221, 0.2)); animation: orbMove2 30s infinite alternate-reverse; }

        @keyframes orbMove { 0% { transform: translate(-20%, -20%) scale(1); } 100% { transform: translate(10%, 10%) scale(1.2); } }
        @keyframes orbMove2 { 0% { transform: translate(20%, 20%) scale(1); } 100% { transform: translate(-10%, -10%) scale(1.3); } }

        .grain { position: absolute; inset: 0; background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNDUiIC8+PC9zdmc+'); opacity: 0.2; pointer-events: none; }

        /* === MAIN CARD === */
        .clay-card { position: relative; width: min(420px, 92%); background: rgba(20, 30, 40, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 40px; padding: 2rem 2rem; box-shadow: 0 30px 50px -20px rgba(0,0,0,0.6), inset 0 -6px 8px rgba(255,255,255,0.06), inset 0 6px 8px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); z-index: 10; animation: fadeIn 0.5s ease; }

        /* === INPUTS === */
        .input-group { margin-bottom: 1.2rem; }
        .input-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem; }
        .input-wrapper { position: relative; background: rgba(15, 25, 35, 0.7); border-radius: 28px; box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(255,255,255,0.02); transition: box-shadow 0.2s ease; }
        .input-wrapper:focus-within { box-shadow: inset 0 4px 8px rgba(0,0,0,0.5), 0 0 0 3px ${accent}40; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1rem; opacity: 0.5; pointer-events: none; }
        .input-field { width: 100%; background: transparent; border: none; padding: 14px 16px 14px 46px; font-size: 0.95rem; color: white; outline: none; border-radius: 28px; }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }

        .password-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1rem; cursor: pointer; color: rgba(255,255,255,0.4); transition: color 0.2s; }
        .password-toggle:hover { color: ${accent}; }

        /* === BUTTONS === */
        .btn-primary { width: 100%; padding: 14px 16px; margin-top: 0.5rem; border: none; border-radius: 36px; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; justify-content: center; gap: 8px; background: ${accent}; color: white; box-shadow: 0 12px 20px -10px rgba(0,0,0,0.6), inset 0 -3px 0 rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4); }
        .btn-primary:active { transform: translateY(2px); box-shadow: 0 8px 15px -5px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .error-msg { background: rgba(242, 132, 130, 0.15); border-radius: 24px; padding: 10px 14px; font-size: 0.85rem; color: #f28482; display: flex; align-items: center; gap: 8px; margin-bottom: 1.2rem; border: 1px solid rgba(242, 132, 130, 0.3); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .center-wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: hidden; }
      `}</style>

      <div className="clay-bg">
        <div className="orb"></div>
        <div className="orb orb2"></div>
        <div className="grain"></div>
      </div>

      <div className="center-wrapper">
        <form onSubmit={handleSubmit} className="clay-card">
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>🌱</span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
                Horti<span style={{ color: accent }}>Verse</span>
              </span>
            </div>
          </div>

          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 600, lineHeight: 1.2 }}>
            Welcome <span style={{ color: accent }}>back</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: '1.5rem' }}>
            Sign in to continue your green journey.
          </p>

          {/* Error Message */}
          {error && (
            <div className="error-msg">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Email Input */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textDecoration: 'none' }}>Forgot?</Link>
            </div>
            <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
              <span className="input-icon">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 46 }}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <><div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', animation:'spin .65s linear infinite' }} /> Signing in…</>
            ) : (
              <>Sign In 🌿</>
            )}
          </button>

          {/* Footer Link */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>

        </form>
      </div>
    </>
  );
}