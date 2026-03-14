import React from 'react';
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)", color: "#0f172a" }}>
      
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
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 32px;
          padding: 60px 80px;
          box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.15);
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .policy-section { margin-bottom: 40px; }
        .policy-section h3 { font-family: 'Fraunces', serif; font-size: 22px; color: #7e22ce; margin-bottom: 12px; font-weight: 800; }
        .policy-section p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; color: #475569; line-height: 1.8; }
      `}</style>

      {/* 🟢 FLEX WRAPPER */}
      <div style={{ flex: 1, paddingBottom: 80 }}>
        
        <div style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", padding: "120px 20px 60px" }}>
          <span style={{ display:"inline-block", background:"rgba(147, 51, 234, 0.1)", color:"#7e22ce", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20 }}>
            Legal
          </span>
          <h1 className="fr" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>
            Privacy <span style={{ color: "#7e22ce" }}>Policy</span>
          </h1>
          <p className="jk" style={{ fontSize: 16, color: "#64748b", marginTop: 20, fontWeight: 500 }}>Last updated: March 2026</p>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="animated-card">
            
            <p className="jk" style={{ fontSize: 17, color: "#334155", lineHeight: 1.8, marginBottom: 40 }}>
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

            <div style={{ marginTop: 50, paddingTop: 30, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
              <p className="jk" style={{ color: "#64748b", fontSize: 15 }}>If you have questions about your data, contact us at privacy@hortiverse.com</p>
            </div>

          </div>
        </div>

      </div>

      {/* ══ FOOTER ══ */}
      <Footer />

    </div>
  );
}