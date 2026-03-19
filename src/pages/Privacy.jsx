import React from 'react';
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

export default function Privacy() {
  return (
    <div className="privacy-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#0f172a", position: "relative", overflowX: "hidden" }}>
      
      {/* 🟢 NEW: Uniform Background Gradients (Supports Light & Dark) */}
      <div className="privacy-bg" style={{
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
          box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.15);
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.3s ease;
        }
        
        .policy-section { margin-bottom: 40px; }
        .policy-section h3 { font-family: 'Fraunces', serif; font-size: 22px; color: #7e22ce; margin-bottom: 12px; font-weight: 800; transition: color 0.3s ease; }
        .policy-section p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(15px, 3vw, 16px); color: #475569; line-height: 1.8; text-align: justify; transition: color 0.3s ease; }

        /* Mobile responsiveness and padding */
        @media (max-width: 768px) {
          .animated-card { 
            padding: 40px 24px; 
            border-radius: 24px;
          }
          .header-section {
            padding: 100px 20px 40px !important;
          }
          .policy-section {
            margin-bottom: 30px;
          }
        }

        /* ══════════════════════════════════════════════════
           🌙 DARK MODE OVERRIDES
        ══════════════════════════════════════════════════ */
        body.dark-mode .privacy-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%) !important; }
        body.dark-mode .privacy-wrapper { color: #f8faf9 !important; }
        
        /* Header Texts */
        body.dark-mode .header-badge { background: rgba(168, 85, 247, 0.15) !important; color: #c084fc !important; border: 1px solid rgba(168, 85, 247, 0.3) !important; }
        body.dark-mode .header-title { color: #f8faf9 !important; }
        body.dark-mode .header-title span { color: #c084fc !important; }
        body.dark-mode .header-desc { color: #94a3b8 !important; }

        /* Card Elements */
        body.dark-mode .animated-card {
          background: rgba(30, 41, 59, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        }
        body.dark-mode .card-text { color: #cbd5e1 !important; }
        
        /* Policy Sections */
        body.dark-mode .policy-section h3 { color: #c084fc !important; }
        body.dark-mode .policy-section p { color: #94a3b8 !important; }

        /* Footer contact section */
        body.dark-mode .contact-section { border-top: 1px solid rgba(255, 255, 255, 0.1) !important; }
        body.dark-mode .contact-text { color: #94a3b8 !important; }
      `}</style>

      {/* 🟢 FLEX WRAPPER */}
      <div style={{ flex: 1, paddingBottom: 80, zIndex: 1 }}>
        
        <div className="header-section" style={{ textAlign: "center", padding: "140px 20px 60px" }}>
          <span className="header-badge" style={{ display:"inline-block", background:"rgba(147, 51, 234, 0.1)", color:"#7e22ce", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20, transition: "all 0.3s" }}>
            Legal
          </span>
          <h1 className="fr header-title" style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, transition: "color 0.3s" }}>
            Privacy <span style={{ color: "#7e22ce", transition: "color 0.3s" }}>Policy</span>
          </h1>
          <p className="jk header-desc" style={{ fontSize: 16, color: "#64748b", marginTop: 20, fontWeight: 500, transition: "color 0.3s" }}>Last updated: March 2026</p>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <div className="animated-card">
            
            <p className="jk card-text" style={{ fontSize: "clamp(15px, 3vw, 17px)", color: "#334155", lineHeight: 1.8, marginBottom: 40, textAlign: "justify", transition: "color 0.3s" }}>
              At HortiVerse, we deeply respect the privacy of our community. This policy outlines how we handle the information you provide when using our platform to share agricultural knowledge.
            </p>

            <div className="policy-section">
              <h3>1. Information We Collect</h3>
              <p>We collect basic account information when you register, such as your name and email address. When you post Stories, Topics, or Comments, that content becomes part of our public Knowledge Hub and is associated with your display name.</p>
            </div>

            <div className="policy-section">
              <h3>2. How We Use Your Information</h3>
              <p>Your data is used solely to provide and improve the HortiVerse experience. We use it to attribute authors to their articles, notify you of community interactions, and maintain a safe, spam-free educational environment.</p>
            </div>

            <div className="policy-section">
              <h3>3. Community Guidelines & Data</h3>
              <p>HortiVerse is an educational platform. We do not sell your personal data to third-party advertisers. Any research data, field trials, or agricultural statistics you publish remain your intellectual property, shared under a collaborative community license.</p>
            </div>

            <div className="policy-section">
              <h3>4. Cookies</h3>
              <p>We use strictly necessary cookies to keep you logged in during your session and to remember your theme preferences. We do not use aggressive tracking cookies.</p>
            </div>

            <div className="contact-section" style={{ marginTop: 50, paddingTop: 30, borderTop: "1px solid #e2e8f0", textAlign: "center", transition: "border-color 0.3s" }}>
              <p className="jk contact-text" style={{ color: "#64748b", fontSize: "clamp(14px, 3vw, 15px)", transition: "color 0.3s" }}>If you have questions about your data, contact us at privacy@hortiverse.com</p>
            </div>

          </div>
        </div>

      </div>

      {/* ══ FOOTER ══ */}
      <Footer />

    </div>
  );
}