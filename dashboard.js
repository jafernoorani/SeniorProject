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

document.addEventListener('DOMContentLoaded', function() {
    var exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        $('#exportBtn').on('click', function() {
            var exportFormat = $('#exportFormat').val();
            var date = new Date();
            var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var filename = "Blood_Sugar_" + dateString;

            switch (exportFormat) {
                case 'csv':
                    filename += ".csv";
                    var content = convertToCSV("This is a placeholder for blood sugar data."); 
                    downloadFile(filename, 'text/csv', content);
                    break;
                case 'json':
                    filename += ".json";
                    var content = JSON.stringify("This is a placeholder for blood sugar data."); 
                    downloadFile(filename, 'application/json', content);
                    break;
                case 'pdf':
                    generateAndDownloadPDF(filename); // No need to add ".pdf" again
                    break;
                default:
                    filename += ".txt";
                    var content = "This is a placeholder for blood sugar data.";
                    downloadFile(filename, 'text/plain', content);
            }
        });
    } else {
        console.error('Export button not found.');
    }
});

function downloadFile(filename, mimeType, content) {
    var blob = new Blob([content], { type: mimeType });
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
}


// Function to generate and download PDF
function generateAndDownloadPDF(filename) {
    html2canvas(document.querySelector("#content"), { scale: 2, useCORS: true }).then(canvas => {
        var imgData = canvas.toDataURL('image/png', 1.0); // Using PNG for potentially better quality

        var pdf = new window.jspdf.jsPDF({
            orientation: 'p', // Changed to 'p' for portrait mode, adjust as needed
            unit: 'mm', // Using millimeters for units
            format: 'a4' // Standard A4 paper size
        });

        // Margins for the PDF, adjust as needed
        var margin = 10; // 10mm margin
        var maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        var maxHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

        // Calculate the width and height, maintaining aspect ratio
        var widthRatio = maxWidth / canvas.width;
        var heightRatio = maxHeight / canvas.height;
        var ratio = Math.min(widthRatio, heightRatio);
        var canvasWidth = canvas.width * ratio;
        var canvasHeight = canvas.height * ratio;

        // Center the image horizontally and vertically
        var x = (pdf.internal.pageSize.getWidth() - canvasWidth) / 2;
        var y = (pdf.internal.pageSize.getHeight() - canvasHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, canvasWidth, canvasHeight);
        pdf.save(filename);
    }).catch(error => {
        console.error('Error generating PDF:', error);
    });
}




// Example function to convert content to CSV format
function convertToCSV(content) {
    // Implement conversion based on your data structure
    return "Column1,Column2\nValue1,Value2";
}
