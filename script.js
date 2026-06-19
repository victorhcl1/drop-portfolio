
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

  
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', function() {
        let current = '';
        document.querySelectorAll('section, header').forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-item, .about-card, .stat-card, .contact-method').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('click', function(e) {
            const link = this.querySelector('a');
            if (link && e.target !== link) {
                link.click();
            }
        });
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = contactForm.querySelector('input[type="email"]').value;
            const mailtoLink = `mailto:seu-email@gmail.com?subject=${contactForm.querySelector('input[placeholder="Assunto do Projeto"]').value}&body=${encodeURIComponent(
                'Nome: ' + contactForm.querySelector('input[placeholder="Seu Nome"]').value + '\n' +
                'Email: ' + email + '\n\n' +
                contactForm.querySelector('textarea').value
            )}`;
            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }

    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        const videoFrame = document.getElementById('video-frame');
        const modalClose = document.querySelector('.modal-close');
        const videoTitle = document.getElementById('video-title');
        const videoCounter = document.getElementById('video-count');
        const prevButton = document.getElementById('prev-video');
        const nextButton = document.getElementById('next-video');
        
   
        let videos = [];
        let currentVideoIndex = 0;

   
        function getYoutubeVideoId(url) {
            let videoId = '';
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                videoId = url.split('embed/')[1].split('?')[0];
            }
            return videoId;
        }


        document.querySelectorAll('.play-btn').forEach((btn, index) => {
            const youtubeUrl = btn.getAttribute('data-youtube');

            if (youtubeUrl) {
                const videoId = getYoutubeVideoId(youtubeUrl);

                if (videoId) {
                    const thumbnail = btn.closest('.project-header').querySelector('.video-thumbnail');
                    if (thumbnail) {
                        thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    }

                    const projectCard = btn.closest('.project-card');
                    const projectTitle = projectCard.querySelector('h3').textContent;
                    videos.push({
                        videoId: videoId,
                        title: projectTitle,
                        url: youtubeUrl,
                        index: index
                    });
                }
            }
        });


        function playVideo(index) {
            if (index >= 0 && index < videos.length) {
                currentVideoIndex = index;
                const video = videos[index];
                videoFrame.src = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&modestbranding=1&rel=0`;
                videoTitle.textContent = video.title;
                videoCounter.textContent = `${index + 1} / ${videos.length}`;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        

        document.querySelectorAll('.play-btn').forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                playVideo(index);
            });
        });
        

        nextButton.addEventListener('click', function() {
            let nextIndex = currentVideoIndex + 1;
            if (nextIndex >= videos.length) {
                nextIndex = 0;
            }
            playVideo(nextIndex);
        });
        

        prevButton.addEventListener('click', function() {
            let prevIndex = currentVideoIndex - 1;
            if (prevIndex < 0) {
                prevIndex = videos.length - 1;
            }
            playVideo(prevIndex);
        });


        modalClose.addEventListener('click', function() {
            videoModal.classList.remove('active');
            videoFrame.src = '';
            document.body.style.overflow = 'auto';
        });


        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                videoFrame.src = '';
                document.body.style.overflow = 'auto';
            }
        });


        document.addEventListener('keydown', function(e) {
            if (videoModal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    videoModal.classList.remove('active');
                    videoFrame.src = '';
                    document.body.style.overflow = 'auto';
                } else if (e.key === 'ArrowRight') {
                    nextButton.click();
                } else if (e.key === 'ArrowLeft') {
                    prevButton.click();
                }
            }
        });
    }
});


const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #c084fc !important;
        border-bottom: 1px solid #c084fc;
        padding-bottom: 5px;
    }
`;
document.head.appendChild(style);

/* STATS ANIMATION */
function animateCounter(element, originalText, target, duration = 1500) {
    let current = 0;
    const increment = target / (duration / 16);
    const suffix = originalText.replace(/[\d]/g, '');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserverOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const text = statNumber.textContent;
                const numberMatch = text.match(/\d+/);
                if (numberMatch) {
                    const target = parseInt(numberMatch[0]);
                    animateCounter(statNumber, text, target);
                }
            }
        }
    });
}, statsObserverOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

/* TILT 3D + GLARE NOS CARDS (giram e brilham seguindo o mouse, com suavização) */
const TILT_SELECTOR = '.project-card, .about-card, .stat-card';
const MAX_TILT = 10;   // graus
const EASE = 0.12;     // quanto menor, mais "solto"/suave o movimento

document.querySelectorAll(TILT_SELECTOR).forEach(card => {
    card.classList.add('tilt-card');

    // estado atual (renderizado) e alvo (mouse)
    const state = { rx: 0, ry: 0, lift: 0, mx: 50, my: 50 };
    const target = { rx: 0, ry: 0, lift: 0, mx: 50, my: 50 };
    let running = false;

    function animate() {
        state.rx += (target.rx - state.rx) * EASE;
        state.ry += (target.ry - state.ry) * EASE;
        state.lift += (target.lift - state.lift) * EASE;
        state.mx += (target.mx - state.mx) * EASE;
        state.my += (target.my - state.my) * EASE;

        const scale = 1 + (state.lift / 8) * 0.03;
        card.style.transform =
            `perspective(1000px) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg) translateY(${(-state.lift).toFixed(2)}px) scale(${scale.toFixed(3)})`;
        card.style.setProperty('--mx', state.mx.toFixed(1) + '%');
        card.style.setProperty('--my', state.my.toFixed(1) + '%');

        // continua animando enquanto ainda não chegou perto do alvo
        const done =
            Math.abs(target.rx - state.rx) < 0.05 &&
            Math.abs(target.ry - state.ry) < 0.05 &&
            Math.abs(target.lift - state.lift) < 0.05;

        if (done && target.lift === 0) {
            running = false;
            card.style.transform = '';
            return;
        }
        requestAnimationFrame(animate);
    }

    function start() {
        if (!running) {
            running = true;
            requestAnimationFrame(animate);
        }
    }

    card.addEventListener('mouseenter', function() {
        card.classList.add('is-tilting');
        target.lift = 8;
        start();
    });

    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;  // 0..1
        const py = (e.clientY - rect.top) / rect.height;  // 0..1
        target.ry = (px - 0.5) * 2 * MAX_TILT;
        target.rx = (0.5 - py) * 2 * MAX_TILT;
        target.mx = px * 100;
        target.my = py * 100;
        target.lift = 8;
        start();
    });

    card.addEventListener('mouseleave', function() {
        card.classList.remove('is-tilting');
        target.rx = 0;
        target.ry = 0;
        target.lift = 0;
        start();
    });
});

/* GLOW QUE SEGUE O MOUSE NAS CATEGORIAS DE SKILL */
document.querySelectorAll('.skill-category').forEach(cat => {
    cat.addEventListener('mousemove', function(e) {
        const rect = cat.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        cat.style.setProperty('--mx', px.toFixed(1) + '%');
        cat.style.setProperty('--my', py.toFixed(1) + '%');
    });
});

/* FAÍSCAS / BRASAS SUBINDO NA TELA INICIAL */
document.querySelectorAll('.sparks-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    let particles = [];
    let raf;

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
        const purple = Math.random() > 0.4;
        return {
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 40,
            size: Math.random() * 2.2 + 0.6,
            speedY: Math.random() * 0.8 + 0.3,
            drift: (Math.random() - 0.5) * 0.4,
            life: 0,
            maxLife: Math.random() * 200 + 120,
            hue: purple ? 270 + Math.random() * 25 : 285 + Math.random() * 20,
            flicker: Math.random() * 0.04 + 0.01
        };
    }

    const COUNT = Math.min(70, Math.floor(canvas.width / 22));
    for (let i = 0; i < COUNT; i++) {
        const p = createParticle();
        p.y = Math.random() * canvas.height;
        p.life = Math.random() * p.maxLife;
        particles.push(p);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.y -= p.speedY;
            p.x += p.drift;
            p.life++;

            const lifeRatio = p.life / p.maxLife;
            let alpha = Math.sin(lifeRatio * Math.PI); // fade in/out
            alpha *= 0.8 + Math.sin(p.life * p.flicker) * 0.2; // cintila
            alpha = Math.max(0, alpha);

            const glow = p.size * 4;
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
            grad.addColorStop(0, `hsla(${p.hue}, 90%, 75%, ${alpha})`);
            grad.addColorStop(0.4, `hsla(${p.hue}, 85%, 60%, ${alpha * 0.5})`);
            grad.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
            ctx.fill();

            if (p.life >= p.maxLife || p.y < -10) {
                particles[i] = createParticle();
            }
        });
        raf = requestAnimationFrame(draw);
    }
    draw();
});

/* GLOW QUE SEGUE O MOUSE NAS HEROS (index e projetos) */
document.querySelectorAll('.hero, .hero-projects').forEach(hero => {
    const heroGlow = hero.querySelector('.hero-glow');
    if (!heroGlow) return;
    hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        heroGlow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
});
