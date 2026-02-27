
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
function animateCounter(element, target, duration = 1500) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            // Extract number format (e.g., "4+" becomes "4", "10+" becomes "10")
            const text = element.textContent;
            const plus = text.includes('+') ? '+' : '';
            element.textContent = Math.floor(current) + plus;
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
                    animateCounter(statNumber, target);
                }
            }
        }
    });
}, statsObserverOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});
