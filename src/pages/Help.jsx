import React from 'react';
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

export default function Help() {
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
          box-shadow: 0 25px 50px -12px rgba(2, 132, 199, 0.15);
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .faq-item {
          border-bottom: 1px solid #e2e8f0;
          padding: 24px 0;
        }
        .faq-item:last-child { border-bottom: none; }
      `}</style>

      {/* 🟢 FLEX WRAPPER */}
      <div style={{ flex: 1, paddingBottom: 80 }}>
        
        <div style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center", padding: "120px 20px 60px" }}>
          <span style={{ display:"inline-block", background:"rgba(2, 132, 199, 0.1)", color:"#0284c7", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 24px", borderRadius:50, marginBottom:20 }}>
            Support
          </span>
          <h1 className="fr" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>
            How can we <span style={{ color: "#0284c7" }}>help?</span>
          </h1>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="animated-card">
            
            <h2 className="fr" style={{ fontSize: 28, color: "#0f172a", marginBottom: 30, fontWeight: 800 }}>
              Frequently Asked Questions
            </h2>

            <div className="faq-item">
              <h3 className="jk" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0f172a" }}>How do I publish a Story?</h3>
              <p className="jk" style={{ fontSize: 16, color: "#475569", lineHeight: 1.7 }}>To publish a story, navigate to the "Stories" page and click the "Share Your Story" button. You will need to be logged in to contribute. You can add a title, cover image, and your full experience.</p>
            </div>

            <div className="faq-item">
              <h3 className="jk" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0f172a" }}>What is the Knowledge Hub?</h3>
              <p className="jk" style={{ fontSize: 16, color: "#475569", lineHeight: 1.7 }}>The Knowledge Hub (Topics page) is our collaborative curriculum. Here, students map out full academic structures using our smart-skeleton generator. It's perfect for studying for exams or referencing crop data.</p>
            </div>

            <div className="faq-item">
              <h3 className="jk" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#0f172a" }}>How do I format my Topic submissions?</h3>
              <p className="jk" style={{ fontSize: 16, color: "#475569", lineHeight: 1.7 }}>When creating a topic, use <code>##</code> for a main heading, and a hyphen <code>-</code> for bullet points. Our system will automatically turn this into a beautifully formatted academic structure.</p>
            </div>

            <div style={{ marginTop: 60, padding: 40, background: "#f0f9ff", borderRadius: 24, textAlign: "center", border: "1px solid #bae6fd" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
              <h3 className="fr" style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Still need assistance?</h3>
              <p className="jk" style={{ color: "#475569", marginBottom: 20 }}>Our community moderators are here to help you get the most out of HortiVerse.</p>
              <a href="mailto:support@hortiverse.com" className="jk" style={{ color: "#0284c7", fontWeight: 800, textDecoration: "none", fontSize: 18 }}>support@hortiverse.com</a>
            </div>

          </div>
        </div>

      </div>

      {/* ══ FOOTER ══ */}
      <Footer />

    </div>
  );
}