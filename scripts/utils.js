const checkDistance = (x1, y1, x2, y2) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
};

const checkPossibleMove = (x, y) => {
  const id = "#" + y + "-" + x;
  return $(id).hasClass("movePossible");
};

const meldWeaponResource = (string) => {
  const number = Number(string.substr(6, 1));
          switch (number) {
            case 0:
              return "ressources/couteau.jpg";
              break;
            case 1:
              return "ressources/sabre.jpg";
              break;
            case 2:
              return "ressources/sabre_laser.png";
              break;
            case 3:
              return "ressources/pistolet.jpg";
              break;
            case 4:
              return "ressources/mitrailleuse.jpg";
              break;
            default:
              break;
          }
}
