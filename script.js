//DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const revealElements = document.querySelectorAll('.reveal-text, .reveal-card');
const caseStudies = document.querySelectorAll('.case-study');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn'); 

// Mobile Menu Toggle
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Scroll Reveal Animation
const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < triggerBottom) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Case Studies Slider
let currentSlide = 0;
const dots = document.querySelectorAll('.dot');
const progress = document.querySelector('.progress');
let autoplayInterval;

const updateSlider = (newIndex) => {
    // Update current slide
    caseStudies.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === newIndex) {
            slide.classList.add('active');
        } else if (index === currentSlide) {
            slide.classList.add('prev');
        }
    });

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === newIndex);
    });

    // Update progress bar
    progress.style.transform = `translateX(${newIndex * 100}%)`;

    currentSlide = newIndex;
};

// Event listeners for controls
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentSlide - 1 + caseStudies.length) % caseStudies.length;
        updateSlider(newIndex);
        resetAutoplay();
    });
}
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentSlide + 1) % caseStudies.length;
        updateSlider(newIndex);
        resetAutoplay();
    });
}
if (dots && dots.length) {
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            resetAutoplay();
        });
    });
}

// Touch support
let touchStartX = 0;
let touchEndX = 0;

const handleGesture = () => {
    const sensitivity = 50; // minimum distance for swipe
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > sensitivity) {
        if (diff > 0) {
            // Swipe right - show previous
            const newIndex = (currentSlide - 1 + caseStudies.length) % caseStudies.length;
            updateSlider(newIndex);
        } else {
            // Swipe left - show next
            const newIndex = (currentSlide + 1) % caseStudies.length;
            updateSlider(newIndex);
        }
        resetAutoplay();
    }
};

const slider = document.querySelector('.case-studies-slider');

if (slider) {
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });

    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            const newIndex = (currentSlide + 1) % caseStudies.length;
            updateSlider(newIndex);
        }, 5000); // Change slide every 5 seconds
    };

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };

    // Start autoplay on page load
    startAutoplay();

    // Pause autoplay when user hovers over slider
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // Resume autoplay when user leaves slider
    slider.addEventListener('mouseleave', () => {
        startAutoplay();
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Form Animation
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');

    if (input && label) {
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
        });
    }
});

// Portfolio Item Hover Effect
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (portfolioItems && portfolioItems.length) {
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const overlay = item.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        item.addEventListener('mouseleave', () => {
            const overlay = item.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}

// Sticky Navigation
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});
