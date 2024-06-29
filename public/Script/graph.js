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
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0," + String(255) + "0.1)",
          data: [],
        },
      ],
    },
  });
}

function updChart() {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      const ids = data.map((row) => row.time_stamp);
      const sensorValues = data.map((row) => parseFloat(row.sensor_value));

      // Update the chart with new data
      chart.data.labels = ids;
      chart.data.datasets[0].data = sensorValues;
      chart.update();

      // Set point color based on sensor value
      const pointColor = sensorValues.map((value, index) =>
        index === 0
          ? "rgba(0, 0, 0, 1)"
          : index === sensorValues.length - 1
          ? "rgba(0, 0, 0, 1)" // Set last point color to black
          : value < 800
          ? "rgba(255, 0, 0, 1)"
          : value > 3200
          ? "rgba(255, 255, 0, 1)"
          : "rgba(0, 255, 0, 1)"
      );
      chart.data.datasets[0].borderColor = "rgba(0, 0, 255, 0.1)";
      chart.data.datasets[0].backgroundColor = pointColor;
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function fullDataToTable() {
  fetch("/data")
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
  fetch("/data")
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

function downloadData() {
  fetch("/data")
    .then((response) => response.json())
    .then((data) => {
      // Convert data to CSV format
      // const csv = data.map((row) => Object.values(row).join(",")).join("\n");
      const csv = data
        .map((row) => {
          let time_stamp = row.time_stamp.slice(0, 19).replace("T", " ");
          const values = Object.values(row);
          values[2] = time_stamp;
          return values.join(",");
        })
        .join("\n");
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      link.download = "data.csv";

      // Trigger the download
      link.click();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// const csv = data
// .map((row) => {
//   let time_stamp = row.time_stamp.slice(0, 19).replace("T", " ");
//   const values = Object.values(row);
//   values[3] = time_stamp;
//   return values.join(",");
// })
// .join("\n");
