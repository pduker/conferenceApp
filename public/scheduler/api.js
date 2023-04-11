async function deleteDay() {
  try {

      const res = await fetch(`api/days?dayId=${currentlySelectedDay.id}`, {
          method: 'DELETE'
      });

      if (res.ok){
          // day deleted successfully
          schedule = schedule.filter((day)=> {if (day.id !== currentlySelectedDay.id) return day})
          currentlySelectedDay = {}
      } else {
          console.error("Failed to delete day")
          throw new Error('Failed to delete day')
      }

      populateAccordionData()
      $("#editDayModal").modal('hide');
  } catch (err) {
      console.error(err)
  }
}

async function updateSessionDetails(title, start, end, description, chair, room) {

  const body = {
      id: currentlySelectedSession.id,
      start,
      end,
      title,
      description,
      chair,
      room
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
      currentlySelectedSession.chair = chair
      currentlySelectedSession.room = room
      currentlySelectedSession.end = end
      currentlySelectedSession.description = description
  } else {
      console.error("Failed to update session")
      throw new Error('Failed to update session details')
  }
}

async function updateDayDetails(weekday, date) {

  const body = {
      date,
      weekday,
      id: currentlySelectedDay.id
  };

  const res = await fetch('api/days', {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
          "Content-Type": 'application/json'
      }
  });
  
  if (res.ok) {
      currentlySelectedDay.weekday = weekday
      currentlySelectedDay.date = date
  } else {
      console.error("Failed to update day")
      throw new Error('Failed to update day details')
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