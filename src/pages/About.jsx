import React from 'react';
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

export default function About() {
  return (
    <div className="about-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#0f172a", position: "relative", overflowX: "hidden" }}>
      
      {/* 🟢 NEW: Uniform Background Gradients (Supports Light & Dark) */}
      <div className="about-bg" style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)",
        transition: "background 0.3s ease"
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        .fr { font-family: 'Fraunces', serif; }
        .jk { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animated-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 32px;
          padding: 60px 80px;
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.15);
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.3s ease;
        }
        
        /* Mobile responsiveness and padding */
        @media (max-width: 768px) {
          .animated-card { 
            padding: 40px 24px; 
            border-radius: 24px;
          }
          .header-section {
            padding: 100px 20px 40px !important;
          }
          .feature-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* ══════════════════════════════════════════════════
           🌙 DARK MODE OVERRIDES
        ══════════════════════════════════════════════════ */
        body.dark-mode .about-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%) !important; }
        body.dark-mode .about-wrapper { color: #f8faf9 !important; }
        
        /* Header Texts */
        body.dark-mode .header-badge { background: rgba(16, 185, 129, 0.15) !important; color: #34d399 !important; border: 1px solid rgba(16, 185, 129, 0.3) !important; }
        body.dark-mode .header-title { color: #f8faf9 !important; }
        body.dark-mode .header-title span { color: #34d399 !important; }
        body.dark-mode .header-desc { color: #94a3b8 !important; }

        /* Card Elements */
        body.dark-mode .animated-card {
          background: rgba(30, 41, 59, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        }
        body.dark-mode .card-title { color: #f8faf9 !important; }
        body.dark-mode .card-text { color: #cbd5e1 !important; }
        body.dark-mode .card-subtitle { color: #34d399 !important; }
        
        /* Feature Grid */
        body.dark-mode .feature-box { background: rgba(15, 23, 42, 0.6) !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; }
        body.dark-mode .feature-title { color: #f8faf9 !important; }
        body.dark-mode .feature-text { color: #94a3b8 !important; }
        
        /* Call to Action */
        body.dark-mode .cta-section { border-top: 2px dashed rgba(255, 255, 255, 0.1) !important; }
        body.dark-mode .cta-title { color: #f8faf9 !important; }
      `}</style>

      {/* 🟢 FLEX WRAPPER: Pushes footer to the bottom */}
      <div style={{ flex: 1, paddingBottom: 80, zIndex: 1 }}>
        
        {/* HEADER SECTION */}
        <div className="header-section" style={{ textAlign: "center", padding: "140px 20px 60px" }}>
          <span className="header-badge" style={{ display:"inline-block", background:"rgba(16, 185, 129, 0.1)", color:"#059669", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20, transition: "all 0.3s" }}>
            Our Story
          </span>
          <h1 className="fr header-title" style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, transition: "color 0.3s" }}>
            Cultivating <span style={{ color: "#059669", transition: "color 0.3s" }}>Knowledge.</span>
          </h1>
          <p className="jk header-desc" style={{ fontSize: "clamp(16px, 3vw, 18px)", color: "#475569", marginTop: 20, maxWidth: 600, margin: "20px auto 0", fontWeight: 500, transition: "color 0.3s" }}>
            Bridging the gap between traditional farming wisdom and modern agricultural science.
          </p>
        </div>

        {/* CONTENT CARD */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <div className="animated-card">
            
            <h2 className="fr card-title" style={{ fontSize: "clamp(24px, 4vw, 32px)", color: "#0f172a", marginBottom: 20, fontWeight: 800, transition: "color 0.3s" }}>
              Welcome to HortiVerse 🌿
            </h2>
            
            <p className="jk card-text" style={{ marginBottom: 32, fontSize: "clamp(15px, 3vw, 17px)", lineHeight: 1.8, color: "#334155", textAlign: "justify", transition: "color 0.3s" }}>
              HortiVerse was built by and for agriculture and horticulture students. We recognized a vital need for a centralized, modern platform where students, researchers, and seasoned farmers could come together to share real-world experiences, detailed curriculum topics, and innovative farming techniques.
            </p>

            <h3 className="fr card-subtitle" style={{ fontSize: "clamp(22px, 4vw, 26px)", color: "#059669", marginTop: 40, marginBottom: 16, fontWeight: 800, transition: "color 0.3s" }}>
              Our Mission
            </h3>
            
            <p className="jk card-text" style={{ marginBottom: 24, fontSize: "clamp(15px, 3vw, 17px)", lineHeight: 1.8, color: "#334155", textAlign: "justify", transition: "color 0.3s" }}>
              We believe the future of our planet relies on educated, passionate agriculturalists. Our mission is to democratize agricultural education. By providing a platform to document crop varieties, analyze soil treatments, and share sustainable tech, we aim to empower the next generation of global agronomists.
            </p>

            <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, marginTop: 48 }}>
              <div className="feature-box" style={{ background: "#f8faf9", padding: 30, borderRadius: 20, border: "1px solid #e2e8f0", transition: "all 0.3s" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🌾</div>
                <h4 className="fr feature-title" style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "#0f172a", transition: "color 0.3s" }}>Share Stories</h4>
                <p className="jk feature-text" style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, textAlign: "justify", transition: "color 0.3s" }}>Document your field trials, farm visits, and personal experiences to inspire others.</p>
              </div>
              <div className="feature-box" style={{ background: "#f8faf9", padding: 30, borderRadius: 20, border: "1px solid #e2e8f0", transition: "all 0.3s" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📚</div>
                <h4 className="fr feature-title" style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "#0f172a", transition: "color 0.3s" }}>Build the Hub</h4>
                <p className="jk feature-text" style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, textAlign: "justify", transition: "color 0.3s" }}>Collaborate on a structured curriculum covering everything from Agronomy to Livestock.</p>
              </div>
            </div>

            <div className="cta-section" style={{ marginTop: 60, paddingTop: 40, borderTop: "2px dashed #e2e8f0", textAlign: "center", transition: "border-color 0.3s" }}>
              <h3 className="fr cta-title" style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 800, marginBottom: 20, color: "#0f172a", transition: "color 0.3s" }}>Join us in growing a better tomorrow.</h3>
              <a href="/UnderDevelopment" className="jk" style={{ display: "inline-block", background: "#059669", color: "#fff", padding: "14px 32px", borderRadius: 50, textDecoration: "none", fontWeight: 700, transition: "transform 0.2s", boxShadow: "0 10px 20px -5px rgba(5, 150, 105, 0.4)" }}>Become a Contributor</a>
            </div>
            
          </div> 
        </div> 

      </div>
      
      {/* ══ FOOTER ══ */}
      <Footer />

    </div>
  );
}