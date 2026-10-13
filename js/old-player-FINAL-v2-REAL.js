// the original music player. before the good one.
// it had ONE button and the button played a sound of a duck. (the duck was a placeholder. it stayed.)
// kept for sentimental reasons. also i am scared to delete it, something might depend on it
(function () {
  var duck = null;
  var presses = 0;

  function quack() {
    presses++;
    if (!duck) duck = new Audio('audio/duck-final-REAL-use-this-one.mp3');
    duck.currentTime = 0;
    duck.play();
    if (presses === 69) alert('nice'); // yes i was 14 when i wrote this. no i am not changing it
  }

  function init() {
    var b = document.getElementById('the-only-button');
    if (!b) return; // the button was removed in v0.0.3 and the code was NOT
    b.addEventListener('click', quack);
  }

  // window.addEventListener('load', init);   <-- commented out because of "the incident"
})();
