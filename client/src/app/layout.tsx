// layout.tsx
import { Onest } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "SSH",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${onest.variable} font-onest`}>{children}</body>
      <Toaster />
      {/* <Footer /> */}
    </html>
  );
}
