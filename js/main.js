(function () {
  var DW = window.DW;
  function $(id) { return document.getElementById(id); }
  function safe(name, fn) {
    try { fn(); } catch (e) { console.error('[dweeb] ' + name + ' broke:', e); }
  }

  safe('clock', function () {
    function clock() {
      var d = new Date(), z = function (n) { return n < 10 ? '0' + n : n; };
      $('clock').textContent = d.getDate() + '/' + (d.getMonth() + 1) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
    }
    clock();
    setInterval(clock, 15000);
  });

  safe('visualizer', function () {
    DW.vis.bind('glow', $('glow'));
    DW.vis.bind('bg', $('waves'));
    DW.vis.meter([].slice.call($('meter').children));
    DW.vis.start();
  });
  safe('menu', function () { DW.nav.build(); DW.nav.bind(); });
  safe('player', function () { DW.player.init(); });
  safe('audio', function () { DW.audio.load(0, false); });
  safe('particles', function () { DW.particles.start(); });

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
