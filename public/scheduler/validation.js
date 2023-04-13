function validateSessionModal(type) {
  const description = $(`#${type}SessionDescriptionInput`).val()
  const title = $(`#${type}SessionTitleInput`).val()
  const chair = $(`#${type}SessionChairInput`).val()
  const room = $(`#${type}SessionRoomInput`).val()
  const startTime = $(`#${type}SessionStartTime`).val()
  const endTime = $(`#${type}SessionEndTime`).val()
  const pattern = `?:[0][1-9]|1[0-2]):[0-5][0-9] [AP]M`
  let day

  if (type === "create") {
      day = $("#createSessionDay").val();
  }

  if (!isNotWhiteSpace(description)){
      $(`#${type}SessionDescriptionInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionDescriptionInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(title)){
      $(`#${type}SessionTitleInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionTitleInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(chair)){
      $(`#${type}SessionChairInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionChairInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(room)){
      $(`#${type}SessionRoomInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionRoomInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(startTime) && pattern.test(startTime)){
      $(`#${type}SessionStartTime`).addClass('is-invalid')
  } else {
      $(`#${type}SessionStartTime`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(endTime) && pattern.test(endTime)){
      $(`#${type}SessionEndTime`).addClass('is-invalid')
  } else {
      $(`#${type}SessionEndTime`).removeClass('is-invalid')
  }

  if (type === "create") {
      console.log(day)
      if (!isNotWhiteSpace(day) || day === 'Select Day'){
          console.log(day)
          $(`#${type}SessionDay`).addClass('is-invalid')
      } else {
          $(`#${type}SessionDay`).removeClass('is-invalid')
      }

      return isNotWhiteSpace(day) && isNotWhiteSpace(description) && isNotWhiteSpace(title) && isNotWhiteSpace(chair) && isNotWhiteSpace(room)
  } else {
      return isNotWhiteSpace(description) && isNotWhiteSpace(title) && isNotWhiteSpace(chair) && isNotWhiteSpace(room)
  }
}

function validateDayModal(type) {
  const weekday = $(`#${type}DayWeekday`).val()
  const date = $(`#${type}DayDateInput`).val()

  if (!isNotWhiteSpace(weekday) || weekday === 'Select Weekday'){
      $(`#${type}DayWeekday`).addClass('is-invalid')
  } else {
      $(`#${type}DayWeekday`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(date)){
      $(`#${type}DayDateInput`).addClass('is-invalid')
  } else {
      $(`#${type}DayDateInput`).removeClass('is-invalid')
  }

  return (isNotWhiteSpace(weekday) && weekday !== 'Select Weekday') && isNotWhiteSpace(date)
}