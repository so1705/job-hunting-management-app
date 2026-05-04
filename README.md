# 就活管理アプリ (MVP)

## セットアップ
1. `npm install`
2. `.env.example` を `.env.local` にコピーして Firebase 値を設定
3. `npm run dev`

## Firebase 設定手順（課金なし方針）
1. Firebase プロジェクト作成
2. Authentication > Sign-in method で Email/Password 有効化
3. Realtime Database を作成（asia-southeast1 推奨）
4. Realtime Database Rules に以下を反映

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

5. Webアプリを追加し、SDK設定値を `.env.local` に設定

## データ構造（Realtime DB）
- `users/{uid}/companies`
- `users/{uid}/deadlines`
- `users/{uid}/es_entries`
- `users/{uid}/templates`
- `users/{uid}/spi_records`（MVPではUI未実装）

## 画面
- `/login`: ログイン
- `/dashboard`: サマリー表示
- `/companies`: 企業管理（追加/削除/一覧）
- `/companies/[id]`: 締切管理 + ES管理
- `/templates`: 自己PR・ガクチカ等ストック

## Vercel デプロイ
1. GitHubにPush
2. VercelでImport
3. Environment Variables に `.env.local` の値を登録
4. Deploy

## トラブルシュート

### 1) `The provided SHA ... does not belong to the specified branch 'main'.`
このエラーは、Vercel の再デプロイ対象コミットが `main` から外れたときに発生します。

対処手順:
1. Vercel の Deployments 画面に戻る
2. 該当エラーの古いデプロイを再実行せず、`main` の **最新デプロイ行から** `Redeploy` を押す
3. `git checkout main && git pull` 後に `git log --oneline -n 5` で最新コミットが `main` にあることを確認
4. Vercel Project Settings > Git で Production Branch が `main` か確認

### 2) `Type 'string' is not assignable to type '"興味あり" | ...'`
### 2.1) `Expression expected` で `const initial: CompanyForm = { ... }` と出る
これは **サンプルの `...` を実コードとして貼ってしまった** ときの構文エラーです。  
`...` は説明用の省略記号で、実際のオブジェクトに置き換える必要があります。

正しい対応:
- `"use client";` をファイル先頭に置く
- `type CompanyForm = Omit<Company, "userId" | "createdAt">;` を定義
- `const initial: CompanyForm = { ...実フィールド... }` を**完全なオブジェクト**で記述
- `const [form, setForm] = useState<CompanyForm>(initial);` はコンポーネント内に書く

`app/companies/page.tsx` のフォーム型が崩れていると発生します。

対処:
- `type CompanyForm = Omit<Company, "userId" | "createdAt">;`
- `const initial: CompanyForm = ...`
- `const [form, setForm] = useState<CompanyForm>(initial);`

の3点があるかを確認してください。

### 3) Vercelログがオレンジ警告（deprecated）だらけで失敗理由が見えない
`npm warn deprecated ...` は通常は**警告**で、ビルド失敗の直接原因ではありません。  
必ずログを最下部までスクロールして、`Failed to compile.` 直下の最初の `Type error` / `Error` を確認してください。

確認ポイント:
1. `Inspect Deployment` を開く
2. 右のログ欄を一番下まで移動
3. 最初に出る赤文字エラー1件を修正（警告は後回しでOK）

今回よくある例:
- `Type 'string' is not assignable to type '"興味あり" | ...'`
  - `app/companies/page.tsx` の `CompanyForm` 型注釈不足


## Codex運用（コピペ作業なし）

### GitHubに更新が反映されないときの確認
1. GitHub の最新コミット行に `×` が付いていないか確認（`×` はチェック失敗）
2. ブランチが `main` になっているか確認（右上の branch selector）
3. Vercel の Production Branch が `main` か確認
4. Vercel Deployments で **最新の main コミット**がデプロイ対象か確認

### Codexメニュー（GitHubアイコン右の▼）の意味
- `PR を作成する`
  - 変更を Pull Request として提案する（レビューしてから main に反映したい時）
- `下書き PR を作成する`
  - まだ作業中のPRを Draft で作る（CIだけ先に回したい時）
- `git apply をコピーする`
  - 端末で `git apply` できる差分コマンドをコピーする
- `パッチをコピーする`
  - 生パッチ（diff）本文をコピーする

### おすすめ自動化フロー
1. このチャットで修正依頼
2. Codex がコミット＋PR作成
3. GitHubで `Merge pull request`
4. Vercelが自動デプロイ（Auto-deploy ON 前提）
5. 必要時のみ `Redeploy`

### PRが表示されない理由（重要）
- `main` に**直接コミット**している場合、GitHub の Pull requests 一覧には何も出ません（正常動作）。
- PRを出したい場合は、`feature/...` ブランチにpushしてから `New pull request` を作成してください。

#### どちらで運用しているかの見分け方
- GitHub Code画面で最新コミットの branch が `main` なら「直接反映モード」
- Pull requests 画面が `0 Open` でも、Code画面のコミット時刻が更新されていれば反映済み

#### おすすめ運用（迷わない）
1. 基本: `main` 直接コミット（最速）
2. 重要変更: `feature/ui-improve` などでPR運用
3. Vercelは Production Branch を `main` に固定

### 最新コミットが反映されないとき（5分チェック）
1. GitHub Code画面で最新コミットSHAを控える（例: `a1137a6`）
2. Vercel Deploymentsで `Current` のSHAが同じか確認
3. SHAが違う場合は、未反映なので以下を実行

```bash
git checkout main
git pull origin main
git log --oneline -n 5
```

4. 変更を別ブランチで持っている場合は main にマージ

```bash
git checkout main
git merge --no-ff <your-feature-branch>
git push origin main
```

5. push後にVercelで `Redeploy`（またはAuto Deploy待ち）

#### 見分け方
- GitHub更新済み + Vercel SHA一致 + 画面だけ古い → ブラウザキャッシュ（`Ctrl+Shift+R`）
- GitHub更新済み + Vercel SHA不一致 → デプロイ対象が古い
- GitHub自体が古いSHAのまま → そもそもpush/merge未完了

### CodexとあなたのPCの差分について（ここでハマりやすい）
- このチャット内で私が作るコミットは、**あなたのPCのgitリポジトリに自動pushされません**。
- 反映するには次のどちらかが必要です。
  1. Codexメニューから `PR を作成する` → GitHubでMerge
  2. Codexメニューから `git apply をコピーする` を実行して、あなたのPCで適用→commit→push

#### あなたの今回の画面での正しい次操作
1. PowerShellで `git checkout main`
2. `git pull origin main`（これは実施済み）
3. `git status` が clean なら、次は **push不要**（既に最新）
4. 目的の変更がGitHubに無い場合、Codex側の変更を `PRを作成する` か `git applyをコピーする` で取り込む
5. GitHubのmain更新後、Vercelは自動デプロイ
