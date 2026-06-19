import os
from typing import Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

client = genai.Client(api_key=GEMINI_API_KEY)

# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="CyberShield AI",
    description="AI Cybersecurity Assistant powered by Gemini",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# MODELS
# =====================================================

class ChatRequest(BaseModel):
    question: str


class EmailRequest(BaseModel):
    email: str


class URLRequest(BaseModel):
    url: str


class IPRequest(BaseModel):
    ip: str


# =====================================================
# HELPERS
# =====================================================

def classify_risk(score: int):
    if score >= 80:
        return "HIGH"

    if score >= 50:
        return "MEDIUM"

    return "LOW"


def ask_ai(system_prompt: str, user_prompt: str):

    prompt = f"""
    {system_prompt}

    User Request:
    {user_prompt}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"AI Error: {str(e)}"


# =====================================================
# ROOT
# =====================================================

@app.get("/")
async def home():
    return {
        "name": "CyberShield AI",
        "status": "running",
        "ai_model": "Gemini 2.5 Flash",
        "version": "2.0.0"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


# =====================================================
# AI SECURITY CHAT
# =====================================================

@app.post("/chat")
async def chat(data: ChatRequest):

    answer = ask_ai(
        "You are a professional cybersecurity analyst.",
        data.question
    )

    return {
        "response": answer
    }


# =====================================================
# EMAIL PHISHING ANALYZER
# =====================================================

@app.post("/scan-email")
async def scan_email(data: EmailRequest):

    prompt = f"""
Analyze the following email.

Provide:

1. Risk Level (Low, Medium, High)
2. Phishing Indicators
3. Explanation
4. Recommended Action

EMAIL:

{data.email}
"""

    result = ask_ai(
        "You are an expert phishing analyst.",
        prompt
    )

    return {
        "analysis": result
    }


# =====================================================
# URL ANALYZER
# =====================================================

@app.post("/scan-url")
async def scan_url(data: URLRequest):

    if not VIRUSTOTAL_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="VirusTotal API key missing"
        )

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }

    response = requests.post(
        "https://www.virustotal.com/api/v3/urls",
        headers=headers,
        data={
            "url": data.url
        }
    )

    if response.status_code not in [200, 202]:
        raise HTTPException(
            status_code=500,
            detail="VirusTotal request failed"
        )

    return response.json()


# =====================================================
# IP REPUTATION CHECK
# =====================================================

@app.post("/check-ip")
async def check_ip(data: IPRequest):

    if not ABUSEIPDB_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="AbuseIPDB API key missing"
        )

    response = requests.get(
        "https://api.abuseipdb.com/api/v2/check",
        headers={
            "Accept": "application/json",
            "Key": ABUSEIPDB_API_KEY
        },
        params={
            "ipAddress": data.ip,
            "maxAgeInDays": 90
        }
    )

    return response.json()


# =====================================================
# CYBERSECURITY ADVISOR
# =====================================================

@app.post("/security-advice")
async def security_advice(data: ChatRequest):

    result = ask_ai(
        "You are a cybersecurity consultant helping businesses improve their security posture.",
        data.question
    )

    return {
        "advice": result
    }


# =====================================================
# AI THREAT ANALYZER
# =====================================================

@app.post("/analyze-threat")
async def analyze_threat(data: ChatRequest):

    result = ask_ai(
        """
You are a Senior SOC Analyst.

Analyze the threat and provide:

1. Threat Level
2. Attack Type
3. Potential Impact
4. MITRE ATT&CK Mapping
5. Recommended Mitigation
""",
        data.question
    )

    return {
        "analysis": result
    }


# =====================================================
# DASHBOARD
# =====================================================

@app.get("/dashboard")
async def dashboard():

    return {
        "threats_today": 12,
        "high_risk": 3,
        "medium_risk": 5,
        "low_risk": 4,
        "status": "Protected"
    }


# =====================================================
# RISK SCORE DEMO
# =====================================================

@app.get("/risk-score/{score}")
async def risk_score(score: int):

    return {
        "score": score,
        "level": classify_risk(score)
    }


# =====================================================
# STARTUP
# =====================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )