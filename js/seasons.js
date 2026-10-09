(function () {
  var DW = window.DW, S = (DW.season = { id: '', name: '', trophy: '', forced: false, kind: '', lines: [] });
  var cfg = DW.seasons || {};

  var DAYS = [
    { id: 'valentine', name: '<3 EDITION', from: 214, to: 214, kind: 'hearts', trophy: 'valentine', lines: [
      'happy valentines day. i love you. (platonically. i am a div.)',
      'roses are red, my hex codes are purple, you are looking at a website, and honestly thats perfectly normal.',
      'no date? thats ok. you have me, and this song.'
    ] },
    { id: 'halloween', name: 'SPOOKY EDITION', from: 1029, to: 1031, kind: 'bats', trophy: 'spooky', lines: [
      'happy halloween! i am dressed as a website.',
      'boo! ...did that work? i have no way of seeing your face.',
      'the bats are not part of the bit. they live here now.',
      'trick or treat? i only have text to give.',
      'spooky season. my scariest feature is the visitor counter.'
    ] },
    { id: 'xmas', name: 'MERRY XMAS', from: 1224, to: 1226, kind: 'snow', trophy: 'merry', lines: [
      'merry christmas! i got you nothing. i am a text box.',
      'ho ho ho. that is all the christmas i know.',
      'it is snowing inside the website. dont ask how.',
      'santa is probably checking if you were naughty. i saw nothing.',
      'happy holidays! the lights up top are blinking just for you.'
    ] },
    { id: 'newyear', name: 'HAPPY NEW YEAR', from: 1231, to: 101, kind: 'confetti', trophy: 'newyear', lines: [
      'happy new year! new year, same dweeb.',
      'resolution: say more weird things. already on it.',
      'confetti! it is falling because i said so.'
    ] }
  ];

  var MONTH = [
    ['january. a fresh start. same old me.', 'new year, new playlist. you know the drill.', 'it is cold out there. stay in here with the music.'],
    ['february. the shortest month, and i still have nothing to say.', 'february is for love and for snacks.', 'twenty eight days. i counted. twice.'],
    ['march. spring is coming. i can feel it in my pixels.', 'march madness? i just watch the waves move.', 'long month. you have got this.'],
    ['april. watch out for fools. i am not one. i think.', 'april showers bring may flowers, and a lot of internet.', 'spring cleaning: i just deleted my regrets. oh wait, they are still here.'],
    ['may. warm days, loud songs.', 'may the fourth be with you. (sorry. i had to.)', 'summer is getting close. i can feel it.'],
    ['june. the sun is out. you are not. respect.', 'half the year already? what.', 'summer playlist loading... loaded. it is this one.'],
    ['july. hot out there. the website stays cool.', 'july is for loud songs and cold drinks.', 'peak summer. the waves are extra wavy.'],
    ['august. the last stretch of summer. use it wisely.', 'august: where did the summer go?', 'back to school soon? nope. not here. this is a no homework zone.'],
    ['september. the leaves are thinking about it.', 'september already? time is not real.', 'new season, new songs. i have a good feeling.'],
    ['october. the spooky month. i am already scared.', 'october: sweater weather and loud music.', 'the bats are getting ready. i can hear them.'],
    ['november. almost the end of the year. do not panic.', 'november: dark early, perfect for headphones.', 'i would say something about thanksgiving but i do not eat.'],
    ['december. the end of the year is here!', 'december: cozy music season.', 'is it me or is the year a speedrun?']
  ];

  function val(m, d) { return (m + 1) * 100 + d; }
  function inRange(v, a, b) { return a <= b ? v >= a && v <= b : v >= a || v <= b; }

  S.month = function () { return new Date().getMonth(); };

  S.pool = function () {
    var p = MONTH[S.month()].slice();
    if (S.id) p = S.lines.concat(S.lines, p);
    return p;
  };

  function pick() {
    var q = /[?&]season=([a-z]+)/.exec(location.search), now = new Date(), v = val(now.getMonth(), now.getDate()), i, d;
    if (q) {
      for (i = 0; i < DAYS.length; i++) if (DAYS[i].id === q[1]) { S.forced = true; return DAYS[i]; }
    }
    for (i = 0; i < DAYS.length; i++) {
      d = DAYS[i];
      if (inRange(v, d.from, d.to)) return d;
    }
    return null;
  }

  var parts = [], made = 0, last = 0;
  var COL = ['#de37e4', '#ffd34d', '#5a87d0', '#6cf0a0', '#f3b5f6', '#ffffff'];

  function mk(first, w, h) {
    var k = S.kind, o = { x: Math.random() * w, y: first ? Math.random() * h : -12, ph: Math.random() * 6.28 };
    if (k === 'snow') { o.s = 1.5 + Math.random() * 2; o.vy = 0.35 + Math.random() * 0.6; o.vx = 0; }
    else if (k === 'confetti') { o.s = 3 + Math.random() * 3; o.vy = 0.5 + Math.random() * 0.9; o.col = COL[Math.floor(Math.random() * COL.length)]; }
    else if (k === 'hearts') { o.s = 5 + Math.random() * 5; o.vy = -(0.3 + Math.random() * 0.5); o.y = first ? Math.random() * h : h + 14; }
    else { o.s = 7 + Math.random() * 5; o.vy = 0; o.vx = (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.5); o.y = 60 + Math.random() * (h * 0.6); o.x = first ? Math.random() * w : (o.vx > 0 ? -20 : w + 20); }
    return o;
  }

  function heart(c, x, y, s) {
    c.beginPath();
    c.moveTo(x, y + s * 0.35);
    c.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.2, y - s * 0.9, x, y - s * 0.3);
    c.bezierCurveTo(x + s * 0.2, y - s * 0.9, x + s, y - s * 0.4, x, y + s * 0.35);
    c.fill();
  }
  function bat(c, x, y, s, flap, dir) {
    var f = Math.sin(flap) * s * 0.5;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x - s * dir * 0.2, y - s * 0.25);
    c.lineTo(x - s, y - s * 0.3 + f);
    c.lineTo(x - s * 0.55, y + s * 0.15);
    c.lineTo(x - s * 0.3, y + s * 0.05);
    c.lineTo(x, y + s * 0.3);
    c.lineTo(x + s * 0.3, y + s * 0.05);
    c.lineTo(x + s * 0.55, y + s * 0.15);
    c.lineTo(x + s, y - s * 0.3 + f);
    c.lineTo(x + s * dir * 0.2, y - s * 0.25);
    c.closePath();
    c.fill();
  }

  S.draw = function (c, t, w, h, d) {
    if (!S.kind) return;
    var n = DW.low ? 12 : S.kind === 'bats' ? 7 : S.kind === 'confetti' ? 46 : 32, i, p;
    if (DW.vis && DW.vis.lite) n = n >> 1;
    while (parts.length < n) parts.push(mk(true, w, h));
    for (i = 0; i < n; i++) {
      p = parts[i];
      if (S.kind === 'snow') {
        p.y += p.vy * d; p.x += Math.sin(t / 1400 + p.ph) * 0.4;
        if (p.y > h + 6) parts[i] = p = mk(false, w, h);
        c.globalAlpha = 0.85;
        c.fillStyle = '#ffffff';
        c.fillRect(p.x, p.y, p.s, p.s);
      } else if (S.kind === 'confetti') {
        p.y += p.vy * d; p.x += Math.sin(t / 900 + p.ph) * 0.6;
        if (p.y > h + 8) parts[i] = p = mk(false, w, h);
        c.globalAlpha = 0.9;
        c.fillStyle = p.col;
        c.fillRect(p.x, p.y, p.s, p.s * (0.5 + 0.5 * Math.abs(Math.sin(t / 300 + p.ph))));
      } else if (S.kind === 'hearts') {
        p.y += p.vy * d; p.x += Math.sin(t / 1100 + p.ph) * 0.5;
        if (p.y < -16) parts[i] = p = mk(false, w, h);
        c.globalAlpha = 0.7;
        c.fillStyle = '#de37e4';
        heart(c, p.x, p.y, p.s);
      } else {
        p.x += p.vx * d * 1.6; p.y += Math.sin(t / 500 + p.ph) * 0.5;
        if (p.x < -30 || p.x > w + 30) parts[i] = p = mk(false, w, h);
        c.globalAlpha = 0.8;
        c.fillStyle = '#1d041e';
        bat(c, p.x, p.y, p.s, t / 90 + p.ph, p.vx > 0 ? 1 : -1);
      }
    }
    c.globalAlpha = 1;
  };

  S.init = function () {
    if (cfg.on === false) return;
    var d = pick();
    if (!d) return;
    S.id = d.id; S.name = d.name; S.trophy = d.trophy; S.kind = d.kind; S.lines = d.lines;
    document.body.classList.add('s-' + d.id);
    var small = document.querySelector('#sysname small');
    if (small) small.textContent = d.name;
  };
})();
