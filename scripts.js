/* ===========================================
   NCS Bharat - Namdhari Consultancy Service
   Website JavaScript
   =========================================== */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 80) {
    navbar.style.top = '0';
    navbar.style.width = '100%';
    navbar.style.borderRadius = '0';
    const navContainer = navbar.querySelector('.nav-container');
    if (navContainer) {
      navContainer.style.borderRadius = '0';
      navContainer.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
  } else {
    navbar.style.top = '16px';
    navbar.style.width = 'calc(100% - 80px)';
    navbar.style.borderRadius = '';
    const navContainer = navbar.querySelector('.nav-container');
    if (navContainer) {
      navContainer.style.borderRadius = '50px';
      navContainer.style.boxShadow = '';
    }
  }

  lastScroll = currentScroll;
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ===== TESTIMONIAL SLIDER =====
let currentSlide = 0;
let autoSlideInterval;
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
const totalSlides = 4;

function goToSlide(index) {
  if (!track) return;
  currentSlide = index;

  // Calculate offset - show 2 cards on desktop, 1 on mobile
  const isMobile = window.innerWidth <= 768;
  const offset = isMobile ? index * 100 : index * 50;
  const maxOffset = isMobile ? (totalSlides - 1) * 100 : (totalSlides - 2) * 50;
  const clampedOffset = Math.min(offset, maxOffset);

  track.style.transform = 'translateX(-' + clampedOffset + '%)';

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function changeSlide(direction) {
  let newSlide = currentSlide + direction;
  if (newSlide < 0) newSlide = totalSlides - 1;
  if (newSlide >= totalSlides) newSlide = 0;
  goToSlide(newSlide);
  resetAutoSlide();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    let nextSlide = currentSlide + 1;
    if (nextSlide >= totalSlides) nextSlide = 0;
    goToSlide(nextSlide);
  }, 4000);
}

// Make functions global for onclick handlers
window.goToSlide = goToSlide;
window.changeSlide = changeSlide;

if (track) {
  startAutoSlide();

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      changeSlide(diff > 0 ? 1 : -1);
    }
  });
}

// ===== FAQ ACCORDION =====
function toggleFaq(button) {
  const item = button.parentElement;
  const answer = item.querySelector('.faq-a');
  const icon = button.querySelector('.faq-icon');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-a.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q.open').forEach(q => {
    q.classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    answer.classList.add('open');
    button.classList.add('open');
  }
}

window.toggleFaq = toggleFaq;

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Add fade-up class to sections
const animateElements = document.querySelectorAll(
  '.metric-main-card, .metric-item, .expertise-card, .why-list li, ' +
  '.cs-stat, .testimonial-card, .blog-card, .process-step, .faq-item'
);

animateElements.forEach((el, index) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (index % 4) * 0.1 + 's';
  observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe counter elements
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const text = entry.target.textContent;
      const num = parseFloat(text);
      const suffix = text.replace(num.toString(), '');
      animateCounter(entry.target, num, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.cs-num').forEach(el => {
  counterObserver.observe(el);
});

// ===== CHART ANIMATION =====
const chartBars = document.querySelectorAll('.chart-bar');
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      chartBars.forEach(bar => {
        const targetHeight = bar.style.height;
        bar.style.height = '0%';
        setTimeout(() => {
          bar.style.transition = 'height 1s ease';
          bar.style.height = targetHeight;
        }, 100);
      });
      chartObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const csSection = document.querySelector('.case-study');
if (csSection) chartObserver.observe(csSection);

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#e63312';
      link.style.background = 'rgba(230,51,18,0.06)';
    }
  });
});

// ===== HANDLE WINDOW RESIZE FOR SLIDER =====
window.addEventListener('resize', () => {
  goToSlide(currentSlide);
});

// ===== PRELOADER =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

console.log('NCS Bharat - Namdhari Consultancy Service website loaded successfully!');
