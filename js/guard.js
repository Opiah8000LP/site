if (window.top !== window.self) {
  try { window.top.location.href = window.self.location.href; }
  catch (e) { document.documentElement.innerHTML = ''; }
}

window.__miss = [];
addEventListener('error', function (e) {
  var t = e.target;
  if (t && t.tagName === 'SCRIPT') window.__miss.push((t.getAttribute('src') || '').replace(/\?.*$/, ''));
}, true);
