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

  act(action) {
    if (action[0] == 1) {
      this.applyAcceleration(1);
    }
    if (action[1] == 1) {
      this.applyAcceleration(-0.5);
    }
    if (action[2] == 1) {
      this.turn(-0.2);
    }
    if (action[3] == 1) {
      this.turn(0.2);
    }
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
