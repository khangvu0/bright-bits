document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            user_name: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // <-- sends/receives session cookie
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            messageDiv.textContent = '';
            const p = document.createElement('p');
            p.textContent = response.ok
                ? data.message
                : data.error || 'Login failed';
            p.style.color = response.ok ? 'green' : 'red';
            messageDiv.appendChild(p);

            if (response.ok) {
                // Redirects to spelling page on success
                window.location.href = '/spelling';
            }
        } catch (err) {
            // console.error(err);
            messageDiv.textContent = 'Network error!';
            messageDiv.style.color = 'red';
        }
    });
});
