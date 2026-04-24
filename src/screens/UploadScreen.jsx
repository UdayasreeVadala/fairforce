import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const UploadScreen = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const extractPdfText = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const rows = content.items.reduce((acc, item) => {
        const y = Math.round(item.transform[5]);
        acc[y] = acc[y] || [];
        acc[y].push(item.str);
        return acc;
      }, {});
      const text = Object.keys(rows)
        .sort((a, b) => Number(b) - Number(a))
        .map((y) => rows[y].join(' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n');
      pages.push(text);
    }

    return pages.join('\n\n').trim();
  };

  const readResumeFile = async (file) => {
    setFileName(file.name);
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        setExtracting(true);
        const text = await extractPdfText(file);
        if (!text) {
          alert('This PDF looks scanned or image-based. Please paste the resume text manually.');
          return;
        }
        setResumeText(text);
      } catch (error) {
        console.error('PDF extraction failed:', error);
        alert(`Could not extract text from this PDF: ${error.message || 'unknown error'}. Please paste the resume text manually.`);
      } finally {
        setExtracting(false);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    readResumeFile(file);
  };

  const handleAnalyze = () => {
    if (!resumeText || !jobDesc) {
      alert('Please provide both resume and job description');
      return;
    }
    localStorage.setItem('ff_resume', resumeText);
    localStorage.setItem('ff_jd', jobDesc);
    localStorage.removeItem('ff_bias_result');
    localStorage.removeItem('ff_resume_text');
    setLoading(true);
    setTimeout(() => navigate('/analysis'), 500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700 }}>New Audit Request</h1>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>Ensure your hiring pipeline meets global fairness standards</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['1. Upload', '2. Audit', '3. Report'].map((step, i) => (
              <div key={i} style={{
                padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: i === 0 ? '#4F46E5' : '#1F2937',
                color: i === 0 ? '#FFFFFF' : '#6B7280'
              }}>{step}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) readResumeFile(file);
            }}
            style={{
              border: `2px dashed ${dragOver ? '#4F46E5' : '#1F2937'}`,
              borderRadius: 12, padding: 40, textAlign: 'center',
              background: dragOver ? '#1A1A2E' : '#13131A', cursor: 'pointer',
              transition: 'all 0.2s', minHeight: 280,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 16, color: '#D1D5DB', fontWeight: 700 }}>PDF</div>
            <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Upload Resume (PDF/TXT)</div>
            <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 20 }}>
              {extracting ? 'Extracting text from PDF...' : 'Drag and drop your resume file here'}
            </div>
            {fileName && (
              <div style={{ color: '#10B981', fontSize: 12, marginBottom: 12, background: '#10B98120', padding: '4px 12px', borderRadius: 20 }}>
                {extracting ? 'Reading ' : 'OK '} {fileName}
              </div>
            )}
            <label style={{
              background: '#4F46E5', color: '#FFFFFF', padding: '10px 24px',
              borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>
              Choose File
              <input type="file" accept=".txt,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            <div style={{ marginTop: 20, width: '100%' }}>
              <textarea
                placeholder="Or paste resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                style={{
                  width: '100%', background: '#0A0A0F', border: '1px solid #1F2937',
                  borderRadius: 8, padding: 12, color: '#D1D5DB', fontSize: 12,
                  resize: 'vertical', minHeight: 110, fontFamily: 'inherit', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>Paste Job Description</div>
              <div style={{ background: '#EF444420', color: '#EF4444', padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>REQUIRED</div>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 16 }}>
              Paste the full job description text including requirements, benefits, and responsibilities.
            </p>
            <textarea
              placeholder="We are looking for a Senior Software Engineer with 5+ years of experience..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              style={{
                width: '100%', background: '#0A0A0F', border: '1px solid #1F2937',
                borderRadius: 8, padding: 16, color: '#D1D5DB', fontSize: 13,
                resize: 'none', height: 280, fontFamily: 'inherit',
                boxSizing: 'border-box', lineHeight: 1.6
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 24, background: '#13131A', border: '1px solid #1F2937', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { label: 'DAILY QUOTA', value: '42 / 50', color: '#F59E0B' },
              { label: 'AVG. RISK SCORE', value: 'Low-Med', color: '#10B981' },
              { label: 'SYSTEM STATUS', value: 'Operational', color: '#10B981' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ color: '#6B7280', fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: item.color, fontSize: 14, fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: '#0A0A0F', border: '1px solid #1F2937', borderRadius: 8, padding: '10px 16px' }}>
              <div style={{ color: '#9CA3AF', fontSize: 10, marginBottom: 4 }}>AUDIT TIP</div>
              <div style={{ color: '#D1D5DB', fontSize: 11 }}>For accurate bias audit, ensure the resume is text-based and free from heavy graphic formatting.</div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || extracting}
              style={{
                background: loading || extracting ? '#374151' : '#4F46E5', color: '#FFFFFF',
                border: 'none', padding: '14px 28px', borderRadius: 10,
                fontSize: 14, fontWeight: 700, cursor: loading || extracting ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap', transition: 'background 0.2s'
              }}
            >
              {extracting ? 'Reading PDF...' : loading ? 'Analyzing...' : 'Analyze for Bias'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
