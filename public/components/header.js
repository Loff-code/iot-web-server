// Header Web Component – full version with Register support + animated welcome

const FRAGMENT = '/partials/header.html';
const STYLE_URL = '/Style/header.css';

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  static getCorrect(input) {
    if (input <= 64) {
      return 32;

    } else {
      return input - 5;
    }
  }
  /* helper for the animated type‑printer effect */
  static sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  static async printer(el, input) {
    let out = '';
    let currentChar = this.getCorrect(input.charCodeAt(0)); // space
    for (let i = 0; i < input.length; i++) {
      const target = input.charCodeAt(i);
      while (currentChar < target) {
        el.textContent = out + String.fromCharCode(currentChar);
        await HeaderComponent.sleep(50);
        currentChar++;
      }
      out += String.fromCharCode(currentChar);
      currentChar = this.getCorrect(input.charCodeAt(i + 1));
    }
    el.textContent = out;
  }

  async connectedCallback() {
    try {
      /* fetch and cache the fragment */
      if (!HeaderComponent.tpl) {
        const res = await fetch(FRAGMENT, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Header fetch failed ${res.status}`);
        HeaderComponent.tpl = document.createElement('template');
        HeaderComponent.tpl.innerHTML = await res.text();
      }
      this.root.appendChild(HeaderComponent.tpl.content.cloneNode(true));

      /* bring in shared stylesheet once */
      if (!HeaderComponent.cssLinkAdded) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = STYLE_URL;
        this.root.prepend(link);
        HeaderComponent.cssLinkAdded = true;
      }

      /* inject modal style once */
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

      /* node references */
      const who = this.root.getElementById('who');
      const loginBtn = this.root.getElementById('loginBtn');
      const registerBtn = this.root.getElementById('registerBtn');
      const logoutBtn = this.root.getElementById('logoutBtn');

      const loginModal = this.root.getElementById('loginModal');
      const loginClose = loginModal.querySelector('.close');
      const loginForm = this.root.getElementById('loginForm');

      const regModal = this.root.getElementById('registerModal');
      const regClose = regModal.querySelector('.close');
      const regForm = this.root.getElementById('registerForm');

      /* helpers to show / hide modals */
      const openLogin = () => { loginModal.classList.add('show'); loginModal.setAttribute('aria-hidden', 'false'); };
      const closeLogin = () => { loginModal.classList.remove('show'); loginModal.setAttribute('aria-hidden', 'true'); this.root.getElementById('loginErr').textContent = ''; };

      const openReg = () => { regModal.classList.add('show'); regModal.setAttribute('aria-hidden', 'false'); };
      const closeReg = () => { regModal.classList.remove('show'); regModal.setAttribute('aria-hidden', 'true'); this.root.getElementById('regErr').textContent = ''; };

      /* fetch session state */
      const refreshSession = async () => {
        try {
          const res = await fetch('/me', { credentials: 'same-origin' });
          if (!res.ok) throw new Error(res.status);
          const { user } = await res.json();
          if (user) {
            // animate welcome using printer

            logoutBtn.style.display = 'inline';
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            await HeaderComponent.printer(who, `Welcome, ${user.name}!`);
          } else {
            who.textContent = '';
            logoutBtn.style.display = 'none';
            loginBtn.style.display = 'inline';
            registerBtn.style.display = 'inline';
          }
        } catch (err) { console.error(err); }
      };
      await refreshSession();

      /* event bindings */
      loginBtn.addEventListener('click', openLogin);
      loginClose.addEventListener('click', closeLogin);
      loginModal.addEventListener('click', e => { if (e.target === e.currentTarget) closeLogin(); });

      registerBtn.addEventListener('click', openReg);
      regClose.addEventListener('click', closeReg);
      regModal.addEventListener('click', e => { if (e.target === e.currentTarget) closeReg(); });

      this.root.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeLogin(); closeReg(); }
      });

      /* login form submit */
      loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'same-origin'
        });
        if (res.ok) { closeLogin(); refreshSession(); }
        else this.root.getElementById('loginErr').textContent = await res.text();
      });

      /* register form submit */
      regForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        const res = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'same-origin'
        });
        if (res.ok) {
          // optional auto‑login
          await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, password: data.password }),
            credentials: 'same-origin'
          });
          closeReg();
          refreshSession();
        } else {
          this.root.getElementById('regErr').textContent = await res.text();
        }
      });

      /* logout */
      logoutBtn.addEventListener('click', async () => {
        await fetch('/logout', { method: 'POST', credentials: 'same-origin' });
        refreshSession();
      });

    } catch (err) {
      console.error(err);
    }
  }
}

customElements.define('header-component', HeaderComponent);
