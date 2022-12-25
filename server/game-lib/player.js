const GameObject = require('./game_object.js');
const Bullet = require('./bullet.js');

const MAX_SPEED = 15;
const CUTOFF = 5;
const H = CUTOFF - Math.log(Math.exp(CUTOFF) - 1);
const K = - 1 / (Math.exp(CUTOFF) - 1);
const C0 = CUTOFF / MAX_SPEED;

class Player extends GameObject {
  constructor(id) {
    super([0, 0], 0, 0, id);
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

  speed_up() {
    this.speed = this.speed + Math.exp(H - C0*this.speed) + K;
  }

  turn(dt) {
    this.direction = (this.direction + dt) % (2 * Math.PI);
  }
}

module.exports = Player;
