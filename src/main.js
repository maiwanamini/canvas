import { Player } from './player.js';
import { NPC } from './npc.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player(canvas.width / 2, canvas.height / 2);
const npcs = [new NPC(200, 150), new NPC(600, 400)];
let currentQuest = "Find the glowing NPC!";

function drawBackground() {
  ctx.fillStyle = "rgba(0, 0, 20, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawUI() {
  document.getElementById("questBox").innerText = "Quest: " + currentQuest;
}

function gameLoop() {
  drawBackground();
  player.update();
  player.draw(ctx);

  for (const npc of npcs) {
    npc.draw(ctx);
    if (player.checkCollision(npc)) {
      npc.interact();
      currentQuest = "Quest complete!";
    }
  }

  drawUI();
  requestAnimationFrame(gameLoop);
}

gameLoop();