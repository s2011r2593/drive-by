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
  }

  reset() {
    for (let p in this.players) {
      let player = this.players[p];
      player.setPosition([Math.random() * CONFIG.width, Math.random() * CONFIG.height]);
    }
    return {
      observation: {
        players: this.players.map(player => {
          return {
            pos: player.position,
            dir: player.direction,
          };
        }),
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
    return {
      observation: {},
      scores: [0],
      done: false,
      info: {}
    }
  }
}

module.exports = Environment;
