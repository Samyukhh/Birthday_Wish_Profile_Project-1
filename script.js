// ==========================================
// INITIALIZATION
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ==========================================
// CUSTOM CURSOR & MAGNETIC ELEMENTS
// ==========================================
// Custom Cursor removed for performance.

// Magnetic Buttons Effect
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    });
});

// Navbar completely removed per user request.

// Celebrate Button
const celebrateBtn = document.getElementById('celebrate-btn');
if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
        if(typeof burstConfetti === 'function') burstConfetti();
        lenis.scrollTo('#wishes', { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    });
}

// ==========================================
// ANIMATIONS
// ==========================================

// Initial Hero Reveal
const heroTl = gsap.timeline();
heroTl.from('.hero-bg-text', { y: 100, opacity: 0, duration: 1.5, ease: 'power4.out' })
      .from('.hero-portrait', { scale: 0.8, opacity: 0, filter: 'blur(10px)', duration: 1.5, ease: 'power3.out' }, "-=1")
      .from('.floating-card', { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: 'power2.out' }, "-=1");

// Mouse Parallax for Hero Elements (slowed down)
const heroSection = document.getElementById('hero');

// Utility: Throttle function to limit event firing rate
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

heroSection.addEventListener('mousemove', throttle((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    gsap.to('.hero-bg-text', { x: x * 2, y: y * 2, duration: 4, ease: 'power2.out' });
    gsap.to('.hero-portrait', { x: x * -1, y: y * -1, duration: 4, ease: 'power2.out' });
    gsap.to('.card-1', { x: x * 3, y: y * 3, duration: 4, ease: 'power2.out' });
    gsap.to('.card-2', { x: x * -2, y: y * -2, duration: 4, ease: 'power2.out' });
    gsap.to('.card-3', { x: x * 1.5, y: y * 1.5, duration: 4, ease: 'power2.out' });
}, 50));

// Scroll Parallax Images
gsap.utils.toArray('.parallax-img').forEach(img => {
    const speed = img.dataset.speed || 1;
    gsap.to(img, {
        y: () => (window.innerHeight * -0.2) * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// Reveal Sections (Fade + Slide)
gsap.utils.toArray('.split-text').forEach(title => {
    gsap.from(title, {
        y: 100,
        opacity: 0,
        duration: 2.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Masonry Grid Reveal
gsap.from('.masonry-item', {
    y: 100,
    opacity: 0,
    stagger: 0.2,
    duration: 2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.masonry-grid',
        start: 'top 80%',
    }
});

// Story Cards Flow
gsap.utils.toArray('.card-parallax').forEach(card => {
    const speed = card.dataset.speed || 1;
    gsap.fromTo(card, 
        { y: 150, opacity: 0, rotation: Math.random() * 10 - 5 },
        { 
            y: -50 * speed, opacity: 1, rotation: 0,
            duration: 2.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'bottom top',
                scrub: 1
            }
        }
    );
});

// Final Gallery Reveal
gsap.from('.grid-item', {
    scale: 0.9,
    opacity: 0,
    stagger: 0.2,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.final-gallery',
        start: 'top 75%'
    }
});

// ==========================================
// BUTTERFLIES ANIMATION SYSTEM
// ==========================================
const butterflyContainer = document.getElementById('butterflies-container');
const numButterflies = window.innerWidth < 768 ? 8 : 15;

function createButterfly() {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    
    // Dynamic color based on OS Theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let color;
    if (isDark) {
        color = '#FFFFFF';
        butterfly.classList.add('dark-mode-butterfly');
    } else {
        const colors = ['#F8C8DC', '#D8C4F4', '#FFE5D4', '#FADADD', '#FFF9F4', '#F6B6C9'];
        color = colors[Math.floor(Math.random() * colors.length)];
    }
    butterfly.style.setProperty('--b-color', color);
    
    // Random size modifier
    const sizeScale = Math.random() * 0.6 + 0.4;
    butterfly.style.transform = `scale(${sizeScale})`;
    // Store size to use in animation later
    butterfly.dataset.scale = sizeScale;
    
    const leftWing = document.createElement('div');
    leftWing.className = 'wing left-wing';
    
    const rightWing = document.createElement('div');
    rightWing.className = 'wing right-wing';
    
    butterfly.appendChild(leftWing);
    butterfly.appendChild(rightWing);
    butterflyContainer.appendChild(butterfly);
    
    return butterfly;
}

function animateButterfly(butterfly) {
    // Random start position within viewport
    let currentX = Math.random() * window.innerWidth;
    let currentY = Math.random() * window.innerHeight;
    gsap.set(butterfly, { x: currentX, y: currentY });

    function flyToNextPoint() {
        const nextX = -100 + Math.random() * (window.innerWidth + 200);
        const nextY = -100 + Math.random() * (window.innerHeight + 200);
        
        const dx = nextX - currentX;
        const dy = nextY - currentY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        const duration = distance / (15 + Math.random() * 15);

        gsap.to(butterfly, {
            duration: duration,
            ease: "none",
            x: nextX,
            y: nextY,
            rotation: rotation,
            onComplete: flyToNextPoint
        });
    }

    flyToNextPoint();
}

// Generate Butterflies
for (let i = 0; i < numButterflies; i++) {
    setTimeout(() => {
        const b = createButterfly();
        animateButterfly(b);
    }, i * 200); 
}

// ==========================================
// DYNAMIC BUTTERFLY THEMING (Removed: Handled by OS Sync)
// ==========================================

// ==========================================
// SPARKLES & PETALS ANIMATION SYSTEM
// ==========================================
const sparklesContainer = document.getElementById('sparkles-container');

function createSparkles(count) {
    if (!sparklesContainer) return;
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparklesContainer.appendChild(sparkle);
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        gsap.set(sparkle, { x: startX, y: startY, scale: Math.random() * 0.8 + 0.2 });
        
        gsap.to(sparkle, {
            y: "-=" + (30 + Math.random() * 70),
            x: "+=" + (Math.random() * 40 - 20),
            opacity: Math.random() * 0.5 + 0.3,
            duration: 4 + Math.random() * 5, // very slow twinkling
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 3
        });
    }
}

function createPetals(count) {
    if (!sparklesContainer) return;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        sparklesContainer.appendChild(petal);
        
        animatePetal(petal);
    }
}

function animatePetal(petal) {
    // Start above screen
    const startX = Math.random() * window.innerWidth;
    const startY = -50 - Math.random() * 200;
    const scale = Math.random() * 0.6 + 0.4;
    
    gsap.set(petal, { x: startX, y: startY, scale: scale, rotationZ: Math.random() * 360, rotationX: Math.random() * 360, opacity: 0.6 + Math.random() * 0.3 });
    
    const endX = startX + (Math.random() * 300 - 150); // drift left/right
    const endY = window.innerHeight + 100;
    const duration = 25 + Math.random() * 25; // extremely slow falling
    
    gsap.to(petal, {
        y: endY,
        x: endX,
        rotationZ: "+=" + (Math.random() * 360 - 180),
        rotationX: "+=" + (Math.random() * 360 - 180),
        duration: duration,
        ease: "none",
        onComplete: () => {
            animatePetal(petal); // reset and fall again
        }
    });
}

createSparkles(40);
// ==========================================
// CONTINUOUS BREATHING & FLOATING
// ==========================================
// Images Gently Breathing
gsap.utils.toArray('.placeholder-img, .placeholder-video').forEach(img => {
    gsap.to(img, {
        scale: 1.05,
        duration: 8 + Math.random() * 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
});

// Cards Gently Floating (Scrapbook Scattered Style)
gsap.utils.toArray('.glassmorphism, .masonry-item, .grid-item, .hero-portrait').forEach(card => {
    // Set a scattered base rotation for the scrapbook look
    const baseRotation = (Math.random() * 8 - 4);
    gsap.set(card, { rotationZ: baseRotation });
    
    gsap.to(card, {
        yPercent: "-=" + (2 + Math.random() * 4), 
        rotationZ: baseRotation + (Math.random() * 2 - 1), // wiggle slightly around the scatter angle
        duration: 6 + Math.random() * 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
});

// ==========================================
// BIRTHDAY ELEMENTS (Stars, Hearts, Balloons, Confetti)
// ==========================================
function createStars(count) {
    if (!sparklesContainer) return;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        sparklesContainer.appendChild(star);
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        gsap.set(star, { x: startX, y: startY, scale: Math.random() * 0.5 + 0.5 });
        
        gsap.to(star, {
            rotationZ: "+=180",
            opacity: Math.random() * 0.4 + 0.2,
            duration: 5 + Math.random() * 5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 5
        });
    }
}

function createHearts(count) {
    if (!sparklesContainer) return;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        sparklesContainer.appendChild(heart);
        
        animateHeart(heart);
    }
}

function animateHeart(heart) {
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 100;
    const scale = Math.random() * 0.5 + 0.5;
    
    gsap.set(heart, { x: startX, y: startY, scale: scale, opacity: 0.2 + Math.random() * 0.3 });
    
    gsap.to(heart, {
        y: -100,
        x: startX + (Math.random() * 200 - 100),
        duration: 15 + Math.random() * 20,
        ease: "none",
        onComplete: () => animateHeart(heart)
    });
}

function createBalloons(count) {
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        const bColors = ['rgba(248, 200, 220, 0.4)', 'rgba(216, 196, 244, 0.4)', 'rgba(255, 229, 212, 0.4)'];
        balloon.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${bColors[Math.floor(Math.random() * bColors.length)]})`;
        
        const size = 80 + Math.random() * 100;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;
        
        document.body.appendChild(balloon);
        
        animateBalloon(balloon);
    }
}

function animateBalloon(balloon) {
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 200;
    
    gsap.set(balloon, { x: startX, y: startY, rotationZ: (Math.random() * 20 - 10) });
    
    gsap.to(balloon, {
        y: -300,
        x: startX + (Math.random() * 100 - 50),
        rotationZ: (Math.random() * 40 - 20),
        duration: 30 + Math.random() * 30,
        ease: "none",
        onComplete: () => animateBalloon(balloon)
    });
}

function burstConfetti() {
    const numConfetti = 50;
    for (let i = 0; i < numConfetti; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        document.body.appendChild(conf);
        
        const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
        const startY = -50;
        
        gsap.set(conf, { x: startX, y: startY, rotationZ: Math.random() * 360, rotationX: Math.random() * 360 });
        
        gsap.to(conf, {
            x: startX + (Math.random() * window.innerWidth - window.innerWidth/2),
            y: window.innerHeight + 100,
            rotationZ: "+=" + (Math.random() * 720 - 360),
            rotationX: "+=" + (Math.random() * 720 - 360),
            duration: 3 + Math.random() * 4,
            ease: "power1.out",
            onComplete: () => conf.remove()
        });
    }
}

ScrollTrigger.create({
    trigger: '#gallery',
    start: 'top 50%',
    onEnter: () => burstConfetti()
});
ScrollTrigger.create({
    trigger: '#final-gallery',
    start: 'top 50%',
    onEnter: () => burstConfetti()
});

createStars(30);
createHearts(15);
createBalloons(5);

function createPollen(count) {
    if (!sparklesContainer) return;
    for (let i = 0; i < count; i++) {
        const pollen = document.createElement('div');
        pollen.className = 'pollen';
        sparklesContainer.appendChild(pollen);
        animatePollen(pollen);
    }
}

function animatePollen(pollen) {
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    gsap.set(pollen, { x: startX, y: startY, opacity: 0 });
    
    gsap.to(pollen, {
        opacity: Math.random() * 0.7 + 0.2,
        duration: 2 + Math.random() * 2,
        yoyo: true,
        repeat: 1
    });
    
    gsap.to(pollen, {
        x: startX + (Math.random() * 80 - 40),
        y: startY - (Math.random() * 100 + 50),
        duration: 5 + Math.random() * 8,
        ease: "sine.inOut",
        onComplete: () => animatePollen(pollen)
    });
}

function createPetals(count) {
    if (!sparklesContainer) return;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = Math.random() > 0.4 ? 'petal' : 'petal sunflower-petal';
        sparklesContainer.appendChild(petal);
        animatePetal(petal);
    }
}

function animatePetal(petal) {
    const startX = Math.random() * window.innerWidth;
    const startY = -50; // starts just above viewport
    
    gsap.set(petal, { x: startX, y: startY, rotationZ: Math.random() * 360 });
    
    gsap.to(petal, {
        y: window.innerHeight + 100,
        x: startX + (Math.random() * 300 - 150),
        rotationZ: "+=" + (Math.random() * 360 - 180),
        rotationX: "+=" + (Math.random() * 720), // 3D tumbling
        duration: 12 + Math.random() * 15, // float very slowly
        ease: "none",
        onComplete: () => animatePetal(petal)
    });
}

createPollen(60);
createPetals(25);

// ==========================================
// SYSTEM THEME SYNC (DARK / LIGHT MODE)
// ==========================================
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const smoothWrapper = document.getElementById('smooth-wrapper');

function applyTheme(isDark) {
    if (isDark) {
        gsap.to(smoothWrapper, {
            '--c1': '#161418',
            '--c2': '#1C1920',
            '--c3': '#1A181C',
            duration: 1.5,
            ease: 'power2.inOut'
        });
    } else {
        gsap.to(smoothWrapper, {
            '--c1': '#F8D7E6',
            '--c2': '#FADADD',
            '--c3': '#FFFDFB',
            duration: 1.5,
            ease: 'power2.inOut'
        });
    }
}

// Apply on load
if (smoothWrapper) applyTheme(darkModeQuery.matches);

// Listen for OS toggle
darkModeQuery.addEventListener('change', (e) => {
    const isDark = e.matches;
    if (smoothWrapper) applyTheme(isDark);
    
    // Update all existing butterflies in real-time
    document.querySelectorAll('.butterfly').forEach(b => {
        if (isDark) {
            b.classList.add('dark-mode-butterfly');
            b.style.setProperty('--b-color', '#FFFFFF');
        } else {
            b.classList.remove('dark-mode-butterfly');
            const colors = ['#F8C8DC', '#D8C4F4', '#FFE5D4', '#FADADD', '#FFF9F4', '#F6B6C9'];
            b.style.setProperty('--b-color', colors[Math.floor(Math.random() * colors.length)]);
        }
    });
});

// ==========================================
// MAGICAL MOBILE TOUCH EFFECT
// ==========================================
if ('ontouchstart' in window || window.innerWidth <= 768) {
    const touchHeart = document.createElement('div');
    touchHeart.className = 'mobile-touch-heart';
    document.body.appendChild(touchHeart);

    let currentX = 0;
    let currentY = 0;
    let isTouching = false;
    let rafId = null;
    let longPressInterval = null;

    // Smooth tracking loop using requestAnimationFrame
    function updateTouchPosition() {
        if (isTouching) {
            touchHeart.style.left = `${currentX}px`;
            touchHeart.style.top = `${currentY}px`;
            rafId = requestAnimationFrame(updateTouchPosition);
        }
    }

    // Spawns tiny floating particles around coordinates
    function spawnParticles(x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'touch-particle';
            
            // Random scatter distance
            const tx = (Math.random() - 0.5) * 100;
            const ty = -Math.random() * 80 - 20; // Always float upwards
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(particle);
            
            // Cleanup after animation completes
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }

    window.addEventListener('touchstart', (e) => {
        isTouching = true;
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        touchHeart.style.left = `${currentX}px`;
        touchHeart.style.top = `${currentY}px`;
        
        touchHeart.classList.add('active');
        touchHeart.classList.add('bounce');
        
        setTimeout(() => touchHeart.classList.remove('bounce'), 200);
        
        // Tap explosion
        spawnParticles(currentX, currentY, 6);
        
        // Start long press emitter
        longPressInterval = setInterval(() => {
            spawnParticles(currentX, currentY, 1);
        }, 150);
        
        updateTouchPosition();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isTouching = false;
        touchHeart.classList.remove('active');
        if (rafId) cancelAnimationFrame(rafId);
        if (longPressInterval) clearInterval(longPressInterval);
    }, { passive: true });
}

// ==========================================
// BACKGROUND MUSIC LOGIC
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isMusicPlaying = false;

if (bgMusic && musicToggle) {
    // Attempt to autoplay on first interaction
    const startAudio = () => {
        if (!isMusicPlaying) {
            bgMusic.volume = 0;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggle.textContent = '🔊';
                gsap.to(bgMusic, { volume: 0.5, duration: 2 }); // Fade in
            }).catch(e => console.log("Audio autoplay prevented"));
        }
        document.body.removeEventListener('click', startAudio);
        document.body.removeEventListener('touchstart', startAudio);
    };

    document.body.addEventListener('click', startAudio);
    document.body.addEventListener('touchstart', startAudio);

    // Toggle button logic
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the body click
        if (isMusicPlaying) {
            gsap.to(bgMusic, { volume: 0, duration: 1, onComplete: () => bgMusic.pause() });
            musicToggle.textContent = '🔇';
            isMusicPlaying = false;
        } else {
            bgMusic.volume = 0;
            bgMusic.play();
            gsap.to(bgMusic, { volume: 0.5, duration: 1 });
            musicToggle.textContent = '🔊';
            isMusicPlaying = true;
        }
    });
}
