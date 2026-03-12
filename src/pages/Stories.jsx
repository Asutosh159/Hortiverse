// import { useState } from "react";

// /* ─── STORIES DATA ──────────────────────────────────────── */
// const allStories = [
//   {
//     id: 1, author: "Emma Rodriguez", initials: "ER", ago: "2 days ago",
//     title: "My Journey with Vertical Farming in Urban Spaces",
//     tag: "Urban Farming", readTime: "5 min read", likes: 142, comments: 28,
//     img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
//     excerpt: "Transforming my apartment balcony into a thriving vertical garden taught me invaluable lessons about space optimization and sustainable food production.",
//     content: `When I first moved into my small apartment in the city, I thought growing my own food was a dream reserved for those lucky enough to have a garden. But a tiny balcony, some creativity, and a whole lot of determination changed everything.

// I started with a simple idea: stack planters vertically along the railing. Within weeks, I had lettuce, spinach, and herbs climbing three feet high. The key was choosing lightweight containers and fast-draining soil mixes to prevent waterlogging on a surface that sees heavy rain.

// **What I learned about light:**
// Urban balconies are tricky. Mine faced north-east, getting only about 4 hours of direct sunlight. I quickly learned that leafy greens — spinach, kale, chard — are far more forgiving in partial shade than tomatoes or peppers. Herbs like mint and parsley also thrived. I positioned mirrors strategically to reflect light back into shadowed corners, a trick I picked up from a community gardening forum.

// **Managing space cleverly:**
// With only 6 square meters to work with, every centimeter counted. I built a tiered trellis from bamboo poles and zip ties — cost me less than ₹200 — and grew climbing beans that doubled as a privacy screen. Below it, I planted shade-tolerant nasturtiums that cascaded beautifully and were entirely edible.

// **Water and drainage:**
// The biggest mistake I made early on was overwatering. Containers dry out fast in summer heat but stay waterlogged after heavy rains. I solved this by drilling extra drainage holes and placing pot feet to lift containers off the floor. A simple drip-tray system with pebbles let excess water evaporate rather than pool.

// **The harvest:**
// By month three, I was harvesting enough greens for two salads a week. My mint had gone absolutely wild — I was giving bunches to neighbours. There's a profound satisfaction in eating something you grew yourself, even if it's just a handful of rocket leaves on a city balcony.

// This experience changed how I think about food, space, and community. Urban farming isn't just about produce — it's about reconnecting with natural cycles in a concrete world. I encourage every horticulture student to try it, no matter how small their space.`,
//     color: "#e8f5e9",
//   },
//   {
//     id: 2, author: "James Chen", initials: "JC", ago: "5 days ago",
//     title: "Implementing IoT Sensors in Traditional Rice Paddies",
//     tag: "AgriTech", readTime: "7 min read", likes: 198, comments: 45,
//     img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
//     excerpt: "How I helped my family farm modernize with affordable technology while preserving traditional farming wisdom passed down through generations.",
//     content: `My family has farmed rice in the same valley for four generations. When I came home after my first year of studying AgriTech, I wanted to bridge the gap between the knowledge I was gaining at university and the wisdom my grandfather had accumulated over decades.

// The challenge wasn't technical — it was cultural. My grandfather was skeptical of sensors and dashboards. "I can tell when the paddy needs water by the colour of the sky," he said. And he wasn't wrong. But he was also working 14-hour days, and I wanted to give him something back.

// **Choosing the right sensors:**
// We started small. I installed three soil moisture sensors from a local electronics supplier — total cost around ₹1,800 — connected to a Raspberry Pi Zero running a simple Python script. The data fed into a WhatsApp notification system (not a fancy app — my grandfather uses WhatsApp every day already).

// **The first season results:**
// Water usage dropped by 22%. Not because the sensors were smarter than my grandfather, but because they removed the anxiety of guessing. He stopped the precautionary over-watering he'd been doing "just in case." The sensors confirmed what he already knew and added confidence.

// **What traditional knowledge taught the technology:**
// Here's what surprised me most. When I mapped our sensor data against my grandfather's irrigation notes from the past decade, the patterns were nearly identical. His intuitive reading of wind direction, leaf curl, and soil colour was tracking moisture with remarkable accuracy. The sensors didn't replace his knowledge — they validated it.

// We now use both. The sensors handle overnight monitoring and send alerts if moisture drops below threshold. My grandfather handles the nuanced decisions — adjusting for upcoming weather, managing micro-climates across different parts of the paddy.

// **Lessons for other students:**
// Don't arrive with technology and expect farmers to be grateful. Listen first. Understand the existing system deeply before proposing changes. The best agricultural technology amplifies human wisdom rather than replacing it.

// The most important sensor on our farm is still my grandfather's hand, pressed into the mud at dawn.`,
//     color: "#e3f2fd",
//   },
//   {
//     id: 3, author: "Sarah Johnson", initials: "SJ", ago: "1 week ago",
//     title: "Regenerative Grazing: Results from My First Year",
//     tag: "Livestock", readTime: "8 min read", likes: 167, comments: 33,
//     img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
//     excerpt: "Documenting the transformation of degraded pastureland through holistic management and rotational grazing practices across four seasons.",
//     content: `A year ago, the south paddock of our family farm looked like the surface of the moon. Overgrazing over two decades had stripped the topsoil, compacted the ground so badly that water pooled rather than soaking in, and left behind nothing but broadleaf weeds and bare patches.

// I had one year, 40 hectares, and a herd of 60 mixed cattle to work with. This is what happened.

// **The Holistic Planned Grazing framework:**
// I followed the principles developed by Allan Savory, dividing the south paddock into 12 smaller cells using temporary electric fencing. The cattle graze intensively on one cell for 3–5 days, then move on. Each cell then rests for 60–90 days before being grazed again.

// The idea is to mimic the movement patterns of wild herds — intense pressure followed by long recovery. The trampling of hooves breaks up soil crust, presses seeds into the ground, and incorporates plant litter into the surface. Then the rest period allows grasses to recover fully before being grazed again.

// **Month by month:**
// By month two, I noticed earthworm activity returning to the first cells that had been rested. By month four, a native grass species I had never seen on this land appeared — apparently the seeds had been dormant in the soil. By month eight, the bare patches had reduced by roughly 60% by my estimate.

// **The water infiltration test:**
// I conduct a simple ring infiltration test quarterly. At the start of the year, water pooled on the surface for over 40 seconds before beginning to absorb. By month twelve, the same test showed absorption beginning within 8 seconds. Soil structure was visibly improving.

// **What I got wrong:**
// I underestimated recovery time in the dry summer months. I moved cattle back into cells too soon twice, and those cells showed setbacks. Flexibility is essential — the plan is a guide, not a rule.

// The south paddock still has years of healing ahead. But the direction is clear, and the results after just one year are genuinely exciting. Regenerative grazing isn't a miracle — it's ecology working at its own pace.`,
//     color: "#fff8e1",
//   },
//   {
//     id: 4, author: "Priya Nair", initials: "PN", ago: "2 weeks ago",
//     title: "Companion Planting: How I Tripled My Tomato Yield",
//     tag: "Crop Science", readTime: "6 min read", likes: 221, comments: 52,
//     img: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&q=80",
//     excerpt: "A deep dive into the science and practice of companion planting that transformed my experimental plot into a thriving polyculture.",
//     content: `Last season I ran a simple experiment on my university trial plot. One bed grew tomatoes alone — standard spacing, single crop. The adjacent bed grew tomatoes with basil, marigolds, and nasturtiums. The results were striking enough that I've completely changed how I think about monocultures.

// **The science behind companion planting:**
// Plants communicate through root exudates — chemical compounds released into the soil. Basil releases volatile compounds that appear to repel thrips and aphids, insects that devastate tomato crops. Marigolds produce alpha-terthienyl in their roots, a compound toxic to root-knot nematodes. Nasturtiums act as trap crops, drawing aphids away from tomatoes onto themselves.

// **Setting up the trial:**
// I planted both beds identically in terms of tomato variety (Pusa Ruby), spacing (60cm x 45cm), irrigation, and fertiliser. The companion bed added one basil plant every third tomato, a row of French marigolds along the border, and nasturtiums at the corners.

// **Results after 90 days:**
// The monoculture bed produced an average of 2.8kg per plant. The companion bed produced 8.4kg per plant. I want to be careful about overclaiming — this was a single-season trial on a small plot, and many variables exist. But the difference was large enough to warrant serious attention.

// Pest damage in the companion bed was also visibly lower. I counted aphid colonies on five plants in each bed: monoculture averaged 34 colonies per plant; companion bed averaged 7.

// **Practical takeaways for small farmers:**
// The companion bed cost almost nothing extra — basil and marigold seeds are inexpensive, and nasturtiums self-seed freely. The labour involved in planting was perhaps 20% more. The yield benefit, if it holds across seasons, would be transformative for small-scale growers.

// More research is needed. But this experiment convinced me that biodiversity in the field isn't just an ecological ideal — it's a practical strategy.`,
//     color: "#fce4ec",
//   },
//   {
//     id: 5, author: "Arjun Mehta", initials: "AM", ago: "3 weeks ago",
//     title: "Biochar: Ancient Technology for Modern Soil Health",
//     tag: "Sustainable Farming", readTime: "9 min read", likes: 134, comments: 19,
//     img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
//     excerpt: "Exploring the science of biochar application and its remarkable effects on soil carbon, water retention, and microbial activity.",
//     content: `Biochar — charcoal produced through pyrolysis of organic matter — has been used in agriculture for over 2,000 years. The Terra Preta soils of the Amazon basin, created by indigenous peoples centuries ago, remain extraordinarily fertile today. Yet biochar is only now re-entering mainstream agricultural science.

// I spent six months applying biochar to degraded plots on our family's dryland farm in Rajasthan, where sandy soils and erratic rainfall make consistent yields a constant challenge.

// **What biochar does:**
// At a microscopic level, biochar is a lattice of carbon with enormous surface area. One gram of high-quality biochar can have a surface area exceeding 300 square metres. This structure acts as a habitat for soil microbes and a reservoir for water and nutrients that would otherwise leach through sandy soils.

// **Production and application:**
// I built a simple cone kiln from sheet metal — cost approximately ₹3,500 — capable of producing 8–10kg of biochar per burn using agricultural residues (crop stalks, coconut shells, wood offcuts). The key is limiting oxygen during combustion to ensure pyrolysis rather than complete burning.

// Raw biochar must be charged before application. I soaked mine in diluted compost tea for two weeks, allowing microbial communities to colonise the char before it entered the soil. Uncharged biochar can temporarily immobilise soil nitrogen.

// **Results across three plots:**
// Water retention improved measurably in all three plots. In our sandiest plot, I observed the soil remaining moist 36 hours after irrigation compared to 14 hours in the untreated control. Germination rates improved by roughly 18% in the biochar plots.

// Yield data after one season showed modest but consistent improvements — approximately 15% higher in the biochar plots. Experienced farmers tell me the effects compound over multiple seasons as microbial communities establish.

// **The carbon sequestration angle:**
// Biochar is one of the few agricultural practices that genuinely sequesters carbon. The carbon in biochar is stable for hundreds to thousands of years. As a student, I find the idea that farming itself could be part of the climate solution deeply motivating.`,
//     color: "#e8f5e9",
//   },
//   {
//     id: 6, author: "Liu Wei", initials: "LW", ago: "1 month ago",
//     title: "Aquaponics at Scale: Lessons from a Student Farm",
//     tag: "AgriTech", readTime: "10 min read", likes: 289, comments: 67,
//     img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
//     excerpt: "Building and running a 200-litre aquaponics system as a final year project — the failures, breakthroughs, and surprising economics.",
//     content: `For my final year project, I designed and built a recirculating aquaponics system in the college greenhouse. What started as an academic exercise became a genuine obsession — and a system that is now producing tilapia and leafy greens for our college canteen.

// **System design:**
// The core principle of aquaponics is elegant: fish produce waste rich in ammonia; bacteria convert that ammonia to nitrates; plants absorb those nitrates as fertiliser; the cleaned water returns to the fish. A closed loop where the fish feed the plants and the plants clean the water.

// My system uses two 100-litre fish tanks connected to four grow beds filled with expanded clay pebbles. Tilapia were the obvious choice — hardy, fast-growing, and tolerant of the temperature fluctuations in a college greenhouse.

// **The nitrogen cycle crisis:**
// Three weeks after stocking the fish, ammonia levels spiked to dangerous levels. I had seeded the system with bacterial cultures but hadn't allowed enough time for the nitrogen cycle to fully establish before adding fish. I lost six tilapia before I understood what was happening.

// The lesson: cycle your system for 4–6 weeks before adding fish. Use ammonia solution to feed the bacteria, test daily, and only add fish when both ammonia and nitrite readings are consistently near zero.

// **What grew well:**
// Lettuce, spinach, basil, and pak choi thrived. Fruiting plants like tomatoes struggled — the system wasn't producing sufficient phosphorus for flowering. Leafy greens that primarily need nitrogen are the natural fit for aquaponics.

// **The economics:**
// After 8 months of operation, the system produces approximately 2kg of tilapia and 4kg of mixed greens per week. Running costs — electricity for pumps and aeration, fish feed — come to roughly ₹1,200 per month. The produce value at local market prices is approximately ₹3,800 per month.

// The payback period on the capital investment (approximately ₹28,000) at that margin would be around 14 months. For a small commercial operation with lower overheads, the economics are genuinely viable.`,
//     color: "#e3f2fd",
//   },
// ];

// const tags = ["All", "Urban Farming", "AgriTech", "Livestock", "Crop Science", "Sustainable Farming"];
// const avatarColors = ["#43a047","#2e7d32","#66bb6a","#388e3c","#1b5e20","#81c784"];

// /* ─── COMPONENT ─────────────────────────────────────────── */
// export default function Stories() {
//   const [activeTag,     setActiveTag]     = useState("All");
//   const [selectedStory, setSelectedStory] = useState(null);
//   const [searchQuery,   setSearchQuery]   = useState("");
//   const [likedStories,  setLikedStories]  = useState([]);

//   const filtered = allStories.filter((s) => {
//     const matchTag    = activeTag === "All" || s.tag === activeTag;
//     const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                         s.author.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchTag && matchSearch;
//   });

//   const toggleLike = (id, e) => {
//     e.stopPropagation();
//     setLikedStories((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
//   };

//   /* ── RENDER ── */
//   return (
//     <div style={{ fontFamily: "'Georgia',serif", background: "linear-gradient(135deg,#f0faf0 0%,#e8f5e8 40%,#f5f8ff 100%)", minHeight: "100vh", color: "#1a2e1a" }}>

//       {/* ══ GLOBAL STYLES ══ */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: #f0faf0; }
//         ::-webkit-scrollbar-thumb { background: #a8d8a8; border-radius: 3px; }
//         .fr { font-family: 'Fraunces', serif; }
//         .jk { font-family: 'Plus Jakarta Sans', sans-serif; }

//         .glass {
//           background: rgba(255,255,255,0.65);
//           backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
//           border: 1px solid rgba(255,255,255,0.88);
//           box-shadow: 0 4px 24px rgba(60,140,60,0.08);
//         }

//         .story-card {
//           background: rgba(255,255,255,0.68);
//           backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
//           border: 1px solid rgba(255,255,255,0.9);
//           box-shadow: 0 4px 24px rgba(60,140,60,0.08);
//           border-radius: 22px; overflow: hidden; cursor: pointer;
//           transition: all 0.38s cubic-bezier(0.23,1,0.32,1);
//         }
//         .story-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 24px 60px rgba(60,140,60,0.18);
//           border-color: rgba(76,175,80,0.45);
//           background: rgba(255,255,255,0.88);
//         }

//         .tag-pill {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-size: 12px; font-weight: 600; letter-spacing: .05em;
//           padding: 8px 20px; border-radius: 50px; cursor: pointer;
//           transition: all .25s; border: 1.5px solid transparent;
//           white-space: nowrap;
//         }
//         .tag-pill.off {
//           background: rgba(255,255,255,.7); backdrop-filter: blur(10px);
//           border-color: rgba(255,255,255,.9); color: #3a6a3a;
//         }
//         .tag-pill.off:hover { border-color: rgba(76,175,80,.4); background: rgba(76,175,80,.07); }
//         .tag-pill.on {
//           background: linear-gradient(135deg,#43a047,#1b5e20);
//           color: #fff; box-shadow: 0 4px 16px rgba(67,160,71,.35);
//         }

//         .search-box {
//           background: rgba(255,255,255,.78); backdrop-filter: blur(16px);
//           border: 1.5px solid rgba(255,255,255,.9); border-radius: 50px;
//           padding: 12px 22px 12px 48px; width: 100%; max-width: 360px;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
//           color: #1a3a1a; outline: none; transition: border-color .3s;
//         }
//         .search-box::placeholder { color: #9aba9a; }
//         .search-box:focus { border-color: rgba(76,175,80,.55); box-shadow: 0 0 0 3px rgba(76,175,80,.08); }

//         .btn-green {
//           background: linear-gradient(135deg,#43a047,#1b5e20); color: #fff;
//           border: none; cursor: pointer; border-radius: 50px;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
//           font-size: 13px; padding: 11px 28px; transition: all .3s;
//           box-shadow: 0 4px 18px rgba(67,160,71,.35); text-decoration: none;
//           display: inline-flex; align-items: center; gap: 6px;
//         }
//         .btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(67,160,71,.5); }

//         .btn-ghost {
//           background: rgba(255,255,255,.75); backdrop-filter: blur(10px);
//           color: #2e7d32; border: 1.5px solid rgba(67,160,71,.4);
//           cursor: pointer; border-radius: 50px;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
//           font-size: 13px; padding: 11px 28px; transition: all .3s;
//           text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
//         }
//         .btn-ghost:hover { background: rgba(76,175,80,.1); border-color: #4caf50; }

//         .like-btn {
//           background: none; border: none; cursor: pointer; padding: 4px;
//           display: flex; align-items: center; gap: 5px; transition: transform .2s;
//         }
//         .like-btn:hover { transform: scale(1.15); }

//         /* ── MODAL ── */
//         .modal-overlay {
//           position: fixed; inset: 0; z-index: 900;
//           background: rgba(10,30,10,0.55);
//           backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
//           display: flex; align-items: center; justify-content: center;
//           padding: 24px; animation: fadeIn .25s ease;
//         }
//         @keyframes fadeIn { from{opacity:0} to{opacity:1} }

//         .modal-box {
//           background: rgba(255,255,255,0.95);
//           backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
//           border: 1px solid rgba(255,255,255,0.98);
//           box-shadow: 0 32px 100px rgba(20,60,20,.25);
//           border-radius: 28px; width: 100%; max-width: 760px;
//           max-height: 90vh; overflow-y: auto;
//           animation: slideUp .3s cubic-bezier(0.23,1,0.32,1);
//         }
//         @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }

//         .modal-box::-webkit-scrollbar { width: 5px; }
//         .modal-box::-webkit-scrollbar-thumb { background: #c8e6c9; border-radius: 3px; }

//         .modal-content p {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           font-size: 16px; line-height: 1.9; color: #2a3a2a;
//           margin-bottom: 20px; font-weight: 300;
//         }
//         .modal-content strong, .modal-content b {
//           font-weight: 700; color: #1a3a1a;
//         }

//         .nav-bar {
//           position: fixed; top: 0; left: 0; right: 0; z-index: 500; height: 66px;
//           background: rgba(255,255,255,0.97); backdrop-filter: blur(32px);
//           border-bottom: 1.5px solid rgba(76,175,80,0.15);
//           box-shadow: 0 2px 20px rgba(60,140,60,.08);
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 0 48px;
//         }
//         .nav-lk {
//           color: #1a3a1a; text-decoration: none;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
//           transition: color .2s; position: relative; padding-bottom: 2px;
//         }
//         .nav-lk::after {
//           content: ''; position: absolute; bottom: -2px; left: 0;
//           width: 0; height: 2px; background: linear-gradient(90deg,#4caf50,#81c784);
//           border-radius: 2px; transition: width .28s;
//         }
//         .nav-lk:hover { color: #43a047; }
//         .nav-lk:hover::after { width: 100%; }
//         .nav-lk.active { color: #43a047; }
//         .nav-lk.active::after { width: 100%; }

//         .badge {
//           display: inline-block;
//           background: rgba(76,175,80,.12); color: #2e7d32;
//           border: 1px solid rgba(76,175,80,.22);
//           font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px;
//           font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
//           padding: 4px 12px; border-radius: 20px;
//         }
//         .avatar {
//           width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
//           display: flex; align-items: center; justify-content: center;
//           font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
//           font-size: 12px; color: #fff;
//         }
//       `}</style>

//       {/* ══ NAVBAR ══ */}
//       <nav className="nav-bar">
//         <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
//           <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#66bb6a,#1b5e20)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 12px rgba(76,175,80,.4)" }}>🌿</div>
//           <span className="fr" style={{ fontSize:20, fontWeight:700, color:"#1a3a1a" }}>Horti<span style={{ color:"#43a047" }}>Verse</span></span>
//         </a>
//         <div style={{ display:"flex", gap:32 }}>
//           {[["Home","/"],["Stories","/stories"],["Topics","/topics"],["Community","#"],["Resources","#"]].map(([n,h]) => (
//             <a key={n} href={h} className={`nav-lk ${n==="Stories"?"active":""}`}>{n}</a>
//           ))}
//         </div>
//         <div style={{ display:"flex", gap:10 }}>
//           <a href="#" className="btn-ghost" style={{ padding:"8px 20px", fontSize:13 }}>Login</a>
//           <a href="#" className="btn-green" style={{ padding:"8px 20px", fontSize:13 }}>Join Community ›</a>
//         </div>
//       </nav>

//       {/* ══ PAGE HEADER ══ */}
//       <div style={{ paddingTop: 66, background: "linear-gradient(135deg,rgba(200,240,200,.5),rgba(240,255,240,.3))", borderBottom: "1px solid rgba(76,175,80,.1)" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 48px 40px" }}>
//           <span style={{ display:"inline-block", background:"rgba(76,175,80,.1)", color:"#2e7d32", border:"1px solid rgba(76,175,80,.22)", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", padding:"5px 16px", borderRadius:20, marginBottom:16 }}>
//             Real Experiences
//           </span>
//           <h1 className="fr" style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, color: "#1a3a1a", lineHeight: 1.05 }}>
//             Community <span style={{ color:"#43a047", fontStyle:"italic" }}>Stories</span>
//           </h1>
//           <p className="jk" style={{ marginTop: 14, fontSize: 16, color: "#5a7a5a", fontWeight: 300, maxWidth: 520 }}>
//             Learn from horticulture students making a real difference in agriculture worldwide. Click any story to read in full.
//           </p>

//           {/* stats row */}
//           <div style={{ display:"flex", gap:32, marginTop:32 }}>
//             {[["📖","1,200+","Stories shared"],["👥","48K+","Community members"],["🌍","45+","Countries"]].map(([ic,n,l]) => (
//               <div key={l} style={{ display:"flex", alignItems:"center", gap:10 }}>
//                 <span style={{ fontSize:20 }}>{ic}</span>
//                 <div>
//                   <div className="fr" style={{ fontSize:20, fontWeight:700, color:"#43a047", lineHeight:1 }}>{n}</div>
//                   <div className="jk" style={{ fontSize:11, color:"#8aaa8a", marginTop:2 }}>{l}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ══ FILTER BAR ══ */}
//       <div style={{ position:"sticky", top:66, zIndex:400, background:"rgba(255,255,255,.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(76,175,80,.1)", padding:"14px 48px" }}>
//         <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>

//           {/* tag pills */}
//           <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//             {tags.map((t) => (
//               <button key={t} className={`tag-pill ${activeTag===t?"on":"off"}`} onClick={() => setActiveTag(t)}>{t}</button>
//             ))}
//           </div>

//           {/* search */}
//           <div style={{ position:"relative" }}>
//             <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"#9aba9a" }}>🔍</span>
//             <input className="search-box" placeholder="Search stories…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//           </div>
//         </div>
//       </div>

//       {/* ══ STORIES GRID ══ */}
//       <main style={{ maxWidth:1200, margin:"0 auto", padding:"48px 48px 100px" }}>

//         {/* result count */}
//         <p className="jk" style={{ fontSize:13, color:"#8aaa8a", marginBottom:28, fontWeight:400 }}>
//           Showing <strong style={{ color:"#43a047" }}>{filtered.length}</strong> {filtered.length===1?"story":"stories"}
//           {activeTag!=="All" && <> in <strong style={{ color:"#1a3a1a" }}>{activeTag}</strong></>}
//         </p>

//         <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:28 }}>
//           {filtered.map((s, i) => (
//             <article key={s.id} className="story-card" onClick={() => setSelectedStory(s)}
//               style={{ animationDelay:`${i*.06}s` }}>

//               {/* image */}
//               <div style={{ height:200, overflow:"hidden", position:"relative" }}>
//                 <img src={s.img} alt={s.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s ease" }}
//                   onMouseEnter={(e) => e.target.style.transform="scale(1.06)"}
//                   onMouseLeave={(e) => e.target.style.transform="scale(1)"} />
//                 <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.18),transparent)" }} />
//                 <span className="badge" style={{ position:"absolute", top:14, left:14 }}>{s.tag}</span>
//                 <span className="jk" style={{ position:"absolute", bottom:12, right:14, fontSize:11, color:"rgba(255,255,255,.9)", fontWeight:500, background:"rgba(0,0,0,.3)", padding:"3px 10px", borderRadius:20, backdropFilter:"blur(8px)" }}>
//                   {s.readTime}
//                 </span>
//               </div>

//               {/* body */}
//               <div style={{ padding:"20px 22px 22px" }}>
//                 {/* author */}
//                 <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
//                   <div className="avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{s.initials}</div>
//                   <div>
//                     <div className="jk" style={{ fontSize:13, fontWeight:600, color:"#1a3a1a" }}>{s.author}</div>
//                     <div className="jk" style={{ fontSize:11, color:"#9aba9a", marginTop:1 }}>{s.ago}</div>
//                   </div>
//                 </div>

//                 <h2 className="fr" style={{ fontSize:18, fontWeight:700, color:"#1a3a1a", lineHeight:1.35, marginBottom:10 }}>{s.title}</h2>
//                 <p className="jk" style={{ fontSize:13, color:"#6a8a6a", lineHeight:1.75, fontWeight:300, marginBottom:16,
//                   display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
//                   {s.excerpt}
//                 </p>

//                 {/* footer */}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:"1px solid rgba(76,175,80,.1)" }}>
//                   <div style={{ display:"flex", gap:16 }}>
//                     <button className="like-btn jk" style={{ fontSize:12, color: likedStories.includes(s.id)?"#e53935":"#9aba9a", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
//                       onClick={(e) => toggleLike(s.id,e)}>
//                       {likedStories.includes(s.id) ? "❤️" : "🤍"} {s.likes + (likedStories.includes(s.id)?1:0)}
//                     </button>
//                     <span className="jk" style={{ fontSize:12, color:"#9aba9a", display:"flex", alignItems:"center", gap:4 }}>💬 {s.comments}</span>
//                   </div>
//                   <span className="jk" style={{ fontSize:12, color:"#43a047", fontWeight:600 }}>Read more →</span>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>

//         {filtered.length === 0 && (
//           <div style={{ textAlign:"center", padding:"80px 0" }}>
//             <div style={{ fontSize:60, marginBottom:16 }}>🌱</div>
//             <h3 className="fr" style={{ fontSize:24, color:"#3a6a3a" }}>No stories found</h3>
//             <p className="jk" style={{ color:"#8aaa8a", marginTop:8 }}>Try a different search or category</p>
//           </div>
//         )}
//       </main>

//       {/* ══════════════════════════════════════
//           STORY MODAL / POP-UP READER
//       ══════════════════════════════════════ */}
//       {selectedStory && (
//         <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>

//             {/* hero image */}
//             <div style={{ height:260, overflow:"hidden", borderRadius:"28px 28px 0 0", position:"relative" }}>
//               <img src={selectedStory.img} alt={selectedStory.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//               <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 50%)" }} />
//               {/* close btn */}
//               <button onClick={() => setSelectedStory(null)} style={{ position:"absolute", top:16, right:16, width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,.9)", backdropFilter:"blur(10px)", border:"none", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,.15)", transition:"transform .2s" }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform="scale(1.1)"}
//                 onMouseLeave={(e) => e.currentTarget.style.transform="scale(1)"}
//               >✕</button>
//               <span className="badge" style={{ position:"absolute", bottom:18, left:22, fontSize:12 }}>{selectedStory.tag}</span>
//             </div>

//             {/* content */}
//             <div style={{ padding:"32px 36px 40px" }}>
//               {/* meta */}
//               <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                   <div className="avatar" style={{ background: avatarColors[selectedStory.id % avatarColors.length], width:42, height:42, fontSize:14 }}>{selectedStory.initials}</div>
//                   <div>
//                     <div className="jk" style={{ fontSize:14, fontWeight:700, color:"#1a3a1a" }}>{selectedStory.author}</div>
//                     <div className="jk" style={{ fontSize:12, color:"#9aba9a", marginTop:1 }}>{selectedStory.ago} · {selectedStory.readTime}</div>
//                   </div>
//                 </div>
//                 <div style={{ display:"flex", gap:12, alignItems:"center" }}>
//                   <span className="jk" style={{ fontSize:13, color:"#9aba9a" }}>❤️ {selectedStory.likes}</span>
//                   <span className="jk" style={{ fontSize:13, color:"#9aba9a" }}>💬 {selectedStory.comments}</span>
//                 </div>
//               </div>

//               {/* title */}
//               <h1 className="fr" style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:900, color:"#1a3a1a", lineHeight:1.15, marginBottom:24 }}>
//                 {selectedStory.title}
//               </h1>

//               {/* divider */}
//               <div style={{ height:2, background:"linear-gradient(90deg,#4caf50,rgba(76,175,80,0))", borderRadius:2, marginBottom:28 }} />

//               {/* full content */}
//               <div className="modal-content">
//                 {selectedStory.content.split("\n\n").map((para, i) => (
//                   <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
//                 ))}
//               </div>

//               {/* footer actions */}
//               <div style={{ marginTop:32, paddingTop:24, borderTop:"1px solid rgba(76,175,80,.12)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                 <div style={{ display:"flex", gap:12 }}>
//                   <button className="btn-green" onClick={() => toggleLike(selectedStory.id,{stopPropagation:()=>{}})}>
//                     {likedStories.includes(selectedStory.id) ? "❤️ Liked" : "🤍 Like"}
//                   </button>
//                   <button className="btn-ghost">💬 Comment</button>
//                 </div>
//                 <button className="btn-ghost" onClick={() => setSelectedStory(null)}>✕ Close</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";

/* ─── STORIES DATA ──────────────────────────────────────── */
const allStories = [
  {
    id: 1, author: "Emma Rodriguez", initials: "ER", ago: "2 days ago",
    title: "My Journey with Vertical Farming in Urban Spaces",
    tag: "Urban Farming", readTime: "5 min read", likes: 142, comments: 28,
    img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
    excerpt: "Transforming my apartment balcony into a thriving vertical garden taught me invaluable lessons about space optimization and sustainable food production.",
    content: `When I first moved into my small apartment in the city, I thought growing my own food was a dream reserved for those lucky enough to have a garden. But a tiny balcony, some creativity, and a whole lot of determination changed everything.\n\nI started with a simple idea: stack planters vertically along the railing. Within weeks, I had lettuce, spinach, and herbs climbing three feet high. The key was choosing lightweight containers and fast-draining soil mixes to prevent waterlogging on a surface that sees heavy rain.\n\n**What I learned about light:**\nUrban balconies are tricky. Mine faced north-east, getting only about 4 hours of direct sunlight. I quickly learned that leafy greens — spinach, kale, chard — are far more forgiving in partial shade than tomatoes or peppers. Herbs like mint and parsley also thrived. I positioned mirrors strategically to reflect light back into shadowed corners, a trick I picked up from a community gardening forum.\n\n**Managing space cleverly:**\nWith only 6 square meters to work with, every centimeter counted. I built a tiered trellis from bamboo poles and zip ties — cost me less than ₹200 — and grew climbing beans that doubled as a privacy screen. Below it, I planted shade-tolerant nasturtiums that cascaded beautifully and were entirely edible.\n\n**Water and drainage:**\nThe biggest mistake I made early on was overwatering. Containers dry out fast in summer heat but stay waterlogged after heavy rains. I solved this by drilling extra drainage holes and placing pot feet to lift containers off the floor. A simple drip-tray system with pebbles let excess water evaporate rather than pool.\n\n**The harvest:**\nBy month three, I was harvesting enough greens for two salads a week. My mint had gone absolutely wild — I was giving bunches to neighbours. There's a profound satisfaction in eating something you grew yourself, even if it's just a handful of rocket leaves on a city balcony.\n\nThis experience changed how I think about food, space, and community. Urban farming isn't just about produce — it's about reconnecting with natural cycles in a concrete world. I encourage every horticulture student to try it, no matter how small their space.`,
  },
  {
    id: 2, author: "James Chen", initials: "JC", ago: "5 days ago",
    title: "Implementing IoT Sensors in Traditional Rice Paddies",
    tag: "AgriTech", readTime: "7 min read", likes: 198, comments: 45,
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    excerpt: "How I helped my family farm modernize with affordable technology while preserving traditional farming wisdom passed down through generations.",
    content: `My family has farmed rice in the same valley for four generations. When I came home after my first year of studying AgriTech, I wanted to bridge the gap between the knowledge I was gaining at university and the wisdom my grandfather had accumulated over decades.\n\nThe challenge wasn't technical — it was cultural. My grandfather was skeptical of sensors and dashboards. "I can tell when the paddy needs water by the colour of the sky," he said. And he wasn't wrong. But he was also working 14-hour days, and I wanted to give him something back.\n\n**Choosing the right sensors:**\nWe started small. I installed three soil moisture sensors from a local electronics supplier — total cost around ₹1,800 — connected to a Raspberry Pi Zero running a simple Python script. The data fed into a WhatsApp notification system (not a fancy app — my grandfather uses WhatsApp every day already).\n\n**The first season results:**\nWater usage dropped by 22%. Not because the sensors were smarter than my grandfather, but because they removed the anxiety of guessing. He stopped the precautionary over-watering he'd been doing "just in case." The sensors confirmed what he already knew and added confidence.\n\n**What traditional knowledge taught the technology:**\nHere's what surprised me most. When I mapped our sensor data against my grandfather's irrigation notes from the past decade, the patterns were nearly identical. His intuitive reading of wind direction, leaf curl, and soil colour was tracking moisture with remarkable accuracy. The sensors didn't replace his knowledge — they validated it.\n\nWe now use both. The sensors handle overnight monitoring and send alerts if moisture drops below threshold. My grandfather handles the nuanced decisions — adjusting for upcoming weather, managing micro-climates across different parts of the paddy.\n\n**Lessons for other students:**\nDon't arrive with technology and expect farmers to be grateful. Listen first. Understand the existing system deeply before proposing changes. The best agricultural technology amplifies human wisdom rather than replacing it.\n\nThe most important sensor on our farm is still my grandfather's hand, pressed into the mud at dawn.`,
  },
  {
    id: 3, author: "Sarah Johnson", initials: "SJ", ago: "1 week ago",
    title: "Regenerative Grazing: Results from My First Year",
    tag: "Livestock", readTime: "8 min read", likes: 167, comments: 33,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    excerpt: "Documenting the transformation of degraded pastureland through holistic management and rotational grazing practices across four seasons.",
    content: `A year ago, the south paddock of our family farm looked like the surface of the moon. Overgrazing over two decades had stripped the topsoil, compacted the ground so badly that water pooled rather than soaking in, and left behind nothing but broadleaf weeds and bare patches.\n\nI had one year, 40 hectares, and a herd of 60 mixed cattle to work with. This is what happened.\n\n**The Holistic Planned Grazing framework:**\nI followed the principles developed by Allan Savory, dividing the south paddock into 12 smaller cells using temporary electric fencing. The cattle graze intensively on one cell for 3–5 days, then move on. Each cell then rests for 60–90 days before being grazed again.\n\nThe idea is to mimic the movement patterns of wild herds — intense pressure followed by long recovery. The trampling of hooves breaks up soil crust, presses seeds into the ground, and incorporates plant litter into the surface. Then the rest period allows grasses to recover fully before being grazed again.\n\n**Month by month:**\nBy month two, I noticed earthworm activity returning to the first cells that had been rested. By month four, a native grass species I had never seen on this land appeared — apparently the seeds had been dormant in the soil. By month eight, the bare patches had reduced by roughly 60% by my estimate.\n\n**The water infiltration test:**\nI conduct a simple ring infiltration test quarterly. At the start of the year, water pooled on the surface for over 40 seconds before beginning to absorb. By month twelve, the same test showed absorption beginning within 8 seconds. Soil structure was visibly improving.\n\n**What I got wrong:**\nI underestimated recovery time in the dry summer months. I moved cattle back into cells too soon twice, and those cells showed setbacks. Flexibility is essential — the plan is a guide, not a rule.\n\nThe south paddock still has years of healing ahead. But the direction is clear, and the results after just one year are genuinely exciting. Regenerative grazing isn't a miracle — it's ecology working at its own pace.`,
  },
  {
    id: 4, author: "Priya Nair", initials: "PN", ago: "2 weeks ago",
    title: "Companion Planting: How I Tripled My Tomato Yield",
    tag: "Crop Science", readTime: "6 min read", likes: 221, comments: 52,
    img: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&q=80",
    excerpt: "A deep dive into the science and practice of companion planting that transformed my experimental plot into a thriving polyculture.",
    content: `Last season I ran a simple experiment on my university trial plot. One bed grew tomatoes alone — standard spacing, single crop. The adjacent bed grew tomatoes with basil, marigolds, and nasturtiums. The results were striking enough that I've completely changed how I think about monocultures.\n\n**The science behind companion planting:**\nPlants communicate through root exudates — chemical compounds released into the soil. Basil releases volatile compounds that appear to repel thrips and aphids, insects that devastate tomato crops. Marigolds produce alpha-terthienyl in their roots, a compound toxic to root-knot nematodes. Nasturtiums act as trap crops, drawing aphids away from tomatoes onto themselves.\n\n**Setting up the trial:**\nI planted both beds identically in terms of tomato variety (Pusa Ruby), spacing (60cm x 45cm), irrigation, and fertiliser. The companion bed added one basil plant every third tomato, a row of French marigolds along the border, and nasturtiums at the corners.\n\n**Results after 90 days:**\nThe monoculture bed produced an average of 2.8kg per plant. The companion bed produced 8.4kg per plant. I want to be careful about overclaiming — this was a single-season trial on a small plot, and many variables exist. But the difference was large enough to warrant serious attention.\n\nPest damage in the companion bed was also visibly lower. I counted aphid colonies on five plants in each bed: monoculture averaged 34 colonies per plant; companion bed averaged 7.\n\n**Practical takeaways for small farmers:**\nThe companion bed cost almost nothing extra — basil and marigold seeds are inexpensive, and nasturtiums self-seed freely. The labour involved in planting was perhaps 20% more. The yield benefit, if it holds across seasons, would be transformative for small-scale growers.\n\nMore research is needed. But this experiment convinced me that biodiversity in the field isn't just an ecological ideal — it's a practical strategy.`,
  },
  {
    id: 5, author: "Arjun Mehta", initials: "AM", ago: "3 weeks ago",
    title: "Biochar: Ancient Technology for Modern Soil Health",
    tag: "Sustainable Farming", readTime: "9 min read", likes: 134, comments: 19,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    excerpt: "Exploring the science of biochar application and its remarkable effects on soil carbon, water retention, and microbial activity.",
    content: `Biochar — charcoal produced through pyrolysis of organic matter — has been used in agriculture for over 2,000 years. The Terra Preta soils of the Amazon basin, created by indigenous peoples centuries ago, remain extraordinarily fertile today. Yet biochar is only now re-entering mainstream agricultural science.\n\nI spent six months applying biochar to degraded plots on our family's dryland farm in Rajasthan, where sandy soils and erratic rainfall make consistent yields a constant challenge.\n\n**What biochar does:**\nAt a microscopic level, biochar is a lattice of carbon with enormous surface area. One gram of high-quality biochar can have a surface area exceeding 300 square metres. This structure acts as a habitat for soil microbes and a reservoir for water and nutrients that would otherwise leach through sandy soils.\n\n**Production and application:**\nI built a simple cone kiln from sheet metal — cost approximately ₹3,500 — capable of producing 8–10kg of biochar per burn using agricultural residues (crop stalks, coconut shells, wood offcuts). The key is limiting oxygen during combustion to ensure pyrolysis rather than complete burning.\n\nRaw biochar must be charged before application. I soaked mine in diluted compost tea for two weeks, allowing microbial communities to colonise the char before it entered the soil. Uncharged biochar can temporarily immobilise soil nitrogen.\n\n**Results across three plots:**\nWater retention improved measurably in all three plots. In our sandiest plot, I observed the soil remaining moist 36 hours after irrigation compared to 14 hours in the untreated control. Germination rates improved by roughly 18% in the biochar plots.\n\nYield data after one season showed modest but consistent improvements — approximately 15% higher in the biochar plots. Experienced farmers tell me the effects compound over multiple seasons as microbial communities establish.\n\n**The carbon sequestration angle:**\nBiochar is one of the few agricultural practices that genuinely sequesters carbon. The carbon in biochar is stable for hundreds to thousands of years. As a student, I find the idea that farming itself could be part of the climate solution deeply motivating.`,
  },
];

const avatarColors = ["#059669","#047857","#10b981","#34d399","#065f46","#064e3b"];

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function Stories() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [likedStories,  setLikedStories]  = useState([]);

  // Filter only by Search Query
  const filtered = allStories.filter((s) => {
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.tag.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedStories((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#111827", overflow: "hidden" }}>

      {/* ── HIGHLY COLORFUL & ATTRACTIVE BACKGROUND ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)",
      }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "20%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* ══ GLOBAL STYLES ══ */}
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
        .it {
              font-family: 'Inter', sans-serif;
              font-style: italic;
              color: #475569; /* Soft grey looks great for modern sans-serif quotes */
            }

        /* Modern Colorful Card Styling */
        .story-card {
          background: rgba(255, 255, 255, 0.85); 
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 20px; 
          overflow: hidden; 
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }
        .story-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 2px rgba(16, 185, 129, 0.2);
          background: rgba(255, 255, 255, 0.95);
        }

        .search-container {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          transform: translateY(50%);
          z-index: 10;
        }
        .search-box {
          width: 100%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 100px;
          padding: 22px 32px 22px 64px;
          font-family: 'Plus Jakarta Sans', sans-serif; 
          font-size: 17px;
          font-weight: 500;
          color: #111827; 
          outline: none; 
          transition: all .3s ease;
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16,185,129,0.05);
        }
        .search-box::placeholder { color: #94a3b8; }
        .search-box:focus { 
          border-color: #10b981; 
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 20px 40px -10px rgba(0, 0, 0, 0.1); 
        }
        .search-icon {
          position: absolute;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          color: #10b981;
          pointer-events: none;
        }

        .btn-green {
          background: #059669; color: #fff;
          border: none; cursor: pointer; border-radius: 50px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 14px; padding: 12px 28px; transition: all .2s ease;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-green:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(5, 150, 105, 0.25); }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.6); color: #334155; 
          border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer; border-radius: 50px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 14px; padding: 12px 28px; transition: all .2s ease;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { background: #ffffff; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .like-btn {
          background: #f8faf9; border: 1px solid #e2e8f0; border-radius: 50px;
          cursor: pointer; padding: 6px 14px; display: flex; align-items: center; gap: 6px; 
          transition: all .2s; font-weight: 600; color: #475569;
        }
        .like-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
        .like-btn.liked { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

        /* ── MODAL SYSTEM ── */
        .modal-overlay {
          position: fixed; 
          top: 72px; /* Starts exactly below the nav bar */
          left: 0; right: 0; bottom: 0;
          z-index: 450; /* Sits UNDER the nav bar (z-index 500) */
          background: rgba(15, 23, 42, 0.35); 
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          display: flex; justify-content: center; align-items: center; /* PERFECTLY CENTERS THE BOX */
          padding: 40px 20px; /* Ensures equal 40px gap at top and bottom */
          animation: fadeIn .3s ease-out;
        }

        .modal-box {
          background: #ffffff;
          border-radius: 24px; 
          width: 100%; max-width: 800px;
          max-height: 100%; /* Will never exceed the overlay boundaries */
          display: flex; flex-direction: column;
          position: relative; 
          overflow: hidden; /* Contains the internal scroll */
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.2);
          animation: slideUp .4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* The custom internal scroll area for the modal */
        .modal-scroll-area {
          overflow-y: auto;
          flex-grow: 1;
          width: 100%;
        }
        .modal-scroll-area::-webkit-scrollbar { width: 6px; }
        .modal-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 4px; }
        .modal-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
        
        /* Fixed, Floating Close Button */
        .modal-close-btn {
          position: absolute; top: 20px; right: 20px; z-index: 100;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #ffffff; font-size: 20px; font-weight: 300;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .modal-close-btn:hover {
          background: #ffffff; color: #064e3b; transform: scale(1.1);
        }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .modal-content p {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 17px; line-height: 1.8; color: #334155;
          margin-bottom: 24px; font-weight: 400;
        }
        .modal-content strong, .modal-content b {
          font-weight: 700; color: #0f172a;
        }

        /* Navbar */
        .nav-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500; height: 72px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; transition: all 0.3s;
        }
        .nav-lk {
          color: #475569; text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 600;
          transition: color .2s; position: relative; padding-bottom: 4px;
        }
        .nav-lk:hover { color: #059669; }
        .nav-lk.active { color: #059669; }
        .nav-lk.active::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 100%; height: 2px; background: #059669; border-radius: 2px;
        }

        .tag-badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.9); color: #ffffff;
          backdrop-filter: blur(4px);
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px;
          font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 50px;
        }
        
        .avatar {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
          font-size: 14px; color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav className="nav-bar">
        <a href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <div style={{ width:40, height:40, borderRadius:"12px", background:"linear-gradient(135deg, #10b981, #047857)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color: "white", boxShadow: "0 4px 10px rgba(16,185,129,0.3)" }}>🌿</div>
          <span className="fr" style={{ fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing: "-0.5px" }}>Horti<span style={{ color:"#059669" }}>Verse</span></span>
        </a>
        <div style={{ display:"flex", gap:36 }}>
          {[["Home","/"],["Stories","/stories"],["Topics","/topics"],["Community","#"]].map(([n,h]) => (
            <a key={n} href={h} className={`nav-lk ${n==="Stories"?"active":""}`}>{n}</a>
          ))}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <a href="#" className="btn-ghost">Log in</a>
          <a href="#" className="btn-green">Join Free</a>
        </div>
      </nav>

      {/* ══ PAGE HEADER ══ */}
      <div style={{ paddingTop: 72, background: "transparent" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "50px 24px 0px", textAlign: "center" }}>
          <h1 className="fr" style={{ fontSize: "clamp(35px, 5vw, 60px)", fontWeight: 900, color: "#112a0f", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Explore ideas, research, and <br/> <span style={{ color:"#059669" }}>agricultural stories.</span>
          </h1>
          <p className="jk" style={{ marginTop: 20, fontSize: 16, color: "#475569", fontWeight: 500, lineHeight: 1.6, maxWidth: 800, margin: "20px auto 0" }}>
            Stay updated with the latest developments in agriculture and horticulture, including sustainable farming innovations and newly released crop varieties from leading institutes worldwide.
          </p>

          {/* Prominent Search Bar overlapping the section border */}
          <div className="search-container">
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
        
        {/* Result Header */}
        {searchQuery && (
          <p className="jk" style={{ fontSize: 16, color: "#475569", marginBottom: 32, fontWeight: 600, background: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: "12px", display: "inline-block" }}>
            Found <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> results for "{searchQuery}"
          </p>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
          {filtered.map((s, i) => {
            // Guarantee Max 60 characters for card title
            const shortTitle = s.title.length > 60 ? s.title.substring(0, 65).trim() + "..." : s.title;

            return (
              <article key={s.id} className="story-card" onClick={() => setSelectedStory(s)}>
                {/* image container */}
                <div style={{ height: 220, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                  <span className="tag-badge" style={{ position: "absolute", top: 16, left: 16 }}>{s.tag}</span>
                  <span className="jk" style={{ position: "absolute", bottom: 16, right: 16, fontSize: 12, color: "#fff", fontWeight: 700, background: "rgba(0,0,0,0.4)", padding: "6px 14px", borderRadius: 50, backdropFilter: "blur(8px)" }}>
                    {s.readTime}
                  </span>
                </div>

                {/* body container */}
                <div style={{ padding: "28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  
                  <h2 className="fr" style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: 12 }}>
                    {shortTitle}
                  </h2>
                  
                  <p className="jk" style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, fontWeight: 500, marginBottom: 24, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {s.excerpt}
                  </p>

                  {/* author & action row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{s.initials}</div>
                      <div>
                        <div className="jk" style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{s.author}</div>
                        <div className="jk" style={{ fontSize: 12, color: "#64748b", marginTop: 2, fontWeight: 500 }}>{s.ago}</div>
                      </div>
                    </div>
                    
                    <button className={`like-btn jk ${likedStories.includes(s.id) ? 'liked' : ''}`} onClick={(e) => toggleLike(s.id, e)}>
                      {likedStories.includes(s.id) ? "❤️" : "🤍"} {s.likes + (likedStories.includes(s.id)?1:0)}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
            <h3 className="fr" style={{ fontSize: 28, color: "#0f172a", fontWeight: 800 }}>No stories found</h3>
            <p className="jk" style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>We couldn't find any articles matching your search.</p>
            <button className="btn-ghost" style={{ marginTop: 24, background:"rgba(255,255,255,0.8)" }} onClick={() => setSearchQuery("")}>Clear Search</button>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          STORY MODAL / POP-UP READER
      ══════════════════════════════════════ */}
      {selectedStory && (
        <div className="modal-overlay" onClick={() => setSelectedStory(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            {/* 🔥 FIXED CLOSE BUTTON 🔥 */}
            <button className="modal-close-btn" onClick={() => setSelectedStory(null)}>✕</button>

            {/* SCROLLABLE INNER AREA */}
            <div className="modal-scroll-area">
              
              {/* hero image */}
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

              {/* content body */}
              <div style={{ padding: "40px 48px 60px" }}>
                
                {/* 🔥 ACTION BUTTONS MOVED TO TOP 🔥 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
                  
                  {/* Author Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div className="avatar" style={{ background: avatarColors[selectedStory.id % avatarColors.length], width: 48, height: 48, fontSize: 16 }}>{selectedStory.initials}</div>
                    <div>
                      <div className="jk" style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{selectedStory.author}</div>
                      <div className="jk" style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{selectedStory.ago} · {selectedStory.readTime}</div>
                    </div>
                  </div>

                  {/* Primary Actions (Like & Discuss) */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button 
                      className="btn-green" 
                      onClick={(e) => toggleLike(selectedStory.id, e)}
                      style={{
                        background: likedStories.includes(selectedStory.id) ? "#fef2f2" : "#059669",
                        color: likedStories.includes(selectedStory.id) ? "#dc2626" : "#fff",
                        border: likedStories.includes(selectedStory.id) ? "1px solid #fca5a5" : "1px solid transparent",
                        boxShadow: likedStories.includes(selectedStory.id) ? "none" : "0 4px 12px rgba(5, 150, 105, 0.3)"
                      }}
                    >
                      {likedStories.includes(selectedStory.id) ? "❤️ Loved it" : "🤍 Applaud"} · {selectedStory.likes + (likedStories.includes(selectedStory.id)?1:0)}
                    </button>
                    <button className="btn-ghost">💬 Discussion ({selectedStory.comments})</button>
                  </div>

                </div>

                {/* full text */}
                <div className="modal-content">
                  {selectedStory.content.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>") }} />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}