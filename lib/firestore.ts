import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { Company, Deadline, ESEntry, Template } from "@/types";

export const saveCredentialValue = (raw: string) => raw; // encryption-ready

async function listByUser<T>(name: string, userId: string): Promise<(T & { id: string })[]> {
  const q = query(collection(db, name), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export const listCompanies = (userId: string) => listByUser<Company>("companies", userId);
export const listDeadlines = (userId: string) => listByUser<Deadline>("deadlines", userId);
export const listESEntries = (userId: string) => listByUser<ESEntry>("es_entries", userId);
export const listTemplates = (userId: string) => listByUser<Template>("templates", userId);

export async function upsertCompany(c: Company & { id?: string }) {
  if (c.id) return setDoc(doc(db, "companies", c.id), c);
  return addDoc(collection(db, "companies"), c);
}
export async function upsertDeadline(d: Deadline & { id?: string }) {
  if (d.id) return setDoc(doc(db, "deadlines", d.id), d);
  return addDoc(collection(db, "deadlines"), d);
}
export async function upsertESEntry(e: ESEntry & { id?: string }) {
  if (e.id) return setDoc(doc(db, "es_entries", e.id), e);
  return addDoc(collection(db, "es_entries"), e);
}
export async function upsertTemplate(t: Template & { id?: string }) {
  if (t.id) return setDoc(doc(db, "templates", t.id), t);
  return addDoc(collection(db, "templates"), t);
}

export const deleteById = (name: string, id: string) => deleteDoc(doc(db, name, id));
