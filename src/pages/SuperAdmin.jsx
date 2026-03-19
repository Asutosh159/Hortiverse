import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect, useRef } from "react";

const PREDEFINED_ICONS = ["🌿", "🌱", "🌾", "🚜", "💧", "🌻", "🍎", "🍅", "🥦", "🌲", "🍄", "🌍", "🔬", "📚", "⚙️", "🌤️", "🔥", "📊"];

export default function SuperAdmin() {
  const [stats, setStats] = useState({ users: 0, stories: 0, topics: 0, resources: 0 });
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);
  const [slides, setSlides] = useState([]);
  
  const [activeSection, setActiveSection] = useState("overview"); 
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null); 
  
  const [newSlide, setNewSlide] = useState({ url: "", caption: "", sub_text: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Topic Image Editor States
  const [topicImageMap, setTopicImageMap] = useState({});
  const [activeTopicImg, setActiveTopicImg] = useState(null);
  const [isTopicUploading, setIsTopicUploading] = useState(false);

  // Tracks temporary uploads to wipe them from Cloudinary if the admin clicks "Cancel"
  const [sessionUploads, setSessionUploads] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, stRes, tRes, rRes, sRes, slRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`),
        fetch(`${API_BASE_URL}/api/stories`), 
        fetch(`${API_BASE_URL}/api/topics`),  
        fetch(`${API_BASE_URL}/api/resources`),
        fetch(`${API_BASE_URL}/api/stats`),
        fetch(`${API_BASE_URL}/api/slides`)
      ]);

      const uData = uRes.ok ? await uRes.json() : [];
      const stData = stRes.ok ? await stRes.json() : [];
      const tData = tRes.ok ? await tRes.json() : [];
      const rData = rRes.ok ? await rRes.json() : [];
      const sData = sRes.ok ? await sRes.json() : { users: 0, stories: 0, topics: 0, resources: 0 };
      const slData = slRes.ok ? await slRes.json() : [];

      setUsers(uData);
      setStories(stData);
      setTopics(tData);
      setResources(rData);
      setSlides(slData);
      
      setStats({
        users: sData.users || uData.length,
        stories: sData.stories || stData.length,
        topics: sData.topics || tData.length,
        resources: sData.resources || rData.length
      });
    } catch (err) { console.error("Fetch failed:", err); } 
    finally { setLoading(false); }
  };

  // 🟢 FIXED: Await all Cloudinary deletions so the browser doesn't cancel the request!
  const deleteItem = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;

    try {
        if (type === 'topic' || type === 'story') {
            const list = type === 'topic' ? topics : stories;
            const itemToSweep = list.find(item => item.id === id);
            
            if (itemToSweep) {
                const content = itemToSweep.description || itemToSweep.content || "";
                const imgUrls = [...content.matchAll(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi)].map(m => m[2]);
                
                // FORCE React to wait for Cloudinary to confirm deletion before moving on
                if (imgUrls.length > 0) {
                    await Promise.all(imgUrls.map(url =>
                        fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
                    ));
                }
            }
        }

        // Now safe to delete from database
        const res = await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
        
        if (res.ok) {
            fetchData();
        } else {
            const errData = await res.json();
            alert(`Failed to delete from database: ${errData.error || 'Unknown Error'}`);
        }
    } catch (err) {
        console.error(err);
        alert(`Network Error: Could not delete item. ${err.message}`);
    }
  };

  const handleEditClick = (item, itemType) => {
    setSessionUploads([]); 
    if (itemType === 'topic') {
        const newMap = {};
        let parsedDesc = item.description || "";
        
        const matches = [...parsedDesc.matchAll(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi)];
        matches.forEach((match, idx) => {
            const desc = match[1];
            const url = match[2];
            const code = `[🖼️ Attached: ${desc} #${idx}]`; 
            newMap[code] = url;
            parsedDesc = parsedDesc.replace(match[0], code);
        });
        
        setTopicImageMap(newMap);
        setEditingItem({ type: itemType, data: { ...item, description: parsedDesc } });
    } else {
        setEditingItem({ type: itemType, data: item });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { type, data } = editingItem;
    
    let payload = { ...data };

    if (type === 'topic') {
        let finalDesc = payload.description || "";
        Object.entries(topicImageMap).forEach(([code, url]) => {
            const match = code.match(/\[🖼️ Attached: (.*?) #\d+\]/);
            const userDesc = match ? match[1] : "Asset";
            finalDesc = finalDesc.split(code).join(`![${userDesc}](${url})`);
        });
        payload.description = finalDesc;
    }

    // 🟢 FIXED: Await orphan sweeps
    const list = type === 'topic' ? topics : type === 'story' ? stories : [];
    const originalItem = list.find(item => item.id === payload.id);
    
    if (originalItem) {
        const oldContent = type === 'topic' ? (originalItem.description || "") : (originalItem.content || "");
        const newContent = type === 'topic' ? (payload.description || "") : (payload.content || "");
        
        const oldUrls = [...oldContent.matchAll(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi)].map(m => m[2]);
        const newUrls = [...newContent.matchAll(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi)].map(m => m[2]);
        
        const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));
        
        if (deletedUrls.length > 0) {
            await Promise.all(deletedUrls.map(url =>
                fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
            ));
        }
    }

    let endpoint = 'resources';
    if (type === 'story') endpoint = 'stories';
    if (type === 'topic') endpoint = 'topics';
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/${endpoint}/${payload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) { 
          setEditingItem(null); 
          setTopicImageMap({});
          setSessionUploads([]); 
          fetchData(); 
        } else {
          alert("Update failed. Check your server logs.");
        }
    } catch (err) {
        alert("Network error: Could not save updates.");
    }
  };

  // 🟢 FIXED: Await cancellation sweeps
  const handleCancelEdit = async () => {
    if (sessionUploads.length > 0) {
        await Promise.all(sessionUploads.map(url =>
            fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
        ));
    }
    setSessionUploads([]);
    setEditingItem(null);
    setTopicImageMap({});
  };

  const handleFileUpload = async (event, callback) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("File is too large. Please select a file under 4MB.");
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
        setSessionUploads(prev => [...prev, data.imageUrl]); 
        callback(data.imageUrl); 
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

  const handleTopicImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const textarea = document.getElementById('admin-topic-desc');
    const cursorPos = textarea ? textarea.selectionStart : (editingItem.data.description || "").length;
    
    setIsTopicUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.success) {
        setSessionUploads(prev => [...prev, data.imageUrl]); 
        setActiveTopicImg({ url: data.imageUrl, desc: "Topic Asset", isNew: true, pos: cursorPos });
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading image to server.");
    } finally {
      setIsTopicUploading(false);
      e.target.value = ""; 
    }
  };

  const handleSaveTopicImageContext = () => {
    const uniqueId = activeTopicImg.isNew ? Date.now().toString().slice(-4) : (activeTopicImg.oldCode.match(/#(\d+)\]/) ? activeTopicImg.oldCode.match(/#(\d+)\]/)[1] : Date.now().toString().slice(-4));
    const descText = activeTopicImg.desc.trim() || "Asset";
    const shortcode = `[🖼️ Attached: ${descText} #${uniqueId}]`;

    if (activeTopicImg.isNew) {
      setTopicImageMap(prev => ({ ...prev, [shortcode]: activeTopicImg.url }));
      const desc = editingItem.data.description || "";
      const before = desc.substring(0, activeTopicImg.pos);
      const after = desc.substring(activeTopicImg.pos);
      setEditingItem(prev => ({ ...prev, data: { ...prev.data, description: `${before}\n${shortcode}\n${after}` } }));
    } else {
      if (activeTopicImg.oldCode !== shortcode) {
        setTopicImageMap(prev => {
          const newMap = { ...prev };
          delete newMap[activeTopicImg.oldCode];
          newMap[shortcode] = activeTopicImg.url;
          return newMap;
        });
        setEditingItem(prev => ({ ...prev, data: { ...prev.data, description: prev.data.description.replace(activeTopicImg.oldCode, shortcode) } }));
      }
    }
    setActiveTopicImg(null); 
  };

  // 🟢 FIXED: Await the specific image removal sweep
  const handleRemoveTopicImage = async (codeToRemove, url) => {
    setEditingItem(prev => ({ ...prev, data: { ...prev.data, description: prev.data.description.replace(`\n${codeToRemove}\n`, '').replace(codeToRemove, '') } }));
    setTopicImageMap(prev => {
      const newMap = { ...prev };
      delete newMap[codeToRemove];
      return newMap;
    });
    setActiveTopicImg(null); 

    try {
      await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    } catch (err) {
      console.log("Cleanup failed.", err);
    }
  };

  const addSlide = async () => {
    if(!newSlide.url.trim()) return alert("Please upload an image first!");
    
    const res = await fetch(`${API_BASE_URL}/api/slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image_url: newSlide.url.trim(), 
        caption: newSlide.caption.trim() || "Explore HortiVerse", 
        sub_text: newSlide.sub_text.trim() || "Agricultural Knowledge Hub" 
      })
    });
    if (res.ok) { 
      setNewSlide({ url: "", caption: "", sub_text: "" }); 
      fetchData(); 
    } else {
      alert("Failed to add slide.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-900 bg-transparent">
      <div className="superadmin-bg fixed inset-0 -z-10" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)" }} />
      <div className="text-5xl animate-bounce mb-6">....</div>
      <h2 className="font-serif text-3xl font-bold animate-pulse text-slate-700">Loading dashboard...</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-transparent font-sans selection:bg-emerald-200">
      
      {/* 🟢 NEW: Uniform Background Gradients for the Super Admin Page! */}
      <div className="superadmin-bg" style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)",
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <style>{`
        /* Custom Scrollbar for SuperAdmin */
        .custom-scrollbar { -webkit-overflow-scrolling: touch; transform: translateZ(0); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
        
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* ══════════════════════════════════════════════════
            🌙 DARK MODE OVERRIDES FOR SUPER ADMIN
        ══════════════════════════════════════════════════ */
        body.dark-mode .superadmin-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%) !important; }
        
        body.dark-mode .bg-white { background-color: #1e293b !important; border-color: rgba(255,255,255,0.05) !important; }
        body.dark-mode .bg-slate-50 { background-color: #0f172a !important; border-color: rgba(255,255,255,0.05) !important; }
        body.dark-mode .bg-slate-100 { background-color: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.05) !important; }
        
        body.dark-mode .text-slate-900, body.dark-mode .text-slate-800 { color: #f8faf9 !important; }
        body.dark-mode .text-slate-700, body.dark-mode .text-slate-600 { color: #cbd5e1 !important; }
        body.dark-mode .text-slate-500, body.dark-mode .text-slate-400 { color: #94a3b8 !important; }
        
        body.dark-mode .border-slate-200, body.dark-mode .border-slate-100, body.dark-mode .border-slate-50 { border-color: rgba(255,255,255,0.05) !important; }
        body.dark-mode .border-b { border-color: rgba(255,255,255,0.05) !important; }
        body.dark-mode .border-r { border-color: rgba(255,255,255,0.05) !important; }
        body.dark-mode .border-t { border-color: rgba(255,255,255,0.05) !important; }
        
        /* Table Specifics */
        body.dark-mode th { color: #94a3b8 !important; }
        body.dark-mode tr:hover > td { background-color: rgba(255,255,255,0.02) !important; }
        
        /* Inputs and Textareas */
        body.dark-mode input, body.dark-mode textarea, body.dark-mode select { background-color: #0f172a !important; color: #f8faf9 !important; border-color: rgba(255,255,255,0.2) !important; }
        body.dark-mode input:focus, body.dark-mode textarea:focus, body.dark-mode select:focus { background-color: #020617 !important; border-color: #10b981 !important; box-shadow: 0 0 0 2px rgba(16,185,129,0.2) !important; }
        
        /* Buttons and Pills */
        body.dark-mode .bg-emerald-50 { background-color: rgba(16,185,129,0.1) !important; color: #34d399 !important; border-color: rgba(16,185,129,0.2) !important; }
        body.dark-mode .text-emerald-600, body.dark-mode .text-emerald-700 { color: #34d399 !important; }
        body.dark-mode .hover\\:bg-emerald-100:hover { background-color: rgba(16,185,129,0.2) !important; }
        
        body.dark-mode .bg-sky-50 { background-color: rgba(14,165,233,0.1) !important; color: #38bdf8 !important; }
        body.dark-mode .text-sky-600 { color: #38bdf8 !important; }
        body.dark-mode .hover\\:bg-sky-100:hover { background-color: rgba(14,165,233,0.2) !important; }

        body.dark-mode .bg-red-50 { background-color: rgba(239,68,68,0.1) !important; color: #f87171 !important; }
        body.dark-mode .text-red-600 { color: #f87171 !important; }
        body.dark-mode .hover\\:bg-red-100:hover { background-color: rgba(239,68,68,0.2) !important; }

        body.dark-mode .hover\\:bg-slate-100:hover, body.dark-mode .hover\\:bg-slate-50\\/50:hover { background-color: rgba(255,255,255,0.03) !important; }
        body.dark-mode .hover\\:text-slate-900:hover { color: #f8faf9 !important; }
        body.dark-mode .hover\\:bg-slate-200:hover { background-color: rgba(255,255,255,0.1) !important; }

        /* Modals Overlay Overrides */
        body.dark-mode .bg-slate-900\\/60 { background-color: rgba(15,23,42,0.85) !important; }
        body.dark-mode .bg-slate-900\\/40 { background-color: rgba(15,23,42,0.7) !important; }
        body.dark-mode .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) !important; }
        body.dark-mode .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.5) !important; }
      `}</style>

      {/* Mobile Menu Toggle */}
      <button 
        className="lg:hidden fixed bottom-8 right-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 z-[100001] transition-transform active:scale-95 text-2xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999]"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-20 bottom-0 left-0 w-[280px] bg-white border-r border-slate-200 p-6 flex flex-col gap-2 z-[1000] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="pb-6 mb-4 border-b border-slate-100">
          <h2 className="font-serif text-2xl font-bold text-slate-900 m-0">
            SuperAdmin<span className="text-emerald-600">Center</span>
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">HortiVerse Admin</p>
        </div>
        
        {[
          { id: 'overview', icon: '📊', label: 'Dashboard' },
          { id: 'users', icon: '👥', label: 'Users Registry' },
          { id: 'stories', icon: '✍️', label: 'Stories Manager' },
          { id: 'topics', icon: '🌿', label: 'Knowledge Hub' },
          { id: 'resources', icon: '📚', label: 'Resource Library' },
          { id: 'settings', icon: '🖼️', label: 'Slider Manager' },
        ].map(nav => (
          <button
            key={nav.id}
            onClick={() => { setActiveSection(nav.id); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold transition-all text-sm ${
              activeSection === nav.id 
                ? 'bg-emerald-50 text-emerald-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="text-lg">{nav.icon}</span> {nav.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] pt-32 px-6 md:px-10 pb-20 w-full min-h-screen transition-all duration-300">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900">
            {activeSection === 'overview' ? 'Dashboard' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </div>

        {/* Dashboard Overview */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            <div className="rounded-3xl p-8 text-white shadow-lg shadow-indigo-200 bg-gradient-to-br from-indigo-500 to-violet-600 hover:-translate-y-1 transition-transform">
              <div className="text-xs font-extrabold tracking-widest opacity-80 mb-2">TOTAL USERS</div>
              <div className="text-5xl font-black">{stats.users}</div>
            </div>
            <div className="rounded-3xl p-8 text-white shadow-lg shadow-rose-200 bg-gradient-to-br from-rose-500 to-pink-600 hover:-translate-y-1 transition-transform">
              <div className="text-xs font-extrabold tracking-widest opacity-80 mb-2">STORIES PUBLISHED</div>
              <div className="text-5xl font-black">{stats.stories}</div>
            </div>
            <div className="rounded-3xl p-8 text-white shadow-lg shadow-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-500 hover:-translate-y-1 transition-transform">
              <div className="text-xs font-extrabold tracking-widest opacity-80 mb-2">KNOWLEDGE TOPICS</div>
              <div className="text-5xl font-black">{stats.topics}</div>
            </div>
            <div className="rounded-3xl p-8 text-white shadow-lg shadow-amber-200 bg-gradient-to-br from-amber-500 to-orange-500 hover:-translate-y-1 transition-transform">
              <div className="text-xs font-extrabold tracking-widest opacity-80 mb-2">RESOURCES</div>
              <div className="text-5xl font-black">{stats.resources}</div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeSection === 'users' && (
          <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm animate-in fade-in duration-500">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-slate-900">{u.full_name}</td>
                    <td className="px-6 py-5 text-slate-600">{u.email}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${u.role === 'admin' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => deleteItem('user', u.id)} className="px-4 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stories, Topics, Resources Tables */}
        {['stories', 'topics', 'resources'].includes(activeSection) && (
          <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm animate-in fade-in duration-500">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Content Title</th>
                  <th className="px-6 py-5 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeSection === 'stories' ? stories : activeSection === 'topics' ? topics : resources).map(item => {
                  const itemType = activeSection === 'stories' ? 'story' : activeSection === 'topics' ? 'topic' : 'resource';
                  return (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">{item.title || item.label}</td>
                      <td className="px-6 py-5 flex gap-2">
                        <button onClick={() => handleEditClick(item, itemType)} className="px-4 py-2 bg-sky-50 text-sky-600 font-bold text-xs rounded-xl hover:bg-sky-100 transition-colors">Edit</button>
                        <button onClick={() => deleteItem(itemType, item.id)} className="px-4 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Slider Settings */}
        {activeSection === 'settings' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm mb-10">
              <h3 className="font-serif text-3xl font-bold text-slate-900 mb-8">Upload New Background</h3>
              
              <div className="flex flex-col gap-6">
                
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Slide Image</label>
                  
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      className="hidden"
                      onChange={async (e) => handleFileUpload(e, async (url) => {
                        if (newSlide.url && newSlide.url.includes('cloudinary.com')) {
                          await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(newSlide.url)}`, { method: 'DELETE' }).catch(console.error);
                        }
                        setNewSlide({...newSlide, url});
                      })}
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current.click()} 
                      disabled={isUploading}
                      className="px-6 py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-2xl transition-colors border border-emerald-100 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isUploading ? <span className="animate-spin text-xl">⏳</span> : <span className="text-xl">📷</span>}
                      {isUploading ? 'Uploading to Cloud...' : 'Select Photo'}
                    </button>

                    {newSlide.url && (
                      <div className="h-16 w-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm relative group">
                        <img src={newSlide.url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={async () => {
                            if (newSlide.url.includes('cloudinary.com')) {
                                await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(newSlide.url)}`, { method: 'DELETE' }).catch(console.error);
                            }
                            setNewSlide({...newSlide, url: ""});
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer border-none"
                        >
                          Remove ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Main Heading (Caption)</label>
                    <input 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                      placeholder="e.g., Explore HortiVerse" 
                      value={newSlide.caption} onChange={e => setNewSlide({...newSlide, caption: e.target.value})} 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Sub-text</label>
                    <input 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                      placeholder="e.g., The best agriculture hub" 
                      value={newSlide.sub_text} onChange={e => setNewSlide({...newSlide, sub_text: e.target.value})} 
                    />
                  </div>
                </div>
                
                <button onClick={addSlide} className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
                  + Add Slide to Homepage
                </button>
              </div>
            </div>
            
            <h3 className="font-serif text-3xl font-bold text-slate-900 mb-6">Active Slider Preview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {slides.map(s => (
                <div key={s.id} className="relative rounded-2xl overflow-hidden h-56 shadow-md group">
                  <img 
                    src={s.image_url} 
                    alt="Slider Background" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { 
                      if (!e.target.dataset.errorHandled) {
                        e.target.dataset.errorHandled = true;
                        e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Error"; 
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-5 flex flex-col justify-end">
                    <button onClick={() => deleteItem('slide', s.id)} className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Remove</button>
                    <h4 className="font-serif text-xl font-bold text-white leading-tight">{s.caption}</h4>
                    <p className="text-xs font-medium text-slate-300 mt-1">{s.sub_text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 🟢 EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200" onClick={handleCancelEdit}>
          <div className="modal-box bg-white w-full max-w-2xl rounded-[2rem] p-8 md:p-10 relative overflow-y-auto max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-8 duration-300 custom-scrollbar" onClick={e => e.stopPropagation()}>
            
            {/* Top-level Image Editor Popup for Topics */}
            {activeTopicImg && (
              <div className="absolute inset-0 z-[100000] bg-slate-900/40 backdrop-blur-[2px] flex justify-center items-center p-4 rounded-[2rem]">
                <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden animate-[popIn_0.2s_ease-out]">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h4 className="font-sans font-bold text-slate-800">
                      {activeTopicImg.isNew ? "Image Details" : "Edit Image"}
                    </h4>
                    <button type="button" onClick={() => setActiveTopicImg(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                  </div>
                  <div className="p-5">
                    <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden mb-4 border border-slate-200">
                       <img src={activeTopicImg.url} className="w-full h-full object-contain" alt="preview" />
                    </div>
                    <label className="block text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Image Description</label>
                    <input 
                      autoFocus
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[14px] focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                      value={activeTopicImg.desc} 
                      onChange={e => setActiveTopicImg({...activeTopicImg, desc: e.target.value})}
                      placeholder="e.g., Tomato Plant"
                    />
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                     {!activeTopicImg.isNew && (
                        <button type="button" onClick={() => handleRemoveTopicImage(activeTopicImg.oldCode, activeTopicImg.url)} className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors flex-1">
                           Remove
                        </button>
                     )}
                     <button type="button" onClick={handleSaveTopicImageContext} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors flex-1 shadow-sm">
                        {activeTopicImg.isNew ? "Insert Image" : "Save Changes"}
                     </button>
                  </div>
                </div>
              </div>
            )}

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-8">Edit Content</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Title / Label</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                  value={editingItem.data.title || editingItem.data.label || ""} 
                  onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.data.label ? 'label' : 'title']: e.target.value}})} 
                />
              </div>
              
              {editingItem.type === 'story' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Author</label>
                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={editingItem.data.author} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Cover Image</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="story-file-upload"
                        className="hidden"
                        onChange={async (e) => handleFileUpload(e, async (url) => {
                          if (editingItem.data.image_url && editingItem.data.image_url.includes('cloudinary.com')) {
                              await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(editingItem.data.image_url)}`, { method: 'DELETE' }).catch(console.error);
                          }
                          setEditingItem({...editingItem, data: {...editingItem.data, image_url: url}})
                        })}
                      />
                      <button 
                        type="button"
                        onClick={() => document.getElementById('story-file-upload').click()} 
                        disabled={isUploading}
                        className="px-6 py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-2xl transition-colors border border-emerald-100 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUploading ? '⏳ Uploading...' : '📷 Replace Photo'}
                      </button>
                      
                      {editingItem.data.image_url && (
                        <div className="h-16 w-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm relative group">
                          <img src={editingItem.data.image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={async () => {
                                if (editingItem.data.image_url.includes('cloudinary.com')) {
                                    await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(editingItem.data.image_url)}`, { method: 'DELETE' }).catch(console.error);
                                }
                                setEditingItem({...editingItem, data: {...editingItem.data, image_url: ""}})
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 flex justify-center items-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Story Content</label>
                    <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[150px]" value={editingItem.data.content} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} />
                  </div>
                </>
              )}

              {editingItem.type === 'topic' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Icon (Emoji)</label>
                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all mb-4 text-2xl" value={editingItem.data.icon} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, icon: e.target.value}})} />
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-2">
                      <span className="w-full text-xs font-bold text-slate-500 mb-2 block">Choose Quick Icon:</span>
                      {PREDEFINED_ICONS.map(icon => (
                        <button 
                          key={icon} type="button"
                          onClick={() => setEditingItem({...editingItem, data: {...editingItem.data, icon: icon}})}
                          className={`text-2xl p-2 rounded-xl transition-all border ${editingItem.data.icon === icon ? 'bg-emerald-100 border-emerald-400' : 'bg-transparent border-transparent hover:bg-slate-200'}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest">Description</label>
                      
                      <div>
                        <input type="file" id="adminTopicImgUpload" className="hidden" accept="image/*" onChange={handleTopicImageUpload} />
                        <label htmlFor="adminTopicImgUpload" className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
                          {isTopicUploading ? "⏳ Uploading..." : "🖼️ Insert Image"}
                        </label>
                      </div>
                    </div>
                    
                    <textarea 
                      id="admin-topic-desc"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[200px] font-mono" 
                      value={editingItem.data.description || ""} 
                      onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} 
                    />

                    {Object.keys(topicImageMap).length > 0 && (
                      <div className="mt-4">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Attached Images (Click to Edit)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {Object.entries(topicImageMap).map(([code, url]) => (
                            <div 
                              key={code} 
                              onClick={() => setActiveTopicImg({ url, desc: code.match(/\[🖼️ Attached: (.*?) #\d+\]/)[1], isNew: false, oldCode: code })}
                              className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 cursor-pointer h-20 transition-all hover:shadow-md hover:-translate-y-0.5"
                            >
                              <img src={url} alt="preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <span className="text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">Edit</span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur text-[10px] font-bold truncate px-2 py-0.5 text-slate-700 border-t border-slate-200">
                                 {code.match(/\[🖼️ Attached: (.*?) #\d+\]/)[1]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {editingItem.type === 'resource' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Resource File (PDF or Image)
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Accept BOTH images and PDFs */}
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        id="resource-file-upload"
                        className="hidden"
                        onChange={async (e) => handleFileUpload(e, async (url) => {
                          if (editingItem.data.drive_link && editingItem.data.drive_link.includes('cloudinary.com')) {
                              await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(editingItem.data.drive_link)}`, { method: 'DELETE' }).catch(console.error);
                          }
                          setEditingItem({...editingItem, data: {...editingItem.data, drive_link: url}})
                        })}
                      />
                      <button 
                        type="button"
                        onClick={() => document.getElementById('resource-file-upload').click()} 
                        disabled={isUploading}
                        className="px-6 py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-2xl transition-colors border border-emerald-100 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        {isUploading ? '⏳ Uploading...' : '📄 Upload File'}
                      </button>
                      
                      {/* Smart Preview Box for Resource File */}
                      {editingItem.data.drive_link && (
                        <div className="flex-1 flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-xl shrink-0">
                              {editingItem.data.drive_link.includes('.pdf') ? '📑' : ''}
                            </span>
                            <a 
                              href={editingItem.data.drive_link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline truncate block"
                            >
                              View Attached File
                            </a>
                          </div>
                          <button 
                            type="button" 
                            onClick={async () => {
                                if (editingItem.data.drive_link.includes('cloudinary.com')) {
                                    await fetch(`${API_BASE_URL}/api/admin/cloudinary/delete?url=${encodeURIComponent(editingItem.data.drive_link)}`, { method: 'DELETE' }).catch(console.error);
                                }
                                setEditingItem({...editingItem, data: {...editingItem.data, drive_link: ""}})
                            }}
                            className="text-slate-400 hover:text-red-500 font-bold text-lg ml-3"
                            title="Remove File"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-2">Allowed formats: PDF, JPEG, PNG, JPG; maximum PDF size: 4 MB; ensure files are clear and relevant.</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Author / Source</label>
                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={editingItem.data.author || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[100px]" value={editingItem.data.desc || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, desc: e.target.value}})} />
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-8 border-t border-slate-100">
                <button 
                  type="submit" 
                  className="flex-[2] whitespace-nowrap px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
                >
                  SAVE CHANGES
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  className="flex-1 whitespace-nowrap px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-2xl transition-all"
                >
                  CANCEL
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}