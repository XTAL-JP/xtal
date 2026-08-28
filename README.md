# XTAL 公式サイト

XTAL（DJ / Producer, Nagano Japan）の公式サイト。ビルド工程なしの静的サイトで、GitHub Pages でホストしています。

- 公開URL: https://xtal-jp.com
- 特徴: 背景の暖色グラデーションは **アクセス（リロード）するたびにランダム生成** されます。

## 内容の更新方法（`data.js` を編集するだけ）

サイトの文章・リンク・スケジュール・News は、すべて **`data.js`** の中にあります。
このファイルを編集して GitHub に push すれば、数分で自動的に反映されます（GitHub Pages）。

### スケジュールを追加する

`data.js` の `schedule:` 配列に、オブジェクトを1つ足します（新しい予定は上に足すのがおすすめ）。

```js
{
  date: '2026-09-20',          // 開催日（YYYY-MM-DD）
  title: 'Night Session',      // イベント名
  venue: 'Club XXX',           // 会場
  city: 'Tokyo',               // 都市（任意）
  type: 'dj',                  // 'dj' か 'live'
  links: [{ label: 'Tickets', url: 'https://...' }]  // 任意
},
```

- **開催日を過ぎると自動で「Past」に移動** します（消えずに残ります）。
- 未来の予定は「Upcoming」に表示されます。

### DJ録音（SoundCloud等）のリンクを足す

該当スケジュール項目に `recording:` の1行を足すだけで、「▶ Recording」リンクが出ます。

```js
{
  date: '2025-06-01',
  title: 'SP-404MKII Jam',
  venue: 'Curly Record',
  type: 'live',
  recording: 'https://soundcloud.com/xtal_jp/your-mix'   // ← これを追記
},
```

### News を書く

`data.js` の `news:` 配列の **先頭** にオブジェクトを1つ足します（新しい順に表示されます）。

```js
{
  date: '2026-09-01',
  title: 'New mix uploaded',
  body: 'A new DJ mix is now on SoundCloud.',
  url: 'https://soundcloud.com/xtal_jp/...'   // 任意（あればタイトルがリンクになる）
},
```

### リンク・プロフィールを直す

- ソーシャル: `socials:` 配列
- リリース等の注目リンク: `releases:` 配列
- 名前・肩書き・バイオ: `profile:`
- 連絡先: `contact:`

> ⚠️ `data.js` 内で「要確認」とコメントした URL（Spotify / Apple Music / Bandcamp のアーティストページ、YouTube動画など）は、正しいURLに差し替えてください。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | ページ骨格 |
| `data.js` | **内容（ここだけ編集すればOK）** |
| `main.js` | data.js を読み込んで描画 |
| `background.js` | 暖色グラデーション背景の生成 |
| `styles.css` | スタイル |
| `assets/favicon.svg` | ファビコン |
| `CNAME` | 独自ドメイン（xtal-jp.com） |

## ローカルで確認する

```bash
cd xtal-jp
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## デプロイ（GitHub Pages）

`main` ブランチに push すると自動で公開されます（Settings → Pages → Source: `main` / root）。

### 独自ドメインの DNS 設定（初回のみ・レジストラ側で設定）

`xtal-jp.com` を GitHub Pages に向けるため、ドメイン管理画面で以下を設定します。

- `xtal-jp.com`（apex）の **A レコード** を4つ:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www.xtal-jp.com` の **CNAME** を `XTAL-JP.github.io` に

DNS が反映されたら、GitHub の Settings → Pages で「Enforce HTTPS」を有効にします。
