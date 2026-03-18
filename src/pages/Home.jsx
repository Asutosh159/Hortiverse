import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect, useRef } from "react";
import Footer from '../components/Footer'; 

/* ══════════════════════════════════════════════════
   BACKEND-CONNECTED API LAYER
══════════════════════════════════════════════════ */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const getDirectImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x260?text=HortiVerse";
  if (url.includes("drive.google.com")) {
    let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/); 
    if (!match) match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/); 
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920`;
    }
  }
  return url;
};

const API = {
  async getSlides() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/slides`);
      const dbSlides = await res.json();
      return dbSlides.map(s => ({
        id: s.id,
        url: getDirectImageUrl(s.image_url), 
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
        let initials = "HV";
        if (s.author && typeof s.author === 'string' && s.author.trim().length > 0) {
          initials = s.author.split(' ').filter(part => part.length > 0).map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
          img: getDirectImageUrl(s.image_url) 
        };
      });
    } catch (err) { 
      console.error("Stories fetch error:", err);
      return []; 
    }
  },

  async getTopics()  { 
    try {
      const res = await fetch(`${API_BASE_URL}/api/topics`);
      const dbTopics = await res.json();
      return dbTopics.map(t => ({
        id: t.id, icon: t.icon || "🌿", label: t.label || "Untitled Topic", 
        desc: t.description || "", color: t.color || "#f8faf9", accent: t.accent || "#059669", subtopics: t.subtopics || []
      }));
    } catch (err) { return []; }
  },
};

const AVATAR_COLORS = ["#4caf50","#2e7d32","#66bb6a","#388e3c","#81c784","#1b5e20"];

const TOPIC_THEMES = [
  { bg: "#ecfdf5", shadow: "rgba(16, 185, 129, 0.18)", text: "#047857" },
  { bg: "#e0f2fe", shadow: "rgba(2, 132, 199, 0.15)",  text: "#0369a1" },
  { bg: "#fef3c7", shadow: "rgba(217, 119, 6, 0.15)",  text: "#b45309" },
  { bg: "#f3e8ff", shadow: "rgba(147, 51, 234, 0.15)", text: "#7e22ce" },
  { bg: "#fce7f3", shadow: "rgba(225, 29, 72, 0.15)",  text: "#be185d" },
  { bg: "#e0e7ff", shadow: "rgba(67, 56, 202, 0.15)",  text: "#4338ca" }
];

function Skel({ w="100%", h=20, r=8, mb=0, style={} }) {
  return <div style={{ width:w, height:h, borderRadius:r, marginBottom:mb, background:"linear-gradient(90deg,#e8f5e8 25%,#d0ead0 50%,#e8f5e8 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", flexShrink:0, ...style }} />;
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Home() {

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const [visible,        setVisible]        = useState({});
  const [slideIdx,       setSlideIdx]       = useState(0);
  const [transitioning,  setTransitioning]  = useState(false);

  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [activeTopicModal, setActiveTopicModal] = useState(null);

  const [nlEmail, setNlEmail] = useState("");
  const [nlState, setNlState] = useState("idle"); 

  const [slides,   setSlides]   = useState([]);
  const [stories,  setStories]  = useState([]);
  const [topics,   setTopics]   = useState([]);

  const [ldSlides,  setLdSlides]  = useState(true);
  const [ldStories, setLdStories] = useState(true);
  const [ldTopics,  setLdTopics]  = useState(true);

  const sectionRefs = useRef({});
  const timerRef    = useRef(null);
  const sliderRef   = useRef(null);

  useEffect(() => {
    API.getSlides().then(d  => { setSlides(d);  setLdSlides(false);  });
    API.getStories().then(d => { setStories(d.slice(0, 6)); setLdStories(false); });
    API.getTopics().then(d  => { setTopics(d.slice(0, 6));  setLdTopics(false);  });
  }, []);

  const goSlide = (next) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setSlideIdx(next);
      setTransitioning(false);
    }, 800); 
  };

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      goSlide((slideIdx + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, slideIdx, transitioning]);

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

  useEffect(() => {
    if (activeStoryModal || activeTopicModal) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset"; 
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [activeStoryModal, activeTopicModal]);

  const handleSubscribe = async () => {
    if (!nlEmail || nlState !== "idle") return;
    setNlState("loading");
    await delay(1200); 
    setNlState("success");
  };

  const parseContentWithImages = (text) => {
    const refinedText = text.replace(
      /(!\[(.*?)\]\((https?:\/\/[^)]+)\))(?:[\s\n]*)(!\[(.*?)\]\((https?:\/\/[^)]+)\))/gi,
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-[85%] mx-auto my-6 border-b border-black/5 pb-5">' +
        '<figure class="flex flex-col items-center m-0">' +
          '<img src="$3" alt="$2" class="w-full h-auto max-h-[220px] object-contain rounded-xl shadow-sm border border-slate-200 block bg-slate-50" />' +
          '<figcaption class="text-[12px] text-slate-500 font-medium leading-[1.5] mt-2 text-center">$2</figcaption>' +
        '</figure>' +
        '<figure class="flex flex-col items-center m-0">' +
          '<img src="$6" alt="$5" class="w-full h-auto max-h-[220px] object-contain rounded-xl shadow-sm border border-slate-200 block bg-slate-50" />' +
          '<figcaption class="text-[12px] text-slate-500 font-medium leading-[1.5] mt-2 text-center">$5</figcaption>' +
        '</figure>' +
      '</div>'
    );

    return refinedText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
      .replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi, 
        '<figure class="flex flex-col items-center my-6 m-0">' +
          '<img src="$2" alt="$1" class="w-[80%] md:w-[45%] max-w-[350px] h-auto max-h-[260px] object-contain rounded-xl shadow-sm border border-slate-200 block bg-slate-50" />' +
          '<figcaption class="text-[12px] text-slate-500 font-medium leading-[1.5] mt-2 text-center">$1</figcaption>' +
        '</figure>'
      );
  };

  const renderTopicContent = (text, accentColor) => {
    if (!text.includes("##")) {
      return text.split("\n\n").map((para, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: parseContentWithImages(para) }} className="text-[14.5px] md:text-[15px] text-slate-600 leading-[1.65] font-medium text-justify mb-4 break-words font-['Plus_Jakarta_Sans',sans-serif]" />
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
      return { mainHeading, mainDesc: mainDesc.join("\n"), items };
    });

    return (
      <div className="w-full font-['Plus_Jakarta_Sans',sans-serif]">
        {introText && <p dangerouslySetInnerHTML={{ __html: parseContentWithImages(introText) }} className="text-[14.5px] md:text-[15px] text-slate-600 leading-[1.65] font-medium text-justify mb-6 break-words" />}
        
        <div className="flex flex-col gap-4 w-full">
          {modules.map((mod, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:bg-white" style={{ borderTop: `3px solid ${accentColor}` }}>
              
              <div className="flex gap-2 md:gap-3 items-start mb-2 md:mb-3 pb-2 md:pb-3 border-b border-black/5">
                <span className="font-['Fraunces',serif] text-[20px] md:text-[24px] font-black leading-none opacity-20 shrink-0 whitespace-nowrap mt-0.5" style={{ color: accentColor }}>{String(idx + 1).padStart(2, '0')}</span>
                <h4 className="text-[16.5px] md:text-[18px] font-extrabold text-slate-900 leading-[1.2] break-words m-0">{mod.mainHeading}</h4>
              </div>
              
              {mod.mainDesc && <p dangerouslySetInnerHTML={{ __html: parseContentWithImages(mod.mainDesc) }} className="text-[14.5px] md:text-[14px] text-slate-700 mb-4 leading-[1.65] font-medium text-justify break-words" />}
              
              {mod.items.length > 0 && (
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {mod.items.map((item, sIdx) => (
                    <li key={sIdx} className={`${item.bullets.length > 0 ? 'mb-4' : 'mb-0'}`}>
                      <div className="text-[15px] font-bold text-slate-800 flex items-start leading-[1.4]">
                        <span style={{ color: accentColor }} className="mr-2 mt-[1px] shrink-0">▹</span>
                        <span className="break-words">{item.title}</span>
                      </div>
                      
                      {item.desc.length > 0 && (
                        <p dangerouslySetInnerHTML={{ __html: parseContentWithImages(item.desc.join("\n")) }} className="text-[14.5px] md:text-[14px] text-slate-500 leading-[1.65] ml-6 mt-1 font-medium text-justify break-words" />
                      )}

                      {item.bullets.length > 0 && (
                        <ul className="list-disc ml-[38px] mt-2 text-slate-600 text-[14px] leading-[1.6] font-medium">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="mb-1 break-words" dangerouslySetInnerHTML={{ __html: parseContentWithImages(bullet) }} />
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
    <div className="font-serif text-[#1a2e1a] w-full max-w-[100vw] overflow-x-hidden relative" style={{ background:"linear-gradient(to bottom, #f8fdf8 0%, #f0fbf0 100%)" }}>

      <style>{`
        html { scroll-behavior: smooth; }

        .cinematic-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.05);
          transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 6s linear;
          will-change: transform, opacity;
        }
        .cinematic-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }
        .cinematic-slide.exiting {
          opacity: 0;
          z-index: 0;
        }

        /* HIGH-PERFORMANCE SCROLLBAR */
        .modal-scrollbar {
          -webkit-overflow-scrolling: touch; 
          transform: translateZ(0); 
        }
        .modal-scrollbar::-webkit-scrollbar { width: 6px; }
        .modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .modal-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
      `}</style>

      {/* ══ HERO ══ */}
      <section
        ref={sliderRef}
        className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden select-none"
        onMouseDown={onDragStart} onMouseUp={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}
      >
        {ldSlides ? (
          <div className="absolute inset-0 bg-[#111]" />
        ) : slides.map((sl, i) => (
          <div 
            key={sl.id} 
            className={`cinematic-slide ${i === slideIdx ? "active" : (transitioning ? "exiting" : "")}`}
            style={{
              backgroundImage: `url(${sl.url})`,
              filter: "brightness(0.45)", 
            }}
          />
        ))}

        <div className="absolute inset-0 z-[2]" style={{ background:"linear-gradient(110deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)" }} />
        
        <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center pt-28 md:pt-32 pb-16">
          <div className="flex w-full flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
            
            <div className="max-w-[750px] text-center md:text-left flex flex-col items-center md:items-start w-full">
              <div className="glass inline-flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full mb-[24px] md:mb-[30px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] block shadow-[0_0_10px_#10b981]" style={{ animation:"pulseDot 1.4s ease-in-out infinite" }} />
                <span className="jk text-[11px] md:text-[13px] text-[#0f172a] font-extrabold tracking-widest uppercase">
                  {ldSlides ? "Loading…" : slides[slideIdx]?.caption}
                </span>
              </div>

              <h1 className="fr text-[clamp(40px,10vw,86px)] leading-[1.05] font-black text-white tracking-tight drop-shadow-2xl break-words w-full">
                Cultivating<br />
                <span className="text-[#11a967]">Tomorrow's Agriculture</span><br />
                <span className="text-[#aec708]">Today</span>
              </h1>

              <p className="jk mt-4 md:mt-6 text-sm sm:text-base md:text-lg leading-[1.6] md:leading-[1.8] text-white/85 max-w-[500px] font-normal drop-shadow-md break-words">
                {ldSlides ? "Join a thriving community…" : slides[slideIdx]?.sub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 sm:gap-4 w-full sm:w-auto md:min-w-[220px] mt-4 md:mt-0 px-4 md:px-0">
              <a href="/stories" className="hero-glass-btn primary w-full sm:w-auto">Explore Stories</a>
              <a href="/UnderDevelopment" className="hero-glass-btn secondary w-full sm:w-auto">Join Community</a>
            </div>

          </div>
        </div>

        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} className={`slide-dot ${i === slideIdx ? "on" : ""}`}
              onClick={() => { clearInterval(timerRef.current); goSlide(i); }}
            />
          ))}
        </div>

        <div className="absolute bottom-7 right-6 md:right-12 z-10 hidden md:flex flex-col items-center gap-2">
          <div className="w-6 h-10 rounded-xl border-2 border-white/50 flex p-1 justify-center">
            <div className="w-1 h-2.5 rounded-sm bg-white" style={{ animation:"scrollDot 1.6s ease infinite" }} />
          </div>
          <span className="jk text-[11px] text-white/70 tracking-[.15em] font-bold uppercase">Scroll</span>
        </div>
      </section>

      {/* ══ STORIES ══ */}
      <section className="py-12 md:py-[120px] px-4 sm:px-6 md:px-[52px] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div id="stories-hdr" ref={setRef("stories-hdr")} className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-[60px] border-b border-[#10b981]/20 pb-5 gap-4 reveal ${visible["stories-hdr"] ? "on" : ""}`}>
            <div>
              <span className="chip">Real Experiences</span>
              <h2 className="fr text-[clamp(28px,6vw,56px)] font-extrabold text-[#0f172a] leading-[1.1]">Featured Stories</h2>
            </div>
            <a href="/stories" className="btn-outline !bg-transparent !text-[#047857] w-full sm:w-auto justify-center">View All Stories</a>
          </div>

          <div id="stories-grid" ref={setRef("stories-grid")} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-y-[60px] md:gap-x-[40px] w-full">
            {ldStories ? [1,2,3,4,5,6].map(i => (
              <div key={i} className="w-full"><Skel h={260} r={20} mb={20}/><Skel w="80%" h={28} mb={12}/><Skel w="60%"/></div>
            )) : stories.map((s, i) => (
              <div key={s.id} className={`story-card reveal d${(i%3)+1} ${visible["stories-grid"] ? "on" : ""} w-full`}
                onClick={() => setActiveStoryModal(s)}
              >
                <div className="story-img-wrap">
                  <img src={s.img} alt={s.title} />
                  <div className="absolute top-4 left-4"><span className="tag">{s.tag}</span></div>
                </div>
                
                <div className="flex items-center gap-3 mb-4 px-2 md:px-0">
                  <div className="avatar w-[30px] h-[30px] text-[11px]" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{s.initials}</div>
                  <span className="jk text-[14px] font-bold text-[#334155]">{s.author}</span>
                </div>
                
                <h3 className="fr text-xl md:text-2xl font-extrabold leading-[1.3] mb-3 text-[#0f172a] break-words px-2 md:px-0">{s.title}</h3>
                <p className="jk text-[14px] md:text-[15px] text-[#64748b] leading-[1.7] font-medium break-words px-2 md:px-0">
                  {(s.desc || "").substring(0, 90)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TOPICS (COLORFUL CLAYMORPHISM) ══ */}
      <section className="py-12 md:pt-[60px] px-4 sm:px-6 md:px-[52px] md:pb-[120px] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div id="topics-hdr" ref={setRef("topics-hdr")} className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-[60px] border-b border-[#10b981]/20 pb-5 gap-4 reveal ${visible["topics-hdr"] ? "on" : ""}`}>
            <div>
              <span className="chip">Knowledge Hub</span>
              <h2 className="fr text-[clamp(28px,6vw,56px)] font-extrabold text-[#0f172a] leading-[1.1]">Explore Topics</h2>
            </div>
            <a href="/topics" className="btn-outline !bg-transparent !text-[#047857] w-full sm:w-auto justify-center">View All Topics</a>
          </div>

          <div id="topics-grid" ref={setRef("topics-grid")} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-y-[30px] md:gap-x-[40px] w-full">
            {ldTopics ? [1,2,3,4,5,6].map(i => (
              <div key={i} className="topic-card w-full">
                <Skel w={80} h={80} mb={24} r={26} />
                <Skel w="70%" h={28} mb={16}/>
                <Skel w="90%" h={18} mb={8}/><Skel w="60%" h={18}/>
              </div>
            )) : topics.map((t, i) => {
              const theme = TOPIC_THEMES[i % TOPIC_THEMES.length];
              return (
              <div key={t.id} className={`topic-card w-full reveal d${i+1} ${visible["topics-grid"] ? "on" : ""}`}
                style={{ '--card-bg': theme.bg, '--card-shadow': theme.shadow, '--card-text': theme.text }}
                onClick={() => setActiveTopicModal(t)}
              >
                <div className="topic-icon-wrap">{t.icon}</div>
                <h3 className="fr text-xl md:text-2xl font-extrabold mb-2.5 text-[#0f172a] break-words px-2">{t.label}</h3>
                
                {/* 🟢 FIXED: `break-all` and `line-clamp-3` guarantee text never spills out of the card! */}
                <p className="jk text-[14px] md:text-[15px] text-[#64748b] leading-[1.7] font-medium break-all line-clamp-3 px-2">
                  {(t.desc || "").replace(/\[IMG:.*?\]|!\[.*?\]\(.*?\)|#|[-*]/g, "")}
                </p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className="px-4 sm:px-6 md:px-[52px] pb-16 md:pb-[100px] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[24px] md:rounded-[32px] overflow-hidden border border-white text-center relative px-4 py-10 md:p-[80px] shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] w-full" style={{ background:"linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)" }}>
          <span className="absolute -top-6 -left-4 text-[120px] md:text-[180px] opacity-5 -rotate-12 pointer-events-none">🌿</span>
          <div className="relative z-10">
            <span className="chip !bg-white">Join Us Today</span>
            <h2 className="fr text-[clamp(26px,6vw,56px)] font-extrabold text-[#0f172a] leading-[1.1] mb-4 md:mb-5">
              Start Your Green<br /><span className="text-[#059669] italic">Journey Today</span>
            </h2>
            <p className="jk text-sm md:text-base text-[#334155] max-w-[480px] mx-auto mb-8 md:mb-10 font-medium leading-[1.6] md:leading-[1.8] px-2">
              Get weekly plant care reminders, personalised tips, and connect with gardeners worldwide.
            </p>
            
            <div className="flex max-w-[500px] mx-auto relative px-2 md:px-0">
              {nlState === "success" ? (
                <div className="w-full h-[54px] flex items-center justify-center bg-white rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.2)] text-[#059669] font-sans font-extrabold text-sm md:text-base" style={{ animation: "bounceTwist 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}>
                  🎉 You're all set! ThankYou
                </div>
              ) : (
                <div className={`flex flex-row w-full transition-opacity duration-300 ${nlState === "loading" ? "opacity-80" : "opacity-100"}`}>
                  <input 
                    className="flex-1 min-w-0 w-full bg-white border border-transparent focus:border-[#059669] outline-none px-4 md:px-6 py-0 rounded-l-full rounded-r-none shadow-sm font-['Plus_Jakarta_Sans'] text-[14px] md:text-[15px] h-[54px]" 
                    placeholder="Enter your email address…" 
                    value={nlEmail} 
                    onChange={e => setNlEmail(e.target.value)}
                    disabled={nlState === "loading"}
                  />
                  <button className="shrink-0 bg-[#059669] hover:bg-[#047857] text-white transition-colors w-auto rounded-l-none rounded-r-full px-5 md:px-8 text-[14px] md:text-[15px] font-bold h-[54px] flex justify-center items-center shadow-md md:shadow-none cursor-pointer" onClick={handleSubscribe} disabled={nlState === "loading"}>
                    {nlState === "loading" ? <div className="spinner mx-auto" /> : "Subscribe 🌱"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {/* 🟢 STORY MODAL OVERLAY */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-16 animate-[fadeIn_.3s_ease-out]" onClick={() => setActiveStoryModal(null)}>
          <div className="relative w-full max-w-[860px] max-h-[90vh] md:max-h-[85vh] bg-white rounded-[20px] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_.4s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 md:top-5 md:right-5 z-[100] w-10 h-10 md:w-11 md:h-11 bg-white/20 hover:bg-white border border-white/40 text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-110 cursor-pointer" onClick={() => setActiveStoryModal(null)}>✕</button>

            <div className="overflow-y-auto overflow-x-hidden flex-1 w-full relative modal-scrollbar">
              <div className="h-[200px] md:h-[320px] w-full shrink-0 relative">
                <img src={activeStoryModal.img} alt={activeStoryModal.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8">
                  <span className="tag !bg-white/90 !text-[#047857] mb-2 md:mb-4 inline-block">{activeStoryModal.tag}</span>
                  <h1 className="fr text-[clamp(20px,5vw,42px)] font-black text-white leading-[1.15] drop-shadow-md break-words">
                    {activeStoryModal.title}
                  </h1>
                </div>
              </div>

              <div className="p-5 md:p-10 md:px-12 md:pb-[60px]">
                <div className="flex items-center gap-3 md:gap-4 pb-4 md:pb-6 border-b border-[#e2e8f0] mb-6 md:mb-8">
                  <div className="avatar w-10 h-10 md:w-12 md:h-12 text-sm md:text-base" style={{ background: AVATAR_COLORS[(activeStoryModal.id || 0) % AVATAR_COLORS.length] }}>{activeStoryModal.initials}</div>
                  <div>
                    <div className="jk text-[15px] md:text-base font-extrabold text-[#0f172a]">{activeStoryModal.author}</div>
                    <div className="jk text-xs md:text-sm text-[#64748b] mt-0.5 font-medium">{activeStoryModal.ago}</div>
                  </div>
                </div>

                <div className="font-['Plus_Jakarta_Sans',sans-serif]">
                  {(activeStoryModal.content || activeStoryModal.desc || "No full content available.").split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} className="text-[14.5px] md:text-[15px] text-slate-700 leading-[1.65] font-medium text-justify mb-4 break-words" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 TOPIC MODAL OVERLAY */}
      {activeTopicModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-16 animate-[fadeIn_0.3s_ease-out]" onClick={() => setActiveTopicModal(null)}>
          <div className="bg-white rounded-[24px] w-full max-w-[1100px] max-h-[85vh] flex flex-col relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 z-[100] w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-slate-900 text-xl flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:bg-white hover:text-emerald-600 hover:scale-110" onClick={() => setActiveTopicModal(null)}>✕</button>
            
            <div className="overflow-y-auto overflow-x-hidden flex-1 w-full break-words modal-scrollbar">
              <div className="px-5 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6 text-center flex flex-col items-center" style={{ background: `linear-gradient(180deg, ${activeTopicModal.color} 0%, rgba(255,255,255,0) 100%)` }}>
                <div className="w-[56px] md:w-[72px] h-[56px] md:h-[72px] rounded-[20px] bg-white flex items-center justify-center text-[28px] md:text-[36px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] mb-4 md:mb-5">
                  {activeTopicModal.icon}
                </div>
                <h2 className="font-['Lora',serif] text-[clamp(24px,4vw,36px)] font-black text-slate-900 leading-[1.1] mb-4 break-words">
                  {activeTopicModal.label}
                </h2>
              </div>
              <div className="px-5 md:px-6 pb-8 md:pb-12"> 
                <div>
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