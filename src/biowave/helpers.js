import { TILESIZE } from "./config";

function checkForInteractability(game, x, y) {
  // looks like a lot of code, but it's a switch case so it's decently efficient!
  const gridCoords = getGridCoords(x, y);
  switch (game.player.direction) {
    case "up":
      if (game.interactData[gridCoords.y - 1][gridCoords.x]) {
        game.player.interactable =
          game.interactData[gridCoords.y - 1][gridCoords.x];
      } else {
        game.player.interactable = null;
      }
      break;
    case "down":
      if (game.interactData[gridCoords.y + 1][gridCoords.x]) {
        game.player.interactable =
          game.interactData[gridCoords.y + 1][gridCoords.x];
      } else {
        game.player.interactable = null;
      }
      break;
    case "left":
      if (game.interactData[gridCoords.y][gridCoords.x - 1]) {
        game.player.interactable =
          game.interactData[gridCoords.y][gridCoords.x - 1];
      } else {
        game.player.interactable = null;
      }
      break;
    case "right":
      if (game.interactData[gridCoords.y][gridCoords.x + 1]) {
        game.player.interactable =
          game.interactData[gridCoords.y][gridCoords.x + 1];
      } else {
        game.player.interactable = null;
      }
      break;
    default:
      game.player.interactable = null;
  }
}

// EXPORTS
function getGridCoords(inputX, inputY) {
  const x = Math.round(inputX / TILESIZE);
  const y = Math.round(inputY / TILESIZE);
  return { x, y };
}

function gridify(layer) {
  const grid = [];
  for (let i = 0; i < layer.data.length; i += layer.width) {
    const chunk = layer.data.slice(i, i + layer.width);
    grid.push(chunk);
  }
  return grid;
}

const player = {
  setSprite(game, upkey, downkey, leftkey, rightkey) {
    if (
      !game.player.isMoving &&
      (upkey.isDown || leftkey.isDown || downkey.isDown || rightkey.isDown)
    ) {
      game.player.isMoving = true;
      if (upkey.isDown) {
        game.player.direction = "up";
        game.player.setTexture("player", 5);
      } else if (leftkey.isDown) {
        game.player.direction = "left";
        game.player.setTexture("player", 3);
      } else if (downkey.isDown) {
        game.player.direction = "down";
        game.player.setTexture("player", 1);
      } else if (rightkey.isDown) {
        game.player.direction = "right";
        game.player.setTexture("player", 7);
      }
    } else if (!game.player.isMoving) {
      if (game.player.direction === "up") {
        game.player.setTexture("player", 4);
      } else if (game.player.direction === "left") {
        game.player.setTexture("player", 2);
      } else if (game.player.direction === "down") {
        game.player.setTexture("player", 0);
      } else if (game.player.direction === "right") {
        game.player.setTexture("player", 6);
      }
    }
  },
  handleMovement(game, speed) {
    if (game.player.direction === "up" && !game.player.isColliding.up) {
      game.player.y -= speed;
    } else if (
      game.player.direction === "down" &&
      !game.player.isColliding.down
    ) {
      game.player.y += speed;
    } else if (
      game.player.direction === "left" &&
      !game.player.isColliding.left
    ) {
      game.player.x -= speed;
    } else if (
      game.player.direction === "right" &&
      !game.player.isColliding.right
    ) {
      game.player.x += speed;
    }
  },
  handleCollisions(game, x, y) {
    const gridCoords = getGridCoords(x, y);
    if (
      gridCoords.y - 1 <= -1 ||
      game.collisionData[gridCoords.y - 1][gridCoords.x]
    ) {
      game.player.isColliding.up = true;
    } else {
      game.player.isColliding.up = false;
    }
    if (
      gridCoords.y + 1 >= game.collisionData.length ||
      game.collisionData[gridCoords.y + 1][gridCoords.x]
    ) {
      game.player.isColliding.down = true;
    } else {
      game.player.isColliding.down = false;
    }
    if (
      gridCoords.x - 1 <= -1 ||
      game.collisionData[gridCoords.y][gridCoords.x - 1]
    ) {
      game.player.isColliding.left = true;
    } else {
      game.player.isColliding.left = false;
    }
    if (
      gridCoords.x + 1 >= game.collisionData[0].length ||
      game.collisionData[gridCoords.y][gridCoords.x + 1]
    ) {
      game.player.isColliding.right = true;
    } else {
      game.player.isColliding.right = false;
    }
  },
  initiateInteraction(game) {
    checkForInteractability(game, game.player.x, game.player.y);
  },
};
const helpers = { getGridCoords, gridify, player };

export default helpers;
