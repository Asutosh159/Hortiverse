import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect, useRef } from "react";
import Footer from '../components/Footer'; 

// 🟢 URL Formatter Helper Function
const getDirectImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c4f?auto=format&fit=crop&w=800&q=80"; 

  if (url.includes("drive.google.com")) {
    let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/); 
    if (!match) match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/); 
    
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
  }
  return url;
};

const avatarColors = ["#059669","#047857","#10b981","#34d399","#065f46","#064e3b"];

/* ─── UPLOAD MODAL ──────────────────────────────────────── */
function UploadStoryModal({ onClose, onSuccess, user }) {
  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [tag,     setTag]     = useState("Agriculture");
  const [imgUrl,  setImgUrl]  = useState("");
  const [author,  setAuthor]  = useState(user ? user.full_name : "");
  
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("File is too large! Please select an image under 4MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData, 
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setImgUrl(data.imageUrl);
      } else {
        throw new Error(data.error || data.details || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert(`Upload Error: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (event.target) event.target.value = null; 
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() ) {
      setError("Please fill out the title and full story content.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    const payload = {
      title: title.trim(),
      author: author.trim() || "Community Member",
      content: content.trim(), 
      tag: tag,
      image_url: imgUrl.trim() || "https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c4f?auto=format&fit=crop&w=800&q=80",
      read_time: Math.max(1, Math.ceil(content.split(" ").length / 200)) + " min read"
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setLoading(false);
        setSuccess(true);
        onSuccess({ id: Date.now(), ...payload, likes: 0, comments: 0, has_liked: 0 });
        setTimeout(onClose, 1800);
      } else {
        throw new Error(data.error || "Failed to upload story");
      }
    } catch (err) {
      setError("Failed to upload story. Please try again.");
      setLoading(false);
    }
  };

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleOverlay} className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-10 animate-[fadeIn_0.3s_ease-out]">
      <div className="modal-box relative w-full max-w-[640px] max-h-[90vh] md:max-h-[85vh] bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <button className="modal-close-btn-upload absolute top-4 right-4 md:top-5 md:right-5 z-[100] w-10 h-10 md:w-11 md:h-11 bg-white/50 hover:bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110 cursor-pointer" onClick={onClose}>✕</button>

        <div className="overflow-y-auto overflow-x-hidden flex-1 w-full break-words modal-scrollbar p-6 md:p-12">
          {success ? (
            <div className="text-center py-10 animate-[popIn_0.35s_ease]">
              <div className="text-[64px] mb-5">📖</div>
              <h3 className="font-['Lora',serif] text-[32px] text-slate-900 mb-3 font-extrabold">Story Published!</h3>
              <p className="font-['Manrope',sans-serif] text-base text-slate-500 leading-[1.7] font-medium">Your story is now live. Thank you for inspiring the community!</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-block bg-emerald-600/10 text-emerald-600 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">Community Story</span>
                <h2 className="font-['Lora',serif] text-[clamp(28px,4vw,36px)] font-black text-slate-900 leading-[1.1] mb-2">
                  Share your <span className="text-emerald-600">Experience</span>
                </h2>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex gap-2 items-center font-['Plus_Jakarta_Sans',sans-serif] font-semibold">
                  <span>⚠</span> {error}
                </div>
              )}

              <div className="flex gap-5 mb-5 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Title <span className="text-red-500">*</span></label>
                  <input className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" placeholder="Give your story a catchy title…" value={title} onChange={e=>{setTitle(e.target.value);setError("");}} />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Topic Tag</label>
                  <select className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 appearance-none" value={tag} onChange={e=>setTag(e.target.value)}>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Technology">Technology</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Research">Research</option>
                    <option value="Livestock">Livestock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-5 mb-5 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Author Name</label>
                  <input className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" placeholder="Your name…" value={author} onChange={e=>setAuthor(e.target.value)} />
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">
                    Cover Image <span className="text-slate-400 font-medium normal-case tracking-normal">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()} 
                      disabled={isUploading}
                      className="flex-1 px-5 py-[13px] bg-slate-50 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 font-bold rounded-xl transition-colors border border-slate-200 disabled:opacity-50 flex items-center justify-center gap-2 text-[14px]"
                    >
                      {isUploading ? '⏳ Uploading...' : '📷 Select Photo'}
                    </button>

                    {imgUrl && (
                      <div className="h-[46px] w-[60px] rounded-lg border border-slate-200 overflow-hidden shadow-sm relative group shrink-0">
                        <img src={imgUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setImgUrl("")}
                          className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 flex justify-center items-center rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Full Story Content <span className="text-red-500">*</span></label>
                <textarea className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 resize-y leading-[1.6] min-h-[200px]" placeholder="Write your full story here. You can use double asterisks like **this** to make text bold." value={content} onChange={e=>setContent(e.target.value)} />
              </div>

              <button onClick={handleSubmit} disabled={loading || isUploading} className="w-full justify-center bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base px-7 py-4 transition-all duration-200 inline-flex items-center gap-1.5 hover:bg-emerald-700 hover:-translate-y-[1px] hover:shadow-[0_8px_16px_rgba(5,150,105,0.25)] disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Publishing..." : "✍️ Publish Story"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [showUpload,    setShowUpload]    = useState(false); 

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");

  const visitorId = localStorage.getItem("hv_visitor_id") || "guest_fallback";
  const loggedInUser = JSON.parse(localStorage.getItem("hv_user"));

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stories?visitorId=${visitorId}`);
        const dbStories = await res.json();
        
       const formattedStories = dbStories.map(s => {
          const initials = s.author ? s.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "HV";
          return {
            id: s.id,
            author: s.author || "Community Member",
            initials: initials,
            ago: "Recently", 
            title: s.title,
            tag: s.tag,
            readTime: s.read_time || "5 min read",
            likes: s.likes,
            comments: s.comments, 
            img: getDirectImageUrl(s.image_url),
            excerpt: s.content ? s.content.substring(0, 120) + "..." : "", 
            content: s.content,
            hasLiked: s.has_liked === 1 
          };
        });
        setStories(formattedStories);
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStories();
  }, [visitorId]);

  useEffect(() => {
    document.body.style.overflow = (selectedStory || showUpload) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedStory, showUpload]);

  const filtered = stories.filter((s) => {
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.tag.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleLike = async (id, e) => {
    e.stopPropagation();
    
    setStories(prevStories => prevStories.map(story => {
      if (story.id === id) {
        const isCurrentlyLiked = story.hasLiked;
        return { ...story, hasLiked: !isCurrentlyLiked, likes: isCurrentlyLiked ? story.likes - 1 : story.likes + 1 };
      }
      return story;
    }));

    if (selectedStory && selectedStory.id === id) {
      setSelectedStory(prev => {
        const isCurrentlyLiked = prev.hasLiked;
        return { ...prev, hasLiked: !isCurrentlyLiked, likes: isCurrentlyLiked ? prev.likes - 1 : prev.likes + 1 };
      });
    }

    try {
      await fetch(`${API_BASE_URL}/api/stories/${id}/like`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId })
      });
    } catch (err) { console.error("Failed to save like:", err); }
  };

  const loadComments = async (storyId) => {
    if (!showComments) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stories/${storyId}/comments`);
        const data = await res.json();
        setComments(data);
      } catch(err) { console.error("Failed to load comments:", err); }
    }
    setShowComments(!showComments);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    const payload = {
      text: newComment,
      userId: loggedInUser ? loggedInUser.id : null,
      guestName: loggedInUser ? loggedInUser.full_name : guestName
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/stories/${selectedStory.id}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const freshRes = await fetch(`${API_BASE_URL}/api/stories/${selectedStory.id}/comments`);
        const freshData = await freshRes.json();
        setComments(freshData);
        setNewComment(""); 
        
        setStories(prev => prev.map(s => s.id === selectedStory.id ? {...s, comments: s.comments + 1} : s));
        setSelectedStory(prev => ({...prev, comments: prev.comments + 1}));
      }
    } catch(err) { console.error("Failed to post comment:", err); }
  };

  const handleNewStory = (newStory) => {
    const initials = newStory.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const formattedNewStory = {
      ...newStory,
      img: getDirectImageUrl(newStory.image_url),    
      readTime: newStory.read_time,
      initials: initials,
      ago: "Just now",
      hasLiked: false
    };
    setStories(prev => [formattedNewStory, ...prev]);
  };

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden font-serif">

      {/* 🟢 FIXED: Exact same background effect as Topics/Resources */}
      <div className="stories-bg" style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)",
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        
        /* 🟢 HIGH-PERFORMANCE SCROLLBAR */
        .modal-scrollbar {
          -webkit-overflow-scrolling: touch; 
          transform: translateZ(0); 
        }
        .modal-scrollbar::-webkit-scrollbar { width: 6px; }
        .modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .modal-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }

        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        /* ══════════════════════════════════════════════════
           🌙 DARK MODE OVERRIDES FOR STORIES PAGE
        ══════════════════════════════════════════════════ */
        body.dark-mode .stories-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%) !important; }
        body.dark-mode .text-\\[\\#112a0f\\] { color: #f8faf9 !important; }
        
        body.dark-mode .bg-white\\/90 { background-color: rgba(30, 41, 59, 0.9) !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white\\/85 { background-color: rgba(30, 41, 59, 0.85) !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white\\/85:hover { background-color: rgba(30, 41, 59, 0.95) !important; box-shadow: 0 25px 50px -12px rgba(16,185,129,0.15), 0 0 0 2px rgba(16,185,129,0.2) !important; }
        body.dark-mode .bg-white\\/60 { background-color: rgba(30, 41, 59, 0.6) !important; color: #cbd5e1 !important; }
        body.dark-mode .bg-slate-50 { background-color: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white { background-color: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; }
        
        body.dark-mode .text-slate-900 { color: #f8faf9 !important; }
        body.dark-mode .text-slate-600, body.dark-mode .text-slate-500, body.dark-mode .text-slate-400 { color: #94a3b8 !important; }
        body.dark-mode .border-slate-200, body.dark-mode .border-black\\/5 { border-color: rgba(255,255,255,0.1) !important; }
        
        body.dark-mode input, body.dark-mode textarea, body.dark-mode select { background-color: #0f172a !important; color: #f8faf9 !important; border-color: rgba(255,255,255,0.2) !important; }
        body.dark-mode .bg-white\\/50 { background-color: rgba(15,23,42,0.5) !important; color: #f8faf9 !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white\\/50:hover { background-color: rgba(15,23,42,0.8) !important; }
        
        /* Story Card specific tweaks */
        body.dark-mode .story-card .tag { background: rgba(30, 41, 59, 0.9) !important; color: #34d399 !important; }
      `}</style>

      {/* ══ PAGE HEADER ══ */}
      <div className="pt-[120px] bg-transparent relative z-10">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="font-['Lora',serif] text-[clamp(35px,5vw,60px)] font-black text-[#112a0f] leading-[1.1] tracking-tight">
            Explore ideas, research, and <br/> <span className="text-emerald-600">agricultural stories.</span>
          </h1>
          <p className="font-['Manrope',sans-serif] mt-5 text-base text-slate-600 font-medium leading-[1.6] max-w-[800px] mx-auto">
            Stay updated with the latest developments in agriculture and horticulture, including sustainable farming innovations and newly released crop varieties from leading institutes worldwide.
          </p>

          {loggedInUser && (
            <div className="mt-6 animate-[fadeIn_0.5s_ease]">
              <button 
                onClick={() => setShowUpload(true)} 
                className="bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base px-8 py-3.5 transition-all duration-200 inline-flex items-center gap-1.5 hover:bg-emerald-700 hover:-translate-y-[1px] shadow-[0_8px_20px_rgba(5,150,105,0.3)]"
              >
                <span className="text-[20px]">✍️</span> Share Your Story
              </button>
            </div>
          )}

          <div className={`relative max-w-[680px] mx-auto translate-y-1/2 z-10 px-4 md:px-0 ${loggedInUser ? 'mt-[30px]' : 'mt-0'}`}>
            <span className="absolute left-11 md:left-7 top-1/2 -translate-y-1/2 text-[22px] text-emerald-500 pointer-events-none">🔍</span>
            <input 
              className="w-full bg-white/90 backdrop-blur-xl border border-white rounded-full py-[22px] pr-8 pl-[60px] md:pl-16 font-['Plus_Jakarta_Sans',sans-serif] text-[17px] font-medium text-slate-900 outline-none transition-all duration-300 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08),0_0_0_1px_rgba(16,185,129,0.05)] placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)]" 
              placeholder="Search by title, author, or topic..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* ══ STORIES GRID ══ */}
      <main className="max-w-[1200px] mx-auto pt-[100px] pb-[100px] px-6 md:px-12 relative z-0">
        
        {loading ? (
           <div className="text-center py-10 text-slate-500 font-['Manrope',sans-serif]">Loading stories from database...</div>
        ) : (
          <>
            {searchQuery && (
              <p className="font-['Manrope',sans-serif] text-base text-slate-600 mb-8 font-semibold bg-white/60 px-4 py-2 rounded-xl inline-block">
                Found <strong className="text-slate-900">{filtered.length}</strong> results for "{searchQuery}"
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
              {filtered.map((s, i) => {
                const shortTitle = s.title.length > 60 ? s.title.substring(0, 65).trim() + "..." : s.title;

                return (
                  <article key={s.id} className="group bg-white/85 backdrop-blur-md border border-white rounded-[20px] cursor-pointer relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25),0_0_0_2px_rgba(16,185,129,0.1)] hover:bg-white/95" onClick={() => { 
                    setSelectedStory(s); 
                    setShowComments(false);
                    setComments([]); 
                  }}>
                    <div className="h-[220px] overflow-hidden relative shrink-0">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-4 left-4 bg-emerald-600/90 text-white backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full">{s.tag}</span>
                      <span className="absolute bottom-4 right-4 font-['Manrope',sans-serif] text-xs text-white font-bold bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                        {s.readTime}
                      </span>
                    </div>

                    <div className="p-7 flex flex-col grow">
                      <h2 className="font-['Lora',serif] text-[24px] font-extrabold text-slate-900 leading-[1.3] mb-3 group-hover:text-emerald-700 transition-colors">
                        {shortTitle}
                      </h2>
                      <p className="font-['Manrope',sans-serif] text-[15px] text-slate-600 leading-[1.6] font-medium mb-6 line-clamp-3 text-justify">
                        {s.excerpt}
                      </p>

                      <div className="flex justify-between items-center pt-5 border-t border-black/5 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white shadow-sm" style={{ background: avatarColors[i % avatarColors.length] }}>{s.initials}</div>
                          <div>
                            <div className="font-['Manrope',sans-serif] text-[14px] font-extrabold text-slate-900 leading-tight">{s.author}</div>
                            <div className="font-['Manrope',sans-serif] text-[12px] text-slate-500 mt-0.5 font-medium">{s.ago}</div>
                          </div>
                        </div>
                        
                        <button className={`font-['Manrope',sans-serif] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-sm font-bold border ${s.hasLiked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:bg-red-50 group-hover:border-red-200 group-hover:text-red-500'}`} onClick={(e) => toggleLike(s.id, e)}>
                          {s.hasLiked ? "❤️" : "🤍"} {s.likes}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="text-[64px] mb-5">🌿</div>
                <h3 className="font-['Lora',serif] text-[28px] text-slate-900 font-extrabold">No stories found</h3>
                <p className="font-['Manrope',sans-serif] text-slate-500 mt-2.5 text-base">We couldn't find any articles matching your search.</p>
                <button className="mt-6 bg-white/80 text-slate-700 border border-black/5 rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm px-7 py-3 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm" onClick={() => setSearchQuery("")}>Clear Search</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ════ UPLOAD MODAL ════ */}
      {showUpload && (
        <UploadStoryModal onClose={() => setShowUpload(false)} onSuccess={handleNewStory} user={loggedInUser} />
      )}

      {/* ════ STORY READER MODAL ════ */}
      {selectedStory && !showUpload && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-16 animate-[fadeIn_.3s_ease-out]" onClick={() => setSelectedStory(null)}>
          <div className="relative w-full max-w-[860px] max-h-[90vh] md:max-h-[85vh] bg-white rounded-[20px] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_.4s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 md:top-5 md:right-5 z-[100] w-10 h-10 md:w-11 md:h-11 bg-white/20 hover:bg-white border border-white/40 text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-110 cursor-pointer" onClick={() => setSelectedStory(null)}>✕</button>

            <div className="overflow-y-auto overflow-x-hidden flex-1 w-full relative modal-scrollbar">
              <div className="h-[200px] md:h-[320px] w-full shrink-0 relative">
                <img src={selectedStory.img} alt={selectedStory.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-12 md:right-12">
                  <span className="inline-block bg-white/90 text-emerald-700 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 md:mb-4 shadow-sm">{selectedStory.tag}</span>
                  <h1 className="font-['Lora',serif] text-[clamp(28px,5vw,42px)] font-black text-white leading-[1.15] drop-shadow-md break-words text-shadow-sm">
                    {selectedStory.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 md:p-10 md:px-12 md:pb-[60px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 md:mb-10 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-white shadow-sm" style={{ background: avatarColors[selectedStory.id % avatarColors.length] }}>{selectedStory.initials}</div>
                    <div>
                      <div className="font-['Manrope',sans-serif] text-[16px] font-extrabold text-slate-900">{selectedStory.author}</div>
                      <div className="font-['Manrope',sans-serif] text-[14px] text-slate-500 mt-0.5 font-medium">{selectedStory.ago} · {selectedStory.readTime}</div>
                    </div>
                  </div>

                  <div className="flex flex-row w-full md:w-auto gap-2 md:gap-3">
                    <button 
                      className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-2 rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] md:text-[14px] transition-all duration-200 whitespace-nowrap ${selectedStory.hasLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-600 text-white border border-transparent shadow-[0_4px_12px_rgba(5,150,105,0.3)] hover:bg-emerald-700 hover:-translate-y-[1px]'}`}
                      onClick={(e) => toggleLike(selectedStory.id, e)}
                    >
                      {selectedStory.hasLiked ? "❤️ Loved it" : "🤍 Applaud"} · {selectedStory.likes}
                    </button>
                    <button className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-700 rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[13px] md:text-[14px] px-4 py-2.5 md:py-2 transition-all hover:bg-slate-50 hover:shadow-sm whitespace-nowrap" onClick={() => loadComments(selectedStory.id)}>
                      💬 Discussion ({selectedStory.comments})
                    </button>
                  </div>
                </div>

                <div className="font-['Plus_Jakarta_Sans',sans-serif]">
                  {(selectedStory.content || selectedStory.desc || "No full content available.").split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} className="text-[15px] md:text-[17px] text-slate-700 leading-[1.8] font-medium text-justify mb-6 break-words" />
                  ))}
                </div>

                {/* DISCUSSION PANEL */}
                {showComments && (
                  <div className="mt-10 pt-10 border-t-2 border-dashed border-slate-200 animate-[fadeIn_0.4s]">
                    <h3 className="font-['Lora',serif] text-[24px] font-extrabold text-slate-900 mb-6">Join the Conversation</h3>
                    
                    <div className="bg-slate-50 p-6 rounded-[16px] mb-8 border border-slate-200">
                      {!loggedInUser && (
                        <input 
                          className="w-full px-[18px] py-[14px] bg-white border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 mb-3" 
                          placeholder="Your Name (Optional)" 
                          value={guestName} 
                          onChange={e => setGuestName(e.target.value)} 
                        />
                      )}
                      <textarea 
                        className="w-full px-[18px] py-[14px] bg-white border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-y min-h-[100px] mb-4" 
                        placeholder="What are your thoughts on this?" 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                      />
                      <div className="flex justify-end">
                        <button className="bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm px-6 py-3 transition-all duration-200 inline-flex items-center justify-center hover:bg-emerald-700 hover:shadow-md" onClick={submitComment}>Post Comment</button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {comments.length === 0 ? (
                        <div className="font-['Manrope',sans-serif] text-center text-slate-400 py-10 font-medium">Be the first to share your thoughts!</div>
                      ) : (
                        comments.map(c => (
                          <div key={c.id} className="bg-white border border-slate-200 p-6 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                            <div className="flex justify-between mb-3 items-center">
                              <strong className="font-['Manrope',sans-serif] text-slate-900 text-[15px] font-bold">
                                {c.full_name || c.guest_name || "Guest Farmer"}
                              </strong>
                              <span className="font-['Manrope',sans-serif] text-slate-400 text-[12px] font-semibold">
                                {new Date(c.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="font-['Manrope',sans-serif] text-slate-600 text-[15px] leading-[1.6] font-medium">{c.comment_text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div> 
  );
}