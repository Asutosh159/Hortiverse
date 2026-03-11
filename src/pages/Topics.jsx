import { useState } from "react";

/* ─── DATA ──────────────────────────────────────────────── */
const topics = [
  {
    id: 1, icon: "🌾", label: "Sustainable Farming",
    desc: "Eco-friendly practices and regenerative agriculture techniques for long-term soil health.",
    posts: 342, followers: 2840, color: "#e8f5e9", accent: "#43a047",
    subtopics: ["Composting", "Cover Crops", "No-Till Farming", "Organic Methods", "Water Conservation"],
    trending: ["Biochar Applications", "Regenerative Grazing", "Food Forest Design"],
  },
  {
    id: 2, icon: "🚜", label: "AgriTech & Innovation",
    desc: "Cutting-edge technology transforming how we grow, monitor, and distribute food.",
    posts: 218, followers: 1960, color: "#e3f2fd", accent: "#1976d2",
    subtopics: ["IoT Sensors", "Drone Farming", "AI in Agriculture", "Precision Farming", "Smart Irrigation"],
    trending: ["IoT in Rice Paddies", "Drone Seeding", "AI Pest Detection"],
  },
  {
    id: 3, icon: "🐄", label: "Livestock Management",
    desc: "Animal husbandry, welfare practices, and sustainable livestock systems.",
    posts: 189, followers: 1420, color: "#fff8e1", accent: "#f9a825",
    subtopics: ["Rotational Grazing", "Animal Welfare", "Dairy Farming", "Poultry", "Aquaculture"],
    trending: ["Holistic Grazing", "Free-Range Systems", "Pasture Restoration"],
  },
  {
    id: 4, icon: "🌽", label: "Crop Science",
    desc: "Cultivation techniques, plant genetics, and yield optimisation strategies.",
    posts: 456, followers: 3920, color: "#fce4ec", accent: "#c62828",
    subtopics: ["Seed Science", "Plant Breeding", "Hydroponics", "Companion Planting", "Soil Nutrition"],
    trending: ["CRISPR in Crops", "Vertical Farming", "Companion Planting"],
  },
  {
    id: 5, icon: "🌿", label: "Plant Pathology",
    desc: "Disease identification, prevention, and integrated pest management solutions.",
    posts: 167, followers: 1100, color: "#e8f5e9", accent: "#2e7d32",
    subtopics: ["Fungal Diseases", "Pest Control", "Biological Control", "Chemical Management", "Diagnostics"],
    trending: ["Biopesticides", "Early Disease Detection", "Microbiome Research"],
  },
  {
    id: 6, icon: "🌍", label: "Global Agriculture",
    desc: "Worldwide farming trends, food security challenges, and cross-cultural practices.",
    posts: 203, followers: 2200, color: "#e3f2fd", accent: "#0277bd",
    subtopics: ["Food Security", "Climate Adaptation", "Traditional Farming", "Agroforestry", "Trade Policy"],
    trending: ["Climate-Smart Farming", "Food Systems Design", "Indigenous Practices"],
  },
  {
    id: 7, icon: "💧", label: "Water & Irrigation",
    desc: "Water conservation, efficient irrigation systems, and watershed management.",
    posts: 134, followers: 980, color: "#e0f7fa", accent: "#00838f",
    subtopics: ["Drip Irrigation", "Rainwater Harvesting", "Aquifer Management", "Wetland Farming", "Flood Control"],
    trending: ["Deficit Irrigation", "Greywater Reuse", "Smart Drip Systems"],
  },
  {
    id: 8, icon: "🌱", label: "Seed & Nursery",
    desc: "Seed saving, nursery management, and propagation techniques for all scales.",
    posts: 98, followers: 760, color: "#f9fbe7", accent: "#558b2f",
    subtopics: ["Seed Saving", "Propagation", "Grafting", "Tissue Culture", "Germination"],
    trending: ["Open-Pollinated Seeds", "Grafting Techniques", "Seed Banks"],
  },
];

const avatarColors = ["#43a047","#2e7d32","#66bb6a","#388e3c","#1b5e20","#81c784"];

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function Topics() {
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [hovered,   setHovered]   = useState(null);
  const [following, setFollowing] = useState([]);

  const filtered = topics.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (id, e) => {
    e.stopPropagation();
    setFollowing((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"linear-gradient(135deg,#f0faf0 0%,#e8f5e8 40%,#f5f8ff 100%)", minHeight:"100vh", color:"#1a2e1a" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#f0faf0; }
        ::-webkit-scrollbar-thumb { background:#a8d8a8; border-radius:3px; }
        .fr { font-family:'Fraunces',serif; }
        .jk { font-family:'Plus Jakarta Sans',sans-serif; }

        .topic-card {
          background: rgba(255,255,255,0.68);
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          border: 1.5px solid rgba(255,255,255,0.9);
          box-shadow: 0 4px 24px rgba(60,140,60,0.08);
          border-radius: 24px; padding: 28px;
          cursor: pointer; transition: all .38s cubic-bezier(0.23,1,0.32,1);
          position: relative; overflow: hidden;
        }
        .topic-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 24px 60px rgba(60,140,60,0.18);
        }
        .topic-card .glow {
          position: absolute; top: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          filter: blur(40px); opacity: 0; transition: opacity .4s;
          pointer-events: none;
        }
        .topic-card:hover .glow { opacity: 0.25; }

        .btn-green {
          background: linear-gradient(135deg,#43a047,#1b5e20); color:#fff;
          border:none; cursor:pointer; border-radius:50px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          font-size:13px; padding:10px 24px; transition:all .3s;
          box-shadow:0 4px 18px rgba(67,160,71,.35);
          display:inline-flex; align-items:center; gap:6px; text-decoration:none;
        }
        .btn-green:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(67,160,71,.5); }

        .btn-ghost {
          background:rgba(255,255,255,.8); backdrop-filter:blur(10px);
          color:#2e7d32; border:1.5px solid rgba(67,160,71,.4);
          cursor:pointer; border-radius:50px;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          font-size:13px; padding:10px 24px; transition:all .3s;
          display:inline-flex; align-items:center; gap:6px; text-decoration:none;
        }
        .btn-ghost:hover { background:rgba(76,175,80,.1); border-color:#4caf50; }

        .btn-follow {
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          font-size:12px; padding:7px 18px; border-radius:50px; cursor:pointer;
          transition:all .25s; border:1.5px solid;
        }
        .btn-follow.off {
          background:rgba(255,255,255,.8); color:#43a047;
          border-color:rgba(67,160,71,.4);
        }
        .btn-follow.off:hover { background:rgba(76,175,80,.1); }
        .btn-follow.on {
          background:linear-gradient(135deg,#43a047,#1b5e20); color:#fff;
          border-color:transparent; box-shadow:0 3px 12px rgba(67,160,71,.3);
        }

        .subtopic-tag {
          display:inline-block; background:rgba(76,175,80,.1);
          color:#2e7d32; border:1px solid rgba(76,175,80,.2);
          font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:500;
          padding:5px 14px; border-radius:20px; transition:all .2s; cursor:pointer;
        }
        .subtopic-tag:hover { background:rgba(76,175,80,.2); border-color:rgba(76,175,80,.4); }

        .trending-item {
          display:flex; align-items:center; gap:10; padding:10px 14px;
          background:rgba(255,255,255,.6); backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,.88); border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:500;
          color:#1a3a1a; transition:all .25s; cursor:pointer;
        }
        .trending-item:hover { background:rgba(255,255,255,.9); transform:translateX(4px); }

        .search-box {
          background:rgba(255,255,255,.82); backdrop-filter:blur(16px);
          border:1.5px solid rgba(255,255,255,.9); border-radius:50px;
          padding:12px 22px 12px 48px; width:100%; max-width:340px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          color:#1a3a1a; outline:none; transition:border-color .3s;
        }
        .search-box::placeholder { color:#9aba9a; }
        .search-box:focus { border-color:rgba(76,175,80,.55); }

        .nav-bar {
          position:fixed; top:0; left:0; right:0; z-index:500; height:66px;
          background:rgba(255,255,255,0.97); backdrop-filter:blur(32px);
          border-bottom:1.5px solid rgba(76,175,80,0.15);
          box-shadow:0 2px 20px rgba(60,140,60,.08);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 48px;
        }
        .nav-lk {
          color:#1a3a1a; text-decoration:none;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600;
          transition:color .2s; position:relative; padding-bottom:2px;
        }
        .nav-lk::after {
          content:''; position:absolute; bottom:-2px; left:0;
          width:0; height:2px; background:linear-gradient(90deg,#4caf50,#81c784);
          border-radius:2px; transition:width .28s;
        }
        .nav-lk:hover { color:#43a047; }
        .nav-lk:hover::after { width:100%; }
        .nav-lk.active { color:#43a047; }
        .nav-lk.active::after { width:100%; }

        /* ── MODAL ── */
        .modal-overlay {
          position:fixed; inset:0; z-index:900;
          background:rgba(10,30,10,0.55); backdrop-filter:blur(14px);
          display:flex; align-items:center; justify-content:center;
          padding:24px; animation:fadeIn .25s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal-box {
          background:rgba(255,255,255,0.96); backdrop-filter:blur(40px);
          border:1px solid rgba(255,255,255,.98);
          box-shadow:0 32px 100px rgba(20,60,20,.25);
          border-radius:28px; width:100%; max-width:680px;
          max-height:88vh; overflow-y:auto;
          animation:slideUp .3s cubic-bezier(0.23,1,0.32,1);
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .modal-box::-webkit-scrollbar { width:5px; }
        .modal-box::-webkit-scrollbar-thumb { background:#c8e6c9; border-radius:3px; }

        .section-chip {
          display:inline-block; background:rgba(76,175,80,.1); color:#2e7d32;
          border:1px solid rgba(76,175,80,.22);
          font-family:'Plus Jakarta Sans',sans-serif; font-size:11px;
          font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          padding:5px 16px; border-radius:50px; margin-bottom:14px;
        }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav className="nav-bar">
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#66bb6a,#1b5e20)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 12px rgba(76,175,80,.4)" }}>🌿</div>
          <span className="fr" style={{ fontSize:20, fontWeight:700, color:"#1a3a1a" }}>Horti<span style={{ color:"#43a047" }}>Verse</span></span>
        </a>
        <div style={{ display:"flex", gap:32 }}>
          {[["Home","/"],["Stories","/stories"],["Topics","/topics"],["Community","#"],["Resources","#"]].map(([n,h]) => (
            <a key={n} href={h} className={`nav-lk ${n==="Topics"?"active":""}`}>{n}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <a href="#" className="btn-ghost" style={{ padding:"8px 20px", fontSize:13 }}>Login</a>
          <a href="#" className="btn-green" style={{ padding:"8px 20px", fontSize:13 }}>Join Community ›</a>
        </div>
      </nav>

      {/* ══ PAGE HEADER ══ */}
      <div style={{ paddingTop:66, background:"linear-gradient(135deg,rgba(200,240,200,.5),rgba(240,255,240,.3))", borderBottom:"1px solid rgba(76,175,80,.1)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 48px 40px" }}>
          <span className="section-chip">Knowledge Hub</span>
          <h1 className="fr" style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:900, color:"#1a3a1a", lineHeight:1.05 }}>
            Explore <span style={{ color:"#43a047", fontStyle:"italic" }}>Topics</span>
          </h1>
          <p className="jk" style={{ marginTop:14, fontSize:16, color:"#5a7a5a", fontWeight:300, maxWidth:500 }}>
            Dive deep into specialised agricultural disciplines. Follow topics to get personalised story recommendations.
          </p>

          {/* stats */}
          <div style={{ display:"flex", gap:32, marginTop:28 }}>
            {[["🗂️","8","Topic categories"],["📖","1,800+","Total posts"],["👥","15K+","Topic followers"]].map(([ic,n,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{ic}</span>
                <div>
                  <div className="fr" style={{ fontSize:20, fontWeight:700, color:"#43a047", lineHeight:1 }}>{n}</div>
                  <div className="jk" style={{ fontSize:11, color:"#8aaa8a", marginTop:2 }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SEARCH BAR ══ */}
      <div style={{ position:"sticky", top:66, zIndex:400, background:"rgba(255,255,255,.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(76,175,80,.1)", padding:"14px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <p className="jk" style={{ fontSize:13, color:"#8aaa8a" }}>
            <strong style={{ color:"#43a047" }}>{filtered.length}</strong> topics available
            {following.length > 0 && <> · Following <strong style={{ color:"#1a3a1a" }}>{following.length}</strong></>}
          </p>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"#9aba9a" }}>🔍</span>
            <input className="search-box" placeholder="Search topics…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ══ TOPICS GRID ══ */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"48px 48px 100px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {filtered.map((t, i) => (
            <div key={t.id} className="topic-card" onClick={() => setSelected(t)}
              onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>

              {/* glow orb */}
              <div className="glow" style={{ background: t.accent }} />

              {/* top row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                <div style={{ width:56, height:56, borderRadius:16, background: hovered===t.id ? `${t.accent}22` : "rgba(76,175,80,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, transition:"all .3s" }}>
                  {t.icon}
                </div>
                <div style={{ textAlign:"right" }}>
                  <button className={`btn-follow ${following.includes(t.id)?"on":"off"}`}
                    onClick={(e) => toggleFollow(t.id, e)}>
                    {following.includes(t.id) ? "✓ Following" : "+ Follow"}
                  </button>
                </div>
              </div>

              {/* title + desc */}
              <h3 className="fr" style={{ fontSize:21, fontWeight:700, color:"#1a3a1a", marginBottom:8, lineHeight:1.25 }}>{t.label}</h3>
              <p className="jk" style={{ fontSize:13, color:"#6a8a6a", lineHeight:1.75, fontWeight:300, marginBottom:18 }}>{t.desc}</p>

              {/* subtopic tags */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
                {t.subtopics.slice(0,3).map((s) => (
                  <span key={s} className="subtopic-tag" onClick={(e) => e.stopPropagation()}>{s}</span>
                ))}
                {t.subtopics.length > 3 && (
                  <span className="subtopic-tag" style={{ background:"rgba(76,175,80,.05)", color:"#8aaa8a" }}>+{t.subtopics.length-3} more</span>
                )}
              </div>

              {/* footer stats + explore */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:"1px solid rgba(76,175,80,.1)" }}>
                <div style={{ display:"flex", gap:16 }}>
                  <span className="jk" style={{ fontSize:12, color:"#9aba9a" }}>📖 {t.posts} posts</span>
                  <span className="jk" style={{ fontSize:12, color:"#9aba9a" }}>👥 {(t.followers + (following.includes(t.id)?1:0)).toLocaleString()}</span>
                </div>
                <span className="jk" style={{ fontSize:12, color:"#43a047", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🔍</div>
            <h3 className="fr" style={{ fontSize:24, color:"#3a6a3a" }}>No topics found</h3>
            <p className="jk" style={{ color:"#8aaa8a", marginTop:8 }}>Try a different search term</p>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          TOPIC DETAIL MODAL
      ══════════════════════════════════════ */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            {/* modal header */}
            <div style={{ padding:"32px 32px 24px", background:`linear-gradient(135deg,${selected.color},rgba(255,255,255,0))`, borderRadius:"28px 28px 0 0", position:"relative" }}>
              <button onClick={() => setSelected(null)} style={{ position:"absolute", top:18, right:18, width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.9)", border:"none", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px rgba(0,0,0,.1)" }}>✕</button>

              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:64, height:64, borderRadius:18, background:`${selected.accent}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>{selected.icon}</div>
                <div>
                  <span className="section-chip" style={{ marginBottom:6 }}>Knowledge Hub</span>
                  <h2 className="fr" style={{ fontSize:28, fontWeight:900, color:"#1a3a1a", lineHeight:1.1 }}>{selected.label}</h2>
                </div>
              </div>
              <p className="jk" style={{ fontSize:15, color:"#4a6a4a", lineHeight:1.75, fontWeight:300 }}>{selected.desc}</p>

              {/* stats row */}
              <div style={{ display:"flex", gap:24, marginTop:18 }}>
                {[["📖",`${selected.posts} posts`],["👥",`${(selected.followers+(following.includes(selected.id)?1:0)).toLocaleString()} followers`]].map(([ic,l]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:16 }}>{ic}</span>
                    <span className="jk" style={{ fontSize:13, color:"#5a7a5a", fontWeight:500 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* modal body */}
            <div style={{ padding:"24px 32px 32px" }}>

              {/* all subtopics */}
              <div style={{ marginBottom:28 }}>
                <h3 className="fr" style={{ fontSize:18, fontWeight:700, color:"#1a3a1a", marginBottom:14 }}>📌 All Subtopics</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {selected.subtopics.map((s) => (
                    <span key={s} className="subtopic-tag" style={{ fontSize:13, padding:"7px 16px" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* trending */}
              <div style={{ marginBottom:28 }}>
                <h3 className="fr" style={{ fontSize:18, fontWeight:700, color:"#1a3a1a", marginBottom:14 }}>🔥 Trending Now</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {selected.trending.map((item, i) => (
                    <div key={item} className="trending-item">
                      <span style={{ width:22, height:22, borderRadius:"50%", background:selected.accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                      <span className="jk" style={{ fontSize:13, fontWeight:500, color:"#1a3a1a" }}>{item}</span>
                      <span style={{ marginLeft:"auto", fontSize:11, color:"#9aba9a", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Trending →</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* actions */}
              <div style={{ display:"flex", gap:12, paddingTop:20, borderTop:"1px solid rgba(76,175,80,.12)" }}>
                <button className="btn-green" style={{ flex:1, justifyContent:"center" }}
                  onClick={(e) => { toggleFollow(selected.id, e); }}>
                  {following.includes(selected.id) ? "✓ Following" : `+ Follow ${selected.label}`}
                </button>
                <button className="btn-ghost" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}