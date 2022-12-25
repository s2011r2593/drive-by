const FRICTION = 0.85;
const MIN_SPEED = 0.5;

class GameObject {
  constructor(position, speed, direction, id) {
    this.position = position;
    this.speed = speed;
    this.direction = direction;
    this.id = id;
  }

  updatePosition() {
    let ds = [
      this.speed * Math.cos(this.direction),
      this.speed * Math.sin(this.direction),
    ];
    this.position = this.position.map((s, i) => s + ds[i]);
  }

  brake() {
    this.speed *= FRICTION;
    if (this.speed < MIN_SPEED) {
      this.speed = 0;
    }
  }
}

module.exports = GameObject;
