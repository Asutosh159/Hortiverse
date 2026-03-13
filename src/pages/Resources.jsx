import { useState, useEffect } from "react";

const TYPE_CONFIG = {
  "Research Paper":  { icon: "📄", accent: "#0284c7", bg: "#e0f2fe" },
  "Book":            { icon: "📚", accent: "#d97706", bg: "#fef3c7" },
  "Popular Article": { icon: "📰", accent: "#059669", bg: "#ecfdf5" },
  "Other":           { icon: "📋", accent: "#be185d", bg: "#fce7f3" },
};

const FILTERS = ["All", "Research Paper", "Book", "Popular Article", "Other"];
const SORTS   = ["Most Recent", "A–Z"];

/* ── helper: validate Google Drive link ── */
const isDriveLink = (url) =>
  url.trim() !== "" &&
  (url.includes("drive.google.com") || url.includes("docs.google.com"));

/* ─── UPLOAD MODAL ──────────────────────────────────────── */
// 🟢 Notice we now pass the 'user' as a prop
function UploadModal({ onClose, onSuccess, user }) {
  const [type,    setType]    = useState("Research Paper");
  const [title,   setTitle]   = useState("");
  const [desc,    setDesc]    = useState("");
  const [link,    setLink]    = useState("");
  
  // 🟢 Pre-fill the author name if the user is logged in
  const [author,  setAuthor]  = useState(user ? user.full_name : "");
  
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim())      { setError("Please enter a title."); return; }
    if (!link.trim())       { setError("Please enter a Google Drive link."); return; }
    if (!isDriveLink(link)) { setError("Link must be a valid Google Drive or Google Docs URL."); return; }
    
    setError("");
    setLoading(true);
    
    const payload = {
      type,
      title: title.trim(),
      author: author.trim() || "Community Member",
      institution: "HortiVerse Community",
      year: new Date().getFullYear(),
      tags: [], 
      desc: desc.trim() || "No description provided.",
      drive_link: link.trim(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setLoading(false);
        setSuccess(true);
        onSuccess({ id: data.id, ...payload });
        setTimeout(onClose, 1800);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError("Failed to upload resource. Please try again.");
      setLoading(false);
    }
  };

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleOverlay} className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 540 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-scroll-area" style={{ padding: "40px 48px" }}>
          {success ? (
            <div style={{ textAlign:"center", padding:"40px 0", animation:"popIn .35s ease" }}>
              <div style={{ fontSize:64, marginBottom:20 }}>🌱</div>
              <h3 className="fr" style={{ fontSize:32, color:"#0f172a", marginBottom:12, fontWeight:800 }}>
                Resource Added!
              </h3>
              <p className="jk" style={{ fontSize:16, color:"#64748b", lineHeight:1.7, fontWeight:500 }}>
                Your resource is now live in the library. Thank you for cultivating knowledge!
              </p>
            </div>
          ) : (
            <>
              {/* header */}
              <div style={{ marginBottom: 32 }}>
                <span className="tag-badge" style={{ background:"rgba(5,150,105,0.1)", color:"#059669", marginBottom:12 }}>Contribution</span>
                <h2 className="fr" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight:900, color:"#0f172a", lineHeight:1.1, marginBottom:8 }}>
                  Share a <span style={{ color:"#059669" }}>Resource</span>
                </h2>
                <p className="jk" style={{ fontSize:15, color:"#64748b", fontWeight:500 }}>
                  Add a Google Drive link to expand the community library.
                </p>
              </div>

              {/* error */}
              {error && (
                <div style={{ fontSize:14, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:24, display:"flex", gap:8, alignItems:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              {/* resource type */}
              <div style={{ marginBottom:24 }}>
                <label style={LABEL}>Resource Type</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {Object.entries(TYPE_CONFIG).map(([t, cfg]) => (
                    <button key={t} onClick={() => setType(t)} style={{
                      padding:"10px 16px", borderRadius:50, cursor:"pointer",
                      border:`1px solid ${type===t?cfg.accent:"#e2e8f0"}`,
                      background: type===t ? cfg.bg : "#ffffff",
                      color: type===t ? cfg.accent : "#475569",
                      fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700,
                      display:"flex", alignItems:"center", gap:6, transition:"all .2s",
                      boxShadow: type===t ? `0 4px 12px ${cfg.accent}22` : "none",
                    }}>
                      <span style={{ fontSize: 16 }}>{cfg.icon}</span> {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* title */}
              <div style={{ marginBottom:20 }}>
                <label style={LABEL}>Title <span style={{ color:"#ef4444" }}>*</span></label>
                <input className="input-modern" placeholder="Enter the resource title…"
                  value={title} onChange={e=>{setTitle(e.target.value);setError("");}}
                />
              </div>

              {/* author */}
              <div style={{ marginBottom:20 }}>
                <label style={LABEL}>Author / Source <span style={{ color:"#94a3b8", fontWeight:500, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                <input className="input-modern" placeholder="Original author or your name…"
                  value={author} onChange={e=>setAuthor(e.target.value)}
                />
              </div>

              {/* description */}
              <div style={{ marginBottom:20 }}>
                <label style={LABEL}>Description <span style={{ color:"#94a3b8", fontWeight:500, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                <textarea className="input-modern" style={{ resize:"vertical", lineHeight:1.6, minHeight: "100px" }}
                  placeholder="Briefly describe what this resource covers…"
                  value={desc} onChange={e=>setDesc(e.target.value)}
                />
              </div>

              {/* google drive link */}
              <div style={{ marginBottom:32 }}>
                <label style={LABEL}>Google Drive Link <span style={{ color:"#ef4444" }}>*</span></label>
                <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                  <span style={{ position:"absolute", left:16, fontSize:18, pointerEvents:"none", color:"#94a3b8" }}>🔗</span>
                  <input className="input-modern" style={{ paddingLeft: 46 }}
                    placeholder="https://drive.google.com/file/d/…"
                    value={link}
                    onChange={e=>{setLink(e.target.value);setError("");}}
                  />
                </div>
                <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:"#64748b", marginTop:8, fontWeight:500 }}>
                  💡 Ensure your Drive file is set to <strong style={{ color:"#059669", fontWeight: 700 }}>"Anyone with link can view"</strong>
                </p>
              </div>

              {/* submit */}
              <button className="btn-green" onClick={handleSubmit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16 }}>
                {loading ? "Verifying link..." : "🌿 Publish to Library"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* shared styles for modal inputs */
const LABEL = {
  display:"block", fontFamily:"'Plus Jakarta Sans',sans-serif",
  fontSize:12, fontWeight:700, color:"#334155", 
  letterSpacing:".05em", textTransform:"uppercase", marginBottom:8,
};

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function Resources() {
  const [resources,    setResources]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort,   setActiveSort]   = useState("Most Recent");
  const [search,       setSearch]       = useState("");
  const [showUpload,   setShowUpload]   = useState(false);
  
  // 🟢 ADDED: User state to check if logged in
  const [user, setUser] = useState(null);

  // 🟢 FETCH USER & RESOURCES ON LOAD
  useEffect(() => {
    // Check login status
    const storedUser = localStorage.getItem("hv_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch resources
    const fetchResources = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resources");
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  /* filter + search + sort */
  const displayed = resources
    .filter(r => activeFilter === "All" || r.type === activeFilter)
    .filter(r =>
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      (r.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (activeSort === "A–Z") return a.title.localeCompare(b.title);
      return b.id - a.id; // Sorting by ID naturally sorts by "Most Recent"
    });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "All" ? resources.length : resources.filter(r => r.type === f).length;
    return acc;
  }, {});

  const handleNewResource = (newRes) => {
    setResources(prev => [newRes, ...prev]);
  };

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

      {/* ════ GLOBAL STYLES ════ */}
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
        .res-card {
          background: rgba(255, 255, 255, 0.85); 
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 20px; 
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
          display: flex; flex-direction: column;
        }
        .res-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 2px rgba(16, 185, 129, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

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

        /* Buttons */
        .btn-green {
          background: #059669; color: #fff; border: none; cursor: pointer; border-radius: 50px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; 
          padding: 12px 28px; transition: all .2s ease; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .btn-green:hover { background: #047857; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3); }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.6); color: #334155; border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif; 
          font-weight: 600; font-size: 14px; padding: 12px 28px; transition: all .2s ease;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { background: #ffffff; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .input-modern {
          width: 100%; padding: 14px 18px; background: #f8faf9;
          border: 1px solid #e2e8f0; border-radius: 12px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #111827;
          transition: all 0.2s; font-weight: 500;
        }
        .input-modern:focus { background: #fff; border-color: #059669; box-shadow: 0 0 0 4px rgba(5,150,105,0.1); }

        /* Filters & Sort */
        .fpill {
          background: rgba(255,255,255,0.6); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.9); color: #475569;
          padding: 8px 20px; border-radius: 50px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
          font-weight: 600; transition: all .2s; display: flex; align-items: center; gap: 8px;
        }
        .fpill:hover { background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .fpill.on { background: #059669; color: #fff; border-color: transparent; box-shadow: 0 4px 16px rgba(5,150,105,0.3); }
        .fpill.on .pc { background: rgba(255,255,255,0.25); color: #fff; }
        .pc {
          background: rgba(0,0,0,0.05); color: #64748b;
          font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }

        .sort-b {
          background: transparent; color: #64748b; border: none; padding: 8px 12px;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
          font-weight: 600; transition: all .2s; border-radius: 8px;
        }
        .sort-b:hover { color: #0f172a; background: rgba(0,0,0,0.03); }
        .sort-b.on { color: #059669; background: rgba(5,150,105,0.1); }

        .res-tag {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; 
          padding: 6px 14px; border-radius: 50px; border: 1px solid transparent;
          background: #f1f5f9; color: #475569; transition: all 0.2s;
        }
        .res-card:hover .res-tag { background: #ffffff; border-color: #e2e8f0; }

        .type-badge {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; 
          padding: 6px 14px; border-radius: 50px; letter-spacing: .05em; text-transform: uppercase; 
          display: inline-flex; align-items: center; gap: 6px;
        }

        /* ── MODAL SYSTEM ── */
        .modal-overlay {
          position: fixed; top: 72px; left: 0; right: 0; bottom: 0;
          z-index: 900; background: rgba(15, 23, 42, 0.4); 
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          display: flex; justify-content: center; align-items: center; 
          padding: 40px 20px; animation: fadeIn .3s ease-out;
        }
        .modal-box {
          background: #ffffff; border-radius: 24px; width: 100%;
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
        .modal-close-btn:hover { background: #ffffff; color: #ef4444; transform: scale(1.1); }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>


      {/* ══ PAGE HEADER ══ */}
      <div style={{ paddingTop: 72, background: "transparent" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 0px", textAlign: "center" }}>
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,1)", color:"#059669", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 20px", borderRadius:50, marginBottom:24, boxShadow:"0 4px 12px rgba(0,0,0,0.03)" }}>
            Knowledge Library
          </span>
          <h1 className="fr" style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Curated Research & <br/> <span style={{ color:"#059669" }}>Tools.</span>
          </h1>
          <p className="jk" style={{ marginTop: 20, fontSize: 18, color: "#475569", fontWeight: 500, lineHeight: 1.6, maxWidth: 600, margin: "20px auto 0" }}>
            Access academic papers, guidebooks, and community-uploaded tools. Everything a horticulture student needs.
          </p>

          {/* 🟢 ADDED: Upload Button (Only shows if user is logged in) */}
          {user && (
            <div style={{ marginTop: "24px", animation: "fadeIn 0.5s ease" }}>
              <button 
                onClick={() => setShowUpload(true)} 
                className="btn-green"
                style={{ padding: "14px 32px", fontSize: "16px", boxShadow: "0 8px 20px rgba(5, 150, 105, 0.3)" }}
              >
                <span style={{ fontSize: "20px" }}>➕</span> Share a Resource
              </button>
            </div>
          )}

          <div className="search-container" style={{ marginTop: user ? "30px" : "0px" }}>
            <span className="search-icon">🔍</span>
            <input 
              className="search-box" 
              placeholder="Search titles, authors, or keywords..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* ══ FILTERS & GRID ══ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 100px", position: "relative", zIndex: 5 }}>
        
        {loading ? (
           <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b", fontSize: "18px" }}>
             Loading library from database...
           </div>
        ) : (
          <>
            {/* Filter Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {FILTERS.map(f => (
                  <button key={f} className={`fpill ${activeFilter===f?"on":""}`} onClick={() => setActiveFilter(f)}>
                    {f !== "All" && <span style={{ fontSize: 16 }}>{TYPE_CONFIG[f].icon}</span>}
                    {f}
                    <span className="pc">{counts[f]}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="jk" style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>Sort by:</span>
                {SORTS.map(s => (
                  <button key={s} className={`sort-b ${activeSort===s?"on":""}`} onClick={() => setActiveSort(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <p className="jk" style={{ fontSize: 16, color: "#475569", marginBottom: 32, fontWeight: 600 }}>
              Showing <strong style={{ color: "#0f172a" }}>{displayed.length}</strong> resources
              {activeFilter !== "All" && <> in <strong>{activeFilter}</strong></>}
              {search && <> for "<strong>{search}</strong>"</>}
            </p>

            {/* Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
              {displayed.map((r) => {
                const cfg = TYPE_CONFIG[r.type] || { icon: "📄", accent: "#475569", bg: "#f1f5f9" };
                return (
                  <article key={r.id} className="res-card">
                    
                    <div style={{ height: 6, background: cfg.accent }} />

                    <div style={{ padding: "32px 32px 24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: "16px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                          {cfg.icon}
                        </div>
                        <span className="jk" style={{ fontSize: 14, color: "#64748b", fontWeight: 700, background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
                          {r.year}
                        </span>
                      </div>

                      <span className="type-badge" style={{ background: cfg.bg, color: cfg.accent, alignSelf: "flex-start", marginBottom: 16 }}>{r.type}</span>

                      <h3 className="fr" style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.3 }}>
                        {r.title}
                      </h3>

                      <p className="jk" style={{ fontSize: 14, color: "#475569", marginBottom: 16, fontWeight: 500 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>{r.author}</strong>
                        {r.institution && ` · ${r.institution}`}
                      </p>

                      <p className="jk" style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, fontWeight: 400, marginBottom: 24, flexGrow: 1 }}>
                        {r.desc}
                      </p>

                      {/* Tags */}
                      {r.tags && r.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                          {r.tags.map(t => <span key={t} className="res-tag">{t}</span>)}
                        </div>
                      )}

                      {/* Drive Button */}
                      <a href={r.drive_link} target="_blank" rel="noopener noreferrer" 
                        className="btn-green" style={{ width: "100%", justifyContent: "center", background: "#f8faf9", color: cfg.accent, border: `1px solid ${cfg.bg}` }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = cfg.accent; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#f8faf9"; e.currentTarget.style.color = cfg.accent; }}
                      >
                        <span style={{ fontSize: 18 }}>👁️</span> View
                      </a>

                    </div>
                  </article>
                );
              })}
            </div>

            {/* Empty State */}
            {displayed.length === 0 && (
              <div style={{ textAlign: "center", padding: "100px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📂</div>
                <h3 className="fr" style={{ fontSize: 28, color: "#0f172a", fontWeight: 800 }}>No resources found</h3>
                <p className="jk" style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>Try adjusting your filters or search term.</p>
                <button className="btn-ghost" style={{ marginTop: 24, background:"rgba(255,255,255,0.8)" }} onClick={() => {setSearch(""); setActiveFilter("All");}}>Reset All</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ════ UPLOAD MODAL ════ */}
      {/* 🟢 Notice we pass user={user} into the modal */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onSuccess={handleNewResource} user={user} />
      )}
    </div>
  );
}