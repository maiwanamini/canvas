export class NPC {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.color = "lime";
    this.interacted = false;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.interacted ? "gray" : this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  interact() {
    if (!this.interacted) {
      this.interacted = true;
      console.log("You found the glowing NPC!");
    }
  }
}