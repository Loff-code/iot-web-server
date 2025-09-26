const host = "";           // e.g. "//192.168.68.110" if needed

function sendFrequency(e) {
  e.preventDefault();
  const formData = new FormData(document.getElementById('frqForm'));
  fetch(host + '/api/devices/frq', { method: 'POST', body: new URLSearchParams(formData) })
    .then(r => r.text()).then(console.log).catch(console.error);
}
document.getElementById('frqForm').addEventListener('submit', sendFrequency);

function sendRequest() {
  const formData = new FormData(document.getElementById('lightForm'));
  if (!formData.has('red')) formData.append('red', '0');
  if (!formData.has('yellow')) formData.append('yellow', '0');
  if (!formData.has('green')) formData.append('green', '0');
  fetch(host + '/api/devices/light', { method: 'POST', body: new URLSearchParams(formData) })
    .then(r => r.text()).then(console.log).catch(console.error);
}

async function sendData(data) {
  try {
    const response = await fetch(host + '/api/sensors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error(error);
  }
}

async function createSine() {
  for (let i = 0; i < 100; i++) {
    const date = new Date();
    let value = (Math.cos(2 * Math.PI / 100 * i + Math.PI) + 1) * 2000;

    const data = {
      sensor_data: value,
      coolState: false,
      time_stamp: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      date_stamp: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    };

    await sendData(data);
  }
}


function deleteData() { fetch('/api/sensors', { method: 'DELETE' }).then(slcDataToTable); }
