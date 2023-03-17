const timeSlots = [
        {"time": "7:15am - 8:45am"},
        {"time": "9:00am - 10:30am"},
        {"time": "10:45am - 12:15pm"},
        {"time": "12:30pm - 2:00pm"},
        {"time": "2:15pm - 3:45pm"},
        {"time": "4:00pm - 5:30pm"},
        {"time": "7:30pm - 9:00pm"}
];

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

async function PopulateDatabase(){
    let currentDate = new Date().toJSON().slice(0, 10).split('-');
    let currentDay = new Date().getDay();

    for (let temp = 0; temp < 5; temp++) {
        let tempDay = determineDay(currentDay);
        let tempDate = currentDate[1] + '-' + currentDate[2] + '-' + currentDate[0];
        let newDay = {
            "weekday": tempDay,
            "date" : tempDate
        }
        currentDate[2]++;
        currentDay++;
        currentDay = currentDay%7;
        let dayID = await createDay(newDay);
        for (const sessions of Object.entries(timeSlots)){
            let tempTime = sessions.time.split('-');
            let newSession = {
                "title": tempDay,
                "start":tempTime[0],
                "end": tempTime[1],
                "description": "TEMP DESC",
                "DayId": dayID.id
            }
            await createSession(newSession);
        }
    }
}
