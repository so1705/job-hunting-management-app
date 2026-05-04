"use client";
import { useAuth } from "@/lib/auth-context";
import { listCompanies, listDeadlines, listESEntries, upsertDeadline, upsertESEntry } from "@/lib/firestore";
import { Deadline, ESEntry } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyDetailPage() {
  const { id } = useParams<{id:string}>();
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [deadlines, setDeadlines] = useState<(Deadline & {id:string})[]>([]);
  const [entries, setEntries] = useState<(ESEntry & {id:string})[]>([]);
  const [d, setD] = useState({type:"ES",deadlineAt:"",remindBefore:1440,completed:false,memo:""});
  const [es, setEs] = useState({title:"",kind:"",content:"",submittedAt:""});
  const refresh = async() => { if(!user) return; const cs=await listCompanies(user.uid); setCompanyName(cs.find(c=>c.id===id)?.name ?? ""); setDeadlines((await listDeadlines(user.uid)).filter(v=>v.companyId===id)); setEntries((await listESEntries(user.uid)).filter(v=>v.companyId===id)); };
  useEffect(()=>{refresh();},[user,id]);
  if(!user) return null;
  return <div className="space-y-4"><h1 className="text-xl font-bold">{companyName}</h1>
    <form className="bg-white p-3 rounded" onSubmit={async e=>{e.preventDefault();await upsertDeadline({...d,userId:user.uid,companyId:id} as any);setD({type:"ES",deadlineAt:"",remindBefore:1440,completed:false,memo:""});refresh();}}><h2>締切追加</h2><select value={d.type} onChange={e=>setD({...d,type:e.target.value as any})}><option>ES</option><option>Webテスト</option><option>面接</option><option>説明会</option><option>その他</option></select><input type="datetime-local" value={d.deadlineAt} onChange={e=>setD({...d,deadlineAt:e.target.value})} required/><input type="number" value={d.remindBefore} onChange={e=>setD({...d,remindBefore:Number(e.target.value)})}/><textarea value={d.memo} onChange={e=>setD({...d,memo:e.target.value})}/><button>保存</button></form>
    <ul>{deadlines.map(x=><li key={x.id}>{x.type} - {x.deadlineAt}</li>)}</ul>
    <form className="bg-white p-3 rounded" onSubmit={async e=>{e.preventDefault();await upsertESEntry({...es,userId:user.uid,companyId:id,charCount:es.content.length} as any); setEs({title:"",kind:"",content:"",submittedAt:""}); refresh();}}><h2>ES追加</h2><input placeholder="タイトル" value={es.title} onChange={e=>setEs({...es,title:e.target.value})}/><input placeholder="種類" value={es.kind} onChange={e=>setEs({...es,kind:e.target.value})}/><textarea placeholder="本文" value={es.content} onChange={e=>setEs({...es,content:e.target.value})}/><p>{es.content.length}文字</p><input type="date" value={es.submittedAt} onChange={e=>setEs({...es,submittedAt:e.target.value})}/><button>保存</button></form>
    <ul>{entries.map(x=><li key={x.id}>{x.title} ({x.charCount}文字)</li>)}</ul>
  </div>;
}
