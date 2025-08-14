(function () {
  "use strict";
  window.Game = function Game() {
    this.width = WIDTH;
    this.height = HEIGHT;
    this.tiles = new Array(this.width * this.height);
    this.rooms = [];
    this.hero = null;
    this.enemies = [];
    this.potions = [];
    this.swords = [];
    this.portal = null;
  };
  Game.prototype.init = function () {
    for (var i = 0; i < this.tiles.length; i++) {
      this.tiles[i] = TILE.WALL;
    }
    this.generateRooms();
    this.connectRooms();
    this.addRandomCorridors();
    this.placeHero();
    this.placeEnemies(10);
    this.placeItems();
    this.bindInput();
    render(this);
  };

  Game.prototype.generateRooms = function () {
    var roomCount = randInt(5, 10);
    var tries = 0;
    var maxTries = 200;
    while (this.rooms.length < roomCount && tries < maxTries) {
      tries++;
      var w = randInt(3, 8);
      var h = randInt(3, 8);

      var x = randInt(1, this.width - w - 2);
      var y = randInt(1, this.height - h - 2);

      var room = { x: x, y: y, w: w, h: h };

      if (!this._intersectsAny(room, 1)) {
        this._carveRect(x, y, w, h, TILE.FLOOR);
        room.cx = Math.floor(x + w / 2);
        room.cy = Math.floor(y + h / 2);

        this.rooms.push(room);
      }
    }
    console.log(this.rooms);
  };

  Game.prototype._carveRect = function (x, y, w, h, tileType) {
    for (var i = y; i < y + h; i++) {
      for (var j = x; j < x + w; j++) {
        var idx = i * this.width + j;
        this.tiles[idx] = tileType;
      }
    }
  };

  Game.prototype._intersectsAny = function (room, padding) {
    for (var i = 0; i < this.rooms.length; i++) {
      var other = this.rooms[i];

      var leftA = room.x - padding;
      var rightA = room.x + room.w + padding;
      var topA = room.y - padding;
      var bottomA = room.y + room.h + padding;

      var leftB = other.x;
      var rightB = other.x + other.w;
      var topB = other.y;
      var bottomB = other.y + other.h;

      if (
        leftA < rightB &&
        rightA > leftB &&
        topA < bottomB &&
        bottomA > topB
      ) {
        return true;
      }
    }
    return false;
  };

  Game.prototype.connectRooms = function () {
    if (this.rooms.length < 2) return;
    this.rooms.sort(function (a, b) {
      return a.cx - b.cx;
    });
    for (var i = 1; i < this.rooms.length; i++) {
      var r1 = this.rooms[i - 1];
      var r2 = this.rooms[i];
      this._carveL(r1.cx, r1.cy, r2.cx, r2.cy);
    }
  };

  Game.prototype._carveL = function (x1, y1, x2, y2) {
    if (Math.random() < 0.5) {
      this._carveLineX(x1, x2, y1);
      this._carveLineY(y1, y2, x2);
    } else {
      this._carveLineY(y1, y2, x1);
      this._carveLineX(x1, x2, y2);
    }
  };

  Game.prototype._carveLineX = function (x1, x2, y) {
    var from = Math.min(x1, x2);
    var to = Math.max(x1, x2);
    for (var x = from; x <= to; x++) {
      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        this.tiles[y * this.width + x] = TILE.FLOOR;
      }
    }
  };

  Game.prototype._carveLineY = function (y1, y2, x) {
    var from = Math.min(y1, y2);
    var to = Math.max(y1, y2);
    for (var y = from; y <= to; y++) {
      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        this.tiles[y * this.width + x] = TILE.FLOOR;
      }
    }
  };

  Game.prototype.addRandomCorridors = function () {
    var vCount = randInt(3, 5);
    var hCount = randInt(3, 5);

    var usedX = {};
    var usedY = {};

    for (var i = 0; i < vCount; i++) {
      var x = 0;
      var kol = 0;
      do {
        x = randInt(0, this.width - 1);
        kol++;
      } while (usedX[x] && kol < 50);
      usedX[x] = 1;
      this._carveLineY(0, this.height - 1, x);
    }
    for (var j = 0; j < hCount; j++) {
      var y = 0;
      var kol = 0;
      do {
        y = randInt(0, this.height - 1);
        kol++;
      } while (usedY[y] && kol < 50);
      usedY[y] = 1;
      this._carveLineX(0, this.width - 1, y);
    }
  };

  Game.prototype.placeHero = function () {
    var r = this.rooms[randInt(0, this.rooms.length - 1)];
    var hx = r.cx;
    var hy = r.cy;
    if (!this._isFloor(hx, hy)) {
      var found = false;
      for (var i = r.y; i < r.y + r.h && !found; i++) {
        for (var j = r.x; j < r.x + r.w; j++) {
          if (this._isFloor(j, i)) {
            hx = j;
            hy = i;
            found = true;
            break;
          }
        }
      }
    }
    this.hero = { x: hx, y: hy, hp: 100, maxHp: 100, atk: 10, hasSword: false };
  };

  Game.prototype._isFloor = function (x, y) {
    if (x <= 0 || y < 0 || x >= this.width || y >= this.height) return false;
    return this.tiles[y * this.width + x] === TILE.FLOOR;
  };

  Game.prototype._tryMoveHero = function (dx, dy) {
    if (!this.hero) return;
    var nx = this.hero.x + dx;
    var ny = this.hero.y + dy;

    if (
      this.portal &&
      this.hero.x === this.portal.x &&
      this.hero.y === this.portal.y
    ) {
      alert("Вы победили!");

      return;
    }

    if (this._isFloor(nx, ny)) {
      this.hero.x = nx;
      this.hero.y = ny;
      this._tryPickup();
      this._enemiesTurn();
      render(this);
      if (this.hero.hp <= 0) {
        alert("Вы погибли");
      }
    }
  };

  Game.prototype.placeEnemies = function (count) {
    this.enemies = [];
    var tires = 0;
    var maxTries = 200;
    while (this.enemies.length < count && tires++ < maxTries) {
      var idx = randInt(0, this.tiles.length - 1);
      if (this.tiles[idx] !== TILE.FLOOR) continue;
      var x = idx % this.width;
      var y = Math.floor(idx / this.width);

      if (this.hero.x === x && this.hero.y === y) continue;
      if (this._enemyAt(x, y)) continue;

      this.enemies.push({ x: x, y: y, hp: 30, maxHp: 30, atk: 5 });
    }
  };

  Game.prototype._spawnPortal = function () {
    var tries = 0,
      maxTries = 5000;
    while (tries++ < maxTries) {
      var idx = randInt(0, this.tiles.length - 1);
      if (this.tiles[idx] !== TILE.FLOOR) continue;

      var x = idx % this.width;
      var y = Math.floor(idx / this.width);

      if (this.hero && this.hero.x === x && this.hero.y === y) continue;
      if (this._enemyAt(x, y)) continue;
      if (
        this._itemAt &&
        (this._itemAt(this.potions || [], x, y) ||
          this._itemAt(this.swords || [], x, y))
      )
        continue;

      this.portal = { x: x, y: y };
      return;
    }

    this.portal = null;
  };

  Game.prototype._enemyAt = function (x, y) {
    for (var i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      if (e.x === x && e.y === y) {
        return e;
      }
    }
    return null;
  };

  Game.prototype._adjacent = function (x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
  };

  Game.prototype._enemiesTurn = function () {
    for (var i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];

      if (this.hero && this._adjacent(e.x, e.y, this.hero.x, this.hero.y)) {
        var atk = typeof e.atk === "number" ? e.atk : 5;
        this.hero.hp -= atk;
        if (this.hero.hp < 0) this.hero.hp = 0;
        continue;
      }

      var d = this._randomDir();
      var nx = e.x + d[0];
      var ny = e.y + d[1];

      if (
        this._isFloor(nx, ny) &&
        !this._enemyAt(nx, ny) &&
        !(this.hero && this.hero.x === nx && this.hero.y === ny)
      ) {
        e.x = nx;
        e.y = ny;
      }
    }
  };

  Game.prototype._attack = function () {
    if (!this.hero) return;

    var dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    var hitSomeone = false;

    for (var i = 0; i < dirs.length; i++) {
      var nx = this.hero.x + dirs[i][0];
      var ny = this.hero.y + dirs[i][1];
      var enemy = this._enemyAt(nx, ny);
      if (enemy) {
        enemy.hp -= this.hero.atk;
        if (enemy.hp <= 0) {
          var idx = this.enemies.indexOf(enemy);
          if (idx !== -1) this.enemies.splice(idx, 1);

          if (this.enemies.length === 0 && !this.portal) {
            this._spawnPortal();
          }
        }
        hitSomeone = true;
      }
    }

    if (hitSomeone) {
      this._enemiesTurn();
      render(this);
      if (this.hero.hp <= 0) {
        alert("Вы погибли");
      }
    }
  };

  Game.prototype._randomDir = function () {
    switch (randInt(0, 3)) {
      case 0:
        return [1, 0];
      case 1:
        return [-1, 0];
      case 2:
        return [0, 1];
      default:
        return [0, -1];
    }
  };

  Game.prototype.placeItems = function () {
    this._placeManyItems(this.potions, 10);

    this._placeManyItems(this.swords, 2);
  };

  Game.prototype._placeManyItems = function (arr, count) {
    arr.length = 0;
    var tries = 0,
      maxTries = 5000;

    while (arr.length < count && tries++ < maxTries) {
      var idx = randInt(0, this.tiles.length - 1);
      if (this.tiles[idx] !== TILE.FLOOR) continue;
      var x = idx % this.width;
      var y = Math.floor(idx / this.width);

      if (this.hero && this.hero.x === x && this.hero.y === y) continue;
      if (this._enemyAt(x, y)) continue;
      if (this._itemAt(this.potions, x, y)) continue;
      if (this._itemAt(this.swords, x, y)) continue;

      arr.push({ x: x, y: y });
    }
  };

  Game.prototype._itemAt = function (arr, x, y) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].x === x && arr[i].y === y) return arr[i];
    }
    return null;
  };

  Game.prototype._tryPickup = function () {
    var pot = this._itemAt(this.potions, this.hero.x, this.hero.y);
    if (pot) {
      var heal = 30;
      this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + heal);

      this.potions.splice(this.potions.indexOf(pot), 1);
    }

    var sw = this._itemAt(this.swords, this.hero.x, this.hero.y);
    if (sw) {
      this.hero.atk += 10;
      this.hero.hasSword = true;

      this.swords.splice(this.swords.indexOf(sw), 1);
    }
  };

  Game.prototype.bindInput = function () {
    var self = this;
    $(window).on("keydown", function (e) {
      var handled = false;
      switch (e.which) {
        case 65:
          self._tryMoveHero(-1, 0);
          handled = true;
          break;
        case 68:
          self._tryMoveHero(1, 0);
          handled = true;
          break;
        case 87:
          self._tryMoveHero(0, -1);
          handled = true;
          break;
        case 83:
          self._tryMoveHero(0, 1);
          handled = true;
          break;

        case 32:
          self._attack();
          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();
        return false;
      }
    });
  };
})();
