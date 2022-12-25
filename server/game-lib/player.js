const GameObject = require('./game_object.js');
const Bullet = require('./bullet.js');

const BASE_ACCEL = 10;
const MAX_SPEED = 20;
const DRAG_COEFF = BASE_ACCEL / MAX_SPEED;
const BRAKE_COEFF = - DRAG_COEFF * 2

class Player extends GameObject {
  constructor(id, y, x) {
    super([y, x], 0, 0, id);
    this.has_ammo = true;
  }

  setPosition(position) {
    this.position = position;
  }

  fireBullet() {
    if (this.has_ammo) {
      this.has_ammo = false;
      return new Bullet(this.position, this.speed, this.direction, this.id);
    }
  }

  get GasAccel() {
    return BASE_ACCEL - DRAG_COEFF * this.speed;
  }

  get NeutralAccel() {
    return - DRAG_COEFF * this.speed;
  }

  get BrakeAccel() {
    return BRAKE_COEFF * this.speed;
  }

  turn(d_theta) {
    this.direction = (this.direction + d_theta) % (2 * Math.PI);
  }
}

module.exports = Player;
