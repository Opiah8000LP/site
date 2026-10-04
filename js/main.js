(function () {
  var DW = window.DW;
  function $(id) { return document.getElementById(id); }

  function clock() {
    var d = new Date(), z = function (n) { return n < 10 ? '0' + n : n; };
    $('clock').textContent = d.getDate() + '/' + (d.getMonth() + 1) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
  }
  clock();
  setInterval(clock, 15000);

  DW.vis.bind('glow', $('glow'));
  DW.vis.bind('bg', $('waves'));
  DW.vis.meter([].slice.call($('meter').children));

  DW.nav.build();
  DW.nav.bind();
  DW.player.init();
  DW.audio.load(0, false);
  DW.audio.arm();
  DW.vis.start();
  DW.particles.start();

  DW.boot(function () {
    $('app').classList.add('on');
    document.body.classList.add('live');
    if (!DW.audio.userPaused) DW.audio.play();
    setTimeout(function () { $('hint').classList.add('fade'); }, 9000);
  });
})();
