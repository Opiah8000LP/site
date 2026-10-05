window.DW = window.DW || {};
var DW = window.DW;

DW.siteName = 'DWEEB PRODUCTIONS';

DW.low = matchMedia('(max-width: 700px), (pointer: coarse)').matches;

DW.respectReducedMotion = false;
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
  'music1.mp3': { title: 'JAMS!', artist: 'issbrokie', album: 'Single / 2024' },
  'music2.mp3': { title: 'DANCE', artist: 'RomancePlanet', album: 'Single / 2024' },
  'music3.mp3': { title: 'JENNI', artist: 'Yung Kage, Softwilly', album: 'Single / 2022' },
  'music4.mp3': { title: 'tbh i dont like being social', artist: 'luvlxckdown', album: 'Single / 2020' }
};
DW.defaultArtist = '';

