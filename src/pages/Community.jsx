import { useState, useEffect, useRef, useCallback } from "react";
import Footer from '../components/Footer'; // Adjust this path if your folder structure is different!

/* ══════════════════════════════════════════════════════════
   BACKEND-READY API LAYER
   Replace mock functions with real fetch() calls when
   your Node/Express + MySQL backend is ready.

   Example real call:
     const res = await fetch("http://localhost:5000/api/community/posts", {
       headers: { Authorization: `Bearer ${token}` }
     });
     return res.json();
══════════════════════════════════════════════════════════ */
const API = {
  async getPosts(filter = "all", page = 1) {
    // TODO: GET /api/community/posts?filter=trending&page=1
    await new Promise((r) => setTimeout(r, 300));
    return { posts: MOCK_POSTS.filter(p => filter === "all" || p.category === filter), total: MOCK_POSTS.length };
  },
  async getMembers() {
    // TODO: GET /api/community/members/featured
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_MEMBERS;
  },
  async likePost(postId) {
    // TODO: POST /api/community/posts/:id/like
    await new Promise((r) => setTimeout(r, 100));
    return { success: true };
  },
  async createPost(data) {
    // TODO: POST /api/community/posts  body: { title, content, category, tags }
    await new Promise((r) => setTimeout(r, 400));
    return { id: Date.now(), ...data, author: "You", initials: "YO", ago: "Just now", likes: 0, comments: 0, views: 0 };
  },
  async addComment(postId, text) {
    // TODO: POST /api/community/posts/:id/comments  body: { text }
    await new Promise((r) => setTimeout(r, 200));
    return { id: Date.now(), author: "You", initials: "YO", text, ago: "Just now" };
  },
  async joinGroup(groupId) {
    // TODO: POST /api/community/groups/:id/join
    await new Promise((r) => setTimeout(r, 150));
    return { success: true };
  },
};

/* ══════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════ */
const MOCK_POSTS = [
  {
    id: 1, category: "discussion",
    title: "Best soil mix for monsoon season — what's working for you?",
    content: "With the monsoon arriving early this year, I've been struggling with waterlogged beds. Tried adding perlite at 30% ratio but still seeing root rot in my tomatoes. Anyone have a mix that's been working well in high-rainfall areas?",
    author: "Ravi Kumar", initials: "RK", ago: "2 hours ago",
    likes: 47, comments: 23, views: 312,
    tags: ["Soil", "Monsoon", "Tomatoes"],
    liked: false,
    commentList: [
      { id: 1, author: "Priya S.", initials: "PS", text: "Try coarse river sand instead of perlite — much better drainage and cheaper!", ago: "1 hour ago" },
      { id: 2, author: "James C.", initials: "JC", text: "Raised beds completely solved this for me. 6 inches above ground level makes all the difference.", ago: "45 min ago" },
    ],
  },
  {
    id: 2, category: "showcase",
    title: "My rooftop hydroponic setup after 6 months — full update 🌿",
    content: "Started with just 4 NFT channels and some basil. Now running 12 channels with lettuce, spinach, mint and cherry tomatoes. Monthly yield has gone from 2kg to nearly 18kg. Here's everything I learned about nutrient ratios and light schedules.",
    author: "Aisha Patel", initials: "AP", ago: "5 hours ago",
    likes: 124, comments: 38, views: 892,
    tags: ["Hydroponics", "NFT", "Rooftop"],
    liked: true,
    commentList: [
      { id: 1, author: "Carlos M.", initials: "CM", text: "Incredible progress! What EC level are you running for the tomatoes?", ago: "4 hours ago" },
    ],
  },
  {
    id: 3, category: "question",
    title: "Is companion planting with marigolds actually effective against aphids?",
    content: "I've read conflicting studies — some say marigolds significantly reduce aphid populations, others find no measurable effect. Has anyone done systematic trials in their garden? Looking for real data, not anecdotes.",
    author: "Dr. Lena Hoffman", initials: "LH", ago: "1 day ago",
    likes: 89, comments: 54, views: 1240,
    tags: ["Companion Planting", "Pest Control", "Research"],
    liked: false,
    commentList: [
      { id: 1, author: "Tanaka A.", initials: "TA", text: "Published a small trial on this last semester — French marigolds showed 34% reduction in aphid count vs control. Happy to share the data.", ago: "20 hours ago" },
      { id: 2, author: "Ravi K.", initials: "RK", text: "Variety matters a lot — French marigolds (T. patula) outperform African marigolds in aphid deterrence.", ago: "18 hours ago" },
    ],
  },
  {
    id: 4, category: "event",
    title: "🌱 Virtual Workshop: Introduction to Aquaponics Systems — March 20",
    content: "Joining us for a 2-hour live session covering system design, fish selection, plant compatibility, and water chemistry basics. Open to all HortiVerse members. Limited to 80 participants. Registration closes March 18.",
    author: "HortiVerse Admin", initials: "HV", ago: "2 days ago",
    likes: 203, comments: 67, views: 2840,
    tags: ["Aquaponics", "Workshop", "Event"],
    liked: false,
    commentList: [],
  },
  {
    id: 5, category: "discussion",
    title: "Anyone tried biochar in clay-heavy soils? Results after 2 seasons",
    content: "Applied biochar at 5 t/ha to a heavy clay plot in October 2022. Two full seasons later: infiltration improved by ~40%, CEC up significantly, and yields on winter wheat beat the control plot by 18%. Not cheap to implement but the long-term math works.",
    author: "Prof. James Whitfield", initials: "JW", ago: "3 days ago",
    likes: 156, comments: 41, views: 1780,
    tags: ["Biochar", "Soil Amendment", "Clay Soil"],
    liked: false,
    commentList: [],
  },
  {
    id: 6, category: "showcase",
    title: "Built a DIY automated irrigation controller for ₹800 using Arduino 🤖",
    content: "Soil moisture sensors + Arduino Nano + a couple of solenoid valves. Controls irrigation for 3 zones independently, logs data to SD card, and sends alerts via a cheap GSM module when moisture drops below threshold. Full schematic in the comments.",
    author: "Shreya Nair", initials: "SN", ago: "4 days ago",
    likes: 287, comments: 92, views: 4210,
    tags: ["Arduino", "Automation", "DIY", "Irrigation"],
    liked: true,
    commentList: [],
  },
];

const MOCK_MEMBERS = [
  { id: 1, name: "Aisha Patel",        initials: "AP", role: "Hydroponics Specialist", country: "🇮🇳", posts: 124, followers: 892  },
  { id: 2, name: "Dr. Lena Hoffman",   initials: "LH", role: "Plant Researcher",       country: "🇩🇪", posts: 89,  followers: 1204 },
  { id: 3, name: "Shreya Nair",        initials: "SN", role: "AgriTech Enthusiast",    country: "🇮🇳", posts: 76,  followers: 643  },
  { id: 4, name: "Prof. James W.",     initials: "JW", role: "Soil Scientist",         country: "🇬🇧", posts: 201, followers: 2341 },
];

const GROUPS = [
  { id: 1, icon: "🌾", name: "Organic Farmers India",   members: 1240, joined: false },
  { id: 2, icon: "💧", name: "Hydroponic Growers",      members: 892,  joined: true  },
  { id: 3, icon: "🤖", name: "AgriTech Builders",       members: 567,  joined: false },
  { id: 4, icon: "🌱", name: "Urban Gardeners Network", members: 2103, joined: false },
];

const CATEGORIES = [
  { key: "all",        label: "All Posts",  icon: "🌿" },
  { key: "discussion", label: "Discussion", icon: "💬" },
  { key: "question",   label: "Questions",  icon: "❓" },
  { key: "showcase",   label: "Showcase",   icon: "🏆" },
  { key: "event",      label: "Events",     icon: "📅" },
];

const CAT_COLORS = {
  discussion: { bg: "#e8f5e9", color: "#2e7d32" },
  question:   { bg: "#e3f2fd", color: "#1565c0" },
  showcase:   { bg: "#fff8e1", color: "#e65100" },
  event:      { bg: "#f3e5f5", color: "#6a1b9a" },
};

const avatarPalette = ["#43a047","#2e7d32","#1b5e20","#388e3c","#66bb6a","#81c784"];

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export default function Community() {
  const [posts,          setPosts]          = useState([]);
  const [members,        setMembers]        = useState([]);
  const [groups,         setGroups]         = useState(GROUPS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading,        setLoading]        = useState(true);
  const [visible,        setVisible]        = useState({});
  const [expandedPost,   setExpandedPost]   = useState(null);
  const [newComment,     setNewComment]     = useState("");
  const [showNewPost,    setShowNewPost]     = useState(false);
  const [postTitle,      setPostTitle]      = useState("");
  const [postContent,    setPostContent]    = useState("");
  const [postCategory,   setPostCategory]   = useState("discussion");
  const [postTags,       setPostTags]       = useState("");
  const [submitting,     setSubmitting]     = useState(false);
  const [postSuccess,    setPostSuccess]    = useState(false);
  const sectionRefs = useRef({});

  /* load posts */
  const loadPosts = useCallback(async (cat) => {
    setLoading(true);
    try {
      const data = await API.getPosts(cat);
      setPosts(data.posts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(activeCategory); }, [activeCategory, loadPosts]);
  useEffect(() => { API.getMembers().then(setMembers); }, []);

  /* intersection observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setVisible((p) => ({ ...p, [e.target.id]: true }));
      }),
      { threshold: 0.06 }
    );
    Object.values(sectionRefs.current).forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, [posts]);

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  /* like handler */
  const handleLike = async (postId) => {
    setPosts((prev) => prev.map((p) =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
    await API.likePost(postId); // TODO: sync to backend
  };

  /* add comment */
  const handleComment = async (postId) => {
    if (!newComment.trim()) return;
    const comment = await API.addComment(postId, newComment);
    setPosts((prev) => prev.map((p) =>
      p.id === postId
        ? { ...p, comments: p.comments + 1, commentList: [...p.commentList, comment] }
        : p
    ));
    setNewComment("");
  };

  /* create post */
  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) return;
    setSubmitting(true);
    try {
      const newPost = await API.createPost({
        title: postTitle, content: postContent,
        category: postCategory,
        tags: postTags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setPosts((prev) => [newPost, ...prev]);
      setPostSuccess(true);
      setTimeout(() => { setPostSuccess(false); setShowNewPost(false); setPostTitle(""); setPostContent(""); setPostTags(""); }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  /* join group */
  const handleJoinGroup = async (groupId) => {
    setGroups((prev) => prev.map((g) =>
      g.id === groupId ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g
    ));
    await API.joinGroup(groupId);
  };

  /* ── RENDER ── */
  return (
    <div style={{ fontFamily: "'Georgia',serif", background: "linear-gradient(160deg,#f0faf0 0%,#f7fbf7 40%,#f0f4ff 80%,#fdf8f0 100%)", minHeight: "100vh", paddingTop: 68 }}>

      {/* ════ GLOBAL STYLES ════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0faf0; }
        ::-webkit-scrollbar-thumb { background: #a8d8a8; border-radius: 3px; }
        .fr { font-family: 'Fraunces', serif; }
        .jk { font-family: 'Plus Jakarta Sans', sans-serif; }

        .glass {
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.88);
          box-shadow: 0 4px 24px rgba(60,140,60,0.07);
        }
        .glass-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.90);
          box-shadow: 0 4px 24px rgba(60,130,60,0.08);
          border-radius: 20px;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .glass-card:hover {
          box-shadow: 0 16px 48px rgba(60,130,60,0.15);
          border-color: rgba(100,180,100,0.35);
          background: rgba(255,255,255,0.88);
        }

        .post-card {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.92);
          box-shadow: 0 4px 20px rgba(60,130,60,0.07);
          border-radius: 20px; overflow: hidden;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .post-card:hover {
          box-shadow: 0 16px 44px rgba(60,130,60,0.14);
          border-color: rgba(100,180,100,0.38);
          transform: translateY(-3px);
        }

        .cat-pill {
          background: rgba(255,255,255,0.65); backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.85); color: #2d4a2d;
          padding: 9px 18px; border-radius: 50px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
          font-weight: 600; transition: all .22s;
          display: flex; align-items: center; gap: 6px;
        }
        .cat-pill:hover { background: rgba(76,175,80,.1); border-color: rgba(76,175,80,.5); }
        .cat-pill.on {
          background: linear-gradient(135deg,#43a047,#1b5e20);
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 14px rgba(67,160,71,.35);
        }

        .btn-green {
          background: linear-gradient(135deg,#43a047,#1b5e20);
          color: #fff; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 13px; padding: 11px 24px; border-radius: 50px;
          display: inline-flex; align-items: center; gap: 7px;
          transition: all .3s; box-shadow: 0 4px 16px rgba(67,160,71,.35);
          text-decoration: none;
        }
        .btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(67,160,71,.5); filter: brightness(1.05); }

        .btn-ghost {
          background: rgba(255,255,255,0.75); backdrop-filter: blur(10px);
          color: #2e7d32; border: 1.5px solid rgba(67,160,71,.4); cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 13px; padding: 10px 22px; border-radius: 50px;
          display: inline-flex; align-items: center; gap: 6px; transition: all .3s;
        }
        .btn-ghost:hover { background: rgba(76,175,80,.1); border-color: #4caf50; transform: translateY(-2px); }

        .like-btn {
          background: none; border: 1.5px solid rgba(76,175,80,.25);
          border-radius: 50px; padding: 7px 14px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
          font-weight: 600; color: #5a7a5a; transition: all .22s;
          display: flex; align-items: center; gap: 5px;
        }
        .like-btn:hover { background: rgba(76,175,80,.08); border-color: rgba(76,175,80,.5); }
        .like-btn.liked { background: rgba(76,175,80,.12); color: #2e7d32; border-color: #81c784; }

        .action-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
          font-weight: 500; color: #7a9a7a; transition: color .2s;
          display: flex; align-items: center; gap: 5px; padding: 7px 10px;
          border-radius: 50px;
        }
        .action-btn:hover { color: #2e7d32; background: rgba(76,175,80,.07); }

        .reveal { opacity: 0; transform: translateY(22px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.on { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:.06s} .d2{transition-delay:.14s}
        .d3{transition-delay:.22s} .d4{transition-delay:.30s}
        .d5{transition-delay:.38s} .d6{transition-delay:.46s}

        .overlay {
          position: fixed; inset: 0; z-index: 900;
          background: rgba(10,30,10,.4); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn .22s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal {
          background: rgba(255,255,255,.97); backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,.98);
          box-shadow: 0 32px 80px rgba(20,80,20,.2);
          border-radius: 28px; padding: 44px 48px;
          width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
          animation: slideUp .3s cubic-bezier(.23,1,.32,1);
        }
        @keyframes slideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }

        .f-input {
          width: 100%; background: rgba(248,253,248,.9);
          border: 1.5px solid rgba(76,175,80,.2); color: #1a2e1a;
          padding: 13px 18px; border-radius: 14px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
          transition: border-color .3s;
        }
        .f-input:focus { border-color: rgba(76,175,80,.6); background: #fff; }
        .f-label { font-family:'Plus Jakarta Sans',sans-serif; font-size:11px;
          font-weight:700; color:#4a6a4a; letter-spacing:.07em;
          text-transform:uppercase; margin-bottom:7px; display:block; }

        .comment-input {
          flex: 1; min-width: 0; background: rgba(248,253,248,.8);
          border: 1.5px solid rgba(76,175,80,.18); color: #1a2e1a;
          padding: 10px 16px; border-radius: 50px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px;
          transition: border-color .3s;
        }
        .comment-input:focus { border-color: rgba(76,175,80,.55); background:#fff; }
        .comment-input::placeholder { color: #9aba9a; }

        .tag-chip {
          background: rgba(46,125,50,.1); color: #2e7d32;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 600; padding: 3px 11px;
          border-radius: 20px; letter-spacing: .03em;
        }

        .member-card {
          background: rgba(255,255,255,.65); backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,.88);
          box-shadow: 0 4px 18px rgba(60,130,60,.07);
          border-radius: 18px; padding: 20px;
          transition: all .32s;
        }
        .member-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(60,130,60,.14); background: rgba(255,255,255,.88); }

        .group-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-radius: 14px;
          background: rgba(255,255,255,.55); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,.82);
          transition: all .28s; margin-bottom: 10px;
        }
        .group-row:hover { background: rgba(255,255,255,.82); border-color: rgba(76,175,80,.3); }

        .section-chip {
          display: inline-block;
          background: rgba(76,175,80,.1); color: #2e7d32;
          border: 1px solid rgba(76,175,80,.22);
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px;
          font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
          padding: 5px 16px; border-radius: 50px; margin-bottom: 14px;
        }

        .avatar {
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; color: #fff; flex-shrink: 0;
        }

        .skeleton {
          background: linear-gradient(90deg,#e8f5e8 25%,#f0faf0 50%,#e8f5e8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease infinite; border-radius: 8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .success-box {
          background: linear-gradient(135deg,#e8f5e9,#c8e6c9);
          border: 1.5px solid #81c784; border-radius: 16px; padding: 24px;
          text-align: center; animation: popIn .3s cubic-bezier(.23,1,.32,1);
        }
        @keyframes popIn { from{transform:scale(.92);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      {/* ════ TWO-COLUMN LAYOUT ════ */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 48px 80px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

        {/* ════════════════════════
            LEFT — MAIN FEED
        ════════════════════════ */}
        <div>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: 32 }}>
            <span className="section-chip">48,000+ Members</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 className="fr" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, color: "#1a3a1a", lineHeight: 1.05 }}>
                  Community<br /><span style={{ color: "#43a047", fontStyle: "italic" }}>Forum</span>
                </h1>
                <p className="jk" style={{ fontSize: 14, color: "#5a7a5a", marginTop: 10, fontWeight: 300 }}>
                  Share ideas, ask questions, and connect with horticulture students worldwide.
                </p>
              </div>
              <button className="btn-green" onClick={() => setShowNewPost(true)} style={{ fontSize: 14, padding: "13px 28px", flexShrink: 0 }}>
                ✏️ New Post
              </button>
            </div>
          </div>

          {/* ── Category filters ── */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {CATEGORIES.map((c) => (
              <button key={c.key} className={`cat-pill ${activeCategory === c.key ? "on" : ""}`}
                onClick={() => setActiveCategory(c.key)}>
                <span>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>

          {/* ── Posts feed ── */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,.7)", padding: 28 }}>
                  <div className="skeleton" style={{ height: 16, width: "60%", marginBottom: 14 }} />
                  <div className="skeleton" style={{ height: 12, width: "100%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: "80%" }} />
                </div>
              ))}
            </div>
          ) : (
            <div id="posts-feed" ref={setRef("posts-feed")} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {posts.map((post, i) => {
                const catStyle = CAT_COLORS[post.category] || CAT_COLORS.discussion;
                const isExpanded = expandedPost === post.id;
                return (
                  <div key={post.id} className={`post-card reveal d${Math.min(i+1,6)} ${visible["posts-feed"] ? "on" : ""}`}>

                    {/* top bar */}
                    <div style={{ height: 4, background: `linear-gradient(90deg,#43a047,#81c784)` }} />

                    <div style={{ padding: "22px 26px" }}>
                      {/* meta row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, background: avatarPalette[i % avatarPalette.length] }}>{post.initials}</div>
                          <div>
                            <span className="jk" style={{ fontSize: 13, fontWeight: 600, color: "#1a3a1a" }}>{post.author}</span>
                            <span className="jk" style={{ fontSize: 11, color: "#9aba9a", marginLeft: 8 }}>{post.ago}</span>
                          </div>
                        </div>
                        <span className="jk" style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: catStyle.bg, color: catStyle.color, letterSpacing: ".05em", textTransform: "uppercase" }}>
                          {post.category}
                        </span>
                      </div>

                      {/* title */}
                      <h3 className="fr" style={{ fontSize: 19, fontWeight: 700, color: "#1a3a1a", lineHeight: 1.35, marginBottom: 10, cursor: "pointer" }}
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}>
                        {post.title}
                      </h3>

                      {/* content preview / full */}
                      <p className="jk" style={{ fontSize: 14, color: "#5a7a5a", lineHeight: 1.78, fontWeight: 300, marginBottom: 14 }}>
                        {isExpanded ? post.content : `${post.content.slice(0, 160)}…`}
                      </p>
                      <button className="action-btn" style={{ padding: "4px 0", marginBottom: 14, fontSize: 12 }}
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}>
                        {isExpanded ? "▲ Show less" : "▼ Read more"}
                      </button>

                      {/* tags */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {post.tags.map((t) => <span key={t} className="tag-chip">{t}</span>)}
                      </div>

                      {/* action bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 14, borderTop: "1px solid rgba(120,190,120,.1)" }}>
                        <button className={`like-btn ${post.liked ? "liked" : ""}`} onClick={() => handleLike(post.id)}>
                          {post.liked ? "❤️" : "🤍"} {post.likes}
                        </button>
                        <button className="action-btn" onClick={() => setExpandedPost(isExpanded ? null : post.id)}>
                          💬 {post.comments} Comments
                        </button>
                        <button className="action-btn">
                          👁️ {post.views.toLocaleString()} Views
                        </button>
                        <button className="action-btn" style={{ marginLeft: "auto" }}>
                          🔗 Share
                        </button>
                      </div>

                      {/* ── Comments section (expanded) ── */}
                      {isExpanded && (
                        <div style={{ marginTop: 20, borderTop: "1px solid rgba(120,190,120,.12)", paddingTop: 18 }}>
                          {/* existing comments */}
                          {post.commentList.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                              {post.commentList.map((c) => (
                                <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                  <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, background: "#43a047", flexShrink: 0 }}>{c.initials}</div>
                                  <div style={{ background: "rgba(248,253,248,.9)", borderRadius: 14, padding: "10px 14px", flex: 1, border: "1px solid rgba(120,190,120,.15)" }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                                      <span className="jk" style={{ fontSize: 12, fontWeight: 600, color: "#1a3a1a" }}>{c.author}</span>
                                      <span className="jk" style={{ fontSize: 11, color: "#9aba9a" }}>{c.ago}</span>
                                    </div>
                                    <p className="jk" style={{ fontSize: 13, color: "#4a6a4a", lineHeight: 1.65, fontWeight: 300 }}>{c.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* add comment */}
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: "#2e7d32" }}>YO</div>
                            <input className="comment-input" placeholder="Write a comment…"
                              value={newComment} onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)} />
                            <button className="btn-green" style={{ padding: "10px 18px", fontSize: 13 }}
                              onClick={() => handleComment(post.id)}>Post</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {posts.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🌱</div>
                  <h3 className="fr" style={{ fontSize: 22, color: "#1a3a1a" }}>No posts yet</h3>
                  <p className="jk" style={{ fontSize: 14, color: "#9aba9a", marginTop: 8 }}>Be the first to start a conversation!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ════════════════════════
            RIGHT SIDEBAR
        ════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 90 }}>

          {/* ── Community Stats ── */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 className="fr" style={{ fontSize: 20, fontWeight: 700, color: "#1a3a1a", marginBottom: 18 }}>
              Community Stats
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { n: "48K+",  l: "Members",   icon: "👥" },
                { n: "1.2K+", l: "Posts",     icon: "📝" },
                { n: "45+",   l: "Countries", icon: "🌍" },
                { n: "120+",  l: "Online Now",icon: "🟢" },
              ].map((s) => (
                <div key={s.l} style={{ background: "rgba(76,175,80,.07)", borderRadius: 14, padding: "14px 16px", textAlign: "center", border: "1px solid rgba(76,175,80,.12)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div className="fr" style={{ fontSize: 22, fontWeight: 700, color: "#2e7d32" }}>{s.n}</div>
                  <div className="jk" style={{ fontSize: 11, color: "#7a9a7a", marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Groups ── */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 className="fr" style={{ fontSize: 20, fontWeight: 700, color: "#1a3a1a", marginBottom: 16 }}>
              Groups
            </h3>
            {groups.map((g) => (
              <div key={g.id} className="group-row">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(76,175,80,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{g.icon}</div>
                  <div>
                    <div className="jk" style={{ fontSize: 13, fontWeight: 600, color: "#1a3a1a" }}>{g.name}</div>
                    <div className="jk" style={{ fontSize: 11, color: "#9aba9a", marginTop: 2 }}>{g.members.toLocaleString()} members</div>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinGroup(g.id)}
                  style={{
                    padding: "7px 16px", borderRadius: 50, border: "1.5px solid",
                    cursor: "pointer", fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontWeight: 600, transition: "all .22s",
                    background: g.joined ? "rgba(76,175,80,.12)" : "linear-gradient(135deg,#43a047,#1b5e20)",
                    color: g.joined ? "#2e7d32" : "#fff",
                    borderColor: g.joined ? "rgba(76,175,80,.4)" : "transparent",
                  }}>
                  {g.joined ? "✓ Joined" : "Join"}
                </button>
              </div>
            ))}
          </div>

          {/* ── Featured Members ── */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 className="fr" style={{ fontSize: 20, fontWeight: 700, color: "#1a3a1a", marginBottom: 16 }}>
              Top Contributors
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {members.map((m, i) => (
                <div key={m.id} className="member-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 42, height: 42, fontSize: 14, background: avatarPalette[i % avatarPalette.length] }}>{m.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="jk" style={{ fontSize: 13, fontWeight: 700, color: "#1a3a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.country} {m.name}
                      </div>
                      <div className="jk" style={{ fontSize: 11, color: "#7a9a7a", marginTop: 2 }}>{m.role}</div>
                    </div>
                    <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 11 }}>Follow</button>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(120,190,120,.1)" }}>
                    <span className="jk" style={{ fontSize: 11, color: "#7a9a7a" }}>
                      <span style={{ fontWeight: 700, color: "#2e7d32" }}>{m.posts}</span> posts
                    </span>
                    <span className="jk" style={{ fontSize: 11, color: "#7a9a7a" }}>
                      <span style={{ fontWeight: 700, color: "#2e7d32" }}>{m.followers.toLocaleString()}</span> followers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trending Tags ── */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 className="fr" style={{ fontSize: 20, fontWeight: 700, color: "#1a3a1a", marginBottom: 16 }}>
              Trending Tags
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Hydroponics","Soil Health","IoT","Organic","Companion Planting","Monsoon","Biochar","Aquaponics","Urban Farming","Irrigation"].map((t) => (
                <span key={t} className="tag-chip" style={{ cursor: "pointer", transition: "all .2s", padding: "5px 13px", fontSize: 12 }}
                  onMouseEnter={(e) => { e.target.style.background="rgba(46,125,50,.2)"; }}
                  onMouseLeave={(e) => { e.target.style.background="rgba(46,125,50,.1)"; }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ════ NEW POST MODAL ════ */}
      {showNewPost && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowNewPost(false); }}>
          <div className="modal">
            {postSuccess ? (
              <div className="success-box">
                <div style={{ fontSize: 52, marginBottom: 12 }}>🌿</div>
                <h3 className="fr" style={{ fontSize: 24, color: "#1b5e20", marginBottom: 8 }}>Post Published!</h3>
                <p className="jk" style={{ fontSize: 14, color: "#4a6a4a", fontWeight: 300 }}>Your post is live. The community will see it now!</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <h2 className="fr" style={{ fontSize: 28, fontWeight: 700, color: "#1a3a1a" }}>
                      Create a<br /><span style={{ color: "#43a047", fontStyle: "italic" }}>New Post</span>
                    </h2>
                    <p className="jk" style={{ fontSize: 13, color: "#8aaa8a", marginTop: 6, fontWeight: 300 }}>Share your knowledge with the community</p>
                  </div>
                  <button onClick={() => setShowNewPost(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(76,175,80,.25)", background: "rgba(255,255,255,.8)", cursor: "pointer", fontSize: 16, color: "#7a9a7a", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background="#fee"; e.currentTarget.style.color="#c00"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,.8)"; e.currentTarget.style.color="#7a9a7a"; }}>✕</button>
                </div>

                {/* category selector */}
                <div style={{ marginBottom: 22 }}>
                  <label className="f-label">Post Type</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {CATEGORIES.filter(c => c.key !== "all").map((c) => (
                      <button key={c.key}
                        onClick={() => setPostCategory(c.key)}
                        style={{
                          padding: "9px 18px", borderRadius: 50, border: "1.5px solid",
                          cursor: "pointer", fontSize: 13,
                          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600,
                          transition: "all .22s",
                          background: postCategory === c.key ? "linear-gradient(135deg,#43a047,#1b5e20)" : "rgba(248,253,248,.8)",
                          color: postCategory === c.key ? "#fff" : "#2d4a2d",
                          borderColor: postCategory === c.key ? "transparent" : "rgba(76,175,80,.2)",
                        }}>
                        {c.icon} {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* title */}
                <div style={{ marginBottom: 18 }}>
                  <label className="f-label">Title *</label>
                  <input className="f-input" placeholder="What's your post about?"
                    value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                </div>

                {/* content */}
                <div style={{ marginBottom: 18 }}>
                  <label className="f-label">Content *</label>
                  <textarea className="f-input" placeholder="Share your thoughts, questions, or findings…" rows={5}
                    style={{ resize: "vertical", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.7 }}
                    value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                </div>

                {/* tags */}
                <div style={{ marginBottom: 28 }}>
                  <label className="f-label">Tags (comma separated)</label>
                  <input className="f-input" placeholder="e.g. Hydroponics, Soil Health, IoT"
                    value={postTags} onChange={(e) => setPostTags(e.target.value)} />
                </div>

                {/* submit */}
                <button className="btn-green"
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14, opacity: submitting ? .7 : 1 }}
                  onClick={handleCreatePost} disabled={submitting}>
                  {submitting ? "⏳ Publishing…" : "🌿 Publish Post"}
                </button>
                <p className="jk" style={{ fontSize: 11, color: "#aacaaa", textAlign: "center", marginTop: 10, fontWeight: 300 }}>
                  Posts are visible to all community members
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {/* ══ FOOTER ══ */}
      <Footer />

    </div>
  );
}