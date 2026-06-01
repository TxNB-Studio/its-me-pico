/*
 * Particles.js - Custom Canvas Floating Particles for It's Me Pico
 * Renders smooth floating tile blocks in the background
 */

class FloatingParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 25;
    
    // Core game theme colors for particles
    this.colors = [
      'rgba(255, 221, 0, 0.15)',  // Pico Yellow
      'rgba(155, 81, 224, 0.15)', // Shadow Purple
      'rgba(255, 71, 87, 0.1)',   // Devil Red
      'rgba(46, 213, 115, 0.12)'  // Teal/Blue
    ];

    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  init() {
    this.resize();
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const size = Math.random() * 30 + 15; // Square size
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height + this.canvas.height, // Start off-screen bottom
      size: size,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      speedY: -(Math.random() * 0.6 + 0.2), // Upward speed
      speedX: (Math.random() * 0.4 - 0.2), // Slight drift
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.01 - 0.005)
    };
  }

  drawParticle(p) {
    this.ctx.save();
    this.ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
    this.ctx.rotate(p.rotation);
    this.ctx.fillStyle = p.color;
    
    // Draw rounded/low-poly tiles
    this.ctx.beginPath();
    const radius = 6; // Rounded corner
    this.ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size, radius);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      
      // Recycle particles when they exit the top
      if (p.y + p.size < 0) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = this.canvas.height + 20;
      }
      
      this.drawParticle(p);
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialise on load
document.addEventListener('DOMContentLoaded', () => {
  new FloatingParticles('particles-canvas');
});
