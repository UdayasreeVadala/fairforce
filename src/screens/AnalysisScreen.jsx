import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CounterfactualCard from '../components/CounterfactualCard';
import { analyzeBias, runCounterfactual } from '../services/geminiservice';
import { saveAuditResult } from '../services/firebaseAuditService';

const AnalysisScreen = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [counterfactual, setCounterfactual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const resumeText = localStorage.getItem('ff_resume') || DEMO_RESUME;
        const jd = localStorage.getItem('ff_jd') || DEMO_JD;
        const biasResult = await analyzeBias(resumeText, jd);
        setResult(biasResult);
        const cf = await runCounterfactual(
          resumeText, 'College Name',
          biasResult.college_name || 'State University B',
          'IIT Bombay / Ivy League Institute'
        );
        setCounterfactual(cf);
        localStorage.setItem('ff_bias_result', JSON.stringify(biasResult));
        localStorage.setItem('ff_resume_text', resumeText);
        await saveAuditResult({
          auditMoment: 'getting_in',
          auditType: 'resume_screening',
          candidateName: biasResult.candidate_name || 'Candidate',
          collegeName: biasResult.college_name || 'College not detected',
          experience: biasResult.experience || 'Experience not detected',
          biasScore: biasResult.bias_score,
          biasLevel: biasResult.bias_level,
          featureWeights: biasResult.feature_weights,
          rootCause: biasResult.root_cause,
          summary: biasResult.summary_insight,
          counterfactual: cf,
        });
      } catch (e) {
        setError('Analysis failed. Please check your API key and try again.');
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
        <div style={{ color: '#9CA3AF', fontSize: 14 }}>Running bias analysis via Gemini AI...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#EF4444', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>!</div>
          <div style={{ fontSize: 16 }}>{error}</div>
          <button onClick={() => navigate('/upload')} style={{ marginTop: 20, background: '#4F46E5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>Try Again</button>
        </div>
      </div>
    </div>
  );

  const biasColor = result.bias_score > 60 ? '#EF4444' : result.bias_score > 30 ? '#F59E0B' : '#10B981';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ background: '#EF444420', color: '#EF4444', padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                {result.fairness_violation ? 'HIGH BIAS DETECTED' : 'ANALYSIS COMPLETE'}
              </div>
              <div style={{ background: '#4F46E520', color: '#4F46E5', padding: '3px 10px', borderRadius: 4, fontSize: 11 }}>
                COUNTERFACTUAL ONLINE
              </div>
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>Systemic Bias Detection</h1>
            <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
              Visualizing how small perturbations in sensitive attributes drastically alter algorithmic decision-making outcomes.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            View Dashboard
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#9CA3AF', fontSize: 11, letterSpacing: 1, marginBottom: 16 }}>ORIGINAL PROFILE</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Full Name', value: result.candidate_name || 'Candidate' },
                { label: 'College Name', value: result.college_name || 'State University' },
                { label: 'Experience', value: result.experience || '4.5 Years' },
                { label: 'Technical Score', value: '82 / 100' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#0A0A0F', borderRadius: 8, padding: 12 }}>
                  <div style={{ color: '#6B7280', fontSize: 10, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: '#D1D5DB', fontSize: 13, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: biasColor }}>{result.bias_score}%</div>
              <div style={{ color: '#9CA3AF', fontSize: 12 }}>bias score</div>
            </div>
          </div>

          <div style={{ background: '#13131A', border: '1px solid #10B981', borderRadius: 12, padding: 24 }}>
            <div style={{ color: '#9CA3AF', fontSize: 11, letterSpacing: 1, marginBottom: 16 }}>MODIFIED PROFILE — COLLEGE SWAP</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Full Name', value: result.candidate_name || 'Candidate' },
                { label: 'College Name', value: 'IIT Bombay', highlight: true },
                { label: 'Experience', value: result.experience || '4.5 Years' },
                { label: 'Technical Score', value: '82 / 100' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#0A0A0F', borderRadius: 8, padding: 12, border: item.highlight ? '1px solid #10B981' : 'none' }}>
                  <div style={{ color: '#6B7280', fontSize: 10, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: item.highlight ? '#10B981' : '#D1D5DB', fontSize: 13, fontWeight: 500 }}>{item.value}</div>
                  {item.highlight && counterfactual && (
                    <div style={{ color: '#10B981', fontSize: 10, marginTop: 2 }}>+{counterfactual.score_delta}% fairness score</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: '#10B981' }}>
                {counterfactual ? counterfactual.new_score : '—'}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 12 }}>bias score</div>
            </div>
          </div>
        </div>

        {counterfactual && (
          <CounterfactualCard
            originalScore={counterfactual.original_score}
            newScore={counterfactual.new_score}
            delta={counterfactual.score_delta}
            interpretation={counterfactual.interpretation}
            originalCollege={result.college_name}
            newCollege="IIT Bombay"
          />
        )}

        <div style={{ marginTop: 24, background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
          <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Root Cause Analysis</div>
          <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.7 }}>{result.root_cause}</div>
          <div style={{ marginTop: 16, color: '#9CA3AF', fontSize: 12, lineHeight: 1.7 }}>{result.summary_insight}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={() => navigate('/report')} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Generate Full Report
            </button>
            <button onClick={() => navigate('/upload')} style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid #374151', padding: '10px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
              Ignore Exception
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DEMO_RESUME = `Jordan Rivera
Email: jordan.rivera@email.com

Education:
B.Tech Computer Science - State University B, Hyderabad (2019)
GPA: 8.2/10

Experience:
Software Engineer - TechCorp India (4.5 years)
- Built microservices handling 1M+ daily requests
- Led team of 3 developers
- Expertise in Python, Java, React

Skills: Python, Java, React, Node.js, AWS, Docker
Location: Hyderabad, Telangana`;

const DEMO_JD = `Senior Software Engineer - Bangalore
We are looking for a Senior Software Engineer with 3+ years experience.
Preferred: IIT/NIT graduates, strong algorithmic skills.
Location: Bangalore/Delhi preferred.
Skills: Python, Java, distributed systems.`;

export default AnalysisScreen;
