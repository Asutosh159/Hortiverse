import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
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
    }, 600);
  };

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      goSlide((slideIdx + 1) % slides.length);
    }, 5000);
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

  // 🟢 FIXED: Explicitly added style={{ textAlign: "justify" }} to all text elements in the modal
  const renderTopicContent = (text, accentColor) => {
    if (!text.includes("##")) {
      return text.split("\n\n").map((para, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} className="break-words text-[14px] md:text-[16px] text-slate-700 mb-5" style={{ textAlign: "justify", lineHeight: 1.8 }} />
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
        
        // Match "- Subheading"
        const isSubheading = line.match(/^-\s+(.*)/);
        // Match "* Bullet point"
        const isBulletPoint = line.match(/^\*\s+(.*)/);
        
        if (isSubheading) {
          if (currentSubheading) items.push(currentSubheading);
          currentSubheading = { title: isSubheading[1], desc: [], bullets: [] };
        } 
        else if (isBulletPoint) {
          if (currentSubheading) {
            currentSubheading.bullets.push(isBulletPoint[1]);
          } else {
            mainDesc.push(`• ${isBulletPoint[1]}`);
          }
        } 
        else {
          if (currentSubheading) {
            currentSubheading.desc.push(line);
          } else {
            mainDesc.push(line); 
          }
        }
      }
      
      if (currentSubheading) items.push(currentSubheading);

      return { mainHeading, mainDesc: mainDesc.join(" "), items };
    });

    return (
      <div className="skeleton-container">
        {introText && <p className="skeleton-intro break-words text-[14px] md:text-[16px] text-slate-700 mb-6" style={{ textAlign: "justify", lineHeight: 1.8 }}>{introText}</p>}
        <div className="skeleton-grid flex flex-col gap-4 md:gap-5">
          {modules.map((mod, idx) => (
            <div key={idx} className="bg-white md:bg-[#f8faf9] border border-slate-200 rounded-[16px] p-5 md:p-8 w-full shadow-sm md:shadow-none" style={{ borderTop: `3px solid ${accentColor}` }}>
              <div className="flex items-start gap-3 mb-3 border-b border-slate-100 pb-3">
                <span className="font-['Fraunces'] text-[28px] md:text-[32px] font-black opacity-20 leading-none mt-0.5 shrink-0 whitespace-nowrap" style={{ color: accentColor }}>{String(idx + 1).padStart(2, '0')}</span>
                <h4 className="text-[17px] md:text-[18px] font-extrabold text-slate-900 m-0 leading-snug break-words">{mod.mainHeading}</h4>
              </div>
              {mod.mainDesc && <p className="text-[14px] md:text-[15px] text-slate-600 mb-4 break-words" style={{ textAlign: "justify", lineHeight: 1.7 }}>{mod.mainDesc}</p>}
              {mod.items.length > 0 && (
                <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                  {mod.items.map((item, sIdx) => (
                    <li key={sIdx} style={{ marginBottom: item.bullets.length > 0 ? '16px' : '0' }}>
                      <div className="flex items-start text-[14px] md:text-[15px] font-bold text-slate-800 leading-[1.4]">
                        <span className="shrink-0" style={{ color: accentColor, marginRight: 8, marginTop: 2 }}>▹</span>
                        <span className="break-words">{item.title}</span>
                      </div>
                      {item.desc.length > 0 && (
                        <p className="text-[13px] md:text-[14.5px] text-slate-500 mt-1.5 ml-5 break-words" style={{ textAlign: "justify", lineHeight: 1.6 }}>{item.desc.join(" ")}</p>
                      )}
                      {item.bullets.length > 0 && (
                        <ul style={{ listStyleType: 'disc', marginLeft: '38px', marginTop: '8px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: '4px', wordBreak: 'break-word', textAlign: 'justify', lineHeight: 1.6 }}>{bullet}</li>
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
          <div key={sl.id} className={`slide-img ${(transitioning && i === slideIdx) || (!transitioning && i !== slideIdx) ? "out" : ""}`}
            style={{
              position:"absolute", inset:0, zIndex: i === slideIdx ? 1 : 0,
              backgroundImage:`url(${sl.url})`,
              backgroundSize:"cover", backgroundPosition:"center",
              filter:"brightness(0.45)", opacity: i === slideIdx ? 1 : 0,
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
                <p className="jk text-[14px] md:text-[15px] text-[#64748b] leading-[1.7] font-medium break-words px-2">
                  {(t.desc || "").replace(/#|-|\*/g, '').substring(0, 85)}...
                </p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className="px-4 sm:px-6 md:px-[52px] pb-16 md:pb-[100px] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto rounded-[24px] md:rounded-[32px] overflow-hidden border border-white text-center relative px-4 py-10 md:p-[80px] shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] w-full" style={{ background:"linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)" }}>
          <span className="absolute -top-6 -left-4 text-[120px] md:text-[180px] opacity/5 -rotate-15 pointer-events-none">🌿</span>
          <div className="relative z-10">
            <span className="chip !bg-white">Join Us Today</span>
            <h2 className="fr text-[clamp(26px,6vw,56px)] font-extrabold text-[#0f172a] leading-[1.1] mb-4 md:mb-5">
              Start Your Green<br /><span className="text-[#059669] italic">Journey Today</span>
            </h2>
            <p className="jk text-sm md:text-base text-[#334155] max-w-[480px] mx-auto mb-8 md:mb-10 font-medium leading-[1.6] md:leading-[1.8] px-2">
              Get weekly plant care reminders, personalised tips, and connect with gardeners worldwide.
            </p>
            
            <div className="flex flex-col md:flex-row max-w-[500px] mx-auto relative gap-3 md:gap-0 px-2 md:px-0">
              {nlState === "success" ? (
                <div className="w-full h-[50px] flex items-center justify-center bg-white rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.2)] text-[#059669] font-sans font-extrabold text-sm md:text-base" style={{ animation: "bounceTwist 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}>
                  🎉 You're all set! ThankYou
                </div>
              ) : (
                <div className={`flex flex-col md:flex-row w-full gap-3 md:gap-0 transition-opacity duration-300 ${nlState === "loading" ? "opacity-80" : "opacity-100"}`}>
                  <input 
                    className="nl-input w-full rounded-full md:rounded-r-none md:rounded-l-full shadow-sm md:shadow-none" 
                    placeholder="Enter your email address…" 
                    value={nlEmail} 
                    onChange={e => setNlEmail(e.target.value)}
                    disabled={nlState === "loading"}
                  />
                  <button className="btn-solid w-full md:w-auto rounded-full md:rounded-l-none md:rounded-r-full px-8 text-sm h-[50px] flex justify-center items-center shadow-md md:shadow-none" onClick={handleSubscribe} disabled={nlState === "loading"}>
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 md:p-12 animate-[fadeIn_.3s_ease-out]" onClick={() => setActiveStoryModal(null)}>
          <div className="relative w-full max-w-[860px] max-h-[90vh] md:max-h-[85vh] bg-white rounded-[20px] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_.4s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 hover:bg-white border border-white/40 text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all shadow-md" onClick={() => setActiveStoryModal(null)}>✕</button>

            <div className="overflow-y-auto flex-1 w-full relative">
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

                <div className="modal-content-text">
                  {(activeStoryModal.content || activeStoryModal.desc || "No full content available.").split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} className="text-[14px] md:text-[16px] text-slate-700 mb-5" style={{ textAlign: "justify", lineHeight: 1.8 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 TOPIC MODAL OVERLAY */}
      {activeTopicModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 md:p-12 animate-[fadeIn_.3s_ease-out]" onClick={() => setActiveTopicModal(null)}>
          <div className="relative w-full max-w-[860px] max-h-[90vh] md:max-h-[85vh] bg-white rounded-[20px] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_.4s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()} style={{ '--accent-color': activeTopicModal.accent }}>
            <button className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-slate-700 transition-colors" onClick={() => setActiveTopicModal(null)}>✕</button>
            
            <div className="overflow-y-auto flex-1 w-full">
              <div className="pt-10 px-5 pb-6 md:pt-12 md:px-12 md:pb-8" style={{ background: `linear-gradient(180deg, ${activeTopicModal.color} 0%, rgba(255,255,255,0) 100%)` }}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-[16px] md:rounded-[20px] bg-white flex items-center justify-center text-[32px] md:text-[36px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] mb-4 md:mb-5">
                    {activeTopicModal.icon}
                  </div>
                  <h2 className="fr text-[24px] md:text-[36px] font-black text-[#0f172a] leading-[1.2] mb-2 px-2 break-words max-w-[80%]">
                    {activeTopicModal.label}
                  </h2>
                </div>
              </div>
              <div className="px-5 pb-8 md:px-12 md:pb-12">
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