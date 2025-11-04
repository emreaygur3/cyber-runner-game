const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

// Game constants
const groundY = 150;
const gravity = 0.7;
const jumpForce = -12;
const speed = 5;

let frame = 0;
let score = 0;
let gameOver = false;

// Player
const player = {
  x: 60,
  y: groundY - 30,
  w: 30,
  h: 30,
  vy: 0,
  isJumping: false,
};

// Obstacles (bugs)
const bugs = [];

function spawnBug() {
  const size = 20 + Math.random() * 10;
  bugs.push({
    x: canvas.width + 10,
    y: groundY - size,
    w: size,
    h: size,
    passed: false,
  });
}

function resetGame() {
  bugs.length = 0;
  score = 0;
  frame = 0;
  gameOver = false;
  player.y = groundY - player.h;
  player.vy = 0;
}

function update() {
  if (gameOver) {
    draw();
    drawGameOver();
    return;
  }

  frame++;

  // Spawn bugs
  if (frame % 70 === 0) {
    spawnBug();
  }

  // Player physics
  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.isJumping = false;
  }

  // Move bugs & check collisions
  for (let i = bugs.length - 1; i >= 0; i--) {
    const b = bugs[i];
    b.x -= speed;

    // Collision
    if (
      player.x < b.x + b.w &&
      player.x + player.w > b.x &&
      player.y < b.y + b.h &&
      player.y + player.h > b.y
    ) {
      gameOver = true;
    }

    // Score
    if (!b.passed && b.x + b.w < player.x) {
      b.passed = true;
      score++;
      scoreEl.textContent = score;
    }

    // Remove off-screen
    if (b.x + b.w < 0) {
      bugs.splice(i, 1);
    }
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background grid
  ctx.save();
  ctx.strokeStyle = "rgba(30,64,175,0.3)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Ground line
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  // Player (cyber cube)
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.strokeStyle = "#0ea5e9";
  ctx.strokeRect(player.x, player.y, player.w, player.h);

  // Bugs
  bugs.forEach((b) => {
    ctx.fillStyle = "#f97316";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = "#111827";
    ctx.fillRect(b.x + b.w * 0.2, b.y + b.h * 0.2, b.w * 0.2, b.h * 0.2);
    ctx.fillRect(b.x + b.w * 0.6, b.y + b.h * 0.2, b.w * 0.2, b.h * 0.2);
  });
}

function drawGameOver() {
  ctx.fillStyle = "rgba(15,23,42,0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "28px Fira Code, monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

  ctx.font = "16px Fira Code, monospace";
  ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 20);
}

function jump() {
  if (!player.isJumping && !gameOver) {
    player.vy = jumpForce;
    player.isJumping = true;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    jump();
  }
  if (e.code === "KeyR" && gameOver) {
    resetGame();
    update();
  }
});

// start
draw();
requestAnimationFrame(update);
