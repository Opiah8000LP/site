(function () {
  var DW = window.DW;
  if (!DW) { DW = window.DW = {}; DW.early = true; }

  DW.reduce = !!DW.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (DW.reduce) document.documentElement.classList.add('reduce');

  DW.tile = function (label, big) {
    var t = String(label || '?').slice(0, 2).toUpperCase().replace(/[^A-Z0-9?]/g, '?');
    var a = big ? '#be8cff' : '#e1aaff', b = big ? '#6028c8' : '#8c3ce6';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" shape-rendering="crispEdges">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<rect width="100" height="100" fill="#12042b"/><rect x="4" y="4" width="92" height="92" fill="url(#g)"/>' +
      '<rect x="4" y="4" width="92" height="42" fill="#fff" opacity=".16"/>' +
      '<path d="M4 4H96V8H8V96H4Z" fill="#fff" opacity=".55"/><path d="M96 96H4V92H92V4H96Z" fill="#12042b" opacity=".45"/>' +
      '<text x="50" y="63" font-family="Tahoma,Verdana,Arial,sans-serif" font-weight="700" font-size="34" text-anchor="middle" fill="#12042b" opacity=".6" dx="1.5" dy="1.5">' + t + '</text>' +
      '<text x="50" y="63" font-family="Tahoma,Verdana,Arial,sans-serif" font-weight="700" font-size="34" text-anchor="middle" fill="#fff">' + t + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  DW.eyes = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12" shape-rendering="crispEdges">' +
    '<rect x="1" y="2" width="10" height="8" fill="#12042b"/><rect x="2" y="3" width="8" height="6" fill="#fff"/><rect x="5" y="4" width="3" height="4" fill="#7a35ff"/>' +
    '<rect x="13" y="2" width="10" height="8" fill="#12042b"/><rect x="14" y="3" width="8" height="6" fill="#fff"/><rect x="17" y="4" width="3" height="4" fill="#7a35ff"/></svg>');

  if (DW.playlist) {
    DW.tracks = Object.keys(DW.playlist).map(function (f) {
      var v = DW.playlist[f], o = typeof v === 'string' ? { title: v } : (v || {});
      return {
        file: /\./.test(f) ? f : f + '.mp3',
        title: o.title || f.replace(/\.[^.]+$/, ''),
        artist: o.artist,
        album: o.album,
        lyrics: o.lyrics
      };
    });
  }
  DW.tracks = DW.tracks || [];

  DW.byline = function (t) {
    return [t.artist || DW.defaultArtist || '', t.album || ''].filter(Boolean).join(' - ');
  };

  DW.safeUrl = function (u) {
    if (!u) return '';
    try {
      var x = new URL(u, location.href);
      return /^(https?:|mailto:)$/.test(x.protocol) ? x.href : '';
    } catch (e) { return ''; }
  };
  DW.openLink = function (u) { window.open(u, '_blank', 'noopener,noreferrer'); };

  var lastLetter = 0, hotTimer = 0;
  addEventListener('keydown', function (e) {
    if (e.key && e.key.length === 1 && /[a-z]/i.test(e.key)) lastLetter = Date.now();
  }, true);
  DW.later = function (fn) {
    clearTimeout(hotTimer);
    hotTimer = setTimeout(function () { if (Date.now() - lastLetter >= 260) fn(); }, 280);
  };
  DW.cancelHot = function () { clearTimeout(hotTimer); };

  var cur = null;
  DW.win = function (id, title) {
    var ov = document.createElement('div');
    ov.className = 'win-ov';
    ov.id = 'win-' + id;
    ov.hidden = true;
    var w = document.createElement('div');
    w.className = 'win';
    w.tabIndex = -1;
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-label', title);
    var tb = document.createElement('div');
    tb.className = 'win-tb';
    var t = document.createElement('span');
    t.textContent = title;
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'win-x';
    x.textContent = 'X';
    x.setAttribute('aria-label', 'close');
    tb.appendChild(t);
    tb.appendChild(x);
    var body = document.createElement('div');
    body.className = 'win-body';
    w.appendChild(tb);
    w.appendChild(body);
    ov.appendChild(w);
    (document.getElementById('app') || document.body).appendChild(ov);

    var o = { el: ov, body: body, titleEl: t, isOpen: false, onopen: null, onclose: null };
    o.open = function () {
      if (cur && cur !== o) cur.close();
      cur = o;
      o.isOpen = true;
      ov.hidden = false;
      ov.classList.remove('show');
      void ov.offsetWidth;
      ov.classList.add('show');
      document.body.classList.add('modal');
      w.focus();
      if (o.onopen) o.onopen();
    };
    o.close = function () {
      if (cur !== o) return;
      cur = null;
      o.isOpen = false;
      ov.hidden = true;
      ov.classList.remove('show');
      document.body.classList.remove('modal');
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      if (o.onclose) o.onclose();
    };
    o.toggle = function () { if (o.isOpen) o.close(); else o.open(); };
    x.addEventListener('click', o.close);
    ov.addEventListener('click', function (e) { if (e.target === ov) o.close(); });
    return o;
  };
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cur) { cur.close(); e.preventDefault(); }
  });
})();
