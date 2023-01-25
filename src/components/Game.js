import React, { Component } from "react";
import Phaser from "phaser";

const WIDTH = 800;
const HEIGHT = 600;

class Game extends Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      parent: "game-container",
      backgroundColor: "#EBEBEB",
      width: WIDTH,
      height: HEIGHT,
      pixelArt: true,
      scene: {
        preload: preload,
        create: create,
        // update: update,
      },
    };
    this.game = new Phaser.Game(config);

    function preload() {
      this.load.image("tiles", "assets/tilemaps/debug-tiles.png");
      this.load.tilemapTiledJSON("map", "assets/tilemaps/debug-map.json");
    }

    function create() {
      const map = this.make.tilemap({ key: "map" });
      const tiles = map.addTilesetImage("debug-tiles", "tiles");
      const bg = map.createLayer("background", tiles, 0, 0);
      const walls = map.createLayer("walls", tiles, 0, 0);

      this.cameras.main.setBounds(0, 0, bg.width, bg.height, true).setZoom(5);
    }

    // function update(time, delta){}
  }
  render() {
    return <div id="game-container"></div>;
  }
}

export default Game;
