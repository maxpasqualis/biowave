import React, { Component } from "react";
import Phaser from "phaser";

const WIDTH = 800;
const HEIGHT = 600;
const TILESIZE = 16;
const SPEED = 0.5;

class Game extends Component {
  componentDidMount() {
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
      this.player = this.add.image(80, 80, "player");
      this.player.setOrigin(0, 0);
      this.player.direction = "down";

      this.cameras.main.setBounds(0, 0, bg.width, bg.height, true).setZoom(3);

      this.cursors = this.input.keyboard.createCursorKeys();

      Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }

    function update(time, delta) {
      // this.player.body.setVelocity(0);
      if (Wkey.isDown) {
        this.player.direction = "up";
        this.player.y -= SPEED;
        console.log(this.player);
      }
      if (!Wkey.isDown && this.player.y % TILESIZE) {
        if (this.player.direction === "up") {
          this.player.y -= SPEED;
        }
      }
    }
  }
  render() {
    return <div id="game-container"></div>;
  }
}

export default Game;
