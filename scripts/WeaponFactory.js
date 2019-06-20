function WeaponFactory() {
  let instance;

  createWeapon = function(type) {
    let weapon = new Weapon();
    weapon.name = type;

    switch (type) {
      case "Couteau":
        weapon.damage = 10;
        break;
      case "Sabre":
        weapon.damage = 15;
        break;
      case "Sabre laser":
        weapon.damage = 20;
        break;
      case "Pistolet":
        weapon.damage = 30;
        break;
      case "Mitrailleuse":
        weapon.damage = 40;
        break;
      default:
        break;
    }
    return weapon;
  };

  return {
    getWeapon: function (type) {
        if (instance == null) {
            instance = createWeapon(type);
        }
        return instance;
    }
};
}
