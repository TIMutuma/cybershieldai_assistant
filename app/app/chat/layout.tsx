import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | CyberShield AI",
  description: "AI-powered cybersecurity assistant",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
