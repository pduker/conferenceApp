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
                <button class="btn btn-primary test" id="button${day['weekday']}${index}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit Session</button>
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

/**
 * takes the data and save it
 */
function saveSession(){

}

/**
 * it hits the route to get all of the paper that fit the search
 */
function searchPapers(){
    let tempInput = $("#Search-Session-Input").val();
    let tempPapers = 0;

    updatePaperList()
}

function renderSelectedPapers() {

}

function renderAuthors(authors) {
    let authorString = ""
    for (const author of authors) {
        authorString += `${author.name} `
    }

    return authorString
}

function renderSelectablePapers(papers) {
    let paperListString = ""

    for (const paper of papers) {
        paperListString += `<a href="#" class="list-group-item list-group-item-action">${paper.title}</a>`
    }

    return paperListString
}

/**
 * parse the data from all of the papers and inserts it into the modal
 */
function populateModal(papers){
    let tempHTML = '';

    const selectionPapers = renderSelectablePapers(papers)

    for (const paper of papers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=  
        `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${paper.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
            </div>
        </div>`
    }

    $("#insertPapers").html(tempHTML);
    $("#paperSelect").html(selectionPapers)
}

/**
 * generates the listeners to the buttons to capture what session the button was pressed to change the modal
 */
function attachListener(){
    for (const day of schedule) {
        let listenerIndex = 0;
        for (const session of day.Sessions) {
            $("#button" + day.weekday + listenerIndex).on("click", function() {
                $("#exampleModalLabel").html(day.weekday + " " + session.time);
                populateModal(session.Papers)
            });
            listenerIndex += 1
        }
    }
}

$("#Search-Sessions").on("click", function(e){
    e.preventDefault();
    SearchPapers();
})

$("#Save-Session").on("click", function(){
    saveSession();
})

getSchedule().then((data)=>{
    schedule = data;
    populateAccordionData();
    attachListener()
});
