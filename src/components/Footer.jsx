import React from "react";
// 🟢 IMPORT YOUR LOGO HERE
import logo from '../assests/logoHV.png';

export default function Footer() {
  return (
    <footer style={{ background:"linear-gradient(180deg, #064e3b 0%, #022c22 100%)", padding:"40px 52px 20px", color: "#f8fafc", width: "100%" }}>
      
      {/* 🟢 NEW: Style block for Logo and Social Icon Hover Effects */}
      <style>{`
        .footer-logo {
          height: 50px; /* Reduced from 85px to fit compact footer */
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .footer-logo:hover {
          transform: scale(1.1);
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; /* Slightly smaller */
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .social-link:hover {
          background: #44ff05; /* Lights up with HortiVerse Green */
          color: #022c22; /* Dark icon color on hover */
          transform: translateY(-4px); /* Slight bounce up */
          box-shadow: 0 10px 15px -3px rgba(52, 211, 153, 0.3);
        }
      `}</style>

      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        {/* Reduced gap and marginBottom for compactness */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:40, marginBottom:30 }}>
          
          {/* ── LEFT COLUMN: Brand & Socials ── */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <img src={logo} alt="HortiVerse Logo" className="footer-logo" />
              <span className="fr" style={{ fontFamily: "'Fraunces', serif", fontSize:24, fontWeight:800, color:"#ffffff" }}>Horti<span style={{ color:"#34d399" }}>Verse</span></span>
            </div>
            <p className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:14, color:"#94a3b8", lineHeight:1.6, maxWidth:320, fontWeight:400 }}>
              A thriving community of horticulture students sharing knowledge and sustainable farming practices worldwide.
            </p>
            
            {/* 🟢 Social Media Icons Block */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="mailto:contact@hortiverse.com" className="social-link" title="Email Us">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="social-link" title="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
            </div>

          </div>

          {/* ── MIDDLE COLUMN: Explore ── */}
          <div>
            <h4 className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:12, letterSpacing:".15em", color:"#34d399", marginBottom:16, textTransform:"uppercase", fontWeight:800 }}>Explore</h4>
            <a href="/stories" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:14, marginBottom:10, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Stories</a>
            <a href="/topics" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:14, marginBottom:10, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Topics</a>
            <a href="/resources" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:14, marginBottom:10, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Resources</a>
          </div>

          {/* ── RIGHT COLUMN: Support ── */}
          <div>
            <h4 className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:12, letterSpacing:".15em", color:"#34d399", marginBottom:16, textTransform:"uppercase", fontWeight:800 }}>Support</h4>
            <a href="/about" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:14, marginBottom:10, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>About Us</a>
            <a href="/help" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:14, marginBottom:10, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Help Center</a>
            <a href="/privacy" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:14, marginBottom:10, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Privacy Policy</a>
          </div>

        </div>
        
        {/* ── BOTTOM ROW: Copyright ── */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:20, display:"flex", justifyContent:"space-between", flexWrap: "wrap", gap: "10px" }}>
          <p className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:12, color:"#64748b", fontWeight:500 }}>© 2026 HortiVerse. All rights reserved.</p>
          <p className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:12, color:"#64748b", fontWeight:500 }}>Made with 🌿 for horticulture students everywhere</p>
        </div>
      </div>
    </footer>
  );
}