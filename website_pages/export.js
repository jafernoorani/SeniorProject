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
    const chartCanvas = document.getElementById('bloodSugarChart');
    if (chartCanvas) {
        const chartImageUrl = chartCanvas.toDataURL('image/png'); // Capture the current state of the canvas as an image
        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        // Fixed dimensions for the chart and summary
        const pageWidth = pdf.internal.pageSize.getWidth() - 40; // 20mm margin on each side
        const chartHeight = 100; // Fixed height for the chart

        // Add chart image to PDF
        pdf.addImage(chartImageUrl, 'PNG', 20, 20, pageWidth, chartHeight);

        // Prepare to add the summary
        const summaryCard = document.getElementById('data-table').closest('.card');
        html2canvas(summaryCard, { scale: 3, windowWidth: 1200, windowHeight: summaryCard.scrollHeight, logging: true, useCORS: true }).then(canvas => {
            const summaryImg = canvas.toDataURL('image/png');
            const summaryImgHeight = (canvas.height * pageWidth) / canvas.width; // Maintain aspect ratio

            // Check if the summary will fit on the same page; if not, add a new page
            const currentHeight = 20 + chartHeight + 10; // Height used by the chart plus a 10mm margin
            if (currentHeight + summaryImgHeight > pdf.internal.pageSize.getHeight() - 20) {
                pdf.addPage(); // Add a new page if the summary won't fit
                pdf.addImage(summaryImg, 'PNG', 20, 20, pageWidth, summaryImgHeight);
            } else {
                pdf.addImage(summaryImg, 'PNG', 20, currentHeight, pageWidth, summaryImgHeight); // Add the summary below the chart
            }

            pdf.save(filename);
        }).catch(error => {
            console.error('Error generating PDF for summary:', error);
        });
    } else {
        console.error('Chart canvas not found.');
    }
}



// Example function to convert content to CSV format
function convertToCSV(content) {
    // Implement conversion based on your data structure
    return "Column1,Column2\nValue1,Value2";
}

