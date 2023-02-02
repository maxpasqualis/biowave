import Phaser from "phaser";
import Overworld from "./overworld";
import Textbox from "./textbox";

export const WIDTH = 800;
export const HEIGHT = 600;
export const TILESIZE = 16;
// speed must be a factor of tilesize or it will break the grid system
// ex. if tilesize is 16, speeds include 0.2, 0.4, 0.5, 0.8, or 1
export const SPEED = 0.8;

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
  scene: [Overworld, Textbox],
};

export default config;
