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
    this.load.tilemapTiledJSON("map", "assets/tilemaps/debug-map.json");
    this.load.json("mapjson", "assets/tilemaps/debug-map.json");
    this.load.json("interactdata", "assets/interactables.json");
    this.load.spritesheet("player", "assets/sprites/temp-player.png", {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    }); // TEMP SPRITES - change later
  }

  create() {
    // loading sprites and tilemaps
    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("debug-tiles", "tiles");
    const bg = map.createLayer("background", tiles, 0, 0);
    // map.createLayer("collisions", tiles, 0, 0); // for debugging
    map.createLayer("walls", tiles, 0, 0);
    map.createLayer("interactable", tiles, 0, 0);
    this.player = this.add.image(80, 64, "player", 0);

    // get json data for checking collisions
    const mapJson = this.cache.json.get("mapjson");
    for (const layer of mapJson.layers) {
      if (layer.name === "collisions") {
        this.collisionMap = helpers.gridify(layer);
      }
    }
    // creates map of interactable objects
    this.interactionData = this.cache.json.get("interactdata");
    this.interactMap = [];
    for (let i = 0; i < mapJson.layers[0].height; i += 1) {
      this.interactMap.push([]);
      for (let j = 0; j < mapJson.layers[0].width; j += 1)
        this.interactMap[i].push(null);
    }

    for (const interactable of this.interactionData) {
      // places interactable zones
      for (const coordSet of interactable.coords) {
        interactable.timesInteracted = 0;
        this.interactMap[coordSet.y][coordSet.x] = interactable;
      }
    }

    // player setup
    this.player.setOrigin(0, 0);
    this.player.direction = "down";
    this.player.isMoving = false;
    this.player.isColliding = {
      up: false,
      left: false,
      down: false,
      right: false,
    };
    this.player.interactable = null;
    helpers.player.handleCollisions(this, this.player.x, this.player.y);

    // camera setup
    this.cameras.main.setBounds(0, 0, bg.width, bg.height, true).setZoom(5);
    this.cameras.main.startFollow(this.player);

    // control key registration
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
    if (Phaser.Input.Keyboard.JustDown(space) && !this.player.isMoving) {
      const flavorText = helpers.player.getFlavorTextArray(this);
      if (flavorText) {
        this.scene.launch("Textbox", {
          text: flavorText[this.player.interactable.timesInteracted],
        });
        if (this.player.interactable.timesInteracted < flavorText.length - 1) {
          this.player.interactable.timesInteracted += 1;
        }
      } else {
        this.scene.stop("Textbox");
      }
    }
  }
}

export default Overworld;
