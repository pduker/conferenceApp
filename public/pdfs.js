$('#savePDF').on('click', async function() {
  if (!isScheduleEmpty()) {
    renderPDF();
  } else {
    alert('You must add days before exporting to PDF.');
  }
})

async function renderPDF() {
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
}

function isScheduleEmpty() {
  return !schedule.length
}