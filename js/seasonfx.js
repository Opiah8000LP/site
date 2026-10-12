// extra decorations per season (DOM based). seasons.js decides WHICH season it is, this file builds the things.
(function () {
  var DW = window.DW, F = (DW.seasonfx = {});
  var NS = 'http://www.w3.org/2000/svg', root;

  function mk(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }
  function svg(w, h, parent, cls) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    s.setAttribute('shape-rendering', 'crispEdges');
    if (cls) s.setAttribute('class', cls);
    if (parent) parent.appendChild(s);
    return s;
  }
  function rect(parent, x, y, w, h, fill, cls) {
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h);
    if (fill) r.setAttribute('fill', fill);
    if (cls) r.setAttribute('class', cls);
    parent.appendChild(r);
    return r;
  }
  // pixel art from rows of characters. pal maps a character to a colour, '.' is empty
  function pixels(rows, pal, parent, cls) {
    var s = svg(rows[0].length, rows.length, parent, cls);
    rows.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) if (pal[row.charAt(x)]) rect(s, x, y, 1, 1, pal[row.charAt(x)]);
    });
    return s;
  }
  function say(t) { try { if (DW.splashUI && DW.splashUI.say) DW.splashUI.say(t); } catch (e) {} }

  /* ---------------- halloween ---------------- */
  function spider() {
    var wrap = mk('div', 'sp-wrap', root), thread = mk('div', 'sp-thread', wrap), body = mk('div', 'sp-body', wrap);
    var s = svg(16, 14, body);
    var L = [[3, 3, 0, 1], [3, 5, 0, 5], [3, 7, 1, 10], [4, 9, 3, 13]];
    var legs = document.createElementNS(NS, 'g');
    legs.setAttribute('class', 'sp-legs');
    legs.setAttribute('stroke', '#1b0720');
    legs.setAttribute('stroke-width', '1');
    legs.setAttribute('fill', 'none');
    L.forEach(function (l) {
      [0, 1].forEach(function (side) {
        var p = document.createElementNS(NS, 'path');
        var x1 = side ? 16 - l[0] : l[0], x2 = side ? 16 - l[2] : l[2];
        p.setAttribute('d', 'M' + x1 + ' ' + l[1] + 'L' + x2 + ' ' + l[3]);
        legs.appendChild(p);
      });
    });
    s.appendChild(legs);
    rect(s, 5, 2, 6, 3, '#2b0b33'); rect(s, 4, 5, 8, 6, '#1b0720'); rect(s, 5, 11, 6, 1, '#1b0720');
    rect(s, 6, 3, 1, 1, '#ff3b3b'); rect(s, 9, 3, 1, 1, '#ff3b3b');
    rect(s, 7, 7, 2, 2, '#de37e4');

    var rest = 54, len = rest, state = 'idle', t0 = 0, from = 0, to = 0, dur = 0, raf = 0;
    function put(v) { len = v; thread.style.height = v + 'px'; body.style.top = v + 'px'; }
    put(rest);
    function maxLen() { return Math.max(160, Math.min(innerHeight * 0.62, 420)); }
    function go(st, a, b, ms) { state = st; from = a; to = b; dur = ms; t0 = performance.now(); wrap.classList.toggle('climb', st === 'climb'); if (!raf) raf = requestAnimationFrame(tick); }
    function tick(now) {
      raf = 0;
      if (document.body.classList.contains('gaming')) { raf = requestAnimationFrame(tick); t0 += 16; return; }
      var k = Math.min(1, (now - t0) / dur), v;
      if (state === 'fall') {
        v = from + (to - from) * k * k;
        if (k >= 1) { go('bounce', to, to, 650); return; }
      } else if (state === 'bounce') {
        v = to - Math.abs(Math.sin(k * 9)) * (1 - k) * 46;
        if (k >= 1) { go('hang', to, to, 900); return; }
      } else if (state === 'hang') {
        v = to;
        if (k >= 1) { go('climb', to, rest, Math.max(3500, (to - rest) * 22)); return; }
      } else if (state === 'climb') {
        v = from + (to - from) * k + Math.sin(k * 26) * 1.6;
        if (k >= 1) { state = 'idle'; wrap.classList.remove('climb', 'fallen'); put(rest); return; }
      } else return;
      put(v);
      raf = requestAnimationFrame(tick);
    }
    function poke() {
      if (state !== 'idle') return;
      wrap.classList.add('fallen');
      go('fall', len, maxLen(), 420);
      var c = DW.store && DW.store.d ? DW.store.d.c : null;
      if (c) { c.spider = (+c.spider || 0) + 1; DW.store.save(); }
      if (Math.random() < 0.5) say(['AAAH! the spider! ...it is fine. it is just a guy.', 'the spider is on a strict schedule. down, then back up.', 'he does this every day. we do not talk about it.', '<scared>aaaaaah!<n> ...oh. it is just the spider.'][Math.floor(Math.random() * 4)]);
    }
    wrap.addEventListener('pointerdown', function (e) { e.stopPropagation(); poke(); });
    return wrap;
  }

  function pumpkin() {
    var p = pixels([
      '......gg......',
      '.....gg.......',
      '...oooggooo...',
      '.ooooooooooo..',
      'ooooooooooooo.',
      'ooyyooooyyooo.',
      'oyyyyooyyyyoo.',
      'ooyyooooyyooo.',
      'ooooooyoooooo.',
      'ooyooyyyoyooo.',
      'oooyyyyyyyooo.',
      '.ooooooooooo..',
      '..ooooooooo...'
    ], { o: '#ff8a1f', y: '#ffe36b', g: '#2e8b3a' }, mk('div', 'pk-wrap', root), 'pk');
    return p;
  }
  function ghost() {
    var w = mk('div', 'gh-wrap', root);
    pixels([
      '..wwwwww..',
      '.wwwwwwww.',
      'wwwwwwwwww',
      'wwkkwwkkww',
      'wwkkwwkkww',
      'wwwwwwwwww',
      'wwwwkkwwww',
      'wwwwwwwwww',
      'wwwwwwwwww',
      'ww.ww.ww.w'
    ], { w: '#f3ecff', k: '#3a1450' }, w, 'gh');
  }
  function webs() {
    ['tl', 'tr', 'bl', 'br'].forEach(function (c) { mk('div', 'web ' + c, root); });
  }
  function halloween() {
    webs();
    spider();
    pumpkin();
    if (!DW.low) ghost();
  }

  /* ---------------- christmas ---------------- */
  function tree() {
    var wrap = mk('div', 'tree-wrap', root);
    var s = svg(23, 31, wrap, 'tree');
    var G = '#2fae4f', D = '#1c7a37', i;
    var tiers = [[2, 5, 3], [4, 8, 4], [5, 12, 5]];
    // each tier is a stack of widening rows
    var rows = [3, 5, 7, 5, 7, 9, 11, 7, 9, 11, 13, 15, 17];
    var y = 4, ys = [];
    rows.forEach(function (w, n) {
      var x = Math.floor((23 - w) / 2);
      rect(s, x, y, w, 2, n % 2 ? G : '#3bc45c');
      rect(s, x, y, 1, 2, D); rect(s, x + w - 1, y, 1, 2, D);
      ys.push([x, y, w]);
      y += 2;
    });
    void tiers;
    rect(s, 10, y, 3, 3, '#7a4a22');
    rect(s, 10, y, 1, 3, '#5a3416');
    // star
    var star = mk('div', 'tree-star', wrap);
    pixels(['..y..', '..y..', 'yyyyy', '.yyy.', 'yy.yy'], { y: '#ffd34d' }, star);
    // lights
    var cols = ['#ff4d5e', '#ffd34d', '#6fd0ff', '#ff7ae8'];
    var n = 0;
    ys.forEach(function (r, k) {
      if (k < 2) return;
      [r[0] + 1, r[0] + Math.floor(r[2] / 2), r[0] + r[2] - 2].forEach(function (x, j) {
        if ((k + j) % 2) return;
        var l = rect(s, x, r[1] + (j % 2), 1, 1, cols[n % 4], 'lt lt' + (n % 4));
        l.style.animationDelay = '-' + ((n * 370) % 1600) + 'ms';
        n++;
      });
    });
    // presents
    var pr = pixels(['rrrr.bbbbb', 'rwrr.bwbbb', 'rrrr.bbbbb'], { r: '#e8364a', w: '#ffe9a8', b: '#3a82e6' }, wrap, 'gifts');
    void pr;
    var mode = 0;
    wrap.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      mode = (mode + 1) % 4;
      wrap.className = 'tree-wrap m' + mode;
      if (Math.random() < 0.5) say(['<happy>pretty lights!', 'i would hug the tree but i have no arms.', 'the lights are not real. neither am i. merry christmas.', 'it is a very good tree. 10 out of 10 pixels.'][Math.floor(Math.random() * 4)]);
    });
  }
  function xmas() {
    tree();
    mk('div', 'snow-top', root);
  }

  /* ---------------- valentine ---------------- */
  function valentine() {
    var h = mk('div', 'big-heart', root);
    pixels([
      '.rr...rr.', 'rrrr.rrrr', 'rrwrrrrrr', 'rrrrrrrrr', '.rrrrrrr.', '..rrrrr..', '...rrr...', '....r....'
    ], { r: '#de37e4', w: '#ffd0f6' }, h, 'hrt');
    h.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      var r = h.getBoundingClientRect(), i, d;
      h.classList.remove('beat'); void h.offsetWidth; h.classList.add('beat');
      for (i = 0; i < 7; i++) {
        d = document.createElement('div');
        d.className = 'hearts';
        d.textContent = '<3';
        d.style.left = r.left + Math.random() * r.width + 'px';
        d.style.top = r.top + 'px';
        d.style.animationDelay = i * 70 + 'ms';
        document.body.appendChild(d);
        (function (x) { setTimeout(function () { x.remove(); }, 1500); })(d);
      }
    });
    mk('div', 'bunting', root);
  }

  /* ---------------- new year ---------------- */
  function newyear() {
    var t = mk('div', 'ny-banner', root);
    t.textContent = '★ HAPPY NEW YEAR ★';
    mk('div', 'streamers', root);
  }

  /* ---------------- new year fireworks (drawn on the particle canvas) ---------------- */
  var rockets = [], sparks = [], nextRocket = 0;
  var FWC = ['#de37e4', '#ffd34d', '#5a87d0', '#6cf0a0', '#ffffff', '#ff6b8a'];
  function fireworks(c, t, w, h, d) {
    if (t > nextRocket && rockets.length < 3) {
      rockets.push({ x: w * (0.15 + Math.random() * 0.7), y: h, ty: h * (0.15 + Math.random() * 0.35), col: FWC[Math.floor(Math.random() * FWC.length)] });
      nextRocket = t + 700 + Math.random() * 1300;
    }
    var i, p, n, a, v;
    for (i = rockets.length - 1; i >= 0; i--) {
      p = rockets[i];
      p.y -= 5.5 * d;
      c.globalAlpha = 1; c.fillStyle = '#ffffff'; c.fillRect(p.x, p.y, 2, 6);
      if (p.y <= p.ty) {
        n = DW.low ? 18 : 34;
        for (a = 0; a < n; a++) { v = 1.2 + Math.random() * 2.6; sparks.push({ x: p.x, y: p.y, vx: Math.cos(a / n * 6.283) * v, vy: Math.sin(a / n * 6.283) * v, life: 1, col: p.col }); }
        rockets.splice(i, 1);
      }
    }
    for (i = sparks.length - 1; i >= 0; i--) {
      p = sparks[i];
      p.x += p.vx * d; p.y += p.vy * d; p.vy += 0.045 * d; p.vx *= 0.99; p.life -= 0.014 * d;
      if (p.life <= 0) { sparks.splice(i, 1); continue; }
      c.globalAlpha = p.life; c.fillStyle = p.col; c.fillRect(p.x, p.y, 3, 3);
    }
    c.globalAlpha = 1;
  }

  F.fireworks = fireworks;

  F.start = function (id) {
    if (root) return;
    var app = document.getElementById('app');
    if (!app) return;
    root = mk('div', null, app);
    root.id = 'sfx';
    ({ halloween: halloween, xmas: xmas, valentine: valentine, newyear: newyear }[id] || function () {})();
  };
})();

// hook into seasons.js without editing it
(function () {
  var DW = window.DW, S = DW.season, F = DW.seasonfx;
  if (!S) return;
  var init = S.init, draw = S.draw;
  S.init = function () {
    init.apply(S, arguments);
    if (S.id) F.start(S.id);
  };
  S.draw = function (c, t, w, h, d) {
    draw.apply(S, arguments);
    if (S.id === 'newyear') F.fireworks(c, t, w, h, d);
  };
})();
