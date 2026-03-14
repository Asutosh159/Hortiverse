// Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer style={{ background:"linear-gradient(180deg, #064e3b 0%, #022c22 100%)", padding:"80px 52px 40px", color: "#f8fafc", width: "100%" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:60, marginBottom:60 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:44, height:44, borderRadius:"14px", background:"linear-gradient(135deg,#34d399,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)" }}>🌿</div>
              <span className="fr" style={{ fontFamily: "'Fraunces', serif", fontSize:28, fontWeight:800, color:"#ffffff" }}>Horti<span style={{ color:"#34d399" }}>Verse</span></span>
            </div>
            <p className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:15, color:"#94a3b8", lineHeight:1.8, maxWidth:320, fontWeight:400 }}>
              A thriving community of horticulture students sharing knowledge and sustainable farming practices worldwide.
            </p>
          </div>

          <div>
            <h4 className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:13, letterSpacing:".15em", color:"#34d399", marginBottom:24, textTransform:"uppercase", fontWeight:800 }}>Explore</h4>
            <a href="/stories" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Stories</a>
            <a href="/topics" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Topics</a>
            <a href="/resources" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Resources</a>
          </div>

          <div>
            <h4 className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:13, letterSpacing:".15em", color:"#34d399", marginBottom:24, textTransform:"uppercase", fontWeight:800 }}>Support</h4>
            <a href="/about" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>About Us</a>
            <a href="/help" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Help Center</a>
            <a href="/privacy" className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Privacy Policy</a>
          </div>

        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:30, display:"flex", justifyContent:"space-between" }}>
          <p className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:13, color:"#64748b", fontWeight:500 }}>© 2026 HortiVerse. All rights reserved.</p>
          <p className="jk" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize:13, color:"#64748b", fontWeight:500 }}>Made with 🌿 for horticulture students everywhere</p>
        </div>
      </div>
    </footer>
  );
}   