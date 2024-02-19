// login.js
function togglePassword() {
    var passwordInput = document.getElementById('password');
    var toggleCheckbox = document.getElementById('show-password');
    if (toggleCheckbox.checked) {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

document.getElementById('loginForm').addEventListener('submit', function(event){
    event.preventDefault(); // Prevent form submission and page reload

    var username = document.getElementById('email').value; // Changed from 'username' to 'email' to match your input ID
    var password = document.getElementById('password').value;

    // Add your login logic here
    if (username === "user" && password === "pass") {
        alert("Login successful!");
        // Redirect to another page or do other actions
    } else {
        alert("Login failed! Incorrect username or password.");
    }
});
