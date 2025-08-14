(function () {
  "use strict";

  window.randInt = function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  window.xyToIndex = function xyToIndex(x, y, width) {
    return y * width + x;
  };
  window.indexToXY = function indexToXY(index, width) {
    return {
      x: index % width,
      y: Math.floor(index / width),
    };
  };

  window.inBounds = function inBounds(x, y, height, width) {
    return x >= 0 && y >= 0 && x < width && y < height;
  };
})();
