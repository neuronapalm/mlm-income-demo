(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  if (menuButton && menu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
      menu.hidden = true;
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      menu.hidden = !open;
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) {
        closeMenu();
        menuButton.focus();
      }
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }

  const currency = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  const sales = document.querySelector('#sales');
  const rate = document.querySelector('#rate');
  const expenses = document.querySelector('#expenses');
  const result = document.querySelector('#result');
  if (sales && rate && expenses && result) {
    const update = () => {
      const values = [sales, rate, expenses].map((input) => Number(input.value));
      document.querySelector('#sales-value').textContent = currency(values[0]);
      document.querySelector('#rate-value').textContent = `${values[1]} %`;
      document.querySelector('#expenses-value').textContent = currency(values[2]);
      [sales, rate, expenses].forEach((input) => {
        const fill = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
        input.style.setProperty('--fill', `${fill}%`);
      });
      const total = values[0] * values[1] / 100 - values[2];
      result.textContent = currency(total);
      result.classList.toggle('negative', total < 0);
    };
    [sales, rate, expenses].forEach((input) => input.addEventListener('input', update));
    update();
  }

  const copyButton = document.querySelector('[data-copy-email]');
  if (copyButton) {
    const status = document.querySelector('.copy-status');
    copyButton.addEventListener('click', async () => {
      const email = copyButton.dataset.copyEmail;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const field = document.createElement('textarea');
          field.value = email;
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          const copied = document.execCommand('copy');
          field.remove();
          if (!copied) throw new Error('Копирование не поддерживается');
        }
        status.textContent = 'Адрес скопирован';
      } catch {
        status.textContent = 'Не удалось скопировать. Выделите адрес вручную.';
      }
    });
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (window.gsap && window.ScrollTrigger && !motionQuery.matches) {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray('.reveal');
    items.forEach((item) => {
      gsap.from(item, {
        autoAlpha: 0,
        y: 24,
        duration: 0.72,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: { trigger: item, start: 'top 92%', once: true }
      });
    });
    motionQuery.addEventListener('change', (event) => {
      if (event.matches) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        gsap.killTweensOf(items);
        gsap.set(items, { clearProps: 'all' });
      }
    });
  }
})();
