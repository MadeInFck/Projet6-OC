class Player {
  constructor(rank, name, weapon) {
    this.rank = rank;
    this.name = name;
    this.health = 100;
    this.weapon = weapon;
    this.isDefending = false;
    this.position = {
      x: 0,
      y: 0
    };
  }
}
