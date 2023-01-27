import React, { Component } from "react";
import Phaser from "phaser";

const WIDTH = 800;
const HEIGHT = 600;
const TILESIZE = 16;
const SPEED = 0.5;
var tileProgress = 0;

class Game extends Component {
  componentDidMount() {
    // ==================== CONFIG ====================
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
      this.load.tilemapTiledJSON("map", "assets/tilemaps/debug-map.json");
      this.load.spritesheet("player", "assets/sprites/temp-player.png", {
        frameWidth: TILESIZE,
        frameHeight: TILESIZE,
      }); // TEMP SPRITES - change later
    }

    function create() {
      const map = this.make.tilemap({ key: "map" });
      const tiles = map.addTilesetImage("debug-tiles", "tiles");
      const bg = map.createLayer("background", tiles, 0, 0);
      const walls = map.createLayer("walls", tiles, 0, 0);
      // this.player = this.physics.add.sprite(100, 100, "player", 0);
      this.player = this.add.image(80, 80, "player", 0);
      this.player.setOrigin(0, 0);
      this.player.direction = "down";
      this.player.isMoving = false;

      this.cameras.main.setBounds(0, 0, bg.width, bg.height, true).setZoom(3);

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
        if (this.player.direction === "up") {
          this.player.y -= SPEED;
        } else if (this.player.direction === "down") {
          this.player.y += SPEED;
        } else if (this.player.direction === "left") {
          this.player.x -= SPEED;
        } else if (this.player.direction === "right") {
          this.player.x += SPEED;
        }
        tileProgress += SPEED;
        if (tileProgress >= TILESIZE) {
          tileProgress = 0;
          this.player.isMoving = false;
        }
      }
    }
  }
  render() {
    return <div id="game-container"></div>;
  }
}

export default Game;
