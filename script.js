// Set canvas size
const canvas = document.getElementById('bouncing-balls');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Ball class
class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            this.dx = -this.dx * 0.95;
        }
        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
            this.dy = -this.dy * 0.95;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

// Superhero Bot Class
class Superhero {
    constructor() {
        this.element = document.getElementById('superhero-bot');
        this.modelViewer = this.element.querySelector('model-viewer');
        this.thinkingBubble = document.getElementById('thinking-bubble');

        this.modelViewer.addEventListener('error', () => {
            console.error('Model failed to load');
            this.element.innerHTML = `<div style="color:white">Model failed to load</div>`;
        });

        this.x = 50; // Start from left side
        this.y = -200; // Start off-screen top
        this.velocityY = 0;
        this.gravity = 1;
        this.bounce = -0.5;
        this.isWalking = false;
        this.reachedRight = false;

        this.updatePosition();
        this.addRotationEvents();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    fall() {
        if (this.reachedRight) return;

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y + 120 >= window.innerHeight - 10) {
            this.y = window.innerHeight - 120;
            this.velocityY *= this.bounce;

            if (!this.isWalking && Math.abs(this.velocityY) < 2) {
                this.startWalking();
            }
        }

        this.updatePosition();
    }

    startWalking() {
        this.isWalking = true;
        this.modelViewer.animationName = 'Walk';

        this.walkInterval = setInterval(() => {
            if (this.x < window.innerWidth - 150) {
                this.x += 3;
                this.updatePosition();
            } else {
                clearInterval(this.walkInterval);
                this.reachedRight = true;
                this.showThinkingBubble();
            }
        }, 3);
    }

    showThinkingBubble() {
        this.thinkingBubble.style.display = 'block';
    }

    addRotationEvents() {
        this.element.addEventListener('mouseenter', () => {
            this.modelViewer.style.transform = 'rotateY(180deg)';
        });

        this.element.addEventListener('mouseleave', () => {
            this.modelViewer.style.transform = 'rotateY(0deg)';
        });
    }
}

// Initialize objects
const balls = [];
const superhero = new Superhero();
const colors = ['rgba(239, 80, 80, 0.7)', 'rgba(74, 44, 109, 0.6)', 'rgba(106, 74, 141, 0.6)', 'rgba(229, 90, 90, 0.6)'];

function initializeBalls() {
    balls.length = 0;
    for (let i = 0; i < 100; i++) {
        const radius = Math.random() * 40 + 20;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 8;
        const dy = (Math.random() - 0.5) * 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, dx, dy, radius, color));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());

    if (!superhero.isWalking) {
        superhero.fall();
    }
}

setCanvasSize();
initializeBalls();
animate();
