(function () {
  var DW = window.DW;

  var D = {
    master: 1,
    sensitivity: 1,
    bands: { bass: [35, 140], mid: [140, 2200], high: [2500, 9000] },

    icon:    { scale: 0.10, rot: 2.6, shift: 4,   breathe: 0.02,  sway: 1,   kick: 1,   hat: 0 },              // category icon
    cats:    { scale: 0.06, rot: 1.8, shift: 3,   breathe: 0.012, sway: 1,   kick: 1,   hat: 0.2, ripple: 70 }, // the other category icons
    catname: { scale: 0.05, rot: 0,   shift: 1.5, breathe: 0,     sway: 0.5, kick: 1,   hat: 0 },              // category title
    sub:     { scale: 0.08, rot: 3.2, shift: 3,   breathe: 0.015, sway: 1,   kick: 0.6, hat: 1 },              // selected item
    subs:    { scale: 0.06, rot: 2.4, shift: 2.5, breathe: 0.01,  sway: 1,   kick: 0.7, hat: 0.8, ripple: 55 }, // other item
    names:   { scale: 0.04, rot: 0,   shift: 3,   breathe: 0.01,  sway: 0.6, kick: 0.8, hat: 0.6, ripple: 55 }, // item text
    top:     { scale: 0.04, rot: 0,   shift: 1.5, breathe: 0,     sway: 0.5, kick: 0.8, hat: 0.4, ripple: 80 }, // top bar
    cover:   { scale: 0.08, rot: 2,   shift: 0,   breathe: 0.01,  sway: 0.6, kick: 1,   hat: 0 },              // album cover
    play:    { scale: 0.10, rot: 0,   shift: 0,   breathe: 0,     sway: 0,   kick: 1,   hat: 0 },              // play button
    pbtn:    { scale: 0.08, rot: 0,   shift: 0,   breathe: 0,     sway: 0,   kick: 0,   hat: 1,   ripple: 60 }, // other player buttons

    speed: { tempo: 1.2, energy: 2 },

    wave: { speed: 3, surge: 5, amp: [0.30, 0.22, 0.16], idle: 1 },

    glow: { base: 0.45, pulse: 0.4 },
    particles: 1
  };

  function merge(a, b) {
    for (var k in b) {
      if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) a[k] = merge(a[k] || {}, b[k]);
      else a[k] = b[k];
    }
    return a;
  }
  DW.react = merge(D, DW.react || {});
})();
