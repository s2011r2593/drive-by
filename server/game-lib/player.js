const GameObject = require('./game_object.js');
const Bullet = require('./bullet.js');

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

  turn(d_theta) {
    this.direction = (this.direction + d_theta) % (2 * Math.PI);
  }
}

module.exports = Player;
