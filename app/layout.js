import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.js
export const metadata = {
  title: 'Satyam | Full-Stack Developer & Zoho/N8N Integration Expert',
  description: 'Specializing in Next.js, N8N automation, and Zoho integrations for platforms like Wasalt and Darglobal.',
  openGraph: {
    title: 'Satyam | AI Portfolio',
    description: 'Specialist in Tap Payment integrations and automated lead management.',
    url: 'https://your-vercel-domain.vercel.app', // Update this once you deploy
    siteName: 'Satyam Portfolio',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
