"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { deleteById, listCompanies, saveCredentialValue, upsertCompany } from "@/lib/database";
import { useEffect, useState } from "react";
import { Company } from "@/types";

type CompanyForm = Omit<Company, "userId" | "createdAt">;
const initial: CompanyForm = {
  name: "",
  industry: "",
  interestLevel: 3,
  status: "興味あり",
  myPageUrl: "",
  loginId: "",
  loginPassword: "",
  memo: "",
  lastCheckedAt: "",
};

function Content() {
  const { user } = useAuth();
  const [rows, setRows] = useState<(Company & { id: string })[]>([]);
  const [form, setForm] = useState<CompanyForm>(initial);
  const [showPw, setShowPw] = useState(false);

  const refresh = async () => user && setRows(await listCompanies(user.uid));
  useEffect(() => {
    refresh();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">企業管理</h1>
            <p className="mt-1 text-sm text-slate-600">企業情報・マイページ・選考状況を一元管理できます。</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">企業を追加</h2>
            <form
              className="mt-4 grid gap-3 md:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await upsertCompany(user.uid, {
                  ...form,
                  userId: user.uid,
                  createdAt: new Date().toISOString(),
                  loginPassword: saveCredentialValue(form.loginPassword),
                });
                setForm(initial);
                refresh();
              }}
            >
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="企業名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="業界" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              <input className="rounded-lg border border-slate-300 px-3 py-2" type="number" min={1} max={5} value={form.interestLevel} onChange={(e) => setForm({ ...form, interestLevel: Number(e.target.value) })} />
              <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Company["status"] })}>
                <option>興味あり</option><option>応募済み</option><option>選考中</option><option>内定</option><option>お祈り</option>
              </select>
              <input className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" placeholder="マイページURL" value={form.myPageUrl} onChange={(e) => setForm({ ...form, myPageUrl: e.target.value })} />
              <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="ログインID" value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-lg border border-slate-300 px-3 py-2" type={showPw ? "text" : "password"} placeholder="ログインパスワード" value={form.loginPassword} onChange={(e) => setForm({ ...form, loginPassword: e.target.value })} />
                <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" onClick={() => setShowPw(!showPw)}>{showPw ? "非表示" : "表示"}</button>
              </div>
              <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={form.lastCheckedAt} onChange={(e) => setForm({ ...form, lastCheckedAt: e.target.value })} />
              <textarea className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" rows={3} placeholder="メモ" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
              <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 md:col-span-2">企業を追加</button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">登録企業一覧</h2>
              <span className="text-sm text-slate-500">{rows.length}件</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {rows.map((c) => (
                <article key={c.id} className="rounded-xl border border-slate-200 p-4">
                  <Link href={`/companies/${c.id}`} className="text-lg font-semibold text-slate-900 hover:text-blue-700">{c.name}</Link>
                  <p className="mt-1 text-sm text-slate-600">{c.industry || "業界未設定"}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">志望度: {c.interestLevel}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">{c.status}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/companies/${c.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">詳細</Link>
                    <button className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50" onClick={async () => { await deleteById(user.uid, "companies", c.id); refresh(); }}>削除</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <RequireAuth>
      <Content />
    </RequireAuth>
  );
}
