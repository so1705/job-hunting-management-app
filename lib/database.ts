import { Company, Deadline, ESEntry, Template } from "@/types";
import { push, ref, remove, set, get, child } from "firebase/database";
import { rtdb } from "./firebase";

export const saveCredentialValue = (raw: string) => raw;

type ItemWithId<T> = T & { id: string };

async function listItems<T>(uid: string, key: string): Promise<ItemWithId<T>[]> {
  const snap = await get(child(ref(rtdb), `users/${uid}/${key}`));
  if (!snap.exists()) return [];
  const value = snap.val() as Record<string, T>;
  return Object.entries(value).map(([id, v]) => ({ id, ...v }));
}

export const listCompanies = (uid: string) => listItems<Company>(uid, "companies");
export const listDeadlines = (uid: string) => listItems<Deadline>(uid, "deadlines");
export const listESEntries = (uid: string) => listItems<ESEntry>(uid, "es_entries");
export const listTemplates = (uid: string) => listItems<Template>(uid, "templates");

async function upsert<T extends { id?: string }>(uid: string, key: string, item: T) {
  if (item.id) {
    const { id, ...rest } = item as any;
    await set(ref(rtdb, `users/${uid}/${key}/${id}`), rest);
    return id;
  }
  const newRef = push(ref(rtdb, `users/${uid}/${key}`));
  await set(newRef, item);
  return newRef.key;
}

export const upsertCompany = (uid: string, item: Company & { id?: string }) => upsert(uid, "companies", item);
export const upsertDeadline = (uid: string, item: Deadline & { id?: string }) => upsert(uid, "deadlines", item);
export const upsertESEntry = (uid: string, item: ESEntry & { id?: string }) => upsert(uid, "es_entries", item);
export const upsertTemplate = (uid: string, item: Template & { id?: string }) => upsert(uid, "templates", item);

export const deleteById = (uid: string, key: string, id: string) => remove(ref(rtdb, `users/${uid}/${key}/${id}`));
