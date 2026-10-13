/* maybe later.
   ideas that are definitely happening (they are not):
   - a button that does nothing but feels important
   - the site tells you the weather. badly
   - dark mode (the site is already purple. what more do you want)
   - multiplayer (for what)
   - a shop. (selling what. air.)
*/
var maybeLater = {
  weather: function () { return 'it is probably weather outside'; },
  shop: function () { return []; },
  multiplayer: function () { throw new Error('there is only me'); },
  darkMode: false
};

if (maybeLater.darkMode) {
  // this has never run and it never will
  document.body.style.filter = 'invert(1) hue-rotate(180deg)';
}
