import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Prism | The AI-Powered Collaborative Workspace",
    template: "%s | Prism",
  },
  description:
    "A streamlined project management tool for small teams. Break down complex goals into actionable tasks with the AI Task Architect.",
  keywords: [
    "Project Management",
    "AI",
    "SaaS",
    "Next.js",
    "Collaboration",
    "Task Tracking",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Prism | Collaborative Workspace",
    description: "Modern project management for small teams and students.",
    type: "website",
    siteName: "Prism",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
