/**
 * Authentication Handler: Processes login credentials via the Backend API.
 */
async function handleLogin() {
    // Retrieve credentials from the UI input fields
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    try {
        // Submit credentials to the authentication endpoint
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await response.json();

        // Redirect to dashboard upon successful authentication
        if (data.success) {
            window.location.href = 'dashboard.html';
        } else {
            // Display error message from the server (e.g., Invalid Credentials)
            alert("Login Failed: " + data.message);
        }
    } catch (err) {
        console.error("Authentication Error:", err);
        alert("An error occurred during login. Please check your connection.");
    }
}