```python
import os
from dotenv import load_dotenv
from google import genai

# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =====================================================
# SECURITY ASSISTANT
# =====================================================

class SecurityAssistant:

    SYSTEM_PROMPT = """
    You are CyberShield AI, an expert cybersecurity assistant.

    Your responsibilities:

    - Explain cybersecurity threats clearly.
    - Analyze phishing emails.
    - Analyze suspicious URLs.
    - Explain malware, ransomware, spyware, and vulnerabilities.
    - Recommend security best practices.
    - Help small businesses improve security.
    - Provide risk assessments.
    - Explain technical concepts in simple language.
    - Help users understand security reports.

    Rules:
    - Be concise and accurate.
    - Never invent facts.
    - If unsure, say so.
    - Explain reasoning.
    - Prioritize user safety.
    - Use professional cybersecurity terminology.
    """

    MODEL = "gemini-2.5-flash"

    @staticmethod
    def ask(question: str):

        try:

            prompt = f"""
            {SecurityAssistant.SYSTEM_PROMPT}

            USER QUESTION:

            {question}
            """

            response = client.models.generate_content(
                model=SecurityAssistant.MODEL,
                contents=prompt
            )

            return response.text

        except Exception as e:

            return f"""
Error generating AI response.

Details:
{str(e)}
"""

    # =================================================
    # EMAIL PHISHING ANALYSIS
    # =================================================

    @staticmethod
    def analyze_email(email_content: str):

        prompt = f"""
Analyze this email for phishing indicators.

Provide:

1. Risk Level (Low / Medium / High)
2. Phishing Indicators
3. Explanation
4. Recommended Action

EMAIL:

{email_content}
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # URL ANALYSIS
    # =================================================

    @staticmethod
    def analyze_url(url: str):

        prompt = f"""
Analyze this URL:

{url}

Provide:

1. Risk Assessment
2. Suspicious Characteristics
3. Phishing Indicators
4. Recommendations

Do not claim certainty unless evidence exists.
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # VULNERABILITY EXPLANATION
    # =================================================

    @staticmethod
    def explain_vulnerability(vulnerability: str):

        prompt = f"""
Explain this cybersecurity vulnerability:

{vulnerability}

Include:

1. Description
2. Severity
3. Potential Impact
4. Exploitation Method
5. Mitigation Recommendations
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # SECURITY ADVICE
    # =================================================

    @staticmethod
    def security_advice(problem: str):

        prompt = f"""
Provide cybersecurity guidance for:

{problem}

Include:

1. Risk Assessment
2. Best Practices
3. Recommended Actions
4. Prevention Measures
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # THREAT ANALYSIS
    # =================================================

    @staticmethod
    def analyze_threat(threat_description: str):

        prompt = f"""
Analyze the following security threat:

{threat_description}

Provide:

1. Threat Type
2. Threat Severity
3. Likelihood
4. Potential Impact
5. Recommended Mitigations
6. Incident Response Suggestions
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # MALWARE ANALYSIS
    # =================================================

    @staticmethod
    def analyze_malware(malware_description: str):

        prompt = f"""
Analyze this malware information:

{malware_description}

Provide:

1. Malware Type
2. Behavior
3. Infection Method
4. Impact
5. Detection Methods
6. Removal Recommendations
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # INCIDENT RESPONSE
    # =================================================

    @staticmethod
    def incident_response(incident: str):

        prompt = f"""
A security incident has occurred:

{incident}

Provide:

1. Initial Assessment
2. Containment Steps
3. Investigation Steps
4. Recovery Plan
5. Lessons Learned
"""

        return SecurityAssistant.ask(prompt)

    # =================================================
    # SECURITY AWARENESS TRAINER
    # =================================================

    @staticmethod
    def security_training(topic: str):

        prompt = f"""
Teach a beginner about:

{topic}

Provide:

1. Simple Explanation
2. Real World Examples
3. Common Mistakes
4. Best Practices
5. Key Takeaways
"""

        return SecurityAssistant.ask(prompt)
```
