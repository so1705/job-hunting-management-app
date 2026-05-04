"use client";
import Sidebar from "@/components/Sidebar";
import { RequireAuth, useAuth } from "@/lib/auth-context";
import { listTemplates, upsertTemplate } from "@/lib/firestore";
import { Template } from "@/types";
import { useEffect, useState } from "react";

function Content(){const {user}=useAuth(); const [rows,setRows]=useState<(Template & {id:string})[]>([]); const [form,setForm]=useState({category:"自己PR",title:"",content:""}); const refresh=async()=>user&&setRows(await listTemplates(user.uid)); useEffect(()=>{refresh();},[user]); if(!user) return null; return <div className="min-h-screen md:flex"><Sidebar/><main className="flex-1 p-4 space-y-3"><h1 className="text-xl font-bold">テンプレート</h1><form className="bg-white p-3 rounded" onSubmit={async e=>{e.preventDefault(); await upsertTemplate({...form,userId:user.uid,charCount:form.content.length} as any); setForm({category:"自己PR",title:"",content:""}); refresh();}}><select value={form.category} onChange={e=>setForm({...form,category:e.target.value as Template['category']})}><option>自己PR</option><option>ガクチカ</option><option>志望動機</option><option>強み</option><option>弱み</option></select><input placeholder="タイトル" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea placeholder="本文" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/><p>{form.content.length}文字</p><button>保存</button></form><div className="grid gap-2">{rows.map(t=><article key={t.id} className="bg-white rounded p-3"><p>{t.category} / {t.title}</p><p className="text-sm">{t.charCount}文字</p></article>)}</div></main></div>}
export default function TemplatesPage(){return <RequireAuth><Content/></RequireAuth>;}
