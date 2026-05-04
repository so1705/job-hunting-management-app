export type Company = {
  id?: string;
  userId: string;
  name: string;
  industry: string;
  interestLevel: number;
  status: "興味あり" | "応募済み" | "選考中" | "内定" | "お祈り";
  myPageUrl: string;
  loginId: string;
  loginPassword: string;
  memo: string;
  lastCheckedAt?: string;
  createdAt: string;
};

export type Deadline = {
  id?: string;
  userId: string;
  companyId: string;
  type: "ES" | "Webテスト" | "面接" | "説明会" | "その他";
  deadlineAt: string;
  remindBefore: number;
  completed: boolean;
  memo: string;
};

export type ESEntry = {
  id?: string;
  userId: string;
  companyId: string;
  title: string;
  kind: string;
  content: string;
  charCount: number;
  submittedAt: string;
};

export type Template = {
  id?: string;
  userId: string;
  category: "自己PR" | "ガクチカ" | "志望動機" | "強み" | "弱み";
  title: string;
  content: string;
  charCount: number;
};
