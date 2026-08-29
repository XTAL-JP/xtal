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
    // 暖色（約70%）— 明度の上限を抑えて白飛びを防ぐ
    if (r < 0.13)  return { h: rand(0, 10),    s: rand(85, 98),  l: rand(46, 55) };   // 赤
    if (r < 0.28)  return { h: rand(10, 22),   s: rand(88, 100), l: rand(48, 57) };   // コーラル
    if (r < 0.43)  return { h: rand(22, 34),   s: rand(90, 100), l: rand(46, 55) };   // オレンジ
    if (r < 0.54)  return { h: rand(34, 44),   s: rand(85, 98),  l: rand(48, 56) };   // アンバー
    if (r < 0.62)  return { h: rand(40, 50),   s: rand(80, 92),  l: rand(50, 58) };   // ゴールド
    if (r < 0.68)  return { h: rand(28, 44),   s: rand(65, 88),  l: rand(54, 62) };   // ピーチ/クリーム
    if (r < 0.72)  return { h: rand(335, 352), s: rand(70, 88),  l: rand(52, 60) };   // ローズ
    // アクセント（約30%）— 色数を増やす
    if (r < 0.79)  return { h: rand(305, 330), s: rand(60, 82),  l: rand(52, 60) };   // マゼンタ
    if (r < 0.84)  return { h: rand(275, 300), s: rand(55, 78),  l: rand(52, 60) };   // パープル
    if (r < 0.885) return { h: rand(250, 275), s: rand(52, 74),  l: rand(52, 60) };   // インディゴ/バイオレット
    if (r < 0.925) return { h: rand(215, 245), s: rand(55, 78),  l: rand(50, 60) };   // ブルー
    if (r < 0.96)  return { h: rand(185, 210), s: rand(58, 80),  l: rand(48, 58) };   // シアン/アズール
    if (r < 0.985) return { h: rand(165, 185), s: rand(55, 76),  l: rand(46, 56) };   // ティール
    return         { h: rand(140, 165), s: rand(52, 74),  l: rand(46, 56) };          // グリーン
  }

  /* このロードで1回だけランダムな配色構成を決める（resize では変えない） */
  function buildComposition() {
    var blobs = [], i, c;
    // 大きめの発光ブロブ（多め・伸長した筋）
    var n = Math.floor(rand(6, 9));
    for (i = 0; i < n; i++) {
      c = pickColor();
      blobs.push({
        x: rand(-0.15, 1.15), y: rand(-0.15, 1.15),
        r: rand(0.30, 0.62), rot: rand(0, Math.PI), stretch: rand(1.0, 2.8),
        h: c.h, s: c.s, l: c.l, a: rand(0.26, 0.46)
      });
    }
    // 中くらいのディテール層（数多く）
    var m = Math.floor(rand(7, 11));
    for (i = 0; i < m; i++) {
      c = pickColor();
      blobs.push({
        x: rand(0, 1), y: rand(0, 1),
        r: rand(0.10, 0.26), rot: rand(0, Math.PI), stretch: rand(1.0, 2.4),
        h: c.h, s: c.s, l: Math.min(c.l + 2, 64), a: rand(0.20, 0.34)
      });
    }
    // 極小のフィラメント層（複雑さの粒立ちを追加）
    var k = Math.floor(rand(8, 14));
    for (i = 0; i < k; i++) {
      c = pickColor();
      blobs.push({
        x: rand(-0.05, 1.05), y: rand(-0.05, 1.05),
        r: rand(0.05, 0.14), rot: rand(0, Math.PI), stretch: rand(1.4, 3.4),
        h: c.h, s: c.s, l: Math.min(c.l + 3, 66), a: rand(0.16, 0.28)
      });
    }
    // 細長いストローク層（画面を横切る筋で構造的な複雑さを追加）
    var st = Math.floor(rand(3, 6));
    for (i = 0; i < st; i++) {
      c = pickColor();
      blobs.push({
        x: rand(0, 1), y: rand(0, 1),
        r: rand(0.06, 0.12), rot: rand(0, Math.PI), stretch: rand(3.5, 7.0),
        h: c.h, s: c.s, l: c.l, a: rand(0.14, 0.24)
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
    // 最低限の暖色アンビエント（暗すぎを防ぐフロア）
    var amb = {
      x: rand(0.30, 0.70), y: rand(0.32, 0.62),
      r: rand(0.62, 0.95), hue: rand(15, 42),
      l: rand(30, 38), a: rand(0.5, 0.66)
    };
    return { blobs: blobs, darks: darks, amb: amb, baseHue: rand(12, 28) };
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

  /* 生成結果を一度オフスクリーンに焼き、以降はゆっくり動かす（軽量） */
  var scene = null, sceneW = 0, sceneH = 0, dpr = 1;
  var grainPattern = null;
  var OVER = 1.34; // ビューポートより大きく焼き、ドリフト/ズームで端が出ないように

  function buildScene() {
    var vw = window.innerWidth, vh = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(vw * dpr);
    canvas.height = Math.floor(vh * dpr);
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';

    sceneW = Math.round(canvas.width * OVER);
    sceneH = Math.round(canvas.height * OVER);
    scene = document.createElement('canvas');
    scene.width = sceneW; scene.height = sceneH;
    var sc = scene.getContext('2d');

    // 低解像度バッファに構成を描く
    var scale = 0.34;
    var bw = Math.max(120, Math.floor(sceneW * scale));
    var bh = Math.max(120, Math.floor(sceneH * scale));
    var buf = document.createElement('canvas');
    buf.width = bw; buf.height = bh;
    var b = buf.getContext('2d');
    var minSide = Math.min(bw, bh);

    b.fillStyle = 'hsl(' + comp.baseHue + ',58%,8%)';
    b.fillRect(0, 0, bw, bh);

    // 暗すぎ防止：中央付近の柔らかい暖色アンビエント（フロア）
    b.globalCompositeOperation = 'lighter';
    (function () {
      var a = comp.amb;
      var cx = a.x * bw, cy = a.y * bh, rr = a.r * Math.max(bw, bh);
      var g = b.createRadialGradient(cx, cy, 0, cx, cy, rr);
      var base = 'hsla(' + a.hue + ',80%,' + a.l + '%,';
      g.addColorStop(0, base + a.a + ')');
      g.addColorStop(0.6, base + (a.a * 0.4) + ')');
      g.addColorStop(1, base + '0)');
      b.fillStyle = g;
      b.fillRect(0, 0, bw, bh);
    })();

    comp.blobs.forEach(function (o) {
      var base = 'hsla(' + o.h + ',' + o.s + '%,' + o.l + '%,';
      paintBlob(b, o, bw, bh, minSide, base + o.a + ')', base + (o.a * 0.4) + ')');
    });
    b.globalCompositeOperation = 'source-over';
    comp.darks.forEach(function (o) {
      var base = 'hsla(' + o.h + ',50%,' + o.l + '%,';
      paintBlob(b, o, bw, bh, minSide, base + o.a + ')', base + (o.a * 0.5) + ')');
    });

    // シーンへ拡大転写（弱めのブラーで輪郭を残しつつ滑らかに）
    sc.imageSmoothingEnabled = true;
    sc.imageSmoothingQuality = 'high';
    sc.filter = 'blur(' + (2.5 * dpr) + 'px)';
    sc.drawImage(buf, -12, -12, sceneW + 24, sceneH + 24);
    sc.filter = 'none';

    if (!grainPattern) grainPattern = ctx.createPattern(grain, 'repeat');
  }

  function drawFrame(t) {
    var w = canvas.width, h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);

    // 揺らぎ（ズーム/ドリフト/微回転）— 速めに
    var s   = 1.05 + 0.045 * Math.sin(t / 10000);
    var px  = 0.075 * w * Math.sin(t / 13000);
    var py  = 0.065 * h * Math.sin(t / 11000);
    var rot = 0.016 * Math.sin(t / 16000);

    ctx.save();
    ctx.translate(w / 2 + px, h / 2 + py);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(scene, -sceneW / 2, -sceneH / 2, sceneW, sceneH);
    ctx.restore();

    // 周辺減光（画面固定）
    var vg = ctx.createRadialGradient(w * 0.5, h * 0.42, Math.min(w, h) * 0.22,
                                      w * 0.5, h * 0.52, Math.max(w, h) * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(8,4,2,0.62)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // 全体を少し落とす薄い暗幕
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, w, h);

    // フィルムグレイン（画面固定）
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = grainPattern;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  var raf = null, startTs = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loop(ts) {
    if (startTs == null) startTs = ts;
    drawFrame(ts - startTs);
    raf = window.requestAnimationFrame(loop);
  }

  function start() {
    buildScene();
    if (raf) { window.cancelAnimationFrame(raf); raf = null; }
    if (reduce || !window.requestAnimationFrame) {
      drawFrame(0); // 動きを控える設定では静止
    } else {
      startTs = null;
      raf = window.requestAnimationFrame(loop);
    }
  }

  start();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(start, 200); // サイズ変更時はシーンを焼き直し（配色は保持）
  });
})();
