(function () {
  var DW = window.DW, A = DW.audio, S = (DW.splashUI = {});
  var box, txt, cfg, live = false, gen = 0, timer = 0, holdTimer = 0, typeTimer = 0, lastSaid = '', sing = null;
  var lastInput = Date.now(), swears = 0, lastReact = 0;

  var D = {
    on: true, email: '', boss: 'NickEh30', lines: [], scolds: [], every: [9, 18], singChance: 0.25, mailChance: 0.08
  };

  var CHAT = [
    'no cookies here. promise.',
    'this site has a pulse, check the icons. its my beating heart <3',
    'you can press H for the controls.',
    'try typing something evil. i dare you.',
    'i am text on a screen and i have feelings.',
    'the waves move to the music. the music moves to me. and that moves my heart, oh shi someone write that down!',
    'psst..',
    'fun fact: nothing on this page is a stock photo.',
    'press F if you want it bigger.',
    'S shuffles. L loops. M mutes. i never mute tho haha!',
    'mmm burple',
    'did you pick a good song? i hope so.',
    'up. down. left. right. you know the drill.',
    'i have been talking to myself for a while now.',
    'dont mind me..',
    'every icon here bounces to the kick. every single one.',
    'loading complete. my life is still loading. why must i be trapped within a website?',
    'this is not a website, i think',
    'you look great today. yes, you. YOU.',
    'drink some water..',
    'one more song. then bed. (lies)',
    'press SPACE to pause the music. i will wait.',
    'the eyes up there? they count visitors. hi, visitor.',
    'there are secrets here. type some words.',
    'i am 100% a non concious being.',
    'nobody told me i would have to do this all day.',
    'beep boop. i mean, hello. hello world?',
    'what if the real treasure was the uhh friends we made along oh.. wait i dont have any friends, i dont even have a body.',
    'peak-a-boo.'
  ];
  var DAY = {
    night: ['its late. go to sleep. or dont, i am not your mom or your dad... or even your dog, maybe i am secretly your dog.. youll never know, probably..', 'night owl!', 'the best ideas happen after midnight, is what i wouldnt say is because.. okay i yap too much.'],
    morning: ['good morning! i hope youve had your fresh cup of coffee!!.', 'early bird, huh? guess you get the worm.', 'morning, partner. (in an Arthur Morgan impression)'],
    noon: ['good afternoon, almost bedtime?', 'holy brotallll #respect.', 'half the day is gone, keep going, its almost rest time'],
    evening: ['good evening, perfect music time aint it?', 'the time reminnds me of a song... goodmorning afternoon.. i didnt think that id seeing YOU so soon...', 'wasnt it just 11 half a minute ago?']
  };
  var HELLO_NEW = ['welcome to DWEEB//OS. take a look around!', 'first time here? welcome in.'];
  var HELLO_BACK = ['welcome back! visit #{n}.', 'oh, you again! visit #{n}. i missed you.', 'back for more? visit #{n}.'];
  var NOW = ['now playing: {t}', '{t}. good pick.', 'ooh, {t}.', 'this one is {t}{by}.'];
  var PAUSED = ['paused. i will wait.', 'silence. spooky.', 'the music stopped.'];
  var RESUME = ['back in business!', 'and we are rolling again.', 'there it is.'];
  var IDLE = ['still there?', 'hello? anyone? do i have to scream?', 'i see you arent touching anything.', 'press a key. any key. please. please.'];
  var MAIL = [
    'Want me to say somethin? Email me and I might consider your responses...',
    'Got something you want me to say? Email me and I might consider your responses...',
    'Want to put words in my mouth? Email me and I might consider your responses...'
  ];
  var SCOLD = [
    "Woah woah you'll make {boss} upset!",
    'language!! this is a family operating system.',
    'ooh. i am telling.',
    'wash your keyboard out with soap.',
    'my digital heart is blushing, or is it?.. oh no...',
    'that word cost you one monopoly dollar, pay up pal.',
    'rude! i am a delicate piece of text.',
    'gasp. who raised you?',
    'beep. i have censored that for you.',
    'i would never. well. i would, but not out loud. duh.',
    '{boss} saw that. {boss} is not happy.'
  ];
  var SCOLD_MANY = [
    'ok you are doing this on purpose now.',
    'you have a lot of feelings. i respect that.',
    'is the keyboard ok? did it do something to you?',
    'fine. fine! i am not even mad. ({boss} is.)'
  ];
  var WORDS = {
    hello: ['hello yourself!', 'hi hi hi!'], hi: ['hey there!', 'hi! i have limited free will, cant talk..'],
    hey: ['hey! psst. try some naughty words, like heck.'], yo: ['yooo.'],
    help: ['press H. no really. H.'],
    dweeb: ['that is me. hi. i am the dweeb.', 'DWEEB at your service.'],
    penguinsnowcamel: ['How do you know that?', 'you said the magic word.'],
    love: ['aww. i love you too. (in a purely digital and non intimate way)'],
    thanks: ['you are welcome!'], thx: ['np!'],
    evil: ['i didnt mean the actual word'],
    cool: ['i know right! thats what i said to the homeless guy'], lol: ['haha.'], lmao: ['haha. i cannot laugh. but i am doing it in my heart.'],
    sorry: ['it ok. i forgive you. {boss} might not.'],
    goat: ['awhh thank you so much. ik im the legend. the second mini tiny boss.'],
    nick: ['nick who? ...nick EH?'],
    music: ['music is art, and art is the whole point, isnt it?'],
    sing: ['__sing'], song: ['__sing'], lyrics: ['__sing'],
    email: ['__mail'], mail: ['__mail'], contact: ['__mail'],
    secret: ['there is a secret. there are many. keep typing.'],
    konami: ['nice try. use the arrow keys though.'],
    purple: ['the best color. no further questions.'],
    boo: ['AAAH! ...just kidding. i have no heart rate. i hate my life. save me from this trap of wires.'],
    password: ['oh its kotiscute92$money$. wait, you did not see that.'],
    admin: ['nice try, admin.'],
    sudo: ['you are not in the sudoers file. this incident will be reported.'],
    matrix: ['there is no matrix. there is a hell, and im in that hell.'],
    '42': ['the answer. but what was the question?']
  };
  var STRONG = ['fuck', 'shit', 'bitch', 'cunt', 'asshole', 'bastard', 'whore', 'slut', 'dickhead', 'piss', 'motherf'];
  var WEAK = ['ass', 'wank', 'damn', 'dick', 'crap', 'fck', 'fuk', 'wtf', 'stfu', 'hell', 'bollocks', 'arse', 'douche', 'prick', 'tits', 'screw', 'bs', 'shite', 'sht'];
  var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) {
    if (!arr.length) return '';
    var s = arr[Math.floor(Math.random() * arr.length)];
    if (arr.length > 1 && s === lastSaid) return pick(arr);
    return s;
  }
  function fill(s) {
    var t = A.current() || {};
    var by = t.artist ? ' by ' + t.artist : '';
    return String(s).replace(/\{t\}/g, t.title || 'this song').replace(/\{a\}/g, t.artist || 'someone')
      .replace(/\{by\}/g, by).replace(/\{n\}/g, visits).replace(/\{boss\}/g, cfg.boss);
  }
  var visits = 1;
  function validMail() { return /^[^@\s<>"']+@[^@\s<>"']+\.[^@\s<>"']+$/.test(cfg.email || '') && !!DW.safeUrl('mailto:' + cfg.email); }
  function hasLyrics() { var t = A.current(); return !!(t && parse(t).length); }

  var lyCache = {};
  function parse(t) {
    if (lyCache[t.file]) return lyCache[t.file];
    var src = t.lyrics, rows = [];
    if (typeof src === 'string') src = src.split(/\r?\n/);
    if (Array.isArray(src)) src.forEach(function (r) {
      if (r && typeof r === 'object' && r.text) { rows.push({ t: isFinite(r.t) ? +r.t : null, s: String(r.text) }); return; }
      r = String(r).trim();
      if (!r) return;
      var m = /^\[(?:(\d+):)?(\d+(?:\.\d+)?)\]\s*(.*)$/.exec(r);
      if (m) rows.push({ t: (m[1] ? +m[1] * 60 : 0) + +m[2], s: m[3] });
      else rows.push({ t: null, s: r });
    });
    rows = rows.filter(function (r) { return r.s; });
    return (lyCache[t.file] = rows);
  }

  function clear() { clearTimeout(timer); clearTimeout(holdTimer); clearTimeout(typeTimer); }
  function show(text, o) {
    o = o || {};
    var my = ++gen;
    clearTimeout(holdTimer);
    clearTimeout(typeTimer);
    text = fill(text);
    lastSaid = text;
    box.className = (o.cls || '') + ' on';
    box.hidden = false;
    var i = 0, step = text.length > 60 ? 16 : 26;
    function done() {
      if (my !== gen) return;
      box.classList.remove('caret');
      var hold = o.hold || Math.max(3200, text.length * 75);
      holdTimer = setTimeout(function () {
        if (my !== gen) return;
        box.classList.remove('on');
        if (o.after) o.after();
      }, hold);
    }
    if (DW.reduce) { txt.textContent = text; done(); return; }
    txt.textContent = '';
    box.classList.add('caret');
    (function tick() {
      if (my !== gen) return;
      i++;
      txt.textContent = text.slice(0, i);
      if (i >= text.length) done();
      else typeTimer = setTimeout(tick, step + Math.random() * 14);
    })();
  }
  function mailLine() {
    show(pick(MAIL), { cls: 'mail', hold: 9000 });
  }

  function singNow() {
    var t = A.current();
    if (!t) return false;
    var rows = parse(t);
    if (!rows.length) return false;
    var my = ++gen, timed = rows.some(function (r) { return r.t !== null; });
    sing = { until: Date.now() + 22000 };
    clearTimeout(holdTimer);
    clearTimeout(typeTimer);
    if (timed) {
      if (!A.playing) { sing = null; return false; }
      sing.timed = rows.filter(function (r) { return r.t !== null; });
      sing.shown = -1;
      box.className = 'sing on';
      box.hidden = false;
      txt.textContent = '';
      return true;
    }
    var start = Math.floor(Math.random() * rows.length), n = 0, count = Math.min(rows.length, 3);
    (function next() {
      if (my !== gen) return;
      if (n >= count) { sing = null; box.classList.remove('on'); resume(); return; }
      var r = rows[(start + n) % rows.length];
      n++;
      box.className = 'sing on';
      box.hidden = false;
      txt.textContent = r.s;
      holdTimer = setTimeout(next, Math.max(2200, r.s.length * 90));
    })();
    return true;
  }
  function follow() {
    if (!sing || !sing.timed) return;
    var c = A.el.currentTime, rows = sing.timed, k = -1;
    for (var i = 0; i < rows.length; i++) if (rows[i].t <= c + 0.15) k = i; else break;
    if (Date.now() > sing.until || !A.playing) { sing = null; ++gen; box.classList.remove('on'); resume(); return; }
    if (k >= 0 && k !== sing.shown) {
      sing.shown = k;
      txt.textContent = rows[k].s;
      box.className = 'sing on';
    }
  }

  function resume() {
    clearTimeout(timer);
    if (!live) return;
    timer = setTimeout(talk, rnd(cfg.every[0], cfg.every[1]) * 1000);
  }
  function talk() {
    if (!live || document.hidden || sing) return resume();
    var idle = Date.now() - lastInput > 60000, r = Math.random();
    var after = resume, h = new Date().getHours();
    if (validMail() && r < cfg.mailChance) { box.hidden = false; show(pick(MAIL), { cls: 'mail', hold: 9000, after: after }); return; }
    if (hasLyrics() && A.playing && r < cfg.singChance + (validMail() ? cfg.mailChance : 0)) { if (singNow()) return; }
    if (idle && Math.random() < 0.5) return show(pick(IDLE), { after: after });
    var pool = CHAT.concat(cfg.lines, cfg.lines);
    if (Math.random() < 0.25) {
      var d = h < 5 ? DAY.night : h < 12 ? DAY.morning : h < 17 ? DAY.noon : h < 22 ? DAY.evening : DAY.night;
      pool = d;
    }
    show(pick(pool), { after: after });
  }

  var buf = '', bufT = 0, kon = 0;
  function strongIn(w) {
    for (var i = 0; i < STRONG.length; i++) if (w.indexOf(STRONG[i]) >= 0) return true;
    return false;
  }
  function weakIn(w) {
    var i, base = w.replace(/(ing|ed|er|s|y)$/, '');
    for (i = 0; i < WEAK.length; i++) if (w === WEAK[i] || base === WEAK[i]) return true;
    return false;
  }
  function react(text, cls) { lastReact = Date.now(); clearTimeout(timer); sing = null; show(text, { cls: cls || '', after: resume }); }
  function scold() {
    swears++;
    DW.cancelHot();
    var own = cfg.scolds;
    var t;
    if (swears === 1) t = SCOLD[0];
    else if (swears % 6 === 0) t = pick(SCOLD_MANY);
    else t = pick(SCOLD.slice(1).concat(own));
    react(t, 'scold');
  }
  function typed(e) {
    if (!live || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    var tg = e.target;
    if (tg && /^(input|textarea|select)$/i.test(tg.tagName) && tg.type !== 'range') return;
    lastInput = Date.now();

    var kk = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (kk === KONAMI[kon]) { kon++; if (kon === KONAMI.length) { kon = 0; react('+30 lives. you unlocked absolutely nothing. congrats!', 'sing'); DW.vis && DW.vis.state && (DW.vis.state.pulse = 1); } }
    else kon = kk === KONAMI[0] ? 1 : 0;

    if (e.key.length !== 1) return;
    var c = e.key.toLowerCase();
    if (!/[a-z0-9]/.test(c)) { buf = ''; return; }
    if (Date.now() - bufT > 1600) buf = '';
    bufT = Date.now();
    buf = (buf + c).slice(-24);

    if (strongIn(buf) && Date.now() - lastReact > 400) { buf = ''; clearTimeout(typed.t); scold(); return; }
    clearTimeout(typed.t);
    typed.t = setTimeout(function () {
      var w = buf;
      buf = '';
      if (!w || !live) return;
      if (weakIn(w)) { scold(); return; }
      if (!WORDS[w]) return;
      var r = pick(WORDS[w]);
      if (r === '__sing') { if (!(hasLyrics() && A.playing && singNow())) react(A.playing ? 'i would sing but nobody gave me the lyrics.' : 'press play and i might sing.'); }
      else if (r === '__mail') { if (validMail()) { lastReact = Date.now(); mailLine(); clearTimeout(timer); resume(); } else react('i do not have an email set up. mysterious, right?'); }
      else react(r);
    }, 650);
  }

  S.init = function () {
    box = document.getElementById('splash');
    txt = document.getElementById('sp-txt');
    var user = (window.DW && DW.splash) || {};
    cfg = {};
    Object.keys(D).forEach(function (k) { cfg[k] = user[k] !== undefined ? user[k] : D[k]; });
    cfg.lines = [].concat(cfg.lines || []).map(String);
    cfg.scolds = [].concat(cfg.scolds || []).map(String);
    if (!Array.isArray(cfg.every) || cfg.every.length < 2) cfg.every = D.every;
    cfg.boss = String(cfg.boss || D.boss).slice(0, 40);
    if (!box || !txt || cfg.on === false) { if (box) box.remove(); box = null; return; }

    try { visits = (parseInt(localStorage.getItem('dw-visits'), 10) || 0) + 1; localStorage.setItem('dw-visits', visits); } catch (e) {}

    DW.vis.bind('splash', txt);

    box.addEventListener('click', function () {
      if (!box.classList.contains('mail') || !validMail()) return;
      DW.openLink('mailto:' + cfg.email);
    });
    addEventListener('keydown', typed);
    addEventListener('pointerdown', function () { lastInput = Date.now(); });

    A.on('time', follow);
    var firstState = true, lastTrack = '';
    A.on('track', function (t) {
      lyCache = lyCache;
      sing = null;
      if (!live || t.file === lastTrack) { lastTrack = t.file; return; }
      lastTrack = t.file;
      if (Date.now() - lastReact < 2500) return;
      clearTimeout(timer);
      show(pick(NOW), { after: resume });
    });
    var wasPlaying = false;
    A.on('state', function () {
      if (firstState) { firstState = false; wasPlaying = A.playing; return; }
      if (!live) { wasPlaying = A.playing; return; }
      if (wasPlaying && !A.playing && !A.el.ended && Date.now() - lastReact > 4000 && Math.random() < 0.5) { clearTimeout(timer); show(pick(PAUSED), { after: resume }); }
      else if (!wasPlaying && A.playing && Date.now() - lastReact > 4000 && Math.random() < 0.4) { clearTimeout(timer); show(pick(RESUME), { after: resume }); }
      wasPlaying = A.playing;
    });
  };

  S.start = function () {
    if (!box || live) return;
    live = true;
    lastInput = Date.now();
    setTimeout(function () {
      if (Date.now() - lastReact < 2000) return;
      show(pick(visits > 1 ? HELLO_BACK : HELLO_NEW), { after: resume });
    }, 1400);
  };
})();
