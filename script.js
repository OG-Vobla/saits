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

// ==================== INFO CAROUSEL ====================
class InfoCarousel {
    constructor(carouselId, dotsId) {
        this.carousel = document.getElementById(carouselId);
        this.dotsContainer = document.getElementById(dotsId);
        
        if (!this.carousel || !this.dotsContainer) return;
        
        // Find all card types in this carousel
        this.cards = this.carousel.querySelectorAll('.info-card, .service-card, .tilda-feature, .case-card, .advantage-card');
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.isSnapping = false;
        
        this.init();
    }

    init() {
        this.createDots();
        this.updateDimensions();
        this.updateCarousel();
        this.addEventListeners();
        
        setTimeout(() => this.scrollToIndex(0), 100);
    }

    createDots() {
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.scrollToIndex(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.dot');
    }

    updateDimensions() {
        const card = this.cards[0];
        if (!card) return;
        const style = window.getComputedStyle(card);
        const marginRight = parseInt(style.marginRight) || 24;
        this.cardWidth = card.offsetWidth + marginRight;
    }

    scrollToIndex(index) {
        this.isSnapping = true;
        this.currentIndex = index;
        const scrollPosition = this.cardWidth * index;
        
        this.carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        this.updateDots();
        
        // Reset snapping flag after animation
        setTimeout(() => {
            this.isSnapping = false;
        }, 500);
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateCarousel() {
        const carouselRect = this.carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(carouselCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }

            const maxDistance = carouselRect.width / 2 + cardRect.width / 2;
            const normalizedDistance = Math.min(distance / maxDistance, 1);
            
            const opacity = 1 - (normalizedDistance * 0.4);
            const scale = 1 - (normalizedDistance * 0.08);
            
            card.style.opacity = opacity;
            card.style.transform = `scale(${scale})`;
            
            if (normalizedDistance < 0.2) {
                card.classList.add('centered');
            } else {
                card.classList.remove('centered');
            }
        });

        if (this.currentIndex !== closestIndex) {
            this.currentIndex = closestIndex;
            this.updateDots();
        }
    }

    addEventListeners() {
        this.carousel.addEventListener('scroll', () => {
            this.updateCarousel();
        });

        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.scrollToIndex(this.currentIndex);
        });

        // Touch support
        let startX = 0;
        let scrollLeft = 0;
        let isTouching = false;

        this.carousel.addEventListener('touchstart', (e) => {
            isTouching = true;
            startX = e.touches[0].pageX;
            scrollLeft = this.carousel.scrollLeft;
        });

        this.carousel.addEventListener('touchend', (e) => {
            if (!isTouching) return;
            isTouching = false;
            
            const endX = e.changedTouches[0].pageX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0 && this.currentIndex < this.cards.length - 1) {
                    this.scrollToIndex(this.currentIndex + 1);
                } else if (diff < 0 && this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                } else {
                    // Snap to current if at edge
                    this.scrollToIndex(this.currentIndex);
                }
            } else {
                // Small swipe - snap to nearest
                this.scrollToIndex(this.currentIndex);
            }
        });

        // Mouse drag support
        let isDragging = false;
        let startMouseX = 0;

        this.carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startMouseX = e.pageX;
            scrollLeft = this.carousel.scrollLeft;
            this.carousel.style.cursor = 'grabbing';
        });

        this.carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startMouseX) * 1.5;
            this.carousel.scrollLeft = scrollLeft - walk;
        });

        this.carousel.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            this.carousel.style.cursor = 'grab';
            
            // Snap to nearest card after drag
            setTimeout(() => {
                if (!this.isSnapping) {
                    this.scrollToIndex(this.currentIndex);
                }
            }, 50);
        });

        this.carousel.addEventListener('mouseleave', () => {
            if (!isDragging) return;
            isDragging = false;
            this.carousel.style.cursor = 'grab';
            
            // Snap to nearest card after drag
            setTimeout(() => {
                if (!this.isSnapping) {
                    this.scrollToIndex(this.currentIndex);
                }
            }, 50);
        });

        // Snap to nearest card on scroll end (only if not already snapping)
        let scrollTimeout;
        this.carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!this.isSnapping && !isDragging && !isTouching) {
                    this.scrollToIndex(this.currentIndex);
                }
            }, 150);
        });
    }
}

// Initialize Info Carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new InfoCarousel('infoCarousel', 'infoDots');
    });
} else {
    new InfoCarousel('infoCarousel', 'infoDots');
}

// ==================== INITIALIZE ALL CAROUSELS ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCarousels);
} else {
    initAllCarousels();
}

function initAllCarousels() {
    new InfoCarousel('servicesCarousel', 'servicesDots');
    new InfoCarousel('tildaCarousel', 'tildaDots');
    new InfoCarousel('casesCarousel', 'casesDots');
    new InfoCarousel('advantagesCarousel', 'advantagesDots');
}
