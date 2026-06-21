from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

from ai.security_assistant import security_chat, detect_threat_level

router = APIRouter(
    tags=["AI Security Chat"]
)


class ConversationMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str
    session_id: str
    conversation_history: List[ConversationMessage] = []


class ChatResponse(BaseModel):
    response: str
    threat_level: str
    recommended_actions: List[str]
    confidence_score: float


@router.post(
    "/chat",
    response_model=ChatResponse
)
async def chat_endpoint(data: ChatRequest):
    """
    CyberShield AI Security Assistant with conversation history
    """

    try:

        response = security_chat(
            data.question,
            data.conversation_history,
            data.session_id
        )

        threat_level = detect_threat_level(response, data.question)

        return ChatResponse(
            response=response["content"],
            threat_level=threat_level,
            recommended_actions=response.get("actions", []),
            confidence_score=response.get("confidence", 0.8)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}"
        )