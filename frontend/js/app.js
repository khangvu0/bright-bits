// Runs in the browser
document.getElementById('helloBtn')?.addEventListener('click', async () => {
    const res = await fetch('/api/hello');
    const data = await res.json();
    alert(data.message); // "Hello from the backend!"
});
