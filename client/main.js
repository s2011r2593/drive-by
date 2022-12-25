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
  let { players } = observation;
  if (players && cars.length === 0 && players.length > 0) {
    players.forEach(player => {
      let car = PIXI.Sprite.from('assets/sprites/car.png');
      car.anchor.set(0.5);
      car.y = player.pos[0];
      car.x = player.pos[1];
      car.scale.set(0.3, 0.3);
      app.stage.addChild(car);
      cars.push(car);
    });
  } else {
    for (c in cars) {
      cars[c].y = observation.players[c].pos[0];
      cars[c].x = observation.players[c].pos[1];
      cars[c].rotation = observation.players[c].dir;
    }
  }
});

let action = [0, 0, 0, 0];
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
  });
}

const actionTick = () => {
  socket.emit("action", action);
  setTimeout(actionTick, config.ACTION_POLL_INTERVAL);
}