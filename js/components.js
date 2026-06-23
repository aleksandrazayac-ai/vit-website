/**
 * Загрузка общих HTML-компонентов (header, menu, footer, форма)
 */
const SiteComponents = {
  get root() {
    return document.body.dataset.root || '../';
  },

  get pages() {
    const pages = document.body.dataset.pages;
    return pages !== undefined ? pages : '';
  },

  applyTokens(html) {
    return html
      .replace(/\{\{ROOT\}\}/g, this.root)
      .replace(/\{\{PAGES\}\}/g, this.pages);
  },

  async fetchComponent(name) {
    const response = await fetch(`${this.root}components/${name}.html`);
    if (!response.ok) throw new Error(`Component ${name} not found`);
    return this.applyTokens(await response.text());
  },

  async inject(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  async load() {
    const [headerHtml, menuHtml, footerHtml] = await Promise.all([
      this.fetchComponent('header'),
      this.fetchComponent('menu'),
      this.fetchComponent('footer'),
    ]);

    await this.inject('site-header', headerHtml);

    const menuWrapper = document.createElement('div');
    menuWrapper.innerHTML = menuHtml;

    const nav = menuWrapper.querySelector('.nav');
    const mobileMenu = menuWrapper.querySelector('.mobile-menu');

    const menuTarget = document.getElementById('site-menu');
    if (menuTarget && nav) {
      menuTarget.innerHTML = nav.outerHTML;
    }

    // Вне .header: backdrop-filter шапки иначе ломает position:fixed у меню
    if (mobileMenu && !document.querySelector('.mobile-menu')) {
      document.body.appendChild(mobileMenu);
    }

    await this.inject('site-footer', footerHtml);

    const formSlot = document.getElementById('site-contact-form');
    if (formSlot) {
      const formHtml = await this.fetchComponent('contact-form');
      formSlot.innerHTML = formHtml;
    }
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('site-header')) return;

  try {
    await SiteComponents.load();
    document.dispatchEvent(new CustomEvent('components:loaded'));
  } catch (err) {
    console.error('Ошибка загрузки компонентов:', err);
    document.dispatchEvent(new CustomEvent('components:loaded'));
  }
});
