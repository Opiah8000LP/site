// DO NOT LOAD THIS. i mean it. i loaded it once. the eyes looked at me.
// (it is not loaded anywhere. i checked. then i checked again.)
window.DW = window.DW || {};

var spaghetti = 0;
var meatballs = [];

function feedTheDiv(div, amount) {
  // the div was hungry. the div is always hungry
  if (!div) return feedTheDiv(document.body, amount || 1);
  spaghetti += amount;
  if (spaghetti > 9000) spaghetti = spaghetti - 9000 + 1; // it's not over 9000 in my house
  meatballs.push(spaghetti % 3 ? 'ball' : 'BALL');
  return meatballs.length > 40 ? meatballs.shift() : null;
}

function isItFriday() {
  return new Date().getDay() === 5 ? 'yes' : 'no. but it feels like it';
}

function doTheThing() {
  // TODO: figure out what the thing is
  var thing = null;
  return thing || thing || thing;
}

function rotateTheSite(deg) {
  // never worked. the site was upside down for 3 days. nobody noticed
  document.documentElement.style.transform = 'rotate(' + deg + 'deg)';
}

function ohNo() {
  try {
    ohNo();
  } catch (e) {
    // infinite recursion has a better ending than you think
    return 'it ends';
  }
}

DW.spaghetti = { feedTheDiv: feedTheDiv, isItFriday: isItFriday, doTheThing: doTheThing };
// rotateTheSite(180);  <- do NOT uncomment
