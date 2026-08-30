/*
 * 背景：暖色系の生成的アニメーション（Brian Eno "Bloom" 的に、
 * 要素が咲いては消え、位置・大きさ・色がゆっくり移り変わり、パターンが常に変化する）。
 * - 毎フレーム、低解像度バッファに色面を再生成して拡大（軽量）。
 * - 暖色主体＋寒色アクセント。暗すぎ防止の暖色アンビエントを常時敷く。
 * - prefers-reduced-motion では1枚だけ描いて静止。
 */
(function () {
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* 暖色と寒色を半々で混ぜたパレット。
     暖色：赤〜コーラル〜オレンジ〜アンバー〜ローズ〜マゼンタ
     寒色：ブルー〜シアン〜ティール〜インディゴ〜パープル ＋ 少量のグリーン */
  function pickColor() {
    var r = Math.random();
    // --- 暖色（約48%）---
    if (r < 0.10)  return { h: rand(2, 14),    s: rand(82, 96), l: rand(48, 56) };   // 赤〜コーラル
    if (r < 0.22)  return { h: rand(16, 30),   s: rand(85, 98), l: rand(48, 57) };   // オレンジ
    if (r < 0.32)  return { h: rand(32, 46),   s: rand(82, 95), l: rand(50, 58) };   // アンバー/ゴールド
    if (r < 0.40)  return { h: rand(335, 352), s: rand(68, 88), l: rand(52, 60) };   // ローズ
    if (r < 0.48)  return { h: rand(300, 325), s: rand(58, 80), l: rand(52, 60) };   // マゼンタ
    // --- 寒色（約48%）---
    if (r < 0.62)  return { h: rand(215, 240), s: rand(68, 90), l: rand(50, 60) };   // ブルー
    if (r < 0.74)  return { h: rand(190, 212), s: rand(62, 86), l: rand(50, 60) };   // シアン/スカイ
    if (r < 0.84)  return { h: rand(165, 188), s: rand(55, 80), l: rand(46, 56) };   // ティール
    if (r < 0.94)  return { h: rand(245, 275), s: rand(56, 78), l: rand(52, 62) };   // インディゴ/パープル
    // --- グリーン アクセント（少量）---
    return         { h: rand(140, 162), s: rand(48, 70), l: rand(46, 56) };
  }

  /* レイヤー定義（bloom=true は咲いて消える／false は常在してゆっくり脈動）
     st（伸長率）は 1.0〜1.25 に抑え、細長い形を避けてほぼ真円にする。
     細長さの主因だった streak レイヤーは廃止。 */
  var LAYERS = {
    large:  { rMin: 0.30, rMax: 0.60, stMin: 1.0, stMax: 1.18, aMin: 0.30, aMax: 0.46, lBoost: 0, lfMin: 0.05, lfMax: 0.12, bloom: false },
    detail: { rMin: 0.10, rMax: 0.26, stMin: 1.0, stMax: 1.20, aMin: 0.22, aMax: 0.38, lBoost: 2, lfMin: 0.12, lfMax: 0.30, bloom: true },
    fil:    { rMin: 0.06, rMax: 0.16, stMin: 1.0, stMax: 1.25, aMin: 0.16, aMax: 0.28, lBoost: 3, lfMin: 0.14, lfMax: 0.34, bloom: true }
  };

  function makeCell(layer) {
    var c = pickColor();
    return {
      layer: layer, bloom: layer.bloom, active: true,
      bx: rand(-0.1, 1.1), by: rand(-0.12, 1.12),
      ax: rand(0.05, 0.16), ay: rand(0.05, 0.14),
      fx: rand(0.08, 0.20), fy: rand(0.08, 0.20), px: rand(0, 6.28), py: rand(0, 6.28),
      r: rand(layer.rMin, layer.rMax),
      pulse: rand(0.12, 0.34), pf: rand(0.10, 0.24), pp: rand(0, 6.28),
      rot: rand(0, Math.PI), rs: rand(-0.015, 0.015), st: rand(layer.stMin, layer.stMax),
      h: c.h, s: c.s, l: Math.min(c.l + layer.lBoost, 66),
      aPeak: rand(layer.aMin, layer.aMax),
      lf: rand(layer.lfMin, layer.lfMax),
      // bloom は必ず alpha=0 付近から立ち上がるよう、初期位相を負側にずらして時間差で咲かせる
      lp: layer.bloom ? -rand(0.1, 3.0) : rand(0, 6.28)
    };
  }
  function respawn(o, t) {
    var c = pickColor(), L = o.layer;
    o.bx = rand(-0.1, 1.1); o.by = rand(-0.12, 1.12);
    o.fx = rand(0.08, 0.20); o.fy = rand(0.08, 0.20);
    o.px = rand(0, 6.28); o.py = rand(0, 6.28); o.pp = rand(0, 6.28);
    o.rot = rand(0, Math.PI); o.rs = rand(-0.015, 0.015); o.st = rand(L.stMin, L.stMax);
    o.h = c.h; o.s = c.s; o.l = Math.min(c.l + L.lBoost, 66);
    o.aPeak = rand(L.aMin, L.aMax); o.r = rand(L.rMin, L.rMax); o.lf = rand(L.lfMin, L.lfMax);
    // ライフ位相を今の時刻に同期し、必ず alpha=0 からフェードインで咲く
    o.lp = -(t * o.lf);
  }

  var cells = [], darks = [], amb, baseHue;
  function build() {
    cells = [];
    var i, n;
    n = Math.floor(rand(5, 7));  for (i = 0; i < n; i++) cells.push(makeCell(LAYERS.large));
    n = Math.floor(rand(8, 11)); for (i = 0; i < n; i++) cells.push(makeCell(LAYERS.detail));
    n = Math.floor(rand(9, 13)); for (i = 0; i < n; i++) cells.push(makeCell(LAYERS.fil));
    darks = [];
    n = Math.floor(rand(3, 5));
    for (i = 0; i < n; i++) darks.push({
      bx: rand(-0.05, 1.05), by: rand(-0.05, 1.15),
      ax: rand(0.03, 0.10), ay: rand(0.03, 0.10), fx: rand(0.04, 0.10), fy: rand(0.04, 0.10),
      px: rand(0, 6.28), py: rand(0, 6.28),
      r: rand(0.30, 0.78), st: rand(1.0, 1.25), rot: rand(0, Math.PI),
      h: rand(205, 235), l: rand(3, 8), a: rand(0.65, 0.9)
    });
    amb = {
      bx: rand(0.3, 0.7), by: rand(0.3, 0.6), ax: rand(0.05, 0.14), ay: rand(0.04, 0.12),
      fx: rand(0.05, 0.12), fy: rand(0.05, 0.12), px: rand(0, 6.28), py: rand(0, 6.28),
      // アンビエントはリロードごとに暖色/寒色どちらかを引く
      r: rand(0.68, 0.98), hue: (Math.random() < 0.5 ? rand(18, 40) : rand(200, 232)),
      l: rand(34, 42), a: rand(0.6, 0.78),
      pulse: rand(0.1, 0.25), pf: rand(0.06, 0.14), pp: rand(0, 6.28)
    };
    // ベース暗色もリロードごとに暖/寒どちらか（暖と寒の両方のブロブが映えるよう低彩度・暗め）
    baseHue = Math.random() < 0.5 ? rand(15, 35) : rand(208, 235);
  }
  build();

  /* グレイン */
  var grain = document.createElement('canvas');
  grain.width = grain.height = 160;
  (function () {
    var g = grain.getContext('2d');
    var img = g.createImageData(grain.width, grain.height), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = 128 + (Math.random() * 255 - 128);
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  })();
  var grainPattern = null;

  /* 伸長・回転させた楕円グラデを描く */
  function paintBlob(b, cx, cy, rr, rot, st, inner, mid, bw, bh) {
    b.save(); b.translate(cx, cy); b.rotate(rot); b.scale(st, 1);
    var g = b.createRadialGradient(0, 0, 0, 0, 0, rr);
    g.addColorStop(0, inner);
    g.addColorStop(0.55, mid);
    g.addColorStop(1, mid.replace(/[\d.]+\)$/, '0)'));
    b.fillStyle = g; b.fillRect(-bw * 2, -bh * 2, bw * 4, bh * 4); b.restore();
  }

  var dpr = 1, bufC = null, bufX = null, bw = 0, bh = 0;
  function resize() {
    var vw = window.innerWidth, vh = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(vw * dpr);
    canvas.height = Math.floor(vh * dpr);
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
    var scale = 0.38;
    bw = Math.max(160, Math.floor(canvas.width * scale));
    bh = Math.max(160, Math.floor(canvas.height * scale));
    bufC = document.createElement('canvas'); bufC.width = bw; bufC.height = bh;
    bufX = bufC.getContext('2d');
    if (!grainPattern) grainPattern = ctx.createPattern(grain, 'repeat');
  }

  function render(t) {
    var b = bufX, minSide = Math.min(bw, bh), maxSide = Math.max(bw, bh), i;

    // ベース暗色
    b.globalCompositeOperation = 'source-over';
    b.fillStyle = 'hsl(' + baseHue + ',55%,11%)';
    b.fillRect(0, 0, bw, bh);

    // 発光は加算合成
    b.globalCompositeOperation = 'lighter';

    // 暗すぎ防止の暖色アンビエント（ゆっくり移動・脈動）
    var ax = (amb.bx + amb.ax * Math.sin(t * amb.fx + amb.px)) * bw;
    var ay = (amb.by + amb.ay * Math.sin(t * amb.fy + amb.py)) * bh;
    var ar = amb.r * maxSide * (1 + amb.pulse * 0.3 * Math.sin(t * amb.pf + amb.pp));
    var aa = amb.a * (0.85 + 0.15 * Math.sin(t * amb.pf + amb.pp));
    (function () {
      var base = 'hsla(' + amb.hue + ',80%,' + amb.l + '%,';
      var g = b.createRadialGradient(ax, ay, 0, ax, ay, ar);
      g.addColorStop(0, base + aa + ')');
      g.addColorStop(0.6, base + (aa * 0.4) + ')');
      g.addColorStop(1, base + '0)');
      b.fillStyle = g; b.fillRect(0, 0, bw, bh);
    })();

    // セル（咲いては消え、位置・大きさ・色が移り変わる）
    for (i = 0; i < cells.length; i++) {
      var o = cells[i], env;
      if (o.bloom) {
        var sv = Math.sin(t * o.lf + o.lp);
        if (sv <= 0) { if (o.active) { o.active = false; respawn(o, t); } continue; }
        o.active = true; env = sv;                 // 0..1 で咲く（sin の立ち上がりで徐々に）
      } else {
        env = 0.55 + 0.45 * Math.sin(t * o.lf + o.lp); // 常在＋脈動
      }
      var alpha = o.aPeak * env;
      if (alpha < 0.012) continue;
      var x = (o.bx + o.ax * Math.sin(t * o.fx + o.px)) * bw;
      var y = (o.by + o.ay * Math.sin(t * o.fy + o.py)) * bh;
      var rr = o.r * minSide * (1 + o.pulse * Math.sin(t * o.pf + o.pp));
      if (rr < 1) continue;
      var rot = o.rot + o.rs * t;
      var base = 'hsla(' + o.h + ',' + o.s + '%,' + o.l + '%,';
      paintBlob(b, x, y, rr, rot, o.st, base + alpha + ')', base + (alpha * 0.4) + ')', bw, bh);
    }

    // 暗部（谷）
    b.globalCompositeOperation = 'source-over';
    for (i = 0; i < darks.length; i++) {
      var d = darks[i];
      var dx = (d.bx + d.ax * Math.sin(t * d.fx + d.px)) * bw;
      var dy = (d.by + d.ay * Math.sin(t * d.fy + d.py)) * bh;
      var dr = d.r * minSide;
      var dbase = 'hsla(' + d.h + ',50%,' + d.l + '%,';
      paintBlob(b, dx, dy, dr, d.rot, d.st, dbase + d.a + ')', dbase + (d.a * 0.5) + ')', bw, bh);
    }

    // メインへ拡大（スムージングのみ＝ぼやけ控えめ）
    var w = canvas.width, h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bufC, 0, 0, w, h);

    // 周辺減光
    var vg = ctx.createRadialGradient(w * 0.5, h * 0.44, Math.min(w, h) * 0.26,
                                      w * 0.5, h * 0.5, Math.max(w, h) * 0.82);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(6,4,9,0.5)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // ごく薄い暗幕
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, w, h);

    // フィルムグレイン
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = grainPattern;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  resize();
  var raf = null, t0 = null;
  // アニメの体感速度。周期が数十秒スケールで静止に見えていたため倍率を掛けて速める
  var SPEED = 2;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loop(ts) {
    if (t0 == null) t0 = ts;
    render((ts - t0) / 1000 * SPEED);   // 初回フレームを 0 とする相対時間（速度倍率込み）
    raf = window.requestAnimationFrame(loop);
  }
  if (reduce || !window.requestAnimationFrame) { render(0.5); } // 静止時は少し咲かせた状態で
  else { raf = window.requestAnimationFrame(loop); }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); if (reduce) render(0); }, 200);
  });
})();
