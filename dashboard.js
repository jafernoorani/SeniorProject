// Function to handle form submission
document.getElementById('submit').addEventListener('click', function() {
    // Get input values
    const morningInput = document.getElementById('morning-input').value;
    const afternoonInput = document.getElementById('afternoon-input').value;
    const eveningInput = document.getElementById('evening-input').value;

    // Sample data for the chart (replace with actual data)
    const data = {
        labels: ['Morning', 'Afternoon', 'Evening'],
        datasets: [{
            label: 'Blood Sugar Levels',
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
            data: [morningInput, afternoonInput, eveningInput], // Blood sugar values
        }]
    };

    // Configuration for the chart
    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };

    // Get the canvas element for the chart
    const bloodSugarChartCanvas = document.getElementById('bloodSugarChart').getContext('2d');

    // Create and render the chart
    new Chart(bloodSugarChartCanvas, config);
});
