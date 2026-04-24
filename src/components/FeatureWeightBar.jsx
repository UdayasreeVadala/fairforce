import React from 'react';

const FeatureWeightBar = ({ label, value, color }) => {
  const barColor = color || (value > 60 ? '#EF4444' : value > 40 ? '#F59E0B' : '#10B981');
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#D1D5DB', fontSize: 13 }}>{label}</span>
        <span style={{ color: barColor, fontSize: 13, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ background: '#1F2937', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`, height: '100%', background: barColor,
          borderRadius: 4, transition: 'width 1s ease-in-out'
        }} />
      </div>
    </div>
  );
};

export default FeatureWeightBar;
