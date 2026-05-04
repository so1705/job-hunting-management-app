# 就活管理アプリ (MVP)

## セットアップ
1. `npm install`
2. `.env.example` を `.env.local` にコピーして Firebase 値を設定
3. `npm run dev`

## Firebase 設定手順
1. Firebase プロジェクト作成
2. Authentication > Sign-in method で Email/Password 有効化
3. Firestore を Native モードで作成
4. `firestore.rules` を Firestore Rules に反映
5. Webアプリを追加し、SDK設定値を `.env.local` に設定

## Firestore コレクション
- `users`
- `companies`
- `deadlines` (`deadlineAt`, `remindBefore` を保持)
- `es_entries`
- `templates`
- `spi_records`（MVPではUI未実装だが拡張予定）

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
4. Build Command: `npm run build`, Output: `.next`
5. Deploy

## Slack通知を後から追加する方針
- `deadlines` に `deadlineAt` と `remindBefore` を保存済み
- 将来 Cloud Functions / Cron で期限監視し、Webhook投稿を追加可能

## 404 が出る場合の確認
- Vercel の Project Settings で **Root Directory がリポジトリ直下**になっているか確認
- Build が失敗していないか（Deployments ログ）を確認
- Environment Variables（`NEXT_PUBLIC_FIREBASE_*`）が未設定だと画面遷移後にエラーになるため、本番環境にも登録
- 念のため `/login` と `/dashboard` に直接アクセスしてルーティング確認
