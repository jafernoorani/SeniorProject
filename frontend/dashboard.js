// Create arrays to store the blood sugar levels
let morningLevels = [];
let afternoonLevels = [];
let eveningLevels = [];
let dates = [];

// Function to add data to the table
function addDataToTable(date, morning, afternoon, evening) {
    const table = document.getElementById('data-table');
    const row = table.insertRow(-1); // Insert a row at the end of the table
    const dateCell = row.insertCell(0);
    const morningCell = row.insertCell(1);
    const afternoonCell = row.insertCell(2);
    const eveningCell = row.insertCell(3);

    dateCell.innerText = date;
    morningCell.innerText = morning;
    afternoonCell.innerText = afternoon;
    eveningCell.innerText = evening;
}

// Function to update the chart
function updateChart(chart, label, morning, afternoon, evening) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(morning);
    chart.data.datasets[1].data.push(afternoon);
    chart.data.datasets[2].data.push(evening);
    chart.update();
}

// Prepare the chart
const bloodSugarChartCanvas = document.getElementById('bloodSugarChart').getContext('2d');
const chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Morning Levels',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: []
            },
            {
                label: 'Afternoon Levels',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: []
            },
            {
                label: 'Evening Levels',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
};
let bloodSugarChart = new Chart(bloodSugarChartCanvas, chartConfig);

// Handle form submission
document.getElementById('submit-levels').addEventListener('click', function() {
    const morningInput = document.getElementById('morning-level').value;
    const afternoonInput = document.getElementById('afternoon-level').value;
    const eveningInput = document.getElementById('evening-level').value;
    const currentDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    morningLevels.push(morningInput);
    afternoonLevels.push(afternoonInput);
    eveningLevels.push(eveningInput);
    dates.push(currentDate);

    updateChart(bloodSugarChart, currentDate, morningInput, afternoonInput, eveningInput);
    addDataToTable(currentDate, morningInput, afternoonInput, eveningInput);

    document.getElementById('morning-level').value = '';
    document.getElementById('afternoon-level').value = '';
    document.getElementById('evening-level').value = '';
});

// Update the summary when a new date is picked
document.getElementById('datePicker').addEventListener('change', function() {
    const selectedDate = this.value;
    updateSummaryForDate(selectedDate);
});

// Function to clear the summary table except for the header
function clearSummaryTable() {
    const summaryTable = document.getElementById('data-table');
    while (summaryTable.rows.length > 1) {
        summaryTable.deleteRow(1); // Delete the second row repeatedly until only the header remains
    }
}



// Function to update the summary table based on the selected date
function updateSummaryForDate(selectedDate) {
    console.log("Updating summary for date:", selectedDate); // Add this line for debugging

    // Clear the table every time before updating
    clearSummaryTable();

    const summaryTableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const dateIndex = dates.indexOf(selectedDate);

    console.log("Date index:", dateIndex); // Add this line for debugging

    // Check if there is data for the selected date and update the table
    if (dateIndex !== -1) {
        const row = summaryTableBody.insertRow();
        row.insertCell(0).innerText = selectedDate;
        row.insertCell(1).innerText = morningLevels[dateIndex];
        row.insertCell(2).innerText = afternoonLevels[dateIndex];
        row.insertCell(3).innerText = eveningLevels[dateIndex];
    } else {
        // Display a message if there is no data for the selected date
        const row = summaryTableBody.insertRow();
        const cell = row.insertCell(0);
        cell.innerText = "No data available for this date";
        cell.colSpan = 4;
        cell.style.textAlign = 'center';
    }
}

// Event listener for date change to update the summary table
document.getElementById('selectedDate').addEventListener('change', function(event) {
    const selectedDate = event.target.value;
    console.log("Selected Date:", selectedDate); // Add this line for debugging
    updateSummaryForDate(selectedDate);
});


