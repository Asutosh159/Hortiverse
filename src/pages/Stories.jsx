import { useState, useEffect } from "react";
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

const avatarColors = ["#059669","#047857","#10b981","#34d399","#065f46","#064e3b"];

/* ─── UPLOAD MODAL ──────────────────────────────────────── */
function UploadStoryModal({ onClose, onSuccess, user }) {
  const [title,   setTitle]   = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tag,     setTag]     = useState("Agriculture");
  const [imgUrl,  setImgUrl]  = useState("");
  const [author,  setAuthor]  = useState(user ? user.full_name : "");
  
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      setError("Please fill out the title, short excerpt, and full story content.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    const payload = {
      title: title.trim(),
      author: author.trim() || "Community Member",
      excerpt: excerpt.trim(),
      content: content.trim(),
      tag: tag,
      image_url: imgUrl.trim() || "https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c4f?auto=format&fit=crop&w=800&q=80",
      read_time: Math.max(1, Math.ceil(content.split(" ").length / 200)) + " min read"
    };

    try {
      const res = await fetch("http://localhost:5000/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setLoading(false);
        setSuccess(true);
        // We use Math.random() as a temporary ID until the page is refreshed so it works instantly in the UI
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

  const LABEL = {
    display:"block", fontFamily:"'Plus Jakarta Sans',sans-serif",
    fontSize:12, fontWeight:700, color:"#334155", 
    letterSpacing:".05em", textTransform:"uppercase", marginBottom:8,
  };

  return (
    <div onClick={handleOverlay} className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 640 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-scroll-area" style={{ padding: "40px 48px" }}>
          {success ? (
            <div style={{ textAlign:"center", padding:"40px 0", animation:"popIn .35s ease" }}>
              <div style={{ fontSize:64, marginBottom:20 }}>📖</div>
              <h3 className="fr" style={{ fontSize:32, color:"#0f172a", marginBottom:12, fontWeight:800 }}>
                Story Published!
              </h3>
              <p className="jk" style={{ fontSize:16, color:"#64748b", lineHeight:1.7, fontWeight:500 }}>
                Your story is now live. Thank you for inspiring the community!
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <span className="tag-badge" style={{ background:"rgba(5,150,105,0.1)", color:"#059669", marginBottom:12 }}>Community Story</span>
                <h2 className="fr" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight:900, color:"#0f172a", lineHeight:1.1, marginBottom:8 }}>
                  Share your <span style={{ color:"#059669" }}>Experience</span>
                </h2>
              </div>

              {error && (
                <div style={{ fontSize:14, color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", marginBottom:24, display:"flex", gap:8, alignItems:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <div style={{ flex: 2 }}>
                  <label style={LABEL}>Title <span style={{ color:"#ef4444" }}>*</span></label>
                  <input className="input-modern" placeholder="Give your story a catchy title…"
                    value={title} onChange={e=>{setTitle(e.target.value);setError("");}}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL}>Topic Tag</label>
                  <select className="input-modern" value={tag} onChange={e=>setTag(e.target.value)} style={{ appearance: "none" }}>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Technology">Technology</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Research">Research</option>
                    <option value="Livestock">Livestock</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={LABEL}>Author Name</label>
                  <input className="input-modern" placeholder="Your name…"
                    value={author} onChange={e=>setAuthor(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={LABEL}>Cover Image URL <span style={{ color:"#94a3b8", fontWeight:500, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  <input className="input-modern" placeholder="https://example.com/image.jpg"
                    value={imgUrl} onChange={e=>setImgUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={LABEL}>Short Excerpt <span style={{ color:"#ef4444" }}>*</span></label>
                <textarea className="input-modern" style={{ resize:"vertical", lineHeight:1.6, minHeight: "80px" }}
                  placeholder="Write a 1-2 sentence summary to hook readers…"
                  value={excerpt} onChange={e=>setExcerpt(e.target.value)}
                />
              </div>

              <div style={{ marginBottom:32 }}>
                <label style={LABEL}>Full Story Content <span style={{ color:"#ef4444" }}>*</span></label>
                <textarea className="input-modern" style={{ resize:"vertical", lineHeight:1.6, minHeight: "200px" }}
                  placeholder="Write your full story here. You can use double asterisks like **this** to make text bold."
                  value={content} onChange={e=>setContent(e.target.value)}
                />
              </div>

              <button className="btn-green" onClick={handleSubmit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16 }}>
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
  const [showUpload,    setShowUpload]    = useState(false); // 🟢 Controls the upload modal

  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");

  // Get the unique ID we generated in App.js
  const visitorId = localStorage.getItem("hv_visitor_id") || "guest_fallback";
  // 🟢 Check if a real user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("hv_user"));

  // Fetch stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/stories?visitorId=${visitorId}`);
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
            comments: s.comments, // Fetched directly from the database!
            img: s.image_url,
            excerpt: s.excerpt,
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

  // 🟢 FIX: PREVENT BACKGROUND SCROLLING WHEN MODAL IS OPEN
  useEffect(() => {
    if (selectedStory || showUpload) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedStory, showUpload]);

  // Filter only by Search Query
  const filtered = stories.filter((s) => {
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.tag.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle clicking the Like button
  const toggleLike = async (id, e) => {
    e.stopPropagation();
    
    // 1. Optimistic UI Update
    setStories(prevStories => prevStories.map(story => {
      if (story.id === id) {
        const isCurrentlyLiked = story.hasLiked;
        return {
          ...story,
          hasLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? story.likes - 1 : story.likes + 1
        };
      }
      return story;
    }));

    if (selectedStory && selectedStory.id === id) {
      setSelectedStory(prev => {
        const isCurrentlyLiked = prev.hasLiked;
        return {
          ...prev,
          hasLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? prev.likes - 1 : prev.likes + 1
        };
      });
    }

    // 2. Send the actual request to the backend
    try {
      await fetch(`http://localhost:5000/api/stories/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId })
      });
    } catch (err) { console.error("Failed to save like:", err); }
  };

  const loadComments = async (storyId) => {
    if (!showComments) {
      try {
        const res = await fetch(`http://localhost:5000/api/stories/${storyId}/comments`);
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
      const res = await fetch(`http://localhost:5000/api/stories/${selectedStory.id}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const freshRes = await fetch(`http://localhost:5000/api/stories/${selectedStory.id}/comments`);
        const freshData = await freshRes.json();
        setComments(freshData);
        setNewComment(""); 
        
        setStories(prev => prev.map(s => s.id === selectedStory.id ? {...s, comments: s.comments + 1} : s));
        setSelectedStory(prev => ({...prev, comments: prev.comments + 1}));
      }
    } catch(err) { console.error("Failed to post comment:", err); }
  };

  // 🟢 NEW: Instantly show the new story when uploaded
  const handleNewStory = (newStory) => {
    const initials = newStory.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const formattedNewStory = {
      ...newStory,
      img: newStory.image_url,    // Fix: mapping to what the card expects
      readTime: newStory.read_time, // Fix: mapping to what the card expects
      initials: initials,
      ago: "Just now",
      hasLiked: false
    };
    
    setStories(prev => [formattedNewStory, ...prev]);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#111827", overflow: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)" }}>
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

        .story-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 1); border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.4s; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08); display: flex; flex-direction: column; }
        .story-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 2px rgba(16, 185, 129, 0.2); background: rgba(255, 255, 255, 0.95); }

        .search-container { position: relative; max-width: 680px; margin: 0 auto; transform: translateY(50%); z-index: 10; }
        .search-box { width: 100%; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 1); border-radius: 100px; padding: 22px 32px 22px 64px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 500; color: #111827; outline: none; transition: all .3s ease; box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08); }
        .search-box::placeholder { color: #94a3b8; }
        .search-box:focus { border-color: #10b981; background: #ffffff; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }
        .search-icon { position: absolute; left: 28px; top: 50%; transform: translateY(-50%); font-size: 22px; color: #10b981; pointer-events: none; }

        .input-modern {
          width: 100%; padding: 14px 18px; background: #f8faf9;
          border: 1px solid #e2e8f0; border-radius: 12px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #111827;
          transition: all 0.2s; font-weight: 500;
        }
        .input-modern:focus { background: #fff; border-color: #059669; box-shadow: 0 0 0 4px rgba(5,150,105,0.1); }

        .btn-green { background: #059669; color: #fff; border: none; cursor: pointer; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 12px 28px; transition: all .2s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-green:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(5, 150, 105, 0.25); }

        .btn-ghost { background: rgba(255, 255, 255, 0.6); color: #334155; border: 1px solid rgba(0,0,0,0.05); cursor: pointer; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 12px 28px; transition: all .2s ease; display: inline-flex; align-items: center; gap: 6px; }
        .btn-ghost:hover { background: #ffffff; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .like-btn { background: #f8faf9; border: 1px solid #e2e8f0; border-radius: 50px; cursor: pointer; padding: 6px 14px; display: flex; align-items: center; gap: 6px; transition: all .2s; font-weight: 600; color: #475569; }
        .like-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
        .like-btn.liked { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

        .c-input { padding: 14px 18px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; width: 100%; transition: border .2s; background: #ffffff; }
        .c-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }

        .modal-overlay { position: fixed; top: 72px; left: 0; right: 0; bottom: 0; z-index: 450; background: rgba(15, 23, 42, 0.35); backdrop-filter: blur(24px); display: flex; justify-content: center; align-items: center; padding: 40px 20px; animation: fadeIn .3s ease-out; }
        
        /* 🟢 FIX: PREVENT HORIZONTAL OVERFLOW */
        .modal-box { background: #ffffff; border-radius: 24px; width: 100%; max-width: 800px; max-height: 100%; display: flex; flex-direction: column; position: relative; overflow-x: hidden; overflow-y: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3); animation: slideUp .4s cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-scroll-area { overflow-y: auto; overflow-x: hidden; flex-grow: 1; width: 100%; word-break: break-word; overscroll-behavior: contain; }
        
        .modal-scroll-area::-webkit-scrollbar { width: 6px; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        
        .modal-close-btn { position: absolute; top: 20px; right: 20px; z-index: 100; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); color: #ffffff; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; }
        .modal-close-btn:hover { background: #ffffff; color: #064e3b; transform: scale(1.1); }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .modal-content p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; line-height: 1.8; color: #334155; margin-bottom: 24px; font-weight: 400; word-break: break-word; }
        .modal-content strong, .modal-content b { font-weight: 700; color: #0f172a; }

        .tag-badge { display: inline-block; background: rgba(16, 185, 129, 0.9); color: #ffffff; backdrop-filter: blur(4px); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 6px 14px; border-radius: 50px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      `}</style>

      {/* ══ PAGE HEADER ══ */}
      <div style={{ paddingTop: 72, background: "transparent" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "50px 24px 0px", textAlign: "center" }}>
          <h1 className="fr" style={{ fontSize: "clamp(35px, 5vw, 60px)", fontWeight: 900, color: "#112a0f", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Explore ideas, research, and <br/> <span style={{ color:"#059669" }}>agricultural stories.</span>
          </h1>
          <p className="jk" style={{ marginTop: 20, fontSize: 16, color: "#475569", fontWeight: 500, lineHeight: 1.6, maxWidth: 800, margin: "20px auto 0" }}>
            Stay updated with the latest developments in agriculture and horticulture, including sustainable farming innovations and newly released crop varieties from leading institutes worldwide.
          </p>

          {/* 🟢 ADDED: Upload Button (Only shows if user is logged in) */}
          {loggedInUser && (
            <div style={{ marginTop: "24px", animation: "fadeIn 0.5s ease" }}>
              <button 
                onClick={() => setShowUpload(true)} 
                className="btn-green"
                style={{ padding: "14px 32px", fontSize: "16px", boxShadow: "0 8px 20px rgba(5, 150, 105, 0.3)" }}
              >
                <span style={{ fontSize: "20px" }}>✍️</span> Share Your Story
              </button>
            </div>
          )}

          <div className="search-container" style={{ marginTop: loggedInUser ? "30px" : "0px" }}>
            <span className="search-icon">🔍</span>
            <input 
              className="search-box" 
              placeholder="Search by title, author, or topic..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* ══ STORIES GRID ══ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 100px", position: "relative", zIndex: 5 }}>
        
        {loading ? (
           <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading stories from database...</div>
        ) : (
          <>
            {searchQuery && (
              <p className="jk" style={{ fontSize: 16, color: "#475569", marginBottom: 32, fontWeight: 600, background: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: "12px", display: "inline-block" }}>
                Found <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> results for "{searchQuery}"
              </p>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
              {filtered.map((s, i) => {
                const shortTitle = s.title.length > 60 ? s.title.substring(0, 65).trim() + "..." : s.title;

                return (
                  <article key={s.id} className="story-card" onClick={() => { 
                    setSelectedStory(s); 
                    setShowComments(false);
                    setComments([]); 
                  }}>
                    <div style={{ height: 220, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                      <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                      <span className="tag-badge" style={{ position: "absolute", top: 16, left: 16 }}>{s.tag}</span>
                      <span className="jk" style={{ position: "absolute", bottom: 16, right: 16, fontSize: 12, color: "#fff", fontWeight: 700, background: "rgba(0,0,0,0.4)", padding: "6px 14px", borderRadius: 50, backdropFilter: "blur(8px)" }}>
                        {s.readTime}
                      </span>
                    </div>

                    <div style={{ padding: "28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <h2 className="fr" style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: 12 }}>
                        {shortTitle}
                      </h2>
                      <p className="jk" style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, fontWeight: 500, marginBottom: 24, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {s.excerpt}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{s.initials}</div>
                          <div>
                            <div className="jk" style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{s.author}</div>
                            <div className="jk" style={{ fontSize: 12, color: "#64748b", marginTop: 2, fontWeight: 500 }}>{s.ago}</div>
                          </div>
                        </div>
                        
                        <button className={`like-btn jk ${s.hasLiked ? 'liked' : ''}`} onClick={(e) => toggleLike(s.id, e)}>
                          {s.hasLiked ? "❤️" : "🤍"} {s.likes}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "100px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
                <h3 className="fr" style={{ fontSize: 28, color: "#0f172a", fontWeight: 800 }}>No stories found</h3>
                <p className="jk" style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>We couldn't find any articles matching your search.</p>
                <button className="btn-ghost" style={{ marginTop: 24, background:"rgba(255,255,255,0.8)" }} onClick={() => setSearchQuery("")}>Clear Search</button>
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
        <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedStory(null)}>✕</button>

            <div className="modal-scroll-area">
              <div style={{ height: 320, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={selectedStory.img} alt={selectedStory.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: 24, left: 32, right: 32 }}>
                  <span className="tag-badge" style={{ marginBottom: 16 }}>{selectedStory.tag}</span>
                  <h1 className="fr" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#ffffff", lineHeight: 1.15, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    {selectedStory.title}
                  </h1>
                </div>
              </div>

              <div style={{ padding: "40px 48px 60px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="avatar" style={{ background: avatarColors[selectedStory.id % avatarColors.length], width: 48, height: 48, fontSize: 16 }}>{selectedStory.initials}</div>
                    <div>
                      <div className="jk" style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{selectedStory.author}</div>
                      <div className="jk" style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{selectedStory.ago} · {selectedStory.readTime}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button 
                      className="btn-green" 
                      onClick={(e) => toggleLike(selectedStory.id, e)}
                      style={{
                        background: selectedStory.hasLiked ? "#fef2f2" : "#059669",
                        color: selectedStory.hasLiked ? "#dc2626" : "#fff",
                        border: selectedStory.hasLiked ? "1px solid #fca5a5" : "1px solid transparent",
                        boxShadow: selectedStory.hasLiked ? "none" : "0 4px 12px rgba(5, 150, 105, 0.3)"
                      }}
                    >
                      {selectedStory.hasLiked ? "❤️ Loved it" : "🤍 Applaud"} · {selectedStory.likes}
                    </button>
                    <button className="btn-ghost" onClick={() => loadComments(selectedStory.id)}>
                      💬 Discussion ({selectedStory.comments})
                    </button>
                  </div>
                </div>

                <div className="modal-content">
                  {selectedStory.content && selectedStory.content.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
                  ))}
                </div>

                {/* DISCUSSION PANEL */}
                {showComments && (
                  <div style={{ marginTop: 40, paddingTop: 40, borderTop: "2px dashed #e2e8f0", animation: "fadeIn .4s" }}>
                    <h3 className="fr" style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Join the Conversation</h3>
                    
                    <div style={{ background: "#f8faf9", padding: 24, borderRadius: 16, marginBottom: 32, border: "1px solid #e2e8f0" }}>
                      {!loggedInUser && (
                        <input 
                          className="c-input" 
                          style={{ marginBottom: 12 }} 
                          placeholder="Your Name (Optional)" 
                          value={guestName} 
                          onChange={e => setGuestName(e.target.value)} 
                        />
                      )}
                      <textarea 
                        className="c-input" 
                        style={{ resize: "vertical", minHeight: 100, marginBottom: 16 }} 
                        placeholder="What are your thoughts on this?" 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn-green" onClick={submitComment}>Post Comment</button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {comments.length === 0 ? (
                        <div className="jk" style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0" }}>Be the first to share your thoughts!</div>
                      ) : (
                        comments.map(c => (
                          <div key={c.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
                              <strong className="jk" style={{ color: "#0f172a", fontSize: 15, fontWeight: 700 }}>
                                {c.full_name || c.guest_name || "Guest Farmer"}
                              </strong>
                              <span className="jk" style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>
                                {new Date(c.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="jk" style={{ color: "#475569", fontSize: 15, lineHeight: 1.6 }}>{c.comment_text}</p>
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