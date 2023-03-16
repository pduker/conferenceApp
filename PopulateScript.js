const data = {
    "Monday": [
        {
            "time": "7:15am - 8:45am"
        },
        {
            "time": "9:00am - 10:30am"
        },
        {
            "time": "10:45am - 12:15pm"
        },
        {
            "time": "12:30pm - 2:00pm"
        },
        {
            "time": "2:15pm - 3:45pm"
        },
        {
            "time": "4:00pm - 5:30pm"
        },
        {
            "time": "7:30pm - 9:00pm"
        }
    ],
    "Tuesday": [
        {
            "time": "7:15am - 8:45am"
        },
        {
            "time": "9:00am - 10:30am"
        },
        {
            "time": "10:45am - 12:15pm"
        },
        {
            "time": "12:30pm - 2:00pm"
        },
        {
            "time": "2:15pm - 3:45pm"
        },
        {
            "time": "4:00pm - 5:30pm"
        },
        {
            "time": "7:30pm - 9:00pm"
        }
    ],
    "Wednesday": [
        {
            "time": "7:15am - 8:45am"
        },
        {
            "time": "9:00am - 10:30am"
        },
        {
            "time": "10:45am - 12:15pm"
        },
        {
            "time": "12:30pm - 2:00pm"
        },
        {
            "time": "2:15pm - 3:45pm"
        },
        {
            "time": "4:00pm - 5:30pm"
        },
        {
            "time": "7:30pm - 9:00pm"
        }
    ],
    "Thursday": [
        {
            "time": "7:15am - 8:45am"
        },
        {
            "time": "9:00am - 10:30am"
        },
        {
            "time": "10:45am - 12:15pm"
        },
        {
            "time": "12:30pm - 2:00pm"
        },
        {
            "time": "2:15pm - 3:45pm"
        },
        {
            "time": "4:00pm - 5:30pm"
        },
        {
            "time": "7:30pm - 9:00pm"
        }
    ],
    "Friday": [
        {
            "time": "7:15am - 8:45am"
        },
        {
            "time": "9:00am - 10:30am"
        },
        {
            "time": "10:45am - 12:15pm"
        },
        {
            "time": "12:30pm - 2:00pm"
        },
        {
            "time": "2:15pm - 3:45pm"
        },
        {
            "time": "4:00pm - 5:30pm"
        },
        {
            "time": "7:30pm - 9:00pm"
        }
    ]
};

async function PopulateDatabase(){
    let currentDate = new Date().toJSON().slice(0, 10).split('-');
    let currentDay = new Date().getDay();

    for (const [day, sessions] of Object.entries(data)) {
        let tempDay = determineDay(currentDay);
        let tempDate = currentDate[1] + '-' + currentDate[2] + '-' + currentDate[3];
        let newDay = {
            "weekday": tempDay,
            "date" : tempDate
        }
        currentDate[2]++;
        currentDay++;
        currentDay = currentDay%6;
        let dayID = await createDay(newDay);
        for (let session of sessions){
            let newSession = {
                "time": session.time,
                "DayId": dayID,
                "description": "TEMP DESC"
            }
        
            await createSession(newSession);
        }
    }
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

async function createDay(day){
    let res = await fetch('api/days', {
        method: 'POST',
        body: JSON.stringify(day),
        headers: {
            "Content-Type": 'application/json'
        }
    });
    const data = await res.json();
    return data;
}

function determineDay(Tempday){
    let day;
    switch (Tempday) {
        case 0:
          day = "Sunday";
          break;
        case 1:
          day = "Monday";
          break;
        case 2:
           day = "Tuesday";
          break;
        case 3:
          day = "Wednesday";
          break;
        case 4:
          day = "Thursday";
          break;
        case 5:
          day = "Friday";
          break;
        case 6:
          day = "Saturday";
    }
    return(day);
}