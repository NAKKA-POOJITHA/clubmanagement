import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "DIGITwinTHON — Pragati University Centralized Clubs Management Platform",
  description: "Unified digital management system for Pragati University technical and non-technical student clubs, CSEC council, PRAGSOFT, AR/VR, Rotaract, events, digital QR memberships, attendance, certificates, projects, LMS roadmaps, and reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-surface-muted text-ink min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
