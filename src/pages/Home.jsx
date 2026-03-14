import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════
   BACKEND-CONNECTED API LAYER
══════════════════════════════════════════════════ */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const API = {
  async getSlides() {
    try {
      const res = await fetch("https://hortiverse-backend.onrender.com/api/slides");
      const dbSlides = await res.json();
      return dbSlides.map(s => ({
        id: s.id,
        url: s.image_url,
        caption: s.caption,
        sub: s.sub_text
      }));
    } catch (err) {
      console.error("Failed to fetch slides:", err);
      return [];
    }
  },

  async getStories() { 
  try {
    const res = await fetch(`${API_BASE_URL}/api/stories`);
    const dbStories = await res.json();
    
    return dbStories.map(s => {
      // 🟢 Safer initials logic
      let initials = "HV";
      if (s.author && typeof s.author === 'string' && s.author.trim().length > 0) {
        initials = s.author
          .split(' ')
          .filter(part => part.length > 0) // Remove empty spaces
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
      }

      return {
        id: s.id, 
        author: s.author || "Community Member", 
        initials: initials, 
        ago: "Recently", 
        title: s.title || "Untitled Story", 
        desc: s.excerpt || s.content?.substring(0, 100) || "", 
        content: s.content || "", 
        tag: s.tag || "Horticulture", 
        img: s.image_url || "https://via.placeholder.com/400x260?text=HortiVerse" // Fallback image
      };
    });
  } catch (err) { 
    console.error("Stories fetch error:", err);
    return []; 
  }
},

  async getTopics()  { 
    try {
      const res = await fetch("https://hortiverse-backend.onrender.com/api/topics");
      const dbTopics = await res.json();
      return dbTopics.map(t => ({
        id: t.id, 
        icon: t.icon || "🌿", 
        label: t.label || "Untitled Topic", 
        desc: t.description || "",
        color: t.color || "#f8faf9",
        accent: t.accent || "#059669",
        subtopics: t.subtopics || []
      }));
    } catch (err) { return []; }
  },
};

const AVATAR_COLORS = ["#4caf50","#2e7d32","#66bb6a","#388e3c","#81c784","#1b5e20"];

const TOPIC_THEMES = [
  { bg: "#ecfdf5", shadow: "rgba(16, 185, 129, 0.18)", text: "#047857" }, // Mint Green
  { bg: "#e0f2fe", shadow: "rgba(2, 132, 199, 0.15)",  text: "#0369a1" }, // Sky Blue
  { bg: "#fef3c7", shadow: "rgba(217, 119, 6, 0.15)",  text: "#b45309" }, // Warm Amber
  { bg: "#f3e8ff", shadow: "rgba(147, 51, 234, 0.15)", text: "#7e22ce" }, // Soft Purple
  { bg: "#fce7f3", shadow: "rgba(225, 29, 72, 0.15)",  text: "#be185d" }, // Blush Rose
  { bg: "#e0e7ff", shadow: "rgba(67, 56, 202, 0.15)",  text: "#4338ca" }  // Deep Indigo
];

/* ── Skeleton loader ── */
function Skel({ w="100%", h=20, r=8, mb=0, style={} }) {
  return <div style={{ width:w, height:h, borderRadius:r, marginBottom:mb, background:"linear-gradient(90deg,#e8f5e8 25%,#d0ead0 50%,#e8f5e8 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", flexShrink:0, ...style }} />;
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Home() {
  const [visible,        setVisible]        = useState({});
  const [slideIdx,       setSlideIdx]       = useState(0);
  const [transitioning,  setTransitioning]  = useState(false);
  const [hoveredTopic,   setHoveredTopic]   = useState(null);
  const [hoveredStory,   setHoveredStory]   = useState(null);

  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [activeTopicModal, setActiveTopicModal] = useState(null);

  // 🟢 NEW: Newsletter State
  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState("idle"); // 'idle', 'loading', 'success'

  /* data */
  const [slides,   setSlides]   = useState([]);
  const [stories,  setStories]  = useState([]);
  const [topics,   setTopics]   = useState([]);

  /* loading flags */
  const [ldSlides,  setLdSlides]  = useState(true);
  const [ldStories, setLdStories] = useState(true);
  const [ldTopics,  setLdTopics]  = useState(true);

  const sectionRefs = useRef({});
  const timerRef    = useRef(null);
  const sliderRef   = useRef(null);

  /* ── fetch all on mount ── */
  useEffect(() => {
    API.getSlides().then(d  => { setSlides(d);  setLdSlides(false);  });
    API.getStories().then(d => { 
      setStories(d.slice(0, 6)); 
      setLdStories(false); 
    });
    API.getTopics().then(d  => { 
      setTopics(d.slice(0, 6));  
      setLdTopics(false);  
    });
  }, []);

  /* ── auto-slide ── */
  const goSlide = (next) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setSlideIdx(next);
      setTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      goSlide((slideIdx + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [slides, slideIdx, transitioning]);

  /* ── intersection reveals ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisible(p => ({ ...p, [e.target.id]: true }));
      }),
      { threshold: 0.08 }
    );
    Object.values(sectionRefs.current).forEach(r => r && obs.observe(r));
    return () => obs.disconnect();
  }, [ldTopics, ldStories]);

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  /* ── manual slide with drag ── */
  const dragStart = useRef(null);
  const onDragStart = (e) => { dragStart.current = e.clientX || e.touches?.[0]?.clientX; };
  const onDragEnd   = (e) => {
    if (dragStart.current === null || slides.length === 0) return;
    const end  = e.clientX || e.changedTouches?.[0]?.clientX;
    const diff = dragStart.current - end;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goSlide((slideIdx + 1) % slides.length);
      else          goSlide((slideIdx - 1 + slides.length) % slides.length);
    }
    dragStart.current = null;
  };

  /* PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN */
  useEffect(() => {
    if (activeStoryModal || activeTopicModal) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset"; 
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeStoryModal, activeTopicModal]);

  // 🟢 NEW: Handle Newsletter Submission
  const handleSubscribe = async () => {
    if (!nlEmail || nlState !== "idle") return;
    setNlState("loading");
    await delay(1200); // Simulate network request
    setNlState("success");
  };

  const renderTopicContent = (text, accentColor) => {
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
    <div style={{ fontFamily:"'Georgia',serif", background:"linear-gradient(to bottom, #f8fdf8 0%, #f0fbf0 100%)", color:"#1a2e1a", overflowX:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#f0faf0; }
        ::-webkit-scrollbar-thumb { background:#a8d8a8; border-radius:3px; }

        .fr { font-family: 'Lora', serif; }
        .jk { font-family: 'Manrope', sans-serif; }

        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.6} }
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(10px);opacity:0} }
        @keyframes popIn { 0%{opacity:0; transform:scale(0.95)} 100%{opacity:1; transform:scale(1)} }
        @keyframes bounceTwist { 0%{transform:scale(0.8) rotate(-5deg); opacity:0} 50%{transform:scale(1.1) rotate(3deg); opacity:1} 100%{transform:scale(1) rotate(0deg); opacity:1} }

        .reveal { opacity:0; transform:translateY(26px); transition:opacity .75s ease,transform .75s ease; }
        .reveal.on { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.08s} .d2{transition-delay:.18s} .d3{transition-delay:.28s}
        .d4{transition-delay:.38s} .d5{transition-delay:.48s} .d6{transition-delay:.58s}

        .slide-img { transition: opacity .6s ease; }
        .slide-img.out { opacity:0; }

        .glass { background:rgba(255,255,255,.75); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,.9); box-shadow:0 10px 40px rgba(0,0,0,.08); }

        .nav-lk { color:#1a3a1a; text-decoration:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; letter-spacing:.01em; transition:color .2s; position:relative; padding-bottom:2px; }
        .nav-lk::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:linear-gradient(90deg,#4caf50,#81c784); border-radius:2px; transition:width .28s; }
        .nav-lk:hover { color:#43a047; }
        .nav-lk:hover::after, .nav-lk.active::after { width:100%; }
        .nav-lk.active { color:#43a047; font-weight:700; }

        /* Standard Buttons */
        .btn-solid { background:linear-gradient(135deg,#10b981,#047857); color:#fff; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:15px; padding:14px 30px; border-radius:50px; display:inline-flex; align-items:center; gap:6px; transition:all .3s; box-shadow:0 4px 20px rgba(16, 185, 129, 0.4); text-decoration:none; }
        .btn-solid:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(16, 185, 129, 0.55); filter:brightness(1.05); }
        .btn-solid:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
        
        .btn-outline { background:rgba(255,255,255,.8); backdrop-filter:blur(10px); color:#047857; border:2px solid rgba(16, 185, 129, 0.3); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:15px; text-decoration:none; padding:12px 30px; border-radius:50px; display:inline-flex; align-items:center; gap:6px; transition:all .3s; }
        .btn-outline:hover { background:rgba(16, 185, 129, 0.1); border-color:#10b981; transform:translateY(-2px); }

        /* HERO GLASSMORPHISM BUTTONS */
        .hero-glass-btn { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 16px; padding: 16px 36px; border-radius: 50px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .hero-glass-btn.primary { background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(16, 185, 129, 0.5); color: #ffffff; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2); }
        .hero-glass-btn.primary:hover { background: rgba(16, 185, 129, 0.45); border-color: rgba(16, 185, 129, 0.9); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4); }
        .hero-glass-btn.secondary { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; }
        .hero-glass-btn.secondary:hover { background: rgba(255, 255, 255, 0.25); border-color: rgba(255, 255, 255, 0.7); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }

        .story-card { cursor:pointer; background:transparent; border:none; transition:transform .4s ease; display: flex; flex-direction: column; }
        .story-card:hover { transform:translateY(-8px); }
        .story-img-wrap { width: 100%; height: 260px; border-radius: 20px; overflow: hidden; position: relative; margin-bottom: 20px; box-shadow:0 10px 30px rgba(0,0,0,0.06); }
        .story-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
        .story-card:hover .story-img-wrap img { transform: scale(1.06); }

        /* COLORFUL CLAYMORPHISM DESIGN FOR TOPICS */
        .topic-card { cursor: pointer; background: var(--card-bg, #f8fdf8); border: none; padding: 40px 28px; border-radius: 32px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 12px 12px 24px var(--card-shadow, rgba(16, 185, 129, 0.06)), -12px -12px 24px rgba(255, 255, 255, 0.8), inset 2px 2px 6px rgba(255, 255, 255, 1), inset -3px -3px 8px var(--card-shadow, rgba(16, 185, 129, 0.03)); }
        .topic-card:hover { transform: translateY(-8px); box-shadow: 16px 16px 32px var(--card-shadow, rgba(16, 185, 129, 0.08)), -16px -16px 32px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 1), inset -3px -3px 8px var(--card-shadow, rgba(16, 185, 129, 0.04)); }
        .topic-icon-wrap { width: 80px; height: 80px; border-radius: 26px; background: rgba(255, 255, 255, 0.6); color: var(--card-text, #047857); display: flex; align-items: center; justify-content: center; font-size: 38px; margin-bottom: 24px; transition: all .4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: inset 4px 4px 8px rgba(255, 255, 255, 0.9), inset -4px -4px 8px var(--card-shadow, rgba(16, 185, 129, 0.15)), 4px 4px 12px var(--card-shadow, rgba(16, 185, 129, 0.04)); }
        .topic-card:hover .topic-icon-wrap { transform: scale(1.1) translateY(-4px); color: var(--card-text, #10b981); background: rgba(255,255,255,0.9); box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px var(--card-shadow, rgba(16, 185, 129, 0.1)), 8px 8px 16px var(--card-shadow, rgba(16, 185, 129, 0.1)); }

        .chip { display:inline-block; background:rgba(16, 185, 129, 0.12); color:#047857; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:8px 20px; border-radius:50px; margin-bottom:16px; }
        .tag { background:rgba(255,255,255,.95); backdrop-filter:blur(8px); color:#047857; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; padding:6px 16px; border-radius:50px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .avatar { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:13px; color:#fff; flex-shrink:0; }

        .nl-input { flex:1; min-width:0; background:rgba(255,255,255,.9); backdrop-filter:blur(12px); border:1.5px solid rgba(255,255,255,.95); color:#1a2e1a; padding:16px 24px; border-radius:50px 0 0 50px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; outline:none; transition:all .3s; font-weight: 500; }
        .nl-input::placeholder { color:#94a3b8; }
        .nl-input:focus { border-color:rgba(16, 185, 129, 0.6); }
        
        .spinner { width:20px; height:20px; border:2px solid rgba(255, 255, 255, 0.3); border-top-color:#ffffff; border-radius:50%; animation:spin .7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .slide-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.5); transition:all .3s; cursor:pointer; border:none; margin: 0 4px; }
        .slide-dot.on { width:26px; border-radius:4px; background:#fff; box-shadow: 0 0 10px rgba(255,255,255,0.8); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.7); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 60px 20px; animation: popIn .3s ease-out; }
        
        .modal-box { background: #ffffff; width: 100%; max-width: 860px; max-height: 85vh; display: flex; flex-direction: column; position: relative; overflow: hidden; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2); animation: slideUp .4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .modal-scroll-area { overflow-y: auto; overflow-x: hidden; flex-grow: 1; width: 100%; word-break: break-word; overscroll-behavior: contain; }
        .modal-scroll-area::-webkit-scrollbar { width: 8px; }
        .modal-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 4px; }
        
        .modal-close-btn { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.4); width: 40px; height: 40px; border-radius: 50%; font-size: 18px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 100; }
        .modal-close-btn:hover { background: #ffffff; color: #0f172a; transform: scale(1.1); }
        .modal-close-btn.dark { background: rgba(0,0,0,0.05); color: #0f172a; border-color: transparent; }
        .modal-close-btn.dark:hover { background: rgba(0,0,0,0.1); color: #dc2626; }

        .modal-content-text p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; line-height: 1.8; color: #475569; margin-bottom: 24px; word-break: break-word; }
        .modal-content-text strong { color: #0f172a; font-weight: 800; }

        .skeleton-container { font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; }
        .skeleton-intro { font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px; font-weight: 500; text-align: center; }
        .skeleton-grid { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .skeleton-module { background: #f8faf9; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px 24px; transition: transform 0.2s, box-shadow 0.2s; width: 100%; }
        .skeleton-module:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.08); background: #ffffff; }
        .module-header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.04); padding-bottom: 12px; }
        .module-number { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 900; line-height: 1; opacity: 0.2; }
        .module-header h4 { font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1.2; margin: 0; }
        .module-main-desc { font-size: 14px; color: #334155; margin-bottom: 16px; line-height: 1.6; font-weight: 500; }
        .module-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .sub-title { font-size: 15px; font-weight: 700; color: #1e293b; display: flex; align-items: flex-start; line-height: 1.4; }
        .sub-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-left: 24px; margin-top: 4px; font-weight: 500; }
      `}</style>

      {/* ══ HERO ══ */}
      <section
        ref={sliderRef}
        style={{ position:"relative", height:"100vh", minHeight:620, overflow:"hidden", userSelect:"none" }}
        onMouseDown={onDragStart} onMouseUp={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}
      >
        {ldSlides ? (
          <div style={{ position:"absolute", inset:0, background:"#111" }} />
        ) : slides.map((sl, i) => (
          <div key={sl.id} className={`slide-img ${(transitioning && i === slideIdx) || (!transitioning && i !== slideIdx) ? "out" : ""}`}
            style={{
              position:"absolute", inset:0, zIndex: i === slideIdx ? 1 : 0,
              backgroundImage:`url(${sl.url})`,
              backgroundSize:"cover", backgroundPosition:"center",
              filter:"brightness(0.45)",
              transition:"opacity .65s ease",
              opacity: i === slideIdx ? 1 : 0,
            }}
          />
        ))}

        <div style={{ position:"absolute", inset:0, zIndex:2, background:"linear-gradient(110deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)" }} />
        
        <div style={{ position:"relative", zIndex:4, height:"80%", width: "100%", maxWidth:1200, margin:"0 auto", padding:"0px 74px", display:"flex", alignItems:"center", paddingTop:68 }}>
          
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
            
            <div style={{ maxWidth:750 }}>
              <div className="glass" style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"8px 20px", borderRadius:50, marginBottom:30 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:"#10b981", display:"block", animation:"pulseDot 1.4s ease-in-out infinite", boxShadow: "0 0 10px #10b981" }} />
                <span className="jk" style={{ fontSize:13, color:"#0f172a", fontWeight:800, letterSpacing:".1em", textTransform: "uppercase" }}>
                  {ldSlides ? "Loading…" : slides[slideIdx]?.caption}
                </span>
              </div>

              <h1 className="fr" style={{ fontSize:"clamp(46px, 6.5vw, 86px)", lineHeight:1.05, fontWeight:900, color:"#ffffff", letterSpacing: "-1px", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                Cultivating<br />
                <span style={{ color:"#11a967" }}>Tomorrow's Agriculture</span><br />
                <span style={{ color:"#aec708" }}>Today</span>
              </h1>

              <p className="jk" style={{ marginTop:24, fontSize:18, lineHeight:1.8, color:"rgba(255,255,255,.85)", maxWidth:500, fontWeight:400, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                {ldSlides ? "Join a thriving community…" : slides[slideIdx]?.sub}
              </p>
            </div>

            <div style={{ display:"flex", flexDirection: "column", gap:16, minWidth: "220px" }}>
              <a href="/stories" className="hero-glass-btn primary">Explore Stories</a>
              <a href="/UnderDevelopment" className="hero-glass-btn secondary">Join Community</a>
            </div>

          </div>
        </div>

        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", zIndex:4, display:"flex", gap:8 }}>
          {slides.map((_, i) => (
            <button key={i} className={`slide-dot ${i === slideIdx ? "on" : ""}`}
              onClick={() => { clearInterval(timerRef.current); goSlide(i); }}
            />
          ))}
        </div>

        <div style={{ position:"absolute", bottom:28, right:52, zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:40, borderRadius:12, border:"2px solid rgba(255,255,255,.5)", display:"flex", padding:4, justifyContent: "center" }}>
            <div style={{ width:4, height:10, borderRadius:2, background:"#fff", animation:"scrollDot 1.6s ease infinite" }} />
          </div>
          <span className="jk" style={{ fontSize:11, color:"rgba(255,255,255,.7)", letterSpacing:".15em", fontWeight:700, textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ══ STORIES ══ */}
      <section style={{ padding:"120px 52px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div id="stories-hdr" ref={setRef("stories-hdr")} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:60, borderBottom:"1px solid rgba(16, 185, 129, 0.2)", paddingBottom:20 }} className={`reveal ${visible["stories-hdr"] ? "on" : ""}`}>
            <div>
              <span className="chip">Real Experiences</span>
              <h2 className="fr" style={{ fontSize:"clamp(36px,4vw,56px)", fontWeight:800, color:"#0f172a", lineHeight:1.1 }}>Featured Stories</h2>
            </div>
            <a href="/stories" className="btn-outline" style={{ background:"transparent", color:"#047857" }}>View All Stories</a>
          </div>

          <div id="stories-grid" ref={setRef("stories-grid")} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:"60px 40px" }}>
            {ldStories ? [1,2,3,4,5,6].map(i => (
              <div key={i}><Skel h={260} r={20} mb={20}/><Skel w="80%" h={28} mb={12}/><Skel w="60%"/></div>
            )) : stories.map((s, i) => (
              <div key={s.id} className={`story-card reveal d${(i%3)+1} ${visible["stories-grid"] ? "on" : ""}`}
                onClick={() => setActiveStoryModal(s)}
                onMouseEnter={() => setHoveredStory(s.id)} 
                onMouseLeave={() => setHoveredStory(null)}
              >
                <div className="story-img-wrap">
                  <img src={s.img} alt={s.title} />
                  <div style={{ position:"absolute", top:16, left:16 }}><span className="tag">{s.tag}</span></div>
                </div>
                
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <div className="avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 30, height: 30, fontSize: 11 }}>{s.initials}</div>
                  <span className="jk" style={{ fontSize:14, fontWeight:700, color: "#334155" }}>{s.author}</span>
                </div>
                
                <h3 className="fr" style={{ fontSize:24, fontWeight:800, lineHeight:1.3, marginBottom:12, color: "#0f172a", wordBreak: "break-word" }}>{s.title}</h3>
                
                <p className="jk" style={{ fontSize:15, color:"#64748b", lineHeight:1.7, fontWeight:500, wordBreak: "break-word" }}>
                  {(s.desc || "").substring(0, 90)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOPICS (COLORFUL CLAYMORPHISM) ══ */}
      <section style={{ padding:"60px 52px 120px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div id="topics-hdr" ref={setRef("topics-hdr")} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:60, borderBottom:"1px solid rgba(16, 185, 129, 0.2)", paddingBottom:20 }} className={`reveal ${visible["topics-hdr"] ? "on" : ""}`}>
            <div>
              <span className="chip">Knowledge Hub</span>
              <h2 className="fr" style={{ fontSize:"clamp(36px,4vw,56px)", fontWeight:800, color:"#0f172a", lineHeight:1.1 }}>Explore Topics</h2>
            </div>
            <a href="/topics" className="btn-outline" style={{ background:"transparent", color:"#047857" }}>View All Topics</a>
          </div>

          <div id="topics-grid" ref={setRef("topics-grid")} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:"30px 40px" }}>
            {ldTopics ? [1,2,3,4,5,6].map(i => (
              <div key={i} className="topic-card">
                <Skel w={80} h={80} mb={24} r={26} />
                <Skel w="70%" h={28} mb={16}/>
                <Skel w="90%" h={18} mb={8}/><Skel w="60%" h={18}/>
              </div>
            )) : topics.map((t, i) => {
              const theme = TOPIC_THEMES[i % TOPIC_THEMES.length];
              
              return (
              <div key={t.id} className={`topic-card reveal d${i+1} ${visible["topics-grid"] ? "on" : ""}`}
                style={{ '--card-bg': theme.bg, '--card-shadow': theme.shadow, '--card-text': theme.text }}
                onClick={() => setActiveTopicModal(t)}
                onMouseEnter={() => setHoveredTopic(i)} 
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div className="topic-icon-wrap">{t.icon}</div>
                <h3 className="fr" style={{ fontSize:24, fontWeight:800, marginBottom:10, color: "#0f172a", wordBreak: "break-word" }}>{t.label}</h3>
                <p className="jk" style={{ fontSize:15, color:"#64748b", lineHeight:1.7, fontWeight:500, wordBreak: "break-word" }}>
                  {(t.desc || "").replace(/#|-|\*/g, '').substring(0, 85)}...
                </p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER (WITH TWIST ANIMATION) ══ */}
      <section style={{ padding:"0 52px 100px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", borderRadius:32, overflow:"hidden", background:"linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)", border:"1px solid rgba(255,255,255,1)", boxShadow:"0 20px 60px -15px rgba(16, 185, 129, 0.2)", padding:"80px", textAlign:"center", position:"relative" }}>
          <span style={{ position:"absolute", top:-24, left:-16, fontSize:180, opacity:.04, transform:"rotate(-15deg)", pointerEvents:"none" }}>🌿</span>
          <div style={{ position:"relative", zIndex:1 }}>
            <span className="chip" style={{ background: "#ffffff" }}>Join Us Today</span>
            <h2 className="fr" style={{ fontSize:"clamp(32px,4vw,56px)", fontWeight:800, color:"#0f172a", lineHeight:1.1, marginBottom:20 }}>
              Start Your Green<br /><span style={{ color:"#059669", fontStyle:"italic" }}>Journey Today</span>
            </h2>
            <p className="jk" style={{ fontSize:16, color:"#334155", maxWidth:480, margin:"0 auto 40px", fontWeight:500, lineHeight:1.8 }}>
              Get weekly plant care reminders, personalised tips, and connect with gardeners worldwide.
            </p>
            
            {/* 🟢 NEW: Newsletter Input & Animated Twist Message */}
            <div style={{ display:"flex", maxWidth:500, margin:"0 auto", height: 50, position: "relative" }}>
              {nlState === "success" ? (
                <div style={{ 
                  width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", 
                  background: "#ffffff", borderRadius: 50, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)",
                  color: "#059669", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 16,
                  animation: "bounceTwist 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
                }}>
                  🎉 You're all set! ThankYou
                </div>
              ) : (
                <div style={{ display:"flex", width: "100%", borderRadius:50, overflow:"hidden", boxShadow:"0 10px 30px rgba(16, 185, 129, 0.15)", transition: "opacity 0.3s", opacity: nlState === "loading" ? 0.8 : 1 }}>
                  <input 
                    className="nl-input" 
                    placeholder="Enter your email address…" 
                    value={nlEmail} 
                    onChange={e => setNlEmail(e.target.value)}
                    disabled={nlState === "loading"}
                  />
                  <button className="btn-solid" style={{ borderRadius:"0 50px 50px 0", padding:"0 32px", fontSize:14, height: "100%" }} onClick={handleSubscribe} disabled={nlState === "loading"}>
                    {nlState === "loading" ? <div className="spinner" /> : "Subscribe 🌱"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 🟢 NEW: REDESIGNED DARK FOREST FOOTER */}
      <footer style={{ background:"linear-gradient(180deg, #064e3b 0%, #022c22 100%)", padding:"80px 52px 40px", color: "#f8fafc" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:60, marginBottom:60 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:"14px", background:"linear-gradient(135deg,#34d399,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)" }}>🌿</div>
                <span className="fr" style={{ fontSize:28, fontWeight:800, color:"#ffffff" }}>Horti<span style={{ color:"#34d399" }}>Verse</span></span>
              </div>
              <p className="jk" style={{ fontSize:15, color:"#94a3b8", lineHeight:1.8, maxWidth:320, fontWeight:400 }}>
                A thriving community of horticulture students sharing knowledge and sustainable farming practices worldwide.
              </p>
            </div>

            {/* 🟢 Modified Footer Links */}
            <div>
              <h4 className="jk" style={{ fontSize:13, letterSpacing:".15em", color:"#34d399", marginBottom:24, textTransform:"uppercase", fontWeight:800 }}>Explore</h4>
              <a href="/stories" className="jk" style={{ display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Stories</a>
              <a href="/topics" className="jk" style={{ display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Topics</a>
              <a href="/resources" className="jk" style={{ display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Resources</a>
            </div>

            <div>
              <h4 className="jk" style={{ fontSize:13, letterSpacing:".15em", color:"#34d399", marginBottom:24, textTransform:"uppercase", fontWeight:800 }}>Support</h4>
              <a href="/about" className="jk" style={{ display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>About Us</a>
              <a href="/help" className="jk" style={{ display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Help Center</a>
              <a href="/privacy" className="jk" style={{ display:"block", color:"#cbd5e1", textDecoration:"none", fontSize:15, marginBottom:16, fontWeight:500, transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color='#ffffff'} onMouseOut={e=>e.target.style.color='#cbd5e1'}>Privacy Policy</a>
            </div>

          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:30, display:"flex", justifyContent:"space-between" }}>
            <p className="jk" style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>© 2026 HortiVerse. All rights reserved.</p>
            <p className="jk" style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>Made with 🌿 for horticulture students everywhere</p>
          </div>
        </div>
      </footer>

      {/* 🟢 STORY MODAL OVERLAY */}
      {activeStoryModal && (
        <div className="modal-overlay" onClick={() => setActiveStoryModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveStoryModal(null)}>✕</button>

            <div className="modal-scroll-area">
              <div style={{ height: 320, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={activeStoryModal.img} alt={activeStoryModal.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: 24, left: 32, right: 32 }}>
                  <span className="tag-badge" style={{ marginBottom: 16 }}>{activeStoryModal.tag}</span>
                  <h1 className="fr" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, textShadow: "0 2px 8px rgba(0,0,0,0.5)", wordBreak: "break-word" }}>
                    {activeStoryModal.title}
                  </h1>
                </div>
              </div>

              <div style={{ padding: "40px 48px 60px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 24, borderBottom: "1px solid #e2e8f0", marginBottom: 32 }}>
                  <div className="avatar" style={{ background: AVATAR_COLORS[(activeStoryModal.id || 0) % AVATAR_COLORS.length], width: 48, height: 48, fontSize: 16 }}>{activeStoryModal.initials}</div>
                  <div>
                    <div className="jk" style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{activeStoryModal.author}</div>
                    <div className="jk" style={{ fontSize: 14, color: "#64748b", marginTop: 2, fontWeight: 500 }}>{activeStoryModal.ago}</div>
                  </div>
                </div>

                <div className="modal-content-text">
                  {(activeStoryModal.content || activeStoryModal.desc || "No full content available.").split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 TOPIC MODAL OVERLAY */}
      {activeTopicModal && (
        <div className="modal-overlay" onClick={() => setActiveTopicModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ '--accent-color': activeTopicModal.accent, maxWidth: 650 }}>
            <button className="modal-close-btn dark" onClick={() => setActiveTopicModal(null)}>✕</button>
            <div className="modal-scroll-area">
              <div style={{ 
                padding: "48px 32px 24px", 
                background: `linear-gradient(180deg, ${activeTopicModal.color} 0%, rgba(255,255,255,0) 100%)`, 
                textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                <div style={{ 
                  width: 72, height: 72, borderRadius: "20px", background: "#ffffff", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  fontSize: 36, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: 20
                }}>{activeTopicModal.icon}</div>
                <h2 className="fr" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 16, wordBreak: "break-word" }}>
                  {activeTopicModal.label}
                </h2>
              </div>
              <div style={{ padding: "0 32px 48px" }}>
                <div className="modal-article-content">
                  {renderTopicContent(activeTopicModal.desc || "", activeTopicModal.accent)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}