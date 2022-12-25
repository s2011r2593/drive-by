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
      this.speed * Math.sin(this.direction),
      this.speed * Math.cos(this.direction),
    ];
    this.position = this.position.map((s, i) => s + ds[i]);
  }

  applyAcceleration(a) {
    this.speed += a;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }
}

module.exports = GameObject;
