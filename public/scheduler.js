let numTimeslots = 0;
let schedule;

$("#create-timeslot").on(`click`, ()=>{
    
});

async function getSchedule() {
    const res = (await fetch('api/days', {method: 'GET'}));
    const data = await res.json();
    return data;
}

function populateAccordionData() {

    let accordionHTML = '';
    for (const day of schedule) {
        accordionHTML += `<div class="accordion-item collapsed">
        <h2 class="accordion-header" id="heading${day['weekday']}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${day['weekday']}" id="collapseButton${day['weekday']}"
            aria-expanded="true" aria-controls="collapse${day['weekday']}">
            ${day['weekday']}
          </button>
        </h2>

        <div id="collapse${day['weekday']}" class="accordion-collapse collapse" aria-labelledby="heading${day['weekday']}"
          data-bs-parent="#accordionMain">
          <div class="accordion-body">

            <div class="row">`;

        let index = 0;
        for (let session of day['Sessions']){
            accordionHTML += `<div class="col-2 card session-time">
            <div class="card-body">
              <h5 class="card-title">${session['time']}</h5>
              <details class="papers-details">
                <summary>Papers</summary>
                <ul class="papers" id="materials-list-preview">`
            for (let paper of session['Papers']){
                accordionHTML += `<li>${paper['title']}</li>`
            }

            accordionHTML += `</ul>
                </details>
                <button class="btn btn-primary test" id="button${day['weekday']}${index}">Edit Session</button>
                </div>
            </div>`

            index = index + 1;
        }

        accordionHTML += `</div>
                </div>
            </div>
        </div>`;

    };

    $('#accordionMain').html(accordionHTML);
    $('#collapseButtonMonday').trigger('click');

}

getSchedule().then((data)=>{
    schedule = data;
    populateAccordionData();
});