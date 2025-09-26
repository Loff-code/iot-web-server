function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function printer(el, input) {
    let out = '';
    let currentChar = input.charCodeAt(0) - 5 >= 32 ? input.charCodeAt(0) - 5 : 32;
    for (let i = 0; i < input.length; i++) {
        const target = input.charCodeAt(i);
        while (currentChar < target) {
            el.textContent = out + String.fromCharCode(currentChar);
            await sleep(50);
            currentChar++;
        }
        out += String.fromCharCode(currentChar);
        currentChar = input.charCodeAt(i + 1) - 5 >= 32 ? input.charCodeAt(i + 1) - 5 : 32;
    }
    el.textContent = out;
}

fetch("/partials/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const who = document.getElementById("who");
        const loginBtn = document.getElementById("loginBtn");
        const registerBtn = document.getElementById("registerBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        const loginModal = document.getElementById("loginModal");
        const loginClose = loginModal.querySelector(".modal-close");
        const loginForm = document.getElementById("loginForm");
        const loginErr = document.getElementById("loginErr");

        const registerModal = document.getElementById("registerModal");
        const registerClose = registerModal.querySelector(".modal-close");
        const registerForm = document.getElementById("registerForm");
        const registerErr = document.getElementById("registerErr");

        loginBtn.addEventListener("click", () => loginModal.style.display = "flex");
        loginClose.addEventListener("click", () => loginModal.style.display = "none");
        registerBtn.addEventListener("click", () => registerModal.style.display = "flex");
        registerClose.addEventListener("click", () => registerModal.style.display = "none");
        window.addEventListener("click", e => {
            if (e.target === loginModal) loginModal.style.display = "none";
            if (e.target === registerModal) registerModal.style.display = "none";
        });

        async function refreshSession() {
            const res = await fetch("/api/auth/me", { credentials: "same-origin" });
            if (res.ok) {
                const { user } = await res.json();
                if (user) {
                    who.textContent = "";
                    printer(who, `Welcome, ${user.name}!`);
                    loginBtn.style.display = "none";
                    registerBtn.style.display = "none";
                    logoutBtn.style.display = "inline-block";
                } else {
                    who.textContent = "";
                    loginBtn.style.display = "inline-block";
                    registerBtn.style.display = "inline-block";
                    logoutBtn.style.display = "none";
                }
            }
        }
        refreshSession();

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            loginErr.textContent = "";

            const data = {
                email: document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            };

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "same-origin"
            });

            if (res.ok) {
                loginModal.style.display = "none";
                refreshSession();
            } else {
                loginErr.textContent = await res.text();
            }
        });

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            registerErr.textContent = "";

            const data = {
                name: document.getElementById("regName").value,
                email: document.getElementById("regEmail").value,
                password: document.getElementById("regPassword").value
            };

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "same-origin"
            });

            if (res.ok) {
                registerModal.style.display = "none";
                refreshSession();
            } else {
                registerErr.textContent = await res.text();
            }
        });

        logoutBtn.addEventListener("click", async () => {
            await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
            refreshSession();
        });
    });
