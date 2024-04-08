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
    // Create a temporary div
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'inline-block';

    // Clone the .card elements and append them to the temporary div
    const chartCard = document.getElementById('bloodSugarChart').closest('.card').cloneNode(true);
    const summaryCard = document.getElementById('data-table').closest('.card').cloneNode(true);
    
    tempDiv.appendChild(chartCard);
    tempDiv.appendChild(summaryCard);

    // Convert the chart canvas to an image after cloning
    const clonedChartCanvas = chartCard.querySelector('canvas');
    if (clonedChartCanvas) {
        const chartImageUrl = clonedChartCanvas.toDataURL('image/png');
        const chartImage = new Image();
        chartImage.src = chartImageUrl;
        chartImage.onload = () => { // Ensure the image is loaded before replacing
            clonedChartCanvas.parentNode.replaceChild(chartImage, clonedChartCanvas);
        };
    }

    // Append the temporary div to the body
    document.body.appendChild(tempDiv);

    // Wait for the chart image to load before rendering the PDF
    setTimeout(() => {
        html2canvas(tempDiv, { scale: 2, useCORS: true }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to maintain aspect ratio
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(filename);

            // Remove the temporary div after generating the PDF
            document.body.removeChild(tempDiv);
        }).catch(error => {
            console.error('Error generating PDF:', error);
            document.body.removeChild(tempDiv);
        });
    }, 100); // Adjust the timeout if necessary
}




// Example function to convert content to CSV format
function convertToCSV(content) {
    // Implement conversion based on your data structure
    return "Column1,Column2\nValue1,Value2";
}

