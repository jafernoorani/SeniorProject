document.addEventListener('DOMContentLoaded', function () {
    var exportBtn = document.getElementById('exportBtn');

    // Ensure the button exists before adding event listener
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            var date = new Date();
            var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var filename = "Blood_Sugar_" + dateString + ".txt";

            var content = "This is a placeholder for blood sugar data.";

            // Create a blob with the content
            var blob = new Blob([content], { type: 'text/plain' });

            // Create an invisible link
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.style.display = 'none';

            // Set the link's href to point to the Blob and set the download attribute
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            // Programmatically click the link to trigger the download
            link.click();

            // Clean up by removing the link
            document.body.removeChild(link);
        });
    } else {
        console.error('Export button not found.');
    }
});
