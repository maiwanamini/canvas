export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.color = "white";
    this.speed = 2;
    this.keys = {};

    window.addEventListener("keydown", (e) => this.keys[e.key] = true);
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);
  }

  update(isBlocked) {
    const next = { x: this.x, y: this.y };

    if (this.keys["ArrowUp"] || this.keys["z"]) next.y -= this.speed;
    if (this.keys["ArrowDown"] || this.keys["s"]) next.y += this.speed;
    if (this.keys["ArrowLeft"] || this.keys["q"]) next.x -= this.speed;
    if (this.keys["ArrowRight"] || this.keys["d"]) next.x += this.speed;

    const buffer = 10;
    const cx = next.x;
    const cy = next.y;

    if (
      !isBlocked(cx - buffer, cy) &&
      !isBlocked(cx + buffer, cy) &&
      !isBlocked(cx, cy - buffer) &&
      !isBlocked(cx, cy + buffer)
    ) {
      this.x = next.x;
      this.y = next.y;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  checkCollision(obj) {
    const dx = this.x - obj.x;
    const dy = this.y - obj.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius + obj.radius;
  }
}