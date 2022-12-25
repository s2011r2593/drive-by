const config = {
  VIEW_SCALE: 0.8,
}

// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let app = new PIXI.Application();
app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
app.stage.scale.set(1);
document.body.appendChild(app.view);

const socket = io("ws://localhost:5000");

socket.on("confirm", _ => {
  console.log("Connected to socket backend!");
  socket.emit("reset", {});
});

socket.on("update", msg => {
  console.log(msg);
});

let car;

window.onload = async () => {
  app.renderer.background.color = "0xaaaabb";
  let newWidth = config.VIEW_SCALE * window.innerWidth;
  let newHeight = config.VIEW_SCALE * window.innerHeight;
  app.renderer.view.style.width = `${newWidth}px`;
  app.renderer.view.style.height = `${newHeight}px`;

  car = PIXI.Sprite.from('assets/sprites/car.png');
  car.anchor.set(0.5);
  car.x = app.view.width / 2;
  car.y = app.view.height / 2;
  car.scale.set(0.5, 0.5);

  window.addEventListener("keydown", e => {
    if (e.code === "KeyL") {
      env.arrowKeys[0] = 1;
    }
    if (e.code === "KeyS") {
      env.arrowKeys[1] = 1;
    }
    if (e.code === "KeyR") {
      env.arrowKeys[2] = 1;
    }
    if (e.code === "KeyN") {
      env.arrowKeys[3] = 1;
    }
    if (e.code === "Space") {
    }
  });

  window.addEventListener("keyup", e => {
    if (e.code === "KeyL") {
      env.arrowKeys[0] = 0;
    }
    if (e.code === "KeyS") {
      env.arrowKeys[1] = 0;
    }
    if (e.code === "KeyR") {
      env.arrowKeys[2] = 0;
    }
    if (e.code === "KeyN") {
      env.arrowKeys[3] = 0;
    }
  });

  startGame();
}

// Start main game
const startGame = () => {
  app.stage.addChild(car);

  app.ticker.add(update);
}

const update = delta => {
  // car.y += 1;
}