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

  /* ---- プロフィール ---- */
  if (D.profile) {
    if (D.profile.name) el('name').textContent = D.profile.name;
    if (D.profile.tagline) el('tagline').textContent = D.profile.tagline;
    if (D.profile.bio) {
      el('bio').innerHTML = D.profile.bio.split('\n')
        .map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    }
  }

  /* ---- ソーシャル ---- */
  if (D.socials && D.socials.length) {
    el('socials').innerHTML = D.socials.map(function (s) {
      return link(s.url, s.label, 'link');
    }).join('');
  }

  /* ---- 注目リンク（リリース等） ---- */
  if (D.releases && D.releases.length) {
    el('releases').innerHTML = D.releases.map(function (r) {
      return link(r.url, r.label, 'release');
    }).join('');
  } else {
    el('releases').style.display = 'none';
  }

  /* ---- スケジュール ---- */
  function scheduleItem(ev, isPast) {
    var parts = [];
    parts.push('<div class="ev__date">' + fmtDate(ev.date) + '</div>');
    var meta = [];
    if (ev.type) meta.push('<span class="ev__type">' + esc(ev.type.toUpperCase()) + '</span>');
    meta.push('<span class="ev__title">' + esc(ev.title || '') + '</span>');
    parts.push('<div class="ev__head">' + meta.join(' ') + '</div>');

    var place = [ev.venue, ev.city].filter(Boolean).map(esc).join(' · ');
    if (place) parts.push('<div class="ev__place">' + place + '</div>');

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
      html += '<h3 class="sub">Past</h3><ul class="events">' +
        past.map(function (e) { return scheduleItem(e, true); }).join('') + '</ul>';
    }
    el('schedule').innerHTML = html;
  } else {
    el('schedule-section').style.display = 'none';
  }

  /* ---- News ---- */
  if (D.news && D.news.length) {
    var news = D.news.slice().sort(function (a, b) { return a.date > b.date ? -1 : 1; });
    el('news').innerHTML = '<ul class="news-list">' + news.map(function (n) {
      var title = n.url
        ? link(n.url, n.title || '', 'news__title')
        : '<span class="news__title">' + esc(n.title || '') + '</span>';
      return '<li class="news__item">' +
        '<div class="news__date">' + fmtDate(n.date) + '</div>' +
        '<div class="news__body">' + title +
        (n.body ? '<p>' + esc(n.body) + '</p>' : '') + '</div></li>';
    }).join('') + '</ul>';
  } else {
    el('news-section').style.display = 'none';
  }

  /* ---- フッター ---- */
  var year = new Date().getFullYear();
  var footHtml = '';
  if (D.contact && D.contact.url) {
    footHtml += '<a class="link" href="' + esc(D.contact.url) + '">' + esc(D.contact.label || 'Contact') + '</a>';
  }
  footHtml += '<div class="foot__copy">© ' + year + ' XTAL</div>';
  el('foot').innerHTML = footHtml;
})();
