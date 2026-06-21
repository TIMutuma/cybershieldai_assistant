"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Shield, User, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  threat_level?: string;
  recommended_actions?: string[];
  confidence_score?: number;
}

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm CyberShield AI. Ask me about phishing emails, suspicious links, malware, ransomware, password security, or any cybersecurity concern.",
      threat_level: "safe"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function ask() {
    if (!question.trim()) return;

    const userMessage = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
            session_id: sessionId,
            conversation_history: messages.map(m => ({
              role: m.role,
              content: m.content
            }))
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "Unable to generate response.",
          threat_level: data.threat_level || "unknown",
          recommended_actions: data.recommended_actions || [],
          confidence_score: data.confidence_score || 0
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection error. Please try again.",
          threat_level: "error"
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Shield size={30} />

          <div>
            <h1 className="text-2xl font-bold">
              CyberShield AI Assistant
            </h1>

            <p className="text-slate-400 text-sm">
              AI-powered cybersecurity guidance
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-6 flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 ${
                  message.role === "user"
                    ? "bg-blue-600"
                    : message.threat_level === "critical"
                    ? "bg-red-900 border border-red-700"
                    : message.threat_level === "high"
                    ? "bg-orange-900 border border-orange-700"
                    : message.threat_level === "medium"
                    ? "bg-yellow-900 border border-yellow-700"
                    : message.threat_level === "error"
                    ? "bg-slate-800 border border-red-500"
                    : "bg-slate-900 border border-slate-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === "assistant" ? (
                    <>
                      <Bot size={18} />
                      <span className="font-semibold">
                        CyberShield AI
                      </span>
                      {message.threat_level && message.threat_level !== "safe" && message.threat_level !== "error" && message.threat_level !== "unknown" && (
                        <span className={`text-xs font-bold uppercase ml-auto px-2 py-1 rounded ${
                          message.threat_level === "critical" ? "bg-red-600" :
                          message.threat_level === "high" ? "bg-orange-600" :
                          "bg-yellow-600"
                        }`}>
                          {message.threat_level}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <User size={18} />
                      <span className="font-semibold">
                        You
                      </span>
                    </>
                  )}
                </div>

                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>

                {message.recommended_actions && message.recommended_actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <div className="text-sm font-semibold mb-2">Recommended Actions:</div>
                    <ul className="text-sm space-y-1">
                      {message.recommended_actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={14} className="mt-1 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {message.confidence_score !== undefined && message.confidence_score > 0 && (
                  <div className="mt-2 text-xs text-opacity-70">
                    Confidence: {Math.round(message.confidence_score * 100)}%
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <Loader2
                  className="animate-spin"
                  size={18}
                />

                <span>
                  CyberShield AI is analyzing...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto p-6">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

            <textarea
              rows={3}
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about phishing emails, suspicious websites, malware, password security..."
              className="w-full bg-transparent resize-none outline-none"
            />

            <div className="flex justify-between items-center mt-4">

              <span className="text-sm text-slate-400">
                Press Enter to send
              </span>

              <button
                onClick={ask}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                Send
              </button>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
