document.addEventListener('DOMContentLoaded', () => {

  AOS.init({ duration: 700, once: true, offset: 60 });
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ===== MOBILE NAV ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });

    const backBtn = document.getElementById('backToTop');
    backBtn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  /* ===== BACK TO TOP ===== */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== DARK / LIGHT MODE ===== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const applyTheme = (dark) => {
    document.body.classList.toggle('dark-mode', dark);
    themeIcon.classList.toggle('fa-moon', !dark);
    themeIcon.classList.toggle('fa-sun', dark);
  };
  const savedTheme = localStorage.getItem('globar-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
  themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('globar-theme', isDark ? 'dark' : 'light');
  });

  /* ===== HERO FLIP WORD ===== */
  const flipWords = ['handled properly', 'made simple', 'done right', 'sorted for you'];
  let flipIndex = 0;
  const flipEl = document.getElementById('flipWord');
  setInterval(() => {
    flipIndex = (flipIndex + 1) % flipWords.length;
    flipEl.style.opacity = 0;
    setTimeout(() => {
      flipEl.textContent = flipWords[flipIndex];
      flipEl.style.opacity = 1;
    }, 250);
  }, 2600);
  flipEl.style.transition = 'opacity .25s ease';

  /* ===== SPLIT-FLAP COUNTERS ===== */
  const counters = document.querySelectorAll('.board-value');
  let countersStarted = false;
  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1400;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    });
  };
  const boardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) startCounters(); });
  }, { threshold: 0.4 });
  const boardEl = document.querySelector('.board');
  if (boardEl) boardObserver.observe(boardEl);

  /* ===== TESTIMONIAL SLIDER ===== */
  const track = document.getElementById('testiTrack');
  const cards = track.children;
  const dotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;

  for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.children;

  function goToSlide(i) {
    testiIndex = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${testiIndex * 100}%)`;
    [...dots].forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
  }
  document.getElementById('testiNext').addEventListener('click', () => goToSlide(testiIndex + 1));
  document.getElementById('testiPrev').addEventListener('click', () => goToSlide(testiIndex - 1));
  setInterval(() => goToSlide(testiIndex + 1), 6000);

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ===== CONTACT FORM (front-end only) ===== */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fname').value.trim();
    const phone = document.getElementById('fphone').value.trim();
    const interest = document.getElementById('finterest').value;
    const msg = document.getElementById('fmsg').value.trim();

    const waText = encodeURIComponent(
      `Hi Globar Travel, I'm ${name}.\nInterest: ${interest}\nPhone: ${phone}\n${msg}`
    );
    note.textContent = 'Opening WhatsApp with your enquiry pre-filled…';
    window.open(`https://wa.me/2348066966747?text=${waText}`, '_blank');
    form.reset();
  });

});
