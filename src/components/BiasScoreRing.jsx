import React from 'react';
import { getBiasColor } from '../core/theme';

const BiasScoreRing = ({ score, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getBiasColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1F2937" strokeWidth="12" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center'
      }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 700, color, lineHeight: 1 }}>{score}%</div>
        <div style={{ fontSize: size * 0.1, color: '#9CA3AF', marginTop: 4 }}>BIASED</div>
      </div>
    </div>
  );
};

export default BiasScoreRing;
