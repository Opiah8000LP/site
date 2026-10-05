(function () {
  var DW = window.DW;
  function $(id) { return document.getElementById(id); }
  function safe(name, fn) {
    try { fn(); } catch (e) { console.error('[dweeb] ' + name + ' broke:', e); }
  }

  safe('missing files', function () {
    var miss = (window.__miss || []).slice();
    if (!window.__miss) miss.push('js/guard.js');
    [['tile', 'util'], ['audio', 'audio'], ['vis', 'visualizer'], ['nav', 'navigation'], ['player', 'player'],
     ['splashUI', 'splash'], ['extras', 'extras'], ['particles', 'particles'], ['boot', 'boot']].forEach(function (p) {
      var f = 'js/' + p[1] + '.js';
      if (!DW[p[0]] && miss.indexOf(f) < 0) miss.push(f);
    });
    if (!miss.length) return;
    var w = document.createElement('div');
    w.id = 'warn';
    w.textContent = 'FILES MISSING ON YOUR SITE: ' + miss.join(', ') + ' - upload them, then reload';
    document.body.appendChild(w);
    setTimeout(function () { w.remove(); }, 40000);
  });

  safe('clock', function () {
    function clock() {
      var d = new Date(), z = function (n) { return n < 10 ? '0' + n : n; };
      $('clock').textContent = d.getDate() + '/' + (d.getMonth() + 1) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
    }
    clock();
    setInterval(clock, 15000);
  });

  safe('eyes', function () {
    var e = $('eyes');
    function fix() { if (!e.dataset.f) { e.dataset.f = '1'; e.src = DW.eyes; } }
    e.addEventListener('error', fix);
    if (e.complete && e.naturalWidth === 0) fix();
  });

  safe('visualizer', function () {
    var V = DW.vis;
    V.root($('app'));
    V.glow($('glow'));
    V.waves(['.w1', '.w2', '.w3'].map(function (s) { return document.querySelector(s); }));
    V.meter([].slice.call($('meter').children));
    V.bind('top', [$('sysname'), $('views-wrap'), $('clock')], [0, 1, 2]);
    V.start();
  });
  safe('menu', function () { DW.nav.build(); DW.nav.bind(); });
  safe('player', function () { DW.player.init(); });
  safe('splash', function () { DW.splashUI.init(); });
  safe('extras', function () { DW.extras.init(); });
  safe('audio', function () { DW.audio.load(DW.audio.saved(), false); });
  safe('particles', function () { DW.particles.start(); });

  safe('debug', function () {
    if (!/[?&]debug/.test(location.search)) return;
    var d = document.createElement('pre');
    d.id = 'dbg';
    document.body.appendChild(d);
    setInterval(function () {
      var S = DW.vis.state, A = DW.audio, f = function (n) { return n.toFixed(2); };
      d.textContent = 'playing  ' + A.playing + '\nengine   ' + A.state() + '\nanalyser ' + !!A.analyser +
        '\nbass ' + f(S.bass) + '  mid ' + f(S.mid) + '  high ' + f(S.high) +
        '\nbeats ' + S.beats + '  bpm ' + Math.round(60000 / S.interval) + '  speed ' + f(S.speed) +
        '\nreduced-motion ' + (DW.reduce ? 'ON' : 'off') + '  low-power ' + DW.low + '  master ' + (DW.react && DW.react.master) +
        '\nframes ' + DW.vis.frames + '  engine-error ' + (DW.vis.err || 'none') +
        '\nupdate helper ' + (navigator.serviceWorker && navigator.serviceWorker.controller ? 'active' : 'not active (yet)');
    }, 250);
  });

  var shown = false;
  function reveal() {
    if (shown) return;
    shown = true;
    $('app').classList.add('on');
    document.body.classList.add('live');
    safe('music', function () {
      DW.audio.arm();
      if (!DW.audio.userPaused) DW.audio.play();
    });
    safe('splash start', function () { DW.splashUI.start(); });
    setTimeout(function () { $('hint').classList.add('fade'); }, 9000);
  }

  function bail() {
    reveal();
    var b = $('boot');
    b.classList.add('gone');
    setTimeout(function () { b.classList.add('dead'); }, 1200);
  }
  setTimeout(bail, 180000);

  try { DW.boot(reveal); }
  catch (e) { console.error('[dweeb] boot broke:', e); bail(); }
})();
