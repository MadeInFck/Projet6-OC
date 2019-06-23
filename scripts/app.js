(function() {
  "use strict";

  let fight = false,
    gameTurn = 1,
    winner,
    whoPlays,
    x,
    y,
    oldWeapon = ["", ""];

  // Get weapons from factory pattern designed as singleton
  let weapons = [];

  const weaponFactory = getWeaponFactory();
  console.log(weaponFactory);

  weapons.push(weaponFactory.buildKnife());
  weapons.push(weaponFactory.buildSabre());
  weapons.push(weaponFactory.buildLaserSabre());
  weapons.push(weaponFactory.buildGun());
  weapons.push(weaponFactory.buildRifle());

  console.log(weapons);
  //Create players
  let namePlayer1 = prompt("Entrez le nom du joueur 1 : ");
  let namePlayer2 = prompt("Entrez le nom du joueur 2 : ");

  if (!namePlayer1) {
    namePlayer1 = "Joueur 1";
  }
  if (!namePlayer2) {
    namePlayer2 = "Joueur 2";
  }

  const player1 = new Player(1, namePlayer1);
  const player2 = new Player(2, namePlayer2);
  player1.weapon = weapons[0];
  player2.weapon = weapons[0];
  //Create grid
  let grid = new Grid(player1, player2, weapons);
  grid.generateGrid();

  while (!grid.checkPerfectMaze()) {
    grid = null;
    grid = new Grid(player1, player2, weapons);
    grid.generateGrid();
  }
  console.log("Grille vérifiée!");

  $("#namePlayer1").html(player1.name);
  $("#namePlayer2").html(player2.name);
  $("body").fadeIn(500);

  // Game management JQuery
  $(document).ready(function() {
    $("body").click(function(event) {
      $("#modal").modal("hide");
      gameManagement();
    });

    $("#modal").modal("show");

    $("td").click(function(event) {
      var coords = this.id.split("-");
      x = Number(coords[1]);
      y = Number(coords[0]);
    });

    $("#modal1").on("hidden.bs.modal", function() {
      location.reload();
    });
  });

  $("#attack-player1").click(function(event) {
    player1.isDefending = false;
    if (player2.isDefending) {
      player2.health -= Math.floor(player1.weapon.damage / 2);
    } else {
      player2.health -= player1.weapon.damage;
    }
    console.log(player1.health, player2.health);
    gameTurn++;
    updateFightInterface();
    togglePosture();
  });

  $("#attack-player2").click(function(event) {
    player2.isDefending = false;
    if (player1.isDefending) {
      player1.health -= Math.floor(player2.weapon.damage / 2);
    } else {
      player1.health -= player2.weapon.damage;
    }
    console.log(player1.health, player2.health);
    gameTurn++;
    updateFightInterface();
    togglePosture();
  });

  $("#defend-player1").click(function(event) {
    player1.isDefending = true;
    gameTurn++;
    togglePosture();
  });

  $("#defend-player2").click(function(event) {
    player2.isDefending = true;
    gameTurn++;
    togglePosture();
  });

  // Main management functions
  let gameManagement = () => {
    whoPlays = gameTurn % 2 == 0 ? player2 : player1;
    grid.displayPossibleMoves(whoPlays.rank, true);
    if (!fight) {
      movePlayer(whoPlays);
      if (
        checkDistance(
          player1.position.x,
          player1.position.y,
          player2.position.x,
          player2.position.y
        ) <= 1
      ) {
        console.log("à côté");
        fight = true;
        gameManagement();
      } else {
        console.log("pas à côté!");
      }
    } else {
      fightIsOn();
    }
  };

  let movePlayer = player => {
    var rank = player.rank;
    grid.displayPossibleMoves(rank, true);
    clickRecognizer(rank);
  };

  let fightIsOn = rank => {
    $("td").off("click");
    $("body").off("click");
    grid.displayPossibleMoves(1, false);
    grid.displayPossibleMoves(2, false);
    togglePosture();
  };

  let togglePosture = () => {
    var even = gameTurn % 2 == 0;
    whoPlays = even ? player2 : player1;
    if (whoPlays.rank == 1) {
      $("#attack-player1, #defend-player1").removeAttr("hidden");
      $("#attack-player2, #defend-player2").attr("hidden", "");
    } else {
      $("#attack-player2, #defend-player2").removeAttr("hidden");
      $("#attack-player1, #defend-player1").attr("hidden", "");
    }
  };

  let updateFightInterface = () => {
    if (player1.health <= 0) {
      player1.health = 0;
      winner = player2;
    } else if (player2.health <= 0) {
      player2.health = 0;
      winner = player1;
    }

    $("#healthPlayer1").html("Santé : " + player1.health + "%");
    $("#progress-player1").css("width", player1.health + "%");
    $("#healthPlayer2").html("Santé : " + player2.health + "%");
    $("#progress-player2").css("width", player2.health + "%");

    if (winner != null) {
      $(
        "#attack-player1, #defend-player1, #attack-player2, #defend-player2"
      ).attr("hidden", "");
      console.log(winner.name);
      $("#modal-body-dynamic").html(winner.name + " a gagné !");
      $("#modal1").modal("show");
    }
  };

  let clickRecognizer = rank => {
    var enemyRank = rank == 1 ? 2 : 1;
    if (x == undefined || y == undefined) {
      return;
    }
    var value = grid.grid[y][x];
    var switchWeapon = String(value).startsWith("weapon") ? true : false;

    if (checkPossibleMove(x, y)) {
      grid.displayPossibleMoves(rank, false);
      updatePlayerPosition(rank, x, y, oldWeapon);
      grid.displayPossibleMoves(enemyRank, true);
      if (switchWeapon) {
        var index = grid.weapons.findIndex(weapon => {
          return weapon.name === grid.players[rank - 1].weapon.name;
        });
        oldWeapon[rank - 1] = "weapon" + index;
        updateWeapon(rank, x, y, oldWeapon, value);
      }
    }
  };

  let updateWeapon = (rank, x, y, old, value) => {
    var player = grid.players[rank - 1];
    var id = "#" + player.position.y + "-" + player.position.x;
    $(id)
      .children()[0]
      .remove();
    grid.grid[y][x] = old[rank - 1];
    player.weapon = grid.weapons[value.substr(6, 1)];
    $("#nameWeaponPlayer" + rank).html(player.weapon.name);
    $("#imageWeaponPlayer" + rank).attr("src", meldWeaponResource(value));
    $("#damageWeaponPlayer" + rank).html(player.weapon.damage + "pts");
  };

  let updatePlayerPosition = (rank, x, y, name) => {
    var player = grid.players[rank - 1];
    var id = "#" + player.position.y + "-" + player.position.x;
    var selectedCase = $(id);
    // Remove player from old position
    selectedCase.empty();

    // Modify backend old position
    if (oldWeapon[rank - 1] != "") {
      grid.grid[player.position.y][player.position.x] = oldWeapon[rank - 1];
      //Modify front old position if weapon change
      var weaponImg = $("<img></img");
      weaponImg.attr("src", meldWeaponResource(oldWeapon[rank - 1]));
      weaponImg.attr("id", id);
      weaponImg.addClass("casePlayer");
      selectedCase.append(weaponImg);
      oldWeapon[rank - 1] = "";
    } else {
      grid.grid[player.position.y][player.position.x] = 0;
    }
    // Modify backend new position
    player.position.x = x;
    player.position.y = y;
    grid.grid[y][x] = "player" + String(rank);
    // Add player at new position
    id = "#" + y + "-" + x;
    selectedCase = $(id);
    var playerImg = $("<img></img");
    playerImg.attr("src", "ressources/player" + rank + ".jpg");
    playerImg.attr("id", id);
    playerImg.addClass("casePlayer");
    selectedCase.append(playerImg);
    gameTurn++;
  };
})();
