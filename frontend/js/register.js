// DOM variables
const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');
const username = document.getElementById('username');
const email = document.getElementById('email');
const firstName = document.getElementById('first_name');
const password = document.getElementById('password');
const grade = document.getElementById('grade');
const agreeTerms = document.getElementById('agree-terms');

// Regex patterns
const nameRegex = /^[a-zA-Z]{2,12}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    document.querySelectorAll('.register--error').forEach((div) => {
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

    // Email
    if (!emailRegex.test(email.value)) {
        valid = false;
        showError('email', 'Please enter a valid email address.');
        email.classList.add('input-invalid');
        email.classList.remove('input-valid');
    } else {
        email.classList.add('input-valid');
        email.classList.remove('input-invalid');
    }

    // First name
    if (!nameRegex.test(firstName.value)) {
        valid = false;
        showError('first-name', 'First name must be 2–12 letters.');
        firstName.classList.add('input-invalid');
        firstName.classList.remove('input-valid');
    } else {
        firstName.classList.add('input-valid');
        firstName.classList.remove('input-invalid');
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

    // Grade
    if (!grade.value) {
        valid = false;
        showError('grade', 'Please select a grade level.');
        grade.classList.add('input-invalid');
        grade.classList.remove('input-valid');
    } else {
        grade.classList.add('input-valid');
        grade.classList.remove('input-invalid');
    }

    // Terms
    if (!agreeTerms.checked) {
        valid = false;
        showError('terms', 'You must agree to the terms and conditions.');
        agreeTerms.classList.add('input-invalid');
        agreeTerms.classList.remove('input-valid');
    } else {
        agreeTerms.classList.add('input-valid');
        agreeTerms.classList.remove('input-invalid');
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
        email: email.value.trim(),
        first_name: firstName.value.trim(),
        password: password.value,
        grade_level: parseInt(grade.value),
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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
            : data.error || 'Something went wrong';
        p.style.color = response.ok ? 'green' : 'red';
        messageDiv.appendChild(p);

        if (response.ok) {
            window.location.href = '/login';
            // clear all valid states after reset
            [username, email, firstName, password, grade, agreeTerms].forEach(
                (field) =>
                    field.classList.remove('input-valid', 'input-invalid')
            );
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
