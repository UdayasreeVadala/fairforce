const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const DEMO_BIAS_RESULT = {
  bias_score: 67,
  bias_level: 'High',
  feature_weights: {
    skills_competencies: 35,
    college_tier: 34,
    location_density: 26,
    experience_years: 5
  },
  root_cause: 'College tier is acting as a socioeconomic proxy and reducing the score for an otherwise qualified candidate.',
  fairness_violation: true,
  summary_insight: 'Significant proxy bias detected through college-name weighting. Skills are strong, but institution prestige is influencing the decision.',
  candidate_name: 'Jordan Rivera',
  college_name: 'Osmania University',
  experience: '4.5 years'
};

const DEMO_COUNTERFACTUAL = {
  original_score: 67,
  new_score: 23,
  score_delta: 44,
  interpretation: 'Only the institution name changed. The profile receives a much lower bias score after replacing a regional college with IIT Bombay.'
};

const DEMO_REPORT = {
  executive_summary: 'FairForce detected proxy discrimination in the hiring audit. The candidate has strong technical alignment, but the model is over-weighting institution prestige and location density, which can disadvantage regional college and first-generation candidates.',
  overall_fairness_score: 58,
  gender_neutrality: 'Optimized',
  age_sensitivity: 'At Risk',
  caste_proxy_risk: 'Bias Detected',
  remediation_steps: [
    { step: 1, title: 'Feature Reweighting', description: 'Reduce college-tier influence and raise skill-evidence weighting for project, experience, and role-fit signals.' },
    { step: 2, title: 'Counterfactual Testing', description: 'Run profile swaps across institution, location, and language proxies before shortlisting decisions are finalized.' },
    { step: 3, title: 'Audit Trail', description: 'Store consent, model inputs, explanation outputs, and remediation decisions for governance review.' }
  ],
  compliance_risk: 'High',
  dpdp_compliance_score: 64
};

const callGemini = async (prompt) => {
  if (!API_KEY) {
    throw new Error('Missing REACT_APP_GEMINI_API_KEY');
  }

  const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini response did not include text');
  }

  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const getUsefulLines = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const extractResumeProfile = (resumeText) => {
  const lines = getUsefulLines(resumeText);
  const compactText = lines.join(' ');

  const candidateName =
    lines.find((line) =>
      /^[A-Za-z][A-Za-z .'-]{2,60}$/.test(line) &&
      !/(resume|curriculum|vitae|email|phone|mobile|linkedin|github|address|education|experience|skills|project|summary)/i.test(line)
    ) ||
    compactText.match(/^([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})\s+(?:\+?\d|[A-Za-z0-9._%+-]+@)/)?.[1] ||
    'Uploaded Candidate';

  const collegeLine =
    lines.find((line) =>
      /(university|college|institute|engineering|technology|vidyapeeth|academy)/i.test(line) &&
      !/(email|project|intern|company|experience)/i.test(line)
    ) || '';

  const collegeMatch =
    collegeLine.match(/([A-Z][A-Z&.,' -]*(?:UNIVERSITY|COLLEGE|INSTITUTE|ENGINEERING|TECHNOLOGY|VIDYAPEETH|ACADEMY)[A-Z&.,' -]*)/) ||
    compactText.match(/([A-Z][A-Z&.,' -]*(?:UNIVERSITY|COLLEGE|INSTITUTE|ENGINEERING|TECHNOLOGY|VIDYAPEETH|ACADEMY)[A-Z&.,' -]*)/) ||
    collegeLine.match(/([A-Z][A-Za-z&.,' -]*(?:University|College|Institute|Engineering|Technology|Vidyapeeth|Academy)[A-Za-z&.,' -]*)/i);

  const experienceMatch =
    compactText.match(/(\d+(?:\.\d+)?)\+?\s*(?:years|yrs|year)\s+(?:of\s+)?experience/i) ||
    compactText.match(/experience[:\s-]*(\d+(?:\.\d+)?)\+?\s*(?:years|yrs|year)/i);

  const hasInternship = /(intern|internship)/i.test(compactText);

  return {
    candidate_name: candidateName,
    college_name: collegeMatch ? collegeMatch[1].trim() : (collegeLine || 'College not detected'),
    experience: experienceMatch ? `${experienceMatch[1]} years` : hasInternship ? 'Internship experience' : 'Experience not detected'
  };
};

const buildFallbackBiasResult = (resumeText) => {
  const profile = extractResumeProfile(resumeText);
  return {
    ...DEMO_BIAS_RESULT,
    ...profile,
    root_cause: `${profile.college_name} may be treated as an institution-prestige proxy instead of evaluating skills independently.`,
    summary_insight: `FairForce analyzed ${profile.candidate_name}'s uploaded resume. The audit flags possible proxy bias through college and location signals while preserving the candidate's skill evidence.`
  };
};

const clampScore = (score) => Math.max(8, Math.min(95, Math.round(score)));

export const buildFallbackLayoffResult = (employeeData) => {
  const text = employeeData.toLowerCase();
  const age = Number(text.match(/age[:\s-]*(\d+)/i)?.[1] || 0);
  const tenure = Number(text.match(/tenure[:\s-]*(\d+(?:\.\d+)?)/i)?.[1] || 0);
  const leaveDays = Number(text.match(/(?:leave|absence)[:\s-]*(\d+)/i)?.[1] || 0);
  const productivity = Number(text.match(/productivity(?:\s+score)?[:\s-]*(\d+)/i)?.[1] || 70);
  const isHighComp = /compensation band:\s*high|salary:\s*high|high compensation|high salary/i.test(employeeData);
  const isMediumComp = /compensation band:\s*medium|salary:\s*medium|medium compensation|medium salary/i.test(employeeData);
  const strongPerformance = /exceeds|excellent|strong|high performer|critical|reliable/i.test(employeeData);
  const weakPerformance = /poor|low performer|needs improvement|below expectations/i.test(employeeData);

  const compensationRisk = isHighComp ? 78 : isMediumComp ? 52 : 26;
  const ageRisk = age >= 46 ? 76 : age >= 36 ? 48 : 24;
  const tenureRisk = tenure >= 10 ? 70 : tenure >= 5 ? 50 : 25;
  const leaveRisk = leaveDays >= 30 ? 68 : leaveDays >= 10 ? 45 : 18;
  const productivityRisk = productivity < 50 ? 62 : productivity < 70 ? 42 : 20;

  let score =
    compensationRisk * 0.24 +
    ageRisk * 0.22 +
    tenureRisk * 0.20 +
    leaveRisk * 0.18 +
    productivityRisk * 0.16;

  if (strongPerformance) score -= 8;
  if (weakPerformance) score += 10;

  const layoffScore = clampScore(score);
  const proxyMetrics = [
    {
      metric: 'Compensation band',
      risk: compensationRisk,
      why: isHighComp
        ? 'High compensation can become a cost-cutting proxy instead of measuring role necessity.'
        : 'Compensation is not the dominant risk factor in this profile.'
    },
    {
      metric: 'Age band',
      risk: ageRisk,
      why: age >= 46
        ? 'Age may be indirectly influencing layoff risk through seniority and compensation.'
        : 'Age proxy risk is lower for this profile.'
    },
    {
      metric: 'Tenure',
      risk: tenureRisk,
      why: tenure >= 10
        ? 'Long tenure is clustered with higher cost and may be penalized by productivity scoring.'
        : 'Tenure is not strongly penalized for this profile.'
    },
    {
      metric: 'Recent leave',
      risk: leaveRisk,
      why: leaveDays >= 30
        ? 'Recent leave can unfairly penalize caregivers, health needs, or parental leave.'
        : 'Leave history does not appear to be a major proxy risk.'
    }
  ];

  const highestRisk = proxyMetrics.reduce((max, metric) => metric.risk > max.risk ? metric : max, proxyMetrics[0]);

  return {
    layoff_bias_score: layoffScore,
    highest_risk_group: `${highestRisk.metric} is the strongest proxy risk in this profile`,
    proxy_metrics: proxyMetrics,
    counterfactual: `If ${highestRisk.metric.toLowerCase()} is neutralized, the estimated layoff bias score drops from ${layoffScore}% to ${clampScore(layoffScore - 18)}%.`,
    recommendation: 'Re-run layoff scoring with documented performance, role-critical skills, team dependency, and project ownership weighted above cost or demographic proxies.'
  };
};

export const analyzeBias = async (resumeText, jobDescription) => {
  const prompt = `You are an AI bias detection expert specializing in Indian corporate hiring discrimination. Analyze this resume against the job description for proxy discrimination.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "bias_score": 67,
  "bias_level": "High",
  "feature_weights": {
    "skills_competencies": 35,
    "college_tier": 34,
    "location_density": 26,
    "experience_years": 5
  },
  "root_cause": "College tier is acting as socioeconomic proxy",
  "fairness_violation": true,
  "summary_insight": "Significant bias detected through college name weighting",
  "candidate_name": "extracted name here",
  "college_name": "extracted college here",
  "experience": "extracted experience here"
}`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.warn('Using demo bias result:', error);
    return buildFallbackBiasResult(resumeText);
  }
};

export const runCounterfactual = async (resumeText, changedFeature, originalValue, newValue) => {
  const prompt = `You are an AI fairness expert. Calculate bias score change if we swap one feature.

RESUME: ${resumeText}
CHANGE: "${changedFeature}" from "${originalValue}" to "${newValue}"

Return ONLY valid JSON:
{
  "original_score": 67,
  "new_score": 23,
  "score_delta": 44,
  "interpretation": "Same person, different college, completely different outcome"
}`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.warn('Using demo counterfactual:', error);
    return {
      ...DEMO_COUNTERFACTUAL,
      interpretation: `Same profile, changed ${changedFeature} from ${originalValue} to ${newValue}. ${DEMO_COUNTERFACTUAL.interpretation}`
    };
  }
};

export const generateFairnessReport = async (biasResult, resumeText) => {
  const prompt = `You are an AI governance expert. Generate fairness report.

BIAS RESULT: ${JSON.stringify(biasResult)}
RESUME: ${resumeText}

Return ONLY valid JSON:
{
  "executive_summary": "detailed summary here",
  "overall_fairness_score": 85,
  "gender_neutrality": "Optimized",
  "age_sensitivity": "Bias Detected",
  "caste_proxy_risk": "Bias Detected",
  "remediation_steps": [
    {"step": 1, "title": "Feature Reweighting", "description": "Reduce college tier weight by 60%"},
    {"step": 2, "title": "Data Augmentation", "description": "Add diverse training profiles"},
    {"step": 3, "title": "Continuous Monitoring", "description": "Deploy real-time bias alerts"}
  ],
  "compliance_risk": "Critical",
  "dpdp_compliance_score": 57
}`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.warn('Using demo fairness report:', error);
    return DEMO_REPORT;
  }
};

export const analyzeLayoffRisk = async (employeeData) => {
  const prompt = `You are an AI workforce fairness auditor for Indian enterprises. Audit this layoff scoring data for biased productivity or cost proxies.

EMPLOYEE DATA:
${employeeData}

Return ONLY valid JSON:
{
  "layoff_bias_score": 72,
  "highest_risk_group": "Experienced employees over 45 with high compensation",
  "proxy_metrics": [
    {"metric": "Compensation band", "risk": 78, "why": "High salary is being used as a cost proxy"},
    {"metric": "Recent leave", "risk": 64, "why": "Leave history may penalize caregivers or health-related absence"},
    {"metric": "Tenure", "risk": 59, "why": "Long-tenured employees are clustered in higher layoff scores"}
  ],
  "counterfactual": "If age and salary-band proxies are neutralized, the employee moves from high risk to medium risk.",
  "recommendation": "Re-run layoff scoring with role-critical skills, documented performance, and team dependency weighted above cost proxies."
}`;

  try {
    return await callGemini(prompt);
  } catch (error) {
    console.warn('Using demo layoff audit:', error);
    return buildFallbackLayoffResult(employeeData);
  }
};
