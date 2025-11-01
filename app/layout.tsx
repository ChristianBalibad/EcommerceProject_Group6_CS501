import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import AuthLoader from "@/components/auth/AuthLoader";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import DevSessionClearer from "@/components/dev/DevSessionClearer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Undefined | Where Style Meets Substance",
  description: "Discover bold, modern apparel that elevates your everyday. Shop our collection of premium streetwear, sneakers, and fashion essentials.",
  icons: {
    icon: '/images/undefinedicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DevSessionClearer />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AuthLoader>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </AuthLoader>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
