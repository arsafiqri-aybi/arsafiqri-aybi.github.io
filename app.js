(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');
  const revealItems = [...document.querySelectorAll('.reveal')];
  let reveals;
  if ('IntersectionObserver' in window && !reduced.matches) {
    reveals = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.remove('waiting');
        reveals.unobserve(entry.target);
      }
    }, {rootMargin: '0px 0px 40px 0px', threshold: 0.05});
    for (const item of revealItems) { item.classList.add('waiting'); reveals.observe(item); }
  }
  const links = [...document.querySelectorAll('.chapter-link')];
  const chapters = [...document.querySelectorAll('.chapter')];
  const windowEl = document.querySelector('.chapter-window');
  const count = document.querySelector('.chapter-count');
  let active = 0, frame = 0;
  const sculpture = document.querySelector('.sculpture');
  const sculptureArea = document.querySelector('.hero-art');
  if (sculptureArea) {
    sculptureArea.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType !== 'mouse') return;
      const rect = sculptureArea.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      sculpture.style.transform = `perspective(800px) rotateX(${-y * 12}deg) rotateY(${x * 14}deg) rotate(${-9 + x * 6}deg) translate(${x * 12}px,${y * 8}px)`;
    }, {passive: true});
    sculptureArea.addEventListener('pointerleave', () => { sculpture.style.transform = ''; });
  }
  function centerLink(index, smooth = true) {
    if (!windowEl) return;
    const target = links[index];
    const mobile = matchMedia('(max-width: 760px)').matches;
    windowEl.scrollTo({
      top: mobile ? 0 : target.offsetTop - windowEl.offsetTop - (windowEl.clientHeight - target.offsetHeight) / 2,
      left: mobile ? target.offsetLeft - windowEl.offsetLeft - (windowEl.clientWidth - target.offsetWidth) / 2 : 0,
      behavior: smooth && !reduced.matches ? 'smooth' : 'instant'
    });
  }
  function setActive(index, force = false) {
    if (!links.length || (!force && index === active)) return;
    active = index;
    links.forEach((link, i) => {
      link.classList.toggle('active', i === index);
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    count.textContent = `${String(index + 1).padStart(2, '0')} / 06`;
    centerLink(index, !force);
  }
  function updateChapter() {
    frame = 0;
    const guide = innerHeight * 0.38;
    let index = 0;
    chapters.forEach((section, i) => { if (section.getBoundingClientRect().top <= guide) index = i; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 15) index = chapters.length - 1;
    setActive(index);
  }
  if (links.length) {
    setActive(0, true);
    updateChapter();
    addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateChapter); }, {passive: true});
    addEventListener('resize', () => { centerLink(active, false); updateChapter(); }, {passive: true});
    document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => {
      const index = Math.max(0, Math.min(chapters.length - 1, active + Number(button.dataset.chapter)));
      links[index].click();
    }));
    links.forEach(link => link.addEventListener('focus', () => {
      const index = links.indexOf(link); centerLink(index, false);
    }));
  }
  // Give anchor destinations a real focus target; normal links and Back remain native.
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const id = link.getAttribute('href').slice(1);
    const destination = document.getElementById(id);
    if (!destination) return;
    destination.setAttribute('tabindex', '-1');
    destination.focus({preventScroll: true});
  }));
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      if (sculpture) sculpture.style.transform = '';
      reveals?.disconnect();
      revealItems.forEach(item => item.classList.remove('waiting'));
      document.getAnimations().forEach(animation => animation.cancel());
    }
    centerLink(active, false);
  });
  addEventListener('pagehide', () => { if (frame) cancelAnimationFrame(frame); reveals?.disconnect(); });
  addEventListener('pageshow', event => {
    if (event.persisted) {
      revealItems.forEach(item => item.classList.remove('waiting'));
      if (links.length) updateChapter();
    }
  });
})();
