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

  /* 暖色を中心に色数を増やしたパレット（アクセントに寒色も少量） */
  function pickColor() {
    var r = Math.random();
    if (r < 0.13)  return { h: rand(0, 10),    s: rand(85, 98),  l: rand(46, 55) };   // 赤
    if (r < 0.28)  return { h: rand(10, 22),   s: rand(88, 100), l: rand(48, 57) };   // コーラル
    if (r < 0.43)  return { h: rand(22, 34),   s: rand(90, 100), l: rand(46, 55) };   // オレンジ
    if (r < 0.54)  return { h: rand(34, 44),   s: rand(85, 98),  l: rand(48, 56) };   // アンバー
    if (r < 0.62)  return { h: rand(40, 50),   s: rand(80, 92),  l: rand(50, 58) };   // ゴールド
    if (r < 0.68)  return { h: rand(28, 44),   s: rand(65, 88),  l: rand(54, 62) };   // ピーチ
    if (r < 0.72)  return { h: rand(335, 352), s: rand(70, 88),  l: rand(52, 60) };   // ローズ
    if (r < 0.79)  return { h: rand(305, 330), s: rand(60, 82),  l: rand(52, 60) };   // マゼンタ
    if (r < 0.84)  return { h: rand(275, 300), s: rand(55, 78),  l: rand(52, 60) };   // パープル
    if (r < 0.885) return { h: rand(250, 275), s: rand(52, 74),  l: rand(52, 60) };   // インディゴ
    if (r < 0.925) return { h: rand(215, 245), s: rand(55, 78),  l: rand(50, 60) };   // ブルー
    if (r < 0.96)  return { h: rand(185, 210), s: rand(58, 80),  l: rand(48, 58) };   // シアン
    if (r < 0.985) return { h: rand(165, 185), s: rand(55, 76),  l: rand(46, 56) };   // ティール
    return         { h: rand(140, 165), s: rand(52, 74),  l: rand(46, 56) };          // グリーン
  }

  /* レイヤー定義（bloom=true は咲いて消える／false は常在してゆっくり脈動） */
  var LAYERS = {
    large:  { rMin: 0.30, rMax: 0.60, stMin: 1.0, stMax: 2.6, aMin: 0.30, aMax: 0.46, lBoost: 0, lfMin: 0.05, lfMax: 0.12, bloom: false },
    detail: { rMin: 0.10, rMax: 0.26, stMin: 1.0, stMax: 2.4, aMin: 0.22, aMax: 0.38, lBoost: 2, lfMin: 0.12, lfMax: 0.30, bloom: true },
    fil:    { rMin: 0.05, rMax: 0.14, stMin: 1.4, stMax: 3.4, aMin: 0.16, aMax: 0.28, lBoost: 3, lfMin: 0.14, lfMax: 0.34, bloom: true },
    streak: { rMin: 0.06, rMax: 0.12, stMin: 3.5, stMax: 7.0, aMin: 0.14, aMax: 0.24, lBoost: 0, lfMin: 0.10, lfMax: 0.24, bloom: true }
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
    n = Math.floor(rand(3, 5));  for (i = 0; i < n; i++) cells.push(makeCell(LAYERS.streak));
    darks = [];
    n = Math.floor(rand(3, 5));
    for (i = 0; i < n; i++) darks.push({
      bx: rand(-0.05, 1.05), by: rand(-0.05, 1.15),
      ax: rand(0.03, 0.10), ay: rand(0.03, 0.10), fx: rand(0.04, 0.10), fy: rand(0.04, 0.10),
      px: rand(0, 6.28), py: rand(0, 6.28),
      r: rand(0.30, 0.78), st: rand(1.0, 2.2), rot: rand(0, Math.PI),
      h: rand(10, 30), l: rand(3, 8), a: rand(0.65, 0.9)
    });
    amb = {
      bx: rand(0.3, 0.7), by: rand(0.3, 0.6), ax: rand(0.05, 0.14), ay: rand(0.04, 0.12),
      fx: rand(0.05, 0.12), fy: rand(0.05, 0.12), px: rand(0, 6.28), py: rand(0, 6.28),
      r: rand(0.68, 0.98), hue: rand(15, 42), l: rand(34, 42), a: rand(0.6, 0.78),
      pulse: rand(0.1, 0.25), pf: rand(0.06, 0.14), pp: rand(0, 6.28)
    };
    baseHue = rand(15, 30);
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
    vg.addColorStop(1, 'rgba(8,4,2,0.48)');
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
