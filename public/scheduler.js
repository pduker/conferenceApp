let numTimeslots = 0;
let schedule;
let allPapers;

// Reference to the actual currently selected session (WRITING TO THIS IS REFLECTED AS THE DATABASE RECORD)
let currentlySelectedSession = {}
// A shallow copy of the session papers to allow for on-the-fly editing before writing changes to sessions
let currentlySelectedSessionPapers = []
// Papers to be selected when a session save occurs
let selectedPapers = []
// Papers to be removed when a session save occurs
let removedPapers = []

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
                removedPapers = []
                currentlySelectedSession = session
                currentlySelectedSessionPapers = [...session.Papers]

                updateEditSessionModal(currentlySelectedSessionPapers)
                renderSelectablePapers(allPapers)
            });
        }
    }
}

async function saveSession() {
    try {
        const description = $('#sessionDescriptionInput').val()
        const title = $('#sessionTitleInput').val()

        for (const paper of selectedPapers){
            await assignPaperToSession(paper)
        }

        for (const paper of removedPapers) {
            await unassignPaperFromSession(paper)
        }

        await updateSessionDetails(title, description)

        currentlySelectedSession.Papers = currentlySelectedSessionPapers

        populateAccordionData()
    } catch (err) {
        console.error(err)
    }
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
        throw new Error('Failed to update session details')
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
        currentlySelectedSessionPapers.push(paper)
    } else {
        throw new Error('Failed to assign paper to session due to non-200 response code')
    }
}

async function unassignPaperFromSession(paper) {
    let data = {
        "id": paper.id,
        "SessionId": null
    }

    let res = await fetch('api/papers', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('Received a non-200 response code while removing paper from session!')
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
           addSelectedPaperToList(paper)
           updateEditSessionModal(currentlySelectedSessionPapers)
        })
    }
}

function addSelectedPaperToList(paper) {
    // Check this paper has not already been added to our selected papers or existing papers
    for (const selectedPaper of selectedPapers.concat(currentlySelectedSessionPapers)) {
        if (selectedPaper.id === paper.id) {
            return
        }
    }

    removedPapers = removedPapers.filter(function (val) {
        return paper.id !== val.id
    })

    selectedPapers.push(paper)
}

function removeSelectedPaperFromList(paper) {
    selectedPapers = selectedPapers.filter(function (val) {
        return paper.id !== val.id
    })

    currentlySelectedSessionPapers = currentlySelectedSessionPapers.filter(function (val) {
        if (paper.id === val.id) {
            removedPapers.push(paper)
            return false
        } else {
            return true
        }
    })

    updateEditSessionModal(currentlySelectedSessionPapers)
}

function updateEditSessionModal(papers){
    let tempHTML = '';

    for (const paper of papers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=  
        `<div class="card paper-card">
            <div class='card-button' id='paper-card-${paper.id}'>
                <div class="card-body">
                    <h5 class="card-title">${paper.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
                </div>
            </div>
        </div>`
    }

    for (const paper of selectedPapers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=  
        `<div class="card paper-card selected">
            <div class='card-button' id='paper-card-selected-${paper.id}'>
                <div class="card-body">
                    <h5 class="card-title">${paper.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
                </div>
            </div>
        </div>`
    }

    $("#insertPapers").html(tempHTML);

    for (const paper of papers) {
        $(`#paper-card-${paper.id}`).on('click', function(event){
            event.stopPropagation()
            removeSelectedPaperFromList(paper)
        })
    }

    for (const paper of selectedPapers) {
        $(`#paper-card-selected-${paper.id}`).on('click', function(event){
            event.stopPropagation()
            removeSelectedPaperFromList(paper)
        })
    }
    
    
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


