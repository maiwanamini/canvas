export class Fragment {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 12;
      this.collected = false;
      this.hue = Math.random() * 360;
    }
  
    draw(ctx) {
      if (this.collected) return;
  
      this.hue += 1;
      ctx.beginPath();
      ctx.fillStyle = `hsl(${this.hue % 360}, 100%, 60%)`;
      ctx.arc(this.x, this.y, this.radius + Math.sin(Date.now() / 100) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  