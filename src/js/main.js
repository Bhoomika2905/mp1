/* ---------------------------------------------------------------------------
 * Navbar: shrink on scroll + highlight the section currently in view
 * ------------------------------------------------------------------------ */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main .section, footer.section'));

function currentNavbarHeight() {
  return navbar.getBoundingClientRect().height;
}

function updateNavbarState() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

function updateActiveLink() {
  const scrollPos = window.scrollY + currentNavbarHeight() + 1;
  const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

  let activeId = sections[0].id;
  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      activeId = section.id;
    }
  });
  if (atBottom) {
    activeId = sections[sections.length - 1].id;
  }

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === activeId);
  });
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateNavbarState();
    updateActiveLink();
    ticking = false;
  });
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', updateActiveLink);
onScroll();

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

/* ---------------------------------------------------------------------------
 * Smooth scrolling for in-page navigation, offset for the sticky navbar
 * ------------------------------------------------------------------------ */
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.dataset.section;
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const top = target.offsetTop - currentNavbarHeight() + 1;
    window.scrollTo({ top, behavior: 'smooth' });

    navMenu.classList.remove('open');
  });
});

/* ---------------------------------------------------------------------------
 * Carousel
 * ------------------------------------------------------------------------ */
const track = document.getElementById('carouselTrack');
const slides = track ? Array.from(track.children) : [];
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let activeSlide = 0;
let autoplayId = null;

function renderDots() {
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === activeSlide) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${activeSlide * 100}%)`;
  Array.from(dotsContainer.children).forEach((dot, i) => {
    dot.classList.toggle('active', i === activeSlide);
  });
}

function startAutoplay() {
  stopAutoplay();
  autoplayId = setInterval(() => goToSlide(activeSlide + 1), 6000);
}

function stopAutoplay() {
  if (autoplayId) clearInterval(autoplayId);
}

if (track && slides.length) {
  renderDots();
  goToSlide(0);
  startAutoplay();

  prevBtn.addEventListener('click', () => { goToSlide(activeSlide - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(activeSlide + 1); startAutoplay(); });

  const carousel = track.closest('.carousel');
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
}

/* ---------------------------------------------------------------------------
 * Modals
 * ------------------------------------------------------------------------ */
function openModal(modal) {
  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.modal-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const modal = document.getElementById(trigger.dataset.modal);
    if (modal) openModal(modal);
  });
});

document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', () => {
    const modal = el.closest('.modal');
    if (modal) closeModal(modal);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(closeModal);
  }
});

/* ---------------------------------------------------------------------------
 * Scroll-reveal animation
 * ------------------------------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
