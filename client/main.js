const config = {
  PLAYER_SPEED: 1.5,
  PLAY_BGM: false,
  WIDTH: 270,
  HEIGHT: 270,
  VIEW_SCALE: 1.5,
}

const socket = io("ws://localhost:5000");
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let app = new PIXI.Application({ width: config.WIDTH, height: config.HEIGHT });
app.stage.scale.set(1);
document.body.appendChild(app.view);

let env = {
  gameStart: false,
  arrowKeys: [0, 0, 0, 0],
  player: {
    sheet: null,
    direction: 2,
    sprite: null,
  },
};

// Preload assets and display title screen
let loading = true;
window.onload = async () => {
  app.renderer.background.cnolor = "0x222222";
  let newWidth = config.VIEW_SCALE * config.WIDTH;
  let newHeight = config.VIEW_SCALE * config.HEIGHT;
  app.renderer.view.style.width = `${newWidth}px`;
  app.renderer.view.style.height = `${newHeight}px`;

  // Set title screen text
  const title = new PIXI.Text('00-2', {
    fontFamily: 'Arial',
    fontSize: 40,
    fontWeight: 800,
    fill: 0xdddddd,
    align: 'center',
  });
  title.anchor.set(0.5);
  title.x = app.view.width / 2;
  title.y = (app.view.height / 2) - 30;
  app.stage.addChild(title);

  // Set title screen helper
  const subtitle = new PIXI.Text('Press SPACE to continue', {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: 0xdddddd,
    align: 'center',
  });
  subtitle.anchor.set(0.5);
  subtitle.x = app.view.width / 2;
  subtitle.y = (app.view.height / 2) + 50;
  app.stage.addChild(subtitle);

  // Preload background tiling
  let grass_texture = PIXI.Texture.from('assets/sprites/floor.png');
  env.grass_tile = new PIXI.TilingSprite(grass_texture, app.view.width, app.view.height);

  // Preload static object sprites (TODO: loop through names)
  let hitboxes = fetch("assets/sprites/hitboxes.json")
  .then(response => {
    return response.json();
  });
  env.lamp = PIXI.Sprite.from('assets/sprites/mirror.png');
  env.lamp.anchor.set(0.5);
  env.lamp.x = app.view.width / 2 - 50;
  env.lamp.y = app.view.height / 2 - 50;
  env.jar = PIXI.Sprite.from('assets/sprites/table.png');
  env.jar.anchor.set(0.5);
  env.jar.x = app.view.width / 2 + 50;
  env.jar.y = app.view.height / 2 + 50;
  env.tree = PIXI.Sprite.from('assets/sprites/carpet.png');
  env.tree.anchor.set(0.5);
  env.tree.x = app.view.width / 2;
  env.tree.y = app.view.height / 2 + 50;

  // Preload player sprite
  env.player.sheet = await PIXI.Assets.load("assets/sprites/ness.json");
  env.player.sprite = new PIXI.AnimatedSprite([env.player.sheet.textures["ness-down.png"]]);
  env.player.sprite.anchor.set(0.5);
  env.player.sprite.x = app.view.width / 2;
  env.player.sprite.y = app.view.height / 2;
  env.player.sprite.animationSpeed = 0.1;

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
      if (!env.gameStart && !loading) {
        startGame();
      }
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

  loading = false;
}

// Start main game
const startGame = () => {
  env.gameStart = true;

  // Play BGM
  if (config.PLAY_BGM) {
    PIXI.sound.Sound.from({
      url: 'assets/sounds/bgm.mp3',
      autoPlay: true,
      complete: () => {
        // console.log('Sound finished');
      }
    });
  }

  // Stage preloaded assets
  app.stage.addChild(env.grass_tile);
  app.stage.addChild(env.lamp);
  app.stage.addChild(env.tree);
  app.stage.addChild(env.jar);
  app.stage.addChild(env.player.sprite);
  

  app.ticker.add(update);
}

const update = (delta) => {

  // Handle player movement w/ Pokemon Blue prioritization
  if (env.arrowKeys[2] === 1) {
    if (env.player.sprite.textures !== env.player.sheet.animations["ness-walk-down"]) {
      env.player.direction = 2;
      env.player.sprite.textures = env.player.sheet.animations["ness-walk-down"];
      env.player.sprite.play();
      console.log(env.player.sprite.getBounds().intersects(env.jar.getBounds()));
    }
    env.player.sprite.y += config.PLAYER_SPEED;
  } else if (env.arrowKeys[0] === 1) {
    if (env.player.sprite.textures !== env.player.sheet.animations["ness-walk-up"]) {
      env.player.direction = 0;
      env.player.sprite.textures = env.player.sheet.animations["ness-walk-up"];
      env.player.sprite.play();
    }
    env.player.sprite.y -= config.PLAYER_SPEED;
  } else if (env.arrowKeys[1] === 1) {
    if (env.player.sprite.textures !== env.player.sheet.animations["ness-walk-left"]) {
      env.player.direction = 1;
      env.player.sprite.textures = env.player.sheet.animations["ness-walk-left"];
      env.player.sprite.play();
    }
    env.player.sprite.x -= config.PLAYER_SPEED;
  } else if (env.arrowKeys[3] === 1) {
    if (env.player.sprite.textures !== env.player.sheet.animations["ness-walk-right"]) {
      env.player.direction = 3;
      env.player.sprite.textures = env.player.sheet.animations["ness-walk-right"];
      env.player.sprite.play();
    }
    env.player.sprite.x += config.PLAYER_SPEED;
  } else {
    if (
      env.player.sprite.texture !== env.player.sheet.textures["ness-down.png"]
      && env.player.direction === 2
    ) {
      env.player.sprite.texture = env.player.sheet.textures["ness-down.png"];
    } else if (
      env.player.sprite.texture !== env.player.sheet.textures["ness-up.png"]
      && env.player.direction === 0
    ) {
      env.player.sprite.texture = env.player.sheet.textures["ness-up.png"];
    } else if (
      env.player.sprite.texture !== env.player.sheet.textures["ness-left.png"]
      && env.player.direction === 1
    ) {
      env.player.sprite.texture = env.player.sheet.textures["ness-left.png"];
    } else if (
      env.player.sprite.texture !== env.player.sheet.textures["ness-right.png"]
      && env.player.direction === 3
    ) {
      env.player.sprite.texture = env.player.sheet.textures["ness-right.png"];
    }
  }
}