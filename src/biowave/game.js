import Phaser from "phaser";
import { TILESIZE, SPEED } from "./config";
import playerFuncs from "./helpers";

var tileProgress = 0;
var Wkey, Akey, Skey, Dkey;

// ==================== MAIN GAME FUNCTIONS ====================
class Overworld extends Phaser.Scene {
  constructor() {
    super("Overworld");
  }

  preload() {
    this.load.image("tiles", "assets/tilemaps/debug-tiles.png");
    this.load.tilemapTiledJSON(
      "map",
      "assets/tilemaps/debug-map-collisions.json"
    );
    this.load.json("mapjson", "assets/tilemaps/debug-map-collisions.json");
    this.load.spritesheet("player", "assets/sprites/temp-player.png", {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    }); // TEMP SPRITES - change later
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("debug-tiles", "tiles");
    const bg = map.createLayer("background", tiles, 0, 0);
    const collisionTiles = map.createLayer("collisions", tiles, 0, 0); // for debugging
    const walls = map.createLayer("walls", tiles, 0, 0);
    this.player = this.add.image(80, 64, "player", 0);

    this.player.setOrigin(0, 0);
    this.player.direction = "down";
    this.player.isMoving = false;
    this.player.isColliding = {
      up: false,
      left: false,
      down: false,
      right: false,
    };

    this.collisionData = [];
    const mapJson = this.cache.json.get("mapjson");
    for (const layer of mapJson.layers) {
      if (layer.name === "collisions") {
        for (let i = 0; i < layer.data.length; i += layer.width) {
          const chunk = layer.data.slice(i, i + layer.width);
          this.collisionData.push(chunk);
        }
      }
    }

    this.cameras.main.setBounds(0, 0, bg.width, bg.height, true).setZoom(5);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update(time, delta) {
    playerFuncs.setSprite(this, Wkey, Skey, Akey, Dkey);

    if (this.player.isMoving) {
      tileProgress += SPEED;
      playerFuncs.handleMovement(this, SPEED);

      // runs after a tile is traveled
      if (tileProgress >= TILESIZE) {
        tileProgress = 0;
        this.player.isMoving = false;
        const gridX = Math.round(this.player.x / TILESIZE);
        const gridY = Math.round(this.player.y / TILESIZE);
        playerFuncs.handleCollisions(this, gridX, gridY);
      }
    }
  }
}

export default Overworld;
