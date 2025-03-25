document.addEventListener('DOMContentLoaded', () => {
// Initialize canvas and animations
    setCanvasSize();
    initializeBalls();
    animate();
    
    // Initialize superhero bot
    new Superhero();
});

// Add this resize handler
window.addEventListener('resize', () => {
    setCanvasSize();
    initializeBalls();
});

// Mobile Menu Toggle
function toggleNav() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    const nav = document.querySelector('nav');
    if (!event.target.closest('nav') && !event.target.closest('.mobile-menu')) {
        nav.classList.remove('active');
    }
});

// Canvas Initialization
const canvas = document.getElementById('bouncing-balls');
const ctx = canvas.getContext('2d');
let balls = [];
let animationFrameId;

// Responsive Setup
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Ball Class
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
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
        
        this.init();
    }

    init() {
        this.x = 50;
        this.y = -200;
        this.velocityY = 0;
        this.gravity = 1;
        this.bounce = -0.5;
        this.isWalking = false;
        this.reachedRight = false;

        this.modelViewer.addEventListener('error', () => {
            this.element.innerHTML = `<div style="color:white">3D Model Loading...</div>`;
        });

        this.addEventListeners();
        this.updatePosition();
    }

    addEventListeners() {
        if (this.isMobile) {
            this.element.addEventListener('touchstart', () => this.handleInteraction());
        } else {
            this.element.addEventListener('mouseenter', () => this.handleInteraction());
            this.element.addEventListener('mouseleave', () => this.resetRotation());
        }
    }

    handleInteraction() {
        this.modelViewer.style.transform = 'rotateY(180deg)';
        setTimeout(() => this.resetRotation(), 1000);
    }

    resetRotation() {
        this.modelViewer.style.transform = 'rotateY(0deg)';
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
        this.animateWalk();
    }

    animateWalk() {
        if (this.x < window.innerWidth - 150) {
            this.x += 3;
            this.updatePosition();
            requestAnimationFrame(() => this.animateWalk());
        } else {
            this.reachedRight = true;
            this.showThinkingBubble();
        }
    }

    showThinkingBubble() {
        this.thinkingBubble.style.display = 'block';
        this.thinkingBubble.style.right = '20px';
    }
}

// Initialize Objects
function initializeBalls() {
    balls = [];
    const colors = [
        'rgba(239, 80, 80, 0.7)',
        'rgba(74, 44, 109, 0.6)',
        'rgba(106, 74, 141, 0.6)',
        'rgba(229, 90, 90, 0.6)'
    ];

    for (let i = 0; i < 30; i++) { // Reduced number for mobile performance
        const radius = Math.random() * 30 + 15;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 6;
        const dy = (Math.random() - 0.5) * 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, dx, dy, radius, color));
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
    
    if (!superhero.isWalking) {
        superhero.fall();
    }
    animationFrameId = requestAnimationFrame(animate);
}

// Start Animation
function init() {
    setCanvasSize();
    initializeBalls();
    const superhero = new Superhero();
    animate();
}

// Handle Resize
window.addEventListener('resize', () => {
    setCanvasSize();
    initializeBalls();
    cancelAnimationFrame(animationFrameId);
    animate();
});

// Initialize Everything
document.addEventListener('DOMContentLoaded', init);
