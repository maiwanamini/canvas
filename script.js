// Generative Canvas Experiment - Final Version

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    this.speed = Math.random() * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.noiseOffset = Math.random() * 1000;
  }

  update(audioLevel = 1) {
    const noiseScale = 0.005;
    const n = noise.perlin2(this.x * noiseScale, this.y * noiseScale);
    this.angle += n * 2 * Math.PI;
    this.x += Math.cos(this.angle) * this.speed * audioLevel;
    this.y += Math.sin(this.angle) * this.speed * audioLevel;

    if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
    if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = Array.from({ length: 150 }, () => new Particle());

// Mouse interaction
const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Audio input
let audioLevel = 1;
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);

  function updateAudio() {
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    audioLevel = 1 + avg / 100;
    requestAnimationFrame(updateAudio);
  }
  updateAudio();
});

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.angle += 0.05; // repulse effect
    }
    p.update(audioLevel);
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}
animate();