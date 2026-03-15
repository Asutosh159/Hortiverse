import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assests/logoHV.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // 🟢 NEW: State to control the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("hv_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hv_user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  // 1. Define your base links
  let links = [
    { label: "Home",      path: "/" },
    { label: "Stories",   path: "/stories" },
    { label: "Topics",    path: "/topics" },
    { label: "Community", path: "/UnderDevelopment" },
    { label: "Resources", path: "/resources" },
  ];

  // 2. DYNAMICALLY ADD ADMIN LINK
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    links.push({ label: "Admin Panel", path: "/admin" });
  }

  const getInitials = (name) => {
    if (!name) return "A"; // Changed to A for Admin fallback
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-[1000] bg-white border-b border-[#edf2f7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* ── LEFT: Logo ── */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img 
              src={logo} 
              alt="HortiVerse Logo" 
              className="h-[50px] md:h-[59px] w-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <span className="text-[22px] font-extrabold text-[#1a202c] font-['Fraunces'] tracking-[-0.5px]">
              Horti<span className="text-[#2e7d32]">Verse</span>
            </span>
          </Link>

          {/* ── CENTER: Desktop Navigation Links ── */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((lk) => {
              const isActive = location.pathname === lk.path;
              const isAdminLink = lk.label === "Admin Panel";
              
              return (
                <Link
                  key={lk.label}
                  to={lk.path}
                  className={`text-[15px] font-['Plus_Jakarta_Sans'] transition-all duration-200 ${
                    isActive ? "text-[#2e7d32] border-b-2 border-[#2e7d32] font-bold pb-1" : 
                    isAdminLink ? "text-[#059669] bg-[#f0fdf4] px-3 py-1.5 rounded-lg font-bold hover:bg-[#dcfce7]" : 
                    "text-[#4a5568] border-b-2 border-transparent font-medium hover:text-[#2e7d32] pb-1"
                  }`}
                >
                  {isAdminLink && <span className="mr-1.5">⚙️</span>}
                  {lk.label}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT: Desktop Auth / Profile ── */}
          <div className="hidden lg:flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-3 bg-[#f0fdf4] py-1.5 pl-1.5 pr-4 rounded-full border border-[#dcfce7]">
                <div className="w-8 h-8 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-bold text-[13px] font-['Plus_Jakarta_Sans']" title={user.role === 'admin' || user.role === 'superadmin' ? 'Admin' : 'Student'}>
                  {getInitials(user.full_name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#1a202c] font-['Plus_Jakarta_Sans'] leading-none">
                    Hi, {user.full_name ? user.full_name.split(" ")[0] : "Admin"}
                  </span>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <span className="text-[10px] text-[#2e7d32] font-bold uppercase mt-1 leading-none">Super Admin</span>
                  )}
                </div>
                <button onClick={handleLogout} className="bg-transparent border-none text-[#e53e3e] text-[13px] font-bold cursor-pointer font-['Plus_Jakarta_Sans'] ml-2 transition-colors hover:text-red-700">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[#2e7d32] border-2 border-[#2e7d32] px-5 py-2 rounded-full text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-all hover:bg-[#f0fdf4]">
                  Login
                </Link>
                <Link to="/UnderDevelopment" className="bg-[#2e7d32] text-white px-5 py-2 rounded-full text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-all hover:bg-[#1b5e20] shadow-md">
                  Join Community ›
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE: Hamburger Button ── */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1a202c] hover:text-[#2e7d32] focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE: Dropdown Menu ── */}
      <div className={`lg:hidden absolute w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 py-6 space-y-2 flex flex-col font-['Plus_Jakarta_Sans']">
          {links.map((lk) => {
            const isActive = location.pathname === lk.path;
            const isAdminLink = lk.label === "Admin Panel";
            return (
              <Link 
                key={lk.label} 
                to={lk.path} 
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                className={`block px-4 py-3 rounded-xl text-[16px] transition-colors ${
                  isActive ? "bg-[#f0fdf4] text-[#2e7d32] font-bold" : 
                  isAdminLink ? "text-[#059669] font-extrabold bg-emerald-50 mt-2" : 
                  "text-[#334155] font-semibold hover:bg-gray-50"
                }`}
              >
                {isAdminLink && <span className="mr-2">⚙️</span>}
                {lk.label}
              </Link>
            );
          })}

          <hr className="border-gray-200 my-4" />

          {/* Mobile Auth / Profile */}
          {user ? (
            <div className="flex items-center justify-between bg-[#f0fdf4] p-4 rounded-2xl border border-[#dcfce7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2e7d32] flex items-center justify-center text-white font-bold text-[15px] shadow-inner">
                  {getInitials(user.full_name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-extrabold text-[#0f172a] leading-tight">
                    {user.full_name ? user.full_name.split(" ")[0] : "Admin"}
                  </span>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <span className="text-[11px] font-bold uppercase tracking-wider leading-tight text-[#2e7d32] mt-1">
                      Super Admin
                    </span>
                  )}
                </div>
              </div>
              <button onClick={handleLogout} className="text-[#e53e3e] font-bold text-sm bg-red-50 px-4 py-2 rounded-full border border-red-100">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-[#2e7d32] border-2 border-[#2e7d32] px-6 py-3 rounded-full font-bold text-[15px]">
                Sign In
              </Link>
              <Link to="/UnderDevelopment" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-[#2e7d32] text-white px-6 py-3 rounded-full font-bold text-[15px] shadow-md">
                Join Community
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}