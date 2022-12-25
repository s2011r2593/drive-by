const DRAG_COEFF = -0.6
const MIN_SPEED = 0.5;

class GameObject {
  constructor(position, speed, direction, id) {
    this.position = position;
    this.projected;
    this.speed = speed;
    this.direction = direction;
    this.id = id;
    this.radius = 10;
  }

  // walls: [ [y0, x0, y1, x1], ... ]
  updatePosition(walls) {
    let ds = [
      this.speed * Math.sin(this.direction),
      this.speed * Math.cos(this.direction),
    ];
    this.projected = this.position.map((s, i) => s + ds[i]);
    let res = this.wallCollision(walls);
    if (res) {
      // Vertical
      if (res[3] - res[1]) {
        this.direction = Math.PI - this.direction;
        this.direction %= Math.PI;
        this.position = [-this.projected[0], this.projected[1]];
      } else {
        this.direction = -this.direction;
        this.position = [this.projected[0], -this.projected[1]];
      }
    } else {
      this.position = this.projected;
    }

    // Friction
    this.speed += DRAG_COEFF * this.speed;
    if (this.speed < MIN_SPEED) {
      this.speed = 0;
    }
  }

  applyAcceleration(additional_acceleration) {
    this.speed += additional_acceleration;
  }

  wallCollision(walls) {
    const ccw = (a, b, c) => {
      return (c[0] - a[0]) * (b[1] - a[1]) > (b[0] - a[0]) * (c[1] - a[1]);
    }

    let u0 = this.position;
    let u1 = this.projected;
    walls.forEach(wall => {
      let v0 = wall.slice(0,2);
      let v1 = wall.slice(2,4);

      return (ccw(u0, v0, v1) != ccw(u1, v0, v1)) && (ccw(u0, u1, v0) != ccw(u0, u1, v1));
    });
    return false;
  }
}

module.exports = GameObject;
