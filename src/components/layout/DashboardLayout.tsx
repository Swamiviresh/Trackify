"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "../ui/ThemeToggle";
import { PageTransition } from "@/components/motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="p-4 lg:p-8 pt-0">
          <PageTransition key={pathname}>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
