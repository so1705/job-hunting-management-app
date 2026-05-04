"use client";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const links = [
    ["/dashboard", "ダッシュボード"],
    ["/companies", "企業管理"],
    ["/templates", "テンプレート"],
  ];
  return (
    <aside className="w-full md:w-64 bg-white border-r p-4 space-y-2">
      <h2 className="font-bold text-lg">就活管理</h2>
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="block p-2 rounded hover:bg-slate-100">{label}</Link>
      ))}
      <button onClick={() => signOut(auth)} className="mt-4 text-red-600">ログアウト</button>
    </aside>
  );
}
