/**
 * Frames 360: Design for Future - Main Application JavaScript
 * Highly interactive, manages custom cursor effects, countdown timer, 
 * and scroll animations. Externalizes registration to Google Forms.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initCustomCursor();
    initMobileNav();
    initCountdownTimer();
    initScrollAnimations();
});

/* ==========================================================================
   CUSTOM CURSOR (CAMERA VIEWFINDER EFFECT)
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('cursor-viewfinder');
    if (!cursor) return;

    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        cursor.style.display = 'none';
        return;
    }

    // Display cursor on desktop
    cursor.style.display = 'block';

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Add hover states to active clickable items
    const clickables = document.querySelectorAll('a, button, select, input, textarea, [role="button"]');
    
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
    });
}

/* ==========================================================================
   MOBILE NAVIGATION & SCROLL EFFECT
   ========================================================================== */
function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-nav-btn');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('.header');
    
    if (!mobileBtn || !mainNav) return;

    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        mainNav.classList.toggle('open');
    });

    // Close menu when links are clicked
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            mainNav.classList.remove('open');
        });
    });

    // Header scroll background transition
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   COUNTDOWN TIMER
   ========================================================================= */
function initCountdownTimer() {
    // Target Event Date: 12 August 2026
    const targetDate = new Date('August 12, 2026 09:00:00').getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Render with leading zero
        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS & TIMELINE PROGRESS
   ========================================================================== */
function initScrollAnimations() {
    // 1. Intersection Observer for Fade Reveals
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // 2. Timeline Dynamic Line Filler
    const timelineSection = document.getElementById('timeline');
    const progressBar = document.getElementById('timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineSection || !progressBar) return;

    window.addEventListener('scroll', () => {
        const sectionRect = timelineSection.getBoundingClientRect();
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;
        
        let scrollPercent = 0;
        if (sectionRect.top < windowHeight / 2) {
            const scrolledHeight = (windowHeight / 2) - sectionRect.top;
            scrollPercent = Math.min(Math.max((scrolledHeight / (sectionHeight - windowHeight/4)) * 100, 0), 100);
        }
        
        progressBar.style.height = `${scrollPercent}%`;

        // Make timeline cards active based on distance
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top < windowHeight * 0.6) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}
