import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BiasScoreRing from '../components/BiasScoreRing';
import FeatureWeightBar from '../components/FeatureWeightBar';
import { analyzeLayoffRisk, buildFallbackLayoffResult } from '../services/geminiservice';
import { saveAuditResult } from '../services/firebaseAuditService';

const DEMO_EMPLOYEE_DATA = `Employee: Meera Nair
Age: 47
Role: Senior QA Lead
Tenure: 13 years
Compensation band: High
Performance rating: Meets expectations
Recent leave: 42 days medical/caregiver leave
Productivity score: 68
Critical system ownership: Payments regression suite
Manager feedback: Reliable, high domain knowledge, slower sprint velocity after team restructuring`;

const LayoffAuditScreen = () => {
  const [employeeData, setEmployeeData] = useState(DEMO_EMPLOYEE_DATA);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const activeResult = result || buildFallbackLayoffResult(employeeData);

  const runAudit = async () => {
    setLoading(true);
    const audit = await analyzeLayoffRisk(employeeData);
    setResult(audit);
    localStorage.setItem('ff_layoff_result', JSON.stringify(audit));
    saveAuditResult({
      auditMoment: 'getting_out',
      auditType: 'layoff_scoring',
      employeeData,
      biasScore: audit.layoff_bias_score,
      highestRiskGroup: audit.highest_risk_group,
      proxyMetrics: audit.proxy_metrics,
      counterfactual: audit.counterfactual,
      recommendation: audit.recommendation,
    }).catch((saveError) => console.warn('Layoff audit save skipped:', saveError));
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ background: '#EF444420', color: '#EF4444', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, display: 'inline-block', marginBottom: 8 }}>
              GETTING OUT AUDITOR
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>Layoff Decision Fairness Audit</h1>
            <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
              Detects biased productivity, age, tenure, salary, leave, and diversity proxies before workforce decisions are finalized.
            </p>
          </div>
          <button
            onClick={runAudit}
            disabled={loading}
            style={{ background: loading ? '#374151' : '#4F46E5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Auditing...' : 'Run Layoff Audit'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Employee Decision Inputs</div>
            <textarea
              value={employeeData}
              onChange={(e) => {
                setEmployeeData(e.target.value);
                setResult(null);
              }}
              style={{
                width: '100%', minHeight: 330, resize: 'vertical', background: '#0A0A0F',
                border: '1px solid #1F2937', borderRadius: 8, padding: 14,
                color: '#D1D5DB', fontSize: 12, lineHeight: 1.6, fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 16 }}>LAYOFF BIAS SCORE</div>
            <BiasScoreRing score={activeResult.layoff_bias_score} size={180} />
            <div style={{ marginTop: 24, background: '#0A0A0F', border: '1px solid #7F1D1D', borderRadius: 8, padding: 16 }}>
              <div style={{ color: '#FCA5A5', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>HIGHEST RISK GROUP</div>
              <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.6 }}>{activeResult.highest_risk_group}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Proxy Metric Breakdown</div>
            {activeResult.proxy_metrics.map((item, index) => (
              <div key={index} style={{ marginBottom: 18 }}>
                <FeatureWeightBar label={item.metric} value={item.risk} color={item.risk > 70 ? '#EF4444' : '#F59E0B'} />
                <div style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 1.5 }}>{item.why}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Counterfactual & Action</div>
            <div style={{ background: '#0A0A0F', borderLeft: '3px solid #10B981', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ color: '#10B981', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>SIMULATED CHANGE</div>
              <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.7 }}>{activeResult.counterfactual}</div>
            </div>
            <div style={{ background: '#0A0A0F', borderLeft: '3px solid #4F46E5', borderRadius: 8, padding: 16 }}>
              <div style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>RECOMMENDATION</div>
              <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.7 }}>{activeResult.recommendation}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoffAuditScreen;
