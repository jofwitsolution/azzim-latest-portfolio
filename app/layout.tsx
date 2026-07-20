import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigations/Navbar";
import Footer from "@/components/Footer";
import { HideOnDashboard } from "@/components/navigations/HideOnDashboard";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import AuroraBackground from "@/components/motion/AuroraBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Azzim Aina | Portfolio",
  description: "The official portfolio of Azzim Aina",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: [
    "azzim aina",
    "azzim",
    "azzim aina portfolio",
    "azzim aina resume",
  ],
  openGraph: {
    title: "Azzim Aina | Portfolio",
    description: "The official portfolio of Azzim Aina",
    url: "https://portfolio.azzimaina.com",
    siteName: "Azzim Aina | Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <HideOnDashboard>
            <AuroraBackground />
            <Navbar />
          </HideOnDashboard>
          {children}
          <Toaster position="bottom-right" />
          <HideOnDashboard>
            <Footer />
          </HideOnDashboard>
        </ThemeProvider>
      </body>
    </html>
  );
}
