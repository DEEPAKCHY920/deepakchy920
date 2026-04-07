/* ==========================================================
   DEEPAK CHOUDHARY — PORTFOLIO SCRIPT
   Loader · Cursor · Navbar · Particles · Typing · Scroll
   ========================================================== */

'use strict';

// ===== LOADER =====
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  document.body.classList.add('loading');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    initHeroAnimations();
  }, 2000);
});

// ===== CUSTOM CURSOR =====
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX   = 0, ringY   = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-category, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
});

// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.size  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    // Alternate between primary and secondary colors
    const colors = ['0, 212, 255', '121, 40, 202', '255, 0, 128'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

// Draw connections between nearby particles
function drawConnections() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== TYPING EFFECT =====
const phrases = [
  'Frontend Developer',
  'C++ Programmer',
  'UI Enthusiast',
  'Problem Solver',
  'Full Stack Learner',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typedEl   = document.getElementById('typedText');

function typeEffect() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 60 : 90);
}

// ===== HERO ANIMATIONS (triggered after loader) =====
function initHeroAnimations() {
  // Start typing effect
  setTimeout(typeEffect, 800);

  // Stagger hero reveal-up elements
  document.querySelectorAll('.hero .reveal-up').forEach((el) => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => {
      el.classList.add('visible');
    }, delay);
  });
}

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Skip hero elements (handled by initHeroAnimations)
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const targetW = bar.dataset.width + '%';
          setTimeout(() => { bar.style.width = targetW; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current = 0;
  const step  = target / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current) + (target > 5 ? '+' : '+');
    if (current >= target) clearInterval(timer);
  }, 40);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target);
          animateCounter(el, target);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.about-quick-stats').forEach(el => counterObserver.observe(el));

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      shakeForm();
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('contactEmail').style.borderColor = '#ff0080';
      setTimeout(() => {
        document.getElementById('contactEmail').style.borderColor = '';
      }, 2000);
      return;
    }

    // Simulate sending (replace with EmailJS or Formspree for real sending)
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled  = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = '<span>Send Message</span>';
      submitBtn.disabled  = false;
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);

      // Build mailto link as fallback
      const subject = document.getElementById('contactSubject')?.value || 'Portfolio Contact';
      window.location.href = `mailto:ticktechtoe@outlook.com?subject=${encodeURIComponent(subject)}&body=From: ${encodeURIComponent(name)} <${encodeURIComponent(email)}>%0A%0A${encodeURIComponent(message)}`;
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  contactForm.classList.add('shake');
  setTimeout(() => contactForm.classList.remove('shake'), 600);
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.offsetTop - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== GITHUB PROJECTS FETCH (Dynamic) =====
async function fetchGitHubRepos() {
  try {
    const res  = await fetch('https://api.github.com/users/DEEPAKCHY920/repos?sort=updated&per_page=6&type=public');
    if (!res.ok) return; // fallback to static cards
    const data = await res.json();
    if (!data || data.length === 0) return;

    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    // Clear static cards and render dynamic ones
    grid.innerHTML = '';

    data.forEach((repo, i) => {
      if (repo.fork) return; // skip forks

      const langColors = {
        'HTML':       '#e34c26',
        'CSS':        '#1572b6',
        'JavaScript': '#f7df1e',
        'C++':        '#00599c',
        'C':          '#a8b9cc',
        'Python':     '#3572a5',
      };
      const color = langColors[repo.language] || '#7928ca';

      const card = document.createElement('div');
      card.className = 'project-card reveal-up';
      card.dataset.delay = (i % 2) * 100;
      card.innerHTML = `
        <div class="project-card-top">
          <div class="project-card-icon">📁</div>
          <div class="project-card-links">
            <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="GitHub Repository">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" aria-label="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
          </div>
        </div>
        <h3 class="project-card-title">${formatRepoName(repo.name)}</h3>
        <p class="project-card-desc">${repo.description || 'A project built with care and clean code — explore the repository to learn more.'}</p>
        <div class="project-card-tech">
          ${repo.language ? `<span style="border-color:${color}33;color:${color}">${repo.language}</span>` : ''}
          ${repo.stargazers_count > 0 ? `<span>⭐ ${repo.stargazers_count}</span>` : ''}
          ${repo.forks_count > 0 ? `<span>🍴 ${repo.forks_count}</span>` : ''}
        </div>
      `;
      grid.appendChild(card);

      // Re-observe newly added cards
      revealObserver.observe(card);
    });

    // If fewer than 2 repos fetched, keep it (static fallback better)
    if (grid.children.length === 0) {
      grid.innerHTML = getStaticCards();
    }

  } catch (err) {
    // Silently fall back to static project cards
    console.warn('GitHub API unavailable, using static project cards.', err);
  }
}

function formatRepoName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

fetchGitHubRepos();

// ===== TILT EFFECT ON PROJECT CARDS =====
function initTilt() {
  document.querySelectorAll('.project-card, .skill-category, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 5;
      const tiltY = ((x - cx) / cx) * -5;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Init tilt after a short delay
setTimeout(initTilt, 2500);

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  }
});

// ===== OVERLAY CLOSE ON OUTSIDE CLICK =====
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  }
});

// ===== PROFILE PHOTO FALLBACK =====
const profilePhoto = document.getElementById('profilePhoto');
if (profilePhoto) {
  // Try GitHub avatar
  const ghAvatar = `https://avatars.githubusercontent.com/DEEPAKCHY920`;
  profilePhoto.src = ghAvatar;
  profilePhoto.onerror = () => {
    profilePhoto.src = 'https://ui-avatars.com/api/?name=Deepak+Choudhary&background=00d4ff&color=050810&size=400&bold=true&format=svg';
    profilePhoto.onerror = null;
  };
}

// ===== FOOTER YEAR =====
const yearEls = document.querySelectorAll('.footer-year');
yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });
