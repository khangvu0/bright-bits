// Header hamburger functionality for mobile view
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const toggleBtn = dropdown.querySelector('.nav_icon');
    const menu = dropdown.querySelector('.dropdown_menu');

    // Toggle menu on hamburger click
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault(); // prevent navigation
        menu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
});

// Footer Form Validation
function validateFooter(event) {
    event.preventDefault();
    document
        .querySelectorAll('.footer--error')
        .forEach((div) => (div.textContent = ''));

    const form = document.getElementById('footer-form');
    const phone = document.getElementById('phone');
    const phoneRegex =
        /^(?:\(\d{3}\)[\s\-\.]?|\d{3}[\s\-\.]?)\d{3}[\s\-\.]?\d{4}$/;

    let valid = true;

    if (!phoneRegex.test(phone.value)) {
        valid = false;
        showErrorFooter('phone', 'Please enter a valid phone number.');
        phone.classList.remove('input-valid');
        phone.classList.add('input-invalid');
    } else {
        phone.classList.remove('input-invalid');
        phone.classList.add('input-valid');
    }

    if (valid) {
        alert('Form submitted successfully');
        document.getElementById('footer-form').reset();
        phone.classList.remove('input-valid');

        const errorDiv = document.getElementById('phone-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// Error helper function
function showErrorFooter(id, message) {
    const errorDiv = document.getElementById('phone-error');
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}
