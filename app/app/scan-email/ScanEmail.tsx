"use client";

import { useState } from "react";
import {
  Mail,
  Shield,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function EmailScanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function scan() {
    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(
        "http://localhost:8000/scan-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to analyze email"
        );
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      scan();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Mail size={32} />
            <div>
              <h1 className="text-3xl font-bold">
                Email Security Scanner
              </h1>

              <p className="text-slate-400">
                Check if your email has been compromised in data breaches.
              </p>
            </div>
          </div>
        </div>

        {/* Scanner Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

          <label className="block mb-2 font-medium">
            Email Address
          </label>

          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={scan}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield size={20} />
                Scan Email
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Scan Failed</p>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {result.breaches && result.breaches.length > 0 ? (
              <>
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="font-bold">Found in {result.breaches.length} Data Breach(es)</p>
                    <p className="text-sm text-red-200 mt-1">
                      Your email appears in known data breaches. Consider changing your password.
                    </p>
                  </div>
                </div>

                {result.breaches.map((breach: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{breach.Name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{breach.Title}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Date: {new Date(breach.BreachDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle size={20} className="text-green-500 mt-0.5" />
                <div>
                  <p className="font-bold">No Breaches Found</p>
                  <p className="text-sm text-green-200 mt-1">
                    This email hasn't been found in known data breaches.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
