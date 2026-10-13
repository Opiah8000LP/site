(function () {
  var DW = window.DW, C = (DW.changelog = {});

  // ADD A NEW ENTRY AT THE TOP every time you update the site. newest first.
  // v: version text, date: optional, title: one line, items: what changed (plain text)
  C.entries = [
    { v: '1.7', date: '13 OCT 2026', title: 'Settings', items: [
      'New SETTINGS button: change the site colours, how much it reacts to the music, and more. Works on phones too',
      'Music options: start muted, autoplay on or off, skip the intro automatically',
      'Chat bot on or off and how chatty it is, jump scares on or off, eyes, trophy sound and a light power mode',
      'Everything is saved on your own device, so it is still there when you come back',
      'New trophy for tinkering with the settings, and a new song in the playlist'
    ] },
    { v: '1.6', date: '13 OCT 2026', title: 'Little secrets', items: [
      'New hidden secrets, on phones too. Poke around, tap things, hold things',
      '7 new secret trophies, 3 of them only exist during their season',
      'Trophies come in exactly five tiers: bronze, silver, gold, platinum and rare',
      'Seasons only show up in their own month now. Come back then.'
    ] },
    { v: '1.5', date: '12 OCT 2026', title: 'Spooky season', items: [
      'Seasons now last the whole month (October = Halloween, December = Christmas, February = Valentine)',
      'Halloween: a spider on a thread. Click it and it falls and climbs back. Sometimes it escapes... do not click it',
      'Christmas: a tree with 3 light shows when you click it',
      'The top bar now says what is going on instead of a version number, and this changelog was added'
    ] },
    { v: '1.4', title: 'Living text', items: [
      'The chat bot can now show 20 emotions: angry, shy, sad, happy, excited, scared, whisper, yell, sleepy, love, silly, spooky, dizzy, glitch, cold, rich, sneaky, nervous, proud, sing',
      'Type "emotions" to see them all',
      'New purple, magenta and blue colour theme',
      'The selected menu label now fades in instead of sitting in a box'
    ] },
    { v: '1.3', title: 'Games and trophies', items: [
      'GAMES: Rhythm (plays your own songs), Snake, Pong, Tetris, Breakout and 2048, each with modes',
      'TROPHIES: lots to unlock, some of them secret, plus a save data screen',
      'The visitor eyes can wake up and follow your cursor',
      'Seasonal decorations and month lines from the chat bot'
    ] },
    { v: '1.0', title: 'DWEEB RECORDS opens', items: [
      'The music player with a beat reactive background, lyrics from the chat bot and the menu of categories'
    ] }
  ];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function seenGet() { try { return localStorage.getItem('dw-cl-seen') || ''; } catch (e) { return ''; } }
  function seenSet(v) { try { localStorage.setItem('dw-cl-seen', v); } catch (e) {} }

  C.init = function () {
    var list = C.entries || [];
    if (!list.length) return;
    var win = DW.win('changelog', 'CHANGELOG'), latest = String(list[0].v);
    list.forEach(function (en) {
      var box = el('section', 'cl-entry');
      var hd = el('h3', null, 'v' + en.v + (en.date ? '  -  ' + en.date : ''));
      box.appendChild(hd);
      if (en.title) box.appendChild(el('div', 'cl-title', en.title));
      var ul = el('ul', 'cl-list');
      (en.items || []).forEach(function (t) { ul.appendChild(el('li', null, t)); });
      box.appendChild(ul);
      win.body.appendChild(box);
    });

    var btn = el('button', 'tbtn');
    btn.id = 'b-log';
    btn.type = 'button';
    btn.title = 'changelog: what is new';
    var src = (DW.icons || {}).changelog;
    if (src) {
      var ic = new Image();
      ic.src = src;
      ic.alt = '';
      btn.appendChild(ic);
    }
    else btn.classList.add('noic');
    var cl = el('span', null, 'CHANGELOG');
    cl.setAttribute('data-s', 'LOG');
    btn.appendChild(cl);
    if (seenGet() !== latest) btn.classList.add('fresh');
    btn.addEventListener('click', function () { win.toggle(); btn.blur(); });
    win.onopen = function () { seenSet(latest); btn.classList.remove('fresh'); };
    var bar = document.getElementById('status');
    bar.insertBefore(btn, document.getElementById('b-help') || document.getElementById('views-wrap'));
  };
})();
