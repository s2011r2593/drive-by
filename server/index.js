const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const Environment = require("./game-lib/environment.js");

// Server logic

const server = http.createServer(app);
app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
});
io.listen(5000);

let pause = false;
let env = new Environment(4);
let action = [];
let sockets = [];

let tick = () => {
  let { observation, done, scores, info } = env.step(action);
  sockets[0] && sockets[0].emit("update", { observation, done, scores, info });
  setTimeout(() => tick(), 50);
}
tick();

io.on("connection", socket => {
  sockets = [socket];
  console.log("Client connected!");
  socket.emit("confirm", {});
  socket.emit("pause", pause);

  socket.on("reset", () => {
    let { observation, info } = env.reset();
    console.log("Game reset.");
    socket.emit("update", {
      "observation": observation,
      "done": false,
      "scores": [],
      "info": info,
    });
  });

  socket.on("action", msg => {
    action = [msg];
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