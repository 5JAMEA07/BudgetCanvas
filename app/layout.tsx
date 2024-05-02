// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetCanvas - Smart Finance Manager",
  description: "BudgetCanvas is a smart and intuitive app that helps you take control of your finances by simplifying budget allocation and expense tracking. With BudgetCanvas, you can easily set budgets for different categories, track your transactions, and receive timely notifications to stay on top of your spending. Say goodbye to financial stress and hello to better money management with BudgetCanvas.",
  manifest: "/manifest.json",
  authors: [
    { name: "Abraham James" }
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#19191A",
  viewportFit: "cover",
  minimumScale: 1,
  initialScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <AuthProvider>{children}</AuthProvider>
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
