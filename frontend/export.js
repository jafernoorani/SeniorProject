document.getElementById('exportBtn').addEventListener('click', function() {
    var exportFormat = document.getElementById('exportFormat').value;
    var date = new Date();
    var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    var pageType = document.querySelector('.content').getAttribute('data-page-type');
    var filename = pageType + "_" + dateString;

    var content;
    switch (exportFormat) {
        case 'csv':
            filename += ".csv";
            content = convertToCSV(); 
            break;
        case 'json':
            filename += ".json";
            content = JSON.stringify({data: "This is a placeholder for " + pageType + " data."});
            break;
        case 'pdf':
            generateAndDownloadPDF(filename, pageType);
            return; 
        default:
            filename += ".txt";
            content = "This is a placeholder for " + pageType + " data.";
    }
    downloadFile(filename, 'text/plain', content);
});

function downloadFile(filename, mimeType, content) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function generateAndDownloadPDF(filename, pageType) {
    // Wait for the necessary elements to be fully rendered
    waitForElementRender(pageType, () => {
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

            const pageWidth = pdf.internal.pageSize.getWidth() - 40;
            const chartHeight = 100;
            pdf.addImage(chartImageUrl, 'PNG', 20, 20, pageWidth, chartHeight);

            html2canvas(summaryCard, { scale: 3 }).then(canvas => {
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
    });
}

function waitForElementRender(pageType, callback) {
    const chartId = pageType === 'Blood_Sugar' ? 'bloodSugarChart' : 'weightChart';
    const tableId = pageType === 'Blood_Sugar' ? 'data-table' : 'weight-table';

    const checkExist = setInterval(function() {
        const chartCanvas = document.getElementById(chartId);
        const summaryCard = document.getElementById(tableId);
        if (chartCanvas && summaryCard) {
            clearInterval(checkExist);
            callback();
        }
    }, 100); // check every 100ms
}


function convertToCSV(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(',')); // create header row

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = (''+row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
}