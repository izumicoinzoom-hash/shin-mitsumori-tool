# 新見積ツール

工数計算ツール（kousuu-tool）と見積もり漏れチェッカー（見積もりチェッカー2.html）をひとつにまとめたアプリです。

## 機能

- **工数計算** … カテゴリ別の工数明細をチェックして合計工数・合計技術料を計算
- **見積もり漏れチェッカー** … 車両部位を選択し、修理・新品交換・中古交換ごとのチェックリストで漏れを防止。PDF・印刷出力対応

## 使い方

```bash
npm install
npm run dev
```

ブラウザで表示される URL（例: http://localhost:5173）を開き、上部タブで「工数計算」と「見積もり漏れチェッカー」を切り替えて利用してください。

## ビルド

```bash
npm run build
```

`dist/` に出力されます。

---

## Git リポジトリの追加とウェブ公開（GitHub Pages）

リポジトリはすでに初期化済みです。以下の手順で GitHub にプッシュし、ウェブで公開できます。

### 1. Git のユーザー情報を設定（未設定の場合）

初めて Git を使う場合は、次のコマンドで名前とメールを設定してください。

```bash
git config --global user.email "あなたのメール@example.com"
git config --global user.name "あなたの名前"
```

### 2. GitHub で新しいリポジトリを作成

1. [GitHub](https://github.com) にログインし、**New repository** をクリック
2. **Repository name** に `shin-mitsumori-tool` を入力（別名でも可。別名の場合は後述の「リポジトリ名を変えた場合」を参照）
3. **Public** を選択
4. **Add a README file** はチェックしない（ローカルに既にあるため）
5. **Create repository** をクリック

### 3. リモートを追加してプッシュ

GitHub で表示されるリポジトリ URL を使って、以下を実行します（`YOUR_USERNAME` はあなたの GitHub ユーザー名に置き換え）。

```bash
cd "c:\Users\ken\新しいフォルダー\新見積ツール"
git remote add origin https://github.com/YOUR_USERNAME/shin-mitsumori-tool.git
git push -u origin main
```

### 4. GitHub Pages を有効にする

1. GitHub のリポジトリページで **Settings** → **Pages** を開く
2. **Build and deployment** の **Source** で **GitHub Actions** を選択して保存

これで `main` ブランチにプッシュするたびに自動でビルドされ、数分後に次の URL で公開されます。

- **URL:** `https://YOUR_USERNAME.github.io/shin-mitsumori-tool/`

※ リポジトリ名を `shin-mitsumori-tool` 以外にした場合は、`vite.config.js` の `base` を `'/あなたのリポジトリ名/'` に変更してからプッシュしてください。
