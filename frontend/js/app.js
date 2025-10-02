// Runs in the browser
// document.getElementById('helloBtn')?.addEventListener('click', async () => {
//     const res = await fetch('/api/hello');
//     const data = await res.json();
//     alert(data.message); // "Hello from the backend!"
// });
// Runs in the browser
// document.getElementById('helloBtn')?.addEventListener('click', async () => {
//     const res = await fetch('/api/hello');
//     const data = await res.json();
//     alert(data.message); // "Hello from the backend!"
// });

const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        user_name: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        password: document.getElementById('password').value,
        grade_level: parseInt(document.getElementById('grade').value)
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });


        let data;

        try {
            data = await response.json();
        } catch {
            data = { error: 'Server did not return valid JSON' };
        }

        messageDiv.textContent = "";

        const p = document.createElement("p");
        p.textContent = response.ok ? data.message : (data.error || "Something went wrong");
        p.style.color = response.ok ? "green" : "red";

        messageDiv.appendChild(p);

        if (response.ok) {
            form.reset();
        }

    } catch (err) {
        console.error(err);
        messageDiv.textContent = "";

        const p = document.createElement("p");
        p.textContent = "Network error!";
        p.style.color = "red";
        messageDiv.appendChild(p);
    }
});
