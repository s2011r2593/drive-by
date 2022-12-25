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

  act(action, bullets) {
    if (action[0] == 1) {
      this.applyAcceleration(0.7);
    }
    if (action[1] == 1) {
      this.applyAcceleration(-1);
    }
    if (action[2] == 1) {
      this.turn(-0.2);
    }
    if (action[3] == 1) {
      this.turn(0.2);
    }
    if (action[4] == 1) {
      this.fireBullet(bullets);
    }
  }

  fireBullet(bullets) {
    if (this.has_ammo) {
      this.has_ammo = false;
      let bullet = new Bullet(this.position, this.speed, this.direction, this.id);
      bullets.push(bullet);
      return bullet;
    }
  }

  turn(d_theta) {
    this.direction = (this.direction + d_theta) % (2 * Math.PI);
  }
}

module.exports = Player;
