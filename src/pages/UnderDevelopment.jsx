import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnderDevelopment() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes sprout {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .plant-icon { animation: sprout 1s ease-out forwards, float 3s ease-in-out infinite 1s; }
        .btn-home { 
          background: #059669; color: white; border: none; padding: 12px 24px; 
          border-radius: 50px; font-family: sans-serif; font-weight: 600; 
          cursor: pointer; transition: 0.3s; margin-top: 20px;
        }
        .btn-home:hover { background: #047857; transform: scale(1.05); }
      `}</style>

      <div className="plant-icon" style={{ fontSize: '80px', marginBottom: '20px' }}>🌱</div>
      
      <h1 style={styles.title}>Cultivating Something New</h1>
      
      <p style={styles.text}>
        The <b>HortiVerse Community</b> section is currently being prepared for harvest. 
        We're building a space for students to connect, share, and grow together.
      </p>

      <div style={styles.progressBox}>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        <span style={styles.progressText}>Development in progress...</span>
      </div>

      <button className="btn-home" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  title: { fontSize: '32px', color: '#064e3b', marginBottom: '16px', fontWeight: '800' },
  text: { fontSize: '16px', color: '#475569', maxWidth: '500px', lineHeight: '1.6', marginBottom: '30px' },
  progressBox: { width: '100%', maxWidth: '300px' },
  progressBar: { width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' },
  progressFill: { width: '65%', height: '100%', background: '#10b981', borderRadius: '10px' },
  progressText: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }
};