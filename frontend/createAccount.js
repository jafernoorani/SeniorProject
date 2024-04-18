document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired");
    const signupForm = document.getElementById("signupForm");

    if (signupForm) { // Check if the form element exists
        signupForm.addEventListener("submit", function(event) {
            console.log("Form submission event fired");
            event.preventDefault(); // Prevent default form submission behavior
            
            // Get the form values
            const fullname = document.getElementById("fullName").value;
            const email = document.getElementById("emailAddress").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const username = document.getElementById("username").value;

            // Validate the email format
            if (!isValidEmail(email)) {
                alert("Please enter a valid email address");
                return;
            }

            // Validate the form data
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            // Create a FormData object and append form data
            const formData = new FormData();
            formData.append('fullName', fullname);
            formData.append('emailAddress', email);
            formData.append('password', password);
            formData.append('confirm-password', confirmPassword);
            formData.append('username', username);

            // Send the form data to the backend server
            sendData(formData);
        });
    } else {
        console.error("Signup form not found");
    }
});

// Function to validate email format
function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Function to send data to the backend server
function sendData(formData) {
    // Send POST request to the backend endpoint
    fetch('/saveData', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Data sent successfully');
        // Optionally handle success response here
    })
    .catch(error => {
        console.error('Error sending data:', error.message);
    });
}
