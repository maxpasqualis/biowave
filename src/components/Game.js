import React, { Component } from "react";
import Phaser from "phaser";

class Game extends Component {
  componentDidMount() {
    var config = {
      type: Phaser.AUTO,
      parent: "game-container",
      backgroundColor: "#EBEBEB",
      width: 800,
      height: 600,
      scene: {
        create() {
          this.add
            .text(150, 60, "GAME")
            .setFontFamily("Arial")
            .setFontSize(80)
            .setOrigin(0.5)
            .setColor("#000000");
        },
      },
    };
    this.game = new Phaser.Game(config);
  }
  render() {
    return <div id="game-container"></div>;
  }
}

export default Game;
