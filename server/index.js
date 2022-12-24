const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);

class NullEnv {
  constructor() {
  }

  rese() {
    return {
      observation: {},
      info: {},
    }
  }

  step(action) {
    return {
      observation: {},
      done: false,
      scores: [],
      info: {},
    }
  }
}

// Server logic

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  }
});

app.use(cors());

let pause = false;
let env = NullEnv;

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