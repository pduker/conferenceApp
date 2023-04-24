function validateSessionModal(type) {
  const description = $(`#${type}SessionDescriptionInput`).val()
  const title = $(`#${type}SessionTitleInput`).val()
  const chair = $(`#${type}SessionChairInput`).val()
  const room = $(`#${type}SessionRoomInput`).val()
  const startTime = $(`#${type}SessionStartTime`).val()
  const endTime = $(`#${type}SessionEndTime`).val()
  const pattern = /^([01]\d|2[0-3]):?([0-5]\d)$/
  let day

  if (type === "create") {
      day = $("#createSessionDay").val();
  }

  let valid = true

  if (!isNotWhiteSpace(description)) {
      valid = false
      $(`#${type}SessionDescriptionInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionDescriptionInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(title)){
      valid = false
      $(`#${type}SessionTitleInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionTitleInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(chair)){
      valid = false
      $(`#${type}SessionChairInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionChairInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(room)){
      valid = false
      $(`#${type}SessionRoomInput`).addClass('is-invalid')
  } else {
      $(`#${type}SessionRoomInput`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(startTime) && !pattern.test(startTime)){
      valid = false
      $(`#${type}SessionStartTime`).addClass('is-invalid')
  } else {
      $(`#${type}SessionStartTime`).removeClass('is-invalid')
  }

  if (!isNotWhiteSpace(endTime) && !pattern.test(endTime)){
      valid = false
      $(`#${type}SessionEndTime`).addClass('is-invalid')
  } else {
      $(`#${type}SessionEndTime`).removeClass('is-invalid')
  }

  if (type === "create") {
      if (!isNotWhiteSpace(day) || day === 'Select Day'){
          valid = false
          $(`#${type}SessionDay`).addClass('is-invalid')
      } else {
          $(`#${type}SessionDay`).removeClass('is-invalid')
      }

      return valid
  } else {
      return valid
  }
}

function validateDayModal(type) {
  const weekday = $(`#${type}DayWeekday`).val()
  let originalDate = $(`#${type}DayDateInput`).val()
  let tempDate = originalDate.slice(0, 10).split('-');
  let date = tempDate[1] + '-' + tempDate[2] + '-' + tempDate[0];
  let valid = true

  if (!isNotWhiteSpace(weekday) || weekday === 'Select Weekday'){
      valid = false
      $(`#${type}DayWeekday`).addClass('is-invalid')
  } else {
      $(`#${type}DayWeekday`).removeClass('is-invalid')
  }


  if (!isNotWhiteSpace(originalDate)){
    valid = false
    $(`#${type}DayDateInput`).addClass('is-invalid')
  } else {
    if(!checkDate(date)){
        valid = false
        $(`#${type}DayDateInput`).addClass('is-invalid')
    }
    else{
        $(`#${type}DayDateInput`).removeClass('is-invalid')
    }
}

  return valid
}