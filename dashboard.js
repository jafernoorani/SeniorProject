// Get references to the input fields and the output tbody element
const morningInput = document.getElementById('morning');
const afternoonInput = document.getElementById('afternoon');
const eveningInput = document.getElementById('evening');
const outputTbody = document.getElementById('output');

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to handle form submission
function handleSubmit() {
    // Get blood sugar levels from input fields
    const morningLevel = morningInput.value;
    const afternoonLevel = afternoonInput.value;
    const eveningLevel = eveningInput.value;

    // Get current date
    const currentDate = getCurrentDate();

    // Create a new table row
    const newRow = document.createElement('tr');

    // Add table data for date and blood sugar levels
    newRow.innerHTML = `
        <td>${currentDate}</td>
        <td>${morningLevel}</td>
        <td>${afternoonLevel}</td>
        <td>${eveningLevel}</td>
        <td><button class="edit-btn">Edit</button></td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    // Append the new row to the output table
    outputTbody.appendChild(newRow);

    // Clear input fields
    morningInput.value = '';
    afternoonInput.value = '';
    eveningInput.value = '';
}

// Add event listener to the submit button
const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', handleSubmit);
