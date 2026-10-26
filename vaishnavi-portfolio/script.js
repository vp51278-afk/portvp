(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  const words = ['Full Stack Developer', 'GenAI Explorer', 'Problem Solver', 'Lifelong Learner'];
  const typingTarget = document.getElementById('typing-text');
  let wordIndex = 0, charIndex = words[0].length, deleting = true;
  function typeLoop() {
    const word = words[wordIndex];
    if (deleting) {
      charIndex--;
      typingTarget.textContent = word.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
      setTimeout(typeLoop, 42);
    } else {
      const nextWord = words[wordIndex];
      charIndex++;
      typingTarget.textContent = nextWord.slice(0, charIndex);
      if (charIndex >= nextWord.length) { deleting = true; setTimeout(typeLoop, 1450); }
      else setTimeout(typeLoop, 72);
    }
  }
  setTimeout(typeLoop, 1500);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const topButton = document.querySelector('.back-top');
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('scroll', () => topButton.classList.toggle('visible', window.scrollY > 500), { passive: true });
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('pointermove', event => {
    if (glow && window.matchMedia('(hover: hover)').matches) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
  }, { passive: true });
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sliding project showcase: touch, mouse drag and arrow controls.
  const track = document.getElementById('projects-track');
  const viewport = document.getElementById('projects-viewport');
  const prev = document.getElementById('projects-prev');
  const next = document.getElementById('projects-next');
  const progress = document.getElementById('slider-progress-fill');
  if (track && viewport && prev && next) {
    const cards = [...track.querySelectorAll('.project-card')];
    let index = 0, startX = 0, dragX = 0, dragging = false;
    const perView = () => window.innerWidth <= 640 ? 1 : 2;
    const maxIndex = () => Math.max(0, cards.length - perView());
    function updateSlider() {
      index = Math.max(0, Math.min(index, maxIndex()));
      const card = cards[0];
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap || style.columnGap) || 0;
      const amount = (card?.getBoundingClientRect().width || 0) + gap;
      track.style.transform = `translateX(${-index * amount}px)`;
      prev.disabled = index === 0;
      next.disabled = index >= maxIndex();
      prev.style.opacity = prev.disabled ? '.42' : '1';
      next.style.opacity = next.disabled ? '.42' : '1';
      if (progress) progress.style.width = `${((index + perView()) / cards.length) * 100}%`;
    }
    prev.addEventListener('click', () => { index--; updateSlider(); });
    next.addEventListener('click', () => { index++; updateSlider(); });
    viewport.addEventListener('pointerdown', e => { startX = e.clientX; dragX = startX; dragging = true; });
    viewport.addEventListener('pointermove', e => { if (dragging) dragX = e.clientX; });
    const finishDrag = () => {
      if (!dragging) return;
      const delta = dragX - startX;
      if (Math.abs(delta) > 45) index += delta < 0 ? 1 : -1;
      dragging = false; updateSlider();
    };
    viewport.addEventListener('pointerup', finishDrag);
    viewport.addEventListener('pointercancel', finishDrag);
    viewport.addEventListener('pointerleave', finishDrag);
    window.addEventListener('resize', updateSlider);
    // Auto-advance the showcase, pausing when the user hovers or focuses it.
    let autoTimer = setInterval(() => { if (!viewport.matches(':hover') && !viewport.contains(document.activeElement)) { index = index >= maxIndex() ? 0 : index + 1; updateSlider(); } }, 5200);
    viewport.addEventListener('mouseenter', () => clearInterval(autoTimer), { once: true });
    updateSlider();
  }

})();


// Contact form: prepares an email in the visitor's email application.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const note = document.getElementById('contactNote');
    if (!name || !email || !subject || !message) {
      note.textContent = 'Please complete all fields before sending.';
      return;
    }
    const mailSubject = encodeURIComponent('Portfolio contact: ' + subject);
    const mailBody = encodeURIComponent(message + '\n\nFrom: ' + name + '\nReply to: ' + email);
    note.textContent = 'Opening your email application. Please press Send there to deliver your message.';
    window.location.href = 'mailto:vp5127812@gmail.com?subject=' + mailSubject + '&body=' + mailBody;
  });
}
