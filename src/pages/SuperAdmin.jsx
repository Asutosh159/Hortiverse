import { useState, useEffect } from "react";

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
  
  // 🟢 NEW: Advanced Slider State
  const [newSlide, setNewSlide] = useState({ url: "", caption: "", sub_text: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, stRes, tRes, rRes, sRes, slRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/users"),
        fetch("http://localhost:5000/api/stories"),
        fetch("http://localhost:5000/api/topics"),
        fetch("http://localhost:5000/api/resources"),
        fetch("http://localhost:5000/api/stats"),
        fetch("http://localhost:5000/api/slides")
      ]);

      const uData = await uRes.json();
      const stData = await stRes.json();
      const tData = await tRes.json();
      const rData = await rRes.json();
      const sData = await sRes.json();
      const slData = await slRes.json();

      setUsers(uData || []);
      setStories(stData || []);
      setTopics(tData || []);
      setResources(rData || []);
      setSlides(slData || []);
      
      setStats({
        users: uData.length,
        stories: stData.length,
        topics: tData.length,
        resources: rData.length
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    const res = await fetch(`http://localhost:5000/api/admin/${type}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { type, data } = editingItem;
    // 🟢 FIXED: Ensures "story" becomes "stories", "topic" becomes "topics"
    const endpoint = type === 'story' ? 'stories' : type === 'topic' ? 'topics' : 'resources';
    
    const res = await fetch(`http://localhost:5000/api/admin/${endpoint}/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) { setEditingItem(null); fetchData(); }
  };

  const addSlide = async () => {
    if(!newSlide.url.trim()) return alert("Please enter an image URL first!");
    
    const res = await fetch("http://localhost:5000/api/slides", {
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
      alert("Failed to add slide. Ensure your database table is set up.");
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
        
        .sidebar { width: 280px; background: #ffffff; border-right: 1px solid #e2e8f0; padding: 40px 24px; position: fixed; top: 72px; bottom: 0; z-index: 10; display: flex; flex-direction: column; gap: 8px; }
        .nav-item { padding: 14px 20px; border-radius: 12px; color: #64748b; cursor: pointer; transition: all 0.2s ease; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; }
        .nav-item:hover { background: #f1f5f9; color: #0f172a; }
        .nav-item.active { background: #ecfdf5; color: #059669; font-weight: 700; }
        
        .main-content { margin-left: 280px; padding: 60px; flex: 1; background: #f8faf9; min-height: 100vh; }
        
        /* 🟢 COLORFUL STAT CARDS */
        .stat-card { border-radius: 24px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); color: white; position: relative; overflow: hidden; transition: transform 0.2s ease; }
        .stat-card:hover { transform: translateY(-4px); }
        .bg-users { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); }
        .bg-stories { background: linear-gradient(135deg, #E11D48 0%, #db2777 100%); }
        .bg-topics { background: linear-gradient(135deg, #059669 0%, #10B981 100%); }
        .bg-resources { background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); }
        
        table { width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; margin-top: 20px; }
        th { text-align: left; padding: 18px 24px; background: #f8faf9; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0; letter-spacing: 0.5px; }
        td { padding: 18px 24px; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .badge { display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
        .badge-admin { background: #ecfdf5; color: #059669; }
        .badge-user { background: #f1f5f9; color: #64748b; }
        
        .btn-act { padding: 8px 16px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; font-size: 13px; margin-right: 8px; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-edit { background: #eff6ff; color: #2563eb; }
        .btn-edit:hover { background: #dbeafe; }
        .btn-del { background: #fef2f2; color: #dc2626; }
        .btn-del:hover { background: #fee2e2; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .edit-card { background: #ffffff; width: 100%; max-width: 650px; border-radius: 24px; padding: 48px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        
        .form-label { display: block; font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
        .form-input { width: 100%; padding: 14px 18px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #0f172a; transition: border-color 0.2s; outline: none; }
        .form-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }
        
        /* 🟢 BEAUTIFUL SLIDER PREVIEW */
        .slide-preview { position: relative; border-radius: 16px; overflow: hidden; height: 180px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .slide-preview img { width: 100%; height: 100%; object-fit: cover; }
        .slide-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; }
        .slide-del-btn { position: absolute; top: 12px; right: 12px; background: rgba(220,38,38,0.9); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; backdrop-filter: blur(4px); }
      `}</style>

      <aside className="sidebar">
        <div style={{ padding: "0 20px 20px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
          <h2 className="fr" style={{ color: "#0f172a", fontSize: 24, margin: 0 }}>SuperAdmin<span style={{ color: "#059669" }}>Center</span></h2>
          <p className="jk" style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>HortiVerse Admin</p>
        </div>
        
        <div className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>📊 Overview</div>
        <div className={`nav-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')}>👥 Users Registry</div>
        <div className={`nav-item ${activeSection === 'stories' ? 'active' : ''}`} onClick={() => setActiveSection('stories')}>✍️ Stories Manager</div>
        <div className={`nav-item ${activeSection === 'topics' ? 'active' : ''}`} onClick={() => setActiveSection('topics')}>🌿 Knowledge Hub</div>
        <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => setActiveSection('resources')}>📚 Resource Library</div>
        <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>🖼️ Slider Manager</div>
      </aside>

      <main className="main-content">
        <div style={{ marginBottom: 40 }}>
          <h1 className="fr" style={{ color: '#0f172a', fontSize: 40, margin: 0 }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </div>

        {activeSection === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
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
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                  <td><button className="btn-act btn-del" onClick={() => deleteItem('user', u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🟢 FIXED: Safe Delete Mapping */}
        {['stories', 'topics', 'resources'].includes(activeSection) && (
          <table>
            <thead><tr><th>Content Title</th><th>Actions</th></tr></thead>
            <tbody>
              {(activeSection === 'stories' ? stories : activeSection === 'topics' ? topics : resources).map(item => {
                // Properly convert plural to singular for the delete route
                const itemType = activeSection === 'stories' ? 'story' : activeSection === 'topics' ? 'topic' : 'resource';
                
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.title || item.label}</td>
                    <td>
                      <button className="btn-act btn-edit" onClick={() => setEditingItem({ type: itemType, data: item })}>Edit</button>
                      <button className="btn-act btn-del" onClick={() => deleteItem(itemType, item.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 🟢 NEW: Enhanced Slider UI */}
        {activeSection === 'settings' && (
          <div>
            <div style={{ background: '#ffffff', padding: 32, borderRadius: 24, boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: 40 }}>
              <h3 className="fr" style={{ color: '#0f172a', fontSize: 24, marginTop: 0, marginBottom: 24 }}>Upload New Background</h3>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 2 }}>
                  <label className="form-label" style={{ marginTop: 0 }}>Image URL (Direct Link)</label>
                  <input className="form-input" placeholder="https://images.unsplash.com/..." value={newSlide.url} onChange={e => setNewSlide({...newSlide, url: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ marginTop: 0 }}>Main Heading (Caption)</label>
                  <input className="form-input" placeholder="e.g., Explore HortiVerse" value={newSlide.caption} onChange={e => setNewSlide({...newSlide, caption: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ marginTop: 0 }}>Sub-text</label>
                  <input className="form-input" placeholder="e.g., The best agriculture hub" value={newSlide.sub_text} onChange={e => setNewSlide({...newSlide, sub_text: e.target.value})} />
                </div>
              </div>
              
              <button 
                onClick={addSlide} 
                style={{ marginTop: 16, width: '100%', padding: '16px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}
              >
                + Add Slide to Homepage
              </button>
            </div>

            <h3 className="fr" style={{ fontSize: 24, marginBottom: 20 , color:"black"}}>Active Slider Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {slides.map(s => (
                <div key={s.id} className="slide-preview">
                  <img src={s.image_url} alt="Slider Background" />
                  <div className="slide-overlay">
                    <button className="slide-del-btn" onClick={() => deleteItem('slide', s.id)}>Remove Slide</button>
                    <h4 className="fr" style={{ color: 'white', fontSize: 22, margin: 0 }}>{s.caption}</h4>
                    <p className="jk" style={{ color: '#e2e8f0', fontSize: 13, margin: '4px 0 0' }}>{s.sub_text}</p>
                  </div>
                </div>
              ))}
              {slides.length === 0 && <p style={{ color: '#64748b' }}>No slides added yet.</p>}
            </div>
          </div>
        )}
      </main>

      {/* 🟢 EDIT MODAL */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="edit-card">
            <h2 className="fr" style={{ fontSize: 32, color: '#0f172a', marginTop: 0, marginBottom: 32 }}>Edit Content</h2>
            <form onSubmit={handleUpdate}>
              <label className="form-label">Title / Label</label>
              <input 
                className="form-input" 
                value={editingItem.data.title || editingItem.data.label || ""} 
                onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.data.label ? 'label' : 'title']: e.target.value}})} 
              />
              
              {editingItem.type === 'story' && (
                <>
                  <label className="form-label">Author</label>
                  <input className="form-input" value={editingItem.data.author} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  <label className="form-label">Story Content</label>
                  <textarea className="form-input" rows="6" value={editingItem.data.content} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} />
                </>
              )}

              {editingItem.type === 'topic' && (
                <>
                  <label className="form-label">Icon (Emoji)</label>
                  <input className="form-input" value={editingItem.data.icon} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, icon: e.target.value}})} />
                  <label className="form-label">Description (Skeleton Structure)</label>
                  <textarea className="form-input" rows="6" value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} style={{ fontFamily: 'monospace', fontSize: 13 }} />
                </>
              )}

              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <button type="submit" style={{ flex: 2, padding: 16, background: '#059669', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingItem(null)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                  Cancel
                </button>
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