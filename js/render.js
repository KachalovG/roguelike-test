(function () {
  "use strict";
  window.render = function render(game) {
    var field = document.querySelector(".field");
    if (!field) return;

    field.style.width = game.width * TILE_SIZE + "px";
    field.style.height = game.height * TILE_SIZE + "px";

    field.innerHTML = "";

    var frag = document.createDocumentFragment();

    for (var y = 0; y < game.height; y++) {
      for (var x = 0; x < game.width; x++) {
        var idx = y * game.width + x;
        var t = game.tiles[idx];

        var div = document.createElement("div");

        if (typeof CLASSMATE !== "undefined" && CLASSMATE[t]) {
          div.className = CLASSMATE[t];
        } else {
          div.className = t === TILE.WALL ? "tile tileW" : "tile";
        }

        div.style.left = x * TILE_SIZE + "px";
        div.style.top = y * TILE_SIZE + "px";
        div.style.width = TILE_SIZE + "px";
        div.style.height = TILE_SIZE + "px";

        frag.appendChild(div);
      }
    }
    field.appendChild(frag);

    if (game.hero) {
      var heroDiv = document.createElement("div");
      var heroClass =
        typeof CLASSMATE !== "undefined" && ENTITY && CLASSMATE[ENTITY.HERO]
          ? CLASSMATE[ENTITY.HERO]
          : "tile tileP";
      heroDiv.className = heroClass;

      heroDiv.style.left = game.hero.x * TILE_SIZE + "px";
      heroDiv.style.top = game.hero.y * TILE_SIZE + "px";
      heroDiv.style.width = TILE_SIZE + "px";
      heroDiv.style.height = TILE_SIZE + "px";

      var hp = Math.max(0, Math.min(1, game.hero.hp / game.hero.maxHp));
      var bar = document.createElement("div");
      bar.className = "health";
      bar.style.width = Math.floor(hp * 100) + "%";
      heroDiv.appendChild(bar);
      field.appendChild(heroDiv);
    }

    if (game.enemies && game.enemies.length) {
      for (var i = 0; i < game.enemies.length; i++) {
        var en = game.enemies[i];
        var eDiv = document.createElement("div");

        var enemyClass =
          typeof CLASSMAP !== "undefined" &&
          typeof ENTITY !== "undefined" &&
          CLASSMAP[ENTITY.ENEMY]
            ? CLASSMAP[ENTITY.ENEMY]
            : "tile tileE";
        eDiv.className = enemyClass;

        eDiv.style.position = "absolute";
        eDiv.style.left = en.x * TILE_SIZE + "px";
        eDiv.style.top = en.y * TILE_SIZE + "px";
        eDiv.style.width = TILE_SIZE + "px";
        eDiv.style.height = TILE_SIZE + "px";

        var hp2 = Math.max(0, Math.min(1, en.hp / en.maxHp));
        var bar2 = document.createElement("div");
        bar2.className = "health";
        bar2.style.width = Math.round(hp2 * 100) + "%";

        eDiv.appendChild(bar2);
        field.appendChild(eDiv);
      }
    }

    if (game.potions && game.potions.length) {
      for (var i = 0; i < game.potions.length; i++) {
        var p = game.potions[i];
        var pDiv = document.createElement("div");
        var cls =
          typeof CLASSMAP !== "undefined" &&
          typeof ENTITY !== "undefined" &&
          CLASSMAP[ENTITY.POTION]
            ? CLASSMAP[ENTITY.POTION]
            : "tile tileHP";
        pDiv.className = cls;
        pDiv.style.left = p.x * TILE_SIZE + "px";
        pDiv.style.top = p.y * TILE_SIZE + "px";
        pDiv.style.width = TILE_SIZE + "px";
        pDiv.style.height = TILE_SIZE + "px";
        field.appendChild(pDiv);
      }
    }

    if (game.swords && game.swords.length) {
      for (var j = 0; j < game.swords.length; j++) {
        var s = game.swords[j];
        var sDiv = document.createElement("div");
        var cls2 =
          typeof CLASSMAP !== "undefined" &&
          typeof ENTITY !== "undefined" &&
          CLASSMAP[ENTITY.SWORD]
            ? CLASSMAP[ENTITY.SWORD]
            : "tile tileSW";
        sDiv.className = cls2;
        sDiv.style.left = s.x * TILE_SIZE + "px";
        sDiv.style.top = s.y * TILE_SIZE + "px";
        sDiv.style.width = TILE_SIZE + "px";
        sDiv.style.height = TILE_SIZE + "px";
        field.appendChild(sDiv);
      }
    }

    if (game.portal) {
      var pDiv = document.createElement("div");
      pDiv.className = "tile";

      pDiv.style.left = game.portal.x * TILE_SIZE + "px";
      pDiv.style.top = game.portal.y * TILE_SIZE + "px";
      pDiv.style.width = TILE_SIZE + "px";
      pDiv.style.height = TILE_SIZE + "px";

      pDiv.style.backgroundImage = "none";
      pDiv.style.backgroundColor = "#2196f3";
      pDiv.style.zIndex = 8;

      field.appendChild(pDiv);
    }
  };
})();
