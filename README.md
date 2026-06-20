# CyberShield AI - Your AI Security Expert

"AI-Powered Threat Intelligence for Everyone"

CyberShield AI is an intelligent cybersecurity assistant that combines real-time threat intelligence with Google Gemini's advanced AI to analyze URLs, emails, and IP addresses. Get instant risk assessments, detailed threat explanations, and actionable security recommendations through an intuitive dashboard.

## Features

- AI Security Chat - Ask questions about cybersecurity threats (powered by Google Gemini 2.5 Flash)
- URL Scanner - Real-time malware & phishing detection (VirusTotal API)
- Email Analyzer - Phishing detection & breach history (HIBP integration)
- IP Address Scanner - Reputation & abuse history (AbuseIPDB)
- Threat Dashboard - Visualize threat history and trends
- Risk Classification - Automated HIGH/MEDIUM/LOW risk scoring
- User Authentication - Secure account management

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Technology Stack

Frontend: Next.js 16, React 19, Tailwind CSS, TypeScript
Backend: FastAPI, Python 3.13
AI: Google Gemini 2.5 Flash
Integrations: VirusTotal, AbuseIPDB, HIBP, CVE Databases
Database: PostgreSQL

## Project Structure

```
cybershieldai/
├── app/                    # Next.js frontend
│   ├── app/
│   │   ├── chat/          # AI Security Chat
│   │   ├── scan-url/      # URL Scanner
│   │   ├── scan-email/    # Email Analyzer
│   │   └── dashboard/     # Threat Dashboard
│   └── page.tsx
├── backend/               # FastAPI backend
│   ├── ai/               # AI models & threat classification
│   ├── services/         # External API integrations
│   ├── routes/           # API endpoints
│   ├── models/           # Data models
│   └── main.py
└── public/               # Static assets
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
