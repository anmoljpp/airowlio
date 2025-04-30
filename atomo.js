// Utility function to safely select elements
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

// Slideshow functionality for the slideshow section
// Simplified slideshow functionality
const initSlideshow = () => {
    const section = document.querySelector('.slideshow-section');
    const images = document.querySelectorAll('.slideshow-image');
    
    if (!section || images.length === 0) return;

    let currentIndex = 0;
    const changeInterval = 300; // 0.3 seconds per image
    let slideshowInterval;

    // Start with first image visible
    images[currentIndex].classList.add('active');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start slideshow when section is visible
                slideshowInterval = setInterval(() => {
                    // Fade out current image
                    images[currentIndex].classList.remove('active');
                    
                    // Move to next image
                    currentIndex++;
                    
                    // If reached the end, stop at last image
                    if (currentIndex >= images.length) {
                        clearInterval(slideshowInterval);
                        images[images.length - 1].classList.add('active');
                        return;
                    }
                    
                    // Fade in next image
                    images[currentIndex].classList.add('active');
                }, changeInterval);
                
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);

    // Clean up on unmount (if using SPA)
    return () => {
        clearInterval(slideshowInterval);
        observer.disconnect();
    };
};

document.addEventListener('DOMContentLoaded', initSlideshow);

// Simple viewport-triggered video playback
const initScrollVideo = () => {
    const video = $('#intro-video');
    const videoSection = $('.video-section');
    const nextSection = videoSection.nextElementSibling; // Get the following section
    
    if (!video || !videoSection || !nextSection) return;

    // Set video attributes
    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    video.currentTime = 0;
    video.pause();

    // Check if mobile device
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Add CSS for fade effect
    const style = document.createElement('style');
    style.textContent = `
        .video-section.fade-out {
            opacity: 0;
            transition: opacity 0.5s ease 0.5s;
        }
        .video-section {
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(style);

    const handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When video enters viewport
                videoSection.classList.remove('fade-out');
                video.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                    video.muted = true;
                    video.play();
                });
                
                if (isMobile) {
                    video.addEventListener('timeupdate', handleTimeUpdate);
                }
            } else {
                // When video leaves viewport
                video.pause();
                video.currentTime = 0;
                if (isMobile) {
                    video.removeEventListener('timeupdate', handleTimeUpdate);
                }
            }
        });
    };

    // Observe next section to fade out video
    const nextSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When next section comes into view
                videoSection.classList.add('fade-out');
            } else {
                // When next section leaves view
                videoSection.classList.remove('fade-out');
            }
        });
    }, { threshold: 0.1 });

    // Mobile-specific loop handler
    const handleTimeUpdate = () => {
        if (video.currentTime > video.duration * 0.9) {
            video.currentTime = 0;
            video.play();
        }
    };

    const observer = new IntersectionObserver(handleIntersection, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(videoSection);
    nextSectionObserver.observe(nextSection);

    // Clean up
    window.addEventListener('resize', () => {
        if (!isMobile) {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        }
    });
};










// Showcase video section visibility
const initShowcaseVideo = () => {
    const section = $('.showcase-video-section');
    if (!section) {
        console.error('Showcase video section missing:', { section });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.classList.add('visible');
                } else if (window.scrollY < section.offsetTop) {
                    section.classList.remove('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);
};

// Initialize all functionalities
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    initScrollVideo();
    initShowcaseVideo();
});