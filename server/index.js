const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);

const Player = require('./game-lib/player.js');

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

// Server logic

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
});

io.listen(5000);

app.use(cors());

let pause = false;
let env = new Environment(1);

io.on("connection", socket => {
  console.log("Client connected!");
  socket.emit("confirm", {});
  socket.emit("pause", pause);

  socket.on("reset", () => {
    console.log("snt")
    let { observation, info } = env.reset();
    console.log("Game reset.");
    socket.emit("update", {
      "observation": observation,
      "done": false,
      "scores": [],
      "info": info,
    });
  });

  socket.on("step", () => {
  
    // TODO: set action
    if (!pause) {
      let { observation, done, scores, info } = env.step([]);
      socket.emit("update", { observation, done, scores, info });
    }
  });
  
  socket.on("pause", () => {
    pause = !pause;
    socket.emit("pause", pause);
  });
});

app.get("/", (_, res) => {
  res.send("Server is running . . .");
});

server.listen(3000, () => {
  console.log("Web server started . . .");
});