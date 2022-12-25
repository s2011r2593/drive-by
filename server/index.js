const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);

const Player = require('./game-lib/player.js');

class Environment {
  constructor(num_players) {
    this.players = new Array(num_players);
    for (let i = 0; i < num_players; i++) {
      this.players[i] = new Player(i);
    }
    this.bullets = [];
  }

  reset() {
    return {
      observation: {
        players: this.players.map(player => {
          return {
            position: player.position,
            direction: player.direction,
          };
        }),
        bullets: this.bullets.map(bullet => {
          return {
            position: bullet.position,
            direction: bullet.direction,
            owner: bullet.id,
          };
        }),
      },
      info: {}
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

let test = new Environment(4);
test.bullets.push(test.players[0].fireBullet());
test.players[0].updatePosition();
console.log(test.reset().observation.players[0].position);

// Server logic

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  }
});

app.use(cors());

let pause = false;
let env = Environment;

io.on("init", socket => {
  socket.emit("confirm", {});
  socket.emit("pause", pause);
});

io.on("reset", socket => {
  let { observation, info } = env.reset();

  socket.emit("update", {
    "observation": observation,
    "done": false,
    "scores": [],
    "info": info,
  });
});

io.on("step", socket => {
  
  // TODO: set action
  if (!pause) {
    let { observation, done, scores, info } = env.step([]);
    socket.emit("update", { observation, done, scores, info });
  }
});

io.on("pause", socket => {
  pause = !pause;
  socket.emit("pause", pause);
});

app.get("/", (_, res) => {
  res.send("Server is running . . .");
});

server.listen(5000, () => {
  console.log("Web server started . . .");
});