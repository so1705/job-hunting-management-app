"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");
  };

  return <div className="min-h-screen grid place-items-center"><form onSubmit={onSubmit} className="bg-white p-6 rounded shadow space-y-3 w-96"><h1>ログイン</h1><input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="メール"/><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="パスワード"/><button className="bg-blue-600 text-white px-3 py-2 rounded">ログイン</button></form></div>;
}
