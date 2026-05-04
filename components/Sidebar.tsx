"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const links: ReadonlyArray<{ href: Route; label: string; emoji: string }> = [
  { href: "/dashboard", label: "ダッシュボード", emoji: "📊" },
  { href: "/companies", label: "企業管理", emoji: "🏢" },
  { href: "/templates", label: "テンプレート", emoji: "📝" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 md:min-h-screen border-r border-slate-200 bg-white/95 backdrop-blur">
      <div className="p-5 border-b border-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Hunting CRM</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">就活管理</h2>
      </div>

      <nav className="p-3 space-y-1">
        {links.map(({ href, label, emoji }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span aria-hidden>{emoji}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 pt-3">
        <button
          onClick={() => signOut(auth)}
          className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          ログアウト
        </button>
      </div>
    </aside>
  );
}
