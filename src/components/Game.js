import React, { Component } from "react";
import Phaser from "phaser";

const WIDTH = 800;
const HEIGHT = 600;
const TILESIZE = 16;
// speed must be a factor of tilesize or it will break the grid system
// ex. if tilesize is 16, speeds include 0.2, 0.4, 0.5, 0.8, or 1
const SPEED = 0.8;
var tileProgress = 0;

class Game extends Component {
  componentDidMount() {
    // ==================== CONFIG + SETUP ====================

    const config = {
      type: Phaser.AUTO,
      parent: "game-container",
      backgroundColor: "#EBEBEB",
      width: WIDTH,
      height: HEIGHT,
      pixelArt: true,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 } },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    var Wkey, Akey, Skey, Dkey;
    this.game = new Phaser.Game(config);

    // ==================== MAIN GAME FUNCTIONS ====================

    function preload() {
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

    function create() {
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

    function update(time, delta) {
      if (
        !this.player.isMoving &&
        (Wkey.isDown || Akey.isDown || Skey.isDown || Dkey.isDown)
      ) {
        this.player.isMoving = true;
        if (Wkey.isDown) {
          this.player.direction = "up";
        } else if (Akey.isDown) {
          this.player.direction = "left";
        } else if (Skey.isDown) {
          this.player.direction = "down";
        } else if (Dkey.isDown) {
          this.player.direction = "right";
        }
      }

      if (this.player.isMoving) {
        // attempted grid fix.. needs more work
        if (tileProgress + SPEED > TILESIZE) {
          tileProgress = TILESIZE;
        } else {
          tileProgress += SPEED;
        }

        if (this.player.direction === "up" && !this.player.isColliding.up) {
          this.player.y -= SPEED;
        } else if (
          this.player.direction === "down" &&
          !this.player.isColliding.down
        ) {
          this.player.y += SPEED;
        } else if (
          this.player.direction === "left" &&
          !this.player.isColliding.left
        ) {
          this.player.x -= SPEED;
        } else if (
          this.player.direction === "right" &&
          !this.player.isColliding.right
        ) {
          this.player.x += SPEED;
        }
        if (tileProgress >= TILESIZE) {
          tileProgress = 0;
          this.player.isMoving = false;
          const gridX = Math.round(this.player.x / TILESIZE);
          const gridY = Math.round(this.player.y / TILESIZE);

          if (this.collisionData[gridY - 1][gridX] > 0) {
            this.player.isColliding.up = true;
          } else {
            this.player.isColliding.up = false;
          }
          if (this.collisionData[gridY + 1][gridX] > 0) {
            this.player.isColliding.down = true;
          } else {
            this.player.isColliding.down = false;
          }
          if (this.collisionData[gridY][gridX - 1] > 0) {
            this.player.isColliding.left = true;
          } else {
            this.player.isColliding.left = false;
          }
          if (this.collisionData[gridY][gridX + 1] > 0) {
            this.player.isColliding.right = true;
          } else {
            this.player.isColliding.right = false;
          }
          console.log(`${gridX} ${gridY}`);
          console.log(this.player.isColliding);
        }
      }
    }
  }
  render() {
    return <div id="game-container"></div>;
  }
}

export default Game;
