// Slider functionality (for the dots-based slider)
let slideIndex = 1;
let slider = document.querySelector(".slider");
let dots = document.getElementsByClassName("dot");
let autoSlideInterval;

// Check if slider elements exist before proceeding
if (slider && dots.length > 0) {
    // Show the initial slide
    showSlides(slideIndex);

    // Start the automatic sliding
    startAutoSlide();
}

// Function to show a specific slide
function showSlides(n) {
    if (!slider || dots.length === 0) return; // Exit if slider or dots are missing

    // Ensure slideIndex stays within bounds (1 to 6 for 6 slides)
    if (n > 6) { slideIndex = 1; } // Loop back to the first slide
    if (n < 1) { slideIndex = 6; } // Loop to the last slide

    // Move the slider using transform to slide one image at a time
    slider.style.transform = `translateX(-${(slideIndex - 1) * 16.6667}%)`;

    // Update the active dot
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex - 1].className += " active";
}

// Function to move to a specific slide when a dot is clicked
function currentSlide(n) {
    if (!slider || dots.length === 0) return; // Exit if slider or dots are missing

    clearInterval(autoSlideInterval); // Stop auto-sliding when manually navigating
    slideIndex = n;
    showSlides(slideIndex);
    startAutoSlide(); // Restart auto-sliding
}

// Function to start the automatic sliding
function startAutoSlide() {
    if (!slider || dots.length === 0) return; // Exit if slider or dots are missing

    autoSlideInterval = setInterval(function () {
        slideIndex++; // Move to the next slide
        showSlides(slideIndex);
    }, 2000); // Change slide every 2 seconds
}

// Consolidated DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function () {
    // Hamburger Menu Functionality
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('#navbar ul');

    // Debugging: Check if elements are found
    if (!hamburger || !navList) {
        console.error('Hamburger or navList not found!');
        return;
    }

    hamburger.addEventListener('click', function () {
        // Toggle active class on the ul
        navList.classList.toggle('active');

        // Toggle open class on the hamburger
        this.classList.toggle('open');

        // Debugging: Log the state
        console.log('Hamburger clicked! Menu is now:', navList.classList.contains('active') ? 'open' : 'closed');

        // Animate the menu items with a slight delay for each
        const navItems = navList.querySelectorAll('li');
        navItems.forEach((item, index) => {
            if (navList.classList.contains('active')) {
                // When opening, fade in with a delay
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100); // Delay each item by 100ms
            } else {
                // When closing, reset immediately
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
            }
        });
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('#navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navList.classList.remove('active');
            hamburger.classList.remove('open');

            // Reset the menu items' styles
            const navItems = navList.querySelectorAll('li');
            navItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
            });
        });
    });

    // Slider Functionality (for the prev/next button slider)
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Only run this if the slider elements exist
    if (slider && slides.length > 0 && prevBtn && nextBtn) {
        const visibleSlides = 4; // Number of slides visible at once
        const totalSlides = slides.length; // Original number of slides

        // Clone the first and last slides for seamless looping
        const slidesToClone = visibleSlides; // Clone 4 slides for both ends
        for (let i = 0; i < slidesToClone; i++) {
            const firstClone = slides[i].cloneNode(true);
            const lastClone = slides[totalSlides - 1 - i].cloneNode(true);
            slider.appendChild(firstClone); // Append first slides to the end
            slider.insertBefore(lastClone, slides[0]); // Prepend last slides to the beginning
        }

        // Update the slides NodeList after cloning
        const allSlides = document.querySelectorAll('.slide');
        const totalSlidesWithClones = allSlides.length; // Total slides including clones

        // Start the slider at the first real slide (after the cloned last slides)
        let currentIndex = slidesToClone; // Start at index 4 (first real slide)

        function updateSlider(useTransition = true) {
            if (!useTransition) {
                slider.style.transition = 'none'; // Disable transition for instant jump
            } else {
                slider.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
            }
            const offset = -(currentIndex * (100 / visibleSlides));
            slider.style.transform = `translateX(${offset}%)`;
        }

        function handleTransitionEnd() {
            // When the transition ends, check if we need to reposition
            if (currentIndex >= totalSlides + slidesToClone) {
                // We've reached the cloned first slides at the end
                currentIndex = slidesToClone; // Jump to the first real slide
                updateSlider(false); // Instant jump without transition
            } else if (currentIndex < slidesToClone) {
                // We've reached the cloned last slides at the beginning
                currentIndex = totalSlides; // Jump to the last set of real slides
                updateSlider(false); // Instant jump without transition
            }
        }

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateSlider(true);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateSlider(true);
        });

        // Add a transitionend event listener to handle repositioning after the transition
        slider.addEventListener('transitionend', handleTransitionEnd);

        // Initialize the slider position
        updateSlider(false); // Start without transition to avoid initial jump
    } else {
        console.warn('Slider elements not found. Skipping slider initialization.');
    }
});
// Scroll event for navbar
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const logo = document.getElementById('logo');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Existing JavaScript (hamburger menu, slider, etc.) remains unchanged...
// Scroll-Controlled Video Starting at the End of the First Page
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('scrollVideo');
    const firstPage = document.getElementById('first-page');

    // Check if elements exist
    if (!video || !firstPage) {
        console.error('Video or first page not found!');
        return;
    }

    const keyTimes = [0,0.4,0,8,1.0,1.5,2.0,2.2, 2.4, 2.5, 2.7,2.9,3.0,3.5,4.0,4.5,5.0,5.3,5.8]; // Key moments in seconds
    const totalDuration = Math.max(...keyTimes); // 4.9 seconds

    // Set video to first frame initially
    video.currentTime = 0;
    video.pause();

    // Function to calculate the scroll progress starting at the end of the first page
    const updateVideoTime = () => {
        // Get the height of the first page and viewport height
        const firstPageHeight = firstPage.offsetHeight;
        const windowHeight = window.innerHeight;

        // Define the trigger point (end of the first page, adjusted for viewport height)
        const triggerPoint = firstPageHeight - windowHeight;

        // Get the current scroll position
        const scrollY = window.scrollY;

        // Define the scrollable section height to match the video duration
        // We want the video to play from 0 to 4.9 seconds over a scroll distance equal to the second page height
        const secondPage = document.getElementById('second-page');
        const scrollableSectionHeight = secondPage ? secondPage.offsetHeight : firstPageHeight; // Use second page height if available, otherwise fallback to first page height
        const sectionBottom = triggerPoint + scrollableSectionHeight;

        // Check if the scrollbar has reached the trigger point (end of the first page)
        const isInVideoSection = scrollY >= triggerPoint && scrollY <= sectionBottom;

        // If the scrollbar is not in the video section, pause the video and return
        if (!isInVideoSection) {
            video.pause();
            if (scrollY < triggerPoint) {
                video.currentTime = 0; // Reset to the start if above the trigger point
            } else if (scrollY > sectionBottom) {
                video.currentTime = totalDuration; // Set to the end if below the section
            }
            return;
        }

        // Calculate the scroll progress within the video section
        const scrollPositionInSection = Math.max(0, Math.min(scrollY - triggerPoint, scrollableSectionHeight));
        const progress = scrollPositionInSection / scrollableSectionHeight;
        const currentTime = progress * totalDuration;

        // Find between which keyframes we are
        let targetTime = 0;
        for (let i = 0; i < keyTimes.length - 1; i++) {
            const startProgress = (keyTimes[i] / totalDuration);
            const endProgress = (keyTimes[i + 1] / totalDuration);
            if (progress >= startProgress && progress <= endProgress) {
                const keyProgress = (progress - startProgress) / (endProgress - startProgress);
                targetTime = keyTimes[i] + (keyTimes[i + 1] - keyTimes[i]) * keyProgress;
                break;
            }
        }

        // If scrolled beyond the last keyframe
        if (progress >= (keyTimes[keyTimes.length - 1] / totalDuration)) {
            targetTime = keyTimes[keyTimes.length - 1];
        }

        // Update video time
        video.currentTime = targetTime;

        // Play only if not already playing and the scrollbar is in the video section
        if (video.paused && scrollPositionInSection > 0 && scrollPositionInSection < scrollableSectionHeight) {
            video.play().catch(e => console.log("Playback prevented:", e));
        }
    };

    // Pause when not scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        updateVideoTime();

        scrollTimeout = setTimeout(() => {
            const firstPageHeight = firstPage.offsetHeight;
            const windowHeight = window.innerHeight;
            const triggerPoint = firstPageHeight - windowHeight;
            const secondPage = document.getElementById('second-page');
            const scrollableSectionHeight = secondPage ? secondPage.offsetHeight : firstPageHeight;
            const sectionBottom = triggerPoint + scrollableSectionHeight;
            const scrollY = window.scrollY;

            const isInVideoSection = scrollY >= triggerPoint && scrollY <= sectionBottom;
            if (isInVideoSection) {
                video.pause();
            }
        }, 50);
    });

    // Initial update
    updateVideoTime();
});


document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const thirdPage = document.getElementById('third-page');
    const fourthPage = document.getElementById('fourth-page');
    const modelContainer = document.querySelector('.model-scroll-container');
    const centralCircle = document.querySelector('.central-circle');
    const featureCircles = document.querySelectorAll('.feature-circle');
    const svg = document.querySelector('.connection-lines');
    
    // Create arrow markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const markerStart = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    markerStart.setAttribute('id', 'arrow-start');
    markerStart.setAttribute('viewBox', '0 0 10 10');
    markerStart.setAttribute('refX', '5');
    markerStart.setAttribute('refY', '5');
    markerStart.setAttribute('markerWidth', '6');
    markerStart.setAttribute('markerHeight', '6');
    markerStart.setAttribute('orient', 'auto-start-reverse');
    
    const arrowStartPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowStartPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    arrowStartPath.setAttribute('class', 'marker');
    markerStart.appendChild(arrowStartPath);
    defs.appendChild(markerStart);
    
    const markerEnd = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    markerEnd.setAttribute('id', 'arrow-end');
    markerEnd.setAttribute('viewBox', '0 0 10 10');
    markerEnd.setAttribute('refX', '5');
    markerEnd.setAttribute('refY', '5');
    markerEnd.setAttribute('markerWidth', '6');
    markerEnd.setAttribute('markerHeight', '6');
    markerEnd.setAttribute('orient', 'auto');
    
    const arrowEndPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowEndPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    arrowEndPath.setAttribute('class', 'marker');
    markerEnd.appendChild(arrowEndPath);
    defs.appendChild(markerEnd);
    
    svg.appendChild(defs);
    
    // Track if fifth feature has been activated
    let fifthFeatureActivated = false;
    let fifthFeatureTimer = null;
    
    
    // Handle scroll animations
    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight; // Bottom of viewport
        const thirdPageTop = thirdPage.offsetTop;
        const thirdPageHeight = thirdPage.offsetHeight;
        const fourthPageHeight = fourthPage.offsetHeight;
        
        // Trigger point is the bottom of third-page
        const thirdPageBottom = thirdPageTop + thirdPageHeight;
        
        // Calculate scroll progress within fourth-page (0 to 1)
        const scrollProgress = Math.min(
            Math.max((scrollPosition - thirdPageBottom) / fourthPageHeight, 0),
            1
        );
        
        // Activate central circle immediately when third-page bottom is reached
        if (scrollPosition >= thirdPageBottom) {
            centralCircle.classList.add('active');
        } else {
            centralCircle.classList.remove('active');
            fifthFeatureActivated = false;
            if (fifthFeatureTimer) clearTimeout(fifthFeatureTimer);
        }
        
        // Activate features sequentially with thresholds
        const featureCount = featureCircles.length;
        featureCircles.forEach((feature, index) => {
            const threshold = (index + 1) * 0.16; // Thresholds at 0.16, 0.32, 0.48, 0.64, 0.80
            
            if (scrollProgress >= threshold) {
                feature.classList.add('active');
                if (index === 4 && !fifthFeatureActivated) {
                    // Fifth feature just activated
                    fifthFeatureActivated = true;
                    // Start 2-second timer for completion effect
                    if (fifthFeatureTimer) clearTimeout(fifthFeatureTimer);
                    fifthFeatureTimer = setTimeout(() => {
                        // Optional: Add any final visual effect here (e.g., pulse central circle)
                        centralCircle.classList.add('effect-complete');
                    }, 1000);
                }
            } else {
                feature.classList.remove('active');
                if (index === 4) {
                    fifthFeatureActivated = false;
                    if (fifthFeatureTimer) clearTimeout(fifthFeatureTimer);
                }
            }
        });
        
        // Update connection lines
        createLines();
        
        // Scale central circle based on scroll
        const scale = 1 + (scrollProgress * 0.2);
        centralCircle.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    
    // Initialize
    function init() {
        createLines();
        window.addEventListener('resize', createLines);
        handleScroll(); // Initial check to catch if already in view
    }
    
    // Use Intersection Observer to detect bottom of third-page
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
                    window.addEventListener('scroll', handleScroll);
                    handleScroll(); // Trigger immediately if in view
                } else {
                    window.removeEventListener('scroll', handleScroll);
                    // Reset animations when out of view
                    centralCircle.classList.remove('active');
                    centralCircle.classList.remove('effect-complete');
                    featureCircles.forEach(feature => feature.classList.remove('active'));
                    fifthFeatureActivated = false;
                    if (fifthFeatureTimer) clearTimeout(fifthFeatureTimer);
                    createLines();
                }
            });
        },
        {
            threshold: 0, // Trigger when any part is visible
            rootMargin: `0px 0px -${thirdPage.offsetHeight - 50}px 0px` // Trigger near bottom
        }
    );
    
    observer.observe(thirdPage);
    init();
});

