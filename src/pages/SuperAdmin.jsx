// import { API_BASE_URL } from '../apiConfig';
// import { useState, useEffect } from "react";

// // 🟢 Helper Function for Drive Links
// const getDirectImageUrl = (url) => {
//   if (!url) return "https://via.placeholder.com/400x260?text=HortiVerse"; 

//   if (url.includes("drive.google.com")) {
//     let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/); 
//     if (!match) match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/); 
    
//     if (match && match[1]) {
//       return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
//     }
//   }
//   return url;
// };

// // Predefined Sticker Library
// const PREDEFINED_ICONS = ["🌿", "🌱", "🌾", "🚜", "💧", "🌻", "🍎", "🍅", "🌳", "🔬", "🐛", "☀️", "🌧️", "👨‍🌾", "👩‍🌾", "🪴"];

// export default function SuperAdmin() {
//   const [stats, setStats] = useState({ users: 0, stories: 0, topics: 0, resources: 0 });
//   const [users, setUsers] = useState([]);
//   const [stories, setStories] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [slides, setSlides] = useState([]);
//   const [activeSection, setActiveSection] = useState("overview"); 
//   const [loading, setLoading] = useState(true);
//   const [editingItem, setEditingItem] = useState(null); 
//   const [newSlide, setNewSlide] = useState({ url: "", caption: "", sub_text: "" });
  
//   // 🟢 State to control mobile sidebar drawer
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => { fetchData(); }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [uRes, stRes, tRes, rRes, sRes, slRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/admin/users`),
//         fetch(`${API_BASE_URL}/api/stories`), 
//         fetch(`${API_BASE_URL}/api/topics`),  
//         fetch(`${API_BASE_URL}/api/resources`),
//         fetch(`${API_BASE_URL}/api/stats`),
//         fetch(`${API_BASE_URL}/api/slides`)
//       ]);

//       const uData = uRes.ok ? await uRes.json() : [];
//       const stData = stRes.ok ? await stRes.json() : [];
//       const tData = tRes.ok ? await tRes.json() : [];
//       const rData = rRes.ok ? await rRes.json() : [];
//       const sData = sRes.ok ? await sRes.json() : { users: 0, stories: 0, topics: 0, resources: 0 };
//       const slData = slRes.ok ? await slRes.json() : [];

//       setUsers(uData);
//       setStories(stData);
//       setTopics(tData);
//       setResources(rData);
//       setSlides(slData);
      
//       setStats({
//         users: sData.users || uData.length,
//         stories: sData.stories || stData.length,
//         topics: sData.topics || tData.length,
//         resources: sData.resources || rData.length
//       });
//     } catch (err) { 
//       console.error("Fetch failed:", err); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   const deleteItem = async (type, id) => {
//     if (!window.confirm(`Delete this ${type}?`)) return;
//     const res = await fetch(`${API_BASE_URL}/api/admin/${type}/${id}`, { method: 'DELETE' });
//     if (res.ok) fetchData();
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     const { type, data } = editingItem;
    
//     let endpoint = 'resources';
//     if (type === 'story') endpoint = 'stories';
//     if (type === 'topic') endpoint = 'topics';
    
//     const res = await fetch(`${API_BASE_URL}/api/admin/${endpoint}/${data.id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });

//     if (res.ok) { 
//       setEditingItem(null); 
//       fetchData(); 
//     } else {
//       alert("Update failed. Check your server logs.");
//     }
//   };

//   const addSlide = async () => {
//     if(!newSlide.url.trim()) return alert("Please enter an image URL first!");
    
//     const res = await fetch(`${API_BASE_URL}/api/slides`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         image_url: newSlide.url.trim(), 
//         caption: newSlide.caption.trim() || "Explore HortiVerse", 
//         sub_text: newSlide.sub_text.trim() || "Agricultural Knowledge Hub" 
//       })
//     });
//     if (res.ok) { 
//       setNewSlide({ url: "", caption: "", sub_text: "" }); 
//       fetchData(); 
//     } else {
//       alert("Failed to add slide.");
//     }
//   };

//   if (loading) return (
//     <div style={{ display:'flex', height:'100vh', alignItems:'center', justify: 'center', background:'#f8faf9', color:'#0f172a' }}>
//       <h2 className="fr" style={{ fontSize: 24 }}>Accessing Command Center...</h2>
//     </div>
//   );

//   return (
//     <div style={styles.dashboardWrapper}>
//       <style>{`
//         .fr { font-family: 'Fraunces', serif; }
//         .jk { font-family: 'Plus Jakarta Sans', sans-serif; }
        
//         /* 🟢 FIXED: Changed top: 0 to top: 80px to sit below the Navbar */
//         .sidebar { width: 280px; background: #ffffff; border-right: 1px solid #e2e8f0; padding: 40px 24px; position: fixed; top: 80px; bottom: 0; z-index: 1000; display: flex; flex-direction: column; gap: 8px; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
//         .nav-item { padding: 14px 20px; border-radius: 12px; color: #64748b; cursor: pointer; transition: all 0.2s ease; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; display: flex; align-items: center; gap: 12px; }
//         .nav-item:hover { background: #f1f5f9; color: #0f172a; }
//         .nav-item.active { background: #ecfdf5; color: #059669; font-weight: 700; }
        
//         .main-content { margin-left: 280px; padding: 120px 40px 60px; flex: 1; background: #f8faf9; min-height: 100vh; transition: margin 0.3s ease; }
        
//         .stat-card { border-radius: 24px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); color: white; position: relative; overflow: hidden; transition: transform 0.2s ease; }
//         .stat-card:hover { transform: translateY(-4px); }
//         .bg-users { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); }
//         .bg-stories { background: linear-gradient(135deg, #E11D48 0%, #db2777 100%); }
//         .bg-topics { background: linear-gradient(135deg, #059669 0%, #10B981 100%); }
//         .bg-resources { background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); }
        
//         .table-responsive { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; border: 1px solid #e2e8f0; background: white; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
//         table { width: 100%; border-collapse: collapse; min-width: 500px; }
//         th { text-align: left; padding: 18px 24px; background: #f8faf9; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0; letter-spacing: 0.5px; white-space: nowrap; }
//         td { padding: 18px 24px; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; }
        
//         .badge { display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
//         .badge-admin { background: #ecfdf5; color: #059669; }
//         .badge-user { background: #f1f5f9; color: #64748b; }
        
//         .btn-act { padding: 8px 16px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; font-size: 13px; margin-right: 8px; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; }
//         .btn-edit { background: #eff6ff; color: #2563eb; }
//         .btn-del { background: #fef2f2; color: #dc2626; }
        
//         .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; }
//         .edit-card { background: #ffffff; width: 100%; max-width: 650px; border-radius: 24px; padding: 40px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        
//         .form-label { display: block; font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
//         .form-input { width: 100%; padding: 14px 18px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #0f172a; transition: border-color 0.2s; outline: none; }
        
//         .slide-preview { position: relative; border-radius: 16px; overflow: hidden; height: 180px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
//         .slide-preview img { width: 100%; height: 100%; object-fit: cover; }
//         .slide-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; }
//         .slide-del-btn { position: absolute; top: 12px; right: 12px; background: rgba(220,38,38,0.9); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; }

//         .mobile-toggle { display: none; position: fixed; bottom: 30px; right: 20px; width: 56px; height: 56px; border-radius: 18px; background: #059669; color: white; border: none; box-shadow: 0 10px 25px rgba(5,150,105,0.4); z-index: 100001; cursor: pointer; font-size: 24px; align-items: center; justify-content: center; transition: transform 0.2s ease; }

//         @media (max-width: 1024px) {
//           .sidebar { transform: translateX(${isSidebarOpen ? '0' : '-100%'}); box-shadow: 20px 0 50px rgba(0,0,0,0.1); padding-top: 40px; }
//           .sidebar-header h2 { font-size: 18px !important; }
//           .main-content { margin-left: 0; padding: 120px 20px 40px; width: 100vw; max-width: 100vw; overflow-x: hidden; }
//           .mobile-toggle { display: flex; }
//           .edit-card { padding: 24px; }
//         }

//         @media (max-width: 640px) {
//           .stat-card { padding: 20px; }
//           .stat-card div:last-child { font-size: 32px; }
//           .fr { font-size: 30px !important; }
          
//           th { padding: 12px 16px; font-size: 11px; }
//           td { padding: 12px 16px; font-size: 13.5px; }
//           .btn-act { padding: 6px 12px; font-size: 12px; }
//         }
//       `}</style>

//       {/* Mobile Menu Button (Bottom Right) */}
//       <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//         {isSidebarOpen ? '✕' : '☰'}
//       </button>

//       {/* Overlay for mobile sidebar */}
//       {isSidebarOpen && (
//         <div 
//           onClick={() => setIsSidebarOpen(false)}
//           style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', zIndex: 999 }}
//         />
//       )}

//       <aside className="sidebar">
//         <div className="sidebar-header" style={{ padding: "0 10px 20px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
//           <h2 className="fr" style={{ color: "#0f172a", fontSize: 24, margin: 0 }}>SuperAdmin<span style={{ color: "#059669" }}>Center</span></h2>
//           <p className="jk" style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>HortiVerse Admin</p>
//         </div>
        
//         <div className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => { setActiveSection('overview'); setIsSidebarOpen(false); }}>📊 Dashboard</div>
//         <div className={`nav-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => { setActiveSection('users'); setIsSidebarOpen(false); }}>👥 Users Registry</div>
//         <div className={`nav-item ${activeSection === 'stories' ? 'active' : ''}`} onClick={() => { setActiveSection('stories'); setIsSidebarOpen(false); }}>✍️ Stories Manager</div>
//         <div className={`nav-item ${activeSection === 'topics' ? 'active' : ''}`} onClick={() => { setActiveSection('topics'); setIsSidebarOpen(false); }}>🌿 Knowledge Hub</div>
//         <div className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => { setActiveSection('resources'); setIsSidebarOpen(false); }}>📚 Resource Library</div>
//         <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => { setActiveSection('settings'); setIsSidebarOpen(false); }}>🖼️ Slider Manager</div>
//       </aside>

//       <main className="main-content">
//         <div style={{ marginBottom: 40 }}>
//           <h1 className="fr" style={{ color: '#0f172a', fontSize: "clamp(32px, 5vw, 40px)", margin: 0 }}>
//             {activeSection === 'overview' ? 'Dashboard' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
//           </h1>
//         </div>

//         {activeSection === 'overview' && (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
//             <div className="stat-card bg-users">
//               <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>TOTAL USERS</div>
//               <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.users}</div>
//             </div>
//             <div className="stat-card bg-stories">
//               <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>STORIES PUBLISHED</div>
//               <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.stories}</div>
//             </div>
//             <div className="stat-card bg-topics">
//               <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>KNOWLEDGE TOPICS</div>
//               <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.topics}</div>
//             </div>
//             <div className="stat-card bg-resources">
//               <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>RESOURCES</div>
//               <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{stats.resources}</div>
//             </div>
//           </div>
//         )}

//         {activeSection === 'users' && (
//           <div className="table-responsive">
//             <table>
//               <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {users.map(u => (
//                   <tr key={u.id}>
//                     <td style={{ fontWeight: 700, color: '#0f172a' }}>{u.full_name}</td>
//                     <td>{u.email}</td>
//                     <td><span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ background: u.role === 'admin' ? '#ecfdf5' : '#f1f5f9', color: u.role === 'admin' ? '#059669' : '#64748b', padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '800' }}>{u.role}</span></td>
//                     <td style={{ whiteSpace: 'nowrap' }}><button className="btn-act btn-del" onClick={() => deleteItem('user', u.id)}>Delete</button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {['stories', 'topics', 'resources'].includes(activeSection) && (
//           <div className="table-responsive">
//             <table>
//               <thead><tr><th>Content Title</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {(activeSection === 'stories' ? stories : activeSection === 'topics' ? topics : resources).map(item => {
//                   const itemType = activeSection === 'stories' ? 'story' : activeSection === 'topics' ? 'topic' : 'resource';
//                   return (
//                     <tr key={item.id}>
//                       <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.title || item.label}</td>
//                       <td style={{ whiteSpace: 'nowrap' }}>
//                         <button className="btn-act btn-edit" onClick={() => setEditingItem({ type: itemType, data: item })}>Edit</button>
//                         <button className="btn-act btn-del" onClick={() => deleteItem(itemType, item.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activeSection === 'settings' && (
//           <div>
//             <div style={{ background: '#ffffff', padding: "clamp(20px, 5vw, 32px)", borderRadius: 24, boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: 40 }}>
//               <h3 className="fr" style={{ color: '#0f172a', fontSize: 24, marginTop: 0, marginBottom: 24 }}>Upload New Background</h3>
              
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                 <div>
//                   <label className="form-label" style={{ marginTop: 0 }}>Image URL (Direct Link)</label>
//                   <input className="form-input" placeholder="https://images.unsplash.com/..." value={newSlide.url} onChange={e => setNewSlide({...newSlide, url: e.target.value})} />
//                   <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:"#64748b", marginTop:6, fontWeight:500 }}>
//                     💡 Works with direct image URLs (.jpg, .png) or public Google Drive links.
//                   </p>
//                 </div>

//                 <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//                   <div style={{ flex: '1 1 250px' }}>
//                     <label className="form-label" style={{ marginTop: 0 }}>Main Heading (Caption)</label>
//                     <input className="form-input" placeholder="e.g., Explore HortiVerse" value={newSlide.caption} onChange={e => setNewSlide({...newSlide, caption: e.target.value})} />
//                   </div>
//                   <div style={{ flex: '1 1 250px' }}>
//                     <label className="form-label" style={{ marginTop: 0 }}>Sub-text</label>
//                     <input className="form-input" placeholder="e.g., The best agriculture hub" value={newSlide.sub_text} onChange={e => setNewSlide({...newSlide, sub_text: e.target.value})} />
//                   </div>
//                 </div>
                
//                 <button onClick={addSlide} style={{ marginTop: 8, width: '100%', padding: '16px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 25px rgba(5,150,105,0.3)' }}>+ Add Slide to Homepage</button>
//               </div>
//             </div>
            
//             <h3 className="fr" style={{ fontSize: 24, marginBottom: 20 , color:"black"}}>Active Slider Preview</h3>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
//               {slides.map(s => (
//                 <div key={s.id} className="slide-preview">
//                   <img 
//                     src={getDirectImageUrl(s.image_url)} 
//                     alt="Slider Background" 
//                     onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x260?text=Preview+Not+Available"; }}
//                   />
//                   <div className="slide-overlay">
//                     <button className="slide-del-btn" onClick={() => deleteItem('slide', s.id)}>Remove Slide</button>
//                     <h4 className="fr" style={{ color: 'white', fontSize: 20, margin: 0 }}>{s.caption}</h4>
//                     <p className="jk" style={{ color: '#e2e8f0', fontSize: 12, margin: '4px 0 0' }}>{s.sub_text}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>

//       {/* 🟢 EDIT MODAL */}
//       {editingItem && (
//         <div className="modal-overlay" onClick={() => setEditingItem(null)}>
//           <div className="edit-card" onClick={e => e.stopPropagation()}>
//             <h2 className="fr" style={{ fontSize: 32, color: '#0f172a', marginTop: 0, marginBottom: 32 }}>Edit Content</h2>
//             <form onSubmit={handleUpdate}>
              
//               <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Title / Label</label>
//               <input className="form-input" value={editingItem.data.title || editingItem.data.label || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.data.label ? 'label' : 'title']: e.target.value}})} />
              
//               {editingItem.type === 'story' && (
//                 <>
//                   <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Author</label>
//                   <input className="form-input" value={editingItem.data.author} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  
//                   <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Image URL</label>
//                   <input className="form-input" value={editingItem.data.image_url || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, image_url: e.target.value}})} />
//                   <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:"#64748b", marginTop:4, fontWeight:500 }}>
//                     💡 Works with direct image URLs or public Drive links.
//                   </p>

//                   <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Story Content</label>
//                   <textarea className="form-input" rows="6" value={editingItem.data.content} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} />
//                 </>
//               )}

//               {editingItem.type === 'topic' && (
//                 <>
//                   <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Icon (Emoji)</label>
//                   <input className="form-input" style={{ marginBottom: '8px' }} value={editingItem.data.icon} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, icon: e.target.value}})} />
                  
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#f8faf9', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
//                     <span style={{ width: '100%', fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px', fontFamily: 'Plus Jakarta Sans' }}>Choose Icon:</span>
//                     {PREDEFINED_ICONS.map(icon => (
//                       <div 
//                         key={icon}
//                         className="sticker-btn"
//                         onClick={() => setEditingItem({...editingItem, data: {...editingItem.data, icon: icon}})}
//                         style={{
//                           fontSize: '24px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px',
//                           background: editingItem.data.icon === icon ? '#dcfce7' : 'transparent',
//                           border: editingItem.data.icon === icon ? '1px solid #10b981' : '1px solid transparent',
//                         }}
//                       >
//                         {icon}
//                       </div>
//                     ))}
//                   </div>

//                   <label className="form-label" style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', marginTop: '20px' }}>Description</label>
//                   <textarea className="form-input" rows="6" value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} />
//                 </>
//               )}

//               {editingItem.type === 'resource' && (
//                 <>
//                   <label className="form-label">Google Drive Link</label>
//                   <input className="form-input" value={editingItem.data.drive_link || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, drive_link: e.target.value}})} />
                  
//                   <label className="form-label">Author / Source</label>
//                   <input className="form-input" value={editingItem.data.author || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, author: e.target.value}})} />
                  
//                   <label className="form-label">Description</label>
//                   <textarea className="form-input" rows="4" value={editingItem.data.desc || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, desc: e.target.value}})} />
//                 </>
//               )}

//               <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
//                 <button type="submit" style={{ flex: '2 1 150px', padding: 16, background: '#059669', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save Changes</button>
//                 <button type="button" onClick={() => setEditingItem(null)} style={{ flex: '1 1 100px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   dashboardWrapper: { display: 'flex', minHeight: '100vh', background: '#f8faf9' }
// };
import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect } from "react";
// import Footer from '../components/Footer'; // Optional: Add to bottom of <main> if needed

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
  
  // State to control mobile sidebar drawer
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

  // 🟢 Centered, Smooth Loading Screen
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <div className="text-5xl animate-bounce mb-6">....</div>
      <h2 className="font-serif text-3xl font-bold animate-pulse text-slate-700">Loading dashboard...</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      
      {/* 🟢 Mobile Menu Toggle */}
      <button 
        className="lg:hidden fixed bottom-8 right-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 z-[100001] transition-transform active:scale-95 text-2xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* 🟢 Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999]"
        />
      )}

      {/* 🟢 Sidebar */}
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

      {/* 🟢 Main Content */}
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
                        <button onClick={() => setEditingItem({ type: itemType, data: item })} className="px-4 py-2 bg-sky-50 text-sky-600 font-bold text-xs rounded-xl hover:bg-sky-100 transition-colors">Edit</button>
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
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Image URL (Direct Link)</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="https://images.unsplash.com/..." 
                    value={newSlide.url} onChange={e => setNewSlide({...newSlide, url: e.target.value})} 
                  />
                  <p className="text-xs font-medium text-slate-400 mt-2">💡 Works with direct image URLs (.jpg, .png) or public Google Drive links.</p>
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
                    src={getDirectImageUrl(s.image_url)} 
                    alt="Slider Background" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x260?text=Preview+Not+Available"; }}
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200" onClick={() => setEditingItem(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 md:p-10 relative overflow-y-auto max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-8 duration-300" onClick={e => e.stopPropagation()}>
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
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={editingItem.data.image_url || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, image_url: e.target.value}})} />
                    <p className="text-xs font-medium text-slate-400 mt-2">💡 Works with direct image URLs or public Drive links.</p>
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
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[120px]" value={editingItem.data.description} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} />
                  </div>
                </>
              )}

              {editingItem.type === 'resource' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Google Drive Link</label>
                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={editingItem.data.drive_link || ""} onChange={e => setEditingItem({...editingItem, data: {...editingItem.data, drive_link: e.target.value}})} />
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

              {/* 🟢 FIXED BUTTON PADDING AND FLEX VALUE HERE */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" className="flex-[2] px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">Save Changes</button>
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all">Cancel</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}