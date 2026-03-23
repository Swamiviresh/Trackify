import type { Metadata } from "next";
import AuthProvider from "@/components/layout/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trackify - Track Your Expenses Smarter",
  description:
    "A modern expense tracker with authentication, analytics, and budget management. Track income, expenses, and gain insights into your spending habits.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><rect width='36' height='36' rx='8' fill='%236366f1'/><path d='M8 25L15 16L20 20L28 10' stroke='white' stroke-width='2.8' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M24.5 10H28V13.5' stroke='white' stroke-width='2.8' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
