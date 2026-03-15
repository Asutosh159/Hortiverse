import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assests/logoHV.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  // 2. 🟢 DYNAMICALLY ADD ADMIN LINK
  if (user?.role === 'admin') {
    links.push({ label: "Admin Panel", path: "/admin" });
  }

  const getInitials = (name) => {
    if (!name) return "A"; // Changed to A for Admin fallback
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <nav style={styles.nav}>
      {/* 🟢 NEW: Added style block for the logo hover effect */}
      <style>{`
        .logo-img {
          height: 59px; /* Enlarged to fit the navbar better */
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease; /* Smooth transition */
        }
        .logo-img:hover {
          transform: scale(1.2); /* Enlarges by 20% on hover */
        }
      `}</style>

      {/* ── LEFT: Logo ── */}
      <Link to="/" style={styles.logoContainer}>
        {/* 🟢 CHANGED: Using the CSS class for hover instead of inline styles */}
        <img 
          src={logo} 
          alt="HortiVerse Logo" 
          className="logo-img"
        />
        <span style={styles.logoText}>
          Horti<span style={{ color: "#2e7d32" }}>Verse</span>
        </span>
      </Link>

      {/* ── CENTER: Navigation Links ── */}
      <div style={styles.linksContainer}>
        {links.map((lk) => {
          const isActive = location.pathname === lk.path;
          const isAdminLink = lk.label === "Admin Panel";
          
          return (
            <Link
              key={lk.label}
              to={lk.path}
              style={{
                ...styles.link,
                color: isActive ? "#2e7d32" : isAdminLink ? "#059669" : "#4a5568",
                borderBottom: isActive ? "2px solid #2e7d32" : "2px solid transparent",
                fontWeight: isActive || isAdminLink ? "700" : "500",
                // Highlight the admin link slightly
                background: isAdminLink ? "#f0fdf4" : "transparent",
                padding: isAdminLink ? "6px 12px" : "0 0 6px 0",
                borderRadius: isAdminLink ? "8px" : "0",
              }}
            >
              {isAdminLink && <span style={{ marginRight: '5px' }}>⚙️</span>}
              {lk.label}
            </Link>
          );
        })}
      </div>

      {/* ── RIGHT: Auth Buttons / Profile ── */}
      <div style={styles.rightContainer}>
        {user ? (
          <div style={styles.profileArea}>
            <div style={styles.avatar} title={user.role === 'admin' ? 'Admin' : 'Student'}>
              {getInitials(user.full_name)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={styles.welcomeText}>Hi, {user.full_name ? user.full_name.split(" ")[0] : "Admin"}</span>
              
              {user.role === 'admin' && (
                <span style={{ fontSize: '10px', color: '#2e7d32', fontWeight: 'bold', textTransform: 'uppercase' }}>Super Admin</span>
              )}
            </div>
            <button onClick={handleLogout} style={styles.btnLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" style={styles.btnLogin}>Login</Link>
            <Link to="/UnderDevelopment" style={styles.btnJoin}>Join Community ›</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { 
    display: "flex", alignItems: "center", justifyContent: "space-between", 
    padding: "16px 48px", background: "#ffffff", borderBottom: "1px solid #edf2f7", 
    position: "sticky", top: 0, zIndex: 1000 
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "13px", textDecoration: "none" },
  logoIcon: { 
    width: "36px", height: "36px", borderRadius: "50%", 
    background: "linear-gradient(135deg, #66bb6a, #2e7d32)", 
    display: "flex", alignItems: "center", justifyContent: "center", 
    color: "white", fontSize: "18px" 
  },
  logoText: { fontSize: "22px", fontWeight: "800", color: "#1a202c", fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" },
  linksContainer: { display: "flex", gap: "28px", alignItems: 'center' },
  link: { textDecoration: "none", fontSize: "15px", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s ease" },
  rightContainer: { display: "flex", alignItems: "center", gap: "14px" },
  btnLogin: { 
    textDecoration: "none", color: "#2e7d32", border: "1.5px solid #2e7d32", 
    padding: "8px 22px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", 
    fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" 
  },
  btnJoin: { 
    textDecoration: "none", background: "#2e7d32", color: "white", 
    padding: "9.5px 22px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", 
    fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" 
  },
  profileArea: { 
    display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", 
    padding: "6px 16px 6px 6px", borderRadius: "50px", border: "1px solid #dcfce7" 
  },
  avatar: { 
    width: "32px", height: "32px", borderRadius: "50%", background: "#2e7d32", 
    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", 
    fontWeight: "700", fontSize: "13px", fontFamily: "'Plus Jakarta Sans', sans-serif" 
  },
  welcomeText: { fontSize: "14px", fontWeight: "700", color: "#1a202c", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: "1" },
  btnLogout: { 
    background: "transparent", border: "none", color: "#e53e3e", fontSize: "13px", 
    fontWeight: "700", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginLeft: "8px", transition: "color 0.2s"
  }
};