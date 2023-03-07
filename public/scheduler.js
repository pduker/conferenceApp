let numTimeslots = 0;
let schedule;

function convertTime(time){
    let splitTime = time.value.split(':'), hours, minutes, meridian;
    hours = splitTime[0];
    minutes = splitTime[1];
    if(hours > 12){
        meridian = 'pm';
        hours -= 12;
    }
    else if(hours == 0 || hours < 12){
        meridian = 'am';
    }
    else{
        meridian = 'pm';
    }
    return hours + ':' + minutes + ' ' + meridian;
}

async function createSession(session) {
    let res = await fetch('api/sessions', {
        method: 'POST',
        body: JSON.stringify(session),
        headers: {
            "Content-Type": 'application/json'
        }
    });
    const data = await res.json();
    return data;
}

//Adds session to appropriate accordian
//TODO: Convert Time to 12HR format
$("#create-timeslot").on(`click`, async ()=>{
    //sets day, time
    let accordionDay;
    
    let day = parseInt($("#sessionDay").val()); 
    //console.log(day + 1);
    let startTime = $("#sessionStart").val();
    let endTime = $("#sessionEnd").val();
    let sessionTime = startTime + " - " + endTime;
    
    let newSession = {
        "time": sessionTime,
        "DayId": day,
        "description": "TEMP DESC"
    }

    const sessionResp = await createSession(newSession);

    schedule[day - 1]['Sessions'].push(sessionResp);
    populateAccordionData();


    /*
    `<div class="col-2 card session-time">
    <div class="card-body">
      <h5 class="card-title">${sessionTime}</h5>
      <details class="papers-details">
        <summary>Papers</summary>
        <ul class="papers" id="materials-list-preview"></ul>
        </details>
        <button class="btn btn-primary test" id="button${day}${8}">Edit Session</button>
        </div>
    </div>`
    */
    
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
            if(session.Papers){
                for (let paper of session['Papers']){
                    accordionHTML += `<li>${paper['title']}</li>`
                }
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