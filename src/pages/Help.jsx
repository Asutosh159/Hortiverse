import React from 'react';
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

export default function Help() {
  return (
    <div className="help-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#0f172a", position: "relative", overflowX: "hidden" }}>
      
      {/* 🟢 NEW: Uniform Background Gradients (Supports Light & Dark) */}
      <div className="help-bg" style={{
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
          box-shadow: 0 25px 50px -12px rgba(2, 132, 199, 0.15);
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.3s ease;
        }
        
        .faq-item {
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 0;
          transition: border-color 0.3s ease;
        }
        .faq-item:last-child { border-bottom: none; }
        
        /* Mobile responsiveness and padding */
        @media (max-width: 768px) {
          .animated-card { 
            padding: 40px 24px; 
            border-radius: 24px;
          }
          .header-section {
            padding: 100px 20px 40px !important;
          }
        }

        /* ══════════════════════════════════════════════════
           🌙 DARK MODE OVERRIDES
        ══════════════════════════════════════════════════ */
        body.dark-mode .help-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%) !important; }
        body.dark-mode .help-wrapper { color: #f8faf9 !important; }
        
        /* Header Texts */
        body.dark-mode .header-badge { background: rgba(2, 132, 199, 0.15) !important; color: #38bdf8 !important; border: 1px solid rgba(2, 132, 199, 0.3) !important; }
        body.dark-mode .header-title { color: #f8faf9 !important; }
        body.dark-mode .header-title span { color: #38bdf8 !important; }
        
        /* Card Elements */
        body.dark-mode .animated-card {
          background: rgba(30, 41, 59, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        }
        body.dark-mode .card-title { color: #f8faf9 !important; }
        
        /* FAQ Items */
        body.dark-mode .faq-item { border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; }
        body.dark-mode .faq-title { color: #f8faf9 !important; }
        body.dark-mode .faq-text { color: #94a3b8 !important; }
        
        /* Contact Box */
        body.dark-mode .contact-box { background: rgba(15, 23, 42, 0.6) !important; border: 1px solid rgba(255, 255, 255, 0.05) !important; }
        body.dark-mode .contact-title { color: #f8faf9 !important; }
        body.dark-mode .contact-text { color: #94a3b8 !important; }
        body.dark-mode .contact-link { color: #38bdf8 !important; }
      `}</style>

      {/* 🟢 FLEX WRAPPER */}
      <div style={{ flex: 1, paddingBottom: 80, zIndex: 1 }}>
        
        <div className="header-section" style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", padding: "120px 20px 60px" }}>
          <span className="header-badge" style={{ display:"inline-block", background:"rgba(2, 132, 199, 0.1)", color:"#0284c7", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20, transition: "all 0.3s" }}>
            Support
          </span>
          <h1 className="fr header-title" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, transition: "color 0.3s" }}>
            How can we <span style={{ color: "#0284c7", transition: "color 0.3s" }}>help?</span>
          </h1>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="animated-card">
            
            <h2 className="fr card-title" style={{ fontSize: 28, color: "#0f172a", marginBottom: 30, fontWeight: 800, transition: "color 0.3s" }}>
              Frequently Asked Questions
            </h2>

            <div className="faq-item">
              <h3 className="jk faq-title" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0f172a", transition: "color 0.3s" }}>How do I publish a Story?</h3>
              <p className="jk faq-text" style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, transition: "color 0.3s" }}>To publish a story, navigate to the "Stories" page and click the "Share Your Story" button. You will need to be logged in to contribute. You can add a title, cover image, and your full experience.</p>
            </div>

            <div className="faq-item">
              <h3 className="jk faq-title" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0f172a", transition: "color 0.3s" }}>What is the Knowledge Hub?</h3>
              <p className="jk faq-text" style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, transition: "color 0.3s" }}>The Knowledge Hub (Topics page) is our collaborative curriculum. Here, students map out full academic structures using our smart-skeleton generator. It's perfect for studying for exams or referencing crop data.</p>
            </div>

            <div className="faq-item">
              <h3 className="jk faq-title" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0f172a", transition: "color 0.3s" }}>How do I format my Topic submissions?</h3>
              <p className="jk faq-text" style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, transition: "color 0.3s" }}>When creating a topic, use <code>##</code> for a main heading, and a hyphen <code>-</code> for bullet points. Our system will automatically turn this into a beautifully formatted academic structure.</p>
            </div>

            <div className="contact-box" style={{ marginTop: 60, padding: 40, background: "#f0f9ff", borderRadius: 24, textAlign: "center", border: "1px solid #bae6fd", transition: "all 0.3s" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
              <h3 className="fr contact-title" style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: "#0f172a", transition: "color 0.3s" }}>Still need assistance?</h3>
              <p className="jk contact-text" style={{ color: "#475569", marginBottom: 20, transition: "color 0.3s" }}>Our community moderators are here to help you get the most out of HortiVerse.</p>
              <a href="mailto:support@hortiverse.com" className="jk contact-link" style={{ color: "#0284c7", fontWeight: 800, textDecoration: "none", fontSize: 18, transition: "color 0.3s" }}>support@hortiverse.com</a>
            </div>

          </div>
        </div>

      </div>

      {/* ══ FOOTER ══ */}
      <Footer />

    </div>
  );
}