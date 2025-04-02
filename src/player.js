export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.color = "aqua";
    this.speed = 2;
    this.keys = {};

    window.addEventListener("keydown", (e) => this.keys[e.key] = true);
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);
  }

  update() {
    if (this.keys["ArrowUp"] || this.keys["w"]) this.y -= this.speed;
    if (this.keys["ArrowDown"] || this.keys["s"]) this.y += this.speed;
    if (this.keys["ArrowLeft"] || this.keys["a"]) this.x -= this.speed;
    if (this.keys["ArrowRight"] || this.keys["d"]) this.x += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  checkCollision(npc) {
    const dx = this.x - npc.x;
    const dy = this.y - npc.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius + npc.radius;
  }
}