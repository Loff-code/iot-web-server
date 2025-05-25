const host = "";           // e.g. "//192.168.68.110" if needed

function sendFrequency(e) {
  e.preventDefault();
  const formData = new FormData(document.getElementById('frqForm'));
  fetch(host + '/frq_receiver', { method: 'POST', body: new URLSearchParams(formData) })
    .then(r => r.text()).then(console.log).catch(console.error);
}
document.getElementById('frqForm').addEventListener('submit', sendFrequency);

function sendRequest() {
  const formData = new FormData(document.getElementById('lightForm'));
  if (!formData.has('red')) formData.append('red', '0');
  if (!formData.has('yellow')) formData.append('yellow', '0');
  if (!formData.has('green')) formData.append('green', '0');
  fetch(host + '/light_receiver', { method: 'POST', body: new URLSearchParams(formData) })
    .then(r => r.text()).then(console.log).catch(console.error);
}

async function sendData(formData) {
  try {
    const response = await fetch(host + '/data_receiver', {
      method: 'POST',
      body: new URLSearchParams(formData)
    });
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error(error);
  }
}

async function createSine() {
  for (let i = 0; i < 100; i++) {
    const formData = new FormData();
    let value = (Math.cos(2 * Math.PI / 100 * i + Math.PI) + 1) * 2000;
    formData.append('sensor_data', value);
    formData.append('coolState', 'false');
    formData.append('time_stamp', '19:19:19');
    formData.append('date_stamp', '19/09/2021');
    await sendData(formData);
  }
}

function deleteData() { fetch('/data', { method: 'DELETE' }).then(slcDataToTable); }
