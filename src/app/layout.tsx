import type { Metadata } from "next";
import AuthProvider from "@/components/layout/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trackify - Track Your Expenses Smarter",
  description:
    "A modern expense tracker with authentication, analytics, and budget management. Track income, expenses, and gain insights into your spending habits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
