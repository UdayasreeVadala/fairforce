import React from 'react';

const CounterfactualCard = ({ originalScore, newScore, delta, interpretation, originalCollege, newCollege }) => {
  return (
    <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
        <span style={{ color: '#EF4444', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>COUNTERFACTUAL ANALYSIS</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ background: '#0A0A0F', borderRadius: 10, padding: 16, textAlign: 'center' }}>
          <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 8 }}>ORIGINAL PROFILE</div>
          <div style={{ color: '#D1D5DB', fontSize: 13, marginBottom: 12 }}>{originalCollege || 'State University'}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#EF4444' }}>{originalScore}%</div>
          <div style={{ color: '#9CA3AF', fontSize: 11 }}>bias score</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#10B981', fontSize: 24, fontWeight: 700 }}>+{delta}%</div>
          <div style={{ color: '#9CA3AF', fontSize: 10 }}>COLLEGE SWAP</div>
          <div style={{ fontSize: 20, color: '#4F46E5', margin: '4px 0' }}>to</div>
        </div>
        <div style={{ background: '#0A0A0F', borderRadius: 10, padding: 16, textAlign: 'center', border: '1px solid #10B981' }}>
          <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 8 }}>MODIFIED PROFILE</div>
          <div style={{ color: '#D1D5DB', fontSize: 13, marginBottom: 12 }}>{newCollege || 'IIT Bombay'}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#10B981' }}>{newScore}%</div>
          <div style={{ color: '#9CA3AF', fontSize: 11 }}>bias score</div>
        </div>
      </div>
      <div style={{ background: '#1A1A0A', border: '1px solid #854D0E', borderRadius: 8, padding: 14 }}>
        <div style={{ color: '#FCD34D', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>FAIRNESS VIOLATION DETECTED</div>
        <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.6 }}>
          Same person. Different college. Completely different outcome.
        </div>
        {interpretation && (
          <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>{interpretation}</div>
        )}
      </div>
    </div>
  );
};

export default CounterfactualCard;
