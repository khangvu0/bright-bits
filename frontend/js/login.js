// DOM variables
const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const username = document.getElementById('username');
const password = document.getElementById('password');

// Error helper
function showError(id, message) {
    const errorDiv = document.getElementById(`error-${id}`);
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

// Validation function
function validateForm() {
    let valid = true;

    // Clear old errors
    document.querySelectorAll('.login--error').forEach((div) => {
        div.textContent = '';
    });

    // Username
    if (
        username.value.trim().length === 0 ||
        username.value.trim().length > 20
    ) {
        valid = false;
        showError('username', 'Username must be 1–20 characters.');
        username.classList.add('input-invalid');
        username.classList.remove('input-valid');
    } else {
        username.classList.add('input-valid');
        username.classList.remove('input-invalid');
    }

    // Password
    if (password.value.trim().length === 0 || password.value.length > 30) {
        valid = false;
        showError('password', 'Password must be 1–30 characters.');
        password.classList.add('input-invalid');
        password.classList.remove('input-valid');
    } else {
        password.classList.add('input-valid');
        password.classList.remove('input-invalid');
    }

    return valid;
}

// Submit handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return; // stop here if frontend invalid

    const formData = {
        user_name: username.value.trim(),
        password: password.value,
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // <-- sends/receives session cookie
            body: JSON.stringify(formData),
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = { error: 'Server did not return valid JSON' };
        }

        // Show backend response
        messageDiv.textContent = '';
        const p = document.createElement('p');
        p.textContent = response.ok
            ? data.message
            : data.error || 'Login failed';
        p.style.color = response.ok ? 'green' : 'red';
        messageDiv.appendChild(p);

        if (response.ok) {
            window.location.href = '/spelling';
            // clear valid/invalid borders
            [username, password].forEach((field) =>
                field.classList.remove('input-valid', 'input-invalid')
            );
            // Example redirect (uncomment if needed)
            // window.location.href = '/dashboard';
        }
    } catch (err) {
        console.error(err);
        messageDiv.textContent = '';
        const p = document.createElement('p');
        p.textContent = 'Network error!';
        p.style.color = 'red';
        messageDiv.appendChild(p);
    }
});
