function addHeader(tableId, dataNames) {
  const table = document.getElementById(tableId);
  const header = table.createTHead();
  const row = header.insertRow(0);
  dataNames.forEach(txt => { const th = document.createElement('th'); th.innerText = txt; row.appendChild(th); });
}
function addRow(tableId, data, rowIndex) {
  const table = document.getElementById(tableId);
  const row = table.insertRow(-1);
  data.forEach((arr, i) => { const cell = row.insertCell(i); cell.innerText = arr[arr.length - rowIndex]; });
}
function slcDataToTable() {
  fetch('/data').then(r => r.json()).then(data => {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';
    const ids = data.map(r => r.id);
    const sensor = data.map(r => parseInt(r.sensor_value));
    const humidity = data.map(r => r.humidity + '%');
    const temperature = data.map(r => r.temperature + '°C');
    const time = data.map(r => r.time_stamp);
    const state = data.map(r => r.coolState);
    const date = data.map(r => r.date_stamp);
    const rowData = [ids, sensor, humidity, temperature, state, time, date];
    const headers = ['ID', 'Light level', 'Humidity', 'Temperature', 'Cool State', 'Time Stamp', 'Date'];
    addHeader('dataTable', headers);
    for (let i = 1; i <= 3; i++) addRow('dataTable', rowData, i);
  });
}
slcDataToTable();
setInterval(slcDataToTable, 1000);