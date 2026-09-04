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
      'クラブ・ミュージックを基点に、多様なジャンルや時代を行き来するフレキシブルなプレイとプロダクションを展開している。',
    // 韓国語バイオ（Biography セクションの「한국어」トグルで表示）
    bioKo:
      '1995년부터 활동을 시작한 XTAL은 DJ이자 프로듀서로, k404와 함께 Traks Boys라는 듀오로 가장 잘 알려져 있다. 또한 카와사키 공업지대의 스카이라인 위에서 펼쳐지는 루프탑 레이브 이벤트 DK SOUND의 레지던트로 활동 중이다.\n\n' +
      '그는 여러 프로젝트를 통해 폭넓은 음악 세계를 펼쳐왔다. Jun Kamoda와 함께한 밴드 (((Surround))), Your Song Is Good의 기타리스트 Masatomo Yoshizawa와의 듀오, 그리고 전자음악 프로듀서 Keita Sano와의 협업 프로젝트 등을 통해 꾸준히 신작을 발표하고 있다.\n\n' +
      '솔로 활동으로는 Crue-L Records와 Beats In Space Records에서 싱글을 발표한 후, 데뷔 앨범 Skygazer (2016, Crue-L Records), 두 번째 앨범 Aburelu (2020, 자가 레이블 Cizima), 그리고 세 번째 앨범 EKO (2024, Kakubarhythm)을 발표했다.\n\n' +
      '클럽 음악을 기반으로 하면서도 특정 장르나 스타일에 얽매이지 않는 XTAL의 DJ 셋과 프로덕션은, 시대와 장르를 넘나들며 독자적이면서도 시간에 구속되지 않는 사운드를 들려준다.'
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
      id: 'tempo-slider',
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
   *   - type は "dj" か "live"。venue（会場）/ city / time（開演）/ price（料金）/
   *     note（補足）/ links / recording は任意。title はパーティー名、venue は会場名。
   */
  schedule: [
    { date: '2026-08-29', title: 'MY',                     city: 'Tokyo',    type: 'dj' },
    { date: '2026-09-03', title: 'Photochemical Smog', venue: 'Bar Himitsu', city: 'Nagano', type: 'dj',
      time: '21:00–', price: 'Free entry (please tip the DJs)',
      recording: 'https://soundcloud.com/crystal-a/photochemical-smog-at-bar-1' },
    { date: '2026-09-09', title: 'WTW', venue: 'WOMB', city: 'Tokyo', type: 'dj',
      note: '2F — with Manaha, Rat, STACK',
      time: 'Open 23:00', price: 'Door ¥1,500',
      links: [{ label: 'Event', url: 'https://www.womb.co.jp/ja/events/090926' }] },
    { date: '2026-09-18', title: 'solfa 18TH ANNIVERSARY -DAY1-', venue: 'solfa', city: 'Tokyo', type: 'dj', note: 'as Traks Boys',
      time: '21:00–05:00', price: 'Door ¥2,500 / Adv ¥2,300 / Under 23 ¥1,500',
      links: [{ label: 'Event', url: 'https://nakameguro-solfa.com/events/solfa-18th-anniversary-day1/' }] },
    { date: '2026-10-02', title: 'studio mule', venue: 'Mitsuki', city: 'Tokyo', type: 'dj',
      time: '23:00–', price: '¥2,000' },
    { date: '2026-10-03', title: 'Bliss Wave', venue: 'Dende', city: 'Kanazawa', type: 'dj',
      time: '20:00–', price: 'Door ¥2,500 / Under 23 ¥2,000' },
    { date: '2026-11-01', title: 'MONSOON presents 超OVER50 with Fuzz TRAXX', subtitle: '〜ヤバさ満点くんの帰還〜', venue: 'Kata', city: 'Tokyo', type: 'dj',
      time: '15:00–22:00', price: '¥3,500 (1 drink + free zine)' },
    { date: '2026-11-21', title: 'OSKA', venue: 'Mago', city: 'Nagoya', type: 'dj' },
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
      title: 'Contact: XTAL (DJ Mix)', year: 2024, note: 'Global Hearts DJ Mix',
      cover: 'assets/discography/contact-dj-mix.jpg',
      links: [
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/contact-xtal-dj-mix/1781317663' }
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
      title: 'CRUE-LWAVE II', year: 2024, note: 'XTAL & KEITA SANO — “Happy Day” / Crue-L Records',
      cover: 'assets/discography/crue-lwave-2.jpg',
      links: [
        { label: 'Crue-L Shop', url: 'https://crue-l.shop/items/66a8fd06c362b304239a319d' }
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
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/live-esquisse-at-lake-nojiri/1626769124' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/0W1CVpNASZaxyJWMCXZEuB' }
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
        { label: 'Apple Music', url: 'https://music.apple.com/jp/album/guitar-esquisse-volume-one/1581365658' },
        { label: 'Spotify', url: 'https://open.spotify.com/album/65gNo2Y6rjpV7VIrTVkUw2' }
      ]
    },
    {
      title: 'A Leap (feat. achico)', year: 2020,
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
