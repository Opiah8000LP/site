(function () {
  var DW = window.DW, G = DW.games, P = G.pal;

  function text(c, s, x, y, size, col, align) {
    c.font = 'bold ' + size + 'px Tahoma, Verdana, sans-serif';
    c.textAlign = align || 'left';
    c.textBaseline = 'top';
    c.fillStyle = col || '#fff';
    c.fillText(s, x, y);
  }

  G.add({
    id: 'snake', name: 'SNAKE', blurb: 'eat the apples. dont bite yourself.', w: 320, h: 320, swipe: true,
    help: 'ARROWS / WASD to turn. swipe on a phone. P pauses.',
    make: function (env) {
      var N = 20, C = 16, snake, dir, queue, food, score, acc, over;
      function spawn() {
        var ok, f;
        do {
          f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
          ok = !snake.some(function (s) { return s.x === f.x && s.y === f.y; });
        } while (!ok);
        food = f;
      }
      function reset() {
        snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        dir = { x: 1, y: 0 };
        queue = [];
        score = 0;
        acc = 0;
        over = false;
        spawn();
        env.hud('APPLES ' + score, 'BEST ' + env.best());
      }
      function begin() {
        reset();
        env.clear();
        env.start();
        env.played();
      }
      function step() {
        if (queue.length) dir = queue.shift();
        var h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || snake.some(function (s, i) { return i < snake.length - 1 && s.x === h.x && s.y === h.y; })) return die();
        snake.unshift(h);
        if (h.x === food.x && h.y === food.y) {
          score++;
          if (score >= 15) env.award('snake15');
          env.hud('APPLES ' + score, 'BEST ' + Math.max(env.best(), score));
          spawn();
        } else snake.pop();
      }
      function die() {
        over = true;
        env.end();
        var nb = env.report(score);
        env.hud('APPLES ' + score, 'BEST ' + env.best());
        env.say('GAME OVER', score + ' apples' + (nb && score ? '  -  NEW BEST!' : ''), 'PLAY AGAIN', begin);
      }
      function draw(c) {
        c.fillStyle = P.bg;
        c.fillRect(0, 0, 320, 320);
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
          if ((x + y) & 1) { c.fillStyle = P.bg2; c.fillRect(x * C, y * C, C, C); }
        }
        if (!snake) return;
        G.bevel(c, food.x * C + 2, food.y * C + 2, C - 4, C - 4, P.pk);
        snake.forEach(function (s, i) { G.bevel(c, s.x * C + 1, s.y * C + 1, C - 2, C - 2, i ? P.p2 : P.p3); });
        var h = snake[0];
        c.fillStyle = P.ink;
        c.fillRect(h.x * C + 4 + dir.x * 2, h.y * C + 4 + dir.y * 2, 3, 3);
        c.fillRect(h.x * C + 9 + dir.x * 2, h.y * C + 9 + dir.y * 2, 3, 3);
      }
      return {
        start: function () { reset(); env.say('SNAKE', 'press ENTER or tap to start', 'START', begin); },
        draw: draw,
        frame: function (dt, c) {
          if (!over && snake && !env.paused) {
            acc += dt * 1000;
            var ms = Math.max(65, 135 - score * 3);
            while (acc >= ms) { acc -= ms; if (!over) step(); }
          }
          draw(c);
        },
        key: function (k, down) {
          if (!down) return;
          var d = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[k];
          if (!d || over || !snake) return;
          var ref = queue.length ? queue[queue.length - 1] : dir;
          if (d[0] === -ref.x && d[1] === -ref.y) return;
          if (d[0] === ref.x && d[1] === ref.y) return;
          if (queue.length < 2) queue.push({ x: d[0], y: d[1] });
        }
      };
    }
  });

  G.add({
    id: 'pong', name: 'PONG', blurb: 'first to 5 beats the cpu.', w: 320, h: 240, bestLabel: 'BEST LEAD',
    help: 'UP / DOWN or W / S to move. drag on a phone. P pauses.',
    make: function (env) {
      var py, cy, bx, by, vx, vy, sp, ms, mc, wait, over, held = { up: 0, down: 0 }, aim, ptr = null;
      var PH = 40, PW = 6, B = 6;
      function serve(dir) {
        bx = 160; by = 120;
        sp = 170;
        var a = (Math.random() - 0.5) * 0.7;
        vx = Math.cos(a) * sp * dir;
        vy = Math.sin(a) * sp;
        wait = 0.9;
        aim = 0;
      }
      function reset() {
        py = 100; cy = 100; ms = 0; mc = 0; over = false;
        serve(Math.random() < 0.5 ? 1 : -1);
        hud();
      }
      function hud() { env.hud('YOU ' + ms + '  :  ' + mc + ' CPU', 'BEST LEAD ' + env.best()); }
      function begin() { reset(); env.clear(); env.start(); env.played(); }
      function point(me) {
        if (me) ms++; else mc++;
        hud();
        if (ms >= 5 || mc >= 5) {
          over = true;
          env.end();
          var win = ms > mc;
          if (win) { env.award('pongwin'); env.report(ms - mc); hud(); }
          env.say(win ? 'YOU WIN' : 'CPU WINS', ms + ' - ' + mc, 'REMATCH', begin);
          return;
        }
        serve(me ? -1 : 1);
      }
      function hit(paddleY, left) {
        var rel = (by + B / 2 - (paddleY + PH / 2)) / (PH / 2);
        rel = Math.max(-1, Math.min(1, rel));
        sp = Math.min(360, sp * 1.06);
        var a = rel * 0.95;
        vx = Math.cos(a) * sp * (left ? 1 : -1);
        vy = Math.sin(a) * sp;
        if (!left) aim = (Math.random() - 0.5) * 26;
      }
      function draw(c) {
        c.fillStyle = P.bg;
        c.fillRect(0, 0, 320, 240);
        c.fillStyle = P.grid;
        for (var y = 0; y < 240; y += 14) c.fillRect(159, y, 2, 8);
        if (py == null) return;
        G.bevel(c, 12, py, PW, PH, P.p3);
        G.bevel(c, 302, cy, PW, PH, P.pk);
        G.bevel(c, bx, by, B, B, '#fff');
        text(c, String(ms), 130, 10, 22, P.p3, 'center');
        text(c, String(mc), 190, 10, 22, P.pk, 'center');
      }
      return {
        start: function () { reset(); env.say('PONG', 'press ENTER or tap to start', 'START', begin); },
        draw: draw,
        frame: function (dt, c) {
          if (!over && py != null && !env.paused) {
            var dir = (held.down ? 1 : 0) - (held.up ? 1 : 0);
            if (ptr != null) py += Math.max(-420 * dt, Math.min(420 * dt, ptr - PH / 2 - py));
            else py += dir * 240 * dt;
            py = Math.max(0, Math.min(240 - PH, py));
            var ta = vx > 0 ? by + B / 2 + aim : 120;
            var d = ta - (cy + PH / 2), mx = (vx > 0 ? 150 : 90) * dt;
            cy += Math.max(-mx, Math.min(mx, d));
            cy = Math.max(0, Math.min(240 - PH, cy));
            if (wait > 0) wait -= dt;
            else {
              bx += vx * dt; by += vy * dt;
              if (by < 0) { by = 0; vy = Math.abs(vy); }
              if (by > 240 - B) { by = 240 - B; vy = -Math.abs(vy); }
              if (vx < 0 && bx <= 12 + PW && bx >= 6 && by + B >= py && by <= py + PH) { bx = 12 + PW; hit(py, true); }
              if (vx > 0 && bx + B >= 302 && bx + B <= 312 && by + B >= cy && by <= cy + PH) { bx = 302 - B; hit(cy, false); }
              if (bx < -B) point(false);
              else if (bx > 320) point(true);
            }
          }
          draw(c);
        },
        key: function (k, down) {
          if (k === 'up' || k === 'down') { held[k] = down ? 1 : 0; if (down) ptr = null; }
        },
        pointer: function (t, x, y) { if (t === 'up') ptr = null; else ptr = y; },
        stop: function () { held.up = held.down = 0; ptr = null; }
      };
    }
  });

  var SHAPES = {
    I: [[0, 1], [1, 1], [2, 1], [3, 1]], O: [[1, 0], [2, 0], [1, 1], [2, 1]], T: [[1, 0], [0, 1], [1, 1], [2, 1]],
    S: [[1, 0], [2, 0], [0, 1], [1, 1]], Z: [[0, 0], [1, 0], [1, 1], [2, 1]], J: [[0, 0], [0, 1], [1, 1], [2, 1]], L: [[2, 0], [0, 1], [1, 1], [2, 1]]
  };
  var TCOL = { I: '#6fe3ff', O: '#ffd34d', T: '#c58cff', S: '#6cf0a0', Z: '#ff6b8e', J: '#7a8bff', L: '#ff9a5c' };

  G.add({
    id: 'tetris', name: 'TETRIS', blurb: 'stack the blocks, clear the lines.', w: 240, h: 320,
    help: 'LEFT / RIGHT move, DOWN drops faster, UP or X rotate, Z rotates back, SPACE slams. P pauses.',
    pad: [['left', '◀', 1], ['right', '▶', 1], ['down', '▼', 1], ['b', '↶'], ['a', '↷'], ['drop', 'DROP']],
    make: function (env) {
      var W = 10, H = 20, S = 16, grid, piece, next, bag, score, lines, level, acc, over;
      function refill() {
        bag = Object.keys(SHAPES);
        for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = bag[i]; bag[i] = bag[j]; bag[j] = t; }
      }
      function draw1() { if (!bag || !bag.length) refill(); return bag.pop(); }
      function spawn() {
        var t = next || draw1();
        next = draw1();
        piece = { t: t, c: SHAPES[t].map(function (b) { return [b[0], b[1]]; }), x: 3, y: 0, size: t === 'I' ? 4 : t === 'O' ? 4 : 3 };
        if (collide(piece.c, piece.x, piece.y)) {
          over = true;
          env.end();
          var nb = env.report(score);
          env.hud('SCORE ' + score, 'BEST ' + env.best());
          env.say('GAME OVER', score + ' points, ' + lines + ' lines' + (nb && score ? '  -  NEW BEST!' : ''), 'PLAY AGAIN', begin);
        }
      }
      function collide(cells, x, y) {
        for (var i = 0; i < cells.length; i++) {
          var cx = cells[i][0] + x, cy = cells[i][1] + y;
          if (cx < 0 || cx >= W || cy >= H) return true;
          if (cy >= 0 && grid[cy][cx]) return true;
        }
        return false;
      }
      function rotate(dir) {
        if (piece.t === 'O') return;
        var n = piece.size, cells = piece.c.map(function (b) { return dir > 0 ? [n - 1 - b[1], b[0]] : [b[1], n - 1 - b[0]]; });
        var kicks = [0, -1, 1, -2, 2];
        for (var i = 0; i < kicks.length; i++) {
          if (!collide(cells, piece.x + kicks[i], piece.y)) { piece.c = cells; piece.x += kicks[i]; return; }
        }
      }
      function move(dx) { if (!collide(piece.c, piece.x + dx, piece.y)) piece.x += dx; }
      function lock() {
        piece.c.forEach(function (b) { var y = b[1] + piece.y; if (y >= 0) grid[y][b[0] + piece.x] = piece.t; });
        var cleared = 0;
        for (var y = H - 1; y >= 0; y--) {
          if (grid[y].every(Boolean)) { grid.splice(y, 1); grid.unshift(new Array(W).fill(0)); cleared++; y++; }
        }
        if (cleared) {
          lines += cleared;
          score += [0, 100, 300, 500, 800][cleared] * level;
          level = Math.floor(lines / 10) + 1;
          if (lines >= 10) env.award('tetris10');
        }
        env.hud('SCORE ' + score, 'LINES ' + lines + '  LV ' + level);
        spawn();
      }
      function drop1() {
        if (!collide(piece.c, piece.x, piece.y + 1)) { piece.y++; return true; }
        lock();
        return false;
      }
      function reset() {
        grid = [];
        for (var i = 0; i < H; i++) grid.push(new Array(W).fill(0));
        bag = null; next = null; score = 0; lines = 0; level = 1; acc = 0; over = false;
        spawn();
        env.hud('SCORE 0', 'LINES 0  LV 1');
      }
      function begin() { reset(); env.clear(); env.start(); env.played(); }
      function ghostY() { var y = piece.y; while (!collide(piece.c, piece.x, y + 1)) y++; return y; }
      function draw(c) {
        c.fillStyle = P.bg;
        c.fillRect(0, 0, 240, 320);
        c.fillStyle = P.bg2;
        c.fillRect(0, 0, 160, 320);
        c.fillStyle = P.grid;
        for (var i = 1; i < W; i++) c.fillRect(i * S, 0, 1, 320);
        for (var j = 1; j < H; j++) c.fillRect(0, j * S, 160, 1);
        c.fillRect(160, 0, 2, 320);
        if (!grid) return;
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (grid[y][x]) G.bevel(c, x * S, y * S, S, S, TCOL[grid[y][x]]);
        if (piece && !over) {
          var gy = ghostY();
          c.fillStyle = 'rgba(255,255,255,.14)';
          piece.c.forEach(function (b) { c.fillRect((b[0] + piece.x) * S, (b[1] + gy) * S, S, S); });
          piece.c.forEach(function (b) { if (b[1] + piece.y >= 0) G.bevel(c, (b[0] + piece.x) * S, (b[1] + piece.y) * S, S, S, TCOL[piece.t]); });
        }
        text(c, 'NEXT', 200, 10, 11, P.p3, 'center');
        if (next) SHAPES[next].forEach(function (b) { G.bevel(c, 176 + b[0] * 12 + (next === 'I' ? 0 : 6), 34 + b[1] * 12, 12, 12, TCOL[next]); });
        text(c, 'SCORE', 200, 100, 11, P.p3, 'center');
        text(c, String(score), 200, 116, 14, '#fff', 'center');
        text(c, 'LINES', 200, 150, 11, P.p3, 'center');
        text(c, String(lines), 200, 166, 14, '#fff', 'center');
        text(c, 'LEVEL', 200, 200, 11, P.p3, 'center');
        text(c, String(level), 200, 216, 14, '#fff', 'center');
      }
      return {
        start: function () { reset(); env.say('TETRIS', 'press ENTER or tap to start', 'START', begin); },
        draw: draw,
        frame: function (dt, c) {
          if (!over && piece && !env.paused) {
            acc += dt * 1000;
            var ms = Math.max(70, 800 * Math.pow(0.85, level - 1));
            while (acc >= ms && !over) { acc -= ms; drop1(); }
          }
          draw(c);
        },
        key: function (k, down) {
          if (!down || over || !piece) return;
          if (k === 'left') move(-1);
          else if (k === 'right') move(1);
          else if (k === 'down') { if (drop1()) score += 1; acc = 0; }
          else if (k === 'up' || k === 'a') rotate(1);
          else if (k === 'b') rotate(-1);
          else if (k === 'drop') { var n = 0; while (!collide(piece.c, piece.x, piece.y + 1)) { piece.y++; n++; } score += n * 2; lock(); acc = 0; }
        }
      };
    }
  });

  G.add({
    id: 'breakout', name: 'BREAKOUT', blurb: 'bounce the ball, smash the wall.', w: 320, h: 240,
    help: 'LEFT / RIGHT or drag to move. SPACE or tap launches the ball. P pauses.',
    make: function (env) {
      var bricks, px, ball, lives, score, level, over, held = { left: 0, right: 0 }, stuck, ptr = null, PW = 48, cleared = false;
      var ROW = ['#ff6bd6', '#ff9a8a', '#ffd34d', '#6cf0a0', '#6fe3ff', '#a56bff'];
      function build() {
        bricks = [];
        var rows = Math.min(8, 5 + level);
        for (var r = 0; r < rows; r++) for (var c = 0; c < 10; c++) bricks.push({ x: 10 + c * 30, y: 28 + r * 12, w: 28, h: 10, col: ROW[r % ROW.length], pts: (rows - r) * 5 });
      }
      function ready() {
        stuck = true;
        ball = { x: px + PW / 2, y: 222 - 3, vx: 0, vy: 0, r: 3 };
      }
      function launch() {
        if (!stuck) return;
        stuck = false;
        var sp = 185 + level * 12, a = (Math.random() * 0.8 - 0.4);
        ball.vx = Math.sin(a) * sp;
        ball.vy = -Math.cos(a) * sp;
      }
      function hud() { env.hud('SCORE ' + score + '   LIVES ' + lives, 'BEST ' + Math.max(env.best(), score)); }
      function reset() { px = 136; lives = 3; score = 0; level = 1; over = false; build(); ready(); hud(); }
      function begin() { reset(); env.clear(); env.start(); env.played(); }
      function lose() {
        lives--;
        hud();
        if (lives <= 0) {
          over = true;
          env.end();
          var nb = env.report(score);
          hud();
          env.say('GAME OVER', score + ' points' + (nb && score ? '  -  NEW BEST!' : ''), 'PLAY AGAIN', begin);
        } else ready();
      }
      function stepBall(dt) {
        var n = Math.ceil(Math.hypot(ball.vx, ball.vy) * dt / 3) || 1, i, k;
        for (i = 0; i < n; i++) {
          ball.x += ball.vx * dt / n;
          ball.y += ball.vy * dt / n;
          if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
          if (ball.x > 320 - ball.r) { ball.x = 320 - ball.r; ball.vx = -Math.abs(ball.vx); }
          if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }
          if (ball.vy > 0 && ball.y + ball.r >= 222 && ball.y - ball.r <= 228 && ball.x >= px - 2 && ball.x <= px + PW + 2) {
            var rel = (ball.x - (px + PW / 2)) / (PW / 2), sp = Math.min(380, Math.hypot(ball.vx, ball.vy) * 1.015), a = rel * 1.05;
            ball.vx = Math.sin(a) * sp;
            ball.vy = -Math.cos(a) * sp;
            ball.y = 222 - ball.r;
          }
          for (k = 0; k < bricks.length; k++) {
            var b = bricks[k];
            if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
              var ox = Math.min(ball.x + ball.r - b.x, b.x + b.w - (ball.x - ball.r)), oy = Math.min(ball.y + ball.r - b.y, b.y + b.h - (ball.y - ball.r));
              if (ox < oy) ball.vx = -ball.vx; else ball.vy = -ball.vy;
              bricks.splice(k, 1);
              score += b.pts;
              hud();
              break;
            }
          }
          if (!bricks.length) {
            env.award('breakout');
            level++;
            build();
            ready();
            return;
          }
          if (ball.y > 244) { lose(); return; }
        }
      }
      function draw(c) {
        c.fillStyle = P.bg;
        c.fillRect(0, 0, 320, 240);
        if (!bricks) return;
        bricks.forEach(function (b) { G.bevel(c, b.x, b.y, b.w, b.h, b.col); });
        G.bevel(c, px, 222, PW, 6, P.p3);
        G.bevel(c, ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2, '#fff');
        if (stuck && !over) text(c, 'SPACE / TAP TO LAUNCH', 160, 150, 10, P.p3, 'center');
      }
      return {
        start: function () { reset(); env.say('BREAKOUT', 'press ENTER or tap to start', 'START', begin); },
        draw: draw,
        frame: function (dt, c) {
          if (!over && bricks && !env.paused) {
            var d = (held.right ? 1 : 0) - (held.left ? 1 : 0);
            if (ptr != null) px += Math.max(-520 * dt, Math.min(520 * dt, ptr - PW / 2 - px));
            else px += d * 260 * dt;
            px = Math.max(0, Math.min(320 - PW, px));
            if (stuck) ball.x = px + PW / 2;
            else stepBall(dt);
          }
          draw(c);
        },
        key: function (k, down) {
          if (k === 'left' || k === 'right') { held[k] = down ? 1 : 0; if (down) ptr = null; }
          else if (down && (k === 'drop' || k === 'up' || k === 'a')) launch();
        },
        pointer: function (t, x) { if (t === 'up') { ptr = null; return; } ptr = x; if (t === 'down') launch(); },
        stop: function () { held.left = held.right = 0; ptr = null; }
      };
    }
  });

  G.add({
    id: 'g2048', name: '2048', blurb: 'slide and merge the numbers.', w: 320, h: 320, swipe: true, autopause: false,
    help: 'ARROWS / WASD slide the tiles. swipe on a phone. merge two equal tiles.',
    make: function (env) {
      var T, score, over, won;
      var COL = { 0: '#2a0b60', 2: '#d9bcff', 4: '#c58cff', 8: '#a56bff', 16: '#8a4bff', 32: '#ff9be6', 64: '#ff6bd6', 128: '#ffd34d', 256: '#ffb83a', 512: '#6cf0a0', 1024: '#6fe3ff', 2048: '#ffffff' };
      function empty() {
        var e = [];
        T.forEach(function (row, y) { row.forEach(function (v, x) { if (!v) e.push([x, y]); }); });
        return e;
      }
      function add() {
        var e = empty();
        if (!e.length) return;
        var p = e[Math.floor(Math.random() * e.length)];
        T[p[1]][p[0]] = Math.random() < 0.9 ? 2 : 4;
      }
      function reset() {
        T = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        score = 0; over = false; won = false;
        add(); add();
        hud();
      }
      function hud() { env.hud('SCORE ' + score, 'BEST ' + Math.max(env.best(), score)); }
      function slideRow(r) {
        var a = r.filter(Boolean), out = [], i, gain = 0;
        for (i = 0; i < a.length; i++) {
          if (a[i] === a[i + 1]) { out.push(a[i] * 2); gain += a[i] * 2; i++; }
          else out.push(a[i]);
        }
        while (out.length < 4) out.push(0);
        return { row: out, gain: gain };
      }
      function canMove() {
        if (empty().length) return true;
        for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
          if (x < 3 && T[y][x] === T[y][x + 1]) return true;
          if (y < 3 && T[y][x] === T[y + 1][x]) return true;
        }
        return false;
      }
      function begin() { reset(); env.clear(); env.start(); env.played(); draw(env.ctx); }
      function move(dir) {
        var before = JSON.stringify(T), y, x, r, res, gain = 0;
        for (var i = 0; i < 4; i++) {
          if (dir === 'left' || dir === 'right') {
            r = T[i].slice();
            if (dir === 'right') r.reverse();
            res = slideRow(r);
            if (dir === 'right') res.row.reverse();
            T[i] = res.row;
          } else {
            r = [T[0][i], T[1][i], T[2][i], T[3][i]];
            if (dir === 'down') r.reverse();
            res = slideRow(r);
            if (dir === 'down') res.row.reverse();
            for (y = 0; y < 4; y++) T[y][i] = res.row[y];
          }
          gain += res.gain;
        }
        if (JSON.stringify(T) === before) return;
        score += gain;
        add();
        var max = 0;
        for (y = 0; y < 4; y++) for (x = 0; x < 4; x++) if (T[y][x] > max) max = T[y][x];
        if (max >= 512) env.award('fivetwelve');
        if (max >= 2048) { env.award('twentyfortyeight'); if (!won) { won = true; DW.toast('2048! keep going if you want'); } }
        hud();
        if (!canMove()) {
          over = true;
          env.end();
          var nb = env.report(score);
          hud();
          env.say('NO MOVES LEFT', score + ' points' + (nb && score ? '  -  NEW BEST!' : ''), 'PLAY AGAIN', begin);
        } else env.report(score);
        draw(cx);
      }
      var cx = null;
      function draw(c) {
        if (!c) return;
        cx = c;
        c.fillStyle = P.bg;
        c.fillRect(0, 0, 320, 320);
        if (!T) return;
        for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
          var v = T[y][x], px = 8 + x * 76, py = 8 + y * 76;
          G.bevel(c, px, py, 70, 70, COL[v] || '#fff');
          if (v) text(c, String(v), px + 35, py + 35 - (v > 999 ? 9 : 12), v > 999 ? 20 : v > 99 ? 26 : 32, v < 8 ? P.ink : '#fff', 'center');
        }
      }
      return {
        start: function () { reset(); env.say('2048', 'press ENTER or tap to start', 'START', begin); draw(env.ctx); },
        draw: draw,
        key: function (k, down) {
          if (!down || over || !T) return;
          if (k === 'left' || k === 'right' || k === 'up' || k === 'down') move(k);
        }
      };
    }
  });
})();
