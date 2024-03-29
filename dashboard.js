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

// Get the canvas element for the chart
const bloodSugarChartCanvas = document.getElementById('bloodSugarChart').getContext('2d');

// Prepare the chart configuration
const data = {
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
};

const options = {
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            type: 'time',
            time: {
                unit: 'week' // This is the default. It can be changed to 'month', 'quarter', or 'year'
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Create the chart with the configuration
let bloodSugarChart = new Chart(bloodSugarChartCanvas, {
    type: 'line',
    data: data,
    options: options
});

// Function to handle form submission
document.getElementById('submit-levels').addEventListener('click', function() {
    // Get input values
    const morningInput = document.getElementById('morning-level').value;
    const afternoonInput = document.getElementById('afternoon-level').value;
    const eveningInput = document.getElementById('evening-level').value;
    const currentDate = new Date().toLocaleDateString();

    // Add the data to the arrays
    morningLevels.push(morningInput);
    afternoonLevels.push(afternoonInput);
    eveningLevels.push(eveningInput);
    dates.push(currentDate);

    // Update the chart
    updateChart(bloodSugarChart, currentDate, morningInput, afternoonInput, eveningInput);

    // Add the data to the table
    addDataToTable(currentDate, morningInput, afternoonInput, eveningInput);
    
    // Clear the input fields
    document.getElementById('morning-level').value = '';
    document.getElementById('afternoon-level').value = '';
    document.getElementById('evening-level').value = '';
});
