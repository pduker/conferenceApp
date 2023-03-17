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

function isNotWhiteSpace(text) {
    let hasEverything = /\S/.test(text) && isNotUndefinedOrNull(text)
    if (typeof text === "object") {
        if (text.size === 0) {
            hasEverything = false;
        }
    }
    return hasEverything;
}

function isNotUndefinedOrNull(text) {
    return text !== undefined && text !== null
}

function convertTo12HourString (time) {
    // Set some arbitrary start date, the day does not matter only the time does and so we do this to get the time helper functions
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString('en-US', { timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'} )
}

function convertTo24HourString (time) {
    const splitTime = time.split(" ") // get the 10:00 and PM of "10:00 PM"
    const hoursAndMinutes = splitTime[0].split(":") // get the 10 and 00 of 10:00
    const hours = parseInt(hoursAndMinutes[0]) // convert hours to a number (for offsets)
    const minutes = hoursAndMinutes[1] // get the minutes (still a string since we don't need to offset this)

    if (splitTime[1] === "PM") {
        let final

        if (hours === 12) {
            final = `${hours}:${minutes}`
        } else {
            final = `${hours + 12}:${minutes}`
        }
        
        return final
    } else {
        return `0${hours}:${minutes}` // Needs to be in full 24HR format still so we have a leading 0
    }
}

async function getData() {
    schedule = await getSchedule()
    allPapers = await getAllPapers()
}

async function getSchedule() {
    const res = (await fetch('api/days', { method: 'GET' }));
    const data = await res.json();
    return data;
}

async function getAllPapers() {
    const res = (await fetch('api/papers', { method: 'GET' }));
    const data = await res.json();
    return data;
}

function populateAccordionData() {

    let accordionHTML = '';

    // Show warning if there are no days scheduled
    if (schedule.length === 0) {
        accordionHTML += `
        <div class='row'>
            <div class='col-2'></div>
            <div class='col-8'>
                <div class="alert alert-warning" role="alert">
                    <div class="row d-flex">
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-triangle-exclamation fa-3x"></i>
                        </div>
                        <div class="col-10 d-flex justify-content-start align-items-center">
                            No days appear to have been created yet. Please create some to get started scheduling!
                        </div>
                    </div>
                </div>
            </div>
            <div class='col-2'></div>
        </div>
        `
    } else {
        for (const day of schedule) {
            accordionHTML += `<div class="accordion-item collapsed">
            <h2 class="accordion-header" id="heading${day['weekday']}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${day['weekday']}" id="collapseButton${day['weekday']}"
                aria-expanded="true" aria-controls="collapse${day['weekday']}">
                ${day['weekday']} | ${day['date']}
            </button>
            </h2>

            <div id="collapse${day['weekday']}" class="accordion-collapse collapse" aria-labelledby="heading${day['weekday']}"
            data-bs-parent="#accordionMain">
            <div class="accordion-body">

                <div class="row">`;

            // Show warning if there are no sessions scheduled
            if (day['Sessions']?.length === 0){
                accordionHTML += `
                <div class='row'>
                    <div class='col-2'></div>
                    <div class='col-8'>
                        <div class="alert alert-warning" role="alert">
                            <div class="row d-flex">
                                <div class="col-2 d-flex justify-content-center align-items-center">
                                    <i class="fa-solid fa-triangle-exclamation fa-3x"></i>
                                </div>
                                <div class="col-10 d-flex justify-content-start align-items-center">
                                    No sessions appear to have been created for this day yet. Please create some.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-2'></div>
                </div>`
            } else {
                for (let session of day['Sessions']) {

                    let shortenedDescr = session.description

                    if (shortenedDescr.length >= 40) {
                        shortenedDescr = shortenedDescr.substring(0, 40) + '...'
                    }

                    accordionHTML += `<div class="col-3 card session-time">
                    <div class="card-body">
                    <h5 class="card-title">${session.title} | ${session.start} - ${session.end}</h5>
                    <p class="text-muted mb-0">${shortenedDescr}</p>
                    <details class="papers-details">
                        <summary>Papers</summary>
                        <ul class="papers" id="materials-list-preview">`
                    if (session.Papers) {
                        for (let i = 0; i < session.Papers.length; i++) {
                            accordionHTML += `<li>${session.Papers[i].title}</li>`
                        }
                    }
                    accordionHTML += `</ul>
                        </details>
                        <button class="btn btn-primary test" id="edit-session-${session.id}" data-bs-toggle="modal" data-bs-target="#editSessionModal">Edit Session</button>
                        </div>
                    </div>`
                }
            }

            accordionHTML += `</div>
                    </div>
                </div>
            </div>`;

        };
    }

    $('#accordionMain').html(accordionHTML);
    $('#collapseButtonMonday').trigger('click');


    attachEditModalListeners()
}

function attachEditModalListeners() {
    for (const day of schedule) {
        for (const session of day.Sessions) {
            $(`#edit-session-${session.id}`).on("click", function () {
                $('#sessionTitleInput').removeClass('is-invalid')
                $('#sessionDescriptionInput').removeClass('is-invalid')

                $("#editSessionModalTitle").html(day.weekday + " " + session.title)
                $("#sessionTitleInput").val(session.title)
                $("#sessionDescriptionInput").val(session.description)
                $("#sessionEditStartTimeInput").val(convertTo24HourString(session.start))
                $("#sessionEditEndTimeInput").val(convertTo24HourString(session.end))

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

function validateEditSessionModal() {
    const description = $('#sessionDescriptionInput').val()
    const title = $('#sessionTitleInput').val()

    if (!isNotWhiteSpace(description)){
        $('#sessionDescriptionInput').addClass('is-invalid')
    } else {
        $('#sessionDescriptionInput').removeClass('is-invalid')
    }

    if (!isNotWhiteSpace(title)){
        $('#sessionTitleInput').addClass('is-invalid')
    } else {
        $('#sessionTitleInput').removeClass('is-invalid')
    }

    return isNotWhiteSpace(description) && isNotWhiteSpace(title)
}

function validateCreateDayModal() {
    const weekday = $("#createDayWeekday").val()
    const date = $("#createDayDateInput").val()

    if (!isNotWhiteSpace(weekday) || weekday === 'Select Weekday'){
        $('#createDayWeekday').addClass('is-invalid')
    } else {
        $('#createDayWeekday').removeClass('is-invalid')
    }

    if (!isNotWhiteSpace(date)){
        $('#createDayDateInput').addClass('is-invalid')
    } else {
        $('#createDayDateInput').removeClass('is-invalid')
    }

    return (isNotWhiteSpace(weekday) && weekday !== 'Select Weekday') && isNotWhiteSpace(date)
}

async function createSession () {
    const rawDay = $("#sessionDay").val(); 
    const startTime = convertTo12HourString($("#sessionStart").val())
    const endTime = convertTo12HourString($("#sessionEnd").val())
    const title = $("#createSessionTitleInput").val()
    const description = $("#createSessionDescriptionInput").val()

    const dayIdAndIndex = rawDay.split("-")
    
    const body = {
        DayId: parseInt(dayIdAndIndex[0]),
        start: startTime,
        end: endTime,
        description,
        title
    }

    const res = await fetch('api/sessions', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    const newSession = await res.json();

    newSession.Papers = []

    schedule[dayIdAndIndex[1]]['Sessions'].push(newSession);

    populateAccordionData();
}


async function createDay () {

    if (!validateCreateDayModal()) return;

    const weekday = $("#createDayWeekday").val();
    const date = $("#createDayDateInput").val();

    const body = {
        date,
        weekday
    };

    const res = await fetch('api/days', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": 'application/json'
        }
    });
    const newDay = await res.json();

    newDay.Sessions = [];
    schedule.push(newDay);
    populateAccordionData();
    $("#createDayModal").modal('hide');
}

async function saveSession() {
    try {

        if (!validateEditSessionModal()) return;

        const description = $('#sessionDescriptionInput').val()
        const title = $('#sessionTitleInput').val()
        const start = convertTo12HourString($('#sessionEditStartTimeInput').val())
        const end = convertTo12HourString($('#sessionEditEndTimeInput').val())

        for (const paper of selectedPapers) {
            await assignPaperToSession(paper)
        }

        for (const paper of removedPapers) {
            await unassignPaperFromSession(paper)
        }

        await updateSessionDetails(title, start, end, description)

        currentlySelectedSession.Papers = currentlySelectedSessionPapers

        populateAccordionData()
        $("#editSessionModal").modal('hide');
    } catch (err) {
        console.error(err)
    }
}

function renderAuthors(authors) {
    let authorString = ""

    authorString += `${authors[0].name}`

    for (let i = 1; i < authors.length; i++) {
        authorString += `, ${authors[i].name}`
    }

    return authorString
}

async function updateSessionDetails(title, start, end, description) {

    const body = {
        id: currentlySelectedSession.id,
        start,
        end,
        title,
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
        currentlySelectedSession.title = title
        currentlySelectedSession.start = start
        currentlySelectedSession.end = end
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
        paperListString += `<a href="#" class="list-group-item list-group-item-action" id='paper-${paper.id}'><i class="fa-solid fa-square-plus pr-4"></i> ${paper.title}</a>`
    }

    $("#paperSelect").html(paperListString);

    for (const paper of papers) {
        $(`#paper-${paper.id}`).on('click', () => {
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

function updateCreateSessionModal() {
    let optionsHTML = '<option selected>Select Day</option>'

    for (let i = 0; i < schedule.length; i++) {
        const day = schedule[i]
        optionsHTML += `<option value="${day.id}-${i}">${day.weekday}</option>`
    }

    $("#sessionDay").html(optionsHTML)
}

function updateEditSessionModal(papers) {
    let tempHTML = '';

    for (const paper of papers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=
            `<div class="card paper-card">
            <div class='card-button h-100' id='paper-card-${paper.id}'>
                <div class="card-body">
                    <div class="row d-flex">
                        <div class="col-10 d-flex">
                            <h5 class="card-title">${paper.title}</h5>
                        </div>
                        <div class="col-2 d-flex justify-content-end">
                            <i class="fa-solid fa-x"></i>
                        </div>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
                </div>
            </div>
        </div>`
    }

    for (const paper of selectedPapers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=
            `<div class="card paper-card selected">
            <div class='card-button h-100' id='paper-card-selected-${paper.id}'>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-10">
                            <h5 class="card-title">${paper.title}</h5>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-end">
                            <i class="fa-solid fa-x"></i>
                        </div>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${authors}</h6>
                </div>
            </div>
        </div>`
    }

    $("#insertPapers").html(tempHTML);

    for (const paper of papers) {
        $(`#paper-card-${paper.id}`).on('click', function (event) {
            event.stopPropagation()
            removeSelectedPaperFromList(paper)
        })
    }

    for (const paper of selectedPapers) {
        $(`#paper-card-selected-${paper.id}`).on('click', function (event) {
            event.stopPropagation()
            removeSelectedPaperFromList(paper)
        })
    }


}


$("#saveCreatedSession").on(`click`, function () {
    createSession()
})

$("#saveCreatedDay").on(`click`, function () {
    createDay()
})

$('#createDayBtn').on('click', function() {
    // Clear fields and remove invalid validation
    $('#createDayWeekday')[0].selectedIndex = 0
    $('#createDayDateInput').val('')
    $('#createDayWeekday').removeClass('is-invalid')
    $('#createDayDateInput').removeClass('is-invalid')
})

$("#searchSessionInput").on("input", function (event) {
    let text = event.target.value
    let filteredPapers = allPapers.filter((a) => { return a.title.includes(text) })
    renderSelectablePapers(filteredPapers)
});

$("#saveSession").on("click", function () {
    saveSession()
})

getData().then(() => {
    updateCreateSessionModal()
    populateAccordionData()
});


