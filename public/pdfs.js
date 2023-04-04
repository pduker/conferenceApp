$('#savePDF').on('click', async function() {
  console.log(schedule)
  const res = await fetch('api/pdf', {
    method:  'POST',
    body: JSON.stringify(schedule), 
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.blob()).then( blob => {
    const file = window.URL.createObjectURL(blob);
    window.open(file);
  });
})