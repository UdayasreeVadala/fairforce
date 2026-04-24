import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const clauses = [
  { id: 'S7', title: 'Section 7: Notice & Consent', desc: 'Clear itemised notice provided to Data Principals.', status: 'compliant' },
  { id: 'S8', title: 'Section 8: Consent Withdrawal', desc: 'Effective mechanism for withdrawal of consent.', status: 'compliant' },
  { id: 'S9', title: 'Section 9: Duties of Data Fiduciary', desc: 'Ensuring accuracy and completeness for decision-making.', status: 'action' },
  { id: 'S10', title: 'Section 10: Processing Children Data', desc: 'Obtained parental consent logic implemented.', status: 'compliant' },
  { id: 'S11', title: 'Section 11: Data Principal Rights', desc: 'Missing "Right to Erasure" workflow automation.', status: 'action' },
  { id: 'S12', title: 'Section 12: Grievance Redressal', desc: 'Grievance officer designated and accessible.', status: 'compliant' },
  { id: 'S13', title: 'Section 13: Cross-border Transfers', desc: 'Notification requirements for restricted regions pending.', status: 'action' },
];

const ComplianceScreen = () => {
  const navigate = useNavigate();
  const compliantCount = clauses.filter(c => c.status === 'compliant').length;
  const score = Math.round((compliantCount / clauses.length) * 100);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 4 }}>Regulatory Hub • August 2024</div>
            <h1 style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>India DPDP Act 2023</h1>
            <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
              Digital Personal Data Protection compliance mapping for enterprise AI systems. Evaluating transparency, accountability, and rights of Data Principals.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ background: 'transparent', color: '#9CA3AF', border: '1px solid #374151', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
              Export PDF
            </button>
            <button onClick={() => navigate('/upload')} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Re-Audit
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          <div>
            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>Clause-Level Checklist</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ color: '#9CA3AF', fontSize: 11 }}>Compliant</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                    <span style={{ color: '#9CA3AF', fontSize: 11 }}>Action Required</span>
                  </div>
                </div>
              </div>
              {clauses.map((clause, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0',
                  borderBottom: i < clauses.length - 1 ? '1px solid #1F2937' : 'none'
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                    background: clause.status === 'compliant' ? '#10B98120' : '#EF444420',
                    border: `1px solid ${clause.status === 'compliant' ? '#10B981' : '#EF4444'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: clause.status === 'compliant' ? '#10B981' : '#EF4444'
                  }}>
                    {clause.status === 'compliant' ? 'OK' : 'X'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{clause.title}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, lineHeight: 1.5 }}>{clause.desc}</div>
                  </div>
                  <div style={{ color: '#4F46E5', fontSize: 18, cursor: 'pointer' }}>›</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>High-Priority Mitigation</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { title: 'Technical Patch', desc: 'Enable "Right to be Forgotten" API endpoints to satisfy Section 11(2).', color: '#4F46E5' },
                  { title: 'Legal Action', desc: 'Update privacy policy to include mandatory DPDP language in Hindi and English.', color: '#F59E0B' },
                  { title: 'Security Alert', desc: 'Implement log-tampering protections for audit accuracy as per Section 8(4).', color: '#EF4444' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#0A0A0F', borderRadius: 10, padding: 16, borderTop: `3px solid ${item.color}` }}>
                    <div style={{ color: item.color, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24, textAlign: 'center' }}>
              <div style={{ color: '#9CA3AF', fontSize: 11, marginBottom: 16 }}>COMPLIANCE READINESS</div>
              <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="55" fill="none" stroke="#1F2937" strokeWidth="12" />
                  <circle cx="70" cy="70" r="55" fill="none" stroke="#4F46E5" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 55}`}
                    strokeDashoffset={`${2 * Math.PI * 55 * (1 - score / 100)}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#4F46E5' }}>{score}%</div>
                </div>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {score >= 70 ? 'Largely Compliant' : 'Partial Compliance'}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 12 }}>Meets {compliantCount}/{clauses.length} fairness requirements</div>
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Compliance Timeline</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#9CA3AF', fontSize: 12 }}>Critical Months to Deadline</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#EF4444', fontSize: 24, fontWeight: 700 }}>03</div>
                  <div style={{ color: '#9CA3AF', fontSize: 10 }}>Months</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#F59E0B', fontSize: 24, fontWeight: 700 }}>196</div>
                  <div style={{ color: '#9CA3AF', fontSize: 10 }}>Days</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
              <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Quick Actions</div>
              {[
                { label: 'View Full DPDP Act 2023', action: () => window.open('https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf') },
                { label: 'Download Compliance Report', action: () => {} },
                { label: 'Schedule Legal Review', action: () => {} },
                { label: 'View Audit History', action: () => navigate('/report') },
              ].map((item, i) => (
                <div key={i} onClick={item.action} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: i < 3 ? '1px solid #1F2937' : 'none',
                  cursor: 'pointer'
                }}>
                  <span style={{ color: '#D1D5DB', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: '#4F46E5', fontSize: 16 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceScreen;
