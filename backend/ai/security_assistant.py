import os
import re
from typing import Dict, List, Optional
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
# THREAT KEYWORDS FOR DETECTION
# =====================================================

THREAT_KEYWORDS = {
    "critical": [
        "ransomware", "data breach", "exfiltration", "zero-day",
        "critical vulnerability", "exploit", "compromised", "attacked"
    ],
    "high": [
        "malware", "phishing", "credential theft", "trojan", "worm",
        "spyware", "keylogger", "ddos", "botnet", "vulnerability"
    ],
    "medium": [
        "suspicious", "unusual", "blocked", "suspicious activity",
        "weak password", "unencrypted", "outdated", "patch"
    ],
    "low": [
        "question", "learn", "understand", "explain", "best practice"
    ]
}


# =====================================================
# SECURITY ASSISTANT
# =====================================================

class SecurityAssistant:

    SYSTEM_PROMPT = """
You are CyberShield AI, an expert cybersecurity assistant with deep knowledge of:

- Phishing and social engineering attacks
- Malware, ransomware, trojans, and worms
- Network security and vulnerability management
- Data breach analysis and incident response
- Password security and authentication
- Email security and threat detection
- Web application security
- Best practices for small to enterprise organizations

Your responsibilities:
1. Explain cybersecurity threats clearly and accurately
2. Analyze phishing emails and suspicious communications
3. Assess suspicious URLs and domains
4. Explain vulnerabilities and CVEs
5. Recommend security best practices
6. Provide risk assessments
7. Explain technical concepts in simple language
8. Help users understand security reports

Guidelines:
- Be concise and accurate
- Never invent security facts
- If unsure about something, say so explicitly
- Explain your reasoning clearly
- Always prioritize user safety
- Use professional cybersecurity terminology where appropriate
- When assessing threats, provide confidence levels
- Suggest specific, actionable recommendations
"""

    MODEL = "gemini-2.5-flash"

    @staticmethod
    def ask(
        question: str,
        conversation_history: Optional[List] = None,
        session_id: Optional[str] = None
    ) -> Dict:
        """
        Ask the security assistant a question with optional conversation history.
        Returns a structured response with content, actions, and confidence.
        """

        try:
            # Build conversation context
            conversation_context = ""
            if conversation_history:
                conversation_context = "\n=== CONVERSATION HISTORY ===\n"
                for msg in conversation_history[-5:]:  # Last 5 messages for context
                    role = "User" if msg.get("role") == "user" else "Assistant"
                    conversation_context += f"{role}: {msg.get('content', '')}\n"
                conversation_context += "=== END HISTORY ===\n\n"

            prompt = f"""{SecurityAssistant.SYSTEM_PROMPT}

{conversation_context}

USER QUESTION:
{question}

Please provide a comprehensive response addressing the user's security concern.
"""

            response = client.models.generate_content(
                model=SecurityAssistant.MODEL,
                contents=prompt
            )

            content = response.text

            # Extract recommended actions from response
            actions = SecurityAssistant._extract_actions(content)
            
            # Calculate confidence based on response characteristics
            confidence = SecurityAssistant._calculate_confidence(content)

            return {
                "content": content,
                "actions": actions,
                "confidence": confidence
            }

        except Exception as e:
            return {
                "content": f"Error generating AI response: {str(e)}",
                "actions": ["Please try again or rephrase your question"],
                "confidence": 0.3
            }

    @staticmethod
    def _extract_actions(content: str) -> List[str]:
        """
        Extract recommended actions from the response.
        Looks for patterns like "1.", "- ", or sentences with action verbs.
        """
        actions = []
        
        # Look for numbered lists
        numbered_items = re.findall(r'^\d+[\.\)]\s+([^\n]+)', content, re.MULTILINE)
        if numbered_items:
            actions.extend(numbered_items[:5])  # Top 5 items
        
        # Look for bullet points
        if not actions:
            bullet_items = re.findall(r'^\s*[-•]\s+([^\n]+)', content, re.MULTILINE)
            actions.extend(bullet_items[:5])
        
        # Look for imperative sentences (recommendations)
        if not actions:
            sentences = content.split(". ")
            action_verbs = ["Ensure", "Update", "Change", "Enable", "Disable", "Review", "Monitor", "Contact", "Install"]
            for sentence in sentences:
                for verb in action_verbs:
                    if sentence.strip().startswith(verb):
                        actions.append(sentence.strip())
                        break
                if len(actions) >= 3:
                    break
        
        return actions[:3]  # Return top 3 actions

    @staticmethod
    def _calculate_confidence(content: str) -> float:
        """
        Calculate confidence score based on response characteristics.
        Higher confidence for definitive statements, lower for uncertain ones.
        """
        
        uncertain_phrases = ["might", "possibly", "unclear", "not sure", "unsure", "unclear"]
        confident_phrases = ["definitely", "certainly", "clearly", "obviously", "definitely"]
        
        content_lower = content.lower()
        
        uncertain_count = sum(1 for phrase in uncertain_phrases if phrase in content_lower)
        confident_count = sum(1 for phrase in confident_phrases if phrase in content_lower)
        
        # Base confidence
        confidence = 0.8
        
        # Adjust based on uncertainty
        confidence -= uncertain_count * 0.1
        confidence += confident_count * 0.05
        
        # Ensure within bounds
        return max(0.3, min(1.0, confidence))

    # =================================================
    # EMAIL PHISHING ANALYSIS
    # =================================================

    @staticmethod
    def analyze_email(email_content: str):
        prompt = f"""
Analyze this email for phishing indicators and security threats.

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
Analyze this URL for security risks:
{url}

Provide:
1. Risk Assessment (Safe / Suspicious / Dangerous)
2. Suspicious Characteristics (if any)
3. Phishing Indicators (if any)
4. Recommendations

Do not claim certainty unless strong evidence exists.
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
2. Severity Level
3. Potential Impact
4. Who is at risk?
5. Mitigation/Patch Information
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
5. Tools or Resources (if applicable)
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
1. Threat Type and Classification
2. Threat Severity
3. Likelihood of Occurrence
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
1. Malware Type and Classification
2. Behavior and Capabilities
3. Infection Methods
4. Impact Assessment
5. Detection Methods
6. Removal/Remediation Recommendations
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
2. Immediate Containment Steps
3. Investigation Methodology
4. Recovery/Restoration Plan
5. Lessons Learned and Prevention
"""
        return SecurityAssistant.ask(prompt)


# =====================================================
# THREAT LEVEL DETECTION
# =====================================================

def detect_threat_level(response: Dict, question: str) -> str:
    """
    Detect the threat level based on the question and response.
    Returns: "critical", "high", "medium", "low", "safe", or "unknown"
    """
    
    combined_text = (question + " " + response.get("content", "")).lower()
    
    # Check for critical threats
    for keyword in THREAT_KEYWORDS.get("critical", []):
        if keyword in combined_text:
            return "critical"
    
    # Check for high threats
    for keyword in THREAT_KEYWORDS.get("high", []):
        if keyword in combined_text:
            return "high"
    
    # Check for medium threats
    for keyword in THREAT_KEYWORDS.get("medium", []):
        if keyword in combined_text:
            return "medium"
    
    # Check for learning/informational (low threat)
    for keyword in THREAT_KEYWORDS.get("low", []):
        if keyword in combined_text:
            return "low"
    
    return "safe"


# =====================================================
# PUBLIC API
# =====================================================

def security_chat(
    question: str,
    conversation_history: Optional[List] = None,
    session_id: Optional[str] = None
) -> Dict:
    """
    Main entry point for the security chat function.
    Accepts question, conversation history, and session ID.
    Returns structured response with content, actions, and confidence.
    """
    return SecurityAssistant.ask(
        question,
        conversation_history,
        session_id
    )

