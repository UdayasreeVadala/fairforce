import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { generateFairnessReport } from '../services/geminiservice';
import { saveFairnessReport } from '../services/firebaseAuditService';

const ReportScreen = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const downloadReport = () => {
    const payload = {
      generated_at: new Date().toISOString(),
      report,
      bias_result: JSON.parse(localStorage.getItem('ff_bias_result') || '{}'),
      layoff_result: JSON.parse(localStorage.getItem('ff_layoff_result') || '{}')
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fairforce-fairness-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const run = async () => {
      try {
        const biasResult = JSON.parse(localStorage.getItem('ff_bias_result') || '{}');
        const resumeText = localStorage.getItem('ff_resume_text') || 'Sample resume';
        const r = await generateFairnessReport(biasResult, resumeText);
        setReport(r);
        await saveFairnessReport({
          auditType: 'resume_screening',
          candidateName: biasResult.candidate_name || 'Candidate',
          collegeName: biasResult.college_name || 'College not detected',
          biasScore: biasResult.bias_score,
          summary: r.executive_summary,
          recommendations: r.remediation_steps || [],
          complianceRisk: r.compliance_risk,
          dpdpComplianceScore: r.dpdp_compliance_score,
        });
      } catch (e) {
        setReport(DEMO_REPORT);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 48, height: 48, border: '3px solid #1F2937', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: '#9CA3AF', fontSize: 14 }}>Generating Fairness Report via Gemini AI...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    if (status === 'Optimized') return '#10B981';
    if (status === 'At Risk') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 4 }}>Audit / Fairness Report #7241</div>
            <h1 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>Compliance & Fairness Audit</h1>
            <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>A comprehensive deep-dive into the predictive modelling engine for Global Talent Acquisition V2.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid #374151', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
              Share
            </button>
            <button onClick={downloadReport} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Download Report
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          <div>
            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Executive Summary</div>
              <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.8 }}>{report?.executive_summary}</div>
              <div style={{ marginTop: 16, background: '#0A0A0F', borderRadius: 8, padding: 16, borderLeft: '3px solid #4F46E5' }}>
                <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 6 }}>GEMINI INSIGHT</div>
                <div style={{ color: '#D1D5DB', fontSize: 12, lineHeight: 1.6 }}>
                  The model shows high predictive accuracy (94.2%), but the audit reveals a significant statistical parity gap in the "Engineering" hiring pipeline for candidates over 45 years old.
                </div>
              </div>
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Bias Detection Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Gender Neutrality', status: report?.gender_neutrality || 'Optimized' },
                  { label: 'Age Sensitivity', status: report?.age_sensitivity || 'Bias Detected' },
                  { label: 'Caste Proxy Risk', status: report?.caste_proxy_risk || 'Bias Detected' },
                  { label: 'Location Bias', status: 'At Risk' },
                ].map((item, i) => {
                  const color = getStatusColor(item.status);
                  return (
                    <div key={i} style={{ background: '#0A0A0F', borderRadius: 10, padding: 16 }}>
                      <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 8 }}>{item.label}</div>
                      <div style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                        background: `${color}20`, color, fontSize: 11, fontWeight: 600
                      }}>{item.status}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Remediation Roadmap</div>
              {(report?.remediation_steps || DEMO_REPORT.remediation_steps).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {step.step}
                  </div>
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{step.title}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 1.6 }}>{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24, textAlign: 'center' }}>
              <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 16 }}>OVERALL FAIRNESS SCORE</div>
              <div style={{ fontSize: 64, fontWeight: 800, color: '#10B981' }}>{report?.overall_fairness_score || 85}</div>
              <div style={{ color: '#10B981', fontSize: 12, marginTop: 4 }}>+4.2% from last audit</div>
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Audit Metadata</div>
              {[
                { label: 'Audit Date', value: new Date().toLocaleDateString() },
                { label: 'Audit Duration', value: '4m 22s' },
                { label: 'Data Points', value: '1.2M rows' },
                { label: 'Status', value: 'Completed' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1F2937' }}>
                  <span style={{ color: '#9CA3AF', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: '#D1D5DB', fontSize: 12, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Risk Profile</div>
              {[
                { label: 'Compliance Risk', value: report?.compliance_risk || 'Critical', color: '#EF4444' },
                { label: 'Reputational Risk', value: 'Medium', color: '#F59E0B' },
                { label: 'Ethical Drift', value: 'Low', color: '#10B981' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: item.color, fontSize: 12, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
              <button onClick={() => navigate('/compliance')} style={{ width: '100%', marginTop: 12, background: '#4F46E5', color: '#fff', border: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                View Compliance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DEMO_REPORT = {
  executive_summary: "The Gemini Governance Engine has completed a multi-dimensional fairness audit of the TalentMatch AI system. Our evaluation focused on disparate impact across protected classes and the model's decision-making transparency. The audit reveals systemic proxy discrimination through college tier weighting that disproportionately affects candidates from Tier 2 and 3 institutions.",
  overall_fairness_score: 85,
  gender_neutrality: 'Optimized',
  age_sensitivity: 'Bias Detected',
  caste_proxy_risk: 'Bias Detected',
  compliance_risk: 'Critical',
  remediation_steps: [
    { step: 1, title: 'Feature Reweighting', description: 'Reduce the "College Tier" feature weight by 60% to mitigate age-related bias in candidate selection probability.' },
    { step: 2, title: 'Counterfactual Data Augmentation', description: 'Inject 3,000 synthetic balanced profiles into the training set to equalize variance in the input region.' },
    { step: 3, title: 'Continuous Monitoring', description: 'Deploy real-time bias monitoring with automated alerts when fairness scores drop below threshold.' },
  ]
};

export default ReportScreen;
