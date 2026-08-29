/*
 * 暖色系の有機的なグラデーション背景をランダム生成する。
 * - アクセス（リロード）ごとに配色・暗部・流れが変わる。
 * - 生成は静止画（アニメーションなし＝軽量）。resize 時のみ同じ配色で再描画。
 * - 2スケール構成（大きな発光＋小さなディテール）＋伸長・回転させた楕円グラデ（流れる筋）で
 *   色数と複雑性を確保。低解像度バッファに描いて拡大＋ブラーで滑らかにする。
 * - フィルムグレイン（ノイズ）を薄く重ねて粒状感を付与。
 */
(function () {
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return; // 非対応時は CSS の暖色フォールバックが見える
  var ctx = canvas.getContext('2d');

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* 暖色を中心に、色数を増やしたパレットからピック（アクセントに寒色も少量） */
  function pickColor() {
    var r = Math.random();
    // 暖色（約78%）
    if (r < 0.14)  return { h: rand(0, 10),    s: rand(85, 98),  l: rand(50, 60) };   // 赤
    if (r < 0.30)  return { h: rand(10, 22),   s: rand(88, 100), l: rand(52, 62) };   // コーラル
    if (r < 0.46)  return { h: rand(22, 34),   s: rand(90, 100), l: rand(50, 60) };   // オレンジ
    if (r < 0.58)  return { h: rand(34, 44),   s: rand(85, 98),  l: rand(52, 62) };   // アンバー
    if (r < 0.66)  return { h: rand(40, 50),   s: rand(80, 92),  l: rand(56, 64) };   // ゴールド
    if (r < 0.72)  return { h: rand(28, 44),   s: rand(65, 88),  l: rand(62, 70) };   // ピーチ/クリーム
    if (r < 0.78)  return { h: rand(335, 352), s: rand(70, 88),  l: rand(56, 66) };   // ローズ
    // アクセント（約22%）— 色のバリエーション
    if (r < 0.86)  return { h: rand(300, 330), s: rand(60, 82),  l: rand(56, 66) };   // マゼンタ/パープル
    if (r < 0.91)  return { h: rand(255, 285), s: rand(55, 75),  l: rand(56, 66) };   // バイオレット/インディゴ
    if (r < 0.965) return { h: rand(190, 215), s: rand(60, 82),  l: rand(52, 64) };   // シアン/ブルー
    return         { h: rand(150, 175), s: rand(55, 75),  l: rand(50, 62) };          // ティール/グリーン
  }

  /* このロードで1回だけランダムな配色構成を決める（resize では変えない） */
  function buildComposition() {
    var blobs = [], i, c;
    // 大きめの発光ブロブ（多め・伸長した筋）
    var n = Math.floor(rand(7, 11));
    for (i = 0; i < n; i++) {
      c = pickColor();
      blobs.push({
        x: rand(-0.15, 1.15), y: rand(-0.15, 1.15),
        r: rand(0.30, 0.62), rot: rand(0, Math.PI), stretch: rand(1.0, 2.8),
        h: c.h, s: c.s, l: c.l, a: rand(0.4, 0.7)
      });
    }
    // 中くらいのディテール層（数多く）
    var m = Math.floor(rand(6, 10));
    for (i = 0; i < m; i++) {
      c = pickColor();
      blobs.push({
        x: rand(0, 1), y: rand(0, 1),
        r: rand(0.10, 0.26), rot: rand(0, Math.PI), stretch: rand(1.0, 2.4),
        h: c.h, s: c.s, l: Math.min(c.l + 4, 78), a: rand(0.30, 0.52)
      });
    }
    // 極小のフィラメント層（複雑さの粒立ちを追加）
    var k = Math.floor(rand(6, 11));
    for (i = 0; i < k; i++) {
      c = pickColor();
      blobs.push({
        x: rand(-0.05, 1.05), y: rand(-0.05, 1.05),
        r: rand(0.05, 0.14), rot: rand(0, Math.PI), stretch: rand(1.4, 3.4),
        h: c.h, s: c.s, l: Math.min(c.l + 6, 80), a: rand(0.26, 0.46)
      });
    }
    // 暗部（谷）— 深い黒でコントラストと複雑性を出す
    var darks = [];
    var dn = Math.floor(rand(3, 6));
    for (i = 0; i < dn; i++) {
      darks.push({
        x: rand(-0.05, 1.05), y: rand(-0.05, 1.15),
        r: rand(0.30, 0.78), rot: rand(0, Math.PI), stretch: rand(1.0, 2.2),
        h: rand(10, 30), l: rand(3, 8), a: rand(0.7, 0.95)
      });
    }
    return { blobs: blobs, darks: darks, baseHue: rand(12, 28) };
  }

  var comp = buildComposition();

  /* グレイン用のノイズタイルを一度だけ作る */
  var grain = document.createElement('canvas');
  grain.width = grain.height = 160;
  (function () {
    var g = grain.getContext('2d');
    var img = g.createImageData(grain.width, grain.height);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = 128 + (Math.random() * 255 - 128);
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  })();

  /* 伸長・回転させた楕円グラデを描く（流れる筋の表現） */
  function paintBlob(b, o, bw, bh, minSide, inner, mid) {
    var cx = o.x * bw, cy = o.y * bh, rr = o.r * minSide;
    b.save();
    b.translate(cx, cy);
    b.rotate(o.rot || 0);
    b.scale(o.stretch || 1, 1);            // x方向に伸ばして筋状に
    var grd = b.createRadialGradient(0, 0, 0, 0, 0, rr);
    grd.addColorStop(0, inner);
    grd.addColorStop(0.55, mid);
    grd.addColorStop(1, mid.replace(/[\d.]+\)$/, '0)'));
    b.fillStyle = grd;
    b.fillRect(-bw * 2, -bh * 2, bw * 4, bh * 4);
    b.restore();
  }

  function render() {
    var w = window.innerWidth, h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    /* 低解像度バッファに構成を描く（ディテールを残すため少し高め） */
    var scale = 0.30;
    var bw = Math.max(90, Math.floor(w * scale));
    var bh = Math.max(90, Math.floor(h * scale));
    var buf = document.createElement('canvas');
    buf.width = bw; buf.height = bh;
    var b = buf.getContext('2d');
    var minSide = Math.min(bw, bh);

    // ベースの暗色
    b.fillStyle = 'hsl(' + comp.baseHue + ',60%,5%)';
    b.fillRect(0, 0, bw, bh);

    // 発光（加算合成で暖色を積む）
    b.globalCompositeOperation = 'lighter';
    comp.blobs.forEach(function (o) {
      var base = 'hsla(' + o.h + ',' + o.s + '%,' + o.l + '%,';
      paintBlob(b, o, bw, bh, minSide, base + o.a + ')', base + (o.a * 0.4) + ')');
    });

    // 暗部（谷）を彫る
    b.globalCompositeOperation = 'source-over';
    comp.darks.forEach(function (o) {
      var base = 'hsla(' + o.h + ',50%,' + o.l + '%,';
      paintBlob(b, o, bw, bh, minSide, base + o.a + ')', base + (o.a * 0.5) + ')');
    });

    /* メインへ拡大転写（スムージング＋わずかなブラーでソフトに） */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.filter = 'blur(3.5px)';             // 弱めのブラーで輪郭を残しつつ滑らかに
    ctx.drawImage(buf, -12, -12, w + 24, h + 24);
    ctx.filter = 'none';

    /* 周辺減光（ビネット）で奥行きを出す */
    var vg = ctx.createRadialGradient(w * 0.5, h * 0.42, Math.min(w, h) * 0.22,
                                      w * 0.5, h * 0.52, Math.max(w, h) * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(8,4,2,0.42)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    /* フィルムグレイン（弱め・soft-light でくすませない） */
    ctx.globalAlpha = 0.05;
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
    t = setTimeout(render, 150); // 同じ配色で再描画（リロードでのみ配色が変わる）
  });
})();
