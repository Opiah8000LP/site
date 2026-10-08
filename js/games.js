(function () {
  var DW = window.DW, St = DW.store, G = (DW.games = { list: [], cur: null });

  G.add = function (def) { G.list.push(def); };

  var PAL = { bg: '#14052e', bg2: '#1c0840', grid: '#2a0b60', p1: '#7a35ff', p2: '#a56bff', p3: '#d9bcff', pk: '#ff6bd6', ink: '#12042b', gold: '#ffd34d', white: '#ffffff' };
  G.pal = PAL;

  G.bevel = function (c, x, y, w, h, col) {
    c.fillStyle = col;
    c.fillRect(x, y, w, h);
    var b = Math.max(1, Math.min(w, h) / 8);
    c.fillStyle = 'rgba(255,255,255,.38)';
    c.fillRect(x, y, w, b);
    c.fillRect(x, y, b, h);
    c.fillStyle = 'rgba(0,0,0,.34)';
    c.fillRect(x, y + h - b, w, b);
    c.fillRect(x + w - b, y, b, h);
  };

  var DEFAULT_KEYS = {
    arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right', arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down',
    ' ': 'drop', x: 'a', z: 'b', enter: 'enter'
  };

  var win, menuEl, stageEl, cardEls = {}, hdTitle, hudL, hudR, wrap, cv, ctx, ovEl, ovT, ovS, ovB, layer, padEl, helpEl, pauseBtn;
  var raf = 0, last = 0, paused = false, ovFn = null, repeat = {}, cur = null, started = false;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function rec(id) {
    var g = St.d.g;
    if (!g[id] || typeof g[id] !== 'object') g[id] = { best: 0, plays: 0 };
    return g[id];
  }

  function fit() {
    if (!cur) return;
    var d = cur.def, body = win.body, availW = Math.max(120, body.clientWidth - 24);
    var coarse = matchMedia('(pointer: coarse)').matches;
    var chrome = 134 + (coarse && d.pad ? 56 : 0);
    var availH = Math.max(120, Math.min(window.innerHeight * 0.78, 640) - chrome);
    var sc = Math.min(availW / d.w, availH / d.h);
    var cssW = Math.floor(d.w * sc), cssH = Math.floor(d.h * sc);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.style.width = cssW + 'px';
    cv.style.height = cssH + 'px';
    wrap.style.width = cssW + 'px';
    wrap.style.height = cssH + 'px';
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
    ctx.setTransform(cv.width / d.w, 0, 0, cv.height / d.h, 0, 0);
    if (cur.game && cur.game.draw) cur.game.draw(ctx);
  }

  function say(title, sub, btn, fn) {
    ovT.textContent = title || '';
    ovS.textContent = sub || '';
    ovB.textContent = btn || '';
    ovB.hidden = !btn;
    ovFn = fn || null;
    ovEl.hidden = false;
  }
  function clearSay() { ovEl.hidden = true; ovFn = null; }

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (!cur) return;
    var dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    if (paused || document.hidden) return;
    if (cur.game.frame) cur.game.frame(dt, ctx, t);
  }

  function setPaused(v) {
    if (!cur || !started) return;
    if (v === paused) return;
    paused = v;
    pauseBtn.textContent = v ? 'RESUME' : 'PAUSE';
    if (v) {
      say('PAUSED', 'press P or tap to continue', 'RESUME', function () { setPaused(false); });
      if (cur.game.onpause) cur.game.onpause();
    } else {
      clearSay();
      last = performance.now();
      if (cur.game.onresume) cur.game.onresume();
    }
  }

  function makeEnv(def) {
    var env = {
      w: def.w, h: def.h, ctx: ctx, layer: layer, pal: PAL, bevel: G.bevel,
      say: say, clear: clearSay,
      hud: function (l, r) { hudL.textContent = l == null ? '' : l; hudR.textContent = r == null ? '' : r; },
      best: function () { return rec(def.id).best || 0; },
      start: function () { started = true; paused = false; pauseBtn.textContent = 'PAUSE'; pauseBtn.hidden = false; last = performance.now(); },
      end: function () { started = false; pauseBtn.hidden = true; },
      report: function (score) {
        var r = rec(def.id), nb = score > (r.best || 0);
        if (nb) r.best = score;
        St.save();
        return nb;
      },
      played: function () {
        rec(def.id).plays++;
        St.save();
        if (DW.trophy) DW.trophy.mark('arcade', def.id);
      },
      award: function (id) { if (DW.trophy) DW.trophy.award(id); },
      pause: function () { setPaused(true); },
      fit: fit,
      menu: function () { G.back(); }
    };
    return env;
  }

  function action(k, down) {
    if (!cur || !cur.game.key) return;
    cur.game.key(k, down);
  }

  function onKey(e, down) {
    if (!cur) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = (e.key || '').toLowerCase();
    if (k === 'escape') {
      if (!down) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      G.back();
      return;
    }
    var map = cur.def.keymap || DEFAULT_KEYS, a = map[k];
    if (k === 'p') {
      if (down && !e.repeat && started) setPaused(!paused);
      e.preventDefault();
      return;
    }
    if (!a) {
      if (k === ' ' || k === 'enter' || k.indexOf('arrow') === 0) e.preventDefault();
      return;
    }
    e.preventDefault();
    if (down && !ovEl.hidden && ovFn && (a === 'enter' || a === 'drop')) {
      if (!e.repeat) { var f = ovFn; f(); }
      return;
    }
    if (!ovEl.hidden && !started) return;
    if (paused) return;
    action(a, down);
  }

  function buildPad(def) {
    padEl.textContent = '';
    padEl.hidden = !def.pad;
    if (!def.pad) return;
    def.pad.forEach(function (p) {
      var b = el('button', 'gm-pb', p[1]);
      b.type = 'button';
      b.setAttribute('aria-label', p[0]);
      var tm = 0;
      function stop() { clearInterval(tm); tm = 0; action(p[0], false); }
      b.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (!ovEl.hidden && ovFn) { ovFn(); return; }
        if (paused) return;
        action(p[0], true);
        if (p[2]) tm = setInterval(function () { action(p[0], true); }, 105);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { b.addEventListener(n, stop); });
      padEl.appendChild(b);
    });
  }

  function bindPointer(def) {
    var sx = 0, sy = 0, down = false, moved = false;
    function pos(e) {
      var r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * def.w, (e.clientY - r.top) / r.height * def.h];
    }
    cv.onpointerdown = function (e) {
      if (!ovEl.hidden) return;
      down = true; moved = false; sx = e.clientX; sy = e.clientY;
      try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      var p = pos(e);
      if (!paused && cur.game.pointer) cur.game.pointer('down', p[0], p[1]);
    };
    cv.onpointermove = function (e) {
      var p = pos(e);
      if (down && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 10) moved = true;
      if (!paused && cur && cur.game.pointer && (down || def.hover)) cur.game.pointer('move', p[0], p[1]);
    };
    function up(e) {
      if (!down) return;
      down = false;
      var p = pos(e), dx = e.clientX - sx, dy = e.clientY - sy;
      if (!paused && cur && cur.game.pointer) cur.game.pointer('up', p[0], p[1]);
      if (def.swipe && !paused) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) {
          var a = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
          action(a, true);
          action(a, false);
        } else if (!moved && cur.game.tap) cur.game.tap();
      }
    }
    cv.onpointerup = up;
    cv.onpointercancel = function () { down = false; };
  }

  function closeGame() {
    if (!cur) return;
    cancelAnimationFrame(raf);
    raf = 0;
    Object.keys(repeat).forEach(function (k) { clearInterval(repeat[k]); });
    try { if (cur.game.stop) cur.game.stop(); } catch (e) { console.error('[dweeb] game stop', e); }
    cur = null;
    started = false;
    paused = false;
    DW.gaming = false;
    document.body.classList.remove('gaming');
    layer.textContent = '';
    layer.hidden = true;
    clearSay();
  }

  G.back = function () {
    if (!cur) { win.close(); return; }
    closeGame();
    stageEl.hidden = true;
    menuEl.hidden = false;
    buildMenu();
    win.titleEl.textContent = 'GAMES';
  };

  G.play = function (id) {
    var def = null;
    G.list.forEach(function (d) { if (d.id === id) def = d; });
    if (!def) return;
    closeGame();
    menuEl.hidden = true;
    stageEl.hidden = false;
    win.titleEl.textContent = def.name;
    hdTitle.textContent = def.name;
    helpEl.textContent = def.help || '';
    pauseBtn.hidden = true;
    layer.textContent = '';
    layer.hidden = true;
    clearSay();
    DW.gaming = true;
    document.body.classList.add('gaming');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    var env = makeEnv(def);
    cur = { def: def, env: env, game: null };
    cur.game = def.make(env);
    buildPad(def);
    bindPointer(def);
    fit();
    last = performance.now();
    raf = requestAnimationFrame(loop);
    cur.game.start();
    win.el.firstChild.focus();
  };

  function buildMenu() {
    menuEl.textContent = '';
    G.list.forEach(function (d) {
      var b = el('button', 'gm-card');
      b.type = 'button';
      b.appendChild(el('b', null, d.name));
      b.appendChild(el('span', null, d.blurb));
      var r = St.d.g[d.id];
      b.appendChild(el('i', null, r && r.plays ? (d.bestLabel || 'BEST') + ' ' + (r.best || 0) : 'NEW'));
      b.addEventListener('click', function () { G.play(d.id); });
      menuEl.appendChild(b);
    });
  }

  G.init = function () {
    win = DW.win('games', 'GAMES');
    menuEl = el('div', 'gm-menu');
    stageEl = el('div', 'gm-stage');
    stageEl.hidden = true;

    var hd = el('div', 'gm-hd');
    var back = el('button', 'tab-go', 'BACK');
    back.type = 'button';
    back.addEventListener('click', function () { G.back(); });
    hdTitle = el('b');
    pauseBtn = el('button', 'tab-go', 'PAUSE');
    pauseBtn.type = 'button';
    pauseBtn.hidden = true;
    pauseBtn.addEventListener('click', function () { setPaused(!paused); pauseBtn.blur(); });
    hd.appendChild(back);
    hd.appendChild(hdTitle);
    hd.appendChild(pauseBtn);

    var hud = el('div', 'gm-hud');
    hudL = el('span');
    hudR = el('span');
    hud.appendChild(hudL);
    hud.appendChild(hudR);

    wrap = el('div', 'gm-cv');
    cv = el('canvas');
    ctx = cv.getContext('2d');
    ovEl = el('div', 'gm-ov');
    ovEl.hidden = true;
    ovT = el('b');
    ovS = el('span');
    ovB = el('button', 'cm-go', '');
    ovB.type = 'button';
    ovB.addEventListener('click', function () { if (ovFn) ovFn(); });
    ovEl.appendChild(ovT);
    ovEl.appendChild(ovS);
    ovEl.appendChild(ovB);
    layer = el('div', 'gm-layer');
    layer.hidden = true;
    wrap.appendChild(cv);
    wrap.appendChild(layer);
    wrap.appendChild(ovEl);

    padEl = el('div', 'gm-pad');
    padEl.hidden = true;
    helpEl = el('div', 'gm-help');

    [hd, hud, wrap, padEl, helpEl].forEach(function (n) { stageEl.appendChild(n); });
    win.body.appendChild(menuEl);
    win.body.appendChild(stageEl);
    win.body.classList.add('gm-body');

    win.onopen = function () {
      if (!cur) { menuEl.hidden = false; stageEl.hidden = true; buildMenu(); win.titleEl.textContent = 'GAMES'; }
    };
    win.onclose = function () {
      closeGame();
      stageEl.hidden = true;
      menuEl.hidden = false;
      win.titleEl.textContent = 'GAMES';
    };

    addEventListener('keydown', function (e) { onKey(e, true); }, true);
    addEventListener('keyup', function (e) { onKey(e, false); }, true);
    addEventListener('resize', fit);
    document.addEventListener('visibilitychange', function () { if (document.hidden && cur && started && !paused && cur.def.autopause !== false) setPaused(true); });
    addEventListener('blur', function () { if (cur && started && !paused && cur.def.autopause !== false) setPaused(true); });

    var btn = el('button', 'tbtn');
    btn.id = 'b-games';
    btn.type = 'button';
    btn.title = 'games';
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('class', 'tr-ic');
    svg.setAttribute('shape-rendering', 'crispEdges');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M3 5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1l-1-2H5l-1 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM4 7v1H3v1h1v1h1V9h1V8H5V7zm7 0v1h1V7zm2 1v1h1V8z');
    p.setAttribute('fill', '#fff');
    svg.appendChild(p);
    btn.appendChild(svg);
    btn.appendChild(el('span', null, 'GAMES'));
    btn.addEventListener('click', function () { win.toggle(); btn.blur(); });
    var bar = document.getElementById('status');
    bar.insertBefore(btn, document.getElementById('b-trophy') || document.getElementById('b-help') || document.getElementById('views-wrap'));
  };
})();
