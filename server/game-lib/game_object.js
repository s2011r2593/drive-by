const DRAG_COEFF = -0.6
const MIN_SPEED = 0.5;

class GameObject {
  constructor(position, speed, direction, id) {
    this.position = position;
    this.speed = speed;
    this.direction = direction;
    this.id = id;
    this.radius = 10;
  }

  updatePosition() {
    let ds = [
      this.speed * Math.sin(this.direction),
      this.speed * Math.cos(this.direction),
    ];
    this.position = this.position.map((s, i) => s + ds[i]);
  }

  applyAcceleration(additional_acceleration) {
    this.speed += DRAG_COEFF * this.speed;
    this.speed += additional_acceleration;
    if (this.speed < MIN_SPEED) {
      this.speed = 0;
    }
  }

  circularCollision(obstacle) {
    let min_sq_dist = Infinity;
    let e;
    let disps = [];
    obstacle.vertices.forEach(v => {
      let dy = v[0] - this.position[0];
      let dx = v[1] - this.position[1];
      disps.push([dy, dx]);
      let sq_dist = dx*dx + dy*dy;
      if (sq_dist < min_sq_dist) {
        min_sq_dist = sq_dist;
        inv_dist = 1 / Math.sqrt(sq_dist);
        e = [dy * inv_dist, dx * inv_dist];
      }
    });
    let collide = false;
    disps.forEach(d => {
      let scalar_proj = d[0] * e[0] + d[1] * e[1];
      if (scalar_proj < this.radius) {
        return
      }
    })
  }
}

module.exports = GameObject;
