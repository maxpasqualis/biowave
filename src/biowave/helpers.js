import { TILESIZE } from "./config";

function getGridCoords(inputX, inputY) {
  const x = Math.round(inputX / TILESIZE);
  const y = Math.round(inputY / TILESIZE);
  return { x, y };
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
      game.collisionData[gridCoords.y - 1][gridCoords.x] > 0
    ) {
      game.player.isColliding.up = true;
    } else {
      game.player.isColliding.up = false;
    }
    if (
      gridCoords.y + 1 >= game.collisionData.length ||
      game.collisionData[gridCoords.y + 1][gridCoords.x] > 0
    ) {
      game.player.isColliding.down = true;
    } else {
      game.player.isColliding.down = false;
    }
    if (
      gridCoords.x - 1 <= -1 ||
      game.collisionData[gridCoords.y][gridCoords.x - 1] > 0
    ) {
      game.player.isColliding.left = true;
    } else {
      game.player.isColliding.left = false;
    }
    if (
      gridCoords.x + 1 >= game.collisionData[0].length ||
      game.collisionData[gridCoords.y][gridCoords.x + 1] > 0
    ) {
      game.player.isColliding.right = true;
    } else {
      game.player.isColliding.right = false;
    }
  },
};
const helpers = { getGridCoords, player };

export default helpers;
