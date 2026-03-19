import { API_BASE_URL } from '../apiConfig';
import { useState, useEffect, useRef } from "react";
import Footer from '../components/Footer';

// Pre-defined themes
const THEMES = [
  { name: "Emerald", bg: "#ecfdf5", accent: "#059669" },
  { name: "Ocean",   bg: "#e0f2fe", accent: "#0284c7" },
  { name: "Amber",   bg: "#fef3c7", accent: "#d97706" },
  { name: "Purple",  bg: "#f3e8ff", accent: "#7e22ce" },
  { name: "Rose",    bg: "#fce7f3", accent: "#be185d" }
];

// PRE-DEFINED ICON PACK FOR USERS TO CHOOSE FROM
const ICON_PACK = [
  "🌱", "🌿", "🚜", "🌾", "🍎", "🌻", "💧", "☀️", 
  "🐄", "🐑", "🐓", "🐝", "🥕", "🍅", "🥦", "🌲", 
  "🍄", "🌍", "🔬", "📚", "⚙️", "🌤️", "🔥", "📊"
];

/* ─── UPLOAD MODAL ──────────────────────────────────────── */
function UploadTopicModal({ onClose, onSuccess }) {
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("🌱");
  const [description, setDescription] = useState("");
  const [subtopics, setSubtopics] = useState(""); 
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false); 
  
  const [imageMap, setImageMap] = useState({});
  
  const [activeImg, setActiveImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const textarea = document.getElementById('topic-desc-textarea');
    const cursorPos = textarea ? textarea.selectionStart : description.length;
    
    setUploadingImg(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      
      if (data.success) {
        setActiveImg({ 
          url: data.imageUrl, 
          desc: "Topic Asset", 
          isNew: true, 
          pos: cursorPos 
        });
      } else {
        setError("Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      setError("Error uploading image to server.");
    } finally {
      setUploadingImg(false);
      e.target.value = ""; 
    }
  };

  const handleSaveImageContext = () => {
    const shortcode = `[🖼️ Image Added: ${activeImg.desc.trim() || "Asset"}]`;

    if (activeImg.isNew) {
      setImageMap(prev => ({ ...prev, [shortcode]: activeImg.url }));
      
      const before = description.substring(0, activeImg.pos);
      const after = description.substring(activeImg.pos);
      setDescription(`${before}\n${shortcode}\n${after}`);
    } else {
      if (activeImg.oldCode !== shortcode) {
        setImageMap(prev => {
          const newMap = { ...prev };
          delete newMap[activeImg.oldCode];
          newMap[shortcode] = activeImg.url;
          return newMap;
        });
        setDescription(prev => prev.replace(activeImg.oldCode, shortcode));
      }
    }
    setActiveImg(null); 
  };

  const handleRemoveImage = async (codeToRemove, url) => {
    setDescription(prev => prev.replace(`\n${codeToRemove}\n`, '').replace(codeToRemove, ''));
    setImageMap(prev => {
      const newMap = { ...prev };
      delete newMap[codeToRemove];
      return newMap;
    });
    setActiveImg(null); 

    try {
      await fetch(`${API_BASE_URL}/api/admin/resource/temp?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    } catch (err) {
      console.log("Cleanup request sent.");
    }
  };

  const handleSubmit = async () => {
    if (!label.trim() || !description.trim() || !icon.trim()) {
      setError("Please fill out the icon, title, and description.");
      return;
    }
    
    setError("");
    setLoading(true);

    let finalDescription = description;
    Object.entries(imageMap).forEach(([code, url]) => {
      const userDesc = code.replace('[🖼️ Image Added: ', '').replace(']', '');
      finalDescription = finalDescription.split(code).join(`![${userDesc}](${url})`);
    });

    const subtopicsArray = subtopics.split(',').map(s => s.trim()).filter(s => s !== "");
    
    const payload = {
      label: label.trim(),
      icon: icon.trim(),
      description: finalDescription.trim(),
      subtopics: subtopicsArray,
      color: selectedTheme.bg,
      accent: selectedTheme.accent
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setLoading(false);
        setSuccess(true);
        onSuccess({ id: data.id, ...payload, reads: "0.0K" });
        setTimeout(onClose, 1800);
      } else {
        throw new Error(data.error || "Failed to upload topic");
      }
    } catch (err) {
      setError("Failed to create topic. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-10 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-[24px] w-full max-w-[700px] max-h-[85vh] flex flex-col relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        
        {activeImg && (
          <div className="absolute inset-0 z-[200] bg-slate-900/40 backdrop-blur-[2px] flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden animate-[popIn_0.2s_ease-out]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-slate-800">
                  {activeImg.isNew ? "Image Details" : "Edit Image"}
                </h4>
                <button onClick={() => setActiveImg(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
              </div>
              <div className="p-5">
                <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden mb-4 border border-slate-200">
                   <img src={activeImg.url} className="w-full h-full object-contain" alt="preview" />
                </div>
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Image Description</label>
                <input 
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[14px] focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                  value={activeImg.desc} 
                  onChange={e => setActiveImg({...activeImg, desc: e.target.value})}
                  placeholder="e.g., Tomato Plant"
                />
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                 {!activeImg.isNew && (
                    <button onClick={() => handleRemoveImage(activeImg.oldCode, activeImg.url)} className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors flex-1">
                       Remove
                    </button>
                 )}
                 <button onClick={handleSaveImageContext} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors flex-1 shadow-sm">
                    {activeImg.isNew ? "Insert Image" : "Save Changes"}
                 </button>
              </div>
            </div>
          </div>
        )}

        <button className="absolute top-5 right-5 z-[100] w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-slate-900 text-xl flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:bg-white hover:text-emerald-600 hover:scale-110 active:scale-95" onClick={onClose}>✕</button>

        <div className="overflow-y-auto overflow-x-hidden grow w-full break-words custom-scrollbar p-6 md:p-12">
          {success ? (
            <div className="text-center py-10 animate-[popIn_0.35s_ease]">
              <div className="text-[64px] mb-5 animate-bounce">✨</div>
              <h3 className="font-['Lora',serif] text-[32px] text-slate-900 mb-3 font-extrabold">Topic Created!</h3>
              <p className="font-['Manrope',sans-serif] text-base text-slate-500 leading-[1.7] font-medium">Your new category is now live in the Knowledge Hub.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-block bg-emerald-600/10 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">New Category</span>
                <h2 className="font-['Lora',serif] text-[clamp(28px,4vw,36px)] font-black text-slate-900 leading-[1.1] mb-2">
                  Create a <span className="text-emerald-600">Topic</span>
                </h2>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex gap-2 items-center font-['Plus_Jakarta_Sans',sans-serif] font-semibold">
                  <span>⚠</span> {error}
                </div>
              )}

              <div className="flex gap-5 mb-4 flex-wrap">
                <div className="w-[80px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Icon</label>
                  <input className="w-full text-center text-[24px] p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" value={icon} onChange={e=>setIcon(e.target.value)} maxLength={2} />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Topic Name <span className="text-red-500">*</span></label>
                  <input className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" placeholder="e.g., Nursery Management" value={label} onChange={e=>{setLabel(e.target.value);setError("");}} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Quick Icon Select</label>
                <div className="flex gap-2 flex-wrap bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {ICON_PACK.map(ico => (
                    <button 
                      key={ico} type="button" onClick={() => setIcon(ico)} 
                      className={`w-[42px] h-[42px] text-[20px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 ${icon === ico ? 'bg-emerald-600/15 border border-emerald-600 shadow-[0_0_0_1px_#059669]' : 'bg-white border border-slate-200 shadow-sm'}`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Color Theme</label>
                <div className="flex gap-3 flex-wrap">
                  {THEMES.map(theme => (
                    <button type="button" key={theme.name} onClick={() => setSelectedTheme(theme)} 
                    style={{ background: theme.bg, color: theme.accent, borderColor: selectedTheme.name === theme.name ? theme.accent : 'transparent' }}
                    className="px-4 py-2 rounded-full border-2 font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-95">
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-1">Skeleton / Content <span className="text-red-500">*</span></label>
                    <p className="text-[11px] text-slate-500 font-['Plus_Jakarta_Sans',sans-serif] leading-[1.5]">
                      💡 Type <code>##</code> for Heading, <code>-</code> for Subheading.
                    </p>
                  </div>
                  <div>
                    <input type="file" id="topicImgUpload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <label htmlFor="topicImgUpload" className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
                      {uploadingImg ? "⏳ Uploading..." : "🖼️ Insert Image"}
                    </label>
                  </div>
                </div>
                
                <textarea 
                  id="topic-desc-textarea"
                  className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 resize-y leading-[1.6] min-h-[220px] font-mono"
                  placeholder={`## Raising Vegetable Nursery\n- Benefits of nursery\nThis is a description...\n\n[🖼️ Image Added: Tomato Plant]\n\n* Better germination rates\n* Healthier seedlings`} 
                  value={description} onChange={e=>setDescription(e.target.value)} 
                />

                {Object.keys(imageMap).length > 0 && (
                  <div className="mt-4">
                    <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Attached Images (Click to Edit)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(imageMap).map(([code, url]) => (
                        <div 
                          key={code} 
                          onClick={() => setActiveImg({ url, desc: code.replace('[🖼️ Image Added: ', '').replace(']', ''), isNew: false, oldCode: code })}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 cursor-pointer h-24 transition-all hover:shadow-md hover:-translate-y-0.5"
                        >
                          <img src={url} alt="preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Edit/Remove</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur text-[11px] font-bold truncate px-2 py-1 text-slate-700 border-t border-slate-200">
                             {code.replace('[🖼️ Image Added: ', '').replace(']', '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-slate-700 tracking-[0.05em] uppercase mb-2">Tags <span className="text-slate-400 font-medium normal-case tracking-normal">(comma separated)</span></label>
                <input className="w-full px-[18px] py-[14px] bg-slate-50 border border-slate-200 rounded-xl outline-none font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-slate-900 transition-all duration-200 font-medium focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" placeholder="e.g., Soil, Greenhouse, Seeds" value={subtopics} onChange={e=>setSubtopics(e.target.value)} />
              </div>

              <button type="button" onClick={handleSubmit} disabled={loading || uploadingImg} className="w-full justify-center bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base px-7 py-4 transition-all duration-300 inline-flex items-center gap-1.5 hover:bg-emerald-700 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(5,150,105,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Creating..." : "🌿 Launch Topic"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selected,  setSelected]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [hovered,   setHovered]   = useState(null);
  
  const [showUpload, setShowUpload] = useState(false);
  const user = JSON.parse(localStorage.getItem("hv_user"));

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/topics`);
        const dbTopics = await res.json();
        
        const formattedTopics = dbTopics.map(t => ({
          id: t.id, icon: t.icon || "🌿", label: t.label || "Untitled Topic",
          reads: ((t.reads_count || 0) / 1000).toFixed(1) + "K",
          color: t.color || "#f8faf9", accent: t.accent || "#059669",
          subtopics: t.subtopics || [], desc: t.description || ""
        }));
        
        setTopics(formattedTopics);
      } catch (err) {
        console.error("Failed to load topics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selected || showUpload) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selected, showUpload]);

  const filtered = topics.filter((t) =>
    (t.label || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.desc || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.subtopics && t.subtopics.some(sub => sub.toLowerCase().includes(search.toLowerCase())))
  );

  const handleNewTopic = (newTopic) => setTopics(prev => [newTopic, ...prev]);

  const parseContentWithImages = (text) => {
    const refinedText = text.replace(
      /(!\[(.*?)\]\((https?:\/\/[^)]+)\))(?:[\s\n]*)(!\[(.*?)\]\((https?:\/\/[^)]+)\))/gi,
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-[85%] mx-auto my-6 border-b border-black/5 pb-5">' +
        '<figure class="flex flex-col items-center m-0">' +
          '<a href="$3" target="_blank" rel="noopener noreferrer" style="display:contents" class="cursor-zoom-in">' +
            '<img src="$3" alt="$2" class="w-full h-auto max-h-[220px] object-contain rounded-xl shadow-sm border border-slate-200 block bg-slate-50 hover:opacity-90 transition-opacity" />' +
          '</a>' +
          '<figcaption class="text-[12px] text-slate-500 font-medium leading-[1.5] mt-2 text-center">$2</figcaption>' +
        '</figure>' +
        '<figure class="flex flex-col items-center m-0">' +
          '<a href="$6" target="_blank" rel="noopener noreferrer" style="display:contents" class="cursor-zoom-in">' +
            '<img src="$6" alt="$5" class="w-full h-auto max-h-[220px] object-contain rounded-xl shadow-sm border border-slate-200 block bg-slate-50 hover:opacity-90 transition-opacity" />' +
          '</a>' +
          '<figcaption class="text-[12px] text-slate-500 font-medium leading-[1.5] mt-2 text-center">$5</figcaption>' +
        '</figure>' +
      '</div>'
    );

    return refinedText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
      .replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi, 
        '<figure class="flex flex-col items-center my-6 m-0">' +
          '<a href="$2" target="_blank" rel="noopener noreferrer" style="display:contents" class="cursor-zoom-in">' +
            '<img src="$2" alt="$1" class="w-[80%] md:w-[45%] max-w-[350px] h-auto max-h-[260px] object-contain rounded-xl shadow-sm border border-slate-200 block bg-slate-50 hover:opacity-90 transition-opacity" />' +
          '</a>' +
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
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 transition-all duration-300 w-full hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:bg-white" style={{ borderTop: `3px solid ${accentColor}` }}>
              
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
    <div className="relative min-h-screen text-slate-900 overflow-hidden">
      
      {/* Tiny CSS block solely for loading Fonts, Animations, and Webkit Scrollbars */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }

        /* HIGH-PERFORMANCE SCROLLBAR: Hardware accelerated */
        .custom-scrollbar {
          -webkit-overflow-scrolling: touch; 
          transform: translateZ(0); 
          will-change: scroll-position;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
        
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* ══════════════════════════════════════════════════
           🌙 DARK MODE OVERRIDES FOR TOPICS PAGE
        ══════════════════════════════════════════════════ */
        body.dark-mode .topics-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%) !important; }
        
        body.dark-mode .search-box { background: rgba(30, 41, 59, 0.9) !important; border-color: rgba(255,255,255,0.1) !important; color: #f8faf9 !important; }
        body.dark-mode .search-box:focus { background: #0f172a !important; border-color: #10b981 !important; }
        
        body.dark-mode .modal-box { background: #1e293b !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05) !important; }
        body.dark-mode .modal-close-btn { background: rgba(15, 23, 42, 0.8) !important; color: #f8faf9 !important; border-color: rgba(255, 255, 255, 0.1) !important; }
        body.dark-mode .modal-close-btn:hover { background: #334155 !important; }
        
        body.dark-mode .input-modern, body.dark-mode select { background: #0f172a !important; border-color: rgba(255,255,255,0.1) !important; color: #f8faf9 !important; }
        body.dark-mode .input-modern:focus, body.dark-mode select:focus { background: #020617 !important; border-color: #10b981 !important; }
        
        body.dark-mode .topic-card { --card-bg: #1e293b !important; --card-shadow: rgba(0,0,0,0.4) !important; --card-text: #34d399 !important; background: var(--card-bg) !important; border-color: rgba(255,255,255,0.05) !important; }
        body.dark-mode .topic-icon-wrap { background: rgba(0,0,0,0.2) !important; color: #34d399 !important; box-shadow: inset 2px 2px 4px rgba(255,255,255,0.05), inset -2px -2px 4px rgba(0,0,0,0.5) !important; border: 1px solid rgba(255,255,255,0.05); }
        body.dark-mode .topic-card:hover .topic-icon-wrap { background: rgba(0,0,0,0.4) !important; }
        
        body.dark-mode .bg-slate-100 { background-color: rgba(255,255,255,0.05) !important; color: #cbd5e1 !important; }
        body.dark-mode .group-hover\\:bg-white:hover { background-color: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.2) !important; }
        body.dark-mode .bg-transparent.text-slate-400 { color: #94a3b8 !important; }

        body.dark-mode .bg-slate-50 { background-color: #0f172a !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white { background-color: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white\\/80 { background-color: rgba(30, 41, 59, 0.8) !important; color: #f8faf9 !important; border-color: rgba(255,255,255,0.1) !important; }
        body.dark-mode .bg-white\\/80:hover { background-color: #334155 !important; }

        body.dark-mode .text-slate-900, body.dark-mode .text-slate-800 { color: #f8faf9 !important; }
        body.dark-mode .text-slate-700, body.dark-mode .text-slate-600, body.dark-mode .text-slate-500, body.dark-mode .text-slate-400 { color: #94a3b8 !important; }
        
        body.dark-mode .border-slate-200, body.dark-mode .border-black\\/5 { border-color: rgba(255,255,255,0.1) !important; }
        
        body.dark-mode [style*="color: #0f172a"], body.dark-mode [style*="color: rgb(15, 23, 42)"] { color: #f8faf9 !important; }
        body.dark-mode [style*="color: #475569"], body.dark-mode [style*="color: rgb(71, 85, 105)"] { color: #cbd5e1 !important; }
        body.dark-mode [style*="color: #64748b"], body.dark-mode [style*="color: rgb(100, 116, 139)"] { color: #94a3b8 !important; }
        body.dark-mode [style*="background: #ffffff"], body.dark-mode [style*="background: rgb(255, 255, 255)"] { background: #1e293b !important; }
        body.dark-mode [style*="background: #f8faf9"] { background: #0f172a !important; }
        body.dark-mode [style*="background: rgba(255,255,255,0.6)"] { background: rgba(30, 41, 59, 0.6) !important; }
        body.dark-mode [style*="background: rgba(255,255,255,0.8)"] { background: rgba(30, 41, 59, 0.8) !important; }
        body.dark-mode [style*="border: 1px solid rgba(255,255,255,1)"] { border-color: rgba(255,255,255,0.1) !important; }
        
        body.dark-mode .topic-modal-header { background: linear-gradient(180deg, rgba(30,41,59,1) 0%, rgba(30,41,59,0) 100%) !important; }
        body.dark-mode .topic-modal-header > div { background: #0f172a !important; box-shadow: none !important; border: 1px solid rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* Background Gradients */}
      <div className="topics-bg" style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)",
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* HERO SECTION */}
      <div className="pt-[120px] bg-transparent">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,1)", color:"#059669", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:"8px 20px", borderRadius:50, marginBottom:24, boxShadow:"0 4px 12px rgba(0,0,0,0.03)" }}>
            Knowledge Hub
          </span>
          <h1 className="fr" style={{ fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Explore agricultural <br/> <span style={{ color:"#059669" }}>disciplines.</span>
          </h1>
          <p className="jk" style={{ marginTop: 20, fontSize: 18, color: "#475569", fontWeight: 500, lineHeight: 1.6, maxWidth: 600, margin: "20px auto 0" }}>
            Dive into specialized agricultural disciplines and explore our full curriculum structures.
          </p>

          {user && (
            <div style={{ marginTop: "24px", animation: "fadeIn 0.5s ease" }}>
              <button onClick={() => setShowUpload(true)} className="bg-emerald-600 text-white rounded-full font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base px-8 py-3.5 transition-all duration-300 inline-flex items-center gap-1.5 hover:bg-emerald-700 hover:-translate-y-[2px] shadow-[0_8px_20px_rgba(5,150,105,0.3)] active:scale-[0.98]">
                <span style={{ fontSize: "20px" }}>🌿</span> Create a Topic
              </button>
            </div>
          )}

          {/* SEARCH BAR */}
          <div className="search-container" style={{ position: "relative", maxWidth: 680, margin: "0 auto", transform: "translateY(50%)", zIndex: 10, marginTop: user ? "30px" : "0px" }}>
            <span className="search-icon" style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)", fontSize: 22, color: "#10b981", pointerEvents: "none" }}>🔍</span>
            <input 
              className="search-box" 
              style={{ width: "100%", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 1)", borderRadius: 100, padding: "22px 32px 22px 64px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#111827", outline: "none", transition: "all .3s ease", boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16,185,129,0.05)" }}
              placeholder="Search topics or curriculums..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* TOPIC GRID */}
      <main style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 100, paddingBottom: 100, paddingLeft: 20, paddingRight: 20, position: "relative", zIndex: 5 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b", fontSize: 18 }}>Loading topics from database...</div>
        ) : (
          <>
            {search && (
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize: 16, color: "#475569", marginBottom: 32, fontWeight: 600, background: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 12, display: "inline-block" }}>
                Found <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> topics for "{search}"
              </p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {filtered.map((t) => (
                <article key={t.id} className="topic-card group" style={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,1)", borderRadius: 20, padding: 32, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }} onClick={() => setSelected(t)} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
                  
                  {/* Glow overlay */}
                  <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", filter: "blur(40px)", opacity: hovered === t.id ? 0.2 : 0, transition: "opacity 0.5s", pointerEvents: "none", background: t.accent }} />
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div className="topic-icon-wrap" style={{ width: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, transition: "all 0.3s", transform: hovered === t.id ? "scale(1.1)" : "scale(1)", background: hovered === t.id ? t.color : "#f8faf9" }}>
                      {t.icon}
                    </div>
                  </div>

                  <h3 className="fr" style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.2, wordBreak: "break-word" }}>{t.label}</h3>
                  
                  {/* Clean standard and markdown image raw content from the grid description */}
                  <p className="jk" style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, fontWeight: 500, marginBottom: 24, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-all" }}>
                    {(t.desc || "").replace(/\[IMG:.*?\]|!\[.*?\]\(.*?\)|#|[-*]/g, "")}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, marginTop: "auto" }}>
                    {t.subtopics && t.subtopics.slice(0,3).map((s) => (
                      <span key={s} className="bg-slate-100" style={{ display: "inline-block", color: "#475569", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 50, transition: "all 0.2s", border: "1px solid transparent" }}>{s}</span>
                    ))}
                    {t.subtopics && t.subtopics.length > 3 && (
                      <span className="bg-transparent text-slate-400" style={{ display: "inline-block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 50 }}>+{t.subtopics.length-3}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span className="jk" style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>👀 {t.reads} Views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "96px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
                <h3 className="fr" style={{ fontSize: 28, color: "#0f172a", fontWeight: 800 }}>No topics found</h3>
                <p className="jk" style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>We couldn't find anything matching your search.</p>
                <button style={{ marginTop: 24, background: "rgba(255,255,255,0.8)", color: "#334155", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 50, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 14, padding: "12px 28px", transition: "all .2s", cursor: "pointer" }} onClick={() => setSearch("")}>Clear Search</button>
              </div>
            )}
          </>
        )}
      </main>

      {showUpload && <UploadTopicModal onClose={() => setShowUpload(false)} onSuccess={handleNewTopic} />}

      {/* READING MODAL */}
      {selected && !showUpload && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: 1100, maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelected(null)}>✕</button>
            
            <div className="modal-scroll-area">
              <div className="topic-modal-header" style={{ padding: "48px 24px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", background: `linear-gradient(180deg, ${selected.color} 0%, rgba(255,255,255,0) 100%)` }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)", marginBottom: 20 }}>
                  {selected.icon}
                </div>
                <h2 className="fr" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginBottom: 16, wordBreak: "break-word" }}>
                  {selected.label}
                </h2>
              </div>
              <div style={{ padding: "0 24px 48px" }}> 
                <div>
                  {renderTopicContent(selected.desc || "", selected.accent)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
// this is our updated topic page code so  in modal viwe the topic description dont show wait ill shoe what missing but first see image i  gve that wait wait text coming above that green button and view resource link going in wait wati i mean it does not look like we did earlier in reserouce 
// like that only see in previous one resources page
// and in dark mode the search bar place holder and inside input  test colr match not match make it readable