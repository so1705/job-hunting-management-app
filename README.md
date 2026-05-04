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
