const scoreSocket = createWebSocket("ws://127.0.0.1:8181/score");
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const boxSize = 20;
let snake = [
  { x: 2, y: 2 },
  { x: 1, y: 2 },
];
let food = { x: 5, y: 5 };
let score = 0;
let direction = "right";
let gameInterval;
let gameActive = false;

function createWebSocket(url) {
  var socket = new WebSocket(url);
  socket.onopen = function () {
    console.log("WebSocket connection established");
  };
  socket.onerror = function (error) {
    console.error("WebSocket error: ", error);
  };
  return socket;
}

function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

function moveSnake() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "right") headX++;
  if (direction === "left") headX--;
  if (direction === "up") headY--;
  if (direction === "down") headY++;

  const newHead = { x: headX, y: headY };
  snake.unshift(newHead);

  if (headX === food.x && headY === food.y) {
    score += 10;
    document.getElementById("score").innerText = score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / boxSize)),
      y: Math.floor(Math.random() * (canvas.height / boxSize)),
    };
  } else {
    snake.pop();
  }
}

function startGame() {
  if (!gameActive) {
    snake = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    score = 0;
    document.getElementById("score").innerText = score;
    direction = "right";
    gameInterval = setInterval(gameLoop, 100);
    gameActive = true;
  }
}

function gameOver() {
  clearInterval(gameInterval);
  gameActive = false;
  const finalScore = score;

  var name = document.getElementById("name").innerText;
  scoreSocket.send(
    JSON.stringify({
      name: name,
      score: finalScore,
    })
  );
  alert("Game Over! Your score: " + finalScore);
}

function checkCollision() {
  const headX = snake[0].x;
  const headY = snake[0].y;

  if (headX < 0 || headX * boxSize >= canvas.width || headY < 0 || headY * boxSize >= canvas.height) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === headX && snake[i].y === headY) {
      gameOver();
    }
  }
}

function changeDirection(e) {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
}

document.addEventListener("keydown", changeDirection);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  moveSnake();
  drawSnake();
  checkCollision();
}

document.getElementById("start-button").addEventListener("click", startGame);
