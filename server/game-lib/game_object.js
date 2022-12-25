const MIN_SPEED = 0.5;

class GameObject {
  constructor(position, speed, direction, id) {
    this.position = position;
    this.speed = speed;
    this.direction = direction;
    this.id = id;
  }

  static get DELTA_T() {
    return 0.01;
  }

  static get FRICTION() {
    return 0.85;
  }

  updatePosition() {
    let ds = [
      this.speed * Math.cos(this.direction),
      this.speed * Math.sin(this.direction),
    ];
    this.position = this.position.map((s, i) => s + ds[i]);
  }

  brake() {
    this.speed *= this.FRICTION;
    if (this.speed < MIN_SPEED) {
      this.speed = 0;
    }
  }
}

module.exports = GameObject;
