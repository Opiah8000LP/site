if (window.top !== window.self) {
  try { window.top.location.href = window.self.location.href; }
  catch (e) { document.documentElement.innerHTML = ''; }
}
