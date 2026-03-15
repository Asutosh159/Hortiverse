import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect } from "react";

// 🟢 Helper Function for Drive Links
const getDirectImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x260?text=HortiVerse"; 

  if (url.includes("drive.google.com")) {
    let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/); 
    if (!match) match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/); 
    
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
  }
  return url;
};

// Predefined Sticker Library
const PREDEFINED_ICONS = ["🌿", "🌱", "🌾", "🚜", "💧", "🌻", "🍎", "🍅", "🌳", "🔬", "🐛", "☀️", "🌧️", "👨‍🌾", "👩‍🌾", "🪴"];

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
  
  // 🟢 State to control mobile sidebar drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    } catch (err) { 
      console.error("Fetch failed:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    const res = await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { type, data } = editingItem;
    
    let endpoint = 'resources';
    if (type === 'story') endpoint = 'stories';
    if (type === 'topic') endpoint = 'topics';
    
    const res = await fetch(`${API_BASE_URL}/api/admin/${endpoint}/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) { 
      setEditingItem(null); 
      fetchData(); 
    } else {
      alert("Update failed. Check your server logs.");
    }
  };

  const addSlide = async () => {
    if(!newSlide.url.trim()) return alert("Please enter an image URL first!");
    
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
    <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background:'#f8faf9', color:'#0f172a' }}>
      <h2 className="fr" style={{ fontSize: 24 }}>Accessing Command Center...</h2>
    </div>
  );

  return (
    <div style={styles.dashboardWrapper}>
      <style>{`
        .fr { font-family: 'Fraunces', serif; }
        .jk { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .sidebar { width: 280px; background: #ffffff; border-right: 1px solid #e2e8f0; padding: 40px 24px; position: fixed; top: 0; bottom: 0; z-index: 10000; display: flex; flex-direction: column; gap: 8px; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-item { padding: 14px 20px; border-radius: 12px; color: #64748b; cursor: pointer; transition: all 0.2s ease; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; display: flex; align-items: center; gap: 12px; }
        .nav-item:hover { background: #f1f5f9; color: #0f172a; }
        .nav-item.active { background: #ecfdf5; color: #059669; font-weight: 700; }
        
        .main-content { margin-left: 280px; padding: 120px 40px 60px; flex: 1; background: #f8faf9; min-height: 100vh; transition: margin 0.3s ease; }
        
        .stat-card { border-radius: 24px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); color: white; position: relative; overflow: hidden; transition: transform 0.2s ease; }
        .stat-card:hover { transform: translateY(-4px); }
        .bg-users { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); }
        .bg-stories { background: linear-gradient(135deg, #E11D48 0%, #db2777 100%); }
        .bg-topics { background: linear-gradient(135deg, #059669 0%, #10B981 100%); }
        .bg-resources { background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); }
        
        /* 🟢 FIXED: Table wrapper forced to block with touch-scrolling */
        .table-responsive { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; border: 1px solid #e2e8f0; background: white; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; min-width: 500px; }
        th { text-align: left; padding: 18px 24px; background: #f8faf9; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0; letter-spacing: 0.5px; white-space: nowrap; }
        td { padding: 18px 24px; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .badge { display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
        .badge-admin { background: #ecfdf5; color: #059669; }
        .badge-user { background: #f1f5f9; color: #64748b; }
        
        .btn-act { padding: 8px 16px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; font-size: 13px; margin-right: 8px; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; }
        .btn-edit { background: #eff6ff; color: #2563eb; }
        .btn-del { background: #fef2f2; color: #dc2626; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .edit-card { background: #ffffff; width: 100%; max-width: 650px; border-radius: 24px; padding: 40px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        
        .form-label { display: block; font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
        .form-input { width: 100%; padding: 14px 18px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #0f172a; transition: border-color 0.2s; outline: none; }
        
        .slide-preview { position: relative; border-radius: 16px; overflow: hidden; height: 180px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .slide-preview img { width: 100%; height: 100%; object-fit: cover; }
        .slide-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; }
        .slide-del-btn { position: absolute; top: 12px; right: 12px; background: rgba(220,38,38,0.9); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; }

        .mobile-toggle { display: none; position: fixed; bottom: 30px; right: 20px; width: 56px; height: 56px; border-radius: 18px; background: #059669; color: white; border: none; box-shadow: 0 10px 25px rgba(5,150,105,0.4); z-index: 100001; cursor: pointer; font-size: 24px; align-items: center; justify-content: center; transition: transform 0.2s ease; }

        @media (max-width: 1024px) {
          .sidebar { transform: translateX(${isSidebarOpen ? '0' : '-100%'}); box-shadow: 20px 0 50px rgba(0,0,0,0.1); padding-top: 40px; }
          .sidebar-header h2 { font-size: 18px !important; }
          /* 🟢 FIXED: overflow-x hidden on main container ensures table scroll works */
          .main-content { margin-left: 0; padding: 120px 20px 40px; width: 100vw; max-width: 100vw; overflow-x: hidden; }
          .mobile-toggle { display: flex; }
          .edit-card { padding: 24px; }
        }

        @media (max-width: 640px) {
          .stat-card { padding: 20px; }
          .stat-card div:last-child { font-size: 32px; }
          .fr { font-size: 30px !important; }
          
          /* 🟢 FIXED: Reduce padding in mobile table to make swiping easier */
          th { padding: 12px 16px; font-size: 11px; }
          td { padding: 12px 16px; font-size: 13.5px; }
          .btn-act { padding: 6px 12px; font-size: 12px; }
        }
      `}</style>

      {/* Mobile Menu Button (Bottom Right) */}
      <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', zIndex: 9999 }}
        />
      )}

      <aside className="sidebar">
        <div className="sidebar-header" style={{ padding: "0 10px 20px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
          <h2 className="fr" style={{ color: "#0f172a", fontSize: 24, margin: 0 }}>SuperAdmin<span style={{ color: "#059669" }}>Center</span></h2>
          <p className="jk" style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>HortiVerse Admin</p>
        </div>
        
        <div className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => { setActiveSection('overview'); setIsSidebarOpen(false); }}>📊 Dashboard</div>
        <div className={`nav-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => { setActiveSection('users'); setIsSidebarOpen(false); }}>👥 Users Registry</div>
        <div className={`nav-item ${activeSection === 'stories' ? 'active' : ''}`} onClick={() => { setActiveSection('stories'); setIsSidebarOpen(false); }}>✍️ Stories Manager</div>
        <div className={`nav-item ${activeSection === 'topics' ? 'active' : ''}`} onClick={() => { setActiveSection('topics'); setIsSidebarOpen(false); }}>🌿 Knowledge Hub</div>
        <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => { setActiveSection('resources'); setIsSidebarOpen(false); }}>📚 Resource Library</div>
        <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => { setActiveSection('settings'); setIsSidebarOpen(false); }}>🖼️ Slider Manager</div>
      </aside>

      <main className="main-content">
        <div style={{ marginBottom: 40 }}>
          <h1 className="fr" style={{ color: '#0f172a', fontSize: "clamp(32px, 5vw, 40px)", margin: 0 }}>
            {activeSection === 'overview' ? 'Dashboard' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </div>

        {activeSection === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <div className="stat-card bg-users">
              <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>TOTAL USERS</div>
              <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.users}</div>
            </div>
            <div className="stat-card bg-stories">
              <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>STORIES PUBLISHED</div>
              <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.stories}</div>
            </div>
            <div className="stat-card bg-topics">
              <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>KNOWLEDGE TOPICS</div>
              <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.topics}</div>
            </div>
            <div className="stat-card bg-resources">
              <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>RESOURCES</div>
              <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.resources}</div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="table-responsive">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ background: u.role === 'admin' ? '#ecfdf5' : '#f1f5f9', color: u.role === 'admin' ? '#059669' : '#64748b', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '800' }}>{u.role}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}><button className="btn-act btn-del" onClick={() => deleteItem('user', u.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {['stories', 'topics', 'resources'].includes(activeSection) && (
          <div className="table-responsive">
            <table>
              <thead><tr><th>Content Title</th><th>Actions</th></tr></thead>
              <tbody>
                {(activeSection === 'stories' ? stories : activeSection === 'topics' ? topics : resources).map(item => {
                  const itemType = activeSection === 'stories' ? 'story' : activeSection === 'topics' ? 'topic' : 'resource';
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.title || item.label}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn-act btn-edit" onClick={() => setEditingItem({ type: itemType, data: item })}>Edit</button>
                        <button className="btn-act btn-del" onClick={() => deleteItem(itemType, item.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <div style={{ background: '#ffffff', padding: "clamp(20px, 5vw, 32px)", borderRadius: 24, boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: 40 }}>
              <h3 className="fr" style={{ color: '#0f172a', fontSize: 24, marginTop: 0, marginBottom: 24 }}>Upload New Background</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ marginTop: 0 }}>Image URL (Direct Link)</label>
                  <input className="form-input" placeholder="https://images.unsplash.com/..." value={newSlide.url} onChange={e => setNewSlide({...newSlide, url: e.target.value})} />
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:"#64748b", marginTop:6, fontWeight:500 }}>
                    💡 Works with direct image URLs (.jpg, .png) or public Google Drive links.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 250px' }}>
                    <label className="form-label" style={{ marginTop: 0 }}>Main Heading (Caption)</label>
                    <input className="form-input" placeholder="e.g., Explore HortiVerse" value={newSlide.caption} onChange={e => setNewSlide({...newSlide, caption: e.target.value})} />
                  </div>
                  <div style={{ flex: '1 1 250px' }}>
                    <label className="form-label" style={{ marginTop: 0 }}>Sub-text</label>
                    <input className="form-input" placeholder="e.g., The best agriculture hub" value={newSlide.sub_text} onChange={e => setNewSlide({...newSlide, sub_text: e.target.value})} />
                  </div>
                </div>
                
                <button onClick={addSlide} style={{ marginTop: 8, width: '100%', padding: '16px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 25px rgba(5,150,105,0.3)' }}>+ Add Slide to Homepage</button>
              </div>
            </div>
            
            <h3 className="fr" style={{ fontSize: 24, marginBottom: 20 , color:"black"}}>Active Slider Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {slides.map(s => (
                <div key={s.id} className="slide-preview">
                  <img 
                    src={getDirectImageUrl(s.image_url)} 
                    alt="Slider Background" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x260?text=Preview+Not+Available"; }}
                  />
                  <div className="slide-overlay">
                    <button className="slide-del-btn" onClick={() => deleteItem('slide', s.id)}>Remove Slide</button>
                    <h4 className="fr" style={{ color: 'white', fontSize: 20, margin: 0 }}>{s.caption}</h4>
                    <p className="jk" style={{ color: '#e2e8f0', fontSize: 12, margin: '4px 0 0' }}>{s.sub_text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 🟢 EDIT MODAL */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="edit-card" onClick={e => e.stopPropagation()}>
            <h2 className="fr" style={{ fontSize: 32, color: '#0f172a', marginTop: 0, marginBottom: 32 }}>Edit Content</h2>
            <form onSubmit={handleUpdate}>
              
              <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Title / Label</label>
              <input className="form-input" value={editingItem.data.title || editingItem.data.label || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.data.label ? 'label' : 'title']: e.target.value}})} />
              
              {editingItem.type === 'story' && (
                <>
                  <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Author</label>
                  <input className="form-input" value={editingItem.data.author} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  
                  <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Image URL</label>
                  <input className="form-input" value={editingItem.data.image_url || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, image_url: e.target.value}})} />
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:"#64748b", marginTop:4, fontWeight:500 }}>
                    💡 Works with direct image URLs or public Drive links.
                  </p>

                  <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Story Content</label>
                  <textarea className="form-input" rows="6" value={editingItem.data.content} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} />
                </>
              )}

              {editingItem.type === 'topic' && (
                <>
                  <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Icon (Emoji)</label>
                  <input className="form-input" style={{ marginBottom: '8px' }} value={editingItem.data.icon} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, icon: e.target.value}})} />
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#f8faf9', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <span style={{ width: '100%', fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px', fontFamily: 'Plus Jakarta Sans' }}>Choose Icon:</span>
                    {PREDEFINED_ICONS.map(icon => (
                      <div 
                        key={icon}
                        className="sticker-btn"
                        onClick={() => setEditingItem({...editingItem, data: {...editingItem.data, icon: icon}})}
                        style={{
                          fontSize: '24px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px',
                          background: editingItem.data.icon === icon ? '#dcfce7' : 'transparent',
                          border: editingItem.data.icon === icon ? '1px solid #10b981' : '1px solid transparent',
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>

                  <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Description</label>
                  <textarea className="form-input" rows="6" value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} />
                </>
              )}

              {editingItem.type === 'resource' && (
                <>
                  <label className="form-label">Google Drive Link</label>
                  <input className="form-input" value={editingItem.data.drive_link || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, drive_link: e.target.value}})} />
                  
                  <label className="form-label">Author / Source</label>
                  <input className="form-input" value={editingItem.data.author || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="4" value={editingItem.data.desc || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, desc: e.target.value}})} />
                </>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <button type="submit" style={{ flex: '2 1 150px', padding: 16, background: '#059669', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save Changes</button>
                <button type="button" onClick={() => setEditingItem(null)} style={{ flex: '1 1 100px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  dashboardWrapper: { display: 'flex', minHeight: '100vh', background: '#f8faf9' }
};