$('#savePDF').on('click', async function() {
  console.log(schedule)
  const res = await fetch('api/pdf', {
    method:  'POST',
    body: JSON.stringify(schedule), 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const test = await res.text();
  console.log(test);
})