"use client";

import {
  Shield,
  AlertTriangle,
  Globe,
  Mail,
  Bot,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const recentThreats = [
    {
      id: 1,
      type: "Phishing Email",
      risk: "High",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "Malicious URL",
      risk: "Medium",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "Suspicious IP",
      risk: "High",
      time: "30 min ago",
    },
    {
      id: 4,
      type: "Credential Leak",
      risk: "Low",
      time: "1 hour ago",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield size={32} />
            <div>
              <h1 className="text-2xl font-bold">
                CyberShield AI
              </h1>
              <p className="text-slate-400 text-sm">
                AI-Powered Cybersecurity Assistant
              </p>
            </div>
          </div>

          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
            Protected
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">

        {/* Metrics */}
        <section className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-center">
              <h3>Threat Score</h3>
              <AlertTriangle />
            </div>

            <p className="text-4xl font-bold mt-4">
              72
            </p>

            <p className="text-yellow-400 mt-2">
              Medium Risk
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-center">
              <h3>Active Threats</h3>
              <Activity />
            </div>

            <p className="text-4xl font-bold mt-4">
              12
            </p>

            <p className="text-red-400 mt-2">
              Needs Attention
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-center">
              <h3>Emails Scanned</h3>
              <Mail />
            </div>

            <p className="text-4xl font-bold mt-4">
              134
            </p>

            <p className="text-green-400 mt-2">
              Today
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-center">
              <h3>URLs Checked</h3>
              <Globe />
            </div>

            <p className="text-4xl font-bold mt-4">
              89
            </p>

            <p className="text-green-400 mt-2">
              Today
            </p>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <button className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition">
              <Mail className="mb-3" />

              <h3 className="font-semibold">
                Analyze Email
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Detect phishing attempts and email scams.
              </p>
            </button>

            <button className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition">
              <Globe className="mb-3" />

              <h3 className="font-semibold">
                Scan URL
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Check websites for malware and phishing.
              </p>
            </button>

            <button className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition">
              <Bot className="mb-3" />

              <h3 className="font-semibold">
                Ask CyberShield AI
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Get AI-powered cybersecurity guidance.
              </p>
            </button>

          </div>
        </section>

        {/* Threat Activity */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            Recent Threat Activity
          </h2>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4">
                    Threat Type
                  </th>

                  <th className="text-left p-4">
                    Risk Level
                  </th>

                  <th className="text-left p-4">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>

                {recentThreats.map((threat) => (
                  <tr
                    key={threat.id}
                    className="border-t border-slate-800"
                  >
                    <td className="p-4">
                      {threat.type}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          threat.risk === "High"
                            ? "text-red-400"
                            : threat.risk === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }
                      >
                        {threat.risk}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {threat.time}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </section>

      </div>
    </main>
  );
}