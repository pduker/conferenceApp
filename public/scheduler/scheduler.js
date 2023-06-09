let numTimeslots = 0;
let schedule;
let allPapers;
const presetSessions = ["7:15 AM - 8:45 AM", "9:00 AM - 10:30 AM", "10:45 AM - 12:15 PM", "12:30 PM - 2:00 PM", "2:15 PM - 3:45 PM", "4:00 PM - 5:30 PM", "7:30 PM - 9:00 PM"];

// Reference to the actual currently selected day (WRITING TO THIS IS REFLECTED AS THE DATABASE RECORD)
let currentlySelectedDay = {}
// Reference to the actual currently selected session (WRITING TO THIS IS REFLECTED AS THE DATABASE RECORD)
let currentlySelectedSession = {}
// A shallow copy of the session papers to allow for on-the-fly editing before writing changes to sessions
let currentlySelectedSessionPapers = []
// The current Sortable instance of the drag and drop system for the selected session
let currentlySelectedSessionPapersSortable = null
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

function sortSessionsByTime(a, b){
    if (convertTo24HourString(a.start) === convertTo24HourString(b.start))
      return convertTo24HourString(a.end) < convertTo24HourString(b.end) ? -1 : 1
    else
      return convertTo24HourString(a.start) < convertTo24HourString(b.start) ? -1 : 1
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

    if (splitTime[1] === "PM" || splitTime[1] === "pm") {
        let final

        if (hours === 12) {
            final = `${hours}:${minutes}`
        } else {
            final = `${hours + 12}:${minutes}`
        }
        
        return final
    } else {
        //return `0${hours}:${minutes}` // Needs to be in full 24HR format still so we have a leading 0
        if (hours < 10 || hours.length < 2)
            return `0${hours}:${minutes}` // Needs to be in full 24HR format still so we have a leading 0
        else 
            return `${hours}:${minutes}`
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

  async function getDay(dayId){
    const res = await fetch(`api/days/${dayId}`, {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
            }
    });
    let data = await res.json();
    return data;
  }

function populateAccordionData() {

    let accordionHTML = '';
    // sort schedule days by date
    schedule = schedule?.sort((a, b) => new Date(a.date) < new Date(b.date) ? -1 : 1)

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
                            No days appear to have been created yet. You can create some with the "Create Day" button above.
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
            <h2 class="accordion-header" id="heading-day-${day.id}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-day-${day.id}" id="collapseButton-day-${day.id}"
                aria-expanded="true" aria-controls="collapse-day-${day.id}">
                ${day['weekday']} | ${day['date']}
            </button>
            </h2>

            <div id="collapse-day-${day.id}" class="accordion-collapse collapse" aria-labelledby="heading-day-${day.id}"
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
                                    No sessions have been created for this day yet. Create a new session to get started.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-2'></div>
                </div>`
            } else {

                const sortedSessions = day.Sessions.sort((a, b) => sortSessionsByTime(a, b))

                for (let session of sortedSessions) {

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

            // Day action button row
            accordionHTML += `
            <div class="row">
                <div class='col-auto p-1'>
                    <button class='btn btn-primary day-button' id='edit-day-${day.id}' data-bs-toggle="modal" data-bs-target="#editDayModal">
                        <i class="fa-solid fa-pencil mx-1"></i> Edit Day
                    </button>
                </div>
                <div class='col-auto p-1'>
                    <button class="btn btn-secondary" id='duplicate-day-${day.id}' data-bs-toggle="modal" data-bs-target="#editDayModal">
                        <i class="fa-solid fa-clone mx-1"></i> Clone Day
                    </button>
                </div>
            </div>
            `

            accordionHTML += `</div>
                    </div>
                </div>
            </div>`;
        };
    }

    $('#accordionMain').html(accordionHTML);
    if (schedule[0])
        $(`#collapseButton-day-${schedule[0].id}`).trigger('click');


    updateCreateSessionModal()
    attachEditModalListeners()
    attachEditDayListeners()
    attachDuplicateDayListeners()
}

function attachDuplicateDayListeners(){
    for (const day of schedule) {
        $(`#duplicate-day-${day.id}`).on("click" , function(){
            $(`#editDayModalLabel`).html("Duplicate Day");
            currentlySelectedDay = day
        })
    }
}

async function duplicateDay(weekDay, date){
    const selectedDay = await getDay(currentlySelectedDay.id);

    const body = {
        date: date,
        weekday: weekDay
    };

    const newDay = await createDay(body);
    let sessions = [];
    for(session of selectedDay.Sessions){
        let tempNewSession = {
            DayId: newDay.id,
            start:session.start,
            end: session.end,
            description: "TEMP DESC",
            title: "Temporary Title",
            chair: "Temporary Chair",
            room: "Temporary Room",
        }

        let newSession = await createSession(tempNewSession.DayId, tempNewSession.title, tempNewSession.start, tempNewSession.end, tempNewSession.description, tempNewSession.chair, tempNewSession.room);
        newSession.Papers = []
        sessions.push(newSession)
    }
    newDay.Sessions = sessions;
    schedule.push(newDay);
    populateAccordionData();
}

function attachEditDayListeners(){
    for (const day of schedule) {
        $(`#edit-day-${day.id}`).on("click", function () {
            currentlySelectedDay = day
            $('#editDayWeekday').val(day.weekday)
            $('#editDayDateInput').val(day.date)
            $(`#editDayModalLabel`).html("Edit Day");
        });
    }
}

function attachEditModalListeners() {
    for (const day of schedule) {
        for (const session of day.Sessions) {
            $(`#edit-session-${session.id}`).on("click", function () {
                $('#createSessionTitleInput').removeClass('is-invalid')
                $('#createSessionDescriptionInput').removeClass('is-invalid')

                $("#editSessionModalTitle").html(day.weekday + " " + session.title)
                $("#editSessionTitleInput").val(session.title)
                $("#editSessionDescriptionInput").val(session.description)
                $("#editSessionChairInput").val(session.chair)
                $("#editSessionRoomInput").val(session.room)
                $("#editSessionStartTime").val(convertTo24HourString(session.start))
                $("#editSessionEndTime").val(convertTo24HourString(session.end))

                selectedPapers = []
                removedPapers = []
                currentlySelectedSession = session
                currentlySelectedSessionPapers = [...session.Papers]

                updateEditSessionModal(currentlySelectedSessionPapers)
                renderSelectablePapers(allPapers)

                handleUpdatingSortableList()
            });
        }
    }
}

async function saveCreateSession () {
    try {

        if (!validateSessionModal('create')) { return }

        const rawDay = $("#createSessionDay").val(); 
        const startTime = convertTo12HourString($("#createSessionStartTime").val())
        const endTime = convertTo12HourString($("#createSessionEndTime").val())
        const title = $("#createSessionTitleInput").val()
        const description = $("#createSessionDescriptionInput").val()
        const chair = $('#createSessionChairInput').val()
        const room = $('#createSessionRoomInput').val()

        const dayIdAndIndex = rawDay.split("-")
        
        const body = {
            DayId: parseInt(dayIdAndIndex[0]),
            start: startTime,
            end: endTime,
            description,
            title,
            chair,
            room
        }

        const newSession = await createSession(body.DayId, body.title, body.start, body.end, body.description, body.title, body.room, body.chair);

        newSession.Papers = []

        schedule[dayIdAndIndex[1]]['Sessions'].push(newSession);

        populateAccordionData();
        $("#createSessionModal").modal('hide');
    } catch (err) {
        console.error(err)
    }
}

async function createDay(day){
    let res = await fetch(`api/days`, {
        method: 'POST',
        body: JSON.stringify(day),
        headers: {
            "Content-Type": 'application/json'
        }
    });
    return await res.json();
}

async function saveCreateDay () {

    if (!validateDayModal('create')) return;

    const weekday = $("#createDayWeekday").val();
    const tempDate = $("#createDayDateInput").val().slice(0, 10).split('-');
    let date = tempDate[1] + '-' + tempDate[2] + '-' + tempDate[0];

    const body = {
        date,
        weekday
    };

    const newDay = await createDay(body);
    console.log(newDay);

    let sessions = [];
    for (let i = 0; i < presetSessions.length; i++){
        const isChecked = $(`#presetSession${i}`)[0].checked;
        if (isChecked){
            const numSessions = $(`#presetSession${i}Num`)[0].value;
            for (let j = 0; j < numSessions; j++){
                const times = presetSessions[i].split(' - ');
                const session = {
                    DayId: newDay.id,
                    start: times[0],
                    end: times[1],
                    description: 'temporary description',
                    title: 'temporary title',
                    room: 'unassigned room',
                    chair: 'unassigned char',
                }

                const newSession = await createSession(session.DayId, session.title, session.start, session.end, session.description, session.chair, session.room);
                newSession.Papers = []
                sessions.push(newSession);
                
            }
        }
    }

    console.log(sessions);

    newDay.Sessions = sessions;
    schedule.push(newDay);
    populateAccordionData();
    $("#createDayModal").modal('hide');    
}

async function saveSession() {
    try {

        if (!validateSessionModal('edit')) return;

        const description = $('#editSessionDescriptionInput').val()
        const title = $('#editSessionTitleInput').val()
        const chair = $('#editSessionChairInput').val()
        const room = $('#editSessionRoomInput').val()
        const start = convertTo12HourString($('#editSessionStartTime').val())
        const end = convertTo12HourString($('#editSessionEndTime').val())

        for (const paper of selectedPapers) {
            await assignPaperToSession(paper)
        }

        for (const paper of removedPapers) {
            await unassignPaperFromSession(paper)
        }

        // Update paper order at DB layer
        let i = 1
        const orderArray = currentlySelectedSessionPapersSortable.toArray()
        for (const paperId of orderArray) {
            await updatePaperOrderInSession(paperId, i)
            i++
        }

        // Rebuild the sessionPapers to reflect this new order
        currentlySelectedSessionPapers.sort((a, b) => {
            return orderArray.indexOf(a.id.toString()) - orderArray.indexOf(b.id.toString())
        })

        await updateSessionDetails(title, start, end, description, chair, room)

        currentlySelectedSession.Papers = currentlySelectedSessionPapers

        populateAccordionData()
        $("#editSessionModal").modal('hide');
    } catch (err) {
        console.error(err)
    }
}

async function saveDay() {
    try {
        if (!validateDayModal('edit')) return;

        const weekday = $("#editDayWeekday").val();
        let tempDate = $("#editDayDateInput").val().slice(0, 10).split('-');
        let date = tempDate[1] + '-' + tempDate[2] + '-' + tempDate[0];

        let functionVersion = $("#editDayModalLabel")[0].innerHTML
        if(functionVersion === "Edit Day"){
            await updateDayDetails(weekday, date);
        } else{
            await duplicateDay(weekday, date);
        }

        populateAccordionData()
        $("#editDayModal").modal('hide');
        $(`#editDayModalLabel`).html("Edit Day");
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
    let optionsHTML = '<option selected value="">Select Day</option>'

    for (let i = 0; i < schedule.length; i++) {
        const day = schedule[i]
        optionsHTML += `<option value="${day.id}-${i}">${day.weekday} | ${day.date}</option>`
    }

    $("#createSessionDay").html(optionsHTML)
}

function updateEditSessionModal(papers) {
    let tempHTML = '';

    for (const paper of papers) {
        const authors = renderAuthors(paper.Authors)

        tempHTML +=
            `<div class="card paper-card" data-paperId='${paper.id}'>
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
            `<div class="card paper-card selected" data-paperId='${paper.id}'>
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
    saveCreateSession()
})

$("#saveCreatedDay").on(`click`, function () {
    saveCreateDay()
})

$("#createSessionBtn").on('click', function () {
    resetSessionModal('create') // make sure we reset validation on first display
})

$('#editSessionModalCancelBtn').on('click', function () {
    resetSessionModal('edit')
})

$('#editDayModalCancelBtn').on('click', function () {
    resetDayModal('edit')
})

$('#createDayBtn').on('click', function() { 
    resetDayModal('create')

    let modalHtml = $('#createDayModalBody').html();
    if (modalHtml.includes('Preset Session Times'))
        return;

    modalHtml += `<h5 class='mt-3'>Preset Session Times</h5>`
    
    let i = 0;
    for(session of presetSessions){
        modalHtml += `<div class="row p-2">
            <div class="col-auto">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="presetSession${i}">
                    <label class="form-check-label" for="flexCheckDefault">
                    ${session}
                    </label>
                </div>
            </div>

            <div class="col-auto">
                <input type="number" value='1' id='presetSession${i}Num' disabled>
            </div>
        </div>`;
        i++;
    }
    

    $('#createDayModalBody').html(modalHtml);

    for(let j = 0; j < i; j++){
        $(`#presetSession${j}`).on('change', (e)=>{
            const value = e.target.checked;
            $(`#presetSession${j}Num`).attr('disabled', !value);
        });
    }

    addCreateDayInputListener();
});

$("#searchSessionInput").on("input", function (event) {
    let text = event.target.value
    let filteredPapers = allPapers.filter((a) => { return a.title.includes(text) })
    renderSelectablePapers(filteredPapers)
});

$("#saveDay").on("click", function () {
    saveDay()
})

$("#deleteDay").on("click", function () {
    if (confirm('Are you sure you would like to delete this day? This will also delete all of the sessions under the day.'))
        deleteDay()
})

$("#saveSession").on("click", function () {
    saveSession()
})

$('#editDayDateInput').on('change', (event)=>{
    $('#editDayWeekday').val(getWeekday(event));
})

function addCreateDayInputListener() {
    $('#createDayDateInput').on('change', (event)=>{
        $('#createDayWeekday').val(getWeekday(event));
    });
}
addCreateDayInputListener();

function getWeekday(event){
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayOfWeek = (new Date(event.target.value)).getDay();
    return days[dayOfWeek];
}

getData().then(() => {
    populateAccordionData()
});

$("#deleteSession").on("click", async function () {
    let result = confirm("Are you sure you want to delete the session?")
    if(result){
        const res = await fetch(`api/sessions/${currentlySelectedSession.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json'
            }
        });
        for(const day of schedule){ 
            day.Sessions = day.Sessions.filter(function (sess) {
                return currentlySelectedSession.id !== sess.id
            })
        }
        populateAccordionData();
    }
});

$('#exportZip').on('click', function (e) {  
    downloadZip()
});