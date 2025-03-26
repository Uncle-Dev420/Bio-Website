// Set canvas size and context
const canvas = document.getElementById('bouncing-balls');
const ctx = canvas.getContext('2d');
let balls = [];

// Canvas sizing
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Ball Class
class Ball {
    constructor() {
        this.reset();
    }

    reset() {
        this.radius = Math.random() * 20 + 10;
        this.x = Math.random() * canvas.width;
        this.y = -this.radius;
        this.dx = (Math.random() - 0.5) * 8;
        this.dy = Math.random() * 4 + 2;
        this.color = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.8)`;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.y > canvas.height + this.radius) this.reset();
        if (this.x < 0 || this.x > canvas.width) this.dx *= -0.8;
        
        this.dy += 0.1;
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

// Initialize balls
function initBalls() {
    for (let i = 0; i < 50; i++) {
        balls.push(new Ball());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('load', () => {
    setCanvasSize();
    initBalls();
    animate();
});

window.addEventListener('resize', () => {
    setCanvasSize();
    balls = [];
    initBalls();
});

// Mobile Menu Toggle
function toggleNav() {
    document.querySelector('nav').classList.toggle('active');
}