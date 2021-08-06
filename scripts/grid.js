// Class creation
class Grid {
  constructor(player1, player2, weapons, lines = 10, columns = 10) {
    this.lines = lines;
    this.columns = columns;
    this.grid = Array.from(Array(lines), _ => new Array(columns).fill(0));
    this.players = [player1, player2];
    this.numberOfBlocks = 10;
    this.numberOfWeapons = 4;
    this.weapons = weapons;
  }

  /* Main function to generate grid with blocks, weapons, players 
  and finally display the grid via the interface */
  generateGrid() {
    this.insertBlocks();
    this.insertWeapons();
    this.insertPlayers();
    this.displayGrid();
  }

  //  Insert blocks in grid
  insertBlocks() {
    for (let i = 1; i <= this.numberOfBlocks; i++) {
      const blockCoordinates = this.generateCoordinatesFree();
      this.grid[blockCoordinates[0]][blockCoordinates[1]] = 1;
    }
  }

  //Insert weapons in grid
  insertWeapons() {
    for (let i = 1; i <= this.numberOfWeapons; i++) {
      const blockCoordinates = this.generateCoordinatesFree();
      this.grid[blockCoordinates[0]][blockCoordinates[1]] = "weapon" + i;
    }
  }

  // Insert players in grid
  insertPlayers() {
    //Insert Player1
    let blockCoordinates = this.generateCoordinatesFree();
    this.players[0].position.y = blockCoordinates[0];
    this.players[0].position.x = blockCoordinates[1];
    this.grid[blockCoordinates[0]][blockCoordinates[1]] = "player1";
    //Insert Player 2
    let notBeside = false;
    while (!notBeside) {
      blockCoordinates = this.generateCoordinatesFree();
      // Check that players are not side by side
      if (checkDistance(this.players[0].position.y, this.players[0].position.x, blockCoordinates[0], blockCoordinates[1]) > 1) {
        notBeside = true;
        this.players[1].position.y = blockCoordinates[0];
        this.players[1].position.x = blockCoordinates[1];
        this.grid[blockCoordinates[0]][blockCoordinates[1]] = "player2";
      }
    }
  }

  //Generate coordinates for blocks/weapons/players on free location
  generateCoordinatesFree() {
    let random_x,
      random_y,
      empty_block = false;

    while (!empty_block) {
      random_y = Math.floor(Math.random() * this.lines);
      random_x = Math.floor(Math.random() * this.columns);
      if (this.grid[random_y][random_x] == 0) {
        empty_block = true;
      }
    }
    return [random_y, random_x];
  }

  // Display grid on screen
  displayGrid() {
    //Create basic table case via td free or block
    const displayed = $("tbody");
    for (let i = 0; i < 10; i++) {
      const line = $("<tr></tr>");
      for (let j = 0; j < 10; j++) {
        let caseFront = $("<td class='case'></td>"),
          caseBack = this.grid[i][j];
        caseFront.attr("id", String(i) + "-" + String(j));
        if (caseBack == 1) {
          caseFront.addClass("caseBlock");
        }

        // Add players images
        const playerImg = $("<img></img>");
        if (caseBack == "player1") {
          playerImg.attr("src", "ressources/player" + 1 + ".jpg");
          //playerImg.attr("id", String(i) + "-" + String(j));
          //playerImg.addClass("casePlayer");
          caseFront.append(playerImg);
          caseFront.attr("id", String(i) + "-" + String(j));
        } else if (caseBack == "player2") {
          playerImg.attr("src", "ressources/player" + 2 + ".jpg");
          //playerImg.attr("id", String(i) + "-" + String(j));
          //playerImg.addClass("casePlayer");
          caseFront.append(playerImg);
          caseFront.attr("id", String(i) + "-" + String(j));
        }
        // Add weapons images
        if (typeof caseBack == "string" && caseBack.includes("weapon")) {
          const weaponImg = $("<img></img>");
          const weapon = meldWeaponResource(caseBack);
          weaponImg.attr("src", weapon);
          weaponImg.addClass("caseWeapon");
          caseFront.append(weaponImg);
          caseFront.attr("id", String(i) + "-" + String(j));
        }
        line.append(caseFront);
      }
      displayed.append(line);
    }
  }

  displayPossibleMoves(number, bool) {
    const positionX = this.players[number - 1].position.x;
    const positionY = this.players[number - 1].position.y;
 
    // Check left
    for (let i = 1; i <= 3; i++) {
      if (positionX - i < 0) {
        break;
      } else if (this.grid[positionY][positionX - i] == 0 || String(this.grid[positionY][positionX - i]).startsWith('weapon')) {
        if (bool) {
          $("#" + positionY + "-" + (positionX - i)).addClass("movePossible");
        } else {
          $("#" + positionY + "-" + (positionX - i)).removeClass(
            "movePossible"
          );
        }
      } else {
        break;
      }
    }
    //  Check right
    for (let i = 1; i <= 3; i++) {
      if (positionX + i > 9) {
        break;
      } else if (this.grid[positionY][positionX + i] == 0 || String(this.grid[positionY][positionX + i]).startsWith('weapon')) {
        if (bool) {
          $("#" + positionY + "-" + (positionX + i)).addClass("movePossible");
        } else {
          $("#" + positionY + "-" + (positionX + i)).removeClass(
            "movePossible"
          );
        }
      } else {
        break;
      }
    }
    //  Check above
    for (let i = 1; i <= 3; i++) {
      if (positionY - i < 0) {
        break;
      } else if (this.grid[positionY - i][positionX] == 0 || String(this.grid[positionY - i][positionX]).startsWith('weapon')) {
        if (bool) {
          $("#" + (positionY - i) + "-" + positionX).addClass("movePossible");
        } else {
          $("#" + (positionY - i) + "-" + positionX).removeClass(
            "movePossible"
          );
        }
      } else {
        break;
      }
    }
    //  Check below
    for (let i = 1; i <= 3; i++) {
      if (positionY + i > 9) {
        break;
      } else if (this.grid[positionY + i][positionX] == 0 || String(this.grid[positionY + i][positionX]).startsWith('weapon')) {
        if (bool) {
          $("#" + (positionY + i) + "-" + positionX).addClass("movePossible");
        } else {
          $("#" + (positionY + i) + "-" + positionX).removeClass(
            "movePossible"
          );
        }
      } else {
        break;
      }
    }
  }

  checkPerfectMaze() {
    const player1 = this.players[0];
    const player2 = this.players[1];
    if (this.checkPlayerMovable(player1.position.x, player1.position.y) && this.checkPlayerMovable(player2.position.x, player2.position.y)) {
      return true;
    } else {
      return false;
    }
  }

  checkPlayerMovable(x, y) {
    let result = false;
    if (y<8 && this.grid[y+1][x] == 0 && this.grid[y+2][x] == 0) {
      result = true;
    }
    if (y>2 && this.grid[y-1][x] == 0 && this.grid[y-2][x] == 0) {
      result = true;
    }
    if (x<8 && this.grid[y][x+1] == 0 && this.grid[y][x+2] == 0) {
      result = true;
    }
    if (x>2 && this.grid[y][x+2] == 0 && this.grid[y][x+2] == 0) {
      result = true;
    }
    return result;
  }
}
