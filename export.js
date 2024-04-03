document.addEventListener('DOMContentLoaded', function () {
    var exportBtn = document.getElementById('exportBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission

            var exportFormat = document.getElementById('exportFormat').value;
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
                    filename += ".pdf"; // Filename for the PDF
                    generateAndDownloadPDF(filename); // Generate and download PDF
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

function generateAndDownloadPDF(filename) {
    html2canvas(document.querySelector("#content"), {
        scale: 1, // Adjust scale according to your needs
        useCORS: true, // If you have images that are hosted cross-origin, this may be necessary
        logging: true, // Enables logging for debugging purposes
        onclone: (document) => {
            // Hide the sidebar in the cloned document before rendering the canvas
            document.getElementById('sidebar').style.display = 'none';
        }
    }).then(canvas => {
        var imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a PDF object with jsPDF
        var pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: [canvas.width, canvas.height]
        });

        // Add the captured image to the PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        
        // Save the PDF
        pdf.save(filename);
    }).catch((e) => {
        console.log(e); // Catch and log any errors
    });
}

// Example function to convert content to CSV format
function convertToCSV(content) {
    // Implement conversion based on your data structure
    return "Column1,Column2\nValue1,Value2";
}
