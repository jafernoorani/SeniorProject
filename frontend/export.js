document.addEventListener('DOMContentLoaded', function() {
    var exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        $('#exportBtn').on('click', function() {
            var exportFormat = $('#exportFormat').val();
            var date = new Date();
            var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var pageType = document.querySelector('.content').getAttribute('data-page-type'); // Add a data attribute in HTML
            var filename = pageType + "_" + dateString;

            switch (exportFormat) {
                case 'csv':
                    filename += ".csv";
                    var content = convertToCSV("This is a placeholder for " + pageType + " data."); 
                    downloadFile(filename, 'text/csv', content);
                    break;
                case 'json':
                    filename += ".json";
                    var content = JSON.stringify("This is a placeholder for " + pageType + " data."); 
                    downloadFile(filename, 'application/json', content);
                    break;
                case 'pdf':
                    generateAndDownloadPDF(filename, pageType);
                    break;
                default:
                    filename += ".txt";
                    var content = "This is a placeholder for " + pageType + " data.";
                    downloadFile(filename, 'text/plain', content);
            }
        });
    } else {
        console.error('Export button not found.');
    }
});

function generateAndDownloadPDF(filename, pageType) {
    var chartId = pageType === 'Blood_Sugar' ? 'bloodSugarChart' : 'weightChart';
    var tableId = pageType === 'Blood_Sugar' ? 'data-table' : 'weight-table';

    const chartCanvas = document.getElementById(chartId);
    const summaryCard = document.getElementById(tableId).closest('.card');

    if (chartCanvas && summaryCard) {
        const chartImageUrl = chartCanvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        // Add chart image to PDF
        const pageWidth = pdf.internal.pageSize.getWidth() - 40;
        const chartHeight = 100;
        pdf.addImage(chartImageUrl, 'PNG', 20, 20, pageWidth, chartHeight);

        // Prepare to add the summary
        html2canvas(summaryCard, { scale: 3, windowWidth: 1200, windowHeight: summaryCard.scrollHeight, logging: true, useCORS: true }).then(canvas => {
            const summaryImg = canvas.toDataURL('image/png');
            const summaryImgHeight = (canvas.height * pageWidth) / canvas.width;
            const currentHeight = 20 + chartHeight + 10;
            if (currentHeight + summaryImgHeight > pdf.internal.pageSize.getHeight() - 20) {
                pdf.addPage();
                pdf.addImage(summaryImg, 'PNG', 20, 20, pageWidth, summaryImgHeight);
            } else {
                pdf.addImage(summaryImg, 'PNG', 20, currentHeight, pageWidth, summaryImgHeight);
            }
            pdf.save(filename);
        }).catch(error => {
            console.error('Error generating PDF for summary:', error);
        });
    } else {
        console.error('Chart canvas or data table not found.');
    }
}

function convertToCSV(content) {
    return "Column1,Column2\nValue1,Value2"; // Adjust this to dynamically generate CSV content based on the data
}


