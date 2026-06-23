/**
 * VIT-LTD Corporate Website
 * Main JavaScript module
 */

const VIT = {
  init() {
    this.setActiveNavLink();
    this.initHeader();
    this.initMobileMenu();
    this.initSmoothScroll();
    this.initScrollReveal();
    this.initSolutionsTabs();
    this.initContactForm();
    this.initCounterAnimation();
    this.initBlogExpand();
  },

  setActiveNavLink() {
    const pageNav = document.body.dataset.nav;
    if (pageNav) {
      document.querySelectorAll(`[data-nav="${pageNav}"]`).forEach(link => {
        link.classList.add('is-active');
      });
      return;
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  },

  initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id.length <= 1) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  },

  initMobileMenu() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.mobile-menu');
    if (!burger || !menu) return;

    const closeMenu = () => {
      burger.classList.remove('is-active');
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    const openMenu = () => {
      burger.classList.add('is-active');
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Закрыть меню');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    };

    const toggle = () => {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    };

    burger.addEventListener('click', toggle);

    menu.querySelectorAll('.mobile-menu__link, .mobile-menu__actions a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
      if (e.matches && menu.classList.contains('is-open')) closeMenu();
    });
  },

  initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  },

  initSolutionsTabs() {
    const tabs = document.querySelectorAll('.solutions-tab');
    const panels = document.querySelectorAll('.solution-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));

        tab.classList.add('is-active');
        document.getElementById(`panel-${target}`)?.classList.add('is-active');
      });
    });
  },

  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        message: form.querySelector('#message'),
      };

      let isValid = true;

      Object.entries(fields).forEach(([key, field]) => {
        const errorEl = field.parentElement.querySelector('.form-error');
        field.classList.remove('error');

        if (key === 'phone') return;

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          if (errorEl) errorEl.textContent = 'Это поле обязательно';
        } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
          field.classList.add('error');
          if (errorEl) errorEl.textContent = 'Введите корректный email';
        } else if (errorEl) {
          errorEl.textContent = '';
        }
      });

      if (isValid) {
        const submitBtn = form.querySelector('[type="submit"]');

        if (form.dataset.netlify !== undefined) {
          submitBtn.disabled = true;
          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
          })
            .then((res) => {
              if (res.ok) {
                this.showToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
              } else {
                this.showToast('Не удалось отправить заявку. Позвоните: +7 (4242) 30-04-20', 'error');
              }
            })
            .catch(() => {
              this.showToast('Ошибка сети. Позвоните: +7 (4242) 30-04-20', 'error');
            })
            .finally(() => {
              submitBtn.disabled = false;
            });
        } else {
          this.showToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
          form.reset();
        }
      }
    });
  },

  showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast is-${type}`;

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => toast.classList.remove('is-visible'), 4000);
  },

  initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  },

  initBlogExpand() {
    document.querySelectorAll('.blog-item').forEach(item => {
      const toggle = item.querySelector('.blog-item__toggle');
      const full = item.querySelector('.blog-item__full');
      if (!toggle || !full) return;

      toggle.addEventListener('click', () => {
        const expanded = !item.classList.contains('is-expanded');
        item.classList.toggle('is-expanded', expanded);
        full.hidden = !expanded;
        toggle.textContent = expanded ? 'Свернуть' : 'Читать полностью';
        toggle.setAttribute('aria-expanded', String(expanded));
      });
    });
  },
};

function boot() {
  VIT.init();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('site-header')) {
    document.addEventListener('components:loaded', boot, { once: true });
  } else {
    boot();
  }
});
