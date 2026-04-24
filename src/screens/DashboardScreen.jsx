import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BiasScoreRing from '../components/BiasScoreRing';
import FeatureWeightBar from '../components/FeatureWeightBar';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const savedResult = localStorage.getItem('ff_bias_result');
  const result = savedResult ? JSON.parse(savedResult) : null;

  const biasScore = result?.bias_score || 67;
  const fw = result?.feature_weights || { skills_competencies: 35, college_tier: 34, location_density: 26, experience_years: 5 };

  const heatmapData = Array.from({ length: 7 }, (_, i) =>
    Array.from({ length: 5 }, (_, j) => Math.floor(Math.random() * 100))
  );

  const getHeatColor = (val) => {
    if (val > 70) return '#EF4444';
    if (val > 40) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ background: '#EF444420', color: '#EF4444', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                ▲ HIGH PROXY BIAS DETECTED
              </div>
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>Bias Score Dashboard</h1>
            <div style={{ color: '#6B7280', fontSize: 11, marginTop: 4 }}>Audit Run ID: #FF-8629-2024 • Last Updated: 2m ago</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid #374151', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
              Export Report
            </button>
            <button onClick={() => navigate('/upload')} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Re-Audit Model
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, marginBottom: 24 }}>
          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 28 }}>
            <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 20 }}>AGGREGATED BIAS SCORE</div>
            <BiasScoreRing score={biasScore} size={180} />
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10B981', fontSize: 10, marginBottom: 4 }}>Optimal</div>
                <div style={{ width: 40, height: 3, background: '#10B981', borderRadius: 2 }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#F59E0B', fontSize: 10, marginBottom: 4 }}>Medium</div>
                <div style={{ width: 40, height: 3, background: '#F59E0B', borderRadius: 2 }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#EF4444', fontSize: 10, marginBottom: 4 }}>Critical</div>
                <div style={{ width: 40, height: 3, background: '#EF4444', borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#9CA3AF', fontSize: 10 }}>IMPACT LEVEL</div>
                <div style={{ color: '#EF4444', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Severe</div>
              </div>
              <div>
                <div style={{ color: '#9CA3AF', fontSize: 10 }}>CONFIDENCE</div>
                <div style={{ color: '#10B981', fontSize: 16, fontWeight: 700, marginTop: 4 }}>92%</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>Feature Weight Breakdown</div>
              <div style={{ color: '#4F46E5', fontSize: 12, cursor: 'pointer' }}>ⓘ</div>
            </div>
            <FeatureWeightBar label="Skills & Competencies" value={fw.skills_competencies || 35} color="#10B981" />
            <FeatureWeightBar label="College Tier (Proxy)" value={fw.college_tier || 34} color="#EF4444" />
            <FeatureWeightBar label="Location Density" value={fw.location_density || 26} color="#F59E0B" />
            <FeatureWeightBar label="Experience Years" value={fw.experience_years || 5} color="#3B82F6" />

            <div style={{ marginTop: 24, background: '#0A0A0F', borderRadius: 8, padding: 16, border: '1px solid #7F1D1D' }}>
              <div style={{ color: '#FCA5A5', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>ROOT CAUSE IDENTIFIED</div>
              <div style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 1.6 }}>
                {result?.root_cause || '"College Tier" is currently acting as a proxy for socioeconomic status, constituting 34% of outcome weights.'}
              </div>
              <button onClick={() => navigate('/analysis')} style={{ marginTop: 12, color: '#4F46E5', background: 'none', border: 'none', fontSize: 12, cursor: 'pointer' }}>
                View Mitigation Steps
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Fairness Risk Heatmap</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
              {heatmapData.map((row, i) =>
                row.map((val, j) => (
                  <div key={`${i}-${j}`} style={{
                    height: 28, borderRadius: 4,
                    background: getHeatColor(val), opacity: 0.6 + val / 250
                  }} />
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {[{ color: '#EF4444', label: 'High Risk' }, { color: '#F59E0B', label: 'Moderate' }, { color: '#10B981', label: 'Low Risk' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                  <span style={{ color: '#9CA3AF', fontSize: 10 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Summary Insight</div>
            <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              {result?.summary_insight || 'The model displays significant unintentional proxy bias correlated to socio-economic indicators. College Tier is acting as a discriminatory proxy affecting candidate selection probability.'}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/report')} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', flex: 1 }}>
                Generate Report
              </button>
              <button onClick={() => navigate('/compliance')} style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid #374151', padding: '10px 20px', borderRadius: 8, fontSize: 12, cursor: 'pointer', flex: 1 }}>
                Check Compliance
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'AUDITS SCANNED', value: '1,204', color: '#FFFFFF' },
            { label: 'ANOMALIES', value: '42', color: '#EF4444' },
            { label: 'COMPLIANCE', value: 'Failed', color: '#EF4444' },
            { label: 'LAST RUN', value: 'Today', color: '#10B981' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ color: '#6B7280', fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
              <div style={{ color: item.color, fontSize: 22, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
