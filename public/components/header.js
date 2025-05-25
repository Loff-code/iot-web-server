/* Header Web Component */

const FRAGMENT = '/partials/header.html';
const STYLE_URL = '/Style/header.css';

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    /* fetch and cache the fragment */
    if (!HeaderComponent.tpl) {
      const res = await fetch(FRAGMENT, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`Header fetch failed ${res.status}`);
      HeaderComponent.tpl = document.createElement('template');
      HeaderComponent.tpl.innerHTML = await res.text();
    }
    this.root.appendChild(HeaderComponent.tpl.content.cloneNode(true));

    /* bring in the shared CSS once */
    if (!HeaderComponent.cssLinkAdded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = STYLE_URL;
      this.root.prepend(link);
      HeaderComponent.cssLinkAdded = true;
    }

    /* modal-only styles */
    if (!HeaderComponent.modalStyleAdded) {
      const style = document.createElement('style');
      style.textContent = `
.modal{display:none;position:fixed;inset:0;justify-content:center;align-items:center;background:rgba(0,0,0,.5);backdrop-filter:blur(3px);z-index:1000}
.modal.show{display:flex}
.modal .box{background:#0f4a61;padding:2rem;min-width:260px;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.25);position:relative}
.modal .close{position:absolute;top:.5rem;right:.75rem;border:0;background:none;color:#fff;font-size:1.5rem;cursor:pointer}
.modal input{display:block;width:100%;margin:.5rem 0;padding:.5rem;border-radius:6px;border:none}
.modal button{margin-top:1rem;width:100%;padding:.6rem;border:none;border-radius:6px;background:#3498db;color:#fff;cursor:pointer}
.modal button:hover{background:#2980b9}
.error{color:#ff7070;font-size:.85rem;margin-top:.5rem}
`;
      this.root.prepend(style);
      HeaderComponent.modalStyleAdded = true;
    }

    /* grab nodes */
    const who       = this.root.getElementById('who');
    const loginBtn  = this.root.getElementById('loginBtn');
    const logoutBtn = this.root.getElementById('logoutBtn');
    const modal     = this.root.getElementById('loginModal');
    const closeX    = modal.querySelector('.close');
    const loginForm = this.root.getElementById('loginForm');

    /* helpers */
    const openModal  = () => { modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); };
    const closeModal = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); this.root.getElementById('loginErr').textContent=''; };

    /* session state */
    async function refreshSession() {
      try {
        const res = await fetch('/me', { credentials: 'same-origin' });
        if (!res.ok) throw new Error(res.status);
        const { user } = await res.json();
        if (user) {
          who.textContent = `Welcome, ${user.name}!`;
          logoutBtn.style.display = 'inline';
          loginBtn.style.display  = 'none';
        } else {
          who.textContent = '';
          logoutBtn.style.display = 'none';
          loginBtn.style.display  = 'inline';
        }
      } catch (err) { console.error(err); }
    }
    refreshSession();

    /* events */
    loginBtn .addEventListener('click', openModal);
    closeX   .addEventListener('click', closeModal);
    modal    .addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
    this.root.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const res  = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      if (res.ok) { closeModal(); refreshSession(); }
      else this.root.getElementById('loginErr').textContent = await res.text();
    });

    logoutBtn.addEventListener('click', async () => {
      await fetch('/logout', { method: 'POST', credentials: 'same-origin' });
      refreshSession();
    });
  }
}

customElements.define('header-component', HeaderComponent);
