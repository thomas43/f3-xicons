import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { Navbar } from "@/components/Navbar";
import { BackToTopButton } from "@/components/BackToTopButton"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "F3 Xicons",
  description: "Search F3 Exicon & Lexicon entries",
  icons: {
    icon: [
     { url: "/favicon-light.ico",  media: "(prefers-color-scheme: dark)" }, 
     { url: "/favicon-dark.ico",  media: "(prefers-color-scheme: light)"  },
     { url: "/favicon-dark.ico" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
       <Navbar />
        <ToastProvider>        
          {children}
        </ToastProvider>
       <BackToTopButton />
      </body>
    </html>
  );
}
