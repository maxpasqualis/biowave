import Phaser from "phaser";
import { WIDTH, HEIGHT } from "./config";

class Textbox extends Phaser.Scene {
  constructor() {
    super("Textbox");
  }

  init(data) {
    console.log("init", data);
    this.textToRender = data.text;
  }

  preload() {
    this.BOXWIDTH = WIDTH - 50;
    this.BOXHEIGHT = HEIGHT / 4;
    this.BOXX = 25;
    this.BOXY = HEIGHT - (this.BOXHEIGHT + 25);
  }
  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(10, 0xffffff);
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.strokeRect(
      this.BOXX,
      this.BOXY,
      this.BOXWIDTH,
      this.BOXHEIGHT
    );
    this.graphics.fillRect(this.BOXX, this.BOXY, this.BOXWIDTH, this.BOXHEIGHT);

    this.add.text(this.BOXX + 25, this.BOXY + 25, `${this.textToRender}`);
  }
  update() {}
}

export default Textbox;
