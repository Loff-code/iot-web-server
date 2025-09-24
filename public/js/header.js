fetch("/partials/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        // Modal logic
        const modal = document.getElementById("loginModal");
        const loginBtn = document.getElementById("loginBtn");
        const closeBtn = modal.querySelector(".modal-close");
        const loginForm = document.getElementById("loginForm");
        const loginErr = document.getElementById("loginErr");

        loginBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

        // Handle login form submission
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            loginErr.textContent = "";

            const data = {
                email: document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            };

            try {
                const res = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    credentials: "same-origin"
                });

                if (res.ok) {
                    modal.style.display = "none"; // close modal
                    window.location.reload();     // refresh page to reflect logged-in state
                } else {
                    loginErr.textContent = await res.text();
                }
            } catch (err) {
                loginErr.textContent = "Network error";
                console.error(err);
            }
        });
    });
