export class Enemy {
    constructor(x, y, speed = 1) {
      this.x = x;
      this.y = y;
      this.radius = 15;
      this.speed = speed;
      this.direction = Math.random() < 0.5 ? 1 : -1;
      this.axis = Math.random() < 0.5 ? 'x' : 'y';
    }
  
    update() {
      if (this.axis === 'x') {
        this.x += this.speed * this.direction;
        if (this.x < 0 || this.x > innerWidth) this.direction *= -1;
      } else {
        this.y += this.speed * this.direction;
        if (this.y < 0 || this.y > innerHeight) this.direction *= -1;
      }
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  
    checkCollision(player) {
      const dx = this.x - player.x;
      const dy = this.y - player.y;
      return Math.sqrt(dx * dx + dy * dy) < this.radius + player.radius;
    }
  }
  