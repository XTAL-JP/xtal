/*
 * 暖色系の有機的なグラデーション背景をランダム生成する。
 * - アクセス（リロード）ごとに配色・暗部の形が変わる。
 * - 生成は静止画（アニメーションなし＝軽量）。resize 時のみ同じ配色で再描画。
 * - 低解像度バッファに描いて拡大＋ブラーで、滑らかな液状グラデーションにする。
 * - フィルムグレイン（ノイズ）を薄く重ねて粒状感を付与。
 */
(function () {
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return; // 非対応時は CSS の暖色フォールバックが見える
  var ctx = canvas.getContext('2d');

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* このロードで1回だけランダムな配色構成を決める（resize では変えない） */
  function buildComposition() {
    var blobs = [];
    var n = Math.floor(rand(4, 6));
    for (var i = 0; i < n; i++) {
      var kind = Math.random(), hue, sat, light, a;
      if (kind < 0.35) {            // コーラル
        hue = rand(4, 14);  sat = rand(85, 98);  light = rand(52, 62); a = rand(0.7, 0.95);
      } else if (kind < 0.85) {     // オレンジ〜アンバー
        hue = rand(16, 34); sat = rand(90, 100); light = rand(50, 60); a = rand(0.75, 0.95);
      } else {                      // クリーム／ピーチのハイライト（控えめ）
        hue = rand(30, 44); sat = rand(80, 95);  light = rand(64, 74); a = rand(0.6, 0.8);
      }
      blobs.push({
        x: rand(-0.1, 1.1), y: rand(-0.1, 1.1),
        r: rand(0.28, 0.58),        // 半径を絞り、筋として見せる
        color: 'hsla(' + hue + ',' + sat + '%,' + light + '%,',
        alpha: a
      });
    }
    // 暗部（谷）— 強め・多めにして深い黒を効かせる
    var darks = [];
    var dn = Math.floor(rand(4, 7));
    for (var j = 0; j < dn; j++) {
      darks.push({
        x: rand(-0.05, 1.05), y: rand(-0.05, 1.15),
        r: rand(0.35, 0.85),
        hue: rand(12, 28), light: rand(3, 8),
        alpha: rand(0.85, 1)
      });
    }
    return { blobs: blobs, darks: darks, baseHue: rand(14, 26) };
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

  function render() {
    var w = window.innerWidth, h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    /* 低解像度バッファに構成を描く */
    var scale = 0.18;
    var bw = Math.max(80, Math.floor(w * scale));
    var bh = Math.max(80, Math.floor(h * scale));
    var buf = document.createElement('canvas');
    buf.width = bw; buf.height = bh;
    var b = buf.getContext('2d');
    var minSide = Math.min(bw, bh);

    // ベースの暗色
    b.fillStyle = 'hsl(' + comp.baseHue + ',60%,5%)';
    b.fillRect(0, 0, bw, bh);

    // 発光ブロブ（加算合成で暖色を積む）
    b.globalCompositeOperation = 'lighter';
    comp.blobs.forEach(function (bl) {
      var cx = bl.x * bw, cy = bl.y * bh, rr = bl.r * minSide;
      var grd = b.createRadialGradient(cx, cy, 0, cx, cy, rr);
      grd.addColorStop(0, bl.color + bl.alpha + ')');
      grd.addColorStop(0.6, bl.color + (bl.alpha * 0.35) + ')');
      grd.addColorStop(1, bl.color + '0)');
      b.fillStyle = grd;
      b.fillRect(0, 0, bw, bh);
    });

    // 暗部（谷）を彫る
    b.globalCompositeOperation = 'source-over';
    comp.darks.forEach(function (dk) {
      var cx = dk.x * bw, cy = dk.y * bh, rr = dk.r * minSide;
      var grd = b.createRadialGradient(cx, cy, 0, cx, cy, rr);
      grd.addColorStop(0, 'hsla(' + dk.hue + ',50%,' + dk.light + '%,' + dk.alpha + ')');
      grd.addColorStop(1, 'hsla(' + dk.hue + ',50%,' + dk.light + '%,0)');
      b.fillStyle = grd;
      b.fillRect(0, 0, bw, bh);
    });

    /* メインへ拡大転写（スムージング＋わずかなブラーでソフトに） */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.filter = 'blur(8px)';               // 対応環境のみ効く（未対応でも拡大で十分滑らか）
    ctx.drawImage(buf, -12, -12, w + 24, h + 24);
    ctx.filter = 'none';

    /* 周辺減光（ビネット）で奥行きを出す */
    var vg = ctx.createRadialGradient(w * 0.5, h * 0.42, Math.min(w, h) * 0.22,
                                      w * 0.5, h * 0.52, Math.max(w, h) * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(8,4,2,0.55)');
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
