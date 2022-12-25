const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);

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