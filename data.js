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
    { date: '2026-08-29', title: 'MY',                     city: 'Tokyo',    type: 'dj' },
    { date: '2026-09-03', title: 'Bar Himitsu',            city: 'Nagano',   type: 'dj' },
    { date: '2026-09-18', title: 'Solfa', city: 'Tokyo', type: 'dj', note: 'as Traks Boys' },
    { date: '2026-10-02', title: 'Mitsuki',                city: 'Tokyo',    type: 'dj' },
    { date: '2026-10-03', title: 'Dende',                  city: 'Kanazawa', type: 'dj' },
    { date: '2026-11-01', title: 'Kata',                   city: 'Tokyo',    type: 'dj' },
    { date: '2026-11-21', title: 'Mago',                   city: 'Nagoya',   type: 'dj' },
    {
      date: '2026-08-21',
      title: 'Photochemical Smog',
      venue: 'Bar Himitsu',
      city: 'Nagano',
      type: 'dj',
      recording: 'https://soundcloud.com/crystal-a/photochemical-smog-at-bar'
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
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/voices-single/1810029937' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/1iEokRazattrY3nivVFgqg' }
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
      title: 'The Sun EP', year: 2024, note: 'XTAL & KEITA SANO',
      cover: 'assets/discography/the-sun.jpg',
      links: [
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/the-sun-ep-single/1839189943' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/7v4YnRuEl2Q37yWnUVqHLr' }
      ]
    },
    {
      title: 'QUIET SPACE FOR QUIET LIFE Part.3 & 4', year: 2023,
      cover: 'assets/discography/quiet-space-2.jpg',
      links: [
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/quiet-space-for-quiet-life-pt-3-4-ep/1720137732' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/1pwQGSXQWBJUNHMhGaNP9j' }
      ]
    },
    {
      title: 'Tangle', year: 2023, note: 'Masatomo Yoshizawa, XTAL',
      cover: 'assets/discography/tangle.jpg',
      links: [
        { label: 'Streaming', url: 'https://kakubarhythm.lnk.to/Tangle' },
        { label: 'Bandcamp', url: 'https://masatomoyoshizawa.bandcamp.com/album/tangle' }
      ]
    },
    {
      title: 'LIVE ESQUISSE at TEMPO', year: 2023, note: 'Masatomo Yoshizawa, XTAL',
      cover: 'assets/discography/live-esquisse-tempo.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://masatomoyoshizawa.bandcamp.com/album/live-esquisse-at-tempo' }
      ]
    },
    {
      title: 'CROSSING PARK Part.1 & 2', year: 2023,
      cover: 'assets/discography/crossing-park.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/crossing-park-part-1-2' },
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/crossing-park-pt-1-2-ep/1688023377' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/7BuyosgquDTLnUVkSGqbT2' }
      ]
    },
    {
      title: 'Playing Nowhere', year: 2022, note: 'Masatomo Yoshizawa, XTAL',
      cover: 'assets/discography/playing-nowhere.jpg',
      links: [
        { label: 'Streaming', url: 'https://kakubarhythm.lnk.to/PlayingNowhere' }
      ]
    },
    {
      title: 'Happy In The Rain', year: 2022, note: 'Masatomo Yoshizawa, XTAL',
      cover: 'assets/discography/happy-in-the-rain.jpg',
      links: [
        { label: 'Streaming', url: 'https://kakubarhythm.lnk.to/HITR' }
      ]
    },
    {
      title: 'LIVE ESQUISSE at Lake Nojiri', year: 2022, note: 'Masatomo Yoshizawa, XTAL',
      cover: 'assets/discography/live-esquisse-nojiri.jpg',
      links: [
        { label: 'Kakubarhythm', url: 'https://kakubarhythm.com/discography/post/10119' }
      ]
    },
    {
      title: 'Crazy Fool / Days New', year: 2022,
      cover: 'assets/discography/crazy-fool.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/crazy-fool-days-new' },
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/crazy-fool-days-new-single/1627777212' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/4VqSD1YXqf4pOLkt9NpzzW' }
      ]
    },
    {
      title: 'QUIET SPACE FOR QUIET LIFE Part.1 & 2', year: 2021,
      cover: 'assets/discography/quiet-space.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/quiet-space-for-quiet-life-part-1-2' },
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/quiet-space-for-quiet-life-pts-1-2-ep/1594347305' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/1N2e1jlChBhvY7efSF6MzL' }
      ]
    },
    {
      title: 'Guitar Esquisse Volume One', year: 2021, note: 'Masatomo Yoshizawa, XTAL',
      cover: 'assets/discography/guitar-esquisse.jpg',
      links: [
        { label: 'Kakubarhythm', url: 'https://kakubarhythm.com/discography/post/9398' }
      ]
    },
    {
      title: 'A Leap (feat. achico)', year: 2020, note: 'Jun Kamoda',
      cover: 'assets/discography/a-leap.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://junkamoda.bandcamp.com/track/xtal-a-leap-featuring-achico-jun008' },
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/a-leap-feat-achico-single/1519044717' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/5Kujszco5xJHC8lJUsZVzc' }
      ]
    },
    {
      title: 'Aburelu', year: 2020, note: 'Cizima',
      cover: 'assets/discography/aburelu.jpg',
      links: [
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/aburelu' },
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/aburelu/1615538317' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/340eX8v0TRFYTnF4OMDbKl' }
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
        { label: 'Bandcamp', url: 'https://xtal-jp.bandcamp.com/album/skygazer' },
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/skygazer/1571498702' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/5Ky8LTuZHAoQ5Q4NRib50P' }
      ]
    }
  ],

  // 連絡先（Contact セクション）。note が説明文、label がボタン文言。
  contact: {
    label: 'Get in Touch',
    url: 'mailto:contact@xtal-jp.com',
    note: 'For DJ bookings, live shows, remixes, and collaborations — feel free to reach out.'
  }
};
