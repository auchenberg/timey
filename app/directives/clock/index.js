module.exports = function() {
  return {
    templateUrl: 'directives/clock/clock.html',
    link: function($scope, $element, attr) {
      drawHands($element)

      setInterval(function() {
        drawHands($element);
      }, 1000)
    }
  }
}

function drawHands(elmTarget) {
  // Constants for hand's sizes.
  var SECONDS_HAND_SIZE = 0.65,
  MINUTES_HAND_SIZE = 0.55,
  HOURS_HAND_SIZE = 0.40;

  var circle = document.querySelector(".edge");

  // Clock Circle's Properties
  var r = circle.getAttribute('r'),
  cx = parseInt(circle.getAttribute('cx')),
  cy = parseInt(circle.getAttribute('cy'));

  // Current time.
  var currentTime = new Date();

  window.requestAnimationFrame(function() {

    // Draw Hands
    drawHand(document.querySelector(".second"),
      currentTime.getSeconds(),
      SECONDS_HAND_SIZE,
    6, r);

    drawHand(document.querySelector(".minute"),
      currentTime.getMinutes(),
      MINUTES_HAND_SIZE,
    6, r);

    drawHand(document.querySelector(".hour"),
      currentTime.getHours(),
      HOURS_HAND_SIZE,
    30, r);

  })

  function drawHand(hand, value, size, degrees, r) {
    var deg = degrees * value;
    x2 = getX(deg, r, size, cx),
    y2 = getY(deg, r, size, cy);

    hand.setAttribute('x1', cx);
    hand.setAttribute('y1', cy);
    hand.setAttribute('x2', x2);
    hand.setAttribute('y2', y2);
  }
};

function getX(degrees, r, adjust, x) {
  var x = x || r,
  adj = adjust || 1;
  return x + r * adj * Math.cos(getRad(degrees));
}

function getY(degrees, r, adjust, y) {
  var y = y || r,
  adj = adjust || 1;
  return y + r * adj * Math.sin(getRad(degrees));
}

function getRad(degrees) {
  var adjust = Math.PI / 2;
  return (degrees * Math.PI / 180) - adjust;
}
