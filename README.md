# FairForce

FairForce is an AI Workforce Decision Auditor built for the Google AI Solution Challenge 2026. It helps make hidden bias visible in AI-assisted hiring and workforce decisions.

## What It Audits

FairForce focuses on two high-impact moments where automated decisions can silently discriminate against Indian professionals:

- **Getting In:** resume screening bias against regional college, non-IIT, first-generation, and location-diverse candidates.
- **Getting Out:** layoff scoring bias through age, salary band, tenure, leave history, and productivity proxy metrics.

## Core Features

- Resume PDF/TXT upload with PDF text extraction.
- Gemini-powered resume bias analysis.
- Bias score dashboard with feature weight breakdown.
- Counterfactual analysis, such as comparing a regional college profile against an IIT profile.
- Fairness report generation with downloadable JSON report.
- India DPDP Act 2023 compliance mapping.
- Layoff decision fairness audit for workforce reduction scenarios.
- Demo fallback data when Gemini API is unavailable, so the app remains usable during presentations.

## Tech Stack

- React
- React Router
- Gemini API
- PDF.js
- Recharts
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

Start the app:

```bash
npm.cmd start
```

Open:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm.cmd start
npm.cmd run build
npm.cmd test
```

## Demo Flow

1. Open the upload screen.
2. Upload or paste a resume.
3. Paste the job description.
4. Run the bias audit.
5. Review the counterfactual analysis.
6. Open the dashboard.
7. Generate and download the fairness report.
8. Review compliance mapping.
9. Open the layoff audit screen for the workforce decision audit.

## Environment Notes

The real Gemini key must stay in `.env`. This file is ignored by Git and should not be pushed.

Use `.env.example` as the template for teammates.
