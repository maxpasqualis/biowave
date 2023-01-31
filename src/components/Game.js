import React, { Component } from "react";
import Phaser from "phaser";
import config from "../biowave/config";

class Game extends Component {
  componentDidMount() {
    this.game = new Phaser.Game(config);
  }
  render() {
    return <div id="game-container"></div>;
  }
}

export default Game;
