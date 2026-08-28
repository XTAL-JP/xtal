/*
 * ★ サイトの内容はこのファイルだけ編集すれば更新できます。
 *   編集して GitHub に push すると自動で反映されます（更新手順は README.md 参照）。
 *
 *   ※ URL に「要確認」と書いた箇所は、正しいURLに差し替えてください。
 */
var DATA = {
  profile: {
    name: 'XTAL',
    tagline: 'DJ / Producer — Nagano, Japan',
    // 英語のバイオ本文（改行は \n で。※プレースホルダ。本人の文章に差し替えてください）
    bio:
      'XTAL is a DJ and producer based in Nagano, Japan. ' +
      'Moving between deep, melodic house and textured electronic soundscapes, ' +
      'XTAL has released on labels including Kakubarhythm and collaborated with artists ' +
      'such as Inner Science and Keita Sano. ' +
      '(This is placeholder text — replace with your own biography.)'
  },

  // 中央揃えのソーシャル導線（LinkTree のアイコン群）
  socials: [
    { label: 'Instagram',   url: 'https://www.instagram.com/xtal_jp/' },
    { label: 'X',           url: 'https://x.com/XTAL_JP' },
    { label: 'SoundCloud',  url: 'https://soundcloud.com/xtal_jp' },
    { label: 'YouTube',     url: 'https://www.youtube.com/@XTAL_JP' },
    { label: 'Spotify',     url: 'https://open.spotify.com/search/XTAL' },   // 要確認：アーティストページURL
    { label: 'Apple Music', url: 'https://music.apple.com/jp/search?term=XTAL' }, // 要確認：アーティストページURL
    { label: 'Bandcamp',    url: 'https://bandcamp.com/search?q=XTAL' }      // 要確認：アーティストページURL
  ],

  // 注目リンク（リリース・拡張機能など。LinkTree のメインボタン相当）
  releases: [
    { label: 'XTAL / Inner Science "Voices"',  url: 'https://album.link/i/1810029937' },
    { label: 'XTAL "EKO"',                     url: 'https://kakubarhythm.lnk.to/EKO' },
    { label: 'XTAL & KEITA SANO "The Sun" EP', url: 'https://tr.ee/1FvbNieVmW' },
    { label: 'Contact: XTAL (DJ Mix)',         url: 'https://music.apple.com/jp/album/contact-xtal-dj-mix/1781317663' },
    { label: 'TEMPO Slider (Chrome extension)', url: 'https://chromewebstore.google.com/detail/tempo-slider/khfoddahloneinahhnejjpjengdaglcl' }
  ],

  /*
   * スケジュール。開催日(date)を見て自動で Upcoming / Past に振り分けます。
   *   - 終わったイベントも消さずに残ります（Past 側に表示）。
   *   - DJ録音を SoundCloud 等にアップしたら、その項目に recording を1行足すと
   *     「▶ Recording」リンクが出ます。
   *   - type は "dj" か "live"。city / links / recording は任意。
   */
  schedule: [
    {
      date: '2025-06-01',
      title: 'SP-404MKII Jam',
      venue: 'Curly Record',
      city: '',
      type: 'live',
      links: [
        { label: 'YouTube', url: 'https://www.youtube.com/@XTAL_JP' } // 要確認：該当動画URL
      ]
      // recording: 'https://soundcloud.com/xtal_jp/...'   // ← 録音を上げたら追記
    }
    // 例）新しい予定を足すときは上に追記:
    // {
    //   date: '2026-09-20', title: 'Night Session', venue: 'Club XXX', city: 'Tokyo',
    //   type: 'dj', links: [{ label: 'Tickets', url: 'https://...' }]
    // },
  ],

  /*
   * News（雑多なトピック）。新しい順に表示されます。
   *   新しい記事は配列の「先頭」に足してください。url は任意（あればタイトルがリンクに）。
   */
  news: [
    {
      date: '2026-08-29',
      title: 'Website launched',
      body: 'The official XTAL website is now live.',
      url: ''
    }
  ],

  // フッターに出す連絡先（任意）。※要確認：正しい連絡先に
  contact: { label: 'Contact', url: 'mailto:contact@xtal-jp.com' }
};
