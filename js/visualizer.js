(function () {
  var DW = window.DW, R = DW.react, A = DW.audio;
  var V = (DW.vis = {});
  var S = (V.state = { pulse: 0, snap: 0, level: 0, bass: 0, mid: 0, high: 0, beats: 0, interval: 500 });

  var els = {}, meter = [], data = null, an = null, rng = null;
  var avg = 0, prev = 0, hAvg = 0, hPrev = 0, lastBeat = 0, lastSnap = 0;
  var peak = 0, snapPk = 0, dir = 1, vx = 0, vy = 0;
  var last = 0, frame = 0, wasOn = false;

  V.bind = function (name, el) {
    if (els[name] && els[name] !== el) els[name].style.transform = '';
    els[name] = el;
  };
  V.meter = function (list) { meter = list; };

  function setup() {
    an = A.analyser;
    data = new Uint8Array(an.frequencyBinCount);
    var hz = an.context.sampleRate / an.fftSize;
    function r(b) { return [Math.max(1, Math.round(b[0] / hz)), Math.max(2, Math.round(b[1] / hz))]; }
    rng = { b: r(R.bands.bass), m: r(R.bands.mid), h: r(R.bands.high) };
  }

  function band(x) {
    var s = 0, n = 0;
    for (var i = x[0]; i <= x[1] && i < data.length; i++) { s += data[i]; n++; }
    return n ? s / n / 255 : 0;
  }

  function put(name, p, lv) {
    var el = els[name];
    if (!el) return;
    var k = R[name];
    var s = 1 + p * k.scale + lv * k.breathe;
    el.style.transform = 'translate3d(' + (vx * p * k.shift).toFixed(2) + 'px,' + (vy * p * k.shift).toFixed(2) + 'px,0) rotate(' +
      (dir * p * k.rot).toFixed(2) + 'deg) scale(' + s.toFixed(4) + ')';
  }

  function drawMeter() {
    if (!meter.length) return;
    var v = [S.bass, S.mid, S.high];
    for (var i = 0; i < 3; i++) {
      meter[i].style.transform = 'scaleY(' + (0.18 + Math.min(1, v[i] * 1.3) * 0.82).toFixed(2) + ')';
    }
  }

  function tick(t) {
    requestAnimationFrame(tick);
    if (DW.low && (frame++ & 1)) return;
    var dt = Math.min(64, t - last);
    last = t;

    if (A.analyser && A.playing) {
      if (an !== A.analyser) setup();
      an.getByteFrequencyData(data);
      var b = band(rng.b), m = band(rng.m), h = band(rng.h);
      S.bass = b; S.mid = m; S.high = h;

      var sens = R.sensitivity || 1;
      if (b > 0.15 && b > avg * (1 + 0.22 / sens) + 0.02 && b - prev > 0.012 && t - lastBeat > 190) {
        var gap = t - lastBeat;
        lastBeat = t;
        if (gap < 1400) S.interval += (gap - S.interval) * 0.35;
        peak = Math.min(1, 0.55 + (b - avg) * 2.5);
        dir = -dir;
        S.beats++;
        var a = S.beats * 2.4;
        vx = Math.cos(a); vy = Math.sin(a) * 0.7;
      }

      if (h > 0.1 && h > hAvg * 1.4 + 0.03 && h - hPrev > 0.02 && t - lastSnap > 100) {
        lastSnap = t;
        snapPk = Math.min(0.5, 0.25 + (h - hAvg));
      }

      avg += (b - avg) * Math.min(1, dt / 900);
      hAvg += (h - hAvg) * Math.min(1, dt / 700);
      prev = b; hPrev = h;
      S.level += ((b + m + h) / 3 - S.level) * 0.15;
    } else {
      S.bass *= 0.9; S.mid *= 0.9; S.high *= 0.9; S.level *= 0.92;
    }

    var tau = Math.max(110, Math.min(520, S.interval * 0.45));
    peak *= Math.exp(-dt / tau);
    snapPk *= Math.exp(-dt / 130);
    if (peak > S.pulse) S.pulse += (peak - S.pulse) * (1 - Math.exp(-dt / 28));
    else S.pulse = peak;
    S.snap = snapPk;

    var M = R.master;
    var p = S.pulse * M, sn = S.snap * M, lv = S.level * M;
    var on = p + sn + lv > 0.002;
    if (!on && !wasOn) { drawMeter(); return; }
    wasOn = on;

    put('icon', p, lv);
    put('sub', p * 0.6 + sn, lv);
    put('cover', p, lv);
    put('bg', p, lv);
    if (els.glow) els.glow.style.opacity = (R.glow.base + p * R.glow.pulse + lv * 0.15).toFixed(3);
    drawMeter();
  }

  V.start = function () {
    if (DW.reduce) R.master = 0;
    requestAnimationFrame(tick);
  };
})();
