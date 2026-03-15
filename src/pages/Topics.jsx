import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect } from "react";
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

// Pre-defined themes
const THEMES = [
  { name: "Emerald", bg: "#ecfdf5", accent: "#059669" },
  { name: "Ocean",   bg: "#e0f2fe", accent: "#0284c7" },
  { name: "Amber",   bg: "#fef3c7", accent: "#d97706" },
  { name: "Purple",  bg: "#f3e8ff", accent: "#7e22ce" },
  { name: "Rose",    bg: "#fce7f3", accent: "#be185d" }
];

// 🟢 NEW: PRE-DEFINED ICON PACK FOR USERS TO CHOOSE FROM
const ICON_PACK = [
  "🌱", "🌿", "🚜", "🌾", "🍎", "🌻", "💧", "☀️", 
  "🐄", "🐑", "🐓", "🐝", "🥕", "🍅", "🥦", "🌲", 
  "🍄", "🌍", "🔬", "📚", "⚙️", "🌤️", "🔥", "📊"
];

/* ─── UPLOAD MODAL ──────────────────────────────────────── */
function UploadTopicModal({ onClose, onSuccess }) {
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("🌱");
  const [description, setDescription] = useState("");
  const [subtopics, setSubtopics] = useState(""); 
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!label.trim() || !description.trim() || !icon.trim()) {
      setError("Please fill out the icon, title, and description.");
      return;
    }
    
    setError("");
    setLoading(true);

    const subtopicsArray = subtopics.split(',').map(s => s.trim()).filter(s => s !== "");
    
    const payload = {
      label: label.trim(),
      icon: icon.trim(),
      description: description.trim(),
      subtopics: subtopicsArray,
      color: selectedTheme.bg,
      accent: selectedTheme.accent
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setLoading(false);
        setSuccess(true);
        onSuccess({ id: data.id, ...payload, reads: "0.0K" });
        setTimeout(onClose, 1800);
      } else {
        throw new Error(data.error || "Failed to upload topic");
      }
    } catch (err) {
      setError("Failed to create topic. Please try again.");
      setLoading(false);
    }
  };

  const LABEL = { display:"block", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:700, color:"#334155", letterSpacing:".05em", textTransform:"uppercase", marginBottom:8 };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 700 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-scroll-area" style={{ padding: "40px 48px" }}>
          {success ? (
            <div style={{ textAlign:"center", padding:"40px 0", animation:"popIn .35s ease" }}>
              <div style={{ fontSize:64, marginBottom:20 }}>✨</div>
              <h3 className="fr" style={{ fontSize:32, color:"#0f172a", marginBottom:12, fontWeight:800 }}>Topic Created!</h3>
              <p className="jk" style={{ fontSize:16, color:"#64748b", lineHeight:1.7, fontWeight:500 }}>Your new category is now live in the Knowledge Hub.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <span className="tag-badge" style={{ background:"rgba(5,150,105,0.1)", color:"#059669", marginBottom:12 }}>New Category</span>
                <h2 className="fr" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight:900, color:"#0f172a", lineHeight:1.1, marginBottom:8 }}>
                  Create a <span style={{ color:"#059669" }}>Topic</span>
                </h2>
              </div>

              {error && (
                <div style={{ fontSize:14, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:24, display:"flex", gap:8, alignItems:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                <div style={{ width: "80px" }}>
                  <label style={LABEL}>Icon</label>
                  <input className="input-modern" style={{ textAlign: "center", fontSize: "24px", padding: "8px" }} value={icon} onChange={e=>setIcon(e.target.value)} maxLength={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL}>Topic Name <span style={{ color:"#ef4444" }}>*</span></label>
                  <input className="input-modern" placeholder="e.g., Nursery Management" value={label} onChange={e=>{setLabel(e.target.value);setError("");}} />
                </div>
              </div>

              {/* 🟢 NEW: ICON PACK SELECTION AREA */}
              <div style={{ marginBottom: 24 }}>
                <label style={LABEL}>Quick Icon Select</label>
                <div style={{ 
                  display: "flex", gap: 8, flexWrap: "wrap", background: "#f8faf9", 
                  padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0",
                }}>
                  {ICON_PACK.map(ico => (
                    <button 
                      key={ico} 
                      type="button"
                      onClick={() => setIcon(ico)} 
                      style={{
                        width: "42px", height: "42px", fontSize: "20px", borderRadius: "12px",
                        background: icon === ico ? "rgba(16,185,129,0.15)" : "#ffffff",
                        border: `1px solid ${icon === ico ? "#059669" : "#e2e8f0"}`,
                        cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: icon === ico ? "0 0 0 1px #059669" : "0 2px 4px rgba(0,0,0,0.02)"
                      }}>
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={LABEL}>Color Theme</label>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {THEMES.map(theme => (
                    <button type="button" key={theme.name} onClick={() => setSelectedTheme(theme)} style={{
                      padding: "8px 16px", borderRadius: "50px", border: `2px solid ${selectedTheme.name === theme.name ? theme.accent : 'transparent'}`,
                      background: theme.bg, color: theme.accent, fontWeight: 700, cursor: "pointer", transition: "all .2s"
                    }}>
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={LABEL}>Skeleton / Content <span style={{ color:"#ef4444" }}>*</span></label>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  💡 <strong>Pro Tip:</strong> Type <code>##</code> before a Main Heading, and <code>-</code> before a subheading to auto-generate a Course Skeleton! Add descriptions right below them.
                </p>
                <textarea className="input-modern" style={{ resize:"vertical", lineHeight:1.6, minHeight: "180px", fontFamily: "monospace" }}
                  placeholder={`## Raising Vegetable Nursery\n- Benefits of nursery\nThis is a description of the benefits...\n\n## Soil treatment`} 
                  value={description} onChange={e=>setDescription(e.target.value)} />
              </div>

              <div style={{ marginBottom:32 }}>
                <label style={LABEL}>Tags <span style={{ color:"#94a3b8", fontWeight:500, textTransform:"none", letterSpacing:0 }}>(comma separated)</span></label>
                <input className="input-modern" placeholder="e.g., Soil, Greenhouse, Seeds" value={subtopics} onChange={e=>setSubtopics(e.target.value)} />
              </div>

              <button type="button" className="btn-green" onClick={handleSubmit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16 }}>
                {loading ? "Creating..." : "🌿 Launch Topic"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [hovered,   setHovered]   = useState(null);
  
  const [showUpload, setShowUpload] = useState(false);
  const user = JSON.parse(localStorage.getItem("hv_user"));

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/topics`);
        const dbTopics = await res.json();
        
        const formattedTopics = dbTopics.map(t => ({
          id: t.id,
          icon: t.icon || "🌿",
          label: t.label || "Untitled Topic",
          reads: ((t.reads_count || 0) / 1000).toFixed(1) + "K",
          color: t.color || "#f8faf9",
          accent: t.accent || "#059669",
          subtopics: t.subtopics || [],
          desc: t.description || ""
        }));
        
        setTopics(formattedTopics);
      } catch (err) {
        console.error("Failed to load topics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  // PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN
  useEffect(() => {
    if (selected || showUpload) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selected, showUpload]);

  const filtered = topics.filter((t) =>
    (t.label || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.desc || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.subtopics && t.subtopics.some(sub => sub.toLowerCase().includes(search.toLowerCase())))
  );

  const handleNewTopic = (newTopic) => {
    setTopics(prev => [newTopic, ...prev]);
  };

  // ADVANCED SKELETON PARSER LOGIC
  const renderTopicContent = (text, accentColor) => {
    // If no ## exists, just render normal paragraphs
    if (!text.includes("##")) {
      return text.split("\n\n").map((para, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} style={{ wordBreak: 'break-word' }} />
      ));
    }

    const parts = text.split("## ");
    const introText = parts[0].trim();
    const modulesRaw = parts.slice(1);

    const modules = modulesRaw.map(modText => {
      const lines = modText.split("\n").filter(l => l.trim() !== "");
      const mainHeading = lines[0].trim();
      const items = [];
      let currentItem = null;
      let mainDesc = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const isBullet = line.match(/^[-*]\s+(.*)/) || line.match(/^[0-9]+\.\s+(.*)/);
        
        if (isBullet) {
          if (currentItem) items.push(currentItem);
          currentItem = { title: isBullet[1], desc: [] };
        } else {
          if (currentItem) {
            currentItem.desc.push(line);
          } else {
            mainDesc.push(line); 
          }
        }
      }
      if (currentItem) items.push(currentItem);

      return { mainHeading, mainDesc: mainDesc.join(" "), items };
    });

    return (
      <div className="skeleton-container">
        {introText && <p className="skeleton-intro" style={{ wordBreak: 'break-word' }}>{introText}</p>}
        
        <div className="skeleton-grid">
          {modules.map((mod, idx) => (
            <div key={idx} className="skeleton-module" style={{ borderTop: `3px solid ${accentColor}` }}>
              
              <div className="module-header">
                <span className="module-number" style={{ color: accentColor }}>{String(idx + 1).padStart(2, '0')}</span>
                <h4 style={{ wordBreak: 'break-word', margin: 0 }}>{mod.mainHeading}</h4>
              </div>
              
              {mod.mainDesc && <p className="module-main-desc" style={{ wordBreak: 'break-word' }}>{mod.mainDesc}</p>}
              
              {mod.items.length > 0 && (
                <ul className="module-list">
                  {mod.items.map((item, sIdx) => (
                    <li key={sIdx}>
                      <div className="sub-title">
                        <span style={{ color: accentColor, marginRight: 8, marginTop: 1 }}>▹</span>
                        <span style={{ wordBreak: 'break-word' }}>{item.title}</span>
                      </div>
                      
                      {item.desc.length > 0 && (
                        <p className="sub-desc" style={{ wordBreak: 'break-word' }}>{item.desc.join(" ")}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#111827", overflow: "hidden" }}>

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
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.6); }
        
        .fr { font-family: 'Lora', serif; }
        .jk { font-family: 'Manrope', sans-serif; }

        .topic-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 1); border-radius: 20px; padding: 32px 28px; cursor: pointer; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08); display: flex; flex-direction: column; }
        .topic-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 2px rgba(16, 185, 129, 0.1); background: rgba(255, 255, 255, 0.95); }
        
        .topic-card .glow { position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; border-radius: 50%; filter: blur(40px); opacity: 0; transition: opacity .5s; pointer-events: none; }
        .topic-card:hover .glow { opacity: 0.15; }

        .search-container { position: relative; max-width: 680px; margin: 0 auto; transform: translateY(50%); z-index: 10; }
        .search-box { width: 100%; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 1); border-radius: 100px; padding: 22px 32px 22px 64px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 500; color: #111827; outline: none; transition: all .3s ease; box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16,185,129,0.05); }
        .search-box::placeholder { color: #94a3b8; }
        .search-box:focus { border-color: #10b981; background: #ffffff; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 20px 40px -10px rgba(0, 0, 0, 0.1); }
        .search-icon { position: absolute; left: 28px; top: 50%; transform: translateY(-50%); font-size: 22px; color: #10b981; pointer-events: none; }

        .input-modern { width: 100%; padding: 14px 18px; background: #f8faf9; border: 1px solid #e2e8f0; border-radius: 12px; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #111827; transition: all 0.2s; font-weight: 500; }
        .input-modern:focus { background: #fff; border-color: #059669; box-shadow: 0 0 0 4px rgba(5,150,105,0.1); }

        .btn-green { background: #059669; color: #fff; border: none; cursor: pointer; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 12px 28px; transition: all .2s ease; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
        .btn-green:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(5, 150, 105, 0.25); }

        .btn-ghost { background: rgba(255, 255, 255, 0.6); color: #334155; border: 1px solid rgba(0,0,0,0.05); cursor: pointer; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 12px 28px; transition: all .2s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-ghost:hover { background: #ffffff; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .subtopic-tag { display: inline-block; background: #f1f5f9; color: #475569; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 50px; transition: all .2s; border: 1px solid transparent; }
        .topic-card:hover .subtopic-tag { background: #ffffff; border-color: #e2e8f0; }

        .modal-overlay { position: fixed; top: 72px; left: 0; right: 0; bottom: 0; z-index: 450; background: rgba(15, 23, 42, 0.35); backdrop-filter: blur(24px); display: flex; justify-content: center; align-items: center; padding: 60px 20px; animation: fadeIn .3s ease-out; }
        
        .modal-box { 
          background: #ffffff; 
          border-radius: 24px; 
          width: 100%; 
          max-width: 860px; 
          max-height: 85vh; 
          display: flex; 
          flex-direction: column; 
          position: relative; 
          overflow: hidden; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.2); 
          animation: slideUp .4s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .modal-scroll-area { 
          overflow-y: auto; 
          overflow-x: hidden; 
          flex-grow: 1; 
          width: 100%; 
          word-break: break-word; 
          overscroll-behavior: contain; 
        }
        .modal-scroll-area::-webkit-scrollbar { width: 6px; }
        .modal-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .modal-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }

        .modal-close-btn { position: absolute; top: 20px; right: 20px; z-index: 100; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(0, 0, 0, 0.05); color: #0f172a; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .modal-close-btn:hover { background: #ffffff; color: #059669; transform: scale(1.1); }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .skeleton-container { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          width: 100%;
        }

        .skeleton-intro { 
          font-size: 15px; 
          color: #475569; 
          line-height: 1.6; 
          margin-bottom: 24px; 
          font-weight: 500; 
          text-align: center; 
        }

        .skeleton-grid { 
          display: flex;
          flex-direction: column;
          gap: 16px; 
          width: 100%;
        }

        .skeleton-module {
          background: #f8faf9; 
          border: 1px solid #e2e8f0; 
          border-radius: 16px; 
          padding: 20px 24px; 
          transition: transform 0.2s, box-shadow 0.2s;
          width: 100%; 
        }

        .skeleton-module:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.08); 
          background: #ffffff; 
        }

        .module-header { 
          display: flex; 
          gap: 12px; 
          align-items: center; 
          margin-bottom: 12px; 
          border-bottom: 1px solid rgba(0,0,0,0.04);
          padding-bottom: 12px;
        }

        .module-number { 
          font-family: 'Fraunces', serif; 
          font-size: 24px; 
          font-weight: 900; 
          line-height: 1; 
          opacity: 0.2; 
        }

        .module-header h4 { 
          font-size: 18px; 
          font-weight: 800; 
          color: #0f172a; 
          line-height: 1.2; 
        }

        .module-main-desc { 
          font-size: 14px; 
          color: #334155; 
          margin-bottom: 16px; 
          line-height: 1.6; 
          font-weight: 500;
        }

        .module-list { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
        }

        .sub-title { 
          font-size: 15px; 
          font-weight: 700; 
          color: #1e293b; 
          display: flex; 
          align-items: flex-start; 
          line-height: 1.4; 
        }

        .sub-desc { 
          font-size: 14px; 
          color: #64748b; 
          line-height: 1.6; 
          margin-left: 24px; 
          margin-top: 4px; 
          font-weight: 500; 
        }
      `}</style>

      {/* ══ PAGE HEADER ══ */}
      <div style={{ paddingTop: 30, background: "transparent" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 24px 0px", textAlign: "center" }}>
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,1)", color:"#059669", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 20px", borderRadius:50, marginBottom:24, boxShadow:"0 4px 12px rgba(0,0,0,0.03)" }}>
            Knowledge Hub
          </span>
          <h1 className="fr" style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Explore agricultural <br/> <span style={{ color:"#059669" }}>disciplines.</span>
          </h1>
          <p className="jk" style={{ marginTop: 20, fontSize: 18, color: "#475569", fontWeight: 500, lineHeight: 1.6, maxWidth: 600, margin: "20px auto 0" }}>
            Dive into specialized agricultural disciplines and explore our full curriculum structures.
          </p>

          {user && (
            <div style={{ marginTop: "24px", animation: "fadeIn 0.5s ease" }}>
              <button onClick={() => setShowUpload(true)} className="btn-green" style={{ padding: "14px 32px", fontSize: "16px", boxShadow: "0 8px 20px rgba(5, 150, 105, 0.3)" }}>
                <span style={{ fontSize: "20px" }}>🌿</span> Create a Topic
              </button>
            </div>
          )}

          <div className="search-container" style={{ marginTop: user ? "30px" : "0px" }}>
            <span className="search-icon">🔍</span>
            <input className="search-box" placeholder="Search topics or curriculums..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 100px", position: "relative", zIndex: 5 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading topics from database...</div>
        ) : (
          <>
            {search && (
              <p className="jk" style={{ fontSize: 16, color: "#475569", marginBottom: 32, fontWeight: 600, background: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: "12px", display: "inline-block" }}>
                Found <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> topics for "{search}"
              </p>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
              {filtered.map((t) => (
                <article key={t.id} className="topic-card" onClick={() => setSelected(t)} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
                  <div className="glow" style={{ background: t.accent }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "16px", background: hovered === t.id ? t.color : "#f8faf9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, transition: "all .3s" }}>
                      {t.icon}
                    </div>
                  </div>

                  <h3 className="fr" style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.2, wordBreak: "break-word" }}>{t.label}</h3>
                  
                  <p className="jk" style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, fontWeight: 500, marginBottom: 24, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>
                    {(t.desc || "").replace(/#|[-*]/g, "")}
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
                      <span className="jk" style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>👀 {t.reads} Views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "100px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
                <h3 className="fr" style={{ fontSize: 28, color: "#0f172a", fontWeight: 800 }}>No topics found</h3>
                <p className="jk" style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>We couldn't find anything matching your search.</p>
                <button className="btn-ghost" style={{ marginTop: 24, background:"rgba(255,255,255,0.8)" }} onClick={() => setSearch("")}>Clear Search</button>
              </div>
            )}
          </>
        )}
      </main>

      {showUpload && (
        <UploadTopicModal onClose={() => setShowUpload(false)} onSuccess={handleNewTopic} />
      )}

      {selected && !showUpload && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ '--accent-color': selected.accent }}>
            <button className="modal-close-btn" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-scroll-area">
              <div style={{ 
                padding: "48px 32px 24px", 
                background: `linear-gradient(180deg, ${selected.color} 0%, rgba(255,255,255,0) 100%)`, 
                textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                <div style={{ 
                  width: 72, height: 72, borderRadius: "20px", background: "#ffffff", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  fontSize: 36, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: 20
                }}>{selected.icon}</div>
                <h2 className="fr" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 16, wordBreak: "break-word" }}>
                  {selected.label}
                </h2>
              </div>
              <div style={{ padding: "0 32px 48px" }}> 
                <div className="modal-article-content">
                  {renderTopicContent(selected.desc || "", selected.accent)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}