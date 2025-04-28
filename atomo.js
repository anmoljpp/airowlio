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
    
    if (!video || !videoSection) {
        console.error('Video elements missing:', { video, videoSection });
        return;
    }

    // Ensure video is ready
    video.muted = true;
    video.currentTime = 0;
    video.pause();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When video enters viewport
                video.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                    // Fallback for browsers that block autoplay
                    video.muted = true;
                    video.play();
                });
            } else {
                // When video leaves viewport
                video.pause();
                video.currentTime = 0;
            }
        });
    }, { 
        threshold: 0.5, // Trigger when 50% of video is visible
        rootMargin: '0px 0px -100px 0px' // Small negative margin to trigger slightly earlier
    });

    observer.observe(videoSection);

    // Optional: Add loading state
    video.addEventListener('loadeddata', () => {
        videoSection.classList.add('video-loaded');
    });
};

// Update your initialization to keep all other functions
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    initScrollVideo(); // This is now the simple version
    initShowcaseVideo();
});




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