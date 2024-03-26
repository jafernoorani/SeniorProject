// Sample data for the Chart.js chart
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Dataset 1',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

// Configuration for the Chart.js chart
const config = {
  type: 'line',
  data: data,
  options: {}
};

// Initialize the Chart.js chart
const myChart = new Chart(
  document.getElementById('myChart'),
  config
);
