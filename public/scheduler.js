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
function SearchPapers(){
    let tempInput = $("#Search-Session-Input").val();
    let tempPapers = 0;
    /**
     * fetch with the routes and assign to tempPapers
     */
    populateModal(tempPapers);
}

function renderAuthors(authors) {
    authorString = ""
    for (const author of authors) {
        authorString += `${author.name} `
    }

    return authorString
}

/**
 * parse the data from all of the papers and inserts it into the modal
 */
function populateModal(papers){
    let tempHTML = '';


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
