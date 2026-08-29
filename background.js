/*
 * 背景：マーク・ロスコ風の暖色カラーフィールドをランダム生成する。
 * - 縦に積んだ大きな色面（2〜3ブロック）。
 * - 各色面は「横ストロークの重ね（筆致）」＋「端の滲み（フェザー）」＋
 *   「エッジの手描き的な揺らぎ（ランダムウォーク）」＋「内側の発光」で構成。
 * - 仕上げにキャンバス質感（グレイン）を薄く重ねる。
 * - アクセス（リロード）ごとに配色・分割・揺らぎが変わる。生成は静止画。resize時のみ再描画。
 */
(function () {
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  function rand(min, max) { return min + Math.random() * (max - min); }
  function ss(e0, e1, x) { var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }

  /* 暖色（赤〜オレンジ〜アンバー、時々ローズ）。ロスコ的にやや彩度を抑える */
  function warm() {
    var r = Math.random();
    if (r < 0.30) return { h: rand(2, 16),   s: rand(60, 82), l: rand(40, 52) };   // 赤〜スカーレット
    if (r < 0.58) return { h: rand(16, 32),  s: rand(65, 85), l: rand(44, 56) };   // オレンジ
    if (r < 0.80) return { h: rand(32, 46),  s: rand(62, 82), l: rand(48, 60) };   // アンバー/ゴールド
    if (r < 0.92) return { h: rand(350, 366),s: rand(55, 75), l: rand(34, 46) };   // マルーン/深紅
    return { h: rand(330, 348), s: rand(50, 70), l: rand(48, 58) };                // ローズ
  }

  /* このロードで1回だけ構成を決める */
  function build() {
    var n = Math.random() < 0.5 ? 2 : 3;             // 色面の数
    var top = rand(0.05, 0.11), bottom = rand(0.06, 0.12);
    var gap = rand(0.025, 0.055);
    var avail = 1 - top - bottom - gap * (n - 1);
    // 各ブロックの高さ配分（ランダムだが偏りすぎない）
    var ws = [], sum = 0, i;
    for (i = 0; i < n; i++) { ws[i] = rand(0.8, 1.3); sum += ws[i]; }
    var blocks = [], y = top;
    for (i = 0; i < n; i++) {
      var bh = avail * ws[i] / sum;
      var c = warm();
      blocks.push({
        y0: y, y1: y + bh,
        lm: rand(0.05, 0.15), rm: rand(0.05, 0.15),   // 左右マージン（非対称）
        lean: rand(-0.03, 0.03),                       // わずかな傾き
        jitter: rand(0.012, 0.028),                    // エッジ揺らぎ量
        feather: rand(0.10, 0.18),                     // 上下の滲み
        h: c.h, s: c.s, l: c.l, a: rand(0.82, 0.96)
      });
      y += bh + gap;
    }
    return { blocks: blocks, baseHue: rand(12, 26) };
  }

  var comp = build();

  /* グレイン（キャンバス質感）タイル */
  var grain = document.createElement('canvas');
  grain.width = grain.height = 180;
  (function () {
    var g = grain.getContext('2d');
    var img = g.createImageData(grain.width, grain.height), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = 128 + (Math.random() * 255 - 128);
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  })();

  /* 1つの色面を横ストロークの重ねで描く（筆致＋滲み＋手描きの揺らぎ） */
  function paintBlock(b, o, bw, bh) {
    var y0 = o.y0 * bh, y1 = o.y1 * bh, bandH = y1 - y0;
    var leftBase = o.lm * bw, rightBase = (1 - o.rm) * bw;
    var thick = Math.max(2, bh * 0.006);
    var rows = Math.ceil(bandH / thick);
    var jit = o.jitter * bw;
    var lx = leftBase, rx = rightBase;

    for (var i = 0; i <= rows; i++) {
      var vt = i / rows;
      var ty = y0 + vt * bandH;
      // 上下端のフェザー（滲み）
      var env = ss(0, o.feather, vt) * ss(0, o.feather, 1 - vt);
      if (env <= 0.001) continue;
      // エッジのランダムウォーク＋わずかな傾き
      lx += rand(-jit, jit) * 0.5; rx += rand(-jit, jit) * 0.5;
      lx = Math.max(leftBase - jit * 2, Math.min(leftBase + jit * 2, lx));
      rx = Math.max(rightBase - jit * 2, Math.min(rightBase + jit * 2, rx));
      var lean = o.lean * bw * (vt - 0.5);
      var x0 = lx + lean, x1 = rx + lean, wdt = x1 - x0;
      if (wdt < 4) continue;
      // 筆致のムラ
      var a = o.a * env * rand(0.72, 1.0);
      var grd = b.createLinearGradient(x0, 0, x1, 0);
      var col = 'hsla(' + o.h + ',' + o.s + '%,' + o.l + '%,';
      grd.addColorStop(0, col + '0)');
      grd.addColorStop(rand(0.06, 0.14), col + a + ')');
      grd.addColorStop(rand(0.86, 0.94), col + a + ')');
      grd.addColorStop(1, col + '0)');
      b.fillStyle = grd;
      b.fillRect(x0, ty, wdt, thick + 1);
    }

    // 内側の発光（ロスコ的な光）
    var cx = (leftBase + rightBase) / 2, cy = (y0 + y1) / 2;
    var rr = Math.min((rightBase - leftBase) * 0.55, bandH * 0.7);
    b.save();
    b.globalCompositeOperation = 'lighter';
    var glow = b.createRadialGradient(cx, cy, 0, cx, cy, rr);
    var gcol = 'hsla(' + o.h + ',' + Math.min(o.s + 8, 95) + '%,' + Math.min(o.l + 16, 78) + '%,';
    glow.addColorStop(0, gcol + '0.5)');
    glow.addColorStop(1, gcol + '0)');
    b.fillStyle = glow;
    b.fillRect(leftBase, y0, rightBase - leftBase, bandH);
    b.restore();
  }

  function render() {
    var w = window.innerWidth, h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    /* 中解像度バッファに描く（筆致を残すため少し高め） */
    var scale = 0.34;
    var bw = Math.max(120, Math.floor(w * scale));
    var bh = Math.max(120, Math.floor(h * scale));
    var buf = document.createElement('canvas');
    buf.width = bw; buf.height = bh;
    var b = buf.getContext('2d');

    // 地の色（暖色の縦グラデ）＝色面の周囲に覗くグラウンド
    var bg = b.createLinearGradient(0, 0, 0, bh);
    bg.addColorStop(0, 'hsl(' + comp.baseHue + ',55%,6%)');
    bg.addColorStop(0.5, 'hsl(' + (comp.baseHue + 6) + ',48%,9%)');
    bg.addColorStop(1, 'hsl(' + comp.baseHue + ',52%,5%)');
    b.fillStyle = bg;
    b.fillRect(0, 0, bw, bh);

    // 色面
    comp.blocks.forEach(function (o) { paintBlock(b, o, bw, bh); });

    /* メインへ拡大転写（軽いブラーで滲ませつつ筆致を残す） */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.filter = 'blur(4px)';
    ctx.drawImage(buf, -10, -10, w + 20, h + 20);
    ctx.filter = 'none';

    /* 周辺減光（ロスコ的な暗いハロー） */
    var vg = ctx.createRadialGradient(w * 0.5, h * 0.48, Math.min(w, h) * 0.28,
                                      w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(6,3,2,0.5)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    /* キャンバス質感（グレイン） */
    ctx.globalAlpha = 0.06;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = ctx.createPattern(grain, 'repeat');
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  render();

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(render, 150);
  });
})();
