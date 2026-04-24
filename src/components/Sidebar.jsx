import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '[]' },
  { path: '/upload', label: 'Hiring Audit', icon: '+' },
  { path: '/layoff-audit', label: 'Layoff Audit', icon: '!' },
  { path: '/analysis', label: 'Risk Engine', icon: '*' },
  { path: '/report', label: 'Audit Logs', icon: '=' },
  { path: '/compliance', label: 'Compliance', icon: 'OK' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      width: 220, minHeight: '100vh', background: '#0D0D14',
      borderRight: '1px solid #1F2937', display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100
    }}>
      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>FAIRFORCE</div>
        <div style={{ color: '#4F46E5', fontSize: 10, letterSpacing: 2, marginTop: 2 }}>AI GOVERNANCE OS</div>
      </div>

      <div style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                cursor: 'pointer', textAlign: 'left',
                background: active ? '#1A1A2E' : 'transparent',
                color: active ? '#4F46E5' : '#9CA3AF',
                border: 'none', borderLeft: active ? '2px solid #4F46E5' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 11, width: 18, fontWeight: 700 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #1F2937' }}>
        <div style={{ color: '#9CA3AF', fontSize: 11 }}>2026 FAIRFORCE</div>
        <div style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>AI GOVERNANCE OS</div>
      </div>
    </div>
  );
};

export default Sidebar;
