"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Shield, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm CyberShield AI. Ask me about phishing emails, suspicious links, malware, ransomware, password security, or any cybersecurity concern."
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ||
            "Unable to generate response.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection error. Please try again.",
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
