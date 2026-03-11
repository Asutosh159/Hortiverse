import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════
   BACKEND-READY API LAYER
   When your Node/Express backend is ready, replace
   each mock below with real fetch calls like:

   async getStats() {
     const res = await fetch("http://localhost:5000/api/stats");
     return res.json();
   }
══════════════════════════════════════════════════ */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const API = {
  async getSlides()  { await delay(400);  return MOCK.slides;  },
  async getStats()   { await delay(700);  return MOCK.stats;   },
  async getStories() { await delay(900);  return MOCK.stories; },
  async getTopics()  { await delay(800);  return MOCK.topics;  },
};

/* ══════════════════════════════════════════════════
   MOCK JSON DATA  ← swap with DB rows later
══════════════════════════════════════════════════ */
const MOCK = {
  slides: [
    { id:1, url:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1800&q=85", caption:"Growing Together Since 2026",      sub:"Join the world's leading horticulture community" },
    { id:2, url:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1800&q=85", caption:"Sustainable Agriculture",           sub:"Learn eco-friendly farming from experts worldwide" },
    { id:3, url:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=85", caption:"Global Horticulture Community",     sub:"Connect with 2,450+ students across 45 countries" },
    { id:4, url:"https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1800&q=85", caption:"Modern Farming Techniques",        sub:"From IoT sensors to regenerative grazing practices" },
    { id:5, url:"https://images.unsplash.com/photo-1592982537447-6f2a6a0a7b5e?w=1800&q=85", caption:"Cultivating Tomorrow's Future",    sub:"Share your knowledge, grow together as one" },
  ],
  stats: {
    students:  2450,
    stories:   1200,
    countries: 45,
    species:   12000,
  },
  stories: [
    { id:1, author:"Emma Rodriguez", initials:"ER", ago:"2 days ago",  title:"My Journey with Vertical Farming in Urban Spaces",     desc:"Transforming my apartment balcony into a thriving vertical garden taught me invaluable lessons about space optimization and sustainable food production.", tag:"Urban Farming", img:"https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80" },
    { id:2, author:"James Chen",     initials:"JC", ago:"5 days ago",  title:"Implementing IoT Sensors in Traditional Rice Paddies", desc:"How I helped my family farm modernize with affordable technology while preserving traditional farming wisdom passed down through generations.",           tag:"AgriTech",     img:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" },
    { id:3, author:"Sarah Johnson",  initials:"SJ", ago:"1 week ago",  title:"Regenerative Grazing: Results from My First Year",    desc:"Documenting the transformation of degraded pastureland through holistic management and rotational grazing practices across four seasons.",               tag:"Livestock",    img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
    { id:4, author:"Ravi Sharma",    initials:"RS", ago:"2 weeks ago", title:"Drip Irrigation on Small-Scale Farms in Rajasthan",   desc:"How affordable drip systems doubled my yield while cutting water usage by 60%, transforming our family's smallholding in rural India.",                   tag:"Irrigation",   img:"https://images.unsplash.com/photo-1592982537447-6f2a6a0a7b5e?w=600&q=80" },
    { id:5, author:"Aiko Tanaka",    initials:"AT", ago:"3 weeks ago", title:"Urban Rooftop Farms: Tokyo's Green Revolution",        desc:"Discovering how community rooftop gardens are reshaping food security and mental health outcomes in one of the world's most densely populated cities.",  tag:"Urban Farming", img:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
    { id:6, author:"Carlos Mendes",  initials:"CM", ago:"1 month ago", title:"Composting at Scale: Lessons from 5 Seasons",          desc:"Building a circular nutrient system for our cooperative farm taught us that waste is simply a resource in the wrong place.",                                tag:"Composting",    img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
  ],
  topics: [
    { id:1, icon:"🌾", label:"Sustainable Farming",   desc:"Eco-friendly practices and regenerative agriculture",  posts:342 },
    { id:2, icon:"🚜", label:"AgriTech & Innovation", desc:"Technology transforming modern agriculture",            posts:218 },
    { id:3, icon:"🐄", label:"Livestock Management",  desc:"Animal husbandry and welfare practices",               posts:189 },
    { id:4, icon:"🌽", label:"Crop Science",          desc:"Cultivation techniques and yield optimization",         posts:456 },
    { id:5, icon:"🌿", label:"Plant Pathology",       desc:"Disease identification and prevention methods",         posts:167 },
    { id:6, icon:"🌍", label:"Global Agriculture",    desc:"Worldwide farming trends and food security",            posts:203 },
  ],
};

const AVATAR_COLORS = ["#4caf50","#2e7d32","#66bb6a","#388e3c","#81c784","#1b5e20"];

/* ── Skeleton loader ── */
function Skel({ w="100%", h=20, r=8, mb=0, style={} }) {
  return <div style={{ width:w, height:h, borderRadius:r, marginBottom:mb, background:"linear-gradient(90deg,#e8f5e8 25%,#d0ead0 50%,#e8f5e8 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", flexShrink:0, ...style }} />;
}

/* ── Animated counter ── */
function Counter({ target, suffix="", duration=2000 }) {
  const [n, setN]     = useState(0);
  const started       = useRef(false);
  const el            = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const step = Math.ceil(target / (duration / 16));
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          setN(cur);
          if (cur >= target) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (el.current) obs.observe(el.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={el}>{n.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Home() {
  const [scrollY,        setScrollY]        = useState(0);
  const [visible,        setVisible]        = useState({});
  const [slideIdx,       setSlideIdx]       = useState(0);
  const [transitioning,  setTransitioning]  = useState(false);
  const [hoveredTopic,   setHoveredTopic]   = useState(null);
  const [hoveredStory,   setHoveredStory]   = useState(null);
  const [storiesPage,    setStoriesPage]    = useState(0);        // for load-more
  const storiesPerPage   = 3;

  /* data */
  const [slides,   setSlides]   = useState([]);
  const [stats,    setStats]    = useState(null);
  const [stories,  setStories]  = useState([]);
  const [topics,   setTopics]   = useState([]);

  /* loading flags */
  const [ldSlides,  setLdSlides]  = useState(true);
  const [ldStats,   setLdStats]   = useState(true);
  const [ldStories, setLdStories] = useState(true);
  const [ldTopics,  setLdTopics]  = useState(true);
  const [ldMore,    setLdMore]    = useState(false);

  const sectionRefs = useRef({});
  const timerRef    = useRef(null);
  const sliderRef   = useRef(null);

  /* ── fetch all on mount ── */
  useEffect(() => {
    API.getSlides().then(d  => { setSlides(d);  setLdSlides(false);  });
    API.getStats().then(d   => { setStats(d);   setLdStats(false);   });
    API.getStories().then(d => { setStories(d.slice(0, storiesPerPage)); setLdStories(false); });
    API.getTopics().then(d  => { setTopics(d);  setLdTopics(false);  });
  }, []);

  /* ── auto-slide every 5 s ── */
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

  /* ── scroll ── */
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

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

  /* ── load more stories ── */
  const loadMore = async () => {
    setLdMore(true);
    await delay(800);
    const all = MOCK.stories; // replace with API call: await API.getStories({ page: storiesPage+1 })
    const next = storiesPage + 1;
    setStories(all.slice(0, (next + 1) * storiesPerPage));
    setStoriesPage(next);
    setLdMore(false);
  };

  const allLoaded = stories.length >= MOCK.stories.length;

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

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#f8fdf8", color:"#1a2e1a", overflowX:"hidden" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#f0faf0; }
        ::-webkit-scrollbar-thumb { background:#a8d8a8; border-radius:3px; }

        .fr { font-family:'Fraunces',serif; }
        .jk { font-family:'Plus Jakarta Sans',sans-serif; }

        /* shimmer */
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* pulse dot */
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.6} }

        /* scroll dot */
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(10px);opacity:0} }

        /* reveal */
        .reveal { opacity:0; transform:translateY(26px); transition:opacity .75s ease,transform .75s ease; }
        .reveal.on { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.08s} .d2{transition-delay:.18s} .d3{transition-delay:.28s}
        .d4{transition-delay:.38s} .d5{transition-delay:.48s} .d6{transition-delay:.58s}

        /* slide fade */
        .slide-img { transition: opacity .6s ease; }
        .slide-img.out { opacity:0; }

        /* glass */
        .glass {
          background:rgba(255,255,255,.62);
          backdrop-filter:blur(22px); -webkit-backdrop-filter:blur(22px);
          border:1px solid rgba(255,255,255,.88);
          box-shadow:0 4px 24px rgba(60,140,60,.07);
        }

        /* nav links */
        .nav-lk {
          color:#1a3a1a; text-decoration:none;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:14px; font-weight:600; letter-spacing:.01em;
          transition:color .2s; position:relative; padding-bottom:2px;
        }
        .nav-lk::after {
          content:''; position:absolute; bottom:-2px; left:0;
          width:0; height:2px;
          background:linear-gradient(90deg,#4caf50,#81c784);
          border-radius:2px; transition:width .28s;
        }
        .nav-lk:hover { color:#43a047; }
        .nav-lk:hover::after, .nav-lk.active::after { width:100%; }
        .nav-lk.active { color:#43a047; font-weight:700; }

        /* buttons */
        .btn-solid {
          background:linear-gradient(135deg,#43a047,#1b5e20);
          color:#fff; border:none; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          font-size:14px; letter-spacing:.02em; text-decoration:none;
          padding:12px 28px; border-radius:50px; display:inline-flex;
          align-items:center; gap:6px;
          transition:all .3s; box-shadow:0 4px 18px rgba(67,160,71,.38);
        }
        .btn-solid:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(67,160,71,.5); filter:brightness(1.06); }

        .btn-outline {
          background:rgba(255,255,255,.75); backdrop-filter:blur(10px);
          color:#2e7d32; border:1.5px solid rgba(67,160,71,.45); cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;
          font-size:14px; text-decoration:none;
          padding:11px 28px; border-radius:50px; display:inline-flex;
          align-items:center; gap:6px; transition:all .3s;
        }
        .btn-outline:hover { background:rgba(76,175,80,.1); border-color:#4caf50; transform:translateY(-2px); }

        /* story card */
        .story-card {
          background:rgba(255,255,255,.75);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,.92);
          box-shadow:0 4px 24px rgba(60,140,60,.08);
          border-radius:20px; overflow:hidden;
          transition:all .4s cubic-bezier(.23,1,.32,1);
        }
        .story-card:hover {
          transform:translateY(-8px);
          box-shadow:0 22px 56px rgba(60,140,60,.18);
          border-color:rgba(100,180,100,.4);
        }

        /* topic card */
        .topic-card {
          background:rgba(255,255,255,.68);
          backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
          border:1.5px solid rgba(255,255,255,.9);
          box-shadow:0 4px 20px rgba(60,140,60,.07);
          border-radius:20px; padding:28px 24px;
          transition:all .35s cubic-bezier(.23,1,.32,1); cursor:pointer;
        }
        .topic-card:hover {
          background:rgba(255,255,255,.94);
          border-color:rgba(76,175,80,.5);
          box-shadow:0 18px 48px rgba(60,140,60,.16);
          transform:translateY(-5px);
        }

        /* stat card */
        .stat-pill {
          background:rgba(255,255,255,.75);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,.92);
          box-shadow:0 4px 20px rgba(0,0,0,.07);
          border-radius:16px; padding:16px 22px;
          display:flex; align-items:center; gap:14px;
          transition:transform .3s;
        }
        .stat-pill:hover { transform:translateY(-3px); }

        /* section chip */
        .chip {
          display:inline-block;
          background:rgba(76,175,80,.1); color:#2e7d32;
          border:1px solid rgba(76,175,80,.25);
          font-family:'Plus Jakarta Sans',sans-serif; font-size:12px;
          font-weight:600; letter-spacing:.08em; text-transform:uppercase;
          padding:6px 18px; border-radius:50px; margin-bottom:16px;
        }

        /* tag badge */
        .tag {
          background:rgba(0,0,0,.45); backdrop-filter:blur(8px);
          color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:11px; font-weight:600; letter-spacing:.06em;
          text-transform:uppercase; padding:4px 12px; border-radius:20px;
        }

        /* avatar */
        .avatar {
          width:38px; height:38px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:700; font-size:13px; color:#fff; flex-shrink:0;
        }

        /* input */
        .nl-input {
          flex:1; min-width:0;
          background:rgba(255,255,255,.85); backdrop-filter:blur(12px);
          border:1.5px solid rgba(255,255,255,.95); color:#1a2e1a;
          padding:14px 22px; border-radius:50px 0 0 50px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px;
          outline:none; transition:border-color .3s;
        }
        .nl-input::placeholder { color:#9aba9a; }
        .nl-input:focus { border-color:rgba(76,175,80,.6); }

        /* load more spinner */
        @keyframes spin { to{transform:rotate(360deg)} }
        .spinner { width:20px; height:20px; border:2px solid rgba(76,175,80,.2); border-top-color:#4caf50; border-radius:50%; animation:spin .7s linear infinite; }

        /* slide dot */
        .slide-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.45); transition:all .3s; cursor:pointer; border:none; }
        .slide-dot.on { width:24px; border-radius:4px; background:#fff; }

        /* stat card slide-in */
        @keyframes statSlide { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Navbar is rendered globally via App.jsx */}

      {/* ════════════════════════════════════
          HERO — horizontal auto-sliding background
          dark gradient, no green tint
      ════════════════════════════════════ */}
      <section
        ref={sliderRef}
        style={{ position:"relative", height:"100vh", minHeight:620, overflow:"hidden", userSelect:"none" }}
        onMouseDown={onDragStart} onMouseUp={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}
      >
        {/* background slides */}
        {ldSlides ? (
          <div style={{ position:"absolute", inset:0, background:"#111" }} />
        ) : slides.map((sl, i) => (
          <div key={sl.id} className={`slide-img ${(transitioning && i === slideIdx) || (!transitioning && i !== slideIdx) ? "out" : ""}`}
            style={{
              position:"absolute", inset:0, zIndex: i === slideIdx ? 1 : 0,
              backgroundImage:`url(${sl.url})`,
              backgroundSize:"cover", backgroundPosition:"center",
              filter:"brightness(0.48)",
              transition:"opacity .65s ease",
              opacity: i === slideIdx ? 1 : 0,
            }}
          />
        ))}

        {/* ── layered gradient with soft blur panels ── */}
        {/* main dark-left gradient */}
        <div style={{
          position:"absolute", inset:0, zIndex:2,
          background:"linear-gradient(110deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.18) 75%, rgba(0,0,0,0.05) 100%)",
        }} />
        {/* green tint wash — very subtle */}
        <div style={{
          position:"absolute", inset:0, zIndex:2,
          background:"linear-gradient(180deg, rgba(10,40,10,0.22) 0%, transparent 60%)",
        }} />
        {/* frosted-glass blur strip on left third */}
        <div style={{
          position:"absolute", top:0, left:0, bottom:0, width:"48%", zIndex:2,
          backdropFilter:"blur(3px)", WebkitBackdropFilter:"blur(3px)",
          maskImage:"linear-gradient(to right, black 55%, transparent 100%)",
          WebkitMaskImage:"linear-gradient(to right, black 55%, transparent 100%)",
        }} />
        {/* bottom fade into page */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:160, zIndex:3, background:"linear-gradient(to top, rgba(248,253,248,0.3), transparent)" }} />

        {/* ── Content ── */}
        <div style={{ position:"relative", zIndex:4, height:"100%", maxWidth:1200, margin:"0 auto", padding:"0 52px", display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:68 }}>

          {/* left copy */}
          <div style={{ maxWidth:560 }}>
            {/* live badge */}
            <div className="glass" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"7px 18px", borderRadius:50, marginBottom:26 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#4caf50", display:"block", animation:"pulseDot 1.4s ease-in-out infinite" }} />
              <span className="jk" style={{ fontSize:12, color:"rgba(255,255,255,.9)", fontWeight:600, letterSpacing:".06em" }}>
                {ldSlides ? "Loading…" : slides[slideIdx]?.caption}
              </span>
            </div>

            <h1 className="fr" style={{ fontSize:"clamp(42px,6vw,78px)", lineHeight:1.05, fontWeight:900, color:"#fff" }}>
              Cultivating<br />
              <span style={{ color:"#81c784", fontStyle:"italic" }}>Tomorrow's Agriculture</span><br />
              Today
            </h1>

            <p className="jk" style={{ marginTop:20, fontSize:16, lineHeight:1.8, color:"rgba(255,255,255,.78)", maxWidth:460, fontWeight:300 }}>
              {ldSlides ? "Join a thriving community…" : slides[slideIdx]?.sub}
            </p>

            <div style={{ display:"flex", gap:14, marginTop:36 }}>
              <a href="#" className="btn-solid">Explore Stories ›</a>
              <a href="#" className="btn-outline" style={{ color:"#fff", borderColor:"rgba(255,255,255,.5)", background:"rgba(255,255,255,.12)" }}>◎ Share Stories</a>
            </div>
          </div>

          {/* right — redesigned stat cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {ldStats ? (
              [1,2,3].map(i => (
                <div key={i} style={{ width:200, height:80, borderRadius:20, background:"rgba(255,255,255,.15)", animation:"shimmer 1.4s infinite" }} />
              ))
            ) : [
              { icon:"👥", n:stats.students,  suffix:"+", l:"Active Students",  top:"#d4f5d4", bot:"#a8e6a8" },
              { icon:"📚", n:stats.stories,   suffix:"+", l:"Shared Stories",   top:"#c8f0d0", bot:"#90dba8" },
              { icon:"🌍", n:stats.countries, suffix:"+", l:"Countries",        top:"#b8ead8", bot:"#70cba0" },
            ].map((s,i) => (
              <div key={s.l} style={{
                minWidth:210, borderRadius:20, overflow:"hidden",
                background:"rgba(255,255,255,0.14)",
                backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                border:"1px solid rgba(255,255,255,0.32)",
                boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
                display:"flex", alignItems:"stretch",
                animation:`statSlide .6s ease ${i*0.12}s both`,
              }}>
                {/* left colour accent bar */}
                <div style={{
                  width:6, flexShrink:0,
                  background:`linear-gradient(180deg,${s.top},${s.bot})`,
                }} />
                <div style={{ padding:"16px 20px", flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:22, filter:"drop-shadow(0 2px 6px rgba(0,0,0,.25))" }}>{s.icon}</span>
                    <div className="fr" style={{ fontSize:28, fontWeight:900, color:"#fff", lineHeight:1, textShadow:"0 2px 12px rgba(0,0,0,.3)" }}>
                      <Counter target={s.n} suffix={s.suffix} />
                    </div>
                  </div>
                  <div className="jk" style={{ fontSize:12, color:"rgba(255,255,255,.78)", fontWeight:500, letterSpacing:".04em" }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* slide dots */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", zIndex:4, display:"flex", gap:8, alignItems:"center" }}>
          {slides.map((_, i) => (
            <button key={i} className={`slide-dot ${i === slideIdx ? "on" : ""}`}
              onClick={() => { clearInterval(timerRef.current); goSlide(i); }}
            />
          ))}
        </div>

        {/* scroll hint */}
        <div style={{ position:"absolute", bottom:28, right:52, zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ width:22, height:36, borderRadius:12, border:"2px solid rgba(255,255,255,.45)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:4 }}>
            <div style={{ width:4, height:8, borderRadius:2, background:"rgba(255,255,255,.65)", animation:"scrollDot 1.6s ease infinite" }} />
          </div>
          <span className="jk" style={{ fontSize:10, color:"rgba(255,255,255,.55)", letterSpacing:".1em" }}>Scroll to explore</span>
        </div>

        {/* prev / next arrows */}
        {slides.length > 1 && !ldSlides && (
          <>
            <button onClick={() => { clearInterval(timerRef.current); goSlide((slideIdx - 1 + slides.length) % slides.length); }}
              style={{ position:"absolute", left:20, top:"50%", transform:"translateY(-50%)", zIndex:4, width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.35)", color:"#fff", fontSize:18, cursor:"pointer", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .25s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.32)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.18)"}
            >‹</button>
            <button onClick={() => { clearInterval(timerRef.current); goSlide((slideIdx + 1) % slides.length); }}
              style={{ position:"absolute", right:20, top:"50%", transform:"translateY(-50%)", zIndex:4, width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.35)", color:"#fff", fontSize:18, cursor:"pointer", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .25s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.32)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.18)"}
            >›</button>
          </>
        )}
      </section>

      {/* ════════════════════════════════════
          FEATURED STORIES  (load more)
      ════════════════════════════════════ */}
      <section style={{ padding:"100px 52px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          {/* header */}
          <div id="stories-hdr" ref={setRef("stories-hdr")}
            style={{ textAlign:"center", marginBottom:56 }}
            className={`reveal ${visible["stories-hdr"] ? "on" : ""}`}>
            <span className="chip">Real Experiences</span>
            <h2 className="fr" style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:700, color:"#1a3a1a", lineHeight:1.1 }}>
              Featured Stories
            </h2>
            <p className="jk" style={{ marginTop:12, fontSize:16, color:"#6a8a6a", fontWeight:300 }}>
              Learn from students making a difference in agriculture worldwide
            </p>
          </div>

          {/* story grid */}
          <div id="stories-grid" ref={setRef("stories-grid")}
            style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:26 }}>

            {ldStories ? (
              [1,2,3].map(i => (
                <div key={i} className="story-card">
                  <Skel h={210} r={0} />
                  <div style={{ padding:"22px 22px 26px" }}>
                    <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                      <Skel w={38} h={38} r={50} />
                      <div style={{ flex:1 }}>
                        <Skel w="60%" h={14} r={4} mb={6} />
                        <Skel w="40%" h={11} r={4} />
                      </div>
                    </div>
                    <Skel w="90%" h={18} r={5} mb={8} />
                    <Skel w="75%" h={18} r={5} mb={14} />
                    <Skel h={13} r={4} mb={6} />
                    <Skel w="80%" h={13} r={4} mb={6} />
                    <Skel w="60%" h={13} r={4} />
                  </div>
                </div>
              ))
            ) : stories.map((s, i) => (
              <div key={s.id}
                className={`story-card reveal d${(i%3)+1} ${visible["stories-grid"] ? "on" : ""}`}
                onMouseEnter={() => setHoveredStory(s.id)}
                onMouseLeave={() => setHoveredStory(null)}>
                {/* image */}
                <div style={{ height:210, overflow:"hidden", position:"relative" }}>
                  <img src={s.img} alt={s.title}
                    style={{ width:"100%", height:"100%", objectFit:"cover", transform: hoveredStory===s.id ? "scale(1.07)" : "scale(1)", transition:"transform .5s ease" }} />
                  <div style={{ position:"absolute", top:14, left:14 }}>
                    <span className="tag">{s.tag}</span>
                  </div>
                </div>
                {/* body */}
                <div style={{ padding:"20px 22px 24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13 }}>
                    <div className="avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{s.initials}</div>
                    <div>
                      <div className="jk" style={{ fontSize:13, fontWeight:600, color:"#1a3a1a" }}>{s.author}</div>
                      <div className="jk" style={{ fontSize:11, color:"#9aba9a", marginTop:1 }}>{s.ago}</div>
                    </div>
                  </div>
                  <h3 className="fr" style={{ fontSize:19, fontWeight:700, color:"#1a3a1a", lineHeight:1.32, marginBottom:9 }}>{s.title}</h3>
                  <p className="jk"  style={{ fontSize:13, color:"#6a8a6a", lineHeight:1.75, fontWeight:300 }}>{s.desc}</p>
                  <a href="#" className="jk" style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, color:"#43a047", fontSize:13, fontWeight:600, textDecoration:"none", transition:"gap .2s" }}
                    onMouseEnter={e => e.currentTarget.style.gap="10px"}
                    onMouseLeave={e => e.currentTarget.style.gap="5px"}
                  >Read More →</a>
                </div>
              </div>
            ))}

            {/* skeleton rows when loading more */}
            {ldMore && [1,2,3].map(i => (
              <div key={`more-${i}`} className="story-card">
                <Skel h={210} r={0} />
                <div style={{ padding:"22px 22px 26px" }}>
                  <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                    <Skel w={38} h={38} r={50} />
                    <div style={{ flex:1 }}><Skel w="60%" h={14} r={4} mb={6} /><Skel w="40%" h={11} r={4} /></div>
                  </div>
                  <Skel w="90%" h={18} r={5} mb={8} />
                  <Skel h={13} r={4} mb={6} />
                  <Skel w="80%" h={13} r={4} />
                </div>
              </div>
            ))}
          </div>

          {/* load more / view all */}
          <div style={{ textAlign:"center", marginTop:48, display:"flex", justifyContent:"center", gap:14 }}>
            {!ldStories && !allLoaded && (
              <button className="btn-outline" onClick={loadMore} disabled={ldMore}
                style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
                {ldMore ? <><div className="spinner" /> Loading…</> : "Load More Stories"}
              </button>
            )}
            {!ldStories && (
              <a href="#" className="btn-solid">View All Stories</a>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          EXPLORE TOPICS  (from backend)
      ════════════════════════════════════ */}
      <section style={{ padding:"60px 52px 100px", background:"linear-gradient(180deg,rgba(232,245,232,.5) 0%,rgba(248,253,248,0) 100%)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          <div id="topics-hdr" ref={setRef("topics-hdr")}
            style={{ textAlign:"center", marginBottom:52 }}
            className={`reveal ${visible["topics-hdr"] ? "on" : ""}`}>
            <span className="chip">Knowledge Hub</span>
            <h2 className="fr" style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:700, color:"#1a3a1a", lineHeight:1.1 }}>
              Explore Topics
            </h2>
            <p className="jk" style={{ marginTop:12, fontSize:16, color:"#6a8a6a", fontWeight:300 }}>
              Dive deep into specialised agricultural disciplines
            </p>
          </div>

          <div id="topics-grid" ref={setRef("topics-grid")}
            style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>

            {ldTopics ? (
              [1,2,3,4,5,6].map(i => (
                <div key={i} className="topic-card">
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
                    <Skel w={52} h={52} r={14} />
                    <Skel w={60} h={14} r={4} />
                  </div>
                  <Skel w="70%" h={20} r={5} mb={10} />
                  <Skel h={13} r={4} mb={6} />
                  <Skel w="80%" h={13} r={4} mb={20} />
                  <Skel w={32} h={32} r={50} />
                </div>
              ))
            ) : topics.map((t, i) => (
              <div key={t.id}
                className={`topic-card reveal d${i+1} ${visible["topics-grid"] ? "on" : ""}`}
                onMouseEnter={() => setHoveredTopic(i)}
                onMouseLeave={() => setHoveredTopic(null)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                  <div style={{ width:52, height:52, borderRadius:14, background: hoveredTopic===i ? "rgba(76,175,80,.18)" : "rgba(76,175,80,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, transition:"background .3s" }}>{t.icon}</div>
                  <span className="jk" style={{ fontSize:12, color:"#9aba9a", fontWeight:500 }}>{t.posts.toLocaleString()} posts</span>
                </div>
                <h3 className="fr"  style={{ fontSize:20, fontWeight:700, color:"#1a3a1a", marginBottom:8, lineHeight:1.25 }}>{t.label}</h3>
                <p className="jk"   style={{ fontSize:13, color:"#6a8a6a", lineHeight:1.7, fontWeight:300, marginBottom:22 }}>{t.desc}</p>
                <a href="#" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:32, height:32, borderRadius:"50%", background: hoveredTopic===i ? "#4caf50" : "rgba(76,175,80,.12)", color: hoveredTopic===i ? "#fff" : "#4caf50", textDecoration:"none", fontSize:16, fontWeight:700, transition:"all .3s" }}>→</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS BANNER — animated counters
      ════════════════════════════════════ */}
      <section style={{ padding:"0 52px 100px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div id="stats-banner" ref={setRef("stats-banner")}
            className={`reveal ${visible["stats-banner"] ? "on" : ""}`}
            style={{ background:"linear-gradient(135deg,rgba(210,245,210,.78),rgba(190,235,200,.68))", backdropFilter:"blur(30px)", WebkitBackdropFilter:"blur(30px)", border:"1px solid rgba(255,255,255,.92)", boxShadow:"0 16px 56px rgba(60,140,60,.13)", borderRadius:28, padding:"56px 60px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, position:"relative", overflow:"hidden" }}>
            <span style={{ position:"absolute", top:-30, right:-20, fontSize:160, opacity:.06, pointerEvents:"none" }}>🌾</span>

            {ldStats ? (
              [1,2,3,4].map((i,idx) => (
                <div key={i} style={{ textAlign:"center", padding:"16px 20px", borderRight:idx<3?"1px solid rgba(76,175,80,.15)":"none" }}>
                  <Skel w={48} h={48} r={50} style={{ margin:"0 auto 14px" }} />
                  <Skel w={100} h={38} r={8} style={{ margin:"0 auto 10px" }} />
                  <Skel w={80}  h={14} r={4} style={{ margin:"0 auto" }} />
                </div>
              ))
            ) : [
              { n:stats.species,  s:"+", l:"Plant Species",    icon:"🌿", c:"#2e7d32" },
              { n:stats.students, s:"+", l:"Active Students",  icon:"👨‍🌾", c:"#388e3c" },
              { n:stats.stories,  s:"+", l:"Shared Stories",   icon:"🎓", c:"#43a047" },
              { n:98,             s:"%", l:"Satisfaction Rate",icon:"⭐", c:"#1b5e20" },
            ].map((s,i) => (
              <div key={s.l} style={{ textAlign:"center", padding:"16px 20px", borderRight:i<3?"1px solid rgba(76,175,80,.15)":"none" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{s.icon}</div>
                <div className="fr" style={{ fontSize:40, fontWeight:700, color:s.c, lineHeight:1 }}>
                  <Counter target={s.n} suffix={s.s} />
                </div>
                <div className="jk" style={{ fontSize:13, color:"#5a7a5a", marginTop:8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          NEWSLETTER CTA
      ════════════════════════════════════ */}
      <section style={{ padding:"0 52px 100px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", borderRadius:28, overflow:"hidden", background:"linear-gradient(135deg,rgba(210,245,210,.80),rgba(190,235,200,.70))", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)", border:"1px solid rgba(255,255,255,.92)", boxShadow:"0 16px 56px rgba(60,140,60,.12)", padding:"72px 80px", textAlign:"center", position:"relative" }}>
          <span style={{ position:"absolute", top:-24, left:-16, fontSize:170, opacity:.06, transform:"rotate(-12deg)", pointerEvents:"none" }}>🌿</span>
          <span style={{ position:"absolute", bottom:-24, right:-16, fontSize:150, opacity:.06, transform:"rotate(16deg)", pointerEvents:"none" }}>🍃</span>
          <div style={{ position:"relative", zIndex:1 }}>
            <span className="chip">Join Us Today</span>
            <h2 className="fr" style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:700, color:"#1a3a1a", lineHeight:1.1, marginBottom:16 }}>
              Start Your Green<br />
              <span style={{ color:"#43a047", fontStyle:"italic" }}>Journey Today</span>
            </h2>
            <p className="jk" style={{ fontSize:15, color:"#4a6a4a", maxWidth:420, margin:"0 auto 36px", fontWeight:300, lineHeight:1.8 }}>
              Get weekly plant care reminders, personalised tips, and connect with{" "}
              {!ldStats && <strong>{stats.students.toLocaleString()}+</strong>} gardeners worldwide.
            </p>
            <div style={{ display:"flex", maxWidth:460, margin:"0 auto", borderRadius:50, overflow:"hidden", boxShadow:"0 6px 28px rgba(76,175,80,.2)" }}>
              <input className="nl-input" placeholder="Enter your email address…" />
              <button className="btn-solid" style={{ borderRadius:"0 50px 50px 0", padding:"14px 28px", fontSize:13 }}>Subscribe 🌱</button>
            </div>
            <p className="jk" style={{ fontSize:11, color:"#8ab88a", marginTop:14, fontWeight:300 }}>No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer style={{ background:"rgba(255,255,255,.80)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderTop:"1px solid rgba(76,175,80,.12)", padding:"56px 52px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2.2fr 1fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
            {/* brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#66bb6a,#1b5e20)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌿</div>
                <span className="fr" style={{ fontSize:20, fontWeight:700, color:"#1a3a1a" }}>Horti<span style={{ color:"#43a047" }}>Verse</span></span>
              </div>
              <p className="jk" style={{ fontSize:13, color:"#7a9a7a", lineHeight:1.85, maxWidth:240, fontWeight:300 }}>
                A thriving community of horticulture students sharing knowledge and sustainable farming practices worldwide.
              </p>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {["🐦","💼","📷","▶️"].map(ic => (
                  <a key={ic} href="#" style={{ width:34, height:34, borderRadius:"50%", background:"rgba(76,175,80,.1)", border:"1px solid rgba(76,175,80,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, textDecoration:"none", transition:"background .2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(76,175,80,.25)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(76,175,80,.1)"}
                  >{ic}</a>
                ))}
              </div>
            </div>

            {[
              { title:"Explore",  links:["Stories","Topics","Community","Resources"] },
              { title:"Topics",   links:["Sustainable Farming","AgriTech","Livestock","Crop Science"] },
              { title:"Company",  links:["About Us","Blog","Careers","Press"] },
              { title:"Support",  links:["Help Center","Contact Us","Privacy Policy","Terms"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="jk" style={{ fontSize:11, letterSpacing:".16em", color:"#43a047", marginBottom:18, textTransform:"uppercase", fontWeight:700 }}>{col.title}</h4>
                {col.links.map(lk => (
                  <a key={lk} href="#" className="jk" style={{ display:"block", color:"#8aaa8a", textDecoration:"none", fontSize:13, marginBottom:11, fontWeight:400, transition:"color .2s" }}
                    onMouseEnter={e => e.target.style.color="#2e7d32"}
                    onMouseLeave={e => e.target.style.color="#8aaa8a"}
                  >{lk}</a>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop:"1px solid rgba(76,175,80,.1)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <p className="jk" style={{ fontSize:12, color:"#aacaaa", fontWeight:300 }}>© 2026 HortiVerse. All rights reserved.</p>
            <p className="jk" style={{ fontSize:12, color:"#aacaaa", fontWeight:300 }}>Made with 🌿 for horticulture students everywhere</p>
          </div>
        </div>
      </footer>

    </div>
  );
}