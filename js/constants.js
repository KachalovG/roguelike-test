var WIDTH = 40;
var HEIGHT = 24;

var TILE_SIZE = Math.floor(Math.min(1024 / WIDTH, 640 / HEIGHT));

var TILE = {
  WALL: 0,
  FLOOR: 1,
};

var ENTITY = {
  HERO: "P",
  ENEMY: "E",
  POTION: "HP",
  SWORD: "SW",
};

var CLASSMATE = {};
CLASSMATE[TILE.WALL] = "tile tileW";
CLASSMATE[TILE.FLOOR] = "tile";
CLASSMATE[ENTITY.HERO] = "tile tileP";
CLASSMATE[ENTITY.ENEMY] = "tile tileE";
CLASSMATE[ENTITY.POTION] = "tile tileHP";
CLASSMATE[ENTITY.SWORD] = "tile tileSW";
