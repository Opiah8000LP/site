(function () {
  var DW = window.DW;
  var MIN = 3200;

  DW.boot = function (cb) {
    var b = document.getElementById('boot');
    var fill = document.getElementById('load-fill'), txt = document.getElementById('load-txt');

    var urls = [];
    DW.menu.forEach(function (c) {
      urls.push('icons/' + c.id + '.png');
      Object.keys(c.subs).forEach(function (s) { urls.push('icons/' + s + '.png'); });
    });
    urls.push('icons/eyes.png', 'icons/_default.png', 'covers/default.png');
    urls = urls.filter(function (u, i) { return urls.indexOf(u) === i; });

    var done = 0;
    urls.forEach(function (u) {
      var i = new Image();
      i.onload = i.onerror = function () { done++; };
      i.src = u;
    });

    function finish() {
      setTimeout(function () {
        b.classList.add('end');
        setTimeout(function () {
          b.classList.add('gone');
          cb();
          setTimeout(function () { b.classList.add('dead'); }, 1150);
        }, 650);
      }, 350);
    }

    var t0 = performance.now();
    b.classList.add('go');
    (function loop(t) {
      var el = t - t0;
      var real = el > 8000 ? 1 : done / urls.length;
      var p = Math.min(real, el / MIN);
      fill.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      txt.textContent = p >= 1 ? 'READY' : 'LOADING ' + Math.floor(p * 100) + '%';
      if (p < 1) requestAnimationFrame(loop); else finish();
    })(t0);
  };
})();
