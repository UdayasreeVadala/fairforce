import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '20%', right: '15%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)'
        }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', maxWidth: 1100, gap: 60, padding: '0 40px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ color: '#10B981', fontSize: 11, fontWeight: 600, letterSpacing: 2 }}>SYSTEM STATUS: OPTIMAL</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 16 }}>
            No Algorithm<br />Should End a<br />
            <span style={{ color: '#4F46E5' }}>Career Unfairly</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 16, lineHeight: 1.7, marginBottom: 40, maxWidth: 420 }}>
            The world's first AI Governance Operating System designed to audit bias, mitigate risk, and ensure ethical accountability in automated decision-making.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#FFFFFF', color: '#0A0A0F', border: 'none',
                padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => navigate('/upload')}
              style={{
                background: 'transparent', color: '#D1D5DB',
                border: '1px solid #374151', padding: '12px 24px',
                borderRadius: 8, fontSize: 14, cursor: 'pointer'
              }}
            >
              View Demo
            </button>
          </div>
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { icon: '⊕', title: 'Bias Audits', desc: 'Automated bias detection across demographic groups' },
                { icon: '◈', title: 'Risk Engine', desc: 'Real-time threat detection for discriminatory practices' },
                { icon: 'OK', title: 'Policy Manager', desc: 'Align your hiring architecture with global AI regulations' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ color: '#4F46E5', fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: '#6B7280', fontSize: 11, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 16, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>Live Bias Detection</div>
            <div style={{ background: '#EF444420', color: '#EF4444', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
              BIAS DETECTED
            </div>
          </div>
          <div style={{ background: '#0A0A0F', borderRadius: 10, padding: 20, marginBottom: 16 }}>
            <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 12 }}>FEATURE WEIGHT ANALYSIS</div>
            {[
              { label: 'College Tier (Proxy)', value: 78, color: '#EF4444' },
              { label: 'Skills Match', value: 92, color: '#10B981' },
              { label: 'Location Density', value: 45, color: '#F59E0B' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#D1D5DB', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: item.color, fontSize: 12, fontWeight: 600 }}>{item.value}%</span>
                </div>
                <div style={{ background: '#1F2937', borderRadius: 3, height: 4 }}>
                  <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#1A0A0A', border: '1px solid #7F1D1D', borderRadius: 8, padding: 14 }}>
            <div style={{ color: '#FCA5A5', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>ROOT CAUSE IDENTIFIED</div>
            <div style={{ color: '#9CA3AF', fontSize: 12 }}>
              "College Tier" is acting as a proxy for socioeconomic status, driving 34% of outcome weights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
