// Interactive Particles System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

class Particle {
    constructor() {
        this.reset(true);
        this.baseSize = Math.random() * 2 + 1;
    }

    reset(initial = false) {
        this.x = initial ? Math.random() * canvas.width : -this.size;
        this.y = initial ? Math.random() * canvas.height : -this.size;
        this.size = this.baseSize;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.alpha = 0.1;
    }

    update() {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.speedX -= directionX * force;
            this.speedY -= directionY * force;
        }

        // Boundary checks
        if (this.x > canvas.width + this.size || this.x < -this.size) this.reset();
        if (this.y > canvas.height + this.size || this.y < -this.size) this.reset();

        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.99;
        this.speedY *= 0.99;

        // Alpha transition
        this.alpha = Math.min(0.5, this.alpha + 0.01);
    }

    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Canvas Setup
function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Mouse Tracking
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Touch Support
window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: false });

// Responsive Handling
window.addEventListener('resize', () => {
    initParticles();
    document.querySelectorAll('.section-container').forEach(container => {
        container.style.backdropFilter = 'blur(12px)';
    });
});

// Mobile Navigation
function toggleNav() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    navMenu.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'menu-ripple';
    mobileMenu.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Close mobile menu after click
        if (window.innerWidth <= 768) {
            toggleNav();
        }
    });
});

// Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.25 });

document.querySelectorAll('.section-container, .expertise-card').forEach(el => {
    observer.observe(el);
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    animate();
    
    // Initialize mouse position
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
});