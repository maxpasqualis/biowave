import { TILESIZE } from "./config";

function checkForInteractability(game, x, y) {
  // looks like a lot of code, but it's just a long switch case
  const gridCoords = getGridCoords(x, y);
  if (!game.player.interactable) {
    switch (game.player.direction) {
      case "up":
        if (game.interactMap[gridCoords.y - 1][gridCoords.x]) {
          game.player.interactable =
            game.interactMap[gridCoords.y - 1][gridCoords.x];
        }
        break;
      case "down":
        if (game.interactMap[gridCoords.y + 1][gridCoords.x]) {
          game.player.interactable =
            game.interactMap[gridCoords.y + 1][gridCoords.x];
        }
        break;
      case "left":
        if (game.interactMap[gridCoords.y][gridCoords.x - 1]) {
          game.player.interactable =
            game.interactMap[gridCoords.y][gridCoords.x - 1];
        }
        break;
      case "right":
        if (game.interactMap[gridCoords.y][gridCoords.x + 1]) {
          game.player.interactable =
            game.interactMap[gridCoords.y][gridCoords.x + 1];
        }
        break;
      default:
        game.player.interactable = null;
    }
  } else {
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
  //TODO: refactor some of these to include switch cases
  setSprite(game, upkey, downkey, leftkey, rightkey) {
    if (
      !game.player.isMoving &&
      !game.player.interactable &&
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
    } else if (!game.player.isMoving || game.player.interactable) {
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
    if (!game.player.interactable) {
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
    }
  },
  handleCollisions(game, x, y) {
    const gridCoords = getGridCoords(x, y);
    if (
      gridCoords.y - 1 <= -1 ||
      game.collisionMap[gridCoords.y - 1][gridCoords.x]
    ) {
      game.player.isColliding.up = true;
    } else {
      game.player.isColliding.up = false;
    }
    if (
      gridCoords.y + 1 >= game.collisionMap.length ||
      game.collisionMap[gridCoords.y + 1][gridCoords.x]
    ) {
      game.player.isColliding.down = true;
    } else {
      game.player.isColliding.down = false;
    }
    if (
      gridCoords.x - 1 <= -1 ||
      game.collisionMap[gridCoords.y][gridCoords.x - 1]
    ) {
      game.player.isColliding.left = true;
    } else {
      game.player.isColliding.left = false;
    }
    if (
      gridCoords.x + 1 >= game.collisionMap[0].length ||
      game.collisionMap[gridCoords.y][gridCoords.x + 1]
    ) {
      game.player.isColliding.right = true;
    } else {
      game.player.isColliding.right = false;
    }
  },
  getFlavorTextArray(game) {
    checkForInteractability(game, game.player.x, game.player.y);
    if (game.player.interactable) {
      return game.player.interactable.text;
    } else {
      return null;
    }
  },
};
const helpers = { getGridCoords, gridify, player };

export default helpers;
