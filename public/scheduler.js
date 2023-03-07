let numTimeslots = 0;
const data = {
    "Monday": [
        {
            "time": "7:15am - 8:45am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "9:00am - 10:30am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "10:45am - 12:15pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "12:30pm - 2:00pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "2:15pm - 3:45pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "4:00pm - 5:30pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "7:30pm - 9:00pm",
            "papers": ["paper 1", "paper 2"]
        }
    ],
    "Tuesday": [
        {
            "time": "7:15am - 8:45am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "9:00am - 10:30am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "10:45am - 12:15pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "12:30pm - 2:00pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "2:15pm - 3:45pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "4:00pm - 5:30pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "7:30pm - 9:00pm",
            "papers": ["paper 1", "paper 2"]
        }
    ],
    "Wednesday": [
        {
            "time": "7:15am - 8:45am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "9:00am - 10:30am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "10:45am - 12:15pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "12:30pm - 2:00pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "2:15pm - 3:45pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "4:00pm - 5:30pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "7:30pm - 9:00pm",
            "papers": ["paper 1", "paper 2"]
        }
    ],
    "Thursday": [
        {
            "time": "7:15am - 8:45am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "9:00am - 10:30am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "10:45am - 12:15pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "12:30pm - 2:00pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "2:15pm - 3:45pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "4:00pm - 5:30pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "7:30pm - 9:00pm",
            "papers": ["paper 1", "paper 2"]
        }
    ],
    "Friday": [
        {
            "time": "7:15am - 8:45am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "9:00am - 10:30am",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "10:45am - 12:15pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "12:30pm - 2:00pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "2:15pm - 3:45pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "4:00pm - 5:30pm",
            "papers": ["paper 1", "paper 2"]
        },
        {
            "time": "7:30pm - 9:00pm",
            "papers": ["paper 1", "paper 2"]
        }
    ]
};


$("#create-timeslot").on(`click`, ()=>{
    
});


function populateAccordionData() {

    console.log(data);

    let accordionHTML = '';
    for (const [day, sessions] of Object.entries(data)) {
        accordionHTML += `<div class="accordion-item collapsed">
        <h2 class="accordion-header" id="heading${day}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${day}" id="collapseButton${day}"
            aria-expanded="true" aria-controls="collapse${day}">
            ${day}
          </button>
        </h2>

        <div id="collapse${day}" class="accordion-collapse collapse" aria-labelledby="heading${day}"
          data-bs-parent="#accordionMain">
          <div class="accordion-body">

            <div class="row">`;

        let index = 0;
        for (let session of sessions){
            accordionHTML += `<div class="col-2 card session-time">
            <div class="card-body">
              <h5 class="card-title">${session.time}</h5>
              <details class="papers-details">
                <summary>Papers</summary>
                <ul class="papers" id="materials-list-preview">`
            for (let paper of session.papers){
                accordionHTML += `<li>${paper}</li>`
            }

            accordionHTML += `</ul>
                </details>
                <button class="btn btn-primary test" id="button${day}${index}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit Session</button>
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
 * generates the listeners to the buttons to capture what session the button was pressed to change the modal
 */
function attachListener(){
    for (const [day, sessions] of Object.entries(data)) {
        let listenerIndex = 0;
        for (let session of sessions){
            $("#button" + day + listenerIndex).on("click", function(){
                $("#exampleModalLabel").html("" + day + " " + session.time);
            });
            listenerIndex = listenerIndex + 1;
        }
    }
}

$("#Search-Sessions").on("click", function(){
    alert("Minecraft");
})

$("#Save-Session").on("click", function(){
    alert("terraria");
})

populateAccordionData();
attachListener();