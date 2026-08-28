/*
 * ★ サイトの内容はこのファイルだけ編集すれば更新できます。
 *   編集して GitHub に push すると自動で反映されます（更新手順は README.md 参照）。
 *
 *   ※ URL に「要確認」と書いた箇所は、正しいURLに差し替えてください。
 */
var DATA = {
  profile: {
    name: 'XTAL',
    pronounce: 'pronounced “Crystal”',
    tagline: 'DJ / Producer',
    photo: 'assets/xtal.jpg',
    // 英語バイオ（段落は空行で区切る）
    bio:
      'Active since 1995, XTAL is a DJ and producer best known as one half of Traks Boys with k404 and resident of DK SOUND—a notorious rooftop rave pulsing above Kawasaki’s industrial skyline. He has also been active in several projects, including the band (((Ssssurrounddd))) with Jun Kamoda, a duo with Your Song Is Good guitarist Masatomo Yoshizawa, and a collaboration unit with dance-music producer Keita Sano, consistently releasing new material across these collaborations.\n\n' +
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
    { label: 'Instagram',   url: 'https://www.instagram.com/_xtal_jp_' },
    { label: 'X',           url: 'https://x.com/XTAL_JP' },
    { label: 'TikTok',      url: 'https://www.tiktok.com/@xtal641' },
    { label: 'YouTube',     url: 'https://www.youtube.com/@XTAL_JP' },
    { label: 'SoundCloud',  url: 'https://soundcloud.com/crystal-a' },
    { label: 'Bandcamp',    url: 'https://xtal-jp.bandcamp.com/' },
    { label: 'Spotify',     url: 'https://open.spotify.com/artist/2t07wCTjaVSrObNSvgMyLi' },
    { label: 'Apple Music', url: 'https://music.apple.com/jp/artist/xtal/1510861367' }
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
