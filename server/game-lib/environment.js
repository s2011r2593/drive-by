const Player = require('./player.js');

const CONFIG = {
  width: 800,
  height: 450,
};

class Environment {
  constructor(num_players) {
    this.players = new Array(num_players);
    for (let i = 0; i < num_players; i++) {
      this.players[i] = new Player(i, 0, 0);
    }
    this.bullets = [];
    this.walls = [];
  }

  reset() {
    this.players.forEach(player => {
      player.setPosition([
        Math.random() * CONFIG.height, 
        Math.random() * CONFIG.width,
      ]);
    });
    this.walls.push([0, 0, CONFIG.height, 0]);
    this.walls.push([0, CONFIG.width, CONFIG.height, CONFIG.width]);
    this.walls.push([0, 0, 0, CONFIG.width]);
    this.walls.push([CONFIG.height, 0, CONFIG.height, CONFIG.width]);
    return {
      observation: {
        players: this.players.map(player => {
          return {
            pos: player.position,
            dir: player.direction,
          };
        }),
        obstacles: this.walls,
        /*
        bullets: this.bullets.map(bullet => {
          return {
            pos: bullet.position,
            dir: bullet.direction,
            owner: bullet.id,
          };
        }),
        */
      },
      info: {
        ...CONFIG,
      }
    }
  }

  step(action) {
    for (let p in this.players) {
      let player = this.players[p];
      action[p] && player.act(action[p]);
      player.updatePosition();
    };
    return {
      observation: {
        players: this.players.map(player => {
          return {
            pos: player.position,
            dir: player.direction,
          };
        }),
      },
      scores: [0],
      done: false,
      info: {}
    }
  }
}

module.exports = Environment;
