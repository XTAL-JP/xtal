/*
 * ★ サイトの内容はこのファイルだけ編集すれば更新できます。
 *   編集して GitHub に push すると自動で反映されます（更新手順は README.md 参照）。
 *
 *   ※ URL に「要確認」と書いた箇所は、正しいURLに差し替えてください。
 */
var DATA = {
  profile: {
    name: 'XTAL',
    tagline: 'DJ / Producer',
    photo: 'assets/xtal.jpg',
    // 英語バイオ（段落は空行で区切る）
    bio:
      'Active since 1995, XTAL (pronounced “Crystal”) is a DJ and producer best known as one half of Traks Boys with k404 and resident of DK SOUND—a notorious rooftop rave pulsing above Kawasaki’s industrial skyline. He has also been active in several projects, including the band (((Ssssurrounddd))) with Jun Kamoda, a duo with Your Song Is Good guitarist Masatomo Yoshizawa, and a collaboration unit with dance-music producer Keita Sano, consistently releasing new material across these collaborations.\n\n' +
      'As a solo artist, XTAL released singles on Crue-L Records and Beats In Space Records before putting out his debut album Skygazer (2016, Crue-L Records), followed by Aburelu (2020, self-released on Cizima), and his third album EKO (2024, Kakubarhythm).\n\n' +
      'Grounded in club music yet free from stylistic boundaries, XTAL’s DJ sets and productions flexibly move between diverse genres and eras, revealing a sound that is both distinctive and timeless.',
    // 日本語バイオ（Biography セクションの「日本語」トグルで表示）
    bioJa:
      '1995年からDJを開始。川崎工場地帯の某工場屋上にて行われているインダストリアル・レイブパーティー「DK SOUND」で、k404とのTraks BoysとしてレジデントDJを務める。Jun Kamodaとのバンド(((さらうんど)))、Your Song Is Goodのギタリスト吉澤成友とのユニット、ダンス・ミュージック・プロデューサーKeita Sanoとのユニットでも、精力的にリリースを重ねる。\n\n' +
      'ソロとしては、〈Crue-L Records〉や〈Beats In Space Records〉からシングルをリリースした後、〈Crue-L Records〉からの1stアルバム『Skygazer』（2016年）、自主レーベル〈Cizima〉からの2ndアルバム『Aburelu』（2020年）に続き、〈カクバリズム〉より3rdアルバム『EKO』（2024年）をリリース。\n\n' +
      'クラブ・ミュージックを基点に、多様なジャンルや時代を行き来するフレキシブルなプレイとプロダクションを展開している。'
  },

  // 中央揃えのソーシャル導線
  socials: [
    { label: 'SoundCloud',  url: 'https://soundcloud.com/crystal-a' },
    { label: 'Bandcamp',    url: 'https://xtal-jp.bandcamp.com/' },
    { label: 'Spotify',     url: 'https://open.spotify.com/artist/2t07wCTjaVSrObNSvgMyLi' },
    { label: 'Apple Music', url: 'https://music.apple.com/jp/artist/xtal/1510861367' },
    { label: 'Instagram',   url: 'https://www.instagram.com/_xtal_jp_' },
    { label: 'X',           url: 'https://x.com/XTAL_JP' },
    { label: 'TikTok',      url: 'https://www.tiktok.com/@xtal641' },
    { label: 'YouTube',     url: 'https://www.youtube.com/@XTAL_JP' }
  ],

  /*
   * Featured（今プッシュしたいもの）。socials の下・Schedule の上に表示。
   *   - お知らせカード：{ type:'post', date, title, body(空行で段落), links:[{label,url}], image(任意) }
   *   - 単純リンクボタン：{ type:'link', label:'表示名', url:'URL' }
   *   複数並べられます。差し替えたいときはこの配列を編集して push。
   */
  featured: [
    {
      type: 'post',
      date: '2026-06-27',
      title: 'TEMPO Slider — Browser Extension for DJs',
      image: 'assets/featured/tempo-slider.jpg',
      body:
`Just released a browser extension for DJs called TEMPO Slider (Chrome / Firefox). I built this because I wanted to audition tracks online at the same tempo I'd actually play them at in a set.

Supported sites: Bandcamp / Beatport / Traxsource / Discogs (YouTube previews), plus any other site you add. Chrome / Firefox · free · open source. DJs, give it a try — feedback welcome!

————

TEMPO Slider という DJ向けのブラウザ拡張機能（Chrome / Firefox）を公開しました。ネットで試聴する時に、実際にDJでプレイする時のように、テンポを変更した状態で検討したいと思い、制作しました。

対応サイト：Bandcamp / Beatport / Traxsource / Discogs（YouTube 試聴）ほか、任意のサイトを追加可能。Chrome / Firefox 対応・無料・オープンソース。DJ の方、ぜひ使ってみてください。フィードバックもお待ちしてます。`,
      links: [
        { label: 'Chrome',  url: 'https://chromewebstore.google.com/detail/tempo-slider/khfoddahloneinahhnejjpjengdaglcl' },
        { label: 'Firefox', url: 'https://addons.mozilla.org/ja/firefox/addon/tempo-slider/' }
      ]
    }
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
   * Discography（新しい順）。Bandcamp 掲載作を収録。
   *   - links には Bandcamp を必ず、ストリーミング（Spotify/Apple 等）がある場合は追加。
   *   - ※ streaming が空の作品は、正しいストリーミングURLが分かれば links に追記してください。
   *   - cover は assets/discography/ 内の画像。note は共作相手など補足（任意）。
   */
  discography: [
    {
      title: 'Voices', year: 2025, note: 'XTAL / Inner Science',
      cover: 'assets/discography/voices.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/voices' },
        { label: 'Streaming', url: 'https://album.link/i/1810029937' }
      ]
    },
    {
      title: 'EKO', year: 2024, note: 'Kakubarhythm',
      cover: 'assets/discography/eko.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/eko' },
        { label: 'Streaming', url: 'https://kakubarhythm.lnk.to/EKO' }
      ]
    },
    {
      title: 'CROSSING PARK Part.1 & 2', year: 2023,
      cover: 'assets/discography/crossing-park.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/crossing-park-part-1-2' }
        // { label: 'Spotify', url: '' }  // ← ストリーミングにあれば追記
      ]
    },
    {
      title: 'Lost And Found (Extended Version)', year: 2022, note: '(((さらうんど)))',
      cover: 'assets/discography/lost-and-found.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/lost-and-found-extended-version' }
      ]
    },
    {
      title: 'Crazy Fool / Days New', year: 2022,
      cover: 'assets/discography/crazy-fool.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/crazy-fool-days-new' }
      ]
    },
    {
      title: 'QUIET SPACE FOR QUIET LIFE Part.1 & 2', year: 2021,
      cover: 'assets/discography/quiet-space.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/quiet-space-for-quiet-life-part-1-2' }
      ]
    },
    {
      title: 'Aburelu', year: 2020, note: 'Cizima',
      cover: 'assets/discography/aburelu.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/aburelu' }
      ]
    },
    {
      title: 'Green Days / Steps On The Wind', year: 2020, note: 'Gonno, XTAL, Inner Science',
      cover: 'assets/discography/green-days.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/green-days-steps-on-the-wind' }
      ]
    },
    {
      title: 'Skygazer', year: 2016, note: 'Crue-L Records',
      cover: 'assets/discography/skygazer.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/skygazer' }
      ]
    }
  ],

  // フッターに出す連絡先（任意）。label を変えれば文言も変わります。
  contact: { label: 'Get in Touch', url: 'mailto:contact@xtal-jp.com' }
};
