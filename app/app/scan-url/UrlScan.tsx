```tsx
"use client";

import { useState } from "react";
import {
  Globe,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function scan() {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(
        "http://localhost:8000/scan-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to analyze URL"
        );
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Globe size={32} />
            <div>
              <h1 className="text-3xl font-bold">
                URL Threat Scanner
              </h1>

              <p className="text-slate-400">
                Analyze websites for phishing,
                malware, and suspicious activity.
              </p>
            </div>
          </div>
        </div>

        {/* Scanner Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <label className="block mb-2 font-medium">
            Website URL
          </label>

          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={scan}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={18}
                />
                Scanning...
              </>
            ) : (
              <>
                <Shield size={18} />
                Analyze URL
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">
              Scan Results
            </h2>

            <div className="space-y-4">

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm">
                  Status
                </p>

                <p className="font-semibold">
                  Scan Completed
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm">
                  URL
                </p>

                <p className="break-all">
                  {url}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm">
                  Raw Response
                </p>

                <pre className="overflow-auto text-sm mt-2">
                  {JSON.stringify(
                    result,
                    null,
                    2
                  )}
                </pre>
              </div>

            </div>
          </div>
        )}

        {/* Demo Threat Examples */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle
              className="text-yellow-400"
            />
            <h2 className="font-bold">
              What CyberShield Checks
            </h2>
          </div>

          <ul className="space-y-2 text-slate-300">
            <li>✓ Phishing indicators</li>
            <li>✓ Malware distribution</li>
            <li>✓ Suspicious redirects</li>
            <li>✓ Known malicious domains</li>
            <li>✓ Threat intelligence reports</li>
            <li>✓ Domain reputation</li>
          </ul>

        </div>

      </div>
    </main>
  );
}
```
