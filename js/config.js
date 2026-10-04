window.DW = window.DW || {};
var DW = window.DW;

DW.siteName = 'DWEEB PRODUCTIONS';

DW.low = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
DW.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (DW.low) document.documentElement.classList.add('low');

DW.counter = { code: '', skipKey: 'dweeb-skip' };

DW.menu = [
  { id: 'identity', subs: {
    about: '', bio: '', values: '', philosophy: '', personality: '', goals: '', manifesto: ''
  } },
  { id: 'work', subs: {
    projects: '', portfolio: '', art: '', music: '', writing: '', code: '', videos: '', archive: ''
  } },
  { id: 'preferences', subs: {
    favorites: '', tastes: '', likes: '', dislikes: '', stack: '', playlist: '', media: ''
  } },
  { id: 'thoughts', subs: {
    opinions: '', essays: '', notes: '', reviews: '', quotes: '', lore: ''
  } },
  { id: 'interests', subs: {
    games: '', reading: '', ideas: '', music: ''
  } },
  { id: 'wants', subs: {
    wishlist: '', inspiration: ''
  } },
  { id: 'info', subs: {
    faq: '', stats: '', contact: '', colophon: ''
  } }
];

DW.intro = { src: 'video/intro.mp4', gate: true, skip: true };

DW.playlist = {
  'music1.mp3': 'JAMS!'
};
DW.tracks = Object.keys(DW.playlist).map(function (f) {
  var v = DW.playlist[f], o = typeof v === 'string' ? { title: v } : v;
  return { file: /\./.test(f) ? f : f + '.mp3', title: o.title || f, artist: o.artist };
});

DW.react = {
  master: 1,
  sensitivity: 1,
  bands: { bass: [35, 140], mid: [140, 2200], high: [2500, 9000] },
  icon:  { scale: 0.08,  rot: 2.4, shift: 4, breathe: 0.015 },
  sub:   { scale: 0.06,  rot: 3.2, shift: 3, breathe: 0.01 },
  cover: { scale: 0.07,  rot: 2,   shift: 0, breathe: 0 },
  bg:    { scale: 0.012, rot: 0,   shift: 0, breathe: 0.006 },
  glow:  { base: 0.45, pulse: 0.4 },
  particles: 1
};
