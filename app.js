/* Native routes remain the source of truth. No router, scroll hijacking or perpetual loops. */
(() => {
  'use strict';
  let dispose = () => {};
  function initialize() {
    dispose();
    const controller = new AbortController();
    const signal = controller.signal;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const activeAnimations = new Set();
    let observer;
    let frame = 0;
    let visibleHero = true;
    const hero = document.querySelector('.hero-object');
    const heroSection = document.querySelector('.hero');
    const animate = (element, keyframes, options) => {
      if (reduced.matches || document.hidden || !element.animate) return;
      const animation = element.animate(keyframes, options);
      activeAnimations.add(animation);
      animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
      return animation;
    };
    const cancelMotion = () => {
      activeAnimations.forEach(animation => animation.cancel());
      activeAnimations.clear();
      cancelAnimationFrame(frame);
      frame = 0;
      if (hero) {
        hero.style.removeProperty('--pointer-x');
        hero.style.removeProperty('--pointer-y');
        hero.style.removeProperty('--object-angle');
      }
    };
    const choices = [...document.querySelectorAll('.work-choice')];
    const panels = [...document.querySelectorAll('.work-panel')];
    const selector = document.querySelector('.selector-scroll');
    const counter = document.querySelector('.selector-count');
    let current = 0;
    let previewAnimation;
    function select(index, feedback = true, bringIntoView = false) {
      current = (index + choices.length) % choices.length;
      previewAnimation?.cancel();
      choices.forEach((choice, i) => choice.setAttribute('aria-pressed', String(i === current)));
      panels.forEach((panel, i) => {
        panel.hidden = i !== current;
        panel.toggleAttribute('data-active', i === current);
      });
      if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(choices.length).padStart(2, '0')}`;
      try { sessionStorage.setItem('ars-selected-work', choices[current].dataset.project); } catch { /* storage is optional */ }
      if (bringIntoView && selector) {
        const itemRect = choices[current].getBoundingClientRect();
        const listRect = selector.getBoundingClientRect();
        selector.scrollTo({top: selector.scrollTop + itemRect.top - listRect.top - 80, behavior: reduced.matches ? 'instant' : 'smooth'});
      }
      if (feedback) previewAnimation = animate(panels[current], [{opacity: .6, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 420, easing: 'cubic-bezier(.22,1,.36,1)'});
    }
    if (choices.length && choices.length === panels.length) {
      let stored;
      try { stored = sessionStorage.getItem('ars-selected-work'); } catch { /* storage is optional */ }
      const storedIndex = choices.findIndex(choice => choice.dataset.project === stored);
      select(storedIndex >= 0 ? storedIndex : 0, false);
      choices.forEach((choice, index) => {
        choice.addEventListener('click', () => select(index), {signal});
        choice.addEventListener('keydown', event => {
          if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : index + (event.key === 'ArrowDown' ? 1 : -1);
          select(next, true, true);
          choices[current].focus({preventScroll:true});
        }, {signal});
      });
      document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => select(current + Number(button.dataset.step), true, true), {signal}));
      document.documentElement.classList.add('is-enhanced');
      if (storedIndex > 2) select(storedIndex, false, true);
    }
    const caseId = document.body.dataset.case;
    if (caseId) {
      try { sessionStorage.setItem('ars-selected-work', caseId); } catch { /* storage is optional */ }
    }
    const syncHero = () => {
      frame = 0;
      if (!hero || !heroSection || reduced.matches || document.hidden || !visibleHero) return;
      const rect = heroSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
      hero.style.setProperty('--object-angle', `${-progress * 9}deg`);
    };
    const scheduleHero = () => {
      if (!frame && visibleHero && !document.hidden && !reduced.matches) frame = requestAnimationFrame(syncHero);
    };
    if (hero && heroSection) {
      window.addEventListener('scroll', scheduleHero, {passive:true,signal});
      window.addEventListener('resize', scheduleHero, {passive:true,signal});
      hero.addEventListener('pointermove', event => {
        if (!fine.matches || reduced.matches || document.hidden) return;
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 12}px`);
        hero.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 12}px`);
      }, {passive:true,signal});
      hero.addEventListener('pointerleave', () => {
        hero.style.removeProperty('--pointer-x'); hero.style.removeProperty('--pointer-y');
      }, {signal});
      animate(hero.querySelector('.core-object'), [{opacity:.6,transform:'translateY(24px) rotate(-4deg)'},{opacity:1,transform:'translateY(0) rotate(0deg)'}], {duration:1100,easing:'cubic-bezier(.22,1,.36,1)'});
      syncHero();
    }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.target === heroSection) {
            visibleHero = entry.isIntersecting;
            if (visibleHero) scheduleHero();
            else if (frame) {cancelAnimationFrame(frame); frame = 0;}
          } else if (entry.isIntersecting) {
            animate(entry.target, [{transform:'translateY(14px)'},{transform:'translateY(0)'}], {duration:600,easing:'cubic-bezier(.22,1,.36,1)'});
            observer.unobserve(entry.target);
          }
        });
      }, {threshold: .08});
      if (heroSection) observer.observe(heroSection);
      document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    }
    reduced.addEventListener('change', () => {
      if (reduced.matches) {
        cancelMotion();
        document.getAnimations().forEach(animation => animation.cancel());
      } else scheduleHero();
    }, {signal});
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelMotion();
      else scheduleHero();
    }, {signal});
    dispose = () => { controller.abort(); observer?.disconnect(); cancelMotion(); };
  }
  try { initialize(); } catch (error) {
    dispose();
    document.documentElement.classList.remove('is-enhanced');
    document.querySelectorAll('.work-panel').forEach(panel => {panel.hidden=false;});
    console.error('Portfolio enhancement unavailable; static content remains available.', error);
  }
  window.addEventListener('pagehide', () => dispose());
  window.addEventListener('pageshow', event => { if (event.persisted) initialize(); });
})();
