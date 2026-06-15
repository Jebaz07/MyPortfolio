import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jebaz Wesley Raj | Full Stack Developer",
  description: "Premium portfolio of Jebaz Wesley Raj — Full Stack Developer & Creative Technologist",
  keywords: ["portfolio", "developer", "full stack", "react", "next.js"],
  openGraph: {
    title: "Jebaz Wesley Raj | Full Stack Developer",
    description: "Premium portfolio of Jebaz Wesley Raj",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-white font-sans">
        <SmoothScroll>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
