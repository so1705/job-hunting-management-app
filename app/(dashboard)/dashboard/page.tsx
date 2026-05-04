"use client";
import { useAuth } from "@/lib/auth-context";
import { listCompanies, listDeadlines } from "@/lib/firestore";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ companies: 0, active: 0, week: 0, uncompleted: 0, unchecked: 0 });
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [companies, deadlines] = await Promise.all([listCompanies(user.uid), listDeadlines(user.uid)]);
      const now = new Date();
      const weekLimit = new Date(now); weekLimit.setDate(now.getDate() + 7);
      setStats({
        companies: companies.length,
        active: companies.filter((c) => c.status === "選考中").length,
        week: deadlines.filter((d) => new Date(d.deadlineAt) <= weekLimit && !d.completed).length,
        uncompleted: deadlines.filter((d) => !d.completed).length,
        unchecked: companies.filter((c) => !c.lastCheckedAt).length,
      });
    })();
  }, [user]);
  return <div className="grid md:grid-cols-3 gap-4">{Object.entries(stats).map(([k, v]) => <div key={k} className="bg-white p-4 rounded shadow"><p>{k}</p><p className="text-2xl font-bold">{v}</p></div>)}</div>;
}
