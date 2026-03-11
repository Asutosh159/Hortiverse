import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home",      path: "/"        },
    { label: "Stories",   path: "/stories" },
    { label: "Topics",    path: "/topics"  },
    { label: "Community", path: "/community" },
    { label: "Resources", path: "/resources" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');

        .nav-lk {
          color: #1a3a1a; text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: .01em;
          transition: color .2s; position: relative; padding-bottom: 3px;
        }
        .nav-lk::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 2.5px;
          background: linear-gradient(90deg, #4caf50, #81c784);
          border-radius: 2px; transition: width .28s;
        }
        .nav-lk:hover { color: #43a047; }
        .nav-lk:hover::after { width: 100%; }
        .nav-lk.active { color: #43a047; font-weight: 700; }
        .nav-lk.active::after { width: 100%; }

        .btn-nav-solid {
          background: linear-gradient(135deg, #43a047, #1b5e20);
          color: #fff; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: 13px; letter-spacing: .02em; text-decoration: none;
          padding: 10px 24px; border-radius: 50px;
          display: inline-flex; align-items: center; gap: 5px;
          transition: all .3s; box-shadow: 0 4px 16px rgba(67,160,71,.38);
        }
        .btn-nav-solid:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(67,160,71,.5);
          filter: brightness(1.06);
        }

        .btn-nav-outline {
          background: rgba(255,255,255,0.8);
          color: #2e7d32; border: 1.5px solid rgba(67,160,71,.45);
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 13px; text-decoration: none;
          padding: 9px 22px; border-radius: 50px;
          display: inline-flex; align-items: center; gap: 5px;
          transition: all .3s;
        }
        .btn-nav-outline:hover {
          background: rgba(76,175,80,.1);
          border-color: #4caf50;
          transform: translateY(-2px);
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 48px",
        height: 68,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderBottom: "1.5px solid rgba(76,175,80,0.18)",
        boxShadow: scrollY > 40
          ? "0 4px 28px rgba(60,140,60,0.14)"
          : "0 2px 16px rgba(60,140,60,0.08)",
        transition: "box-shadow .35s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg,#66bb6a,#1b5e20)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 14px rgba(76,175,80,.4)",
            flexShrink: 0,
          }}>🌿</div>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 21, fontWeight: 700, color: "#1a3a1a" }}>
            Horti<span style={{ color: "#43a047" }}>Verse</span>
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={label}
                to={path}
                className={`nav-lk ${isActive ? "active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/login" className="btn-nav-outline">Login</Link>
          <Link to="/join"  className="btn-nav-solid">
            Join Community <span style={{ fontSize: 13 }}>›</span>
          </Link>
        </div>
      </nav>
    </>
  );
}