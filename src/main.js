import { Player } from './player.js';
import { drawMap, isBlocked, tileSize } from './world.js';
import { Fragment } from './fragment.js';
import { Enemy } from './enemy.js';

// Instellen van audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bgMusic = new Audio('assets/background-music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.2;
bgMusic.play();

const fragmentSound = new Audio('assets/fragment-collect.mp3');
fragmentSound.volume = 0.1;

const enemyHitSound = new Audio('assets/enemy-hit.mp3');
enemyHitSound.volume = 0.1;

const portalSound = new Audio('assets/portal-open.mp3');
portalSound.volume = 0.2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const player = new Player(0, 0);
let currentZoneIndex = 0;
let portalVisible = false;
let portalPos = { x: 0, y: 0 };
let fragments = [];
let enemies = [];
let health = 5;
const maxHealth = 5;

const zones = [
  { name: "Gray Garden", fragmentCount: 2, enemyCount: 1 },
  { name: "Azure Grove", fragmentCount: 3, enemyCount: 2 },
  { name: "Crimson Hollow", fragmentCount: 4, enemyCount: 3 }
];

// Verkrijg vrije tegel zonder blokkades
function getFreeTile() {
  let x, y;
  do {
    x = Math.floor(Math.random() * 14 + 1);
    y = Math.floor(Math.random() * 7 + 1);
  } while (isBlocked(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2));
  return [x * tileSize + tileSize / 2, y * tileSize + tileSize / 2];
}

function setupZone(index) {
  const zone = zones[index];
  portalVisible = false;
  portalPos = { x: 0, y: 0 };
  fragments = [];
  enemies = [];

  const [px, py] = getFreeTile();
  player.x = px;
  player.y = py;

  for (let i = 0; i < zone.fragmentCount; i++) {
    const [fx, fy] = getFreeTile();
    fragments.push(new Fragment(fx, fy));
  }

  for (let i = 0; i < zone.enemyCount; i++) {
    const [ex, ey] = getFreeTile();
    enemies.push(new Enemy(ex, ey, 1 + index * 0.5));
  }
}
setupZone(currentZoneIndex);

// Update de UI met zone en gezondheid
function updateUI() {
  const status = document.getElementById("status");
  const heartDisplay = document.getElementById("hearts");
  const collected = fragments.filter(f => f.collected).length;
  const total = fragments.length;
  status.innerText = `Zone: ${zones[currentZoneIndex].name} | Fragments: ${collected}/${total}`;
  heartDisplay.innerText = "❤️".repeat(health) + "🤍".repeat(maxHealth - health);
}

// Gloweffect voor portal
function drawPortal() {
  const { x, y } = portalPos;
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill();

  const dx = player.x - x;
  const dy = player.y - y;
  if (Math.sqrt(dx * dx + dy * dy) < player.radius + 25) {
    currentZoneIndex++;
    if (currentZoneIndex >= zones.length) {
      alert("✨ You completed all zones!");
      currentZoneIndex = 0;
    }
    health = maxHealth;
    setupZone(currentZoneIndex);
    portalSound.play();
  }
}

// Esthetisch verbeteren: Glow-effecten voor speler en fragmenten
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = 'cyan';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawFragment(fragment) {
  ctx.beginPath();
  ctx.arc(fragment.x, fragment.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = fragment.collected ? 'gray' : 'yellow';
  ctx.fill();
}

// Verbeterde game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(ctx);
  drawPlayer();
  player.update(isBlocked);
  player.draw(ctx);

  enemies.forEach(enemy => {
    const oldX = enemy.x;
    const oldY = enemy.y;
    enemy.update();
    if (isBlocked(enemy.x, enemy.y)) {
      enemy.x = oldX;
      enemy.y = oldY;
      enemy.direction *= -1;
    }
    enemy.draw(ctx);
    if (enemy.checkCollision(player)) {
      health--;
      enemyHitSound.play();
      if (health <= 0) {
        alert("💀 Game Over!");
        health = maxHealth;
        currentZoneIndex = 0;
        setupZone(0);
        return;
      }
      const [px, py] = getFreeTile();
      player.x = px;
      player.y = py;
    }
  });

  let collectedCount = 0;
  fragments.forEach(fragment => {
    if (!fragment.collected && player.checkCollision(fragment)) {
      fragment.collected = true;
      fragmentSound.play();
    }
    drawFragment(fragment);
    if (fragment.collected) collectedCount++;
  });

  if (collectedCount === fragments.length) {
    if (!portalVisible) {
      const [px, py] = getFreeTile();
      portalPos = { x: px, y: py };
      portalVisible = true;
    }
    drawPortal();
  }

  updateUI();
  requestAnimationFrame(gameLoop);
}

gameLoop();
