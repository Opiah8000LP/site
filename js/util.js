(function () {
  var DW = window.DW;

  DW.tile = function (label, big) {
    var t = String(label || '?').slice(0, 2).toUpperCase().replace(/[^A-Z0-9?]/g, '?');
    var a = big ? '#be8cff' : '#e1aaff', b = big ? '#6028c8' : '#8c3ce6';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<rect x="8" y="8" width="84" height="84" rx="22" fill="url(#g)"/>' +
      '<rect x="14" y="12" width="72" height="34" rx="18" fill="#fff" opacity=".18"/>' +
      '<text x="50" y="62" font-family="Arial,sans-serif" font-weight="700" font-size="34" text-anchor="middle" fill="#fff">' + t + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };
})();
