import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect } from "react";
import Footer from '../components/Footer';

// Pre-defined themes
const THEMES = [
  { name: "Emerald", bg: "#ecfdf5", accent: "#059669" },
  { name: "Ocean",   bg: "#e0f2fe", accent: "#0284c7" },
  { name: "Amber",   bg: "#fef3c7", accent: "#d97706" },
  { name: "Purple",  bg: "#f3e8ff", accent: "#7e22ce" },
  { name: "Rose",    bg: "#fce7f3", accent: "#be185d" }
];

// PRE-DEFINED ICON PACK FOR USERS TO CHOOSE FROM
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

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-10 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-[24px] w-full max-w-[700px] max-h-[85vh] flex flex-col relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        
        <button className="absolute top-5 right-5 z-[100] w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-slate-900 text-xl flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:bg-white hover:text-emerald-600 hover:scale-110 active:scale-95" onClick={onClose}>✕</button>

        <div className="overflow-y-auto overflow-x-hidden grow w-full break-words custom-scrollbar p-6 md:p-12">
          {success ? (
            <div className="text-center py-10 animate-[popIn_0.35s_ease]">
              <div className="text-[64px] mb-5 animate-bounce">✨</div>
              <h3 className="font-['Lora',serif] text-[32px] text-slate-900 mb-3 font-extrabold">Topic Created!</h3>
              <p className="font-['Manrope',sans-serif] text-base text-slate-500 leading-[1.7] font-medium">Your new category is now live in the Knowledge Hub.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-block bg-emerald-600/10 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">New Category</span>
                <h2 className="font-['Lora',serif] text-[clamp(28px,4vw,36px)] font-black text-slate-900 leading-[1.1] mb-2">
                  Create a <span className="text-emerald-600">Topic</span>
                </h2>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex gap-2 items-center font-['Plus_Jakarta_Sans',sans-serif] font-semibold">
                  <span>⚠</span> {error}
                </div>
              )}

              <div className="flex gap-5 mb-4 flex-wrap">
                <div className="w-[80px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Icon</label>
                  <input className="w-full text-center text-[24px] p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" value={icon} onChange={e=>setIcon(e.target.value)} maxLength={2} />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Topic Name <span className="text-red-500">*</span></label>
                  <input className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" placeholder="e.g., Nursery Management" value={label} onChange={e=>{setLabel(e.target.value);setError("");}} />
                </div>
              </div>

              {/* QUICK ICON SELECT */}
              <div className="mb-6">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Quick Icon Select</label>
                <div className="flex gap-2 flex-wrap bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {ICON_PACK.map(ico => (
                    <button 
                      key={ico} type="button" onClick={() => setIcon(ico)} 
                      className={`w-[42px] h-[42px] text-[20px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 ${icon === ico ? 'bg-emerald-600/15 border border-emerald-600 shadow-[0_0_0_1px_#059669]' : 'bg-white border border-slate-200 shadow-sm'}`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Color Theme</label>
                <div className="flex gap-3 flex-wrap">
                  {THEMES.map(theme => (
                    <button type="button" key={theme.name} onClick={() => setSelectedTheme(theme)} 
                    style={{ background: theme.bg, color: theme.accent, borderColor: selectedTheme.name === theme.name ? theme.accent : 'transparent' }}
                    className="px-4 py-2 rounded-full border-2 font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-95">
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Skeleton / Content <span className="text-red-500">*</span></label>
                <p className="text-xs text-slate-500 mb-2 font-['Plus_Jakarta_Sans',sans-serif] leading-[1.5]">
                  💡 <strong>Pro Tip:</strong> Type <code>##</code> for a Main Heading, <code>-</code> for a Subheading, and <code>*</code> for Bullet Points!
                </p>
                <textarea className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 resize-y leading-[1.6] min-h-[220px] font-mono"
                  placeholder={`## Raising Vegetable Nursery\n- Benefits of nursery\nThis is a description of the benefits...\n* Better germination rates\n* Healthier seedlings\n\n## Soil treatment`} 
                  value={description} onChange={e=>setDescription(e.target.value)} />
              </div>

              <div className="mb-8">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Tags <span className="text-slate-400 font-medium normal-case tracking-normal">(comma separated)</span></label>
                <input className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" placeholder="e.g., Soil, Greenhouse, Seeds" value={subtopics} onChange={e=>setSubtopics(e.target.value)} />
              </div>

              <button type="button" onClick={handleSubmit} disabled={loading} className="w-full justify-center bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base px-7 py-4 transition-all duration-300 inline-flex items-center gap-1.5 hover:bg-emerald-700 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(5,150,105,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
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

  // 🟢 FIXED: Scroll to top and prevent browser memory restoration
  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/topics`);
        const dbTopics = await res.json();
        
        const formattedTopics = dbTopics.map(t => ({
          id: t.id, icon: t.icon || "🌿", label: t.label || "Untitled Topic",
          reads: ((t.reads_count || 0) / 1000).toFixed(1) + "K",
          color: t.color || "#f8faf9", accent: t.accent || "#059669",
          subtopics: t.subtopics || [], desc: t.description || ""
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
    document.body.style.overflow = (selected || showUpload) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selected, showUpload]);

  const filtered = topics.filter((t) =>
    (t.label || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.desc || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.subtopics && t.subtopics.some(sub => sub.toLowerCase().includes(search.toLowerCase())))
  );

  const handleNewTopic = (newTopic) => setTopics(prev => [newTopic, ...prev]);

  // ADVANCED SKELETON PARSER
  const renderTopicContent = (text, accentColor) => {
    if (!text.includes("##")) {
      return text.split("\n\n").map((para, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} className="text-[14.5px] md:text-[15px] text-slate-600 leading-[1.65] font-medium text-justify mb-4 break-words font-['Plus_Jakarta_Sans',sans-serif]" />
      ));
    }

    const parts = text.split("## ");
    const introText = parts[0].trim();
    const modulesRaw = parts.slice(1);

    const modules = modulesRaw.map(modText => {
      const lines = modText.split("\n").filter(l => l.trim() !== "");
      const mainHeading = lines[0].trim();
      const items = [];
      let currentSubheading = null;
      let mainDesc = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const isSubheading = line.match(/^-\s+(.*)/);
        const isBulletPoint = line.match(/^\*\s+(.*)/);
        
        if (isSubheading) {
          if (currentSubheading) items.push(currentSubheading);
          currentSubheading = { title: isSubheading[1], desc: [], bullets: [] };
        } else if (isBulletPoint) {
          if (currentSubheading) currentSubheading.bullets.push(isBulletPoint[1]);
          else mainDesc.push(`• ${isBulletPoint[1]}`);
        } else {
          if (currentSubheading) currentSubheading.desc.push(line);
          else mainDesc.push(line); 
        }
      }
      if (currentSubheading) items.push(currentSubheading);
      return { mainHeading, mainDesc: mainDesc.join(" "), items };
    });

    return (
      <div className="w-full font-['Plus_Jakarta_Sans',sans-serif]">
        {introText && <p className="text-[14.5px] md:text-[15px] text-slate-600 leading-[1.65] font-medium text-justify mb-6 break-words">{introText}</p>}
        
        <div className="flex flex-col gap-4 w-full">
          {modules.map((mod, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:bg-white" style={{ borderTop: `3px solid ${accentColor}` }}>
              
              <div className="flex gap-2 md:gap-3 items-start mb-2 md:mb-3 pb-2 md:pb-3 border-b border-black/5">
                <span className="font-['Fraunces',serif] text-[20px] md:text-[24px] font-black leading-none opacity-20 shrink-0 whitespace-nowrap mt-0.5" style={{ color: accentColor }}>{String(idx + 1).padStart(2, '0')}</span>
                <h4 className="text-[16.5px] md:text-[18px] font-extrabold text-slate-900 leading-[1.2] break-words m-0">{mod.mainHeading}</h4>
              </div>
              
              {mod.mainDesc && <p className="text-[14.5px] md:text-[14px] text-slate-700 mb-4 leading-[1.65] font-medium text-justify break-words">{mod.mainDesc}</p>}
              
              {mod.items.length > 0 && (
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {mod.items.map((item, sIdx) => (
                    <li key={sIdx} className={`${item.bullets.length > 0 ? 'mb-4' : 'mb-0'}`}>
                      <div className="text-[15px] font-bold text-slate-800 flex items-start leading-[1.4]">
                        <span style={{ color: accentColor }} className="mr-2 mt-[1px] shrink-0">▹</span>
                        <span className="break-words">{item.title}</span>
                      </div>
                      
                      {item.desc.length > 0 && (
                        <p className="text-[14.5px] md:text-[14px] text-slate-500 leading-[1.65] ml-6 mt-1 font-medium text-justify break-words">{item.desc.join(" ")}</p>
                      )}

                      {item.bullets.length > 0 && (
                        <ul className="list-disc ml-[38px] mt-2 text-slate-600 text-[14px] leading-[1.6] font-medium">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="mb-1 break-words">{bullet}</li>
                          ))}
                        </ul>
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
    <div className="relative min-h-screen text-slate-900 overflow-hidden">
      
      {/* Tiny CSS block solely for loading Fonts, Animations, and Webkit Scrollbars */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }

        /* 🟢 HIGH-PERFORMANCE SCROLLBAR: Hardware accelerated */
        .custom-scrollbar {
          -webkit-overflow-scrolling: touch; 
          transform: translateZ(0); 
          will-change: scroll-position;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
        
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 via-amber-50 to-sky-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] blur-[60px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(250,204,21,0.12)_0%,transparent_70%)] blur-[60px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_70%)] blur-[80px]" />
      </div>

      {/* HERO SECTION */}
      <div className="pt-[120px] bg-transparent">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/60 backdrop-blur-sm border border-white text-emerald-600 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-extrabold tracking-[0.1em] uppercase px-5 py-2 rounded-full mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            Knowledge Hub
          </span>
          <h1 className="font-['Lora',serif] text-[clamp(32px,6vw,60px)] font-black text-slate-900 leading-[1.1] tracking-tight">
            Explore agricultural <br/> <span className="text-emerald-600">disciplines.</span>
          </h1>
          <p className="font-['Manrope',sans-serif] mt-5 text-base text-slate-600 font-medium leading-[1.6] max-w-[600px] mx-auto">
            Dive into specialized agricultural disciplines and explore our full curriculum structures.
          </p>

          {user && (
            <div className="mt-6 animate-[fadeIn_0.5s_ease]">
              <button onClick={() => setShowUpload(true)} className="bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base px-8 py-3.5 transition-all duration-300 inline-flex items-center gap-1.5 hover:bg-emerald-700 hover:-translate-y-[2px] shadow-[0_8px_20px_rgba(5,150,105,0.3)] active:scale-[0.98]">
                <span className="text-[20px]">🌿</span> Create a Topic
              </button>
            </div>
          )}

          {/* SEARCH BAR */}
          <div className={`relative max-w-[680px] mx-auto translate-y-1/2 z-10 px-4 md:px-0 ${user ? 'mt-[30px]' : 'mt-0'}`}>
            <span className="absolute left-11 md:left-7 top-1/2 -translate-y-1/2 text-[22px] text-emerald-500 pointer-events-none">🔍</span>
            <input 
              className="w-full bg-white/90 backdrop-blur-xl border border-white rounded-full py-[22px] pr-8 pl-[60px] md:pl-16 font-['Plus_Jakarta_Sans',sans-serif] text-[17px] font-medium text-slate-900 outline-none transition-all duration-300 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08),0_0_0_1px_rgba(16,185,129,0.05)] placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)]" 
              placeholder="Search topics or curriculums..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* TOPIC GRID */}
      <main className="max-w-[1200px] mx-auto pt-20 pb-[100px] px-5 relative z-0">
        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading topics from database...</div>
        ) : (
          <>
            {search && (
              <p className="font-['Manrope',sans-serif] text-base text-slate-600 mb-8 font-semibold bg-white/60 px-4 py-2 rounded-xl inline-block">
                Found <strong className="text-slate-900">{filtered.length}</strong> topics for "{search}"
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {filtered.map((t) => (
                <article key={t.id} className="group bg-white/85 backdrop-blur-md border border-white rounded-[20px] p-8 cursor-pointer relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25),0_0_0_2px_rgba(16,185,129,0.1)] hover:bg-white/95 active:scale-[0.98]" onClick={() => setSelected(t)} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
                  
                  {/* Glow overlay */}
                  <div className="absolute -top-10 -right-10 w-[140px] h-[140px] rounded-full blur-[40px] opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-20" style={{ background: t.accent }} />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-[32px] transition-all duration-300 group-hover:scale-110" style={{ background: hovered === t.id ? t.color : "#f8faf9" }}>
                      {t.icon}
                    </div>
                  </div>

                  <h3 className="font-['Lora',serif] text-[24px] font-extrabold text-slate-900 mb-3 leading-[1.2] break-words">{t.label}</h3>
                  
                  <p className="font-['Manrope',sans-serif] text-[15px] text-slate-600 leading-[1.6] font-medium mb-6 line-clamp-3 break-words">
                    {(t.desc || "").replace(/#|[-*]/g, "")}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {t.subtopics && t.subtopics.slice(0,3).map((s) => (
                      <span key={s} className="inline-block bg-slate-100 text-slate-600 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 border border-transparent group-hover:bg-white group-hover:border-slate-200">{s}</span>
                    ))}
                    {t.subtopics && t.subtopics.length > 3 && (
                      <span className="inline-block bg-transparent text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold px-3.5 py-1.5 rounded-full">+{t.subtopics.length-3}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-5 border-t border-black/5">
                    <div className="flex gap-4">
                      <span className="font-['Manrope',sans-serif] text-[13px] text-slate-500 font-semibold">👀 {t.reads} Views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="text-[64px] mb-5">🔍</div>
                <h3 className="font-['Lora',serif] text-[28px] text-slate-900 font-extrabold">No topics found</h3>
                <p className="font-['Manrope',sans-serif] text-slate-500 mt-2.5 text-base">We couldn't find anything matching your search.</p>
                <button className="mt-6 bg-white/80 text-slate-700 border border-black/5 rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm px-7 py-3 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm active:scale-95" onClick={() => setSearch("")}>Clear Search</button>
              </div>
            )}
          </>
        )}
      </main>

      {showUpload && <UploadTopicModal onClose={() => setShowUpload(false)} onSuccess={handleNewTopic} />}

      {/* READING MODAL */}
      {selected && !showUpload && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-16 animate-[fadeIn_0.3s_ease-out]" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[24px] w-full max-w-[1100px] max-h-[85vh] flex flex-col relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 z-[100] w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-slate-900 text-xl flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:bg-white hover:text-emerald-600 hover:scale-110 active:scale-95" onClick={() => setSelected(null)}>✕</button>
            
            <div className="overflow-y-auto overflow-x-hidden grow w-full break-words custom-scrollbar">
              <div className="px-5 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6 text-center flex flex-col items-center" style={{ background: `linear-gradient(180deg, ${selected.color} 0%, rgba(255,255,255,0) 100%)` }}>
                <div className="w-[56px] md:w-[72px] h-[56px] md:h-[72px] rounded-[20px] bg-white flex items-center justify-center text-[28px] md:text-[36px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] mb-4 md:mb-5">
                  {selected.icon}
                </div>
                <h2 className="font-['Lora',serif] text-[clamp(24px,4vw,36px)] font-black text-slate-900 leading-[1.1] mb-4 break-words">
                  {selected.label}
                </h2>
              </div>
              <div className="px-5 md:px-6 pb-8 md:pb-12"> 
                <div>
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