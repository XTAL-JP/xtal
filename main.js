/*
 * data.js の内容を各セクションに描画する。
 * - schedule は開催日で Upcoming（近い順）/ Past（新しい順）に自動分割。
 * - 内容の編集は data.js 側で行う（このファイルは基本さわらない）。
 */
(function () {
  var D = window.DATA || {};

  // 簡易エスケープ（テキストの安全な挿入用）
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function el(id) { return document.getElementById(id); }

  // 外部リンク（新規タブ）
  function link(url, label, cls) {
    return '<a class="' + (cls || '') + '" href="' + esc(url) + '" target="_blank" rel="noopener">' +
      esc(label) + '</a>';
  }

  // 日付を "2025.06.01 (Sun)" 形式に
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return esc(iso);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var mm = ('0' + (d.getMonth() + 1)).slice(-2);
    var dd = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '.' + mm + '.' + dd + ' (' + days[d.getDay()] + ')';
  }

  // 段落（空行区切り）を <p> に
  function paras(text) {
    return String(text || '').split(/\n\s*\n/)
      .map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');
  }

  /* ---- プロフィール ---- */
  if (D.profile) {
    var P = D.profile;
    // 見出しはロゴ画像（index.html に配置済み）。テキストでは上書きしない。
    if (P.tagline) el('tagline').textContent = P.tagline;

    var html = '';
    if (P.photo) {
      html += '<img class="bio__photo" src="' + esc(P.photo) + '" alt="' + esc(P.name || 'XTAL') +
        '" width="1000" height="1250" loading="lazy" />';
    }
    // 掲載する言語（存在するものだけ・この順で表示）
    var langs = [];
    if (P.bio)   langs.push({ code: 'en', label: 'EN',     text: P.bio });
    if (P.bioJa) langs.push({ code: 'ja', label: '日本語',  text: P.bioJa });
    if (P.bioKo) langs.push({ code: 'ko', label: '한국어',  text: P.bioKo });

    // 2言語以上あるときだけ切替ボタンを出す
    if (langs.length > 1) {
      html += '<div class="bio__toggle">';
      langs.forEach(function (l, i) {
        html += '<button type="button" class="bio__lang' + (i === 0 ? ' is-active' : '') +
          '" data-lang="' + l.code + '">' + l.label + '</button>';
      });
      html += '</div>';
    }
    langs.forEach(function (l, i) {
      html += '<div class="bio__text" id="bio-' + l.code + '" lang="' + l.code + '"' +
        (i === 0 ? '' : ' hidden') + '>' + paras(l.text) + '</div>';
    });
    el('bio').innerHTML = html;

    if (langs.length > 1) {
      var btns = el('bio').querySelectorAll('.bio__lang');
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var switching = false;
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          var code = btn.getAttribute('data-lang');
          var current = el('bio').querySelector('.bio__text:not([hidden])');
          var next = el('bio-' + code);
          if (switching || current === next) return;

          Array.prototype.forEach.call(btns, function (b) {
            b.classList.toggle('is-active', b === btn);
          });

          // モーション控えめ設定：即時切替
          if (reduce || !current) {
            langs.forEach(function (l) { el('bio-' + l.code).hidden = (l.code !== code); });
            return;
          }

          switching = true;
          // 現在の言語をフェードアウト → 差し替え → 次の言語をフェードイン
          current.classList.add('is-leaving');
          onFade(current, function () {
            current.classList.remove('is-leaving');
            current.hidden = true;
            next.hidden = false;
            next.classList.add('is-entering');
            void next.offsetHeight;              // 開始値を確定（強制リフロー）
            next.classList.remove('is-entering'); // フェードイン開始
            onFade(next, function () { switching = false; });
          });
        });
      });

      // opacity トランジション完了で cb（未発火に備えタイムアウトの保険つき）
      function onFade(elm, cb) {
        var done = false;
        function fin() { if (done) return; done = true; elm.removeEventListener('transitionend', te); cb(); }
        function te(ev) { if (ev.target === elm && ev.propertyName === 'opacity') fin(); }
        elm.addEventListener('transitionend', te);
        setTimeout(fin, 320);
      }
    }
  }

  /* ---- ソーシャル ---- */
  if (D.socials && D.socials.length) {
    el('socials').innerHTML = D.socials.map(function (s) {
      return link(s.url, s.label, 'link');
    }).join('');
  }

  /* ---- Featured（今プッシュしたいもの） ---- */
  if (D.featured && D.featured.length) {
    el('featured').innerHTML = D.featured.map(function (f) {
      if (f.type === 'link') {
        return link(f.url, f.label || f.url, 'release');
      }
      // 既定：お知らせカード（post）。f.id があればアンカーリンク用の id を付与
      var out = '<article class="post"' + (f.id ? ' id="' + esc(f.id) + '"' : '') + '>';
      if (f.image) {
        out += '<img class="post__img" src="' + esc(f.image) + '" alt="' + esc(f.title || '') +
          '" loading="lazy" />';
      }
      out += '<div class="post__body">';
      if (f.date) out += '<div class="post__date">' + fmtDate(f.date) + '</div>';
      if (f.title) out += '<h3 class="post__title">' + esc(f.title) + '</h3>';
      if (f.body) {
        out += '<div class="post__text">' + f.body.split(/\n\s*\n/).map(function (p) {
          return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>';
        }).join('') + '</div>';
      }
      if (f.links && f.links.length) {
        out += '<div class="post__links">' + f.links.map(function (l) {
          return link(l.url, l.label, 'post__link');
        }).join('') + '</div>';
      }
      out += '</div></article>';
      return out;
    }).join('');
  } else {
    el('featured').style.display = 'none';
  }

  /* ---- スケジュール ---- */
  function scheduleItem(ev, isPast) {
    var parts = [];
    parts.push('<div class="ev__date">' + fmtDate(ev.date) + '</div>');
    var meta = [];
    if (ev.type) meta.push('<span class="ev__type">' + esc(ev.type.toUpperCase()) + '</span>');
    // イベント名がある時は「イベント名 at 会場」。無い時は会場名を見出しに。
    var head;
    if (ev.title) {
      head = '<span class="ev__title">' + esc(ev.title) + '</span>';
      // サブタイトルはパーティー名の一部として、会場（at ...）より前に置く
      if (ev.subtitle) head += '<span class="ev__subtitle">' + esc(ev.subtitle) + '</span>';
      if (ev.venue) head += '<span class="ev__at"> at ' + esc(ev.venue) + '</span>';
    } else {
      head = '<span class="ev__title">' + esc(ev.venue || '') + '</span>';
      if (ev.subtitle) head += '<span class="ev__subtitle">' + esc(ev.subtitle) + '</span>';
    }
    meta.push(head);
    parts.push('<div class="ev__head">' + meta.join(' ') + '</div>');

    // 会場はイベント名の後に入れたので、下の行は都市のみ
    if (ev.city) parts.push('<div class="ev__place">' + esc(ev.city) + '</div>');
    // 開演時間・料金（任意）
    var infos = [];
    if (ev.time) infos.push('<span class="ev__time">' + esc(ev.time) + '</span>');
    if (ev.price) infos.push('<span class="ev__price">' + esc(ev.price) + '</span>');
    if (infos.length) parts.push('<div class="ev__info">' + infos.join('') + '</div>');
    if (ev.note) parts.push('<div class="ev__note">' + esc(ev.note) + '</div>');

    var links = [];
    if (ev.recording) links.push(link(ev.recording, '▶ Recording', 'ev__link'));
    if (ev.links) ev.links.forEach(function (l) { links.push(link(l.url, l.label, 'ev__link')); });
    if (links.length) parts.push('<div class="ev__links">' + links.join('') + '</div>');

    return '<li class="ev' + (isPast ? ' ev--past' : '') + '">' + parts.join('') + '</li>';
  }

  if (D.schedule && D.schedule.length) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var upcoming = [], past = [];
    D.schedule.forEach(function (ev) {
      var d = new Date(ev.date + 'T00:00:00');
      (isNaN(d) || d >= today ? upcoming : past).push(ev);
    });
    upcoming.sort(function (a, b) { return a.date < b.date ? -1 : 1; }); // 近い順
    past.sort(function (a, b) { return a.date > b.date ? -1 : 1; });      // 新しい順

    var html = '';
    if (upcoming.length) {
      html += '<h3 class="sub">Upcoming</h3><ul class="events">' +
        upcoming.map(function (e) { return scheduleItem(e, false); }).join('') + '</ul>';
    }
    if (past.length) {
      // 過去分は年ごとにまとめ、ロード時は閉じておく（年をクリックで展開）
      var byYear = {};
      past.forEach(function (e) {
        var y = (e.date || '').slice(0, 4) || 'Other';
        (byYear[y] = byYear[y] || []).push(e);
      });
      var years = Object.keys(byYear).sort(function (a, b) { return a < b ? 1 : -1; }); // 新しい年が上
      html += '<h3 class="sub">Past</h3>';
      years.forEach(function (y) {
        html += '<details class="ev-year">' +
          '<summary class="ev-year__label">' + esc(y) +
          '<span class="ev-year__count">' + byYear[y].length + '</span></summary>' +
          '<ul class="events">' +
          byYear[y].map(function (e) { return scheduleItem(e, true); }).join('') +
          '</ul></details>';
      });
    }
    el('schedule').innerHTML = html;
    bindYearAccordions();
  } else {
    el('schedule-section').style.display = 'none';
  }

  /* 過去分アコーディオンの開閉アニメ（高さ＋フェード） */
  function bindYearAccordions() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = el('schedule').querySelectorAll('.ev-year');
    Array.prototype.forEach.call(items, function (d) {
      var summary = d.querySelector('summary');
      var body = d.querySelector('.events');
      if (!summary || !body) return;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (d.classList.contains('is-animating')) return;

        // モーション控えめ設定：即時トグル
        if (reduce) {
          d.open = !d.open;
          d.classList.toggle('is-open', d.open);
          return;
        }

        var opening = !d.open;
        d.classList.add('is-animating');

        if (opening) {
          d.open = true;                 // 中身を表示可能に
          d.classList.add('is-open');    // シェブロンを回転
          var h = body.scrollHeight;
          body.style.overflow = 'hidden';
          body.style.height = '0px';
          body.style.opacity = '0';
          void body.offsetHeight;        // 開始値を確定させる（強制リフロー）
          body.style.transition = 'height 0.30s ease, opacity 0.30s ease';
          body.style.height = h + 'px';
          body.style.opacity = '1';
          onEnd(300, function () {
            body.style.height = body.style.overflow = body.style.opacity = body.style.transition = '';
            d.classList.remove('is-animating');
          });
        } else {
          d.classList.remove('is-open');
          var hc = body.scrollHeight;
          body.style.overflow = 'hidden';
          body.style.height = hc + 'px';
          body.style.opacity = '1';
          void body.offsetHeight;        // 開始値を確定させる（強制リフロー）
          body.style.transition = 'height 0.28s ease, opacity 0.28s ease';
          body.style.height = '0px';
          body.style.opacity = '0';
          onEnd(280, function () {
            d.open = false;              // アニメ後に閉じる
            body.style.height = body.style.overflow = body.style.opacity = body.style.transition = '';
            d.classList.remove('is-animating');
          });
        }

        // transitionend で完了処理。発火しない場合に備え、時間経過でも必ず後始末する
        function onEnd(ms, cb) {
          var done = false;
          function fin() { if (done) return; done = true; body.removeEventListener('transitionend', te); cb(); }
          function te(ev) { if (ev.target === body && ev.propertyName === 'height') fin(); }
          body.addEventListener('transitionend', te);
          setTimeout(fin, ms + 80);
        }
      });
    });
  }

  /* ---- Discography ---- */
  if (D.discography && D.discography.length) {
    el('discography').innerHTML = '<ul class="disco-grid">' + D.discography.map(function (r) {
      var links = (r.links || []).map(function (l) {
        return link(l.url, l.label, 'disco__link');
      }).join('');
      var cover = r.cover
        ? '<img class="disco__cover" src="' + esc(r.cover) + '" alt="' + esc(r.title || '') +
          '" width="400" height="400" loading="lazy" />'
        : '';
      return '<li class="disco__item">' +
        cover +
        '<div class="disco__title">' + esc(r.title || '') + '</div>' +
        '<div class="disco__meta">' +
          (r.year ? '<span class="disco__year">' + esc(r.year) + '</span>' : '') +
          (r.note ? '<span class="disco__note">' + esc(r.note) + '</span>' : '') +
        '</div>' +
        (links ? '<div class="disco__links">' + links + '</div>' : '') +
        '</li>';
    }).join('') + '</ul>';
  } else {
    el('disco-section').style.display = 'none';
  }

  /* ---- Contact（Get in Touch） ---- */
  if (D.contact && D.contact.url) {
    var c = D.contact;
    // 細線の封筒アイコン（currentColor 継承・文字サイズに追従）
    var mailIcon =
      '<svg class="contact-cta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3" y="5" width="18" height="14" rx="2.5"/>' +
      '<path d="M3.5 7 12 13 20.5 7"/></svg>';
    el('contact').innerHTML =
      (c.note ? '<p class="contact__note">' + esc(c.note) + '</p>' : '') +
      '<a class="contact-cta" href="' + esc(c.url) + '">' +
        mailIcon + '<span class="contact-cta__label">' + esc(c.label || 'Contact') + '</span>' +
      '</a>';
  } else {
    el('contact-section').style.display = 'none';
  }

  /* ---- フッター（エンブレム＋コピーライト） ---- */
  var year = new Date().getFullYear();
  el('foot').innerHTML =
    '<img class="foot__logo" src="assets/xtal-emblem.svg" alt="XTAL" width="60" height="60" />' +
    '<div class="foot__copy">© ' + year + ' XTAL</div>';
})();
