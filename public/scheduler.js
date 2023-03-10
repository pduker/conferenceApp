let numTimeslots = 0;
let schedule;
let allPapers;
let currentlySelectedSession = {}
let selectedPapers = []

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

async function getData() {
    schedule = await getSchedule()
    allPapers = await getAllPapers()
}

async function getSchedule() {
    const res = (await fetch('api/days', {method: 'GET'}));
    const data = await res.json();
    return data;
}

async function getAllPapers() {
    const res = (await fetch('api/papers', {method: 'GET'}));
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

        for (let session of day['Sessions']){
            accordionHTML += `<div class="col-2 card session-time">
            <div class="card-body">
              <h5 class="card-title">${session['time']}</h5>
              <details class="papers-details">
                <summary>Papers</summary>
                <ul class="papers" id="materials-list-preview">`
            if(session.Papers){
                for (let i = 0; i < session.Papers.length; i++){
                    accordionHTML += `<li>${session.Papers[i]['title']}</li>`
                }
            }
            accordionHTML += `</ul>
                </details>
                <button class="btn btn-primary test" id="edit-session-${session.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit Session</button>
                </div>
            </div>`
        }

        accordionHTML += `</div>
                </div>
            </div>
        </div>`;

    };

    $('#accordionMain').html(accordionHTML);
    $('#collapseButtonMonday').trigger('click');

    
    attachEditModalListeners()
}

function attachEditModalListeners(){
    for (const day of schedule) {
        for (const session of day.Sessions) {
            $(`#edit-session-${session.id}`).on("click", function() {
                $("#editSessionModalTitle").html(day.weekday + " " + session.time)
                $("#sessionTitleInput").val(session.time)
                $("#sessionDescriptionInput").val(session.description)
                
                selectedPapers = []
                currentlySelectedSession = session

                updateEditSessionModal(session.Papers)
                renderSelectablePapers(allPapers)
            });
        }
    }
}

async function saveSession() {
    const description = $('#sessionDescriptionInput').val()
    const title = $('#sessionTitleInput').val()

    for (const paper of selectedPapers){
        await assignPaperToSession(paper)
    }

    await updateSessionDetails(title, description)

    populateAccordionData()
}

function renderAuthors(authors) {
    let authorString = ""
    for (const author of authors) {
        authorString += `${author.name} `
    }

    return authorString
}

async function updateSessionDetails(title, description){

    const body = {
        id: currentlySelectedSession.id,
        time: title,
        description
    }

    let res = await fetch('api/sessions', {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": 'application/json'
        }
    });

    if (res.ok) {
        // Will update because it's pass by reference
        currentlySelectedSession.time = title,
        currentlySelectedSession.description = description
    } else {
        console.error("Failed to update session")
    }
}

async function assignPaperToSession(paper) {
    let data = {
        "id": paper.id,
        "SessionId": currentlySelectedSession.id
    }

    let res = await fetch('api/papers', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json'
        }
    });

    if (res.ok) {
        currentlySelectedSession.Papers.push(paper)
        updateEditSessionModal(currentlySelectedSession.Papers)
    } else {
        console.error('Failed to update the paper')
    }
}

function renderSelectablePapers(papers) {
    let paperListString = ""

    for (const paper of papers) {
        paperListString += `<a href="#" class="list-group-item list-group-item-action" id='paper-${paper.id}'>${paper.title}</a>`
    }

    $("#paperSelect").html(paperListString);

    for (const paper of papers){
        $(`#paper-${paper.id}`).on('click', ()=>{
           selectedPapers.push(paper)
           updateEditSessionModal(currentlySelectedSession.Papers)
        })
    }
}

function updateEditSessionModal(papers){
    let tempHTML = '';

    for (const paper of papers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=  
        `<div class="card paper-card">
            <div class="card-body">
                <h5 class="card-title">${paper.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
            </div>
        </div>`
    }

    for (const paper of selectedPapers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=  
        `<div class="card paper-card selected">
            <div class="card-body">
                <h5 class="card-title">${paper.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
            </div>
        </div>`
    }

    $("#insertPapers").html(tempHTML);
}

$("#searchSessionInput").on("input", function(event){
    let text = event.target.value
    let filteredPapers = allPapers.filter((a)=>{return a.title.includes(text)})
    renderSelectablePapers(filteredPapers)
} );

$("#saveSession").on("click", function(){
    saveSession()
})

getData().then(()=>{
    populateAccordionData()
});


