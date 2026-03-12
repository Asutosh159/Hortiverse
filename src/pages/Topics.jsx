import { useState } from "react";

/* ─── DATA (Simulating Backend with Formatting) ─────────── */
const topics = [
  {
    id: 1, icon: "🌾", label: "Sustainable Farming",
    reads: "142K", color: "#e8f5e9", accent: "#059669",
    subtopics: ["Composting", "Cover Crops", "No-Till Farming", "Organic Methods", "Water Conservation"],
    desc: `**The Future of Agriculture**\n\nEco-friendly practices and regenerative agriculture techniques are no longer optional; they are essential for long-term soil health. Sustainable farming focuses on producing long-term crops and livestock while having minimal effects on the environment.\n\n**Core Principles:**\nFarmers practicing sustainable agriculture seek to integrate three main objectives into their work: a healthy environment, economic profitability, and social and economic equity.\n\n**Why It Matters:**\nBy adopting these methods, we significantly reduce water runoff, prevent topsoil depletion, and build a resilient food system that can withstand climate shifts.`,
  },
  {
    id: 2, icon: "🚜", label: "AgriTech & Innovation",
    reads: "98.5K", color: "#e0f2fe", accent: "#0284c7",
    subtopics: ["IoT Sensors", "Drone Farming", "AI in Agriculture", "Precision Farming", "Smart Irrigation"],
    desc: `**Digital Transformation in Fields**\n\nCutting-edge technology is fundamentally transforming how we grow, monitor, and distribute food. From self-driving tractors to satellite imagery, technology is maximizing yields while minimizing inputs.\n\n**Current Innovations:**\nAI algorithms are now capable of identifying plant diseases from a simple smartphone photo, allowing for micro-targeted pesticide application.\n\n**The Data Advantage:**\nModern farms are data-rich environments. Gathering analytics on soil moisture, weather patterns, and crop growth rates allows farmers to make highly informed, predictive decisions rather than reactive ones.`,
  },
  {
    id: 3, icon: "🐄", label: "Livestock Management",
    reads: "84K", color: "#fef3c7", accent: "#d97706",
    subtopics: ["Rotational Grazing", "Animal Welfare", "Dairy Farming", "Poultry", "Aquaculture"],
    desc: `**Ethical & Productive Husbandry**\n\nModern livestock management balances animal welfare practices with sustainable, high-yield systems. Managing livestock correctly is vital for both meat/dairy production and the health of the pasture.\n\n**Rotational Grazing:**\nBy moving herds frequently between segmented pastures, farmers mimic natural herd behaviors. This prevents overgrazing, allows root systems to recover, and naturally fertilizes the land.\n\n**Health & Nutrition:**\nAdvanced monitoring systems now track individual animal health metrics, ensuring rapid response to illness and optimizing feed ratios for maximum nutritional efficiency.`,
  },
  {
    id: 4, icon: "🌽", label: "Crop Science",
    reads: "215K", color: "#fce7f3", accent: "#be185d",
    subtopics: ["Seed Science", "Plant Breeding", "Hydroponics", "Companion Planting", "Soil Nutrition"],
    desc: `**The Biology of Better Yields**\n\nCrop science combines plant genetics, physiology, and modern cultivation techniques to optimize yield strategies. As the global population grows, maximizing the caloric and nutritional output per acre is paramount.\n\n**Genetic Advancements:**\nTechniques like CRISPR allow scientists to breed drought-resistant and nutrient-dense crop varieties much faster than traditional cross-pollination methods.\n\n**Controlled Environments:**\nHydroponic and aeroponic systems are pushing the boundaries of crop science, allowing for year-round harvesting without the need for arable land.`,
  },
  {
    id: 5, icon: "🌿", label: "Plant Pathology",
    reads: "56.2K", color: "#ecfdf5", accent: "#047857",
    subtopics: ["Fungal Diseases", "Pest Control", "Biological Control", "Chemical Management", "Diagnostics"],
    desc: `**Protecting Our Harvests**\n\nPlant pathology focuses on disease identification, prevention, and integrated pest management solutions. Crop loss due to pathogens remains a massive global economic burden.\n\n**Integrated Pest Management (IPM):**\nRather than blanket chemical applications, IPM relies on biological controls—like introducing natural predators—combined with highly targeted, minimal chemical interventions.\n\n**The Threat of Fungi:**\nFungal infections account for the vast majority of agricultural plant diseases. Rapid diagnostic tools are currently revolutionizing how quickly farmers can respond to outbreaks.`,
  },
  {
    id: 6, icon: "🌍", label: "Global Agriculture",
    reads: "112K", color: "#e0f2fe", accent: "#0369a1",
    subtopics: ["Food Security", "Climate Adaptation", "Traditional Farming", "Agroforestry", "Trade Policy"],
    desc: `**Feeding the World**\n\nGlobal agriculture studies worldwide farming trends, food security challenges, and cross-cultural practices. It examines how international policies and local realities intersect.\n\n**Food Security:**\nEnsuring that all populations have physical and economic access to sufficient, safe, and nutritious food is the core challenge of our generation.\n\n**Climate Adaptation:**\nDifferent regions are facing unique climate challenges. Sharing traditional wisdom combined with modern science across borders is essential for adapting to shifting weather patterns.`,
  }
];

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function Topics() {
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [hovered,   setHovered]   = useState(null);

  const filtered = topics.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    (t.subtopics && t.subtopics.some(sub => sub.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#111827", overflow: "hidden" }}>

      {/* ── HIGHLY COLORFUL & ATTRACTIVE BACKGROUND ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)",
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.6); }
        
        .fr { font-family: 'Fraunces', serif; }
        .jk { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Modern Colorful Card Styling */
        .topic-card {
          background: rgba(255, 255, 255, 0.85); 
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 20px; padding: 32px 28px;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
          display: flex; flex-direction: column;
        }
        .topic-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 2px rgba(16, 185, 129, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .topic-card .glow {
          position: absolute; top: -40px; right: -40px;
          width: 140px; height: 140px; border-radius: 50%;
          filter: blur(40px); opacity: 0; transition: opacity .5s;
          pointer-events: none;
        }
        .topic-card:hover .glow { opacity: 0.15; }

        .search-container {
          position: relative; max-width: 680px; margin: 0 auto;
          transform: translateY(50%); z-index: 10;
        }
        .search-box {
          width: 100%; background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 100px; padding: 22px 32px 22px 64px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px;
          font-weight: 500; color: #111827; outline: none; transition: all .3s ease;
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16,185,129,0.05);
        }
        .search-box::placeholder { color: #94a3b8; }
        .search-box:focus { 
          border-color: #10b981; background: #ffffff;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 20px 40px -10px rgba(0, 0, 0, 0.1); 
        }
        .search-icon {
          position: absolute; left: 28px; top: 50%;
          transform: translateY(-50%); font-size: 22px;
          color: #10b981; pointer-events: none;
        }

        .btn-green {
          background: #059669; color: #fff;
          border: none; cursor: pointer; border-radius: 50px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 14px; padding: 12px 28px; transition: all .2s ease;
          display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .btn-green:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(5, 150, 105, 0.25); }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.6); color: #334155; 
          border: 1px solid rgba(0,0,0,0.05); cursor: pointer; border-radius: 50px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 14px; padding: 12px 28px; transition: all .2s ease;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { background: #ffffff; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .subtopic-tag {
          display: inline-block; background: #f1f5f9; color: #475569;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600;
          padding: 6px 14px; border-radius: 50px; transition: all .2s; border: 1px solid transparent;
        }
        .topic-card:hover .subtopic-tag { background: #ffffff; border-color: #e2e8f0; }

        /* ── MODAL SYSTEM ── */
        .modal-overlay {
          position: fixed; top: 72px; left: 0; right: 0; bottom: 0;
          z-index: 450; background: rgba(15, 23, 42, 0.35); 
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          display: flex; justify-content: center; align-items: center; 
          padding: 40px 20px; animation: fadeIn .3s ease-out;
        }
        
        .modal-box {
          background: #ffffff; border-radius: 24px; width: 100%; max-width: 720px;
          max-height: 100%; display: flex; flex-direction: column;
          position: relative; overflow: hidden; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.2);
          animation: slideUp .4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-scroll-area {
          overflow-y: auto; flex-grow: 1; width: 100%;
        }
        .modal-scroll-area::-webkit-scrollbar { width: 6px; }
        .modal-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .modal-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }

        .modal-close-btn {
          position: absolute; top: 20px; right: 20px; z-index: 100;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.05); color: #0f172a; font-size: 20px; 
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .modal-close-btn:hover { background: #ffffff; color: #059669; transform: scale(1.1); }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* Premium Editorial Typography for Backend Data */
        .modal-article-content p {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 17px; line-height: 1.85; color: #334155;
          margin-bottom: 24px; font-weight: 400;
        }
        
        /* Stylized "Lead In" paragraph */
        .modal-article-content p:first-of-type {
          font-size: 19px; color: #1e293b; font-weight: 500; line-height: 1.7;
        }

        .modal-article-content strong, .modal-article-content b {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; color: #0f172a; font-size: 20px;
          display: block; margin-top: 40px; margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        
        /* Main sub-header formatting */
        .modal-article-content p:first-of-type strong {
          font-size: 26px; color: var(--accent-color, #059669); margin-top: 10px;
          line-height: 1.2; letter-spacing: -0.02em;
        }

        /* Navbar */
        .nav-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500; height: 72px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; transition: all 0.3s;
        }
        .nav-lk {
          color: #475569; text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 600;
          transition: color .2s; position: relative; padding-bottom: 4px;
        }
        .nav-lk:hover { color: #059669; }
        .nav-lk.active { color: #059669; }
        .nav-lk.active::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 100%; height: 2px; background: #059669; border-radius: 2px;
        }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav className="nav-bar">
        <a href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <div style={{ width:40, height:40, borderRadius:"12px", background:"linear-gradient(135deg, #10b981, #047857)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color: "white", boxShadow: "0 4px 10px rgba(16,185,129,0.3)" }}>🌿</div>
          <span className="fr" style={{ fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing: "-0.5px" }}>Horti<span style={{ color:"#059669" }}>Verse</span></span>
        </a>
        <div style={{ display:"flex", gap:36 }}>
          {[["Home","/"],["Stories","/stories"],["Topics","/topics"]].map(([n,h]) => (
            <a key={n} href={h} className={`nav-lk ${n==="Topics"?"active":""}`}>{n}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <a href="#" className="btn-ghost">Log in</a>
          <a href="#" className="btn-green">Join Free</a>
        </div>
      </nav>

      {/* ══ PAGE HEADER ══ */}
      <div style={{ paddingTop: 72, background: "transparent" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 0px", textAlign: "center" }}>
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,1)", color:"#059669", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 20px", borderRadius:50, marginBottom:24, boxShadow:"0 4px 12px rgba(0,0,0,0.03)" }}>
            Knowledge Hub
          </span>
          <h1 className="fr" style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Explore agricultural <br/> <span style={{ color:"#059669" }}>disciplines.</span>
          </h1>
          <p className="jk" style={{ marginTop: 20, fontSize: 18, color: "#475569", fontWeight: 500, lineHeight: 1.6, maxWidth: 600, margin: "20px auto 0" }}>
            Dive into specialized agricultural disciplines and explore over <strong>8 categories</strong> of research.
          </p>

          {/* Prominent Search Bar */}
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              className="search-box" 
              placeholder="Search topics or interests..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* ══ TOPICS GRID ══ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 100px", position: "relative", zIndex: 5 }}>
        
        {/* Result Header */}
        {search && (
          <p className="jk" style={{ fontSize: 16, color: "#475569", marginBottom: 32, fontWeight: 600, background: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: "12px", display: "inline-block" }}>
            Found <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> topics for "{search}"
          </p>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
          {filtered.map((t) => (
            <article key={t.id} className="topic-card" onClick={() => setSelected(t)}
              onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
              
              <div className="glow" style={{ background: t.accent }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ width: 60, height: 60, borderRadius: "16px", background: hovered === t.id ? t.color : "#f8faf9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, transition: "all .3s" }}>
                  {t.icon}
                </div>
              </div>

              <h3 className="fr" style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.2 }}>{t.label}</h3>
              
              {/* Preview stripping out markdown characters */}
              <p className="jk" style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, fontWeight: 500, marginBottom: 24, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {t.desc.replace(/\*\*(.*?)\*\*/g, "")}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {t.subtopics && t.subtopics.slice(0,3).map((s) => (
                  <span key={s} className="subtopic-tag">{s}</span>
                ))}
                {t.subtopics && t.subtopics.length > 3 && (
                  <span className="subtopic-tag" style={{ background: "transparent", color: "#94a3b8" }}>+{t.subtopics.length-3}</span>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <span className="jk" style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>👀 {t.reads} Reads</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h3 className="fr" style={{ fontSize: 28, color: "#0f172a", fontWeight: 800 }}>No topics found</h3>
            <p className="jk" style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>We couldn't find anything matching your search.</p>
            <button className="btn-ghost" style={{ marginTop: 24, background:"rgba(255,255,255,0.8)" }} onClick={() => setSearch("")}>Clear Search</button>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          TOPIC DETAIL MODAL (NEW ELEGANT DESIGN)
      ══════════════════════════════════════ */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ '--accent-color': selected.accent }}>

            <button className="modal-close-btn" onClick={() => setSelected(null)}>✕</button>

            <div className="modal-scroll-area">
              
              {/* Elegant Centered Header */}
              <div style={{ 
                padding: "64px 48px 40px", 
                background: `linear-gradient(180deg, ${selected.color} 0%, rgba(255,255,255,0) 100%)`, 
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                
                {/* Large Icon */}
                <div style={{ 
                  width: 96, height: 96, borderRadius: "28px", background: "#ffffff", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  fontSize: 48, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
                  marginBottom: 28
                }}>
                  {selected.icon}
                </div>

                {/* Title */}
                <h2 className="fr" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 24 }}>
                  {selected.label}
                </h2>

                {/* Clean "Reads" Badge */}
                <div style={{ 
                  display: "inline-flex", alignItems: "center", gap: 10, 
                  background: "#ffffff", padding: "10px 24px", borderRadius: "50px", 
                  border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" 
                }}>
                  <span style={{ fontSize: 18 }}>👀</span>
                  <span className="jk" style={{ fontSize: 15, color: "#475569", fontWeight: 700 }}>
                    <strong style={{ color: "#0f172a", fontWeight: 800 }}>{selected.reads}</strong> Readers Exploring
                  </span>
                </div>

              </div>

              {/* Enhanced Article Body */}
              <div style={{ padding: "0 56px 64px" }}>

                {/* BACKEND-READY FORMATTING */}
                <div className="modal-article-content">
                  {selected.desc.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}