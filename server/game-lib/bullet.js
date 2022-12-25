const GameObject = require('./game_object.js');

const ADDITIONAL_SPEED = 10;

class Bullet extends GameObject {
  constructor(position, ref_speed, direction, id) {
    super(position, ref_speed + ADDITIONAL_SPEED, direction, id);
  }

  updatePosition() {
    super.updatePosition();
    super.brake();
  }
}

module.exports = Bullet;
