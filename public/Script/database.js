  const host="";           // e.g. "//192.168.68.110" if needed

    function sendFrequency(e){
      e.preventDefault();
      const formData=new FormData(document.getElementById('frqForm'));
      fetch(host+'/frq_receiver',{method:'POST',body:new URLSearchParams(formData)})
        .then(r=>r.text()).then(console.log).catch(console.error);
    }
    document.getElementById('frqForm').addEventListener('submit',sendFrequency);

    function sendRequest(){
      const formData=new FormData(document.getElementById('lightForm'));
      if(!formData.has('red'))   formData.append('red','0');
      if(!formData.has('yellow'))formData.append('yellow','0');
      if(!formData.has('green')) formData.append('green','0');
      fetch(host+'/light_receiver',{method:'POST',body:new URLSearchParams(formData)})
        .then(r=>r.text()).then(console.log).catch(console.error);
    }

    function deleteData(){ fetch('/data',{method:'DELETE'}).then(slcDataToTable); }
