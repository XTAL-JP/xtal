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
    if (P.name) el('name').textContent = P.name;
    if (P.tagline) el('tagline').textContent = P.tagline;

    var html = '';
    if (P.photo) {
      html += '<img class="bio__photo" src="' + esc(P.photo) + '" alt="' + esc(P.name || 'XTAL') +
        '" width="1000" height="1250" loading="lazy" />';
    }
    var hasJa = !!P.bioJa;
    if (hasJa) {
      html += '<div class="bio__toggle">' +
        '<button type="button" class="bio__lang is-active" data-lang="en">EN</button>' +
        '<button type="button" class="bio__lang" data-lang="ja">日本語</button></div>';
    }
    if (P.bio) html += '<div class="bio__text" id="bio-en" lang="en">' + paras(P.bio) + '</div>';
    if (hasJa) html += '<div class="bio__text" id="bio-ja" lang="ja" hidden>' + paras(P.bioJa) + '</div>';
    el('bio').innerHTML = html;

    if (hasJa) {
      var btns = el('bio').querySelectorAll('.bio__lang');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          var en = btn.getAttribute('data-lang') === 'en';
          Array.prototype.forEach.call(btns, function (b) {
            b.classList.toggle('is-active', b === btn);
          });
          el('bio-en').hidden = !en;
          el('bio-ja').hidden = en;
        });
      });
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
      // 既定：お知らせカード（post）
      var out = '<article class="post">';
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
    el('contact').innerHTML =
      (c.note ? '<p class="contact__note">' + esc(c.note) + '</p>' : '') +
      '<a class="contact-cta" href="' + esc(c.url) + '">' + esc(c.label || 'Contact') + '</a>';
  } else {
    el('contact-section').style.display = 'none';
  }

  /* ---- フッター（コピーライトのみ） ---- */
  var year = new Date().getFullYear();
  el('foot').innerHTML = '<div class="foot__copy">© ' + year + ' XTAL</div>';
})();
