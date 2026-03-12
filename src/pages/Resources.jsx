// import { useState, useEffect, useRef } from "react";

// /* ─── MOCK DATA ─────────────────────────────────────────── */
// const resources = [
//   {
//     id: 1, type: "Research Paper",
//     title: "Vertical Farming in Urban Environments: A Systematic Review",
//     author: "Dr. Ananya Sharma", institution: "IARI, New Delhi",
//     year: 2024, views: 5620,
//     tags: ["Urban Farming", "Hydroponics", "Food Security"],
//     desc: "A comprehensive review of vertical farming systems, energy consumption, crop yields, and economic viability in dense urban settings across South Asia.",
//   },
//   {
//     id: 2, type: "Book",
//     title: "The Future of Sustainable Agriculture",
//     author: "Prof. James Whitfield", institution: "Oxford University Press",
//     year: 2023, views: 9870,
//     tags: ["Sustainability", "Policy", "Climate"],
//     desc: "An authoritative exploration of regenerative farming, policy frameworks, and the role of technology in building resilient global food systems.",
//   },
//   {
//     id: 3, type: "Popular Article",
//     title: "How IoT is Transforming Indian Agriculture",
//     author: "Priya Nair", institution: "AgriTech Today Magazine",
//     year: 2024, views: 18200,
//     tags: ["IoT", "Smart Farming", "India"],
//     desc: "A deep dive into how affordable sensor networks and mobile apps are empowering smallholder farmers across rural India to boost yields and cut waste.",
//   },
//   {
//     id: 4, type: "Research Paper",
//     title: "Soil Microbiome Dynamics Under Organic Management",
//     author: "Dr. Carlos Mendez", institution: "CIMMYT, Mexico",
//     year: 2023, views: 3140,
//     tags: ["Soil Science", "Organic Farming", "Microbiome"],
//     desc: "Longitudinal study tracking bacterial and fungal community shifts in organically managed maize fields over five growing seasons.",
//   },
//   {
//     id: 5, type: "Other",
//     title: "Drone-Assisted Crop Monitoring: A Practical Field Guide",
//     author: "Admin Upload", institution: "HortiVerse Community",
//     year: 2024, views: 7340,
//     tags: ["Drones", "Remote Sensing", "Precision Agriculture"],
//     desc: "A hands-on field manual covering drone selection, flight planning, NDVI analysis, and interpreting crop health data for smallholder farms.",
//   },
//   {
//     id: 6, type: "Popular Article",
//     title: "Regenerative Grazing: What the Research Actually Says",
//     author: "Lena Hoffman", institution: "Modern Farmer",
//     year: 2024, views: 14500,
//     tags: ["Livestock", "Regenerative", "Carbon Sequestration"],
//     desc: "Cutting through the noise — a balanced look at the science behind holistic planned grazing, soil carbon, and what it means for climate-smart ranching.",
//   },
//   {
//     id: 7, type: "Book",
//     title: "Plant Pathology: Principles and Practice",
//     author: "Dr. R.S. Singh", institution: "Oxford & IBH Publishing",
//     year: 2022, views: 6200,
//     tags: ["Plant Disease", "Pathology", "Crop Protection"],
//     desc: "The definitive textbook covering fungal, bacterial, viral, and nematode plant diseases, detection methods, and integrated disease management.",
//   },
//   {
//     id: 8, type: "Other",
//     title: "Hydroponic Nutrient Solution Calculator — Community Tool",
//     author: "User: @GreenLab_Ravi", institution: "HortiVerse Community",
//     year: 2024, views: 21000,
//     tags: ["Hydroponics", "Nutrition", "Tools"],
//     desc: "A community-contributed spreadsheet and guide for calculating optimal nutrient solutions for NFT, DWC, and media-bed hydroponic systems.",
//   },
//   {
//     id: 9, type: "Research Paper",
//     title: "Climate-Smart Rice Production in Flood-Prone Areas",
//     author: "Dr. Aiko Tanaka", institution: "IRRI, Philippines",
//     year: 2023, views: 4800,
//     tags: ["Rice", "Climate Adaptation", "Flood Tolerance"],
//     desc: "Field trials across Bangladesh and Vietnam evaluating submergence-tolerant rice varieties and water management strategies under extreme rainfall events.",
//   },
// ];

// const TYPE_CONFIG = {
//   "Research Paper":  { color: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9", icon: "📄" },
//   "Book":            { color: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9", icon: "📚" },
//   "Popular Article": { color: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9", icon: "📰" },
//   "Other":           { color: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9", icon: "📋" },
// };

// const FILTERS = ["All", "Research Paper", "Book", "Popular Article", "Other"];
// const SORTS   = ["Most Recent", "Most Viewed"];

// /* ─── COMPONENT ─────────────────────────────────────────── */
// export default function Resources() {
//   const [activeFilter,  setActiveFilter]  = useState("All");
//   const [activeSort,    setActiveSort]    = useState("Most Recent");
//   const [search,        setSearch]        = useState("");
//   const [visible,       setVisible]       = useState({});
//   const [hovered,       setHovered]       = useState(null);
//   const [showUpload,    setShowUpload]    = useState(false);
//   const [uploadType,    setUploadType]    = useState("Research Paper");
//   const [uploadTitle,   setUploadTitle]   = useState("");
//   const [uploadDesc,    setUploadDesc]    = useState("");
//   const [uploadTag,     setUploadTag]     = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const sectionRefs = useRef({});

//   /* intersection observer */
//   useEffect(() => {
//     const obs = new IntersectionObserver(
//       (entries) => entries.forEach((e) => {
//         if (e.isIntersecting) setVisible((p) => ({ ...p, [e.target.id]: true }));
//       }),
//       { threshold: 0.06 }
//     );
//     Object.values(sectionRefs.current).forEach((r) => r && obs.observe(r));
//     return () => obs.disconnect();
//   }, []);

//   const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

//   /* filter + sort + search */
//   const displayed = resources
//     .filter((r) => activeFilter === "All" || r.type === activeFilter)
//     .filter((r) =>
//       search === "" ||
//       r.title.toLowerCase().includes(search.toLowerCase()) ||
//       r.author.toLowerCase().includes(search.toLowerCase()) ||
//       r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
//     )
//     .sort((a, b) => {
//       if (activeSort === "Most Viewed") return b.views - a.views;
//       return b.year - a.year;
//     });

//   const handleUploadSubmit = () => {
//     if (!uploadTitle.trim()) return;
//     setUploadSuccess(true);
//     setTimeout(() => { setUploadSuccess(false); setShowUpload(false); setUploadTitle(""); setUploadDesc(""); setUploadTag(""); }, 2200);
//   };

//   /* ── type counts ── */
//   const counts = FILTERS.reduce((acc, f) => {
//     acc[f] = f === "All" ? resources.length : resources.filter((r) => r.type === f).length;
//     return acc;
//   }, {});

//   return (
//     <div style={{ fontFamily: "'Georgia',serif", background: "linear-gradient(160deg,#f0faf0 0%,#f7fbf7 40%,#f0f4ff 80%,#fdf8f0 100%)", minHeight: "100vh", paddingTop: 68 }}>

//       {/* ════ GLOBAL STYLES ════ */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: #f0faf0; }
//         ::-webkit-scrollbar-thumb { background: #a8d8a8; border-radius: 3px; }

//         .fr  { font-family: 'Fraunces', serif; }
//         .jk  { font-family: 'Plus Jakarta Sans', sans-serif; }

//         /* glass */
//         .glass {
//           background: rgba(255,255,255,0.62);
//           backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
//           border: 1px solid rgba(255,255,255,0.88);
//           box-shadow: 0 4px 24px rgba(60,140,60,0.07);
//         }

//         /* resource card */
//         .res-card {
//           background: rgba(255,255,255,0.72);
//           backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
//           border: 1px solid rgba(255,255,255,0.90);
//           box-shadow: 0 4px 24px rgba(60,130,60,0.08);
//           border-radius: 22px; overflow: hidden;
//           transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
//         }
//         .res-card:hover {
//           transform: translateY(-7px);
//           box-shadow: 0 24px 60px rgba(60,130,60,0.17);
//           border-color: rgba(120,190,120,0.45);
//           background: rgba(255,255,255,0.92);
//         }

//         /* filter pill */
//         .fpill {
//           background: rgba(255,255,255,0.65); backdrop-filter: blur(12px);
//           border: 1.5px solid rgba(255,255,255,0.85); color: #2d4a2d;
//           padding: 9px 20px; border-radius: 50px; cursor: pointer;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
//           font-weight: 600; transition: all .25s; display: flex;
//           align-items: center; gap: 7px;
//         }
//         .fpill:hover { background: rgba(76,175,80,.1); border-color: rgba(76,175,80,.5); }
//         .fpill.on {
//           background: linear-gradient(135deg,#43a047,#1b5e20);
//           color: #fff; border-color: transparent;
//           box-shadow: 0 4px 16px rgba(67,160,71,.38);
//         }
//         .fpill.on .pill-count { background: rgba(255,255,255,.25); color: #fff; }
//         .pill-count {
//           background: rgba(67,160,71,.12); color: #2e7d32;
//           font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
//         }

//         /* sort btn */
//         .sort-btn {
//           background: rgba(255,255,255,.65); backdrop-filter: blur(12px);
//           border: 1.5px solid rgba(255,255,255,.85); color: #2d4a2d;
//           padding: 9px 18px; border-radius: 50px; cursor: pointer;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
//           font-weight: 500; transition: all .22s;
//         }
//         .sort-btn:hover { border-color: rgba(76,175,80,.45); }
//         .sort-btn.on {
//           background: rgba(76,175,80,.1); border-color: rgba(76,175,80,.6);
//           color: #2e7d32; font-weight: 600;
//         }

//         /* search */
//         .search-wrap {
//           background: rgba(255,255,255,.82); backdrop-filter: blur(20px);
//           border: 1.5px solid rgba(255,255,255,.92);
//           box-shadow: 0 4px 20px rgba(60,140,60,.08);
//           border-radius: 50px; display: flex; align-items: center;
//           gap: 10px; padding: 0 20px; transition: border-color .3s;
//         }
//         .search-wrap:focus-within { border-color: rgba(76,175,80,.55); }
//         .search-input {
//           background: transparent; border: none; outline: none;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
//           color: #1a2e1a; padding: 13px 0; flex: 1; min-width: 0;
//         }
//         .search-input::placeholder { color: #9aba9a; }

//         /* btn-green */
//         .btn-green {
//           background: linear-gradient(135deg,#43a047,#1b5e20);
//           color: #fff; border: none; cursor: pointer;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
//           font-size: 13px; letter-spacing: .02em;
//           padding: 12px 26px; border-radius: 50px;
//           display: inline-flex; align-items: center; gap: 7px;
//           transition: all .3s; box-shadow: 0 4px 18px rgba(67,160,71,.36);
//           text-decoration: none;
//         }
//         .btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(67,160,71,.5); filter: brightness(1.05); }

//         /* tag */
//         .res-tag {
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px;
//           font-weight: 600; padding: 3px 11px; border-radius: 20px;
//           letter-spacing: .04em;
//         }

//         /* type badge */
//         .type-badge {
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px;
//           font-weight: 700; padding: 5px 13px; border-radius: 20px;
//           letter-spacing: .06em; text-transform: uppercase;
//           display: inline-flex; align-items: center; gap: 5px;
//         }

//         /* reveal */
//         .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
//         .reveal.on { opacity: 1; transform: translateY(0); }
//         .d1{transition-delay:.06s} .d2{transition-delay:.14s} .d3{transition-delay:.22s}
//         .d4{transition-delay:.30s} .d5{transition-delay:.38s} .d6{transition-delay:.46s}

//         /* modal overlay */
//         .overlay {
//           position: fixed; inset: 0; z-index: 900;
//           background: rgba(10,30,10,0.45); backdrop-filter: blur(8px);
//           display: flex; align-items: center; justify-content: center;
//           animation: fadeIn .25s ease;
//         }
//         @keyframes fadeIn { from{opacity:0} to{opacity:1} }
//         .modal {
//           background: rgba(255,255,255,.97); backdrop-filter: blur(40px);
//           border: 1px solid rgba(255,255,255,.98);
//           box-shadow: 0 32px 80px rgba(20,80,20,.22);
//           border-radius: 28px; padding: 44px 48px; width: 100%; max-width: 560px;
//           animation: slideUp .3s cubic-bezier(.23,1,.32,1);
//         }
//         @keyframes slideUp { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }

//         /* form input */
//         .f-input {
//           width: 100%; background: rgba(248,253,248,.9);
//           border: 1.5px solid rgba(76,175,80,.2); color: #1a2e1a;
//           padding: 13px 18px; border-radius: 14px; outline: none;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
//           transition: border-color .3s;
//         }
//         .f-input:focus { border-color: rgba(76,175,80,.6); background: #fff; }
//         .f-label { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px;
//           font-weight:600; color:#4a6a4a; letter-spacing:.06em;
//           text-transform:uppercase; margin-bottom:7px; display:block; }

//         /* type select */
//         .type-select-btn {
//           padding: 10px 18px; border-radius: 12px; cursor: pointer;
//           border: 1.5px solid rgba(76,175,80,.18); font-family:'Plus Jakarta Sans',sans-serif;
//           font-size: 13px; font-weight: 500; transition: all .22s;
//           background: rgba(248,253,248,.8); color: #2d4a2d;
//         }
//         .type-select-btn:hover { border-color:rgba(76,175,80,.45); }
//         .type-select-btn.on { background: linear-gradient(135deg,#43a047,#1b5e20); color:#fff; border-color:transparent; }

//         /* stat mini */
//         .stat-mini {
//           background: rgba(255,255,255,.55); backdrop-filter:blur(16px);
//           border:1px solid rgba(255,255,255,.88); border-radius:16px;
//           padding:20px 24px; text-align:center; transition:all .3s;
//         }
//         .stat-mini:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(60,140,60,.13); }

//         /* success tick */
//         .success-box {
//           background: linear-gradient(135deg,#e8f5e9,#c8e6c9);
//           border: 1.5px solid #81c784; border-radius:16px;
//           padding:20px 24px; text-align:center;
//           animation: popIn .3s cubic-bezier(.23,1,.32,1);
//         }
//         @keyframes popIn { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
//       `}</style>

//       {/* ════ HERO HEADER ════ */}
//       <section style={{
//         padding: "60px 52px 52px",
//         background: "linear-gradient(135deg,rgba(200,240,200,.55),rgba(180,220,255,.35),rgba(255,240,200,.3))",
//         backdropFilter: "blur(10px)",
//         borderBottom: "1px solid rgba(120,190,120,.15)",
//         position: "relative", overflow: "hidden",
//       }}>
//         {/* bg deco */}
//         <div style={{ position:"absolute", top:-60, right:-40, fontSize:220, opacity:.04, pointerEvents:"none", transform:"rotate(15deg)" }}>📚</div>
//         <div style={{ position:"absolute", bottom:-40, left:-20, fontSize:180, opacity:.04, pointerEvents:"none", transform:"rotate(-10deg)" }}>📄</div>

//         <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:24 }}>

//             {/* left */}
//             <div>
//               <div className="glass" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"7px 18px", borderRadius:50, marginBottom:20 }}>
//                 <span style={{ fontSize:14 }}>📖</span>
//                 <span className="jk" style={{ fontSize:11, color:"#43a047", fontWeight:700, letterSpacing:".1em" }}>KNOWLEDGE LIBRARY</span>
//               </div>
//               <h1 className="fr" style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:900, color:"#1a3a1a", lineHeight:1.05, marginBottom:14 }}>
//                 Resources &<br /><span style={{ color:"#43a047", fontStyle:"italic" }}>Research Hub</span>
//               </h1>
//               <p className="jk" style={{ fontSize:15, color:"#5a7a5a", maxWidth:500, lineHeight:1.8, fontWeight:300 }}>
//                 Curated research papers, books, articles, and community uploads — everything a horticulture student needs in one place.
//               </p>
//             </div>

//             {/* right — upload CTA */}
//             <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"flex-end" }}>
//               <button className="btn-green" onClick={() => setShowUpload(true)} style={{ fontSize:14, padding:"14px 30px" }}>
//                 <span style={{ fontSize:16 }}>⬆️</span> Upload Resource
//               </button>
//               <p className="jk" style={{ fontSize:12, color:"#8ab88a", fontWeight:300, textAlign:"right" }}>
//                 Share knowledge with 48,000+ students
//               </p>
//             </div>
//           </div>

//           {/* mini stats row */}
//           <div id="res-stats" ref={setRef("res-stats")}
//             style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:40 }}>
//             {[
//               { n:"9+",    l:"Resources",     icon:"📂", c:"#2e7d32" },
//               { n:"48K+",  l:"Total Views",   icon:"👁️", c:"#2e7d32" },
//               { n:"4",     l:"Content Types", icon:"🗂️", c:"#2e7d32" },
//               { n:"Free",  l:"Open Access",   icon:"🔓", c:"#2e7d32" },
//             ].map((s, i) => (
//               <div key={s.l} className={`stat-mini reveal d${i+1} ${visible["res-stats"] ? "on" : ""}`}>
//                 <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
//                 <div className="fr" style={{ fontSize:28, fontWeight:700, color:s.c, lineHeight:1 }}>{s.n}</div>
//                 <div className="jk" style={{ fontSize:12, color:"#7a9a7a", marginTop:5, fontWeight:400 }}>{s.l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ════ FILTERS + SEARCH ════ */}
//       <section style={{ padding:"36px 52px 0", position:"sticky", top:68, zIndex:200,
//         background:"rgba(248,253,248,.92)", backdropFilter:"blur(20px)",
//         borderBottom:"1px solid rgba(120,190,120,.12)" }}>
//         <div style={{ maxWidth:1200, margin:"0 auto" }}>

//           {/* search bar */}
//           <div className="search-wrap" style={{ marginBottom:20 }}>
//             <span style={{ fontSize:18, opacity:.5 }}>🔍</span>
//             <input
//               className="search-input"
//               placeholder="Search by title, author, or topic…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9aba9a", padding:"4px 8px" }}>✕</button>
//             )}
//           </div>

//           {/* type filters + sort */}
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:20, flexWrap:"wrap", gap:12 }}>
//             <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//               {FILTERS.map((f) => (
//                 <button key={f} className={`fpill ${activeFilter === f ? "on" : ""}`} onClick={() => setActiveFilter(f)}>
//                   <span>{TYPE_CONFIG[f]?.icon || "📂"}</span>
//                   {f}
//                   <span className="pill-count">{counts[f]}</span>
//                 </button>
//               ))}
//             </div>
//             <div style={{ display:"flex", gap:8, alignItems:"center" }}>
//               <span className="jk" style={{ fontSize:12, color:"#9aba9a", fontWeight:500 }}>Sort:</span>
//               {SORTS.map((s) => (
//                 <button key={s} className={`sort-btn ${activeSort === s ? "on" : ""}`} onClick={() => setActiveSort(s)}>{s}</button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ════ RESOURCE GRID ════ */}
//       <section style={{ padding:"40px 52px 100px" }}>
//         <div style={{ maxWidth:1200, margin:"0 auto" }}>

//           {/* results count */}
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
//             <p className="jk" style={{ fontSize:13, color:"#7a9a7a", fontWeight:400 }}>
//               Showing <span style={{ fontWeight:700, color:"#2e7d32" }}>{displayed.length}</span> resource{displayed.length !== 1 ? "s" : ""}
//               {activeFilter !== "All" && <span> in <span style={{ fontWeight:600, color:"#43a047" }}>{activeFilter}</span></span>}
//               {search && <span> matching "<span style={{ fontWeight:600, color:"#43a047" }}>{search}</span>"</span>}
//             </p>
//           </div>

//           {/* cards grid */}
//           {displayed.length === 0 ? (
//             <div style={{ textAlign:"center", padding:"80px 0" }}>
//               <div style={{ fontSize:60, marginBottom:16 }}>🔍</div>
//               <h3 className="fr" style={{ fontSize:24, color:"#1a3a1a", marginBottom:8 }}>No resources found</h3>
//               <p className="jk" style={{ fontSize:14, color:"#9aba9a" }}>Try a different search or filter</p>
//             </div>
//           ) : (
//             <div id="res-grid" ref={setRef("res-grid")}
//               style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
//               {displayed.map((r, i) => {
//                 const cfg = TYPE_CONFIG[r.type];
//                 return (
//                   <div key={r.id}
//                     className={`res-card reveal d${(i % 3) + 1} ${visible["res-grid"] ? "on" : ""}`}
//                     onMouseEnter={() => setHovered(r.id)}
//                     onMouseLeave={() => setHovered(null)}>

//                     {/* top color band — uniform green */}
//                     <div style={{
//                       height: 8,
//                       background: "linear-gradient(90deg,#43a047,#81c784)",
//                     }} />

//                     {/* icon area — uniform green tint */}
//                     <div style={{
//                       padding:"28px 28px 0",
//                       background:"linear-gradient(160deg,#e8f5e9,rgba(255,255,255,0))",
//                     }}>
//                       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
//                         {/* type badge — uniform green */}
//                         <span className="type-badge" style={{ background:"rgba(46,125,50,.12)", color:"#2e7d32" }}>
//                           {cfg.icon} {r.type}
//                         </span>
//                         {/* year */}
//                         <span className="jk" style={{ fontSize:12, color:"#9aba9a", fontWeight:500 }}>{r.year}</span>
//                       </div>

//                       {/* big icon */}
//                       <div style={{ fontSize:52, marginBottom:16, filter:"drop-shadow(0 4px 12px rgba(46,125,50,.25))",
//                         transform: hovered === r.id ? "scale(1.1) rotate(-3deg)" : "scale(1)", transition:"transform .35s" }}>
//                         {cfg.icon}
//                       </div>
//                     </div>

//                     {/* body */}
//                     <div style={{ padding:"0 28px 28px" }}>
//                       <h3 className="fr" style={{ fontSize:18, fontWeight:700, color:"#1a3a1a", lineHeight:1.35, marginBottom:10 }}>
//                         {r.title}
//                       </h3>
//                       <p className="jk" style={{ fontSize:12, color:"#6a8a6a", marginBottom:10, fontWeight:400 }}>
//                         <span style={{ fontWeight:600, color:"#2d4a2d" }}>{r.author}</span>
//                         <span style={{ color:"#aacaaa" }}> · {r.institution}</span>
//                       </p>
//                       <p className="jk" style={{ fontSize:13, color:"#6a8a6a", lineHeight:1.75, marginBottom:16, fontWeight:300 }}>
//                         {r.desc}
//                       </p>

//                       {/* tags */}
//                       <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
//                         {r.tags.map((t) => (
//                           <span key={t} className="res-tag" style={{ background:"rgba(46,125,50,.1)", color:"#2e7d32" }}>
//                             {t}
//                           </span>
//                         ))}
//                       </div>

//                       {/* views only */}
//                       <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20 }}>
//                         <span style={{ fontSize:14 }}>👁️</span>
//                         <span className="jk" style={{ fontSize:12, color:"#8aaa8a" }}>
//                           <span style={{ fontWeight:600, color:"#2d4a2d" }}>{r.views.toLocaleString()}</span> views
//                         </span>
//                       </div>

//                       {/* single Read button */}
//                       <button className="btn-green" style={{ width:"100%", justifyContent:"center", padding:"12px 16px", fontSize:13 }}>
//                         👁️ Read Resource
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ════ UPLOAD MODAL ════ */}
//       {showUpload && (
//         <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowUpload(false); }}>
//           <div className="modal">
//             {uploadSuccess ? (
//               <div className="success-box">
//                 <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
//                 <h3 className="fr" style={{ fontSize:24, color:"#1b5e20", marginBottom:8 }}>Upload Submitted!</h3>
//                 <p className="jk" style={{ fontSize:14, color:"#4a6a4a", fontWeight:300 }}>Your resource has been sent for review. Thank you for contributing to the community!</p>
//               </div>
//             ) : (
//               <>
//                 {/* modal header */}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
//                   <div>
//                     <h2 className="fr" style={{ fontSize:28, fontWeight:700, color:"#1a3a1a", lineHeight:1.1 }}>
//                       Upload a<br /><span style={{ color:"#43a047", fontStyle:"italic" }}>Resource</span>
//                     </h2>
//                     <p className="jk" style={{ fontSize:13, color:"#8aaa8a", marginTop:6, fontWeight:300 }}>Share knowledge with the HortiVerse community</p>
//                   </div>
//                   <button onClick={() => setShowUpload(false)} style={{
//                     width:36, height:36, borderRadius:"50%", border:"1.5px solid rgba(76,175,80,.25)",
//                     background:"rgba(255,255,255,.8)", cursor:"pointer", fontSize:16, color:"#7a9a7a",
//                     display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s",
//                   }}
//                     onMouseEnter={(e) => { e.currentTarget.style.background="#fee"; e.currentTarget.style.color="#c00"; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,.8)"; e.currentTarget.style.color="#7a9a7a"; }}
//                   >✕</button>
//                 </div>

//                 {/* type selector */}
//                 <div style={{ marginBottom:22 }}>
//                   <label className="f-label">Resource Type</label>
//                   <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//                     {["Research Paper","Book","Popular Article","Other"].map((t) => (
//                       <button key={t} className={`type-select-btn ${uploadType === t ? "on" : ""}`}
//                         onClick={() => setUploadType(t)}>
//                         {TYPE_CONFIG[t].icon} {t}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* title */}
//                 <div style={{ marginBottom:18 }}>
//                   <label className="f-label">Title *</label>
//                   <input className="f-input" placeholder="Enter resource title…"
//                     value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
//                 </div>

//                 {/* author + year row */}
//                 <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
//                   <div>
//                     <label className="f-label">Author / Publisher</label>
//                     <input className="f-input" placeholder="Your name or author…" />
//                   </div>
//                   <div>
//                     <label className="f-label">Year</label>
//                     <input className="f-input" placeholder="e.g. 2024" type="number" min="1900" max="2030" />
//                   </div>
//                 </div>

//                 {/* description */}
//                 <div style={{ marginBottom:18 }}>
//                   <label className="f-label">Short Description</label>
//                   <textarea className="f-input" placeholder="Briefly describe this resource…" rows={3}
//                     style={{ resize:"vertical", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
//                     value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} />
//                 </div>

//                 {/* tags */}
//                 <div style={{ marginBottom:18 }}>
//                   <label className="f-label">Tags (comma separated)</label>
//                   <input className="f-input" placeholder="e.g. Hydroponics, Urban Farming, IoT"
//                     value={uploadTag} onChange={(e) => setUploadTag(e.target.value)} />
//                 </div>

//                 {/* file upload area */}
//                 <div style={{
//                   border:"2px dashed rgba(76,175,80,.35)", borderRadius:16,
//                   padding:"28px", textAlign:"center", marginBottom:24,
//                   background:"rgba(76,175,80,.04)", cursor:"pointer",
//                   transition:"all .25s",
//                 }}
//                   onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(76,175,80,.7)"; e.currentTarget.style.background="rgba(76,175,80,.08)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(76,175,80,.35)"; e.currentTarget.style.background="rgba(76,175,80,.04)"; }}
//                 >
//                   <div style={{ fontSize:32, marginBottom:8 }}>📎</div>
//                   <p className="jk" style={{ fontSize:13, color:"#5a7a5a", fontWeight:500 }}>Drag & drop your file here</p>
//                   <p className="jk" style={{ fontSize:11, color:"#9aba9a", marginTop:4, fontWeight:300 }}>PDF, DOC, DOCX, EPUB · Max 50MB</p>
//                   <button style={{
//                     marginTop:12, background:"rgba(76,175,80,.1)", border:"1px solid rgba(76,175,80,.3)",
//                     color:"#2e7d32", padding:"8px 20px", borderRadius:50, cursor:"pointer",
//                     fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:600,
//                   }}>Browse Files</button>
//                 </div>

//                 {/* submit */}
//                 <button className="btn-green" style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:14 }}
//                   onClick={handleUploadSubmit}>
//                   🌿 Submit for Review
//                 </button>
//                 <p className="jk" style={{ fontSize:11, color:"#aacaaa", textAlign:"center", marginTop:10, fontWeight:300 }}>
//                   Resources are reviewed by admins before being published
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";

/* ─── MOCK DATA ─────────────────────────────────────────── */
const INITIAL_RESOURCES = [
  {
    id: 1, type: "Research Paper",
    title: "Vertical Farming in Urban Environments: A Systematic Review",
    author: "Dr. Ananya Sharma", institution: "IARI, New Delhi",
    year: 2024,
    tags: ["Urban Farming", "Hydroponics", "Food Security"],
    desc: "A comprehensive review of vertical farming systems, energy consumption, crop yields, and economic viability in dense urban settings across South Asia.",
    drive_link: "https://drive.google.com/file/d/example1",
  },
  {
    id: 2, type: "Book",
    title: "The Future of Sustainable Agriculture",
    author: "Prof. James Whitfield", institution: "Oxford University Press",
    year: 2023,
    tags: ["Sustainability", "Policy", "Climate"],
    desc: "An authoritative exploration of regenerative farming, policy frameworks, and the role of technology in building resilient global food systems.",
    drive_link: "https://drive.google.com/file/d/example2",
  },
  {
    id: 3, type: "Popular Article",
    title: "How IoT is Transforming Indian Agriculture",
    author: "Priya Nair", institution: "AgriTech Today Magazine",
    year: 2024,
    tags: ["IoT", "Smart Farming", "India"],
    desc: "A deep dive into how affordable sensor networks and mobile apps are empowering smallholder farmers across rural India to boost yields and cut waste.",
    drive_link: "https://drive.google.com/file/d/example3",
  },
  {
    id: 4, type: "Research Paper",
    title: "Soil Microbiome Dynamics Under Organic Management",
    author: "Dr. Carlos Mendez", institution: "CIMMYT, Mexico",
    year: 2023,
    tags: ["Soil Science", "Organic Farming", "Microbiome"],
    desc: "Longitudinal study tracking bacterial and fungal community shifts in organically managed maize fields over five growing seasons.",
    drive_link: "https://drive.google.com/file/d/example4",
  },
  {
    id: 5, type: "Other",
    title: "Drone-Assisted Crop Monitoring: A Practical Field Guide",
    author: "Admin Upload", institution: "HortiVerse Community",
    year: 2024,
    tags: ["Drones", "Remote Sensing", "Precision Agriculture"],
    desc: "A hands-on field manual covering drone selection, flight planning, NDVI analysis, and interpreting crop health data for smallholder farms.",
    drive_link: "https://drive.google.com/file/d/example5",
  },
  {
    id: 6, type: "Popular Article",
    title: "Regenerative Grazing: What the Research Actually Says",
    author: "Lena Hoffman", institution: "Modern Farmer",
    year: 2024,
    tags: ["Livestock", "Regenerative", "Carbon Sequestration"],
    desc: "Cutting through the noise — a balanced look at the science behind holistic planned grazing, soil carbon, and what it means for climate-smart ranching.",
    drive_link: "https://drive.google.com/file/d/example6",
  },
  {
    id: 7, type: "Book",
    title: "Plant Pathology: Principles and Practice",
    author: "Dr. R.S. Singh", institution: "Oxford & IBH Publishing",
    year: 2022,
    tags: ["Plant Disease", "Pathology", "Crop Protection"],
    desc: "The definitive textbook covering fungal, bacterial, viral, and nematode plant diseases, detection methods, and integrated disease management.",
    drive_link: "https://drive.google.com/file/d/example7",
  },
  {
    id: 8, type: "Other",
    title: "Hydroponic Nutrient Solution Calculator — Community Tool",
    author: "User: @GreenLab_Ravi", institution: "HortiVerse Community",
    year: 2024,
    tags: ["Hydroponics", "Nutrition", "Tools"],
    desc: "A community-contributed spreadsheet and guide for calculating optimal nutrient solutions for NFT, DWC, and media-bed hydroponic systems.",
    drive_link: "https://drive.google.com/file/d/example8",
  },
  {
    id: 9, type: "Research Paper",
    title: "Climate-Smart Rice Production in Flood-Prone Areas",
    author: "Dr. Aiko Tanaka", institution: "IRRI, Philippines",
    year: 2023,
    tags: ["Rice", "Climate Adaptation", "Flood Tolerance"],
    desc: "Field trials across Bangladesh and Vietnam evaluating submergence-tolerant rice varieties and water management strategies under extreme rainfall events.",
    drive_link: "https://drive.google.com/file/d/example9",
  },
];

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
function UploadModal({ onClose, onSuccess }) {
  const [type,    setType]    = useState("Research Paper");
  const [title,   setTitle]   = useState("");
  const [desc,    setDesc]    = useState("");
  const [link,    setLink]    = useState("");
  const [author,  setAuthor]  = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!title.trim())      { setError("Please enter a title."); return; }
    if (!link.trim())       { setError("Please enter a Google Drive link."); return; }
    if (!isDriveLink(link)) { setError("Link must be a valid Google Drive or Google Docs URL."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSuccess({
        id:          Date.now(),
        type,
        title:       title.trim(),
        author:      author.trim() || "Community Member",
        institution: "HortiVerse Community",
        year:        new Date().getFullYear(),
        tags:        [],
        desc:        desc.trim() || "No description provided.",
        drive_link:  link.trim(),
      });
      setTimeout(onClose, 1800);
    }, 900);
  };

  /* close on overlay click */
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
  const [resources,    setResources]    = useState(INITIAL_RESOURCES);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort,   setActiveSort]   = useState("Most Recent");
  const [search,       setSearch]       = useState("");
  const [showUpload,   setShowUpload]   = useState(false);

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
      return b.year - a.year;
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
          {[["Home","/"],["Stories","/stories"],["Topics","/topics"],["Resources","/resources"]].map(([n,h]) => (
            <a key={n} href={h} className={`nav-lk ${n==="Resources"?"active":""}`}>{n}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <a href="#" className="btn-ghost">Log in</a>
          <button onClick={() => setShowUpload(true)} className="btn-green">Upload Resource</button>
        </div>
      </nav>

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

          {/* Prominent Search Bar */}
          <div className="search-container">
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
                
                {/* Card Top Banner */}
                <div style={{ height: 6, background: cfg.accent }} />

                <div style={{ padding: "32px 32px 24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  
                  {/* Meta header */}
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
      </main>

      {/* ════ UPLOAD MODAL ════ */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onSuccess={handleNewResource} />
      )}
    </div>
  );
}