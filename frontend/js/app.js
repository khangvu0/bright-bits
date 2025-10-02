// Runs in the browser
// document.getElementById('helloBtn')?.addEventListener('click', async () => {
//     const res = await fetch('/api/hello');
//     const data = await res.json();
//     alert(data.message); // "Hello from the backend!"
// });
const form = document.getElementById("form");
const messageDiv = document.getElementById("message");

const formData = {
	user_name: document.getElementById("username").value.trim(),
	email: document.getElementById("email").value.trim(),
	firstName: document.getElementById("firstName").value.trim(),
	password: document.getElementById("password").value,
	grade_level: parseInt(document.getElementById("grade").value),
};

try {
	const response = await fetch("/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	});

	console.log(await response.json());

	let data;
	try {
		data = await response.json();
	} catch {
		data = { error: "Server did not return valid JSON" };
	}

	if (response.ok) {
		messageDiv.textContent = data.message;
		messageDiv.style.color = "green";
		form.reset();
	} else {
		messageDiv.textContent = data.error || "Something went wrong";
		messageDiv.style.color = "red";
	}
} catch (err) {
	console.error(err);
	messageDiv.textContent = "Network error!";
	messageDiv.style.color = "red";
}
