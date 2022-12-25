const config = {
  ACTION_POLL_INTERVAL: 100,
};

const socket = io("ws://localhost:5000");

socket.on("confirm", _ => {
  console.log("Connected to socket backend!");
  socket.emit("reset", {});
});

let app = null;
let cars = [];
let shots = [];
let gameStarted = false;
let isInitialized = false;
socket.on("update", ({ observation, done, scores, info }) => {

  // Handle PIXI initialization
  if (!isInitialized) {
    isInitialized = true;
    app = new PIXI.Application({ width: info.width, height: info.height });
    app.stage.scale.set(1);
    document.body.appendChild(app.view);
    actionTick();
    
    // Draw background
    let bg = new PIXI.Graphics();
    bg.beginFill(0x111111);
    bg.drawRect(0, 0, info.width, info.height);
    app.stage.addChild(bg);
  }

  // Initialize players if just reset
  let { players, bullets } = observation;
  console.log(bullets);
  if (players && cars.length === 0 && players.length > 0) {
    players.forEach(player => {
      let car = PIXI.Sprite.from("assets/sprites/car.png");
      car.anchor.set(0.5);
      car.y = player.pos[0];
      car.x = player.pos[1];
      car.scale.set(0.3, 0.3);
      app.stage.addChild(car);
      cars.push(car);

      let bullet = PIXI.Sprite.from("assets/sprites/bullet.png");
      bullet.anchor.set(0.5);
      bullet.y = player.pos[0];
      bullet.x = player.pos[1];
      bullet.scale.set(0.5, 0.5);
      // bullet.visible = false;
      app.stage.addChild(bullet);

      shots.push(bullet);
    });
  } else {
    for (c in cars) {
      cars[c].y = players[c].pos[0];
      cars[c].x = players[c].pos[1];
      cars[c].rotation = players[c].dir;
    }

    for (b in shots) {
      if (b < shots.length) {
        if (!shots[b].visible) {
          shots[b].visible = true;
        }
        shots[b].y = bullets[b].pos[0];
        shots[b].x = bullets[b].pos[1];
        shots[b].rotation = bullets[b].dir;
      }
    }
  }
});

let action = [0, 0, 0, 0, 0];
window.onload = async () => {
  window.addEventListener("keydown", e => {
    if (e.code === "KeyL") {
      action[0] = 1;
    }
    if (e.code === "KeyR") {
      action[1] = 1;
    }
    if (e.code === "KeyS") {
      action[2] = 1;
    }
    if (e.code === "KeyN") {
      action[3] = 1;
    }
    if (e.code === "Space") {
      action[4] = 1;
    }
  });

  window.addEventListener("keyup", e => {
    if (e.code === "KeyL") {
      action[0] = 0;
    }
    if (e.code === "KeyR") {
      action[1] = 0;
    }
    if (e.code === "KeyS") {
      action[2] = 0;
    }
    if (e.code === "KeyN") {
      action[3] = 0;
    }
    if (e.code === "Space") {
      action[4] = 0;
    }
  });
}

const actionTick = () => {
  socket.emit("action", action);
  setTimeout(actionTick, config.ACTION_POLL_INTERVAL);
}