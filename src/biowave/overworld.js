import Phaser from "phaser";
import { TILESIZE, SPEED } from "./config";
import helpers from "./helpers";

var tileProgress = 0;
var Wkey, Akey, Skey, Dkey, space;

class Overworld extends Phaser.Scene {
  constructor() {
    super("Overworld");
  }

  preload() {
    this.load.image("tiles", "assets/tilemaps/debug-tiles.png");
    this.load.tilemapTiledJSON(
      "map",
      "assets/tilemaps/debug-map-interactions.json"
    );
    this.load.json("mapjson", "assets/tilemaps/debug-map-interactions.json");
    this.load.spritesheet("player", "assets/sprites/temp-player.png", {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    }); // TEMP SPRITES - change later
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("debug-tiles", "tiles");
    const bg = map.createLayer("background", tiles, 0, 0);
    map.createLayer("collisions", tiles, 0, 0); // for debugging
    map.createLayer("walls", tiles, 0, 0);
    map.createLayer("interactable", tiles, 0, 0);
    this.player = this.add.image(80, 64, "player", 0);

    this.player.setOrigin(0, 0);
    this.player.direction = "down";
    this.player.isMoving = false;
    this.player.isInteracting = false;
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
    helpers.player.handleCollisions(this, this.player.x, this.player.y);

    this.cameras.main.setBounds(0, 0, bg.width, bg.height, true).setZoom(5);
    this.cameras.main.startFollow(this.player);

    Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time, delta) {
    helpers.player.setSprite(this, Wkey, Skey, Akey, Dkey);

    if (this.player.isMoving) {
      tileProgress += SPEED;
      helpers.player.handleMovement(this, SPEED);

      // runs after a tile is traveled
      if (tileProgress >= TILESIZE) {
        tileProgress = 0;
        this.player.isMoving = false;
        helpers.player.handleCollisions(this, this.player.x, this.player.y);
      }
    }
    if (Phaser.Input.Keyboard.JustDown(space)) {
      this.player.isInteracting = !this.player.isInteracting;
      console.log(this.player.isInteracting);
    }
  }
}

export default Overworld;
