// Sample blood sugar data (replace with your actual data)
const bloodSugarData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Blood Sugar Levels',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [120, 130, 110, 140, 135, 125, 130], // Sample blood sugar values
    }]
};

// Configuration for the Chart.js chart
const config = {
    type: 'line',
    data: bloodSugarData,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Blood Sugar Level'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            }
        }
    }
};

// Initialize the Chart.js chart
const bloodSugarChart = new Chart(
    document.getElementById('bloodSugarChart'),
    config
);

// Function to update chart based on selected time frame
function updateChart(timeFrame) {
    // Implement data filtering based on the selected time frame
    // For simplicity, this example uses static data
    let newData;
    switch (timeFrame) {
        case '1day':
            newData = bloodSugarData;
            break;
        // Add cases for other time frames
        default:
            newData = bloodSugarData;
    }

    // Update chart data and redraw
    bloodSugarChart.data = newData;
    bloodSugarChart.update();
}

// Event listeners for interactive controls
document.getElementById('1dayBtn').addEventListener('click', () => updateChart('1day'));
document.getElementById('1weekBtn').addEventListener('click', () => updateChart('1week'));
document.getElementById('3monthsBtn').addEventListener('click', () => updateChart('3months'));
document.getElementById('1yearBtn').addEventListener('click', () => updateChart('1year'));
document.getElementById('yearToDateBtn').addEventListener('click', () => updateChart('yeartodate'));
