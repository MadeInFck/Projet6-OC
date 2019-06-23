class WeaponFactory {
  constructor() {
      if (!!WeaponFactory.instance) {
          return WeaponFactory.instance;
      }

      WeaponFactory.instance = this;

      return this;
  }

  buildKnife = () => {
    return new Weapon("Couteau", 10);
  };

  buildSabre = () => {
    return new Weapon("Sabre", 15);
  };

  buildLaserSabre = () => {
    return new Weapon("Sabre laser", 20);
  };

  buildGun = () => {
    return new Weapon("Pistolet", 30);
  };

  buildRifle = () => {
    return new Weapon("Mitrailleuse", 40);
  };

}
