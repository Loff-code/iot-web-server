initChart();
updChart();
setInterval(updChart, 1000);
// slcDataToTable();
// setInterval(slcDataToTable, 1000);

function initChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  window.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Sensor Values",
          borderColor: function (context) {
            const value = context.raw || 0;
            if (value < 1500) return "red";
            if (value < 2500) return "yellow";
            return "lime";
          },
          borderWidth: 2,
          pointRadius: 2,
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    },
  });
}
function updChart() {
  fetch("/api/sensors/24h")
    .then((response) => response.json())
    .then((data) => {
      const perMinuteLabels = data.perMinute.map(d => d.minute || d.timestamp || d.label);
      const perMinuteValues = data.perMinute.map(d => parseFloat(d.avg_value));

      const lastHourLabels = data.lastHour.map(d => d.timestamp);
      const lastHourValues = data.lastHour.map(d => parseFloat(d.value));

      const labels = [...perMinuteLabels, ...lastHourLabels];
      const values = [...perMinuteValues, ...lastHourValues];

      chart.data.labels = labels;
      chart.data.datasets[0].data = values;

      const pointColor = values.map((value, index) =>
        index === 0
          ? "rgba(0, 0, 0, 1)"
          : index === values.length - 1
            ? "rgba(0, 0, 0, 1)"
            : value < 800
              ? "rgba(255, 0, 0, 1)"
              : value > 3200
                ? "rgba(255, 255, 0, 1)"
                : "rgba(0, 255, 0, 1)"
      );

      chart.data.datasets[0].borderColor = "rgba(0, 0, 255, 0.1)";
      chart.data.datasets[0].backgroundColor = pointColor;

      chart.update();
    })
    .catch((error) => console.error("Error fetching data:", error));
}


function fullDataToTable() {
  fetch("/api/sensors")
    .then((response) => response.json())
    .then((data) => {
      const ids = data.map((row) => row.id);
      const sensorValues = data.map((row) => parseFloat(row.sensor_value));
      console.log(ids, sensorValues);

      const table = document.querySelector("table");
      for (let i = 0; i < ids.length; i++) {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const sensorValueCell = document.createElement("td");
        idCell.textContent = ids[i];
        sensorValueCell.textContent = sensorValues[i];
        row.appendChild(idCell);
        row.appendChild(sensorValueCell);
        table.appendChild(row);
      }
    });
}

function slcDataToTable() {
  fetch("/api/sensors")
    .then((response) => response.json())
    .then((data) => {
      const ids = data.map((row) => row.id);
      const sensorValues = data.map((row) => parseFloat(row.sensor_value));
      console.log(ids, sensorValues);

      const table = document.querySelector("table");
      for (let i = ids.length - 3; i < ids.length; i++) {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const sensorValueCell = document.createElement("td");
        idCell.textContent = ids[i];
        sensorValueCell.textContent = sensorValues[i];
        row.appendChild(idCell);
        row.appendChild(sensorValueCell);
        table.appendChild(row);
      }
    });
}



// https://stackoverflow.com/questions/75251617/convert-json-to-csv-and-download-file
function downloadJSONAsCSV(endpoint) {
  // Fetch JSON data from the endpoint
  fetch(endpoint)
    .then(response => response.json())
    .then(jsonData => {
      // Convert JSON data to CSV
      let csvData = jsonToCsv(jsonData);

      // Create a CSV file and allow the user to download it
      let blob = new Blob([csvData], { type: 'text/csv' });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'data.csv';
      document.body.appendChild(a);
      a.click();
    })
    .catch(error => console.error(error));
}

function jsonToCsv(jsonData) {
  let csv = '';

  // Get the headers
  let headers = Object.keys(jsonData[0]);
  csv += headers.join(',') + '\n';

  // Add the data
  jsonData.forEach(function (row) {
    let data = headers.map(header => row[header]).join(',');
    csv += data + '\n';
  });

  return csv;
}


