import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Commit Life",
  description: "Gamified Habit Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${pixelFont.variable} font-sans bg-zinc-900 text-slate-50 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html >
  );
}
