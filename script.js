'use strict';

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    spans[1].style.cssText = 'opacity: 0';
    spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
  });
});

// ── Product filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      card.style.animation = match ? 'fadeInUp 0.3s ease both' : '';
    });
  });
});

// ── Cart system ──
let cartCount = 0;
const cartCountEl = document.querySelector('.nav__cart-count');
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast() {
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.querySelectorAll('.product-card__add').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    cartCountEl.textContent = cartCount;
    cartCountEl.style.animation = 'none';
    cartCountEl.offsetHeight;
    cartCountEl.style.animation = 'cartBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    showToast();
  });
});

// ── Wishlist toggle ──
document.querySelectorAll('.product-card__wishlist').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

// ── Animate-on-scroll (Intersection Observer) ──
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

function addFadeClass(el, delay = 0) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
}
function revealEl(el) {
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
}

const animateTargets = [
  ...document.querySelectorAll('.collection-card'),
  ...document.querySelectorAll('.product-card'),
  ...document.querySelectorAll('.testimonial-card'),
  document.querySelector('.about__content'),
  document.querySelector('.about__visual'),
  document.querySelector('.newsletter__content'),
];

animateTargets.forEach((el, i) => {
  if (!el) return;
  addFadeClass(el, (i % 4) * 80);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      revealEl(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

animateTargets.forEach(el => { if (el) observer.observe(el); });

// ── Animated stat counters ──
const statNums = document.querySelectorAll('.about__stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (statsAnimated) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statsAnimated = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const duration = 1800;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 16);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) statsObserver.observe(aboutSection);

// ── Newsletter form ──
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  const original = btn.textContent;

  btn.textContent = 'Done! ✓';
  btn.style.background = '#4caf50';
  input.value = '';
  input.placeholder = 'You\'re subscribed!';

  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    input.placeholder = 'your@email.com';
  }, 3500);
});

// ── Inject keyframe animations ──
const style = document.createElement('style');
style.textContent = `
  @keyframes cartBounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
