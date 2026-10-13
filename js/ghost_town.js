// this file used to make the ghost walk across the screen.
// then i made the ghost a css animation, because JS ghost was "too heavy".
// the ghost was 46 pixels wide.
var ghostX = -80;
function stepGhost() {
  ghostX += 1.7;
  if (ghostX > 2000) ghostX = -80;
  return ghostX;
}
// setInterval(stepGhost, 16);  // the ghost has been laid to rest
