"use client";
import Sidebar from "@/components/Sidebar";
import { RequireAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen md:flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </RequireAuth>
  );
}
