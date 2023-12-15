let cnv = document.getElementById("gameCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 500;

let world = {
  width: 3000,
  height: cnv.height,
};

let player = {
  x: 50,
  y: world.height - 50,
  width: 30,
  height: 30,
  color: "blue",
  speed: 5,
  jumping: false,
  jumpSpeed: -13,
  a: 0.5,
  jumpHeight: 300,
  jumpCount: 0,
  maxJumpCount: 40,
  velocityX: 0,
  velocityY: 0,
};

let platforms = [
  { x: 0, y: world.height - 30, width: world.width, height: 30 },
  { x: 200, y: world.height - 100, width: 150, height: 20 },
  { x: 400, y: world.height - 150, width: 150, height: 20 },
  { x: 600, y: world.height - 200, width: 150, height: 20 },
  { x: 800, y: world.height - 250, width: 150, height: 20 },
  { x: 0, y: world.height - 30, width: 150, height: 30 }, // Wall at the start
  { x: 800, y: world.height - 100, width: 150, height: 20 },
  { x: 1000, y: world.height - 150, width: 150, height: 20 },
  { x: 1200, y: world.height - 200, width: 150, height: 20 },
  { x: 1400, y: world.height - 150, width: 150, height: 20 },
  { x: 1600, y: world.height - 200, width: 150, height: 20 },
  { x: 1800, y: world.height - 225, width: 150, height: 20 },
  { x: 2000, y: world.height - 150, width: 150, height: 20 },
  { x: 2200, y: world.height - 100, width: 150, height: 20 },
  { x: 2200, y: world.height - 300, width: 150, height: 20 },
  { x: 2400, y: world.height - 150, width: 150, height: 20 },
  { x: 2600, y: world.height - 250, width: 150, height: 20 },
  { x: 2800, y: world.height - 300, width: 150, height: 20 },
];

let view = {
  width: cnv.width,
  height: cnv.height,
};

let leftPressed = false;
let rightPressed = false;

window.addEventListener("load", gameLoop);

function gameLoop() {
  draw();
}

function draw() {
  // Horizontal Movement
  let horizontalMovement = 0;
  if (leftPressed) horizontalMovement -= player.speed;
  if (rightPressed) horizontalMovement += player.speed;
  player.velocityX = horizontalMovement;

  // Update player position
  player.x += player.velocityX;
  player.x = constrain(player.x, 0, world.width - player.width);

  // Vertical Movement
  player.velocityY += player.a;
  player.y += player.velocityY;

  // Update view
  view.x = constrain(player.x - view.width / 2, 0, world.width - view.width);

  // Land on Ground
  if (player.y + player.height > cnv.height) {
    player.y = cnv.height - player.height;
    player.velocityY = 0;
  }

  // Draw
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - view.x, player.y, player.width, player.height);

  // Draw platforms
  ctx.fillStyle = "gray";
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    ctx.fillRect(
      platform.x - view.x,
      platform.y,
      platform.width,
      platform.height
    );

    // Check for collisions with platforms
    if (checkCollision(player, platform)) {
      // Teleport player to the top of the platform
      player.y = platform.y - player.height;
      player.jumping = false;
      player.jumpCount = 0;
      player.velocityY = 0;
    }
  }

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
  if (e.code === "ArrowLeft") leftPressed = true;
  else if (e.code === "ArrowRight") rightPressed = true;
  else if (e.code === "Space" && !player.jumping) player.velocityY = player.jumpSpeed;
}

function keyUp(e) {
  if (e.code === "ArrowLeft") leftPressed = false;
  else if (e.code === "ArrowRight") rightPressed = false;
}

function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function constrain(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
